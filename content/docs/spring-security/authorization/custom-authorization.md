---
title: 自定义鉴权
---


## 为什么不使用@PreAuthorize提供的方法

Spring Security 的 `@PreAuthorize` 本身就内置了 `hasAuthority()`、`hasRole()`、`hasAnyAuthority()` 等方法

出于**框架定制化、性能优化以及简化使用**的考虑

### Spring Security 原生表达式的局限与角色前缀问题

Spring Security 原生的 `hasRole('admin')` 在底层会自动寻找带有 `ROLE_` 前缀的权限标识（即匹配 `ROLE_admin`）。

### 整合Redis

可以从Redis中获取权限信息

### 简化权限校验

如果直接用 Spring Security 原生的权限校验，Spring 需要频繁去构建和转换 `GrantedAuthority` 集合。

```java
public boolean hasPermi(String permission) {
    if (StringUtils.isEmpty(permission)) {
        return false;
    }
    LoginUser loginUser = SecurityUtils.getLoginUser();
    if (StringUtils.isNull(loginUser) || CollectionUtils.isEmpty(loginUser.getPermissions())) {
        return false;
    }
    // 超级管理员直接放行
    return hasPermissions(loginUser.getPermissions(), permission);
}
```

### 实现超级管理员（Admin）的“一键放行”

在后台管理系统中，超级管理员（如 `admin` 账号）通常拥有所有权限。

**如果用原生 `@PreAuthorize("hasAuthority('system:user:add')")`**：必须给 admin 账号在数据库里绑定成百上千条具体的权限点，或者写很长的表达式如 `@PreAuthorize("hasRole('admin') or hasAuthority('system:user:add')")`。

**如果用若依的 `@ss.hasPermi(...)`**：若依在 `hasPermissions` 方法的第一行就可以写上：

```java
// 如果是超级管理员，直接返回 true，无需逐个比对权限标识
if (loginUser.getUser().isAdmin()) {
    return true;
}
```



## 自定义鉴权方法

在 Spring Security 的 `@PreAuthorize` 注解中，`@` 符号用来引用 Spring 容器中的 Bean

```java
@Service("ss")
public class PermissionService {
    // ... 权限校验的具体逻辑
}
```

使用 `@PreAuthorize` 的 **SpEL 调用 Spring Bean** （`@ss` 就是 Bean 的名字，取自SpringSecurity首字母），把具体的权限比对逻辑**委托**给了自己写的 `PermissionService`。

```java
// 检查当前登录用户是否拥有 'system:user:add' 权限
@PreAuthorize("@ss.hasPermi('system:user:add')")
@PostMapping
public AjaxResult add(@Validated @RequestBody SysUser user) {
    return toAjax(userService.insertUser(user));
}
```


