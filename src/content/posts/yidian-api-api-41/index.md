---
title: "一点API 使用教程(四十一)：API 接口及模型说明"
published: 2026-11-26T10:51:47+08:00
description: "一、一点API URL说明"
image: ""
tags: ["API"]
category: "API 服务"
draft: false
---

# 一、一点API URL说明

如果是OpenAI 的协议（供应商）的url为：

https://api.yidianhub.com/v1

如是Anthropic的协议（供应商）的url**为：**

https://api.yidianhub.com

如果是codex同时访问GPT模型和国内模型 的url为：

https://api.yidianhub.com/codex/v1

# 二、一点API模型使用说明

## 1、default分组

**该分组提供免费模型，可供体验使用，可使用的模型有：**

agnes-1.5-flash、agnes-2.0-flash、agnes-video-v2.0，agnes-image-2.0-flash、agnes-image-2.1-flash

## 2、codex-student分组 (专为学生提供的分组)

**可使用系列模型：**

gpt-5.5、gpt-image-2、gpt-5.6-terra、gpt-5.6-sol、gpt-6-astra、gpt-6-luna、gpt-6-sol、gpt-6.1-terra、gpt-6.1-sol、gpt-6.2-sol、gpt-6.2-astra

## 3、codex-pro分组

**可使用系列模型：**

gpt-5.4、gpt-5.5、gpt-image-2、gpt-image-2-all、gpt-5.6-terra、gpt-5.6-sol、gpt-6-astra、gpt-6-luna、gpt-6-sol、gpt-6.1-sol、gpt-6.2-sol、gpt-6.2-astra

## ~~4、codex-vip分组 ~~

~~**可使用系列模型：**~~

~~gpt-6-astra~~

## 5、claude-code分组

**可使用系列模型：**

claude-opus-5、claude-opus-5-5、claude-sonnet-5、claude-sonnet-5-5、claude-haiku-4-5-20251001、claude-haiku-5-5、claude-opus-4-8、claude-sonnet-4-6

**缓存：**

大多数时候没有缓存，缓存命中率约等于无

有缓存 60%左右

## 6、claude-code-pro分组

**可使用系列模型：**

claude-fable-5、claude-opus-5、claude-opus-5-5、claude-sonnet-5、claude-sonnet-5-5、claude-haiku-4-5-20251001、claude-haiku-5-5、claude-opus-4-8、claude-sonnet-4-6

**缓存：**

有缓存 60%左右

**注：**

小额测试的不建议用1.5倍的分组，跑大型任务推荐用claude-code-pro分组

openclaw小龙虾的不建议选claude-code-pro分组！！！缓存的命中率比较低

## 7、claude-code-vip分组

**可使用系列模型：**

claude-fable-5-2、claude-fable-5-1、claude-fable-5、claude-opus-5、claude-opus-5-5、claude-sonnet-5、claude-sonnet-5-5、claude-haiku-4-5-20251001、claude-opus-4-8、claude-sonnet-4-6

**缓存：**

拥有 80~90%的高缓存命中率，走的都是比较优质的渠道，支持 1M 上下文，带缓存（缓存有命中率，并不是所有的都能命中）整体用起来会更顺、更稳定，体验感会好很多

## 8、zh分组 (国内模型)

**可使用系列模型：**

glm-5.3、glm‑5.3‑flash、deepseek/deepseek-flash、minimax-m3、kimi-k3、hy4-preview

## 9、生图模型分组 (生图专用)

gpt-image-2、**gpt-image-2-2k、gpt-image-2-4k**

**gpt-image-2.5**、**gpt-image-2.5-ext-2k**、**gpt-image-2.5-ext-4k**

gpt-image-2.5-flare、gpt-image-2.5-flare-adobe、**gpt-image-2.5-sunburst**、gpt-image-2.5-sunburst-adobe

gpt-image-2.6、**gpt-image-2.6-flare-adobe、gpt-image-2.6-sunburst-adobe**

gemini-3-pro-image-preview、gemini-3.1-flash-image-preview、gemini-nano-banana-2.1

# 三、作图模型说明

gpt-image-2、gpt-image-2-all 支持2K、4K作图

gpt-image-2在codex-student分组和codex-pro分组都可以用

gpt-image-2-all只能在codex-pro分组使用，速度会快一点

# 四、使用GPT模型的建议

已经按照价格从高到低排列：

`gpt-6-astra`：高端复杂推理、编码、研究、电脑操作、文档

`gpt-6.2-astra`：当前旗舰，适合最难的专业项目、多代理协作

`gpt-5.5`：复杂专业工作、编码、研究、分析、文档

`gpt-5.6-sol`：GPT-5.6 旗舰，专业能力强，效率较高

`gpt-5.4`：经济型专业模型，长上下文、多步代理

`gpt-5.6-terra`：智能与成本平衡，约为 mini 档定位

`gpt-5.6-luna`~~：便宜、快，适合大量普通任务。~~

`gpt-6.2-sol`：日常工作、编码、大规模 Agent

`gpt-6.1-sol`：复杂编码、电脑操作和专业工作

`gpt-6-sol`：复杂编码和 Agent 工作流

`gpt-6.1-terra`：图像理解、电脑操作、文本起草与修改

`gpt-6-luna`：高频、批量、边界清晰的任务
