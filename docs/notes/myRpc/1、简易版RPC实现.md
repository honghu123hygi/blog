---
title: 1、简易版RPC实现
author:
createTime: 2024/05/17 14:47:16
permalink: /myRpc/EasyRpc/
---
# 简易版RPC框架开发



## 一、基本概念

### 1、什么是RPC框架？

​        全称 Remote Procedure Call，远程过程调用，是一种计算机通信协议，它允许程序在不同计算机之间进行通信和交互，如本地调用一样。

### 2、为什么需要RPC框架？

​        回到 RPC 的概念，RPC 允许一个程序(称为服务消费者)像调用自己程序的方法一样，调用另一个程序(称为服务提供者)的接口，而不需要了解数据的传输处理过程、底层网络通信的细节等。这些都会由 RPC 框架帮你完成，使得开发者可以轻松调用远程服务，快速开发分布式系统。



## 二、实现思路

###  1、基本设计

​       首先需要两个角色，一个消费者，一个服务提供者，如图：

<img src="https://img2.imgtp.com/2024/05/17/IzlhgPpd.png" style="zoom:70%;" />

​        消费者想要调用提供者，就需要提供者启动一个 web 服务，然后通过 请求客户端 发送 HTTP 或者其他协议的请求来调用。
比如请求服务提供者的请求地址后，提供者会调用 orderService 的 order 方法:

<img src="https://img2.imgtp.com/2024/05/17/16vJvZrI.png" style="zoom:70%;" />

​        如果提供者提供了多个服务和方法，每个接口和方法都单独写一个接口，那么消费者要针对每个接口写一段 HTTP 调用的逻辑。
​        但是也可以提供一个统一的服务调用接口，通过**请求处理器**根据客户端的请求参数来进行不同的处理、调用不同的服务和方法。
​        可以在服务提供者程序维护一个 本地服务注册器，记录服务和对应实现类的映射。举个例子，消费者要调用 orderService 服务的 order方法，可以发送请求，参数为 service=orderervice,method=order，然后请求处理器会根据 service 从服务注册器中找到对应的服务实现类，并且通过Java 的反射机制调用 method 指定的方法.

<img src="https://img2.imgtp.com/2024/05/17/U3HkghEV.png" style="zoom:70%;" />

​        需要注意的是，由于 Java 对象无法直接在网络中传输，所以要对传输的参数进行 **序列化** 和 **反序列化** 。

<img src="https://img2.imgtp.com/2024/05/17/nECtrAuT.png" style="zoom:70%;" />

​        为了简化消费者发请求的代码，实现类似本地调用的体验。可以基于代理模式，为消费者要调用的接口生成一个代理对象，由代理对象完成请求和响应的过程。
​        至此，最简易的 RPC 框架架构图如下了:

<img src="https://img2.imgtp.com/2024/05/17/UFIUUhIq.png" style="zoom:70%;" />

​       虚线框部分，就是 RPC 框架需要提供的模块和能力。

### 2、扩展

- #### 服务注册发现

​	问题 1：消费者如何知道提供者的调用地址呢？

​			首先需要一个 **注册中心**，来保存服务提供者的地址。消费者要调用服务时，只需从注册中心获取对应服务的提供者地址即可。

架构图如下：

<img src="https://img2.imgtp.com/2024/05/18/yNb4oeq0.png" style="zoom:70%;" />

- #### 负载均衡

  问题 2：如果有多个服务提供者，消费者应该调用哪个服务提供者呢?

  ​		可以给服务调用方增加负载均衡能力，通过指定不同的算法来决定调用哪一个服务提供者，比如轮询、随机、根据性能动态调用等。
  架构图如下:

<img src="https://img2.imgtp.com/2024/05/18/Y2lghqc4.png" style="zoom:70%;" />

- ####  容错机制

  问题 3：如果服务调用失败，应该如何处理呢?

  ​		为了保证分布式系统的高可用，通常会给服务的调用增加一定的容错机制，比如失败重试、降级调用其他接口等等。架构图如下:

<img src="https://img2.imgtp.com/2024/05/18/IDW9SZ3e.png" style="zoom:70%;" />

- #### 其他



