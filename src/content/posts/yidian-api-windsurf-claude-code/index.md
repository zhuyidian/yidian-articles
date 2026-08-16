---
title: "一点API 使用教程(十六)：Windsurf 配置 Claude Code 插件"
published: 2026-08-16T16:01:48+08:00
description: "本教程默认观看用户拥有Windsurf账号（或者有能登录Windsurf的手段）"
image: "./images/01.png"
tags: ["Windsurf","Claude"]
category: "API 服务"
draft: false
---

本教程默认观看用户拥有Windsurf账号（或者有能登录Windsurf的手段）

# 安装Windsurf

先进入官网，下载软件 [Windsurf官网（](https%3A%2F%2Fwindsurf.com%2Fdownload)[https://windsurf.com/download](https%3A%2F%2Fwindsurf.com%2Fdownload)[）](https%3A%2F%2Fwindsurf.com%2Fdownload)

![image](images/01.png)

随后打开软件，进行安装

![image](images/02.png)

默认点击右下角的下一步，直到安装完成，打开软件

![image](images/03.png)

# 安装插件

![image](images/04.png)

## 安装中文（非必须）

![image](images/05.png)

![image](images/06.png)

![image](images/07.png)

## 安装 Claude Code for VS Code 插件

插件名称：Claude Code for VS Code

![image](images/08.png)

安装完之后

**第一步：**点击左下角小齿轮

**第二步：**点击设置（win快捷键Ctrl+，）（mac快捷键Cmd+，）

![image](images/09.png)

**打开之后**

**第一步：**在顶部的搜索框里直接搜索：Claude Code Environment
**第二步：**找到 "Claude Code: Environment Variables" 这一项，点击它下面的 “在 settings.json 中编辑” (Edit in settings.json)。

![image](images/10.png)

### 1. 打开后

新设备第一次开始打开的配置是这样的

**注意**：如果您们之前配置过别家的东西，或者是别的ai的配置，需要删掉，不然会有冲突 接不上

![image](images/11.png)

### 2. 接下来：填入内容

为了绝对不出错，直接把截图里的第 1 行到第 5 行**全部删掉**，**（根据个人情况删除之前的配置，确保与我们的配置不会冲突）**然后直接把我下面这段完整的代码复制粘贴进去（记得把里面的sk开头的换成您去令牌获取的密钥）：

```json
{
    "claudeCode.environmentVariables": [
        {
          "name": "ANTHROPIC_AUTH_TOKEN",
          "value": "sk-XXXXXXXXXXXXX" 
          // 替换成令牌，sk开头的API密钥
        },
        {
          "name": "ANTHROPIC_BASE_URL",
          "value": "https://api.yidianhub.com" 
          // 替换成中转站给你的真实服务地址
        },
        {
          "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
          "value": "1" 
          // 一键关闭 Claude Code 向 Anthropic 发送的所有非核心网络请求（遥测、错误上报、反馈问卷、自动更新等），让运行更隐私、更干净、更少的后台流量
        }
    ]
}
```

填完之后再上面可以看到有个小圆点，按 `Ctrl + S` 确保文件上面那个小白点消失（代表保存成功

保存完之后关掉一整个vs code重新打开

![image](images/12.png)

重新打开之后输入”你好“运行一下试试

### 3. 第一注意事项！！！

**如果输入对话之后就看以下步骤，如果没有就跳过此步骤**

输入之后如果跳出这个之后就点击“Skip for now”

![image](images/13.png)

**点击“Skip fornow”之后就会出现对话内容**

**这句话代表着你缺少了GitHub**

**看下一步“第二注意事项”下载安装Git**

![image](images/14.png)

### 4. 第二注意事项！！！

重新打开之后如果出现以下报错

这段红字开头写着：`Error: Claude Code on Windows requires git-bash`

** Claude Code 这个插件在咱们 Windows 电脑上干活时，必须借用一个叫 Git 的底层工具 **

**您只是缺少了这个Git**

![image](images/15.png)

** 第一步：下载 Git 工具  **

您直接在浏览器里打开这个官方链接并下载：[**https://git-scm.com/downloads/win**](https%3A%2F%2Fgit-scm.com%2Fdownloads%2Fwin)

点击 "Download for Windows" 下载安装包

下载完后运行下载的 .exe 安装文件

**极其关键：安装过程中您什么设置都不需要改！** 就无脑疯狂点击右下角的 **“Next（下一步）”**，一直点到最后完成安装。

![image](images/16.png)

![image](images/17.png)

1. 安装完Git之后重新打开vs code中的Claude code插件

输入”你好“运行一下

![image](images/18.png)

### 5. 切换模型方法

在对话框输入：/model

然后回车

![image](images/19.png)

用上下键选择模型，然后回车选定就行了

![image](images/20.png)

最后输入你好测试一下！

![image](images/21.png)
