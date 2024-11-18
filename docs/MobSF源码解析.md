---
title: MobSF源码解析
author:
createTime: 2024/11/18 15:46:31
permalink: /article/93f70mxb/
---
# 1、**apk静态分析**



## **1.1、重要解析代码文件目录**

静态分析的核心代码位于 mobsf/StaticAnalyzer/views 目录中，此处主要分析 APK 的静态扫描，因此解析的代码集中于 mobsf/StaticAnalyzer/views/android 中，

 

android/android_apis.py：常见的API规则库文件

android/android_manifest_desc.py：AndroidManifest规则库文件

android/android_rules.py：要检测的API列表文件

common/binary/lib_analysis.py：二进制分析文件

android/cert_analysis.py：证书分析文件

android/code_analysis.py：代码分析文件

android/converter.py：反编译Java/smali代码文件

android/db_interaction.py：数据库交互文件

android/dvm_permissions.py：权限规则库文件

android/find.py：查找源代码文件

android/generate_downloads.py：生成下载文件

android/icon_analysis.py：图标分析文件

android/java.py：Java代码展示文件

android/manifest_analysis.py：AndroidManifest分析文件

android/manifest_view.py：AndroidManifest视图文件

android/playstore.py：应用商店分析文件

android/smali.py：Smali代码展示文件

android/static_analyzer.py：静态分析流程文件（主文件）

android/strings.py：常量字符串获取文件

android/view_source.py：文件源查看

android/win_fixes.py：windows环境下会使用

comparer.py：静态分析结果比较文件

shared_func.py：静态分析共享文件

 

## **1.2、代码解析**

​	在通过uploadURL上传APK文件后，经过系统的处理后，系统自动使用StaticAnalyzerURL开始对APK文件进行静态分析。

​	可以在定义URL的地方，/MobSF/urls.py文件中，找到静态分析的地方。

代码如下：

 ```py
  # Static Analysis
         # Android
         re_path(r'^static_analyzer/(?P<checksum>[0-9a-f]{32})/$',
                 android_sa.static_analyzer,
                 name='static_analyzer'),
         # Remove this is version 4/5
         re_path(r'^source_code/$', source_tree.run, name='tree_view'),
         re_path(r'^view_file/$', view_source.run, name='view_source'),
         re_path(r'^find/$', find.run, name='find_files'),
         re_path(r'^manifest_view/(?P<checksum>[0-9a-f]{32})/$',
                 manifest_view.run,
                 name='manifest_view'),
 ```



​	跟入static_analyzer函数，进入静态分析主流程文件：

​		/StaticAnalyzer/views/android/static_analyzer.py文件中。

静态分析先进行判断上传的文件是APK包还是ZIP包还是其他包，对不同的包做对应的静态分析。此处分析对APK包的静态分析。

​	如果这个APP是之前扫描过的，则直接从数据库拉取数据，如果是第一次扫描，则从零开始做扫描。

代码如下：

 ```py
 if db_entry.exists() and rescan == '0':
   context = get_context_from_db_entry(db_entry)
 else:
   ......
 ```

​	开始静态分析后，首先提取APK文件名和APK路径，之后解压APK包，如果APK包解压失败则报错。

代码如下：

 ```py
  app_dic['files'] = unzip(
                     app_dic['app_path'], app_dic['app_dir'])
                 logger.info('APK Extracted')
                 if not app_dic['files']:
                     # Can't Analyze APK, bail out.
                     return print_n_send_error_response(
                         request,
                         'APK file is invalid or corrupt',
                         api)
                 app_dic['certz'] = get_hardcoded_cert_keystore(app_dic[
                                                                'files'])
 ```

​	在成功解压APK包之后，正式进入静态分析阶段。

### 1.2.1、AndroidManifest.xml安全分析

​	首先使用apktool2.9.3对APK进行解压，其使用的参数也是很明显的。

```py
try:
        manifest = None
        if (len(settings.APKTOOL_BINARY) > 0
                and is_file_exists(settings.APKTOOL_BINARY)):
            apktool_path = settings.APKTOOL_BINARY
        else:
            apktool_path = os.path.join(tools_dir, 'apktool_2.9.3.jar')
        output_dir = os.path.join(app_dir, 'apktool_out')
        args = [find_java_binary(),
                '-jar',
                '-Djdk.util.zip.disableZip64ExtraFieldValidation=true',
                apktool_path,
                '--match-original',
                '--frame-path',
                tempfile.gettempdir(),
                '-f', '-s', 'd',
                app_path,
                '-o',
                output_dir]
        manifest = os.path.join(output_dir, ANDROID_MANIFEST_FILE)
        if is_file_exists(manifest):
            # APKTool already created readable XML
            return manifest
        logger.info('Converting AXML to XML')
        subprocess.check_output(args)  # User input is MD5 and validated
    except Exception:
        logger.exception('Getting Manifest file')
    return manifest
```



​	之后读取AndroidManifest.xml文件，这里分为从解压的后目录中读取，和从源码目录中读取（如果上传的是ZIP包的话）。

​	读取到AndroidManifest.xml文件后，开始解析该xml文件，提取该xml文件中的数据，包括application、uses-permission、manifest、activity、service、provider……等所有参数。

 ```py
  		applications = mfxml.getElementsByTagName('application')
         permissions = mfxml.getElementsByTagName('uses-permission')
         permsdk23 = mfxml.getElementsByTagName('uses-permission-sdk-23')
         if permsdk23:
             permissions.extend(permsdk23)
         manifest = mfxml.getElementsByTagName('manifest')
         activities = mfxml.getElementsByTagName('activity')
         services = mfxml.getElementsByTagName('service')
         providers = mfxml.getElementsByTagName('provider')
         receivers = mfxml.getElementsByTagName('receiver')
         libs = mfxml.getElementsByTagName('uses-library')
         sdk = mfxml.getElementsByTagName('uses-sdk')
         categories = mfxml.getElementsByTagName('category')
 ```

​	这里还穿插着对可浏览的Activity做了一个单独的读取分析，因为可浏览的Activity参数是比较特殊的。

