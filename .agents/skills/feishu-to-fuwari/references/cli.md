# Feishu Import CLI

Run all commands from the article-site root.

## Credentials

The importer reads `config/local.secrets.json` by default. The required shape is:

```json
{
  "feishu": {
    "app_id": "cli_xxx",
    "app_secret": "xxx",
    "open_api_base": "https://open.feishu.cn"
  }
}
```

Keep this file local. It is excluded from Git. The Feishu app needs document read permission (`docx:document:readonly` or `docx:document`) and permission to read the linked document's media.

## Commands

Preflight a document without adding a post:

```powershell
pnpm feishu:import -- --url "https://my.feishu.cn/docx/xxxxxxxx" --dry-run
```

The importer derives a readable English slug from the document title. For example, `一点API 使用教程(五)：Open Code接入使用` becomes `yidian-api-open-code-setup`. If the title cannot produce a useful English path, it falls back to `feishu-<document-token>`.

Publish with metadata:

```powershell
pnpm feishu:import -- --url "https://my.feishu.cn/docx/xxxxxxxx" --published "2026-08-10T20:30:45+08:00" --tags "一点API,教程" --category "API 服务"
```

`--published` accepts `YYYY-MM-DD` for legacy date-only posts or an ISO-8601 timestamp such as `2026-08-10T20:30:45+08:00`. If omitted, the importer records the local import time to the second.

Override the automatic value only when needed:

```powershell
pnpm feishu:import -- --url "https://my.feishu.cn/docx/xxxxxxxx" --slug "example-post"
```

Publish without changing the main-site fallback list:

```powershell
pnpm feishu:import -- --url "https://my.feishu.cn/docx/xxxxxxxx" --no-sync-main-site
```

Use a non-default config or main-site fallback file only when the repository layout changes:

```powershell
pnpm feishu:import -- --url "https://my.feishu.cn/docx/xxxxxxxx" --slug "example-post" --config "C:\secure\feishu.json" --main-site-file "C:\work\main-site\src\utils\articles.ts"
```

## Import Output

Each successful import creates:

```text
src/content/posts/<slug>/
  index.md
  images/
  import-manifest.json
```

`import-manifest.json` records the source URL, source block and image counts, downloaded image hashes, and validation totals. It never contains the Feishu app secret.
