---
title: "对话前缀续写"
---

**对话前缀续写（Conversation Prefix Continuation）** 是一种让模型**基于已有对话开头（前缀）继续生成内容**的能力。

简单理解：

> 你给模型一段已经确定的内容，让模型从这个位置继续往下写。

## 为什么需要这个功能

因为 LLM 本质就是：输入文本 → 预测下一个Token。

例如：

输入：

```
今天天气
```

模型预测：

```
很好
```

输入：

```
今天天气很好，我准备
```

模型预测：

```
出去旅游
```

所以前缀续写其实更接近模型最原始的能力。

## 强制控制输出格式

大模型有时不会严格遵循格式要求，通过预设前缀可以“逼”模型直接按照所需格式输出，避免多余的解释。

| **方式**     | **传入的内容**                                               | **模型最终的输出效果**                                       |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **普通对话** | **User**: 请用 JSON 返回用户数据。                           | **Assistant**: 好的，这是您需要的 JSON 数据： `{"name": "Alice", "age": 25}` |
| **前缀续写** | **User**: 请用 JSON 返回用户数据。 **Assistant 前缀**: `{\n  "status": "success",` | **Assistant 续写部分**: `\n  "data": {\n    "name": "Alice",\n    "age": 25\n  }\n}` |

### Prompt限制

```json
{
  "model": "gpt-5",
  "messages": [
    {
      "role": "system",
      "content": "你是天气助手，只允许输出JSON，不允许输出任何解释文字。"
    },
    {
      "role": "user",
      "content": "查询北京今天的天气"
    }
  ]
}
```

模型输出：

```json
{
  "city": "北京",
  "weather": "晴",
  "temperature": {
    "high": 32,
    "low": 24
  },
  "humidity": 40
}
```

模型可能偶尔输出：

```json
好的，天气如下：

{
  "city": "北京"
}
```

**因为 Prompt 不是强约束。**

```json
{
  "model": "gpt-5",
  "messages": [
    {
      "role": "user",
      "content": "查询北京今天的天气"
    },
    {
      "role": "assistant",
      "content": "根据查询结果，天气信息如下：\n```json\n{\n"
    }
  ]
}
```

这里第二条消息就是**助手前缀（assistant prefix）**。

你告诉模型：

> 助手已经开始回答了，并且已经输出到 `{`，请继续。

模型续写：

```json
"city": "北京",
"weather": "晴",
"temperature": {
  "high": 32,
  "low": 24
},
"humidity": 40
}
```

最终拼接：

```json
{
  "city": "北京",
  "weather": "晴",
  "temperature": {
    "high": 32,
    "low": 24
  },
  "humidity": 40
}
```

::: tip

如果需要 100% 合法 JSON，需要配合 Structured Outputs / JSON Schema。

:::