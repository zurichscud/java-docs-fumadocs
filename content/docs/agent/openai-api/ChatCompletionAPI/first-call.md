---
title: "首次调用"
---

 聊天接口，API文档可参考 [deepseek官方文档](https://api-docs.deepseek.com/zh-cn/api/create-chat-completion)

```sh
curl -X POST 'https://tokenhub.tencentmaas.com/v1/chat/completions' \
  -H 'Authorization: Bearer sk秘钥' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "deepseek-v4-flash-202605",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "你好"}
    ],
    "stream": false
  }'
```



```json
{
    "id": "608388e6-a547-4954-8a5a-bec776a6f430",
    "object": "chat.completion",
    "model": "deepseek-v4-flash-202605",
    "created": 1785719505,
    "choices": [
        {
            "index": 0,
            "message": {
                "role": "assistant",
                "content": "你好！很高兴见到你，有什么可以帮你的吗？😊",
                "reasoning_content": "用户友好地打招呼，我也应该用同样友好热情的方式回应，并表明可以提供帮助。可以用中文回复，简洁自然些，加上表情符号显得更亲切。"
            },
            "finish_reason": "stop",
            "logprobs": null
        }
    ],
    "usage": {
        "prompt_tokens": 90,
        "completion_tokens": 49,
        "total_tokens": 139,
        "prompt_tokens_details": {
            "cached_tokens": 0
        },
        "completion_tokens_details": {
            "reasoning_tokens": 34
        }
    }
}
```





## id

一次模型调用的唯一 ID。

用途：

- 日志追踪
- 排查问题
- 统计调用情况

## object

```
"object":"chat.completion"
```

OpenAI 体系中常见：

| object                | 含义         |
| --------------------- | ------------ |
| chat.completion       | 普通聊天完成 |
| chat.completion.chunk | 流式返回块   |
| embedding             | 向量结果     |

## model

实际使用的模型

## created

Unix 时间戳，表示请求创建时间

```json
"created":1785719505
```

## choices

一次请求可以要求多个回答，可能返回：

```json
choices:[
  {
    index:0,
    message:{...}
  },
  {
    index:1,
    message:{...}
  },
  {
    index:2,
    message:{...}
  }
]
```

### index

`"index":0`表示第一个回答。



### message

```json
"message":{
    "role":"assistant",
    "content":"你好！很高兴见到你，有什么可以帮你的？😊",
    "reasoning_content":"..."
}
```

- role

消息是由哪个角色生成的，常见role取值：

| role      | 来源     |
| --------- | -------- |
| system    | 系统提示 |
| user      | 用户     |
| assistant | 模型     |

- content

真正给用户看的内容

- reasoning_content

模型思考过程

```json
"reasoning_content":
"用户友好地打招呼，我也应该..."
```

### finish_reason

表示生成结束原因。

常见：

| 值             | 含义              |
| -------------- | ----------------- |
| stop           | 正常结束          |
| length         | 达到最大token限制 |
| content_filter | 内容过滤          |
| tool_calls     | 调用工具          |



## usage

Token统计。

```json
"usage":{
 "prompt_tokens":90,
 "completion_tokens":49,
 "total_tokens":139
}
```

### prompt_tokens

输入消耗量，包括：

- system prompt
- 用户问题
- 历史聊天



### completion_tokens

输出消耗量，包括：

- content
- reasoning（部分模型）

### total_tokens

总消耗量

### prompt_tokens_details

prompt_tokens中的具体消耗



### completion_tokens_details

completion_tokens中具体消耗

```json
"completion_tokens_details":{
    "reasoning_tokens":34
}
```

