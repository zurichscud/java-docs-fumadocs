---
title: "流式输出"
---


## 非流式请求

```json
{
  "model": "xxx",
  "prompt": "介绍一下Spring Boot",
  "stream": false
}
```

```
客户端
  |
  | HTTP Request
  ↓
大模型服务
  |
  | 思考 + 生成完整答案
  |
  ↓
一次性返回
```

响应：

```json
{
  "id": "cmpl-xxx",
  "choices": [
    {
      "text": "Spring Boot 是一个基于 Spring 的快速开发框架..."
    }
  ]
}
```

拿到的就是完整字符串。但是等待时间会较长

##  流式请求

流式模式下，模型增量输出 JSON 内容。需在客户端拼接完整的 JSON 字符串后再解析，避免截断导致解析失败。

```json
{
  "model": "xxx",
  "prompt": "介绍一下Spring Boot",
  "stream": true
}
```

```
客户端
 |
 | Request
 ↓
大模型
 |
 | 生成 "Spring"
 ↓
立即返回
 |
 | 生成 " Boot"
 ↓
立即返回
 |
 | 生成 " 是一个..."
 ↓
立即返回
```

## SDK处理

流式**通常发送的是增量内容**，客户端可以自己拼接，形成完整的响应。不过有些 SDK 也会帮你封装

```
1
12
123
```

这种属于客户端层面的封装，不是 OpenAI 流协议本身。

