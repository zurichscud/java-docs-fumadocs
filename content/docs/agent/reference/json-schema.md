---
title: "JSON Schema"
---

JSON Schema 是一种**用来描述和验证 JSON 数据结构的标准规范**。你可以把它理解成 **JSON 的“类型定义”或“数据合同（contract）”**。

## Example

```json
{
  "name": "Alice",
  "age": 20,
  "email": "alice@example.com"
}
```

对应的 JSON Schema：

```json
{
  "type": "object",
  "properties": {
    "name": {
      "type": "string"
    },
    "age": {
      "type": "integer",
      "minimum": 0
    },
    "email": {
      "type": "string",
      "format": "email"
    }
  },
  "required": ["name", "age"]
}
```

## usage

交给LLM写即可