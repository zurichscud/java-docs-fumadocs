---
title: "结构化输出"
---

结构化输出（JSON 模式）让模型按照指定的 JSON 格式生成响应，确保输出可控、可解析。适用于数据提取、表单填充、分类标签输出、API 响应格式化等需要结构化数据的场景。

## 请求参数

- `response_format`：响应格式控制参数，传入 `{"type": "json_object"}` 开启 JSON 模式输出能力。
- `messages`：需在系统消息或用户消息中明确告知模型：要求只返回 JSON 并且完整定义返回 JSON 的字段、层级、数据类型，附带示例更佳。

## Example

**基础调用**

```sh
curl --location --request POST 'https://api.xiaomimimo.com/v1/chat/completions' \
--header "api-key: $MIMO_API_KEY" \
--header "Content-Type: application/json" \
--data-raw '{
    "model": "mimo-v2.5-pro",
    "messages": [
        {
            "role": "system",
            "content": "You are MiMo, an AI assistant developed by Xiaomi. Today is date: Tuesday, December 16, 2025. Your knowledge cutoff date is December 2024.\nDo not add any explanations outside JSON. Parse meeting information and return nested structured JSON: {\"meeting_meta\": {\"meeting_topic\": string | null, \"start_time\": string | null, \"participants\": array<string>}, \"action_items\": [{\"task\": string, \"responsible_person\": string, \"deadline\": string}]}\nFill null for unknown fields."
        },
        {
            "role": "user",
            "content": "Product iteration meeting at 14:00 tomorrow. Attendees: Li Ming, Wang Hua. Task: Complete API document revision by Friday, taken by Wang Hua."
        }
    ],
    "response_format": {
        "type": "json_object"
    }
}'
```

**响应示例**

```json
{
    "id": "aab2aec351654c1c9638d23d1ec2366e",
    "choices": [
        {
            "finish_reason": "stop",
            "index": 0,
            "message": {
                "content": "{\n  \"meeting_meta\": {\n    \"meeting_topic\": \"Product iteration meeting\",\n    \"start_time\": \"14:00 tomorrow\",\n    \"participants\": [\"Li Ming\", \"Wang Hua\"]\n  },\n  \"action_items\": [\n    {\n      \"task\": \"Complete API document revision\",\n      \"responsible_person\": \"Wang Hua\",\n      \"deadline\": \"Friday\"\n    }\n  ]\n}",
                "role": "assistant",
                "tool_calls": null
            }
        }
    ],
    "created": 1781609716,
    "model": "mimo-v2.5-pro",
    "object": "chat.completion",
    "usage": {
        "completion_tokens": 89,
        "prompt_tokens": 161,
        "total_tokens": 250,
        "completion_tokens_details": {
            "reasoning_tokens": 0
        },
        "prompt_tokens_details": {}
    }
}
```

## 如何获得准确的 JSON 输出

### 问题提出

`json_object` 模式仅能保证输出语法合法的 JSON，最终返回的数据结构完全由提示词定义。提示词定义越清晰、约束越完整，模型无需自主推测，输出的 JSON 结构就越贴合预期。

```json
{
  "model": "gpt-5",
  "response_format": {
    "type": "json_object"
  },
  "messages": [
    {
      "role": "user",
      "content": "返回用户信息，包括姓名和年龄"
    }
  ]
}
```

你希望得到：

```json
{
  "name": "张三",
  "age": 20
}
```

但是模型可能返回：

```json
{
  "username": "张三",
  "years": 20
}
```

```json
{
  "user": {
    "name": "张三",
    "age": 20
  }
}
```



这些都是合法 JSON，所以 json_object 都认为正确。

### 最佳实践

 **1. 强制仅输出 JSON**

明确要求「只返回 JSON，不附带任何解释、注释、Markdown 代码块」，防止多余文本导致解析报错。

 **2. 提供完整 JSON Schema**

提供输出的JSON Schema，并且搭配示例更易约束模型：

```json
{
  "name": string,
  "count": number,
  "tags": string[],
  "date": "YYYY-MM-DD"
}
```



 **3. 限定枚举值与数值范围**

- 固定选项可用枚举标注：`"status": "active" | "inactive" | "pending"`
- 数值限定区间：`score: number (0-100)`

 **4. 约定空值处理规则**

提前说明未知信息统一填充 `null`

例如提示词写明：未知字段请填充 `null`。

**5. 确保 JSON 输出可靠**

开启 `json_object` 模式仅能保障输出语法合法的 JSON，无法约束返回字段、数据类型与预设结构完全匹配。线上生产环境推荐搭配 `jsonschema` 库对模型输出进行强制结构校验；若校验不通过，可执行重试强化提示词、业务降级等兜底逻辑。

**6.需要合理设置 `max_tokens` 参数**

防止 JSON 字符串被中途截断。

**7.API 有概率会返回空的 content**

设置好兜底措施

### Example

```json
import json
import os
from jsonschema import validate, ValidationError
from openai import OpenAI

client = OpenAI(
    api_key=os.environ.get("MIMO_API_KEY"),
    base_url="https://api.xiaomimimo.com/v1"
)

ticket_schema = {
    "type": "object",
    "properties": {
        "problem_type": {
            "type": "string",
            "enum": ["device_fault", "consult", "complaint", "other"]
        },
        "device_model": {"type": ["string", "null"]},
        "urgent_level": {
            "type": "string",
            "enum": ["low", "normal", "high"]
        },
        "user_requirements": {"type": "array", "items": {"type": "string"}}
    },
    "required": ["problem_type", "device_model", "urgent_level", "user_requirements"]
}

def extract_ticket(text: str):
    sys_prompt = (
        "You are MiMo, an AI assistant developed by Xiaomi. Today is date: Tuesday, December 16, 2025. Your knowledge cutoff date is December 2024.\n"
        "Return JSON only, no explanations, no extra text.\n"
        "Format: {\"problem_type\":\"device_fault|consult|complaint|other\",\"device_model\":string|null,\"urgent_level\":\"low|normal|high\",\"user_requirements\":array<string>}\n"
        "Fill null if device model is unknown."
    )
    messages = [
        {"role": "system", "content": sys_prompt},
        {"role": "user", "content": text}
    ]

    resp = client.chat.completions.create(
        model="mimo-v2.5-pro",
        messages=messages,
        response_format={"type": "json_object"},
        stream=False
    )
    json_text = resp.choices[0].message.content
    data = json.loads(json_text)

    try:
        validate(instance=data, schema=ticket_schema)
        return {"ok": True, "data": data}
    except ValidationError as e:
        return {"ok": False, "error": e.message, "raw": data}

if __name__ == "__main__":
    # Test with two sample tickets
    input_list = [
        "My speaker can't connect Wi-Fi, I restarted it but no use, hope to solve quickly, don't know the model.",
        "Want to ask how to set timing function, device model is Watch S1, no urgent demand."
    ]

    for idx, text in enumerate(input_list, 1):
        print(f"==== Ticket {idx} extraction result ====")
        res = extract_ticket(text)
        if res["ok"]:
            print(json.dumps(res["data"], indent=4))
        else:
            print(f"Validation failed: {res['error']}")
```