```py
 for cat in catg:
            if cat.getAttribute(f'{ns}:name') == 'android.intent.category.BROWSABLE':
                data_tag = node.getElementsByTagName('data')
                for data in data_tag:
```

​	之后，根据参数的特性，对权限进行了分析判断，将权限的安全分级为：`normal`、`dangerous`、`signature`、`signatureOrSystem`。（会获取所有权限）

​	对其他配置也做了安全分析，如：`android:allowBackup`、`android:debuggable`……等参数。（此处在mobsf.docx有描述）

​	对四大组件的配置也做了安全分析，将配置的安全分级为：`normal`、`dangerous`、`signature`、`signatureOrSystem`。

​	整个分析是基于`android:exported = "true"`和`android:exported != "false"`的，注意这里是不等于flase，也就是说要么明确写明导出为true，要么没有声明。因为这两种方式对应的分析方法不同，所以这里是分开处理的。如果`android:exported = "false"`的话，那就是是安全的。

​	另外，网络安全分析（对应数据库NETWORK_SECURITY），也在此处调用，以下进行详细分析：

首先是检查基础配置(base-config)

1. **检查`cleartextTrafficPermitted`属性**：
   - 首先，代码检查`b_cfg`（可能是一个包含配置文件元素的列表或类似结构）的第一个元素是否具有`cleartextTrafficPermitted`属性。
   - 如果该属性为`'true'`，则向`finds`列表添加一个字典，表示配置不安全地允许所有域名的明文流量，并将此发现标记为`HIGH`严重性。同时，更新`summary`字典中`HIGH`的计数。
   - 如果该属性为`'false'`，则向`finds`列表添加一个字典，表示配置不允许所有域名的明文流量，并将此发现标记为`SECURE`级别。同时，更新`summary`字典中`SECURE`的计数。
2. **检查`trust-anchors`和`certificates`**：
   - 接下来，代码检查`b_cfg`的第一个元素中是否存在`trust-anchors`元素。
   - 如果存在，它进一步查找这些`trust-anchors`中的`certificates`元素。
   - 对于每个`certificates`元素，它检查`src`属性（证书的源）和`overridePins`属性（是否覆盖证书固定）。
   - 如果`src`属性包含`'@raw/'`，表示配置信任捆绑的证书，并将此发现标记为`INFO`级别。
   - 如果`src`属性为`'system'`，表示配置信任系统证书，这可能被视为潜在的安全风险，因此将此发现标记为`WARNING`（警告）级别。
   - 如果`src`属性为`'user'`，表示配置信任用户安装的证书，这通常被认为是不安全的，因此将此发现标记为`HIGH`级别。
   - 如果`overridePins`属性为`'true'`，表示配置被配置为绕过证书固定，这同样被视为高风险，因此也将此发现标记为`HIGH`级别。

然后检查域配置（domain-config 。具体检查步骤与检查基础配置步骤一致），另外还有一点

1. **检查`pin-set` 和 `pin`**
   - 检查证书固定集（`pin-set`）设置了过期时间（`expiration`），则记录为`info`级别。这表示证书固定将在某个日期后失效
   - 如果没有设置过期时间，但配置了证书固定，这被视为安全的配置。然而，代码中将此情况归类为`secure`级别

最后检查调试配置（debug-overrides。若**存在调试覆盖且应用可调试**，则进行检查，具体检查步骤与检查基础配置步骤一致）



​	在分析的过程中，还分了小于Android 4.2和大于等于Android 4.2版本的情况。

------

**综述：整个`/StaticAnalyzer/views/android/manifest_analysis.py`代码是对AndroidManifest.xml做了一个全面的安全分析**

------

### 1.2.2、获取 app_name

​	主要分为2种，要么读取AndroidManifest.xml文件的 &lt;application>标签下的 android:label属性值。要么读取resvalues/stings.xml文件中的 appname 属性值。代码如下:

```python
def get_app_name_from_values_folder(values_dir):
    """Get all the files in values folder and checks them for app_name."""
    files = [f for f in os.listdir(values_dir) if
             (os.path.isfile(os.path.join(values_dir, f)))
             and (f.endswith('.xml'))]
    for f in files:
        # Look through each file, searching for app_name.
        app_name = get_app_name_from_file(os.path.join(values_dir, f))
        if app_name:
            return app_name  # we found an app_name, lets return it.
    return ''  # Didn't find app_name, returning empty string.


def get_app_name_from_file(file_path):
    """Looks for app_name in specific file."""
    with open(file_path, 'r', encoding='utf-8') as f:
        data = f.read()

    app_name_match = re.search(
        r'<string name=\"app_name\">(.{0,300})</string>',
        data)

    if (not app_name_match) or (len(app_name_match.group()) <= 0):
        # Did not find app_name in current file.
        return ''

    # Found app_name!
    return app_name_match.group(app_name_match.lastindex)
```



### 1.2.3、设置manifest连接

```py
# 设置manifest连接
app_dic['mani'] = ('../ManifestView/?md5='
                   + app_dic['md5']
                   + '&type=apk&bin=1')
# manifest_data是对AndroidManifest.xml文件的处理，1.2.1节已介绍
man_data_dic = manifest_data(app_dic['parsed_xml'])

# get_app_details获取APP详细数据
app_dic['playstore'] = get_app_details(
    man_data_dic['packagename'])

# manifest_analysis是对AndroidManifest.xml文件的处理，1.2.1节已介绍
man_an_dic = manifest_analysis(
    app_dic['parsed_xml'],
    man_data_dic)
bin_an_buff = []

# elf_analysis是二进制分析
bin_an_buff += elf_analysis(app_dic['app_dir'])

# res_analysis是二进制分析
bin_an_buff += res_analysis(app_dic['app_dir'])

# cert_info是对证书的分析
cert_dic = cert_info(
    app_dic['app_dir'],
    app_dic['app_file'])

# apkid_analysis是对apkid的分析
apkid_results = apkid_analysis(app_dic[
    'app_dir'], app_dic['app_path'], app_dic['app_name'])
    
# Trackers追踪检测
tracker = Trackers.Trackers(
    app_dic['app_dir'], app_dic['tools_dir'])
tracker_res = tracker.get_trackers()

# apk_2_java反编译为Java代码
apk_2_java(app_dic['app_path'], app_dic['app_dir'],
           app_dic['tools_dir'])

# dex_2_smali反编译为smali代码
dex_2_smali(app_dic['app_dir'], app_dic['tools_dir'])

# code_analysis代码分析
code_an_dic = code_analysis(
    app_dic['app_dir'],
    man_an_dic['permissons'],
    'apk')
```

