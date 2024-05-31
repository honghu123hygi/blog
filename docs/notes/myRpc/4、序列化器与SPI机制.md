---
title: 4、序列化器与SPI机制
author:
createTime: 2024/05/18 15:46:04
permalink: /myRpc/SPI/
---
# 序列化器与SPI机制



## 一、需求分析

​		首先无论是请求或响应，都会涉及参数的传输。而Java 对象是存活在 JVM 虚拟机中的，如果想在其他位置存储并访问、或者在网络中进行传输，就需要进行序列化和反序列化。

​		此前已经编写了通用的序列化器接口，并实现基于 Java 原生序列化的序列化器，但仍需考虑三个问题：

- 有没有更好的序列化器实现方式?
- 如何让使用框架的开发者指定使用的序列化器?
- 如何让使用框架的开发者自己定制序列化器?



## 二、设计方案

### 1、序列化器实现方式

​		目前市面上还有很多种主流的序列化方式，如：JSON、Hessian、Kryo、protobuf 等。

**主流序列化方式对比**

a）JSON

优点：

- 易读性好，可读性强，便于人类理解和调试。
- 跨语言支持广泛，几乎所有编程语言都有JSON 的解析和生成库。

缺点：

- 序列化后的数据量相对较大，因为JSON 使用文本格式存储数据，需要额外的字符表示键、值和数据结构。
- 不能很好地处理复杂的数据结构和循环引用，可能导致性能下降或者序列化失败。

b）Hessian：

