---
title: 3、接口Mock
author:
createTime: 2024/05/18 15:46:04
permalink: /myRpc/Mock/
---
# 接口Mock



## 一、需求分析

### 1、什么是Mock？

​		RPC 框架的核心功能是调用其他远程服务。但是在实际开发和测试过程中，有时可能无法直接访问真实的远程服务，或者访问真实的远程服务可能会产生不可控的影响，例如网络延迟、服务不稳定等。在这种情况下，就可以使用 mock 服务来模拟远程服务的行为，以便进行接口的测试、开发和调试。

### 2、使用Mock的原因

​		虽然 mock 服务并不是 RPC 框架的核心能力，但是它的开发成本并不高。而且给 RPC 框架支持 mock后，开发者就可以轻松调用服务接口、跑通业务流程，不必依赖真实的远程服务，提高使用体验。



## 二、实现思路

​		通过动态代理创建一个**调用方法时返回固定值**的对象。



## 三、开发实现

 1、 首先支持开发者通过修改配置文件的方式开启 mock，那么首先给全局配置类 rpcconfig新增 mock字段，默认值为 false。

``` java
/**
* 模拟调用
*/
private boolean mock = false;
```

2、在 proxy 包下创建 MockServiceProxy 类，用于实现生成 mock 代理服务。在该类中提供一个根据服务接口类型返回固定值的方法。

```java
@Slf4j
public class MockServiceProxy implements InvocationHandler {

    /**
     * 调用代理
     * @param proxy
     * @param method
     * @param args
     * @return
     * @throws Throwable
     */
    @Override
    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {
        Class<?> methodReturnType = method.getReturnType();
        log.info("mock invoke {}",method.getName());
        return getDefaultObject(methodReturnType);
    }

    /**
     *
     * @param type
     * @return
     */
    private Object getDefaultObject(Class<?> type){
        //基本类型
        if(type.isPrimitive()){
            if(type == boolean.class){
                return false;
            } else if (type == short.class) {
                return (short) 0;
            } else if (type == int.class) {
                return 0;
            } else if (type == long.class) {
                return 0L;
            }
        }
        //对象类型
        return null;
    }
}
```

3、给 ServiceProxyFactory 服务代理工厂新增获取 mock 代理对象的方法 getMockProxy 。通过读取已定义的全局配置 mock 来区分创建哪种代理对象。

```java
public class ServiceProxyFactory {

    /**
     * 根据服务类获取代理对象
     * @param serviceClass
     * @return
     * @param <T>
     */
    public static <T> T getProxy(Class<T> serviceClass){
        if(RpcApplication.getRpcConfig().isMock()){
            return getMockProxy(serviceClass);
        }
        return (T) Proxy.newProxyInstance(
                serviceClass.getClassLoader(),
                new Class[]{serviceClass},
                new ServiceProxy()
        );
    }

    /**
     * 根据服务类获取 Mock 对象
     * @param serviceClass
     * @return
     * @param <T>
     */
    private static <T> T getMockProxy(Class<T> serviceClass) {
        return (T) Proxy.newProxyInstance(
                serviceClass.getClassLoader(),
                new Class[]{serviceClass},
                new MockServiceProxy()
        );
    }
}
```



