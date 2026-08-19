---
title: 验证码登录
---

```
用户输入手机号
        |
        v
请求发送验证码
        |
        v
验证码服务生成验证码
        |
        +----> 保存验证码(缓存)
        |
        +----> 调用短信平台发送
        |
        v
用户输入验证码
        |
        v
后端校验验证码
        |
        v
查询/创建用户
        |
        v
生成登录凭证(Token)
        |
        v
返回前端
```



## 发送验证码接口

```http
POST /auth/send-code
{
  "phone": "13800138000"
}
```

### 第一步：限制频率

在Redis记录发送验证码的手机号，并设置有效期，防止短信轰炸。

```
Key                         Value    TTL
------------------------------------------------
sms:limit:13800138000       1        60秒
```



### 第二步：生成验证码

```java
String code = RandomUtil.randomNumbers(6);
```

### 第三步：保存验证码

一般 存储于 Redis，并设置有效期

```
Key                         Value    TTL
------------------------------------------------
sms:login:13800138000       392841   300
```



### 第四步：发送短信

例如：

- 阿里云短信
- 腾讯云短信
- Twilio

```java
【公司名】您的验证码是392841，5分钟内有效。
```

## 验证验证码接口

```http
POST /auth/login/code
{
  "phone": "13800138000",
  "code": "392841"
}
```

### 查询 Redis

```java
String realCode =
 redis.get("sms:login:" + phone);
```

比较：

```java
if (!code.equals(realCode)) {
    throw new Exception("验证码错误");
}
```

### 删除验证码

验证成功后：

```java
redis.delete("sms:login:" + phone);
```

防止重复使用。

### 用户处理

方案一：必须先注册

```
手机号
 |
查询用户
 |
不存在
 |
提示注册
```

方案二：自动注册（现在更常见）

```
手机号
 |
查询用户
 |
不存在
 |
创建用户
```

###  登录成功返回 Token

创建Token返回前端即可