[https://hessian.caucho.com/]: 

优点：

- 二进制序列化，序列化后的数据量较小，网络传输效率高。
- 支持跨语言，适用于分布式系统中的服务调用。

缺点：

- 性能较 JSON 略低，因为需要将对象转换为二进制格式。
- 对象必须实现 Serializable 接口，限制了可序列化的对象范围。

c）Kryo

优点：

- 高性能，序列化和反序列化速度快。
- 支持循环引用和自定义序列化器，适用于复杂的对象结构。
- 无需实现 Serializable 接口，可以序列化任意对象。

缺点：

- 不跨语言，只适用于 Java。
- 对象的序列化格式不够友好，不易读懂和调试。

d）Protobuf

优点：

- 高效的二进制序列化，序列化后的数据量极小。
- 跨语言支持，并且提供了多种语言的实现库。
- 支持版本化和向前/向后兼容性。

缺点：

- 配置相对复杂，需要先定义数据结构的消息格式。
- 对象的序列化格式不易读懂，不便于调试。

### 2、动态使用序列化器

​		定义一个 `序列化器名称 => 序列化器实现类对象` 的 Map，然后根据名称从 Map 中获取对象即可。

### 3、自定义序列化器

​		使用 SPI 机制。

**什么是 SPI？**

​		SPI（Service Provider Interface）服务提供接口是 Java 的机制，主要用于实现模块化开发和插件化扩展。

​		SPI 机制允许服务提供者通过特定的配置文件将自己的实现注册到系统中，然后系统通过反射机制动态加载这些实现，而不需要修改原始框架的代码，从而实现了系统的解耦、提高了可扩展性。

​		一个典型的 SPI 应用场景是 JDBC（Java 数据库连接库），不同的数据库驱动程序开发者可以使用 JDBC 库，然后定制自己的数据库驱动程序。

此外，我们使用的主流 Java 开发框架中，几乎都使用到了 SPI 机制，比如 Servlet 容器、日志框架、ORM 框架、Spring 框架。



## 三、开发实现

### 1、多种序列化器实现

a）首先给项目的 pom.xml 中引入依赖：

```xml
<!-- 序列化 -->
<!-- https://mvnrepository.com/artifact/com.caucho/hessian -->
<dependency>
    <groupId>com.caucho</groupId>
    <artifactId>hessian</artifactId>
    <version>4.0.66</version>
</dependency>
<!-- https://mvnrepository.com/artifact/com.esotericsoftware/kryo -->
<dependency>
    <groupId>com.esotericsoftware</groupId>
    <artifactId>kryo</artifactId>
    <version>5.6.0</version>
</dependency>
```

b）然后在序列化器包 `serializer` 中分别实现这三种序列化器；

**JSON序列化器**

​		JSON 序列化器的实现相对复杂，要考虑一些对象转换的兼容性问题，比如 Object 数组在序列化后会丢失类型。

```java
public class JsonSerializer implements Serializer {
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();

    @Override
    public <T> byte[] serialize(T obj) throws IOException {
        return OBJECT_MAPPER.writeValueAsBytes(obj);
    }

    @Override
    public <T> T deserialize(byte[] bytes, Class<T> classType) throws IOException {
        T obj = OBJECT_MAPPER.readValue(bytes, classType);
        if (obj instanceof RpcRequest) {
            return handleRequest((RpcRequest) obj, classType);
        }
        if (obj instanceof RpcResponse) {
            return handleResponse((RpcResponse) obj, classType);
        }
        return obj;
    }

    /**
     * 由于 Object 的原始对象会被擦除，导致反序列化时会被作为 LinkedHashMap 无法转换成原始对象，因此这里做了特殊处理
     *
     * @param rpcRequest rpc 请求
     * @param type       类型
     * @return {@link T}
     * @throws IOException IO异常
     */
    private <T> T handleRequest(RpcRequest rpcRequest, Class<T> type) throws IOException {
        Class<?>[] parameterTypes = rpcRequest.getParameterTypes();
        Object[] args = rpcRequest.getArgs();

        // 循环处理每个参数的类型
        for (int i = 0; i < parameterTypes.length; i++) {
            Class<?> clazz = parameterTypes[i];
            // 如果类型不同，则重新处理一下类型
            if (!clazz.isAssignableFrom(args[i].getClass())) {
                byte[] argBytes = OBJECT_MAPPER.writeValueAsBytes(args[i]);
                args[i] = OBJECT_MAPPER.readValue(argBytes, clazz);
            }
        }
        return type.cast(rpcRequest);
    }

    /**
     * 由于 Object 的原始对象会被擦除，导致反序列化时会被作为 LinkedHashMap 无法转换成原始对象，因此这里做了特殊处理
     *
     * @param rpcResponse rpc 响应
     * @param type        类型
     * @return {@link T}
     * @throws IOException IO异常
     */
    private <T> T handleResponse(RpcResponse rpcResponse, Class<T> type) throws IOException {
        // 处理响应数据
        byte[] dataBytes = OBJECT_MAPPER.writeValueAsBytes(rpcResponse.getData());
        rpcResponse.setData(OBJECT_MAPPER.readValue(dataBytes, rpcResponse.getDataType()));
        return type.cast(rpcResponse);
    }
}
```

**Kryo 序列化器**

​		Kryo 本身是线程不安全的，所以需要使用 ThreadLocal 保证每个线程有一个单独的 Kryo 对象实例。

```java
public class KryoSerializer implements Serializer {
    /**
     * kryo 线程不安全，使用 ThreadLocal 保证每个线程只有一个 Kryo
     */
    private static final ThreadLocal<Kryo> KRYO_THREAD_LOCAL = ThreadLocal.withInitial(() -> {
        Kryo kryo = new Kryo();
        // 设置动态动态序列化和反序列化类，不提前注册所有类（可能有安全问题）
        kryo.setRegistrationRequired(false);
        return kryo;
    });

    @Override
    public <T> byte[] serialize(T obj) {
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        Output output = new Output(byteArrayOutputStream);
        KRYO_THREAD_LOCAL.get().writeObject(output, obj);
        output.close();
        return byteArrayOutputStream.toByteArray();
    }

    @Override
    public <T> T deserialize(byte[] bytes, Class<T> classType) {
        ByteArrayInputStream byteArrayInputStream = new ByteArrayInputStream(bytes);
        Input input = new Input(byteArrayInputStream);
        T result = KRYO_THREAD_LOCAL.get().readObject(input, classType);
        input.close();
        return result;
    }

}
```

Hessian 序列化器

```java
public class HessianSerializer implements Serializer {
    @Override
    public <T> byte[] serialize(T object) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        HessianOutput ho = new HessianOutput(bos);
        ho.writeObject(object);
        return bos.toByteArray();
    }

    @Override
    public <T> T deserialize(byte[] bytes, Class<T> tClass) throws IOException {
        ByteArrayInputStream bis = new ByteArrayInputStream(bytes);
        HessianInput hi = new HessianInput(bis);
        return (T) hi.readObject(tClass);
    }
}
```

### 2、动态使用序列化器

a）首先定义序列化器名称的常量，使用接口实现。

```java
public interface SerializerKeys {
    String JDK = "jdk";
    String JSON = "json";
    String KRYO = "kryo";
    String HESSIAN = "hessian";
}
```

b）定义序列化器工厂。

​		序列化器对象是可以复用的，没必要每次执行序列化操作前都创建一个新的对象。所以我们可以使用设计模式中的 **工厂模式 + 单例模式** 来简化创建和获取序列化器对象的操作。

​		序列化器工厂代码如下，使用 Map 来维护序列化器实例：

```java
public class SerializerFactory {

    /**
     * 序列化映射（用于实现单例）
     */
    private static final Map<String, Serializer> KEY_SERIALIZER_MAP = new HashMap<String, Serializer>() {{
        put(SerializerKeys.JDK, new JdkSerializer());
        put(SerializerKeys.JSON, new JsonSerializer());
        put(SerializerKeys.KRYO, new KryoSerializer());
        put(SerializerKeys.HESSIAN, new HessianSerializer());
    }};

    /**
     * 默认序列化器
     */
    private static final Serializer DEFAULT_SERIALIZER = KEY_SERIALIZER_MAP.get("jdk");

    /**
     * 获取实例
     *
     * @param key
     * @return
     */
    public static Serializer getInstance(String key) {
        return KEY_SERIALIZER_MAP.getOrDefault(key, DEFAULT_SERIALIZER);
    }
}
```

c）在全局配置类 RpcConfig 中补充序列化器的配置

```java
/**
* 序列化器
*/
private String serializer = SerializerKeys.JDK;
```

d）动态获取序列化器。

​		需要将之前代码中所有用到序列化器的位置更改为 “使用工厂 + 读取配置” 来获取实现类。

要更改的类：

- ServiceProxy
- HttpServerHandler

### 3、自定义序列化器

​		使用自定义的 SPI 机制实现，支持用户自定义序列化器并指定键名。

a）指定 SPI 配置目录。

​		系统内置的 SPI 机制会加载 `resources` 资源目录下的 `META-INF/services` 目录，那自定义的序列化器可以如法炮制，改为读取 `META-INF/rpc` 目录。

​		另外还可以将 SPI 配置再分为系统内置 SPI 和用户自定义 SPI，即目录如下：

- 用户自定义 SPI：META-INF/rpc/custom。用户可以在该目录下新建配置，加载自定义的实现类。
- 系统内置 SPI：META-INF/rpc/system。RPC 框架自带的实现类，比如我们之前开发好的 `JdkSerializer`。

​		这样一来，所有接口的实现类都可以通过 SPI 动态加载，不用在代码中硬编码 Map 来维护实现类了。

​		在静态资源包里添加一个系统扩展配置文件，内容为之前写好的序列化器。

```java
jdk=com.honghu.corerpc.serializer.JdkSerializer
hessian=com.honghu.corerpc.serializer.HessianSerializer
json=com.honghu.corerpc.serializer.JsonSerializer
kryo=com.honghu.corerpc.serializer.KryoSerializer
```

2）编写 SpiLoader 加载器。

相当于一个工具类，提供了读取配置并加载实现类的方法。

关键实现如下：

- 用 Map 来存储已加载的配置信息 `键名 => 实现类`。
- 扫描指定路径，读取每个配置文件，获取到 `键名 => 实现类` 信息并存储在 Map 中。
- 定义获取实例方法，根据用户传入的接口和键名，从 Map 中找到对应的实现类，然后通过反射获取到实现类对象。可以维护一个对象实例缓存，创建过一次的对象从缓存中读取即可。

```java
@Slf4j
public class SpiLoader {

    /**
     * 加载已经加载的类：接口名 => （key => 实现类）
     */
    private static Map<String,Map<String,Class<?>>> loaderMap = new ConcurrentHashMap<>();

    /**
     * 对象实例缓存（避免重复 new），类路径 => 对象实例，单例模式
     */
    private static Map<String,Object> instanceCache = new ConcurrentHashMap<>();

    /**
     * 系统 SPI 目录
     */
    private static final String RPC_SYSTEM_SPI_DIR = "META-INF/rpc/system/";

    /**
     * 用户 SPI 目录
     */
    private static final String RPC_CUSTOM_SPI_DIR = "META-INF/rpc/custom/";

    /**
     * 扫描路径
     */
    private static final String[] SCAN_DIRS = new String[]{RPC_CUSTOM_SPI_DIR,RPC_SYSTEM_SPI_DIR};

    /**
     * 动态加载的类列表
     */
    private static final List<Class<?>> LOAD_CLASS_LIST = Arrays.asList(Serializer.class);

    /**
     * 加载所有类型
     */
    public static void loadAll(){
        log.info("加载所有 SPI");
        for(Class<?> aClass : LOAD_CLASS_LIST){
            load(aClass);
        }
    }

    public static <T> T getInstance(Class<?> tClass,String key){
        String tClassName = tClass.getName();
        Map<String,Class<?>> keyClassMap = loaderMap.get(tClassName);
        if(keyClassMap == null){
            throw new RuntimeException(String.format("SpiLoader 的 %s 不存在 key=%s 的类型",tClassName,key));
        }
        if(!keyClassMap.containsKey(key)){
            throw new RuntimeException(String.format("SpiLoader 的 %s 不存在 key=%s 的类型",tClassName,key));
        }
        //获取要实现的加载类型
        Class<?> implClass = keyClassMap.get(key);
        String implClassName = implClass.getName();
        if(!instanceCache.containsKey(implClassName)){
           try {
               instanceCache.put(implClassName,implClass.newInstance());
           }catch (InstantiationException | IllegalAccessException e){
               String errorMsg = String.format("%s 类实例化失败",implClassName);
               throw new RuntimeException(errorMsg,e);
           }
        }

        return (T)instanceCache.get(implClassName);
    }

    /**
     * 加载某个类型
     *
     * @param loadClass
     * @return
     */
    public static Map<String,Class<?>> load(Class<?> loadClass) {
        log.info("加载类型为 {} 的 SPI",loadClass.getName());
        //扫描路径，用户自定义的 SPI 优先级高于系统 SPI
        Map<String,Class<?>> keyClassMap = new HashMap<>();
        for (String scanDir : SCAN_DIRS){
            List<URL> resources = ResourceUtil.getResources(scanDir + loadClass.getName());
            //读取每个资源文件
            for (URL resource : resources) {
                try{
                    InputStreamReader inputStreamReader = new InputStreamReader(resource.openStream());
                    BufferedReader bufferedReader = new BufferedReader(inputStreamReader);
                    String line;
                    while ((line = bufferedReader.readLine()) != null){

                        String[] strArray = line.split("=");
                        if(strArray.length > 1){
                            String key = strArray[0];
                            String className = strArray[1];
                            keyClassMap.put(key,Class.forName(className));
                        }
                    }
                }catch (Exception e){
                    log.info("SPI resource load error",e);
                }
            }
        }
        loaderMap.put(loadClass.getName(),keyClassMap);
        return keyClassMap;
    }

}
```

3）重构序列化器工厂。

​		之前是通过在工厂中硬编码 HashMap 来存储序列化器和实现类的，有了 SPI 后，就可以改为从 SPI 加载指定的序列化器对象。

```java
public class SerializerFactory {

    static {
        SpiLoader.load(Serializer.class);
    }

    /**
     * 默认序列化器
     */
    private static final Serializer DEFAULT_SERIALIZER = new JdkSerializer();

    /**
     * 获取实例
     *
     * @param key
     * @return
     */
    public static Serializer getInstance(String key) {
        return SpiLoader.getInstance(Serializer.class, key);
    }

}
```