### 1.2.4、跟入manifest_data/manifest_analysis

跟入后包括对AndroidManifest.xml的解析，回到/StaticAnalyzer/views/android/manifest_analysis.py文件中了，该文件的功能在`1.2.1、AndroidManifest.xml安全分析`小节中介绍过，主要对AndroidManifest.xml的处理，就不再介绍了。

清单分析分为normal、dangerous、signature、signatureOrSystem四个等级

### 1.2.5、跟入get_app_details

接下来是通过应用商店对APP的细节数据做一个读取，包括APP名字、评分、价格、下载URL……等待数据。跟入到/StaticAnalyzer/views/android/playstore.py文件中。

### 1.2.6、跟入elf_analysis/res_analysis

之后，进入二进制分析阶段，跟入到/StaticAnalyzer/views/android/binary_analysis.py文件中。

整个文件中的功能是对二进制文件做了分析处理。包括res、assets目录下的资源文件，lib下的.so文件等。

### 1.2.7、跟入cert_info**（此处对应报告的 **SIGNER CERTIFICATE **和 **CERTIFICATE ANALYSIS）

接下来是对证书做分析处理，跟入到/StaticAnalyzer/views/android/cert_analysis.py文件中。

这个文件代码一共有2个函数，因此，也只有2个功能。

`get_hardcoded_cert_keystore`该函数并不是跟进来的函数。该函数的功能是查找证书文件或密钥文件并返回。包括cer、pem、cert、crt、pub、key、pfx、p12和der证书文件，以及jks、bks密钥库文件。

`cert_info`该函数是跟进来的函数。该函数的功能是获取证书文件信息并对其进行分析。包括：**是否签名**；**是否使用v1、v2、v3、v4签名方案**；**X.509 Subject**；**签名算法**；**有效起止时间**；**出版方**；**出厂序号**；**使用的哈希算法**；**md5、sha1、sha256哈希值**；**公共key算法（unknown、rsa、dsa、ec）**；**位数（bit size）**；**指纹**；

分为三个等级` high`、`info`、`waring`，具体分级如下：

1. 该证书是否签名，是则为 `info` ，否为 `high` 
2. 是否使用 `v1签名方案` 并且 存在 最小 sdk （从清单文件或证书中获取）则为 `info`；如果使用 `v1或v2签名` 并且 最小SDK 小于8.1 则提升为 `waring`
3. 证书中是否存在 `CN=Android Debug`，是则为 `high`
4. 证书中是否使用 sha1 哈希算法，是则为 `info`，如果使用了 `SHA256_digest` ,则提升为 `waring`
5. 是否使用 md5 加密算法，是则为`high`。

### 1.2.8、跟入apkid_analysis (此处对应报告的 Malware Analysis | APKiD Analysis)

接下来是apkid分析梳理，跟入到/MalwareAnalyzer/views/apkid.py文件中。

对APKID进行的分析处理，其中背后的核心库在/venv/lib/python3.10/site-packages/apkid目录下，由于这个是安装时会自动下载的。

对apkid的分析处理并没有很复杂，具体流程如下：

1. 首先，检查是否启用了`APKID_ENABLED`设置，如果没有启用，则直接返回一个空字典。
2. 尝试导入`apkid`模块，如果导入失败，记录错误信息并返回一个空字典。
3. 检查指定的APK文件是否存在，如果不存在，记录错误信息并返回一个空字典。
4. 获取`apkid`的版本号，并从`apkid`模块中导入所需的类和函数。
5. 设置`APKiD`的运行选项，包括超时时间、是否输出详细信息、最大扫描大小以及是否递归扫描。
6. 创建一个输出格式化器，用于将扫描结果格式化为JSON格式。
7. 加载`APKiD`的规则，并创建一个扫描器对象。
8. 使用扫描器扫描指定的APK文件，并尝试获取扫描结果的JSON输出。
9. 如果`APKiD`的版本大于等于2.0.3，则调用`build_json_output`方法来获取JSON输出，否则调用`_build_json_output`方法。
10. 如果在尝试获取JSON输出时遇到`AttributeError`，则记录错误信息并返回一个空字典，这通常意味着`yara-python`依赖没有正确安装。
11. 最后，对扫描结果进行处理，移除文件名中的`!`字符，并将处理后的结果返回。

### 1.2.9、**跟入Trackers** (此处对应报告的 Reconnaissance | Trackers)

接下来是追踪检测。跟入到/MalwareAnalyzer/views/Trackers.py文件中。

对该文件中的所有函数功能一并讲解下：

`_update_tracker_db`函数的主要功能是更新跟踪检测数据库。

`_compile_signatures`函数的主要功能是编译与每个签名相关的正则表达式，以此加快跟踪器的检测速度。

`load_trackers_signatures`函数的主要功能是从官方数据库加载跟踪器签名。

`get_embedded_classes`函数的主要功能是从所有DEX文件中获取Java类的列表，这里使用的工具是baksmali。

`detect_trackers_in_list`函数的功能是根据上个函数提供的Java类列表，检测嵌入在其中的跟踪器，并返回嵌入的跟踪器列表。

`detect_trackers`函数的主要功能是检测嵌入的跟踪器，并返回嵌入的跟踪器列表。

`get_trackers`函数的主要功能是获取跟踪器。



### 1.2.10、**跟入apk_2_java/dex_2_smali**

现在跟入的是将APK反编译为Java代码的功能和将dex反编译为smali代码的功能。跟入到/StaticAnalyzer/views/android/converter.py文件中。

`dex_2_smali`函数是通过baksmali工具将dex反编译为smali代码。

其使用的参数如下：

