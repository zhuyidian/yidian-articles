---
title: 把 Codex 工作现场搬进飞书：群内直接聊业务、实时迭代需求
published: 2026-07-24
description: 在飞书群内直接对话业务，让 Codex 持续推进需求迭代。
image: ./cover.png
tags: [Codex, 飞书]
category: 工作流
draft: false
---

## 使用案例

### 1、打包软件

直接在飞书群里面 @机器人，给我出个软件包。

![在飞书群中构建并发送 APK](./usage-package.png)

### 2、读取飞书群文件

机器人可以获取到飞书群文件并进行任务。

![读取并处理飞书群文件](./usage-file-reading.png)

### 3、像直接使用 Codex 一样，飞书中进行需求开发

正常的开发任务更是不在话下。

![在飞书中进行需求开发](./image-12.png)

### 4、手机端直接发任务

出门在外，工作也不会落下，手机端直接操控干活。

这里就不举例了，电脑飞书怎么使用，手机就怎么使用即可。

### 5、功能扩展

飞书连接到具体的 Codex 项目中，然后再配合项目中各种 skill 技能，将会完成更加复杂的功能，以及更完美的闭环。

## 1、飞书配置

开始前我们需要确保本地 Codex 是可运行。这里说的不是 Codex App，而是 Codex CLI 命令工具能正常运行，因为该工具用的也是 Codex CLI 的配置。

### 1.1、安装运行

要用到的 Bridge 是 Codex Remote Feishu。

