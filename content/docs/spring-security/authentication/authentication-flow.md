---
title: 认证流程
---


在 Spring Security 中，判断一个用户（或请求）**“是否已认证”**，主要是看存放在 Security 上下文中的 **`Authentication` 对象的状态**。

## 核心判定条件

### 条件一：`SecurityContext` 中存在 `Authentication` 对象

用户请求到来时，Spring Security 会从当前线程的 `SecurityContextHolder` 中获取`Authentication`对象。如果为 `null`，显然未认证。

### 条件二：`authentication.isAuthenticated()` 返回 `true`

`Authentication` 接口有一个 `isAuthenticated()` 方法：

- **`false`**：未认证（通常是刚拿着用户名密码构造出来的 Token，准备传给 `AuthenticationManager` 校验）。
- **`true`**：已通过认证。



## 标准的认证流程

```java
// 1. 创建已经认证的 Token（传入 authorities 权限列表）
// 注意：使用带有 3 个参数的构造函数，内部会自动设置 authenticated = true
UsernamePasswordAuthenticationToken authentication = 
    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());


// 2. 放入安全上下文 —— 到这一步，Spring Security 才会正式认定该请求已认证！
SecurityContextHolder.getContext().setAuthentication(authentication);
```

UsernamePasswordAuthenticationToken 构造函数请参考[Authentication](../API/Authentication)