```py
for dex_path in dexes:
    logger.info('Converting %s to Smali Code',
                filename_from_path(dex_path))
    if (len(settings.BACKSMALI_BINARY) > 0
            and is_file_exists(settings.BACKSMALI_BINARY)):
        bs_path = settings.BACKSMALI_BINARY
    else:
        bs_path = os.path.join(tools_dir, 'baksmali-2.3.4.jar')
    output = os.path.join(app_dir, 'smali_source/')
    smali = [
        settings.JAVA_BINARY,
        '-jar',
        bs_path,
        'd',
        dex_path,
        '-o',
        output,
    ]
```

`apk_2_java`函数是通过jadx工具将APK反编译为Java代码。

相关代码比较长，因为需要将参数的源头也写入。

代码如下：

```py
def apk_2_java(app_path, app_dir, tools_dir):
    """Run jadx."""
    try:
        logger.info('APK -> JAVA')
        args = []
        output = os.path.join(app_dir, 'java_source/')
        logger.info('Decompiling to Java with jadx')

        if os.path.exists(output):
            # ignore WinError3 in Windows
            shutil.rmtree(output, ignore_errors=True)

        if (len(settings.JADX_BINARY) > 0
                and is_file_exists(settings.JADX_BINARY)):
            jadx = settings.JADX_BINARY
        elif platform.system() == 'Windows':
            jadx = os.path.join(tools_dir, 'jadx/bin/jadx.bat')
        else:
            jadx = os.path.join(tools_dir, 'jadx/bin/jadx')
        # Set execute permission, if JADX is not executable
        if not os.access(jadx, os.X_OK):
            os.chmod(jadx, stat.S_IEXEC)
        args = [
            jadx,
            '-ds',
            output,
            '-q',
            '-r',
            '--show-bad-code',
            app_path,
        ]
        fnull = open(os.devnull, 'w')
        subprocess.run(args,
                       stdout=fnull,
                       stderr=subprocess.STDOUT,
                       timeout=settings.JADX_TIMEOUT)
    except subprocess.TimeoutExpired:
        logger.warning('Decompiling with jadx timed out')
    except Exception:
        logger.exception('Decompiling to JAVA')
```

### 1.2.11、跟入code_analysis

接下来是代码分析，跟入到/StaticAnalyzer/views/android/code_analysis.py文件中。

代码分析分为high、waring、info、secure、good、suppressed四个危险等级

核心代码如下：

```py
# 源码情况下的代码分析
relative_java_path = jfile_path.replace(java_src, '')
code_rule_matcher(
    code_findings,
    list(perms.keys()),
    dat,
    relative_java_path,
    code_rules)
# 使用API情况下的代码分析
api_rule_matcher(api_findings, list(perms.keys()),
                 dat, relative_java_path, api_rules)
# 通过URL或邮件提取结果
urls, urls_nf, emails_nf = url_n_email_extract(
    dat, relative_java_path)
```

### 1.2.12、获取字符串

回到/StaticAnalyzer/views/android/static_analyzer.py文件中。

接下来是获取APP的常量字符串。

代码如下：

```py
string_res = strings_jar(
    app_dic['app_file'],
    app_dic['app_dir'])
if string_res:
    app_dic['strings'] = string_res['strings']
    code_an_dic['urls_list'].extend(
        string_res['urls_list'])
    code_an_dic['urls'].extend(string_res['url_nf'])
    code_an_dic['emails'].extend(string_res['emails_nf'])
else:
    app_dic['strings'] = []
```



### 1.2.13、**跟入shared_func**

以上代码跟入后，发现均来到了mobsf\StaticAnalyzer\views\common\shared_func.py文件中。

这个文件的代码主要是对APP做静态分析的，包括APK、IPA、APPX等，因为将三者的静态分析共同的部分放在一起，因此文件名叫共享功能（shared_func.py）。

其中，生成哈希（`hash_gen`函数）、解压（`unzip`函数）、报告处理（`pdf`函数）

### 1.2.14、域提取和恶意识别（此处对应报告的Malwre Analysis）

首先查看设置中 `DOMAIN_MALWARE_SCAN` 是否为 `false`，是则直接返回，否为继续扫描，首先调用。

扫描流程如下：

- 根据给定的 `URLs` 获取域名列表，并存入到一个列表中；

- 如果列表非空则开始以下步骤：

​		update：更新恶意软件数据库和恶意流量数据库

​		malware_check：恶意软件检测，（从数据库中获取恶意软件，并将列表中的域名进行比对）

​		maltrail_check：恶意流量检测，同上

​		gelocation：获取域名地址

### 1.2.15、数据准备及入库

回到源头继续向后，接下来是数据入库前的检查以及数据存入数据库。

代码如下：

```py
# Firebase数据库检查
code_an_dic['firebase'] = firebase_analysis(
    list(set(code_an_dic['urls_list'])))

# 域名提取和恶意软件检查
logger.info(
    'Performing Malware Check on extracted Domains')
code_an_dic['domains'] = malware_check(
    list(set(code_an_dic['urls_list'])))

# 复制APP图标
copy_icon(app_dic['md5'], app_dic['icon_path'])
app_dic['zipped'] = 'apk'
```

其中`firebase_analysis`函数（/StaticAnalyzer/views/shared_func.py）于share_fun.py中

接下来就是把数据往数据库里面存放，这里跟入了`get_context_from_analysis`函数，来到了/StaticAnalyzer/views/android/db_interaction.py文件中。这个文件会将分析所得的数据写入到数据库中。以下为数据库的表结构：

