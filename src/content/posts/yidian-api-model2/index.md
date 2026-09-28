---
title: "一点API 使用教程(四十)：API 接口及模型说明"
published: 2026-09-29T00:19:53+08:00
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

gpt-5.5、gpt-image-2、gpt-5.6-terra、gpt-5.6-sol、gpt-6-astra、gpt-6-luna、gpt-6-sol

## 3、codex-pro分组

**可使用系列模型：**

gpt-5.4、gpt-5.5、gpt-image-2、gpt-image-2-all、gpt-5.6-terra、gpt-5.6-sol、gpt-6-astra、gpt-6-luna、gpt-6-sol

## ~~4、codex-vip分组 ~~

~~**可使用系列模型：**~~

~~gpt-6-astra~~

## 5、claude-code分组

**可使用系列模型：**

claude-opus-5、claude-sonnet-5、claude-haiku-4-5-20251001、claude-opus-4-8、claude-sonnet-4-6

**缓存：**

大多数时候没有缓存，缓存命中率约等于无

有缓存 60%左右

## 6、claude-code-pro分组

**可使用系列模型：**

claude-fable-5、claude-opus-5、claude-sonnet-5、claude-haiku-4-5-20251001、claude-opus-4-8、claude-sonnet-4-6

**缓存：**

有缓存 60%左右

**注：**

小额测试的不建议用1.5倍的分组，跑大型任务推荐用claude-code-pro分组

openclaw小龙虾的不建议选claude-code-pro分组！！！缓存的命中率比较低

## 7、claude-code-vip分组

**可使用系列模型：**

claude-fable-5-1、claude-fable-5、claude-opus-5、claude-sonnet-5、claude-haiku-4-5-20251001、claude-opus-4-8、claude-sonnet-4-6

**缓存：**

拥有 80~90%的高缓存命中率，走的都是比较优质的渠道，支持 1M 上下文，带缓存（缓存有命中率，并不是所有的都能命中）整体用起来会更顺、更稳定，体验感会好很多

## 8、zh分组 (国内模型)

**可使用系列模型：**

glm-5.3、deepseek/deepseek-flash、minimax-m3、kimi-k3、hy4-preview

# 三、作图模型说明

gpt-image-2、gpt-image-2-all 支持2K、4K作图

gpt-image-2在codex-student分组和codex-pro分组都可以用

gpt-image-2-all只能在codex-pro分组使用，速度会快一点

# 四、使用GPT模型的建议

- gpt-5.4：会自己看屏幕、动鼠标键盘，帮你操作电脑软件；写代码、做表格文档也行；干活省，记性长。

- gpt-5.5：更会自己拿主意，不用你一步步教；能自己计划、用工具、检查结果；复杂活能做完，成本还低不少。

- gpt-5.6-sol：这一档里最聪明的，适合难编程、科研、网络安全这类硬活。

- gpt-5.6-terra：日常干活用的，能力够，价格和速度比较平衡。

- ~~gpt-5.6-luna：便宜、快，适合大量普通任务。~~

- gpt-6-astra：最强的那款，自己操作电脑更熟练，深度思考强，做难任务更快。

- gpt-6-sol：日常主力，写代码、改代码、多步骤任务都行，准确又便宜。

- gpt-6-luna：最便宜最快，适合大批量摘要、提取、分类、问答。

- gpt-image-2：会画图，先想好再画；图里文字写得准，多国文字都行；能参考多张图，一次出多张风格一致的图。

- gpt-image-2-all：OpenAI 官方没这个单独名字，实际能力还是 gpt-image-2。只不过优化了线路，速度会快点。

一句话总结：越往后越强、越会自己办事；带 Luna 的偏便宜快，带 Sol/Terra/Astra 的偏能力、均衡和最强。图像模型重点是把图里的字画准。

按照价格来说：

gpt-6-astra > gpt-5.5 > gpt-5.6-sol > gpt-5.4 > gpt-5.6-terra > gpt-6-sol > gpt-6-luna
