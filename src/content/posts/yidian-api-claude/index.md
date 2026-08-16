---
title: "一点API 使用教程(十五)：Claude 客户端配置教程"
published: 2026-08-16T15:51:21+08:00
description: "前言"
image: "./images/01.png"
tags: ["Claude"]
category: "API 服务"
draft: false
---

# 前言

👍太好用了！不用付费订阅！也不用担心被封号！

在Claude Code Desktop 中使用第三方API的最新保姆级教程

直接在官方Claude Desktop客户端里，调用一点API的Claude模型！

Claude Desktop那一整套界面、Skill、Plugin，一个都不缺！

建议使用Code模式对话，并不是只有写代码才能用

不建议使用Cowork模式，对第三方API支持性比较差

另外 Chat 模式属于官方账号独属，API 没有该模式

需要客户自带魔法代理！最新版客户端会拦截亚洲地区用户的信息

关于安装

本教程不包括下载安装步骤，默认客户自行下载安装

本教程不包括下载安装步骤，默认客户自行下载安装

建议本教程有一定的动手能力和计算机基础的客户观看

仅提供下载参考地址

可以去[ Claude 官网下载 ](https%3A%2F%2Fclaude.com%2Fdownload)[https://claude.com/download](https%3A%2F%2Fclaude.com%2Fdownload) （需要魔法上网）

本教程提供的参考安装文件为：

- Claude Desktop 的 MacOS Intel 版本 dmg

通过网盘分享的文件：Claude.zip

链接: https://pan.baidu.com/s/1t6Be1IsHWXbvawf4U2_M2Q 提取码: ac6k

- Claude Desktop 的 Windows 版本（联网下载软件，需要魔法上网下载Claude）

通过网盘分享的文件：Claude Setup.zip

链接: https://pan.baidu.com/s/1AzO40F9caqMCYeu2T5irNg 提取码: e2n8

# MacOS 系统

## 启用开发者模式

完全退出 Claude Desktop。

注意是"完全退出"——直接点叉号只是缩到了托盘里，得右键托盘图标 → Quit，彻底干掉它。

![image](images/01.png)

重新打开Claude Desktop，**先不要登录账号**。

点顶部菜单，按这条路径走：

**Help**（帮助）**→ Troubleshooting**（故障排除）**→ Enable Developer Mode**（启用开发者模式）**。**

![image](images/02.png)

点完之后，应用会自己重启。

## 找到第三方接口配置入口

![image](images/03.png)

重启完之后，顶部菜单会多出来一个Developer选项，长这个样子。

点 **Developer → Configure third-party inference**（配置第三方推理）。

![image](images/04.png)

会弹出一个设置窗口，长这样。

![image](images/05.png)

## 选模型 + 填接口

选左边菜单里的Collection，把模式切到Gateway。

![image](images/06.png)

把我们的接口地址和Key依次填进去。

```bash
https://api.yidianhub.com
```

```bash
sk-518GatoLXXXXXXXXXXXXXXXXXXXXXXXXsSLYe0zsnPH5
```

这里的Key就是令牌，在一点API上创建令牌的时候的key

继续往下拉这个页面，填上对应的模型名称。

我这里填的是claude-sonnet-4-6，速度和智能度兼顾，写代码刚好顺手。

![image](images/07.png)

综合全能王

```
claude-sonnet-4-6
```

最新最强当家大模型（较贵）

```
claude-opus-4-7
```

填完之后点最下面的** Apply** ，客户端会自动重启。重启完成，就能正常用了。

![image](images/08.png)

## 实测下来是什么样

跟那个黑漆漆的命令行比起来，Desktop客户端的界面友好太多。

![image](images/09.png)

左侧是项目和会话列表，中间是对话和输出，右侧能看到详细的代码修改。

一目十行，不用再去命令行里cd来cd去。最让我惊喜的，是Cowork也能正常用。

![image](images/10.png)

各种Plugin、Skill全都能正常驱动，**跟官方订阅几乎没有任何区别。**

Cowork 功能需要 macOS > 14 版本，并且实际使用对 API 兼容性较差

![image](images/11.png)

可以读写本地的Word、PDF、Excel、PPT、图片、CSV、JSON。

![image](images/12.png)

最后给你的，是真实可用的文件——格式化的报告、带公式的表格、能直接拿去汇报的PPT。

不是聊天框里那种"内容仅供参考"的纯文本。

而且安全性也做得挺好，所有代码和shell都跑在本地隔离的虚拟机里，删文件这种重要操作会弹出来让你二次确认，只动你授权过的文件夹。

![image](images/13.png)

所以它就是被包装成"普通人也能用"的那种桌面AI代理。

不用配环境、不用学命令行、上手就能干。

特别适合非技术的知识工作者——市场、运营、财务、法律、研究员，全都能直接受益。

牛马打工人的必备。

# Windows 系统

## 下载安装Git

访问 **Git 版本控制管理器** 官网下载地址： [https://git-scm.com/downloads/win](https%3A%2F%2Fgit-scm.com%2Fdownloads%2Fwin)。无脑下一步即可，千万不要改路径。

## 启用开发者模式

打开clauade desktop（客户端），**先不要登录账号**。如下图，按照流程打开开发者模式。点左上角菜单，按这条路径走：**Help**（帮助）**→ Troubleshooting**（故障排除）**→ Enable Developer Mode**（启用开发者模式）**。**

![image](images/14.png)

随后会弹窗警告，提示是否开启，选择第一个** Enable **，确认启用开发者模式

![image](images/15.png)

## 找到第三方接口配置入口

![image](images/16.png)

## 选模型 + 填接口

![image](images/17.png)

如果没有** Gateway API key** 这一项，请选择 **Static API key**

![image](images/18.png)

填完之后点最下面的** Apply locally**，客户端会自动重启。

注意！此处的可以按照同样的方法，一次性添加多个模型！

![image](images/19.png)

综合全能王

```
claude-sonnet-4-6
```

最新最强当家大模型（较贵）

```
claude-opus-4-7
```

重启完成，就能正常用了。

## 实测下来是什么样

可以正常对话，修改代码。但读取PDF等文档，或许需要软件加载python的一些插件库才能够进行读取。在全局魔法上网的情况下，可以实现联网搜索功能（感觉平时不支持联网搜索，很大程度是因为Claude Code的搜索工具是对接的外网）。

核心问题，Windows中如果要使用Cowork功能，需要开启虚拟化技术支持，这个问题太复杂了，不做教程，建议想用的朋友去问一下AI。

![image](images/20.png)

![image](images/21.png)

![image](images/22.png)

![image](images/23.png)