| 字段名               | 类型    | 大小 | 描述                                                         |
| -------------------- | ------- | ---- | :----------------------------------------------------------- |
| FILE_NAME            | varchar | 260  | 文件名                                                       |
| APP_NAME             | varchar | 255  | app名                                                        |
| APP_TYPE             | varchar | 20   | app类型                                                      |
| SIZE                 | varchar | 50   | 文件大小                                                     |
| MD5                  | varchar | 32   | MD5哈希值                                                    |
| SHA1                 | varchar | 40   | SHA1哈希值                                                   |
| SHA256               | varchar | 64   | SHA256哈希值                                                 |
| PACKAGE_NAME         | text    |      | 包名                                                         |
| MAIN_ACTIVITY        | text    |      | 主活动                                                       |
| EXPORTED_ACTIVITIES  | text    |      | 可导出活动                                                   |
| BROWSABLE_ACTIVITIES | text    |      | 可浏览活动（**一种可以从浏览器启动的Activity**）             |
| ACTIVITIES           | text    |      | 所有活动集合                                                 |
| RECEIVERS            | text    |      | 所有接收器集合                                               |
| PROVIDERS            | text    |      | 所有提供器集合                                               |
| SERVICES             | text    |      | 所有服务集合                                                 |
| LIBRARIES            | text    |      |                                                              |
| TARGET_SDK           | varchar | 50   | 目标SDK                                                      |
| MAX_SDK              | varchar | 50   | 最大支持SDK                                                  |
| MIN_SDK              | varchar | 50   | 最小支持SDK                                                  |
| VERSION_NAME         | varchar | 100  | 版本名                                                       |
| VERSION_CODE         | varchar | 50   | 版本代码                                                     |
| ICON_PATH            | text    |      | 图标路径                                                     |
| PERMISSIONS          | text    |      | 权限（权限名、严重性、信息、描述）                           |
| MALWARE_PERMISSIONS  | text    |      | 恶意软件权限集合（上一个字段的权限名的集合）                 |
| CERTIFICATE_ANALYSIS | text    |      | 证书分析（签名信息、签名发现、签名摘要）对应报告签名证书和证书解析 |
| MANIFEST_ANALYSIS    | text    |      | 清单分析（规则、标题、严重性、描述）                         |
| BINARY_ANALYSIS      | text    |      | 二进制分析                                                   |
| FILE_ANALYSIS        | text    |      | 文件分析（描述、涉及文件）                                   |
| ANDROID_API          | text    |      | Android API（描述、危险性、涉及文件及代码行号）              |
| CODE_ANALYSIS        | text    |      | 代码分析（安卓规则id，涉及文件及代码行数，元数据（规则库中对应的cvss、cwe、owasp-mobile、masvs、ref、描述、等级）） |
| NIAP_ANALYSIS        | text    |      | NIAP 分析                                                    |
| PERMISSION_MAPPING   | text    |      | 权限（安卓规则id，涉及文件及代码行数）                       |
| URLS                 | text    |      | URL及所处文件                                                |
| DOMAINS              | text    |      | 域（域名、是否恶意、位置（ip、国家缩写、国家全称、州、城市、经纬度）、ofac |
| EMAILS               | text    |      | 邮箱地址及所处文件                                           |
| STRINGS              | text    |      | 字符串                                                       |
| FIREBASE_URLS        | text    |      | FireBase URL                                                 |
| FILES                | text    |      | 文件路径+文件名                                              |
| EXPORTED_COUNT       | text    |      | （可导出活动数、可导出服务数、可导出接收器数、可导出提供器数） |
| APKID                | text    |      | APKID 分析                                                   |
| QUARK                | text    |      | QUARK 分析                                                   |
| TRACKERS             | text    |      | 跟踪器（追踪器数量、总的追踪器数量、追踪器列表）             |
| PLAYSTORE_DETAILS    | text    |      | 应用商店分析                                                 |
| NETWORK_SECURITY     | text    |      | 网络安全分析（网络发现、网络总结）                           |
| SECRETS              | text    |      |                                                              |



# 2、ipa静态分析

## 2.1、重要解析代码文件目录

ios/app_transport_security.py 应用传输安全文件

ios/lib_analysis.py：二进制分析文件

ios/cert_analysis.py：证书分析文件

ios/code_analysis.py：代码分析文件

ios/db_interaction.py：数据库交互文件

ios/icon_analysis.py：图标分析文件

ios/file_analysis.py：文件分析文件

ios/appstore.py：应用商店分析文件

ios/static_analyzer.py：静态分析流程文件（主文件）

ios/strings.py：常量字符串获取文件

ios/view_source.py：文件源查看

comparer.py：静态分析结果比较文件

shared_func.py：静态分析共享文件



## 2.2、代码解析

​	忽略前置步骤，直接进入代码解析阶段，具体流程代码如下：

```py
				# 获取文件及文件位置
                all_files = ios_list_files(
                    app_dict['bin_dir'], app_dict['md5_hash'], True, 'ipa')
                # 二进制分析
                infoplist_dict = plist_analysis(app_dict['bin_dir'], False)
                app_dict['appstore'] = app_search(infoplist_dict.get('id'))
                app_dict['secrets'] = get_plist_secrets(
                    app_dict['bin_dir'])
                bin_dict = binary_analysis(
                    app_dict['bin_dir'],
                    app_dict['tools_dir'],
                    app_dict['app_dir'],
                    infoplist_dict.get('bin'))
                # 分析 dylibs（动态链接库） 和 frameworks（在iOS和MacOS中，Framework除了包含代码之外，还可能包含其他资源（如国际化字符串、GUI定义、多媒体文件等）
                lb = library_analysis(
                    app_dict['bin_dir'],
                    app_dict['md5_hash'],
                    'macho')
                bin_dict['dylib_analysis'] = lb['macho_analysis']
                bin_dict['framework_analysis'] = lb['framework_analysis']
                # 获取图标
                get_icon_from_ipa(
                    app_dict,
                    infoplist_dict.get('bin'))
                # Extract String metadata
                code_dict = get_strings_metadata(
                    app_dict,
                    bin_dict,
                    all_files,
                    lb['macho_strings'])

                # 域提取和恶意识别
                logger.info('Performing Malware Check on '
                            'extracted Domains')
                code_dict['domains'] = MalwareDomainCheck().scan(
                    code_dict['urls_list'])
                logger.info('Finished URL and Email Extraction')

                # 从域中提取跟踪器
                trk = Trackers.Trackers(
                    None, app_dict['tools_dir'])
                trackers = trk.get_trackers_domains_or_deps(
                    code_dict['domains'], [])

                code_dict['api'] = {}
                code_dict['code_anal'] = {}
                code_dict['firebase'] = firebase_analysis(
                    code_dict['urls_list'])
                code_dict['trackers'] = trackers
                # 保存数据到数据库中
                context = save_get_ctx(
                    app_dict,
                    infoplist_dict,
                    code_dict,
                    bin_dict,
                    all_files,
                    rescan)
```