​	除了上面几个经典设计外，如果想要做一个优秀的 RPC 框架，还要考虑很多问题。比如:

1. 服务提供者下线了怎么办?需要一个失效节点剔除机制。

2. 服务消费者每次都从注册中心拉取信息，性能会不会很差?可以使用缓存来优化性能。

3. 如何优化 RPC 框架的传输通讯性能?比如选择合适的网络框架、自定义协议头、节约传输体积等。

4. 如何让整个框架更利于扩展?比如使用 Java 的 SPI机制、配置化等等。

   

## 三、开发简易RPC框架

​		系统架构图

<img src="https://img2.imgtp.com/2024/05/17/UFIUUhIq.png" style="zoom:70%;" />

### 1、项目初始化

​		首先创建项目根目录myRPC，并在其中创建4个模块，如下：

​			common：示例代码的公共依赖，包括接口、Model等；

​			consumer：示例服务消费者代码；

​			provider：示例服务提供者代码；

​			easy-rpc：简易版 RPC 框架

### 2、公共模块

​		公共模块会被消费者与服务提供者引入，主要用于编写和服务相关的接口和数据模型。结构如下：

![](https://img2.imgtp.com/2024/05/18/KIng2biO.png)

- 用户实体类实体类User

  ```
  public class User implements Serializable {
      private String name;
      public String getName() {
          return name;
      }
      public void setName(String name) {
          this.name = name;
      }
  }
  ```

- 用户服务接口 UserService，提供一个获取用户的方法

  ```java
  public interface UserService {
  
      /**
       * 获取用户
       * @param user
       * @return
       */
      User getUser(User user);
  }
  ```

### 3、服务提供者

​		真正实现公共模块的接口的模块，并被消费者获取调用

- 编写服务实现类，并返回参数中的User对象

  ```java
  public class UserServiceImpl implements UserService {
  
      @Override
      public User getUser(User user) {
          System.out.println("用户名为：" + user.getName());
          return user;
      }
  }
  ```

  

###  4、服务消费者

​		服务消费者是需要调用服务的模块。

- 创建服务消费者启动类 EasyConsumerExample，编写调用接口的代码

  ​	

  ```
  public class EasyConsumerExample {
      public static void main(String[] args) {
  
          //TODO 需要获取UserService的实现类对象
          UserService userService = null;
          User user = new User();
          user.setName("洪子舟");
  
          User newUser = userService.getUser(user);
          if(newUser != null){
              System.out.println(newUser.getName());
          }else{
              System.out.println("user == null");
          }
      }
  }
  ```

  此处无法获取**UserService**的实现类对象，需要通过**RPC**框架，快速得到一个支持远程调用服务提供者的代理对象。

### 5、web 服务器

​		接下来，要先让服务提供者提供 可远程访问 的服务，就需要一个 web 服务器，能够接受处理请求、并返回响应。此处将使用高性能的 NIO 框架 Vert,x 来作为 RPC 框架的 web 服务器

- 在 easy-rpc 中导入 Vert.x 依赖和工具类的依赖：

  ```xml
  <dependency>
       <groupId>io.vertx</groupId>
       <artifactId>vertx-core</artifactId>
       <version>4.5.1</version>
  </dependency>
  <dependency>
       <groupId>cn.hutool</groupId>
       <artifactId>hutool-all</artifactId>
       <version>5.8.18</version>
  </dependency>
  <dependency>
       <groupId>org.projectlombok</groupId>
       <artifactId>lombok</artifactId>
       <version>1.18.16</version>
       <scope>provided</scope>
  </dependency>
  ```

- 编写一个 web 服务器的接口 Httpserver，定义统一的启动服务器方法，便于后续的扩展，比如实现多种不同的 web 服务
  耐。

  ```java
  public interface HttpServer {
      /**
       * 启动服务器
       * @param port
       */
      void doStart(int port);
  }编写基于 Vert.x 实现的 web 服务器 VertxHttpServer，能够监听指定端口并处理请求。
  ```

- 编写基于 Vert.x 实现的 web 服务器 VertxHttpServer，能够监听指定端口并处理请求。

  ```java
  public class VertxHttpServer implements HttpServer {
      /**
       * 启动服务器
       * @param port
       */
      @Override
      public void doStart(int port) {
          //创建 Vert.x 实例
          Vertx vertx = Vertx.vertx();
  
          //创建HttpServer 服务器
          io.vertx.core.http.HttpServer server = vertx.createHttpServer();
  
          //监听端口并处理请求
          server.requestHandler(request -> {
              //处理 HTTP 请求
              System.out.println("Received request: " + request.method() + " " + request.uri());
              //发送 HTTP 响应
              request.response()
                  .putHeader("content-type","text/plain")
                  .end("Hello from Vert.x HTTP server!");
          });
  
          //启动 HTTP 服务器并监听指定端口
          server.listen(port,result->{
             if(result.succeeded()){
                 System.out.println("Server is now listening on port "+port);
              }else{
                 System.out.println("Failed to start server:" + result.cause());
             }
          });
      }
  }
  
  ```

### 6、本地服务注册器

​		目前做的简易 RPC框架主要是跑通流程，暂时先不用第三方注册中心，直接把服务注册到服务提供者本地即可在 RPC 模块中创建本地服务注册器 LocalRegistry

- 使用线程安全的 ConcurrentHashMap 存储服务注册信息，key 为服务名称、value 为服务的实现类。之后就可以根据要调用的服务名称获取到对应的实现类，然后通过反射进行方法调用了。

  ```java
  public class LocalRegistry {
  
      /**
       * 注册信息存储
       */
      private static final Map<String,Class<?>> map = new ConcurrentHashMap<>();
  
      /**
       * 注册服务
       *
       * @param serviceName
       * @param implClass
       */
      public static void registry(String serviceName,Class<?> implClass){
          map.put(serviceName, implClass);
      }
  
      /**
       * 获取服务
       *
       * @param serviceName
       * @return
       */
      public static Class<?> get(String serviceName){
          return map.get(serviceName);
      }
  
      /**
       * 移除服务
       *
       * @param serviceName
       */
      public static void remove(String serviceName){
          map.remove(serviceName);
      }
  }
  ```

  

- 这里需要注意，本地服务注册器和注册中心的作用是有区别的。注册中心的作用侧重于管理注册的服务、提供服务信息给消费者；而本地服务注册器的作用是根据服务名获取到对应的实现类，是完成调用必不可少的模块。

  服务提供者启动时，需要注册服务到注册器中，服务提供者的启动类EasyProviderExample代码如下:

  ```java
  public class EasyProviderExample {
      public static void main(String[] args) {
          //注册服务
          LocalRegistry.registry(UserService.class.getName(),UserServiceImpl.class);
  
          //启动 web 服务
          HttpServer httpServer = new VertxHttpServer();
          httpServer.doStart(8080);
      }
  }
  ```

### 7、序列化器

​		服务在本地注册后，就可以根据请求信息取出实现类并调用方法了。

​		但是在编写外理请求的锣辑前，要先实现序列化器模块。因为无论是请求或响应，都会涉及参数的传输。而 Java 对象存活在 VM 虚拟机中的，如果想在其他位置存储并访问、或者在网络中进行传输，就需要进行序列化和反序列化。

​		什么是序列化和反序列化呢?

1. 序列化:将 Java 对象转为可传输的字节数组。
2. 反序列化:将字节数组转换为 Java 对象。

​		有很多种不同的序列化方式，比如Java 原生序列化、JSON、Hessian、Kryo、protobuf等。

​		为了实现方便，此处选择 Java 原生的序列化器。

- 在 RPC 模块中编写序列化接口 Serializer，提供序列化和反序列化两个方法，便于后续扩展更多的序列化器。

  ```java
  public interface Serializer {
  
      /**
       * 序列化
       * @param object
       * @return
       * @param <T>
       * @throws IOException
       */
      <T> byte[] serializer(T object) throws IOException;
  
      /**
       * 反序列化
       * @param bytes
       * @param type
       * @return
       * @param <T>
       * @throws IOException
       */
      <T> T deserializer(byte[] bytes,Class<T> type) throws IOException;
  }
  
  ```

- 基于 Java 自带的序列化器实现 JdkSerializer

  ```java
  public class JdkSerializer implements Serializer{
  
      /**
       * 序列化
       * @param object
       * @return
       * @param <T>
       * @throws IOException
       */
      @Override
      public <T> byte[] serializer(T object) throws IOException {
          ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
          ObjectOutputStream objectOutputStream = new ObjectOutputStream(outputStream);
          objectOutputStream.writeObject(object);
          objectOutputStream.close();
          return outputStream.toByteArray();
      }
  
      /**
       * 反序列化
       * @param bytes
       * @param type
       * @return
       * @param <T>
       * @throws IOException
       */
      @Override
      public <T> T deserializer(byte[] bytes, Class<T> type) throws IOException {
          ByteArrayInputStream inputStream = new ByteArrayInputStream(bytes);
          ObjectInputStream objectInputStream = new ObjectInputStream(inputStream);
          try{
              return (T) objectInputStream.readObject();
          }catch (ClassNotFoundException e){
              throw new RuntimeException(e);
          }finally {
              objectInputStream.close();
          }
      }
  }
  ```

### 8、提供者处理调用-请求处理器

​		请求处理器是 RPC 框架的实现关键，它的作用是：处理接收到的请求，并根据请求参数找到对应的服务和方法，通过反射实现调用，最后封装返回结果并响应请求。

- 在服务提供者模块中编写请求和响应封装类

  ```java
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public class RpcRequest implements Serializable {
      /**
       * 服务名称
       */
      private String serviceName;
      /**
       * 方法名称
       */
      private String methodName;
      /**
       * 参数类型列表
       */
      private Class<?>[] parameterTypes;
      /**
       * 参数列表
       */
      private Object[] args;
  }
  
  ```

  ```java
  @Data
  @Builder
  @NoArgsConstructor
  @AllArgsConstructor
  public class RpcResponse implements Serializable {
      /**
       * 响应数据
       */
      private Object data;
      /**
       * 响应数据类型
       */
      private Class<?> dataType;
      /**
       * 响应信息
       */
      private String message;
      /**
       * 异常信息
       */
      private Exception exception;
  }
  ```

- 编写请求处理器 HttpServerHandle。首先反序列化请求为对象，并从请求对象中获取参数，根据服务名称从本地注册器中获取到对应的服务实现类，然后通过反射机制调用方法，得到返回结果，最终对返回结果进行封装和序列化，并写入到响应中。

  ```java
  public class HttpServerHandler implements Handler<HttpServerRequest> {
  
      @Override
      public void handle(HttpServerRequest request) {
          //指定序列化器
          final Serializer serializer = new JdkSerializer();
  
          //记录日志
          System.out.println("Received request: " + request.method() + " " + request.uri());
  
          //异步处理 HTTP 请求
          request.bodyHandler(body->{
              byte[] bytes = body.getBytes();
              RpcRequest rpcRequest = null;
              try {
                  rpcRequest = serializer.deserializer(bytes, RpcRequest.class);
              }catch (Exception e) {
                  e.printStackTrace();
              }
  
              //构造响应结果对象
              RpcResponse rpcResponse = new RpcResponse();
              //如果返回为 null，直接返回
              if (rpcRequest == null){
                  rpcResponse.setMessage("rpcRequest is null.");
                  doResponse(request,rpcResponse,serializer);
                  return;
              }
  
              try{
                  //获取要调用的服务实现类，通过反射调用
                  Class<?> implClass = LocalRegistry.get(rpcRequest.getServiceName());
                  Method method = implClass.getMethod(rpcRequest.getMethodName(),rpcRequest.getParameterTypes());
                  Object result = method.invoke(implClass.newInstance(),rpcRequest.getArgs());
  
                  //封装返回结果
                  rpcResponse.setData(result);
                  rpcResponse.setDataType(method.getReturnType());
                  rpcResponse.setMessage("OK!");
              }catch (Exception e){
                  e.printStackTrace();
                  rpcResponse.setMessage(e.getMessage());
                  rpcResponse.setException(e);
              }
              //响应
              doResponse(request,rpcResponse,serializer);
          });
      }
  
      /**
       * 响应
       * @param request
       * @param rpcResponse
       * @param serializer
       */
      void doResponse(HttpServerRequest request ,RpcResponse rpcResponse,Serializer serializer){
          HttpServerResponse httpServerResponse = request.response()
                  .putHeader("content-type","application/json");
          try {
              //序列化
              byte[] servialized = serializer.serializer(rpcResponse);
              httpServerResponse.end(Buffer.buffer(servialized));
          } catch (IOException e) {
                  e.printStackTrace();
                  httpServerResponse.end(Buffer.buffer());
          }
      }
  }
  ```

- 给 HttpServer 绑定请求处理器，修改 VertxHttpServer 的代码，通过绑定请求处理器server.requestHandler

  ```java
  public class VertxHttpServer implements HttpServer {
      /**
       * 启动服务器
       * @param port
       */
      @Override
      public void doStart(int port) {
          //创建 Vert.x 实例
          Vertx vertx = Vertx.vertx();
  
          //创建 HttpServer 服务器
          io.vertx.core.http.HttpServer server = vertx.createHttpServer();
  
          //监听端口并处理请求
          server.requestHandler(new HttpServerHandler() );
  
          //启动 HTTP 服务器并监听指定端口
          server.listen(port,result->{
             if(result.succeeded()){
                 System.out.println("Server is now listening on port "+port);
              }else{
                 System.out.println("Failed to start server:" + result.cause());
             }
          });
      }
  }
  ```

  至此，映入 RPC 框架的服务提供者已经可以接受服务并完成服务调用了。

### 9、消费方发起调用-代理

这里如果使用静态代理，需要给每一个服务接口都写一个实现类，较为麻烦且不灵活，所以 RPC 框架中，我们会使用动态代理。

动态代理的作用是，根据要生成的对象的类型，自动生成一个代理对象。
常用的动态代理实现方式有 JDK动态代理和基于字节码生成的动态代理(比如 CGLB)。前者简单易用、无需引入额外的库但缺点是只能对接口进行代理;后者更灵活、可以对任何类进行代理，但性能略低于JDK动态代理。
此处使用 JDK 动态代理。

- 在 RPC 模块中编写动态代理类 ServiceProxy，需要实现 InvocationHandler 接囗的 invoke 方法。

  ```java
  public class ServiceProxy implements InvocationHandler {
  
      /**
       *调用代理
       *
       * @return
       * @throws Throwable
       */
      @Override
      public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
          //指定序列化器
          Serializer serializer = new JdkSerializer();
  
          //发请求
          RpcRequest rpcRequest = RpcRequest.builder()
                  .serviceName(method.getDeclaringClass().getName())
                  .methodName(method.getName())
                  .parameterTypes(method.getParameterTypes())
                  .args(args)
                  .build();
          try{
              //序列化
              byte[] bytes = serializer.serializer(rpcRequest);
              //发送请求
              //TODO ps，这里地址被硬编码了（需要使用注册中心和服务发现机制解决）
              try(HttpResponse httpResponse = HttpRequest.post("http://localhost:8080")
                      .body(bytes)
                      .execute()){
                  byte[] result = httpResponse.bodyBytes();
                  //反序列化
                  RpcResponse rpcResponse = serializer.deserializer(result, RpcResponse.class);
                  return rpcResponse.getData();
              }
  
          }catch (IOException e){
              e.printStackTrace();
          }
          return null;
      }
  }
  ```

  ​		当用户调用某个接口的方法时，会改为调用 invoke 方法。在 invoke 方法中，我们可以获取到要调用的方法信息、传入的参数列表等，用这些参数来构造请求对象就可以完成调用了。

- 创建动态代理工厂 ServiceProxyFactory，作用是根据指定类创建动态代理对象。

  ```java
  public class ServiceProxyFactory {
  
      /**
       * 根据服务类获取代理对象
       * @param serviceClass
       * @return
       * @param <T>
       */
      public static <T> T getProxy(Class<T> serviceClass){
          return (T) Proxy.newProxyInstance(
                  serviceClass.getClassLoader(),
                  new Class[]{serviceClass},
                  new ServiceProxy()
          );
      }
  }
  ```

- 最后，如果需要调用动态代理对象，如在 EasyConsumerExample 类中获取 UserService 的实现类，可以通过下方方式获取

  ```java
   //动态代理
   UserService userService = ServiceProxyFactory.getProxy(UserService.class);
  ```