---
title: 请求上下文
---


**在 Spring Security 的默认设计中，每个请求都会有一个对应的 `SecurityContext`**。


SecurityContext的创建是由SecurityContextHolderFilter管理的

```java
SecurityContextHolder
        |
        | 委托
        v
SecurityContextHolderStrategy
        |
        | 管理
        v
SecurityContext
        |
        | 保存
        v
Authentication
```



## Session场景

```java
请求
 |
SecurityContextHolderFilter
 |
从Session读取
 |
SecurityContext
 |
Authentication
 |
Controller
```



## JWT场景

```java
JwtAuthenticationFilter
        |
        v
解析JWT
        |
        v
创建Authentication
        |
        v
SecurityContextHolder.setAuthentication()
```


