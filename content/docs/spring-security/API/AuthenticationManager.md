---
title: AuthenticationManager
---


它的主要职责是接收一个未认证的认证请求对象，经过校验后，返回一个包含用户完整权限信息的、已被认证的认证对象（或者在认证失败时抛出异常）。  

## 接口定义

```java
public interface AuthenticationManager {

  //给我一个未认证的 Authentication，我帮你认证，返回已认证的 Authentication。
    Authentication authenticate(Authentication authentication)
            throws AuthenticationException;

}
```

输入与输出流向：

1. **输入参数**：一个处于 **未认证状态** 的 `Authentication` 对象（例如，仅包含客户端传来的 `username` 和 `password`，`isAuthenticated() == false`）。  
2. **处理逻辑**：根据凭证信息（密码、Token 等）进行校验。
3. **返回结果**：
   - **认证成功**：返回一个 **已认证状态** 的 `Authentication` 对象（内部填充了用户的权限集合 `Authorities` 以及主体信息 `Principal`，且 `isAuthenticated() == true`）。  
   - **认证失败**：抛出 `AuthenticationException`（如 `BadCredentialsException` 密码错误，或 `DisabledException` 账号被禁用）。
   - **无法处理**：抛出异常或返回 `null`（在组合架构中传递给下一个处理者）。

## ProviderManager

ProviderManager 是 AuthenticationManager 的默认实现
