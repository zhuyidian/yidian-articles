---
title: "一点API 使用教程(二十四)：OpenHuman 配置教程"
published: 2026-08-16T16:25:33+08:00
description: "下载安装 OpenHuman"
image: "./images/01.png"
tags: ["OpenHuman"]
category: "API 服务"
draft: false
---

# 下载安装 OpenHuman

打开[ OpenHuman 官网进行下载](https%3A%2F%2Ftinyhumans.ai%2Fopenhuman) [https://tinyhumans.ai/openhuman](https%3A%2F%2Ftinyhumans.ai%2Fopenhuman)

![image](images/01.png)

点击对应的下载按钮，选择你自己的系统版本进行下载，少数客户可能遇到如下情况，选择“**仍要运行**”即可。

![image](images/02.png)

安装过程没什么好说的，无脑 **Next **下一步就行。

![image](images/03.png)

可以默认，下一步直接启动客户端。

![image](images/04.png)

# 配置 OpenHuman

## 设置中文

1、 启动之后，语言可以切换成 CN 中文，便于观看和修改

2、核心模式选择 **本地**

![image](images/05.png)

让 OpenHuman 自动安装环境即可。

![image](images/06.png)

## 登录（自行处理）

**登录这一块客户自行解决，这个没办法。**

![image](images/07.png)

登录之后直接** 开始使用**

![image](images/08.png)

## 基础配置

选择自定义运行，配置我们的蓝移的 API。

![image](images/09.png)

选择“配置”。题外话，这个软件这方面很好很强，他本身就像一个中转站，可以把不同的模型聚合到一起来使用，智能搭配或者自己手动配置，什么任务用什么模型。

![image](images/10.png)

## 配置 API

然后在下图界面里面配置我们的 API

```bash
https://api.yidianhub.com/v1
```

```bash
sk-zUET1wXXXXXXXXXXXXXXXXXXXXXXX
```

![image](images/11.png)

## 其他配置

![image](images/12.png)

剩下的设置基本一路默认就行

配置完成之后，会有如下界面，选择“连接”-“语言模型”-“使用自己的模型”（前文已经配置过了），直接点一下，然后选择模型，保存就可以使用了。

![image](images/13.png)

# 正常使用测试

![image](images/14.png)

![image](images/15.png)

然后就可以看到你当前使用的模型

gpt-5.6-luna

发起正常对话即可

![image](images/16.png)

# 高级用法

## 路由分配模型

在 OpenHuman 中，可以给不同的 Agent 行为和模型分配不同的模型，根据官方的功能介绍，可以大概得出一个以下的配置表格（使用 gpt 或者 claude 模型其中一种即可）。

![image](images/17.png)

![image](images/18.png)

合理的路由分配功能，可以提高整个项目运行的效率，也会有效的节约 Token 的消耗，甚至可以发挥不同 AI 大模型（API）组合到一起产生的奇妙化学反应。
