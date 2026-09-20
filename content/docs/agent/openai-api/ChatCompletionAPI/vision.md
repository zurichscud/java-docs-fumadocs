---
title: "图片理解"
---

图片理解模型可以根据您传入的图片进行回答，支持图片 URL 和 Base64 编码两种传入方式，适用于图片描述、分类等场景。

```sh
curl --location --request POST 'https://api.xiaomimimo.com/v1/chat/completions' \
--header "api-key: $MIMO_API_KEY" \
--header "Content-Type: application/json" \
--data-raw '{
    "model": "mimo-v2.5",
    "messages": [
        {
            "role": "system",
            "content": "You are MiMo, an AI assistant developed by Xiaomi. Today is date: Tuesday, December 16, 2025. Your knowledge cutoff date is December 2024."
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example-files.cnbj1.mi-fds.com/example-files/image/image_example.png"
                    }
                },
                {
                    "type": "text",
                    "text": "please describe the content of the image"
                }
            ]
        }
    ],
    "max_completion_tokens": 1024
}'
```

## 图片传入方式

- 图片 URL 传入：需提供公网可访问的图片 URL 地址。
- Base64 编码传入：将图片转换为 Base64 编码字符串后再传入。

## 多图输入

支持同时传入多张图像的公网 URL 或 Base64 编码字符串，模型能够解析图像内容并返回贴合图像语义的回复。

```sh
curl --location --request POST 'https://api.xiaomimimo.com/v1/chat/completions' \
--header "api-key: $MIMO_API_KEY" \
--header "Content-Type: application/json" \
--data-raw '{
    "model": "mimo-v2.5",
    "messages": [
        {
            "role": "system",
            "content": "You are MiMo, an AI assistant developed by Xiaomi. Today is date: Tuesday, December 16, 2025. Your knowledge cutoff date is December 2024."
        },
        {
            "role": "user",
            "content": [
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example-files.cnbj1.mi-fds.com/example-files/image/image_example.png"
                    }
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "data:{MIME_TYPE};base64,$BASE64_IMAGE"
                    }
                },
                {
                    "type": "text",
                    "text": "please describe the connections and differences between these two pictures"
                }
            ]
        }
    ],
    "max_completion_tokens": 1024
}'
```





## 注意事项

只有多模态模型才支持图片的输入。