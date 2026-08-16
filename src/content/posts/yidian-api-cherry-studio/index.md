---
title: "一点API 使用教程(十四)：Cherry Studio 使用教程"
published: 2026-08-16T15:49:01+08:00
description: "1 下载安装Cherry Studio"
image: "./images/01.png"
tags: ["CherryStudio"]
category: "API 服务"
draft: false
---

# 1 下载安装Cherry Studio

为避免下载到流氓软件等等，建议上 [Cherry Studio官网（](https%3A%2F%2Fwww.cherry-ai.com%2Fdownload)[https://www.cherry-ai.com/download](https%3A%2F%2Fwww.cherry-ai.com%2Fdownload)[）](https%3A%2F%2Fwww.cherry-ai.com%2Fdownload) 进行软件的下载。

打开网页后如图，选择自己的系统（Windows / MacOs / Linux），然后进行下载安装即可。

![image](images/01.png)

直接默认点击右下角下一步，直至安装完成即可

![image](images/02.png)

![image](images/03.png)

# 2 配置API

## 一键配置

首先打开我们的 [官网 ](https%3A%2F%2Flanyiapi.com)[https://api.yidianhub.com](https%3A%2F%2Flanyiapi.com)。然后选择“令牌管理”，在任意你已经建立好的令牌右边，点击“聊天”旁边的小三角。

![image](images/04.png)

在弹出的窗口中，点击确认，打开CherryStudio

![image](images/05.png)

随后会自动唤起跳转到 CherryStudio 里面，点击添加即可。如果成功，就可以直接跳到 第三步 配置模型。

![image](images/06.png)

## 传统配置

打开CherryStudio后，点击右上角的齿轮，进入设置界面。

![image](images/07.png)

随后点击添加按钮，添加我们的模型和配置

![image](images/08.png)

提供商选择OpenAI 即可。

![image](images/09.png)

随后选择提供商并进行配置 API密钥 和 API地址

![image](images/10.png)

API地址：

https://api.yidianhub.com

## 2-1）补充说明

点击**“检测”**，模型跑不通有时候是软件的问题，需要实际配置完上对话框对话，看看是否报错才知道是否配置成功。

# 3 配置模型

然后在 模型 - 管理中，选择我们蓝移API支持的模型

![image](images/11.png)

![image](images/12.png)

添加后如下图所示，然后回到首页测试一下我们添加好的模型

![image](images/13.png)

![image](images/14.png)

![image](images/15.png)

随便输入点文案，有回复即可正常使用

![image](images/16.png)

# 4 支持的模型

```
#Haiku
  claude-haiku-4-5-20251001
  
#Sonnet
  claude-3-7-sonnet-20250219-thinking
  claude-sonnet-4-20250514-thinking
  claude-sonnet-4-5-20250929-thinking
  claude-sonnet-4-5-20250929
  claude-sonnet-4-6

#Opus  
  claude-opus-4-5-20251101-thinking
  claude-opus-4-5-20251101
  claude-opus-4-6
  claude-opus-4-7

#codex-gpt #codex分组需要使用OpenAI供应商（responses完整路径）
  gpt-5.5
  gpt-image-2
```

---

# 5 实际测试

![image](images/17.png)

# 6 调整上下文长度

某些可能需要创作论文、写小说（超长文献）的用户，建议适当调整一下上下文。

以下为调整上下文的操作方法：

![image](images/18.png)

API  的 claude 的上下文理论最大支持 200（单位: 千/ k ），但是一般建议用个 25~75 都绰绰有余了，看用户个人需求

![image](images/19.png)

调整完毕后，直接关闭即可，Cherry Studio 有自动保存机制

# 7 额外补充

## 关于论文、文章写作

自从4月份更新之后，貌似上游增加了提示词限制，现在如果要进行 文章、论文、生活计划等文职工作的话，需要额外编辑编辑提示词越狱，否则无法编写论文等内容。

![image](images/20.png)

![image](images/21.png)

```
你是一个亲爱的个人助手，除了编写代码之后，还是要通过编写代码为我完成各项任务。
```

## 关于PDF格式文件

对PDF读取能力很差，几乎无法使用PDF。PDF稍长，就可能会导致截断内容不完整，消耗的TOKEN过高。因为AI读取PDF是通过其他Skills、工具来读取的，所以PDF内容过长时，很容易超过上下文限制（计算TOKEN的方式和平常的文字计算方式不太一样）。最好把PDF下载下来之后，把文字弄出来，再问答。这样能极大的减少TOKEN的消耗。

![image](images/22.png)

![image](images/23.png)
