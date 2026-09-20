---
title: "概述"
---

通用智能体接口

::: warning

大部分模型只兼容了ChatCompletionAPI，Responses API还未成为主流

:::

## 为什么引入 Responses API？

传统的 `Chat Completions` 是一种“一问一答”的无状态（Stateless）机制。要让模型调用工具（Function Calling），开发者必须：

1. 发送请求；
2. 拿到模型返回的 `tool_calls` 依赖；
3. **手动在本地执行函数**；
4. 将结果拼回数组，再次调用 Chat Completions。

**Responses API 的转变：** 它内置了**智能体循环（Agent Loop）**，把“上下文追溯”和“服务端内置工具（如 Web 搜索、文件检索、代码解释器）”直接沉淀到了 API 内部。



## 核心优势

### 1. 内置智能体循环（Agent Loop）

对于 OpenAI 托管的工具（如网络搜索 `web_search`、代码解释器 `code_interpreter`），Responses API 会在服务端自动完成“思考 $\rightarrow$ 调用工具 $\rightarrow$ 获取工具结果 $\rightarrow$ 继续思考”的闭环，直到输出最终答案。开发者无需手写多轮交互逻辑。  

### 2. 状态链与上下文复用 (`previous_response_id`)

Responses API 摒弃了每次都要上传完整历史对话数组（Message List）的方式。

你可以直接传入 `previous_response_id`，告诉 OpenAI“基于上一次的这个 Response 接着聊”，极大简化了多轮对话管理，并优化了 Token 缓存命中率。  

### 3. 多模态与多功能统一

- **原生支持模态：** 输入输出统一支持 Text、Image 等。
- **内置原生工具支持：** 包含 Web Search、File Search、Code Interpreter、Remote MCPs 等。  
- **原生结构化输出 (Structured Outputs)：** 直接通过 `response_format` 控制 JSON 映射。



## 请求与响应结构

### 请求

```json
{
  "model": "gpt-4o",
  "input": "查询一下最新的 AI 新闻，并输出为摘要。",
  "tools": [
    { "type": "web_search" } // 直接使用服务端内置工具
  ],
  "previous_response_id": "resp_abc123" // 链式关联上一轮上下文
}
```

### 响应体核心概念：多项输出

Responses API 将返回结果抽象为 **Item（条目）** 序列。一次 Response 可以包含多个不同类型的输出项（例如：一条思考过程、一次工具调用记录、最终的文本回复）。 

```json
{
  "id": "resp_xyz789",
  "object": "response",
  "status": "completed",
  "output_items": [
    {
      "type": "tool_call",
      "tool_name": "web_search",
      "args": { "query": "AI news" }
    },
    {
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "text",
          "text": "以下是今天最新的 AI 动态摘要..."
        }
      ]
    }
  ],
  "usage": {
    "prompt_tokens": 120,
    "completion_tokens": 350
  }
}
```

