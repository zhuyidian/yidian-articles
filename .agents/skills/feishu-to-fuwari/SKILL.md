---
name: feishu-to-fuwari
description: Publish a Feishu document or Wiki page to the YidianHub Fuwari article site without rewriting its content. Use this skill whenever the user provides a Feishu document link and asks to publish, import, mirror, or synchronize it to articles.yidianhub.com, especially when all original images must be retained and the main-site article list must be updated.
---

# Feishu To Fuwari

Publish one Feishu document as a Fuwari post while preserving the source title, body order, links, code, lists, and original image files. Do not paraphrase, translate, summarize, screenshot, or substitute any source content unless the user explicitly asks.

The importer reads `config/local.secrets.json`, downloads images through the Feishu media API, and writes the post below `src/content/posts/<slug>/`. It also updates the main site's local fallback article list by default.

## Publishing Workflow

1. Confirm the input is a Feishu `docx`, `docs`, `doc`, or `wiki` URL. The importer derives a readable lowercase English slug from the title. Use `--slug` only when the user explicitly needs a different path.
2. Confirm `config/local.secrets.json` exists. Do not print, expose, commit, or modify its credentials.
3. Run a preflight import before writing source files:

```powershell
pnpm feishu:import -- --url "<Feishu URL>" --dry-run
```

4. Check the reported `slug` and `unsupportedBlocks`. If the suggested slug does not reflect the article, use an explicit `--slug`. Do not publish when `unsupportedBlocks` is non-empty. Explain the affected Feishu block types and ask how to handle them. This prevents silently dropping tables, file attachments, embeds, or special layouts.
5. Publish only after a clean preflight. Supply `--published`, `--tags`, and `--category` when the user specified them; otherwise keep the importer defaults. Reuse the preflight slug automatically or pass the approved value explicitly.

```powershell
pnpm feishu:import -- --url "<Feishu URL>"
```

6. Run the article-site checks after a successful import:

```powershell
pnpm check
pnpm build
```

7. Report the local post path, public post URL, downloaded image count, and whether the main-site fallback list changed. Do not commit, tag, push, or deploy unless the user separately requests it.

## Content Fidelity

The importer preserves the document's textual content and sequence for supported blocks: headings, paragraphs, rich-text links and emphasis, lists, checklists, quotes, callouts, code blocks, dividers, equations, and images. Images are downloaded as source media files rather than screenshots.

Feishu-specific visual features are not equivalent to Markdown and Fuwari styling. Tables, attachments, embeds, grids, spreadsheets, and other unsupported blocks stop publication by default. Do not force a partial article through the importer.

## Metadata And Main-Site Sync

Use the Feishu title as the article title. The generated description is the first readable paragraph unless the user explicitly provides one. The first image becomes the Fuwari cover image when the document has images.

The default command inserts a corresponding entry into `../main-site/src/utils/articles.ts`. Use `--no-sync-main-site` only when the user explicitly wants an article-site-only import.

## References

Read [CLI reference](references/cli.md) when a non-default category, date, config location, article domain, or main-site path is needed.