### 2.2.1、文件处理

​	处理IPA（iOS应用程序包）文件时，识别并定位其中的"Payload"目录，然后基于这个目录进行一系列的文件分析和处理。

1. 识别Payload目录
   - 使用`glob`方法的`**/*`模式来匹配`app_dir`（IPA文件解压后的目录）下的所有文件和子目录。
   - 遍历这些文件和子目录，检查它们的路径（转换为POSIX风格并转为小写）中是否包含"payload"字符串。这是为了找到IPA文件中的"Payload"目录，该目录通常包含应用的实际二进制文件和资源。
   - 如果找到了包含"payload"的目录，将其路径赋值给`app_dict['bin_dir']`，并跳出循环。这里`app_dict`是一个字典，用于存储与IPA文件分析相关的各种信息。
   - 如果没有找到包含"payload"的目录，则打印错误信息并返回。这表示IPA文件可能是损坏的或格式不正确。

2. 处理Payload目录路径
   - 将`app_dict['bin_dir']`的路径转换为POSIX风格的字符串，并在末尾添加一个斜杠（`/`），以确保路径的正确性。

### 2.2.2、跟入binary_analysis（对应**IPA BINARY ANALYSIS**）

跟入的函数主要是收集和分析IPA中二进制文件的信息，包括安全检查、库依赖、代码分析、字符串信息等。下面是对这个函数的详细解释：

1. **初始化字典**：首先，函数初始化了一个名为`bin_dict`的字典，用于存储分析结果。这个字典包含多个键，如`checksec`（安全检查信息）、`libraries`（库依赖）、`bin_code_analysis`（二进制代码分析结果）、`strings`（二进制文件中的字符串）、`bin_info`（二进制信息）和`bin_type`（二进制类型）。
2. **寻找.app目录**：函数遍历`src`目录下的所有文件和目录，寻找以`.app`结尾的目录，这通常是IPA中应用程序的实际位置。找到后，将其路径存储在`dot_app_dir`变量中。
3. **确定二进制文件路径**：根据传入的`executable_name`参数（如果提供），或者通过从`.app`目录名中去除`.app`后缀来确定二进制文件的名称。然后，构建二进制文件的完整路径，并检查该文件是否存在。
4. **执行分析**：如果二进制文件存在，则使用一系列自定义函数（如`ipa_macho_analysis`、`get_bin_info`、`detect_bin_type`、`get_class_dump`和`strings_on_binary`）来收集和分析二进制文件的信息。这些函数可能分别负责解析Mach-O格式（iOS上的可执行文件格式）、获取二进制基本信息、检测二进制类型、提取类转储信息和在二进制文件上运行strings命令。

### 2.2.3、跟入library_analysis（对应报告**IPA ANALYSIS**）

跟入的函数用于对特定架构（如`macho`、`elf`、`ar`等）的库二进制文件进行分析。函数接收三个参数：`src`（源文件或目录的路径）、`checksum`（用于构建文件路径的校验和），以及`arch`（目标架构）。函数的主要功能和步骤可以概括如下：

1. **初始化结果字典**：函数首先创建一个字典`res`，用于存储分析结果。这个字典包含基于架构的分析结果（`{arch}_analysis`）、字符串（`{arch}_strings`）和符号（`{arch}_symbols`）的列表。对于`ar`架构（静态库），还额外添加了一个空字符串作为`{arch}_a`的值。

2. **确定分析方法和文件扩展名**：根据`arch`参数的值，函数确定使用哪种分析方法（`MachOChecksec`或`ELFChecksec`）和要搜索的文件扩展名（如`*.dylib`、`*.so`或`*.o`）。如果特定类型的分析被禁用（通过`settings_enabled`函数检查），则直接返回空的`res`字典。

3. **遍历文件**：使用`Path(src).rglob(ext)`遍历`src`目录下所有匹配`ext`的文件。如果文件名包含`__MACOSX`，则跳过该文件（这通常是为了避免处理Mac OS X的特定文件）。

4. **分析文件**：对于每个文件，根据其架构和类型（通过`lief`库检测）进行相应的分析。使用之前确定的分析方法（`MachOChecksec`或`ELFChecksec`）对文件进行分析，并收集安全检查结果（`checksec`）、字符串（`strings`）和符号（`symbols`）。

   ​	这个函数的设计目的是为了支持对多种架构和类型的库文件进行深入的安全分析，包括检查其安全特性（如NX位、PIE等）、提取字符串和符号信息等。通过配置不同的设置（如`DYLIB_ANALYSIS_ENABLED`和`SO_ANALYSIS_ENABLED`），可以控制是否对特定类型的文件进行分析。此外，函数还通过`lief`库来识别文件的类型，从而决定使用哪种分析方法。

### 2.2.4、跟入get_strings_metadata

使用正则表达式获取字符串、邮箱地址、url和文件。

### 2.2.5、域提取和恶意识别（对应 **SERVER LOCATIONS**和**DOMAIN MALWARE CHECK**）

与 Android 的域提取和恶意识别一致，故不做解释。

### 2.2.6、get_trackers_domains_or_deps (此处对应报告的 Reconnaissance | Trackers)

与 Android 的跟踪器检测一致，故不做解释。

### 2.2.7、跟入shared_func





