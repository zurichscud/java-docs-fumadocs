---
title: "概述"
---

## Chat Completions API

早期设计，核心围绕「聊天」。也就是传统 ChatGPT 对话格式。

```json
{
  "model": "gpt-4o",
  "messages": [
    {
      "role": "system",
      "content": "你是一个专业的技术顾问，回答要求简洁明了。"
    },
    { "role": "user", "content": "什么是 Redis 的穿透、击穿和雪崩？" }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

## Responses API

> **OpenAI 用于生成模型响应的最先进接口。**

OpenAI 推出的 **Responses API**是作为传统 Chat Completions API下一代演进接口。
它的核心定位是**为 AI Agent而生的统一接口**。

- 支持文本和图像输入，并生成文本输出。
- 可以创建与模型的**有状态交互（stateful interactions）**，即将之前响应的输出作为后续请求的输入。
- 通过内置工具扩展模型能力，例如**文件搜索（file search）**、**网页搜索（web search）**、**计算机操作（computer use）** 等。
- 通过函数调用（function calling），允许模型访问外部系统和数据。

## 对比

|                  | Chat Completions | Responses   |
| ---------------- | ---------------- | ----------- |
| 发布时间         | 早               | 新          |
| 定位             | 聊天             | Agent       |
| 输入             | messages         | input       |
| 输出             | choices          | output      |
| 多轮             | 自己维护         | response_id |
| 工具调用         | 手动编排         | 原生支持    |
| Function Calling | 支持             | 支持增强版  |
| MCP              | 弱               | 原生方向    |
| 文件             | 有限             | 更自然      |
| Agent            | 一般             | 推荐        |
| 未来方向         | 维护             | 主推        |
