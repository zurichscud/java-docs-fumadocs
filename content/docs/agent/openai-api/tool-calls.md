---
title: "Tool Calls"
---

**让大模型不要直接回答，而是在需要时生成一个“调用工具的请求”，你的程序执行这个工具，再把结果返回给模型，让模型继续生成最终答案。**

它是 Agent 的核心能力之一。

## 对比

### 普通 LLM 调用

用户：

> 北京今天多少度？

模型：

> 北京今天25℃。

问题：

模型其实不知道实时天气。

### 加入 Tool Calls 后

用户：

> 北京今天多少度？

模型：

```
我要调用 get_weather
参数:
{
  "city": "北京"
}
```

你的代码执行：

```
weatherService.getWeather("北京");
```

返回：

```
{
  "city":"北京",
  "temperature":28,
  "weather":"晴"
}
```

再交给模型：

模型：

> 北京今天晴，气温28℃。

## 请求参数

tools：模型可能会调用的 tool 的列表。目前，仅支持 function 作为工具。

- description：function 的功能描述，供模型理解何时以及如何调用该 function。

- name：要调用的 function 名称。必须由 a-z、A-Z、0-9 字符组成，或包含下划线和连字符，最大长度为 64 个字符。

- parameters：function 的输入参数，以 JSON Schema 对象描述。

## 定义Tool Call

### 定义工具

```json
{
  "type": "function",
  "name": "get_weather",
  "description": "查询城市天气",
  "parameters": {
    "type": "object",
    "properties": {
      "city": {
        "type": "string",
        "description": "城市名称"
      }
    },
    "required": [
      "city"
    ]
  }
}
```

告诉模型如果需要查天气，你可以生成这个格式。

### 模型返回 Tool Call

用户：

```
上海天气怎么样？
```

模型返回：

```
{
  "type": "function_call",
  "name": "get_weather",
  "arguments": {
    "city":"上海"
  }
}
```

::: warning

模型没有执行函数。它只是说：我要调用这个函数。

:::

### 函数执行

你的后端收到：

```json
{
"name":"get_weather",
"arguments":{
 "city":"上海"
}
}
```

然后由你去组织函数的调用得到函数调用结果

```json
{
 "city":"上海",
 "temperature":30,
 "weather":"多云"
}
```

### 把结果告诉模型

函数调用的返回值需要返回给LLM：

```json
{
"type":"function_call_output",
"call_id":"xxx",
"output":{
 "city":"上海",
 "temperature":30,
 "weather":"多云"
}
}
```

模型最终输出：

```json
上海今天多云，气温30℃。
```

## Example

### 请求

```json
{
  "model": "gpt-5",
  "messages": [
    {
      "role": "user",
      "content": "北京天气怎么样？"
    }
  ],
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_weather",
        "description": "查询城市天气",
        "parameters": {
          "type": "object",
          "properties": {
            "city": {
              "type": "string",
              "description": "城市名称"
            }
          },
          "required": [
            "city"
          ]
        }
      }
    }
  ]
}
```

### 响应

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1785719505,
  "model": "gpt-5",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": null,
        "tool_calls": [
          {
            "id": "call_001",
            "type": "function",
            "function": {
              "name": "get_weather",
              "arguments": "{\"city\":\"北京\"}"
            }
          }
        ]
      },
      "finish_reason": "tool_calls"
    }
  ]
}
```

### 调用函数

模型只返回函数名和参数，真正调用函数需要你的应用层完成。

你可以：

```java
if(name.equals("get_weather")){
    getWeather();
}

if(name.equals("query_order")){
    queryOrder();
}
```

但是 Agent 项目会做成：

```json
ToolRegistry
      |
      +-- weatherTool
      |
      +-- databaseTool
      |
      +-- searchTool
      |
      +-- emailTool
```

这也是 LangChain、Spring AI、Dify、各种 Agent 框架内部做的事情。