| 字段名                     | 类型    | 大小 | 描述                                                         |
| -------------------------- | ------- | ---- | :----------------------------------------------------------- |
| FILE_NAME                  | varchar | 260  | 文件名                                                       |
| APP_NAME                   | varchar | 255  | app名                                                        |
| APP_TYPE                   | varchar | 20   | app类型                                                      |
| SIZE                       | varchar | 50   | 文件大小                                                     |
| MD5                        | varchar | 32   | MD5哈希值                                                    |
| SHA1                       | varchar | 40   | SHA1哈希值                                                   |
| SHA256                     | varchar | 64   | SHA256哈希值                                                 |
| BUILD                      | text    |      |                                                              |
| APP_VERSION                | varchar | 100  | 应用版本                                                     |
| SDK_NAME                   | varchar | 50   | SDK名称                                                      |
| PLATFORM                   | varchar | 50   | 平台                                                         |
| MIN_OS_VERSION             | varchar | 50   | 最小 OS 版本                                                 |
| BUNDLE_ID                  | text    |      | 一个开发者账号下每一个 ios 应用的唯一标识                    |
| BUNDLE_URL_TYPES           | text    |      | 自定义 URL 方案                                              |
| BUNDLE_SUPPORTED_PLATFORMS | varchar |      | 支持平台                                                     |
| ICON_PATH                  | text    |      | 图标路径                                                     |
| INFO_PLIST                 | text    |      | Plist文件（xml文件）                                         |
| BINARY_INFO                | text    |      | 二进制信息                                                   |
| PERMISSIONS                | text    |      | 权限（权限名、严重性、信息、描述）                           |
| ATS_ANALYSIS               | text    |      | 应用传输分析（权限名、严重性、描述）最后还有各个危险级的数目 |
| BINARY_ANALYSIS            | text    |      | 二进制分析（描述、严重性、CVSS评分、相关的CWE（常见弱点枚举）编号、OWASP Mobile Top 10的映射、MASVS（Mobile Application Security Verification Standard，移动应用安全验证标准）的映射） |
| MACHO_ANALYSIS             | text    |      | 可执行文件分析（安全特性，包括其存在性、严重性以及相关的描述) |
| DYLIB_ANALYSIS             | text    |      | 动态库分析(关键的安全特性的 存在性、严重性、描述)            |
| FRAMEWORK_ANALYSIS         | text    |      | 框架分析(关键的安全特性的 存在性、严重性、描述)              |
| IOS_API                    | text    |      | IOS API                                                      |
| FILE_ANALYSIS              | text    |      | 文件分析（描述、涉及文件）                                   |
| CODE_ANALYSIS              | text    |      | 代码分析                                                     |
| LIBRARIES                  | text    |      | 依赖的多个动态链接库（dylib）和框架（framework）的兼容性版本和当前版本 |
| URLS                       | text    |      | URL，所处文件                                                |
| DOMAINS                    | text    |      | 域（域名、是否恶意、位置（ip、国家缩写、国家全称、州、城市、经纬度）、ofac |
| EMAILS                     | text    |      | 邮箱地址，所处文件                                           |
| STRINGS                    | text    |      | 字符串                                                       |
| FIREBASE_URLS              | text    |      | firebase 路径                                                |
| FILES                      | text    |      | 文件路径+文件名                                              |
| APPSTORE_DETAILS           | text    |      | 苹果应用商店中的该应用信息                                   |
| TRACKERS                   | text    |      | 跟踪器（追踪器数量、总的追踪器数量、追踪器列表）             |
| SECRETS                    | text    |      |                                                              |

# 3、apk动态分析

## 3.1、重要解析代码文件目录

`tools/webproxy.py：`设置代理，httptools相关
`views/android/analysis.py：`对动态分析得到的数据进行分析处理
`views/android/dynamic_analyzer.py：`动态分析流程文件（主文件）
`views/android/environment.py：`动态分析环境配置相关
`views/android/frida_core.py：`Frida框架核心操作部分
`views/android/frida_scripts.py：`Frida框架脚本
`views/android/operations.py：`动态分析操作
`views/android/report.py：`动态分析报告输出
`views/android/tests_common.py：`命令测试
`views/android/tests_frida.py：`Frida框架测试
`views/android/tests_xposed.py：`Xposed框架测试



## 3.2、代码解析

### 3.2.1、跟入dynamic_analysis

`dynamic_analysis`函数是动态分析的入口点

这里首先会检测模拟器，如果模拟器正常运行起来并被检测到，则获取设备数据，跟进到/MobSF/utils.py文件的`get_device`函数，之后设置代理IP，跟进到/MobSF/utils.py文件的`get_proxy_ip`函数，其功能是获取网络IP并根据它设置代理IP。

如果模拟器未启动或没有被检测到，则报错，跟进到/MobSF/utils.py文件的`print_n_send_error_response`函数。

`dynamic_analyzer`函数主要功能是配置/创建动态分析环境

在获取到设备信息后：

```python
......
identifier = get_device()
......
env = Environment(identifier)
......
```

我们跟入`Environment`函数，来到环境配置，在/DynamicAnalyzer/views/android/environment.py文件中。

### 3.2.2、Environment.py文件分析

以下是environment.py中每个函数的功能及作用

- `connect_n_mount`函数的功能是重启adb服务，之后尝试adb连接设备。
- `adb_command`函数的功能是adb命令包装，所有将要执行的命令都会经过包装后成为可以执行的命令，然后执行。
- `dz_cleanup`函数的功能是清除之前的动态分析记录和数据，以便于新的动态分析不受影响。
- `configure_proxy`函数的主要功能是设置代理。具体步骤是先调用Httptools杀死请求，再在代理模式下开启Httptools。

```
代码如下：
def configure_proxy(self, project):
    proxy_port = settings.PROXY_PORT
    logger.info('Starting HTTPs Proxy on %s', proxy_port)
    stop_httptools(proxy_port)    # 调用Httptools杀死请求
    start_proxy(proxy_port, project)    # 在代理模式下开启Httptools
```

这两个函数均跟入到/DynamicAnalyzer/tools/webproxy.py文件中。这个文件中的代码很简单，就不再分析了。

- `install_mobsf_ca`函数的主要功能是安装或删除MobSF的跟证书（ROOT CA）。

- `set_global_proxy`函数的主要功能是给设备设置全局代理，这个功能仅支持Android 4.4及以上系统，设置代理IP的功能会跟入到/MobSF/utils.py的`get_proxy_ip`函数中。对于小于Android 4.4的系统版本，会将代理设置为：127.0.0.1:1337

- `unset_global_proxy`函数的主要功能是取消设置的全局代理。

- `enable_adb_reverse_tcp`函数的主要功能是开启adb反向TCP代理，该功能仅支持Android 5.0以上的系统。