GitHub：[https://github.com/zhuyidian/in-feishu](https://github.com/zhuyidian/in-feishu)

macOS / Linux 直接运行：

```bash
curl -fsSL https://raw.githubusercontent.com/zhuyidian/in-feishu/main/install-release.sh | bash
```

Windows PowerShell 运行：

```powershell
irm https://raw.githubusercontent.com/zhuyidian/in-feishu/main/install-release.ps1 | iex
```

脚本运行后会在浏览器打开一个 Codex Remote Feishu 安装程序。

![Codex Remote Feishu 安装程序](./image-27.png)

### 1.2、扫码添加飞书机器人

地址：`http://localhost:9501/setup`

跟着安装程序一步步走即可。环境检测成功后，可以扫码在飞书创建应用，点击“立即创建”即可。

![创建飞书应用](./image-31.png)

![扫码添加飞书机器人](./image-33.png)

### 1.3、权限检查

如果有缺失的权限，直接把给出的代码复制，然后点击跳转到飞书后台权限设置界面。

点击“批量导入/导出权限”，把刚才复制的内容填进去，然后点击“新增权限”即可。

创建版本后，需要企业管理员审核。

![飞书权限配置](./image-36.png)

![批量导入飞书权限](./image-38.png)

![新增飞书权限](./image-39.png)

![飞书权限审核](./image-41.png)

![发布飞书应用版本](./image-43.png)

![企业管理员审核](./image-45.png)

### 1.4、事件订阅

接下来它会让机器人尝试发送事件订阅测试，一般都没问题；如果不通过，去飞书后台配置即可。

测试成功后继续下一步。

![事件订阅配置](./image-48.png)

![事件订阅测试](./image-50.png)

![事件订阅测试结果](./image-52.png)

![飞书事件订阅后台配置](./image-54.png)

![事件订阅完成](./image-56.png)

### 1.5、回调测试

接下来是回调测试，一般也不会有问题。

测试成功后继续下一步。

![回调测试](./image-59.png)

![回调测试成功](./image-61.png)

### 1.6、菜单配置

接下来是机器人配置，点击进入飞书后台配置即可。如果不配置，所有东西都需要靠手敲 `/` 命令来实现，手机上很不方便。

![机器人菜单配置](./image-64.png)

![飞书机器人菜单](./image-65.png)

### 1.7、自动启动

自动启动不用管，检测通过后就会进入 VS Code 集成。如果没有这个需求，点击“先不使用”即可跳过。

![自动启动检测](./image-68.png)

### 1.8、配置完成

到这里配置就完成了。

接入完成后，发布机器人的新版本，就可以在飞书里使用了。

![飞书机器人配置完成](./image-71.png)

### 1.9、对外共享

下面两个设置，按大家的使用情况来勾选。

![飞书机器人对外共享设置](./image-75.png)

### 1.10、管理页面

`http://localhost:9501/admin/`

![Codex Remote Feishu 管理页面](./image-78.png)

## 2、命令使用

### 2.1、/list：选择工作区

开始任务之前，要先选择工作区，也就是选择在哪个项目下面进行对话。输入 `/list` 即可进入选择界面。

这里的工作区其实就是你使用 Codex 时操作的工作区。

![在飞书中选择工作区](./image-83.png)

### 2.2、其它命令

这里就不一一列举命令测试了，自行使用即可。

```text
/help 查看可用命令帮助。
/menu 打开按钮式命令菜单。
/status 查看当前模式、工作区、线程、运行状态。
/workspace 打开工作区管理入口。
/workspace list 列出可用工作区。
/workspace new 新建工作区入口。
/workspace new dir 从本地目录添加/创建工作区。
/workspace new git 从 Git 仓库创建工作区。
/workspace new worktree 创建 Git worktree 工作区。
/workspace detach 解除当前工作区绑定。
/list 列出可接管的实例/工作区。
/use 选择当前实例里的线程；别名 /threads、/sessions。
/useall 从全部线程里选择；别名 /sessionsall。
/detach 解除当前飞书会话的接管。
/new 新建一个会话，下一条消息作为首条输入。
```

```text
/sendfile 从当前工作区选择文件发送到飞书。
/review 打开代码 review 入口。
/review uncommitted review 当前未提交改动。
/review commit <sha> review 指定 commit。
/admin 打开系统管理入口。
/admin web 打开公网/外部管理页入口。
/admin localweb 打开本地管理页入口。
/admin autostart on 开启自动启动，平台支持时可用。
/admin autostart off 关闭自动启动。
/cron 打开定时任务入口。
/cron reload 重新加载定时任务配置。
/upgrade 查看升级状态。
/upgrade latest 检查或继续升级到当前 track 最新版。
/upgrade track beta 切换 release track。
/upgrade local 使用本地 artifact 升级。
/debug 查看调试入口。
/vscode-migrate VS Code 迁移/兼容相关入口。
```

补充：`/setup` 不是飞书聊天命令，是启动服务后在浏览器打开的 Web Setup/Admin 配置入口。

## 3、问题清单

### 3.1、怎么停止 Codex Remote Feishu

停止 Codex Remote Feishu：

```powershell
$pidFile = "$HOME\.local\state\codex-remote\codex-remote-relayd.pid"
$relayPid = Get-Content $pidFile
Stop-Process -Id $relayPid -Force
```

确认是否停掉：

```powershell
curl.exe --noproxy "*" -sf http://127.0.0.1:9501/v1/status
```

如果返回连接失败，就说明已停止。

如果还没停干净，可以查进程：

```powershell
Get-Process | Where-Object { $_.ProcessName -like "*codex-remote*" }
```

然后按 PID 停：

```powershell
Stop-Process -Id <PID> -Force
```

只是在飞书里停止当前任务的话，不用停 daemon，发送：`/stop`。

### 3.2、怎么运行 Codex Remote Feishu

PowerShell 中直接运行：

```powershell
& "C:\Users\xxx\AppData\Local\codex-remote\bin\codex-remote.exe"
```

重新执行安装式启动，也可以运行：

```powershell
cd E:\project\AIProjet\in-feishu\codex-remote-feishu
.\bin\codex-remote.exe install -bootstrap-only -start-daemon
```

或者在用户目录下运行：

```powershell
& 'C:\Users\xxx\AppData\Local\codex-remote\bin\codex-remote.exe' install -bootstrap-only -start-daemon
```

启动后打开：`http://localhost:9501/admin/`

或者：`http://localhost:9501/setup`

运行成功会看到类似：

```text
service: ready
web admin: http://localhost:9501/admin/
logs: xxxxx
```

然后检查状态：

```powershell
curl.exe --noproxy "*" -sf http://127.0.0.1:9501/v1/status
```

打开管理页：`http://localhost:9501/admin/`

![Codex Remote Feishu 运行状态](./image-110.png)

### 3.3、中断当前 Codex turn

在飞书机器人里面发送：

```text
/stop
```

`/stop` 是中断当前 Codex turn；上面的 PowerShell 是停止整个 Codex Remote Feishu 后台服务。

### 3.4、/list 等命令老是提示：目标回调服务器超时未响应

经过分析日志发现：不是飞书后台没通，也不是机器人没收到回调，而是 Codex Remote Feishu 自己在处理“选择工作区”这个动作时卡住，或没有及时响应飞书。

这说明点击“选择工作区”后，事件已经进入本机 daemon，但没有完成绑定，也没有及时给飞书返回 ACK，所以飞书客户端显示“目标回调服务器超时未响应”。

原因是 v1.8.4 的 bug 或 Windows 下的处理链路问题：卡在 `surface.target_picker.select_workspace` 后，没有后续 attach/select 成功日志。

如果是 Windows 平台，可以尝试直接用源码编译后再试。新版本已经修复。

### 3.5、本地配置的信息在哪里？

机器人的持久化配置在这里：

```text
C:\Users\xxx\.config\codex-remote\config.json
```

安装状态文件也指向这个配置路径：

```text
C:\Users\xxx\.local\share\codex-remote\install-state.json
```
