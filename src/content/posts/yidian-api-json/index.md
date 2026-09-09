---
title: "一点API 使用教程(三十一)：各智能体常见JSON配置文件参考"
published: 2026-09-09T22:18:31+08:00
description: "OpenClaw - CC-Switch"
image: ""
tags: ["配置"]
category: "API 服务"
draft: false
---

# OpenClaw - CC-Switch

## openclaw.json

**所在位置**

- ~/.openclaw/openclaw.json（Linux/MacOs）

### 缩略版

OpenClaw - CC-Switch

```json
{
  "api": "openai-completions",
  "apiKey": "填写自己的令牌",
  "baseUrl": "https://api.yidianhub.com/v1",
  "models": [
    {
      "id": "claude-opus-4-6",
      "name": "claude-opus-4-6"
    }
  ]
}
```

### 全文版

17行处可能需要更换为自己的令牌

```json
{
  "meta": {
    "lastTouchedVersion": "2026.2.22-2",
    "lastTouchedAt": "2026-02-24T04:29:32.032Z"
  },
  "wizard": {
    "lastRunAt": "2026-02-24T04:29:32.024Z",
    "lastRunVersion": "2026.2.22-2",
    "lastRunCommand": "onboard",
    "lastRunMode": "local"
  },
  "models": {
    "mode": "merge",
    "providers": {
      "vllm": {
        "baseUrl": "https://api.yidianhub.com/v1",
        "apiKey": "VLLM_API_KEY",
        "api": "openai-completions",
        "models": [
          {
            "id": "claude-opus-4-6",
            "name": "claude-opus-4-6",
            "reasoning": false,
            "input": [
              "text",
              "image"
            ],
            "cost": {
              "input": 0,
              "output": 0,
              "cacheRead": 0,
              "cacheWrite": 0
            },
            "contextWindow": 200000,
            "maxTokens": 8192
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "vllm/claude-opus-4-6"
      },
      "models": {
        "vllm/claude-opus-4-6": {}
      },
      "workspace": "/home/ubuntu/.openclaw/workspace"
    }
  },
  "commands": {
    "native": "auto",
    "nativeSkills": "auto",
    "restart": true,
    "ownerDisplay": "raw"
  },
  "session": {
    "dmScope": "per-channel-peer"
  },
  "hooks": {
    "internal": {
      "enabled": true,
      "entries": {
        "boot-md": {
          "enabled": true
        },
        "bootstrap-extra-files": {
          "enabled": true
        },
        "command-logger": {
          "enabled": true
        },
        "session-memory": {
          "enabled": true
        }
      }
    }
  },
  "channels": {
    "telegram": {
      "enabled": true,
      "dmPolicy": "pairing",
      "groupPolicy": "allowlist",
      "streaming": "off"
    }
  },
  "gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "b549fXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX8cd2ea"
    },
    "tailscale": {
      "mode": "off",
      "resetOnExit": false
    },
    "nodes": {
      "denyCommands": [
        "camera.snap",
        "camera.clip",
        "screen.record",
        "calendar.add",
        "contacts.add",
        "reminders.add"
      ]
    }
  }
}
```

# Claude Code - CC-Switch

## settings.json

**所在位置**

- C:\Users\用户名\.claude\settings.json（Win）

- ~/.claude/settings.json（Linux/MacOs）

Claude Code - CC-Switch

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "填写自己的令牌",
    "ANTHROPIC_BASE_URL": "https://api.yidianhub.com",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-4-5-20251001",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "claude-opus-4-7",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "claude-opus-4-6",
    "ANTHROPIC_MODEL": "claude-sonnet-4-6",
    "CLAUDE_CODE_ATTRIBUTION_HEADER": "0"
  },
  "model": "Sonnet"
}
```

## config.json

**所在位置**

- C:\Users\用户名\.claude\config.json （Win）

- ~/.claude/config.json（Linux/MacOs）

config

```
{
  "primaryApiKey": "any"
}
```

# OpenCode - CC-Switch

## opencode.json

**所在位置**

- C:\Users\用户名\.config\opencode\opencode.json

OpenCode - CC-Switch

```json
{
  "models": {
    "claude-opus-4-6": {
      "name": "claude-opus-4-6"
    },
    "claude-sonnet-4-6": {
      "name": "claude-sonnet-4-6"
    }
  },
  "name": "蓝移API",
  "npm": "@ai-sdk/openai-compatible",
  "options": {
    "apiKey": "填写自己的令牌",
    "baseURL": "https://api.yidianhub.com/v1"
  }
}
```

# 编辑器常用JSON

## settings.json

**所在位置**

- C:\Users\用户名\AppData\Roaming\Code\User\settings.json （VSCode的）

适用 IDEA、Trae、VSCode、Cursor等

但仅供参考，不一定百分百适用

```json
{
  "claudeCode.selectedModel": "claude-sonnet-4-6",
  // 这个设置是更改模型名字的，可以不填，选择官方的模型
  "claudeCode.disableLoginPrompt": true,
  // 禁用登录提示
  "claudeCode.environmentVariables": [
    {
      "name": "CLAUDE_CODE_OAUTH_TOKEN",
      "value": "替换成令牌，sk开头的API密钥"  
    },
    {
      "name": "ANTHROPIC_BASE_URL",
      "value": "https://api.yidianhub.com" 
    },
    {
      "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
      "value": "1" 
   // 一键关闭 Claude Code 向 Anthropic 发送的所有非核心网络请求，更少的后台流量
    }
  ]
}
```