- `start_clipmon`函数的主要功能是开始剪切板监控。

- `get_screen_res`函数的主要功能是获取当前设备的屏幕分辨率。

- `screen_shot`函数的主要功能是截屏，并保存为/data/local/screen.png。

- `screen_stream`函数的主要功能是分析屏幕流。

- `android_component`函数的主要功能是获取APK的组件，包括Activity、Receiver、Provider、Service、Library等。

- `get_android_version`函数的主要功能是获取Android版本。

- `get_android_arch`函数的主要功能是获取Android体系结构。

- `launch_n_capture`函数的主要功能是启动和捕获Activity，是通过截屏实现的。

- `is_mobsfyied`函数的主要功能是获取Android的MobSfyed实例，读取Xposed或Frida文件并输出。

- `mobsfy_init`函数的主要功能是设置MobSF代理，安装Xposed或Frida框架。

  代码如下：

  ```python
  # 系统版本小于5.0，安装Xposed框架
  if version < 5:
      self.xposed_setup(version)
      self.mobsf_agents_setup('xposed')
  
  # 系统版本大于等于5.0，安装Frida框架
  else:
      self.frida_setup()
      self.mobsf_agents_setup('frida')
  logger.info('MobSFying Completed!')
  return version
  ```

- `mobsf_agents_setup`函数的主要功能是安装MobSF根证书，设置MobSF代理。
- `xposed_setup`函数的主要功能是安装Xposed框架。
- `frida_setup`函数的主要功能是安装Frida框架。
- `run_frida_server`函数的主要功能是运行Frida框架。

### 3.2.3、返回dynamic_analysis函数

按逻辑运行顺序

```py
# 动态分析环境准备
env = Environment(identifier)

# 如果测试ADB连接失败
if not env.connect_n_mount():
    msg = 'Cannot Connect to ' + identifier
    return print_n_send_error_response(request, msg)

# 获取Android版本
version = env.get_android_version()
logger.info('Android Version identified as %s', version)
xposed_first_run = False

# 根据系统版本获取Android的MobSfyed实例，如果失败
if not env.is_mobsfyied(version):
    msg = ('This Android instance is not MobSfyed.\n'
           'MobSFying the android runtime environment')
    logger.warning(msg)
    # 设置MobSF代理，如果失败
    if not env.mobsfy_init():
        return print_n_send_error_response(
            request,
            'Failed to MobSFy the instance')
    if version < 5:
        xposed_first_run = True

# 第一次运行Xposed框架，会重启设备以启用所有模块
if xposed_first_run:
    msg = ('Have you MobSFyed the instance before'
           ' attempting Dynamic Analysis?'
           ' Install Framework for Xposed.'
           ' Restart the device and enable'
           ' all Xposed modules. And finally'
           ' restart the device once again.')
    return print_n_send_error_response(request, msg)

# 清除之前的动态分析记录和数据
env.dz_cleanup(bin_hash)

# 设置web代理
env.configure_proxy(package)

# 开启adb反向TCP代理，仅支持5.0以上系统
env.enable_adb_reverse_tcp(version)

# 给设备设置全局代理，这个功能仅支持Android 4.4及以上系统
env.set_global_proxy(version)

# 开始剪切板监控
env.start_clipmon()

# 获取当前设备的屏幕分辨率
screen_width, screen_height = env.get_screen_res()
logger.info('Installing APK')

# APP目录
app_dir = os.path.join(settings.UPLD_DIR, bin_hash + '/')

# APP路径
apk_path = app_dir + bin_hash + '.apk'

# adb命令包装并执行
env.adb_command(['install', '-r', apk_path], False, True)

logger.info('Testing Environment is Ready!')
context = {'screen_witdth': screen_width,
           'screen_height': screen_height,
           'package': package,
           'md5': bin_hash,
           'android_version': version,
           'version': settings.MOBSF_VER,
           'title': 'Dynamic Analyzer'}
template = 'dynamic_analysis/android/dynamic_analyzer.html'

# 通过HttpResponse返回数据
return render(request, template, context)
```

### 3.2.3、httptools_start函数

`httptools_start`函数的主要功能是在代理模式下开启Httptools。

这里是先调用Httptools杀死请求，再在代理模式下开启Httptools。

代码如下：

```py
stop_httptools(settings.PROXY_PORT)
start_httptools_ui(settings.PROXY_PORT)
time.sleep(3)
logger.info('httptools UI started')
```

### 3.2.3、webproxy.py文件分析

跟入到/DynamicAnalyzer/tools/webproxy.py文件中。

`stop_httptools`函数的主要功能是杀死httptools，分为两步，第一步是通过调用httptools UI杀死请求，第二步是通过调用httptools代理杀死请求。

`start_proxy`函数的主要功能是在代理模式下开启Httptools。

`start_httptools_ui`函数的功能是启动httptools的UI。

`create_ca`函数的功能是第一次运行时创建CA

`get_ca_dir`函数的功能时获取CA目录

### 3.2.4、logcat函数

`logcat`函数主要是启动logcat流，获取日志的

### 3.2.5、operations.py文件

这个文件的主要功能是动态分析操作，我们从上到下看一下。

`json_response`函数的主要功能是返回JSON响应

`is_attack_pattern`函数的主要功能是通过正则表达式验证攻击

`strict_package_check`函数的主要功能是通过正则表达式校验包名称

`is_path_traversal`函数的主要功能是检查路径遍历

`is_md5`函数的主要功能是通过正则表达式检查是否是有效的MD5

`invalid_params`函数的主要功能是检查无效参数响应

`mobsfy`函数的主要功能是通过POST方法配置实例以进行动态分析

`execute_adb`函数的主要功能是通过POST方法执行ADB命令

`get_component`函数的主要功能是通过POST方法获取Android组件

`take_screenshot`函数的主要功能是通过POST方法截屏

`screen_cast`函数的主要功能是通过POST方法投屏

`touch`函数的主要功能是通过POST方法发送触摸事件

`mobsf_ca`函数的主要功能是通过POST方法安装或删除MobSF代理的ROOT CA

