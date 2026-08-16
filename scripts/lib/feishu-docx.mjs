import fs from "node:fs";
import path from "node:path";

const HEADING_BLOCK_FIELDS = [
  "heading1",
  "heading2",
  "heading3",
  "heading4",
  "heading5",
  "heading6",
  "heading7",
  "heading8",
  "heading9",
];

const TEXT_BLOCK_FIELDS = [
  "page",
  "text",
  ...HEADING_BLOCK_FIELDS,
  "heading",
  "bullet",
  "ordered",
  "quote",
  "todo",
  "code",
  "callout",
];

const KNOWN_BLOCK_FIELDS = [
  ...TEXT_BLOCK_FIELDS,
  "image",
  "divider",
  "quote_container",
  "table",
  "table_cell",
  "file",
  "media",
  "embed",
  "grid",
  "grid_column",
  "equation",
  "sheet",
];

// Feishu returns CodeLanguage as an enum number. Markdown renderers require a
// textual identifier, so keep unknown values unlabelled instead of emitting an
// invalid fence such as ```7.
const FEISHU_CODE_LANGUAGES = {
  2: "abap",
  3: "ada",
  4: "apache",
  5: "apex",
  6: "asm",
  7: "bash",
  8: "csharp",
  9: "cpp",
  10: "c",
  11: "cobol",
  12: "css",
  13: "coffeescript",
  14: "d",
  15: "dart",
  16: "delphi",
  17: "django",
  18: "dockerfile",
  19: "erlang",
  20: "fortran",
  21: "foxpro",
  22: "go",
  23: "groovy",
  24: "html",
  25: "handlebars",
  26: "http",
  27: "haskell",
  28: "json",
  29: "java",
  30: "javascript",
  31: "julia",
  32: "kotlin",
  33: "latex",
  34: "lisp",
  35: "logo",
  36: "lua",
  37: "matlab",
  38: "makefile",
  39: "markdown",
  40: "nginx",
  41: "objective-c",
  42: "openedge",
  43: "php",
  44: "perl",
  45: "postscript",
  46: "powershell",
  47: "prolog",
  48: "protobuf",
  49: "python",
  50: "r",
  51: "rpg",
  52: "ruby",
  53: "rust",
  54: "sas",
  55: "scss",
  56: "sql",
  57: "scala",
  58: "scheme",
  59: "scratch",
  60: "shellscript",
  61: "swift",
  62: "thrift",
  63: "typescript",
  64: "vbscript",
  65: "vb",
  66: "xml",
  67: "yaml",
  68: "cmake",
  69: "diff",
  70: "gherkin",
  71: "graphql",
  72: "glsl",
  73: "properties",
  74: "solidity",
  75: "toml",
};

function parseFeishuDocumentUrl(input) {
  const url = new URL(input);
  const parts = url.pathname.split("/").filter(Boolean);
  const documentIndex = parts.findIndex((part) => ["docx", "docs", "doc"].includes(part));

  if (documentIndex >= 0 && parts[documentIndex + 1]) {
    return { token: parts[documentIndex + 1], type: parts[documentIndex] };
  }

  const wikiIndex = parts.findIndex((part) => part === "wiki");
  if (wikiIndex >= 0 && parts[wikiIndex + 1]) {
    return { token: parts[wikiIndex + 1], type: "wiki" };
  }

  throw new Error(`Cannot parse a Feishu document token from URL: ${input}`);
}

function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

async function feishuFetch(url, options = {}) {
  let response;
  let lastError;

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    try {
      response = await fetch(url, { ...options, signal: controller.signal });
      lastError = undefined;
      break;
    } catch (error) {
      lastError = error;
      if (attempt < 3) await sleep(attempt * 1000);
    } finally {
      clearTimeout(timeout);
    }
  }

  if (!response) {
    const cause = lastError?.cause?.message || lastError?.cause?.code || lastError?.message || String(lastError);
    throw new Error(`Feishu API request failed: ${cause}`);
  }

  return response;
}

async function feishuRequest(url, options = {}) {
  const response = await feishuFetch(url, options);
  const text = await response.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new Error(`Feishu API returned non-JSON content from ${url}: ${text.slice(0, 200)}`);
  }

  if (!response.ok || (typeof data.code === "number" && data.code !== 0)) {
    const code = data.code ?? response.status;
    const message = data.msg || data.error || text.slice(0, 200);
    const permissionHint = code === 99991672
      ? " Enable docx:document:readonly (or docx:document), publish the permission change, then retry."
      : "";
    throw new Error(`Feishu API error ${code}: ${message}.${permissionHint}`);
  }

  return data;
}

async function feishuDownload(url, options = {}) {
  const response = await feishuFetch(url, options);
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok || contentType.includes("application/json")) {
    const text = await response.text();
    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      // Preserve a short non-JSON error message below.
    }
    throw new Error(`Feishu media download error ${data.code ?? response.status}: ${data.msg || data.error || text.slice(0, 200)}`);
  }

  return {
    buffer: Buffer.from(await response.arrayBuffer()),
    contentType,
    contentDisposition: response.headers.get("content-disposition") || "",
  };
}

async function getTenantAccessToken(feishu) {
  const data = await feishuRequest(`${feishu.openApiBase}/open-apis/auth/v3/tenant_access_token/internal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ app_id: feishu.appId, app_secret: feishu.appSecret }),
  });

  if (!data.tenant_access_token) throw new Error("Feishu tenant_access_token missing in response.");
  return data.tenant_access_token;
}

async function resolveWikiNode(feishu, tenantAccessToken, wikiToken) {
  const url = `${feishu.openApiBase}/open-apis/wiki/v2/spaces/get_node?token=${encodeURIComponent(wikiToken)}`;
  const data = await feishuRequest(url, { headers: { Authorization: `Bearer ${tenantAccessToken}` } });
  const node = data.data?.node;
  if (!node?.obj_token) throw new Error("Feishu wiki node response did not include obj_token.");
  return node.obj_token;
}

async function listDocumentBlocks(feishu, tenantAccessToken, documentToken) {
  const blocks = [];
  let pageToken = "";

  do {
    const query = new URLSearchParams({ document_revision_id: "-1", page_size: "500" });
    if (pageToken) query.set("page_token", pageToken);

    const url = `${feishu.openApiBase}/open-apis/docx/v1/documents/${encodeURIComponent(documentToken)}/blocks?${query}`;
    const data = await feishuRequest(url, { headers: { Authorization: `Bearer ${tenantAccessToken}` } });
    blocks.push(...(data.data?.items || []));
    pageToken = data.data?.page_token || "";
  } while (pageToken);

  if (blocks.length === 0) throw new Error("Feishu document block list is empty.");
  return blocks;
}

function findBlockField(block, fields) {
  return fields.find((field) => block[field] !== undefined && block[field] !== null) || "";
}

function blockTextElements(block) {
  const field = findBlockField(block, TEXT_BLOCK_FIELDS);
  return Array.isArray(block[field]?.elements) ? block[field].elements : [];
}

function escapeMarkdownLinkText(value) {
  return String(value || "").replace(/]/g, "\\]");
}

function escapeMarkdownLinkUrl(value) {
  return String(value || "").replace(/\)/g, "%29").replace(/\s/g, "%20");
}

function applyInlineStyle(value, style = {}) {
  let text = value;
  if (!text) return "";

  if (style.inline_code) {
    const ticks = text.includes("`") ? "``" : "`";
    text = `${ticks}${text}${ticks}`;
  } else {
    if (style.bold) text = `**${text}**`;
    if (style.italic) text = `*${text}*`;
    if (style.strikethrough) text = `~~${text}~~`;
  }

  const url = style.link?.url || style.url;
  return url ? `[${escapeMarkdownLinkText(text)}](${escapeMarkdownLinkUrl(url)})` : text;
}

function renderTextElements(elements) {
  return elements.map((element) => {
    if (element.text_run) {
      return applyInlineStyle(element.text_run.content || "", element.text_run.text_element_style || {});
    }
    if (element.mention_user) return element.mention_user.name || "";
    if (element.mention_doc) {
      const title = element.mention_doc.title || "document";
      const url = element.mention_doc.url || "";
      return url ? `[${escapeMarkdownLinkText(title)}](${escapeMarkdownLinkUrl(url)})` : title;
    }
    if (element.equation) return `$${element.equation.content || ""}$`;
    return "";
  }).join("");
}

function headingLevel(block) {
  const field = findBlockField(block, HEADING_BLOCK_FIELDS);
  if (field) return Number(field.slice("heading".length));
  if (block.block_type >= 3 && block.block_type <= 11) return block.block_type - 2;
  return 0;
}

function markdownCodeLanguage(value) {
  if (typeof value === "number") return FEISHU_CODE_LANGUAGES[value] || "";
  if (typeof value === "string" && /^\d+$/.test(value)) return FEISHU_CODE_LANGUAGES[Number(value)] || "";
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function extensionFromDownload({ contentType, contentDisposition }) {
  const filenameMatch = /filename\*?=(?:UTF-8''|")?([^";]+)/i.exec(contentDisposition);
  if (filenameMatch) {
    const extension = path.extname(decodeURIComponent(filenameMatch[1].replace(/"/g, ""))).toLowerCase();
    if (/^\.(png|jpe?g|gif|webp|bmp)$/.test(extension)) return extension;
  }

  const normalizedType = contentType.split(";")[0].trim().toLowerCase();
  return {
    "image/png": ".png",
    "image/jpeg": ".jpg",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/bmp": ".bmp",
  }[normalizedType] || ".png";
}

async function downloadImage({ feishu, tenantAccessToken, imageToken, assetDir, assetRelativeDir, index }) {
  const url = `${feishu.openApiBase}/open-apis/drive/v1/medias/${encodeURIComponent(imageToken)}/download`;
  const downloaded = await feishuDownload(url, { headers: { Authorization: `Bearer ${tenantAccessToken}` } });
  const extension = extensionFromDownload(downloaded);
  const filename = `${String(index).padStart(2, "0")}${extension}`;
  const outputPath = path.join(assetDir, filename);
  fs.writeFileSync(outputPath, downloaded.buffer);
  return { filename, relativePath: path.posix.join(assetRelativeDir, filename) };
}

function markUnsupported(state, kind) {
  state.unsupportedBlocks.set(kind, (state.unsupportedBlocks.get(kind) || 0) + 1);
}

async function renderBlock(blockId, state, depth = 0) {
  const block = state.blockMap.get(blockId);
  if (!block) return "";
  if (state.activeBlocks.has(blockId)) throw new Error(`Feishu block tree contains a cycle at ${blockId}.`);
  state.activeBlocks.add(blockId);

  try {
    const kind = findBlockField(block, KNOWN_BLOCK_FIELDS) || `block-type-${block.block_type ?? "unknown"}`;
    const text = renderTextElements(blockTextElements(block)).trimEnd();
    const level = headingLevel(block);
    const parts = [];

    if (block.image?.token) {
      state.imageIndex += 1;
      const image = await downloadImage({
        feishu: state.feishu,
        tenantAccessToken: state.tenantAccessToken,
        imageToken: block.image.token,
        assetDir: state.assetDir,
        assetRelativeDir: state.assetRelativeDir,
        index: state.imageIndex,
      });
      state.images.push(image);
      parts.push(`![image](${image.relativePath})`);
    } else if (block.divider) {
      parts.push("---");
    } else if (block.code) {
      const language = markdownCodeLanguage(block.code?.style?.language || block.code?.language);
      parts.push(`\`\`\`${language}\n${text}\n\`\`\``);
    } else if (level > 6) {
      markUnsupported(state, `heading${level}`);
      if (text.trim()) parts.push(text.trim());
    } else if (level && text.trim()) {
      parts.push(`${"#".repeat(level)} ${text.trim()}`);
    } else if (block.bullet && text.trim()) {
      parts.push(`${"  ".repeat(depth)}- ${text.trim()}`);
    } else if (block.ordered && text.trim()) {
      parts.push(`${"  ".repeat(depth)}1. ${text.trim()}`);
    } else if (block.todo && text.trim()) {
      const checked = block.todo?.style?.done ? "x" : " ";
      parts.push(`${"  ".repeat(depth)}- [${checked}] ${text.trim()}`);
    } else if ((block.quote || block.callout) && text.trim()) {
      parts.push(text.split(/\r?\n/).map((line) => `> ${line}`).join("\n"));
    } else if (block.equation && text.trim()) {
      parts.push(`$$\n${text}\n$$`);
    } else if (kind === "heading") {
      markUnsupported(state, "heading");
      if (text.trim()) parts.push(text.trim());
    } else if (kind === "text" && text.trim()) {
      parts.push(text.trim());
    } else if (kind === "table" || kind === "table_cell" || kind === "file" || kind === "media" || kind === "embed" || kind === "grid" || kind === "grid_column" || kind === "sheet") {
      markUnsupported(state, kind);
      if (text.trim()) parts.push(text.trim());
    } else if (!['page', 'quote_container'].includes(kind) && text.trim()) {
      markUnsupported(state, kind);
      parts.push(text.trim());
    } else if (!['page', 'quote_container'].includes(kind) && !text.trim() && (block.children || []).length > 0) {
      markUnsupported(state, kind);
    }

    for (const childId of block.children || []) {
      const childMarkdown = await renderBlock(childId, state, block.bullet || block.ordered ? depth + 1 : depth);
      if (childMarkdown) parts.push(childMarkdown);
    }

    return parts.filter(Boolean).join("\n\n");
  } finally {
    state.activeBlocks.delete(blockId);
  }
}

function firstReadableParagraph(markdown, title) {
  return markdown
    .split(/\n{2,}/)
    .map((part) => part.replace(/^#+\s+/, "").trim())
    .filter((part) => part && part !== title)
    .filter((part) => !part.startsWith("!") && !part.startsWith("```") && !part.startsWith(">"))
    .find(Boolean) || title;
}

async function blocksToArticle(blocks, input, state) {
  const blockMap = new Map(blocks.map((block) => [block.block_id, block]));
  const root = blocks.find((block) => block.block_type === 1) || blocks.find((block) => !block.parent_id) || blocks[0];
  const title = renderTextElements(blockTextElements(root)).trim() || "Feishu document";
  const renderState = {
    ...state,
    blockMap,
    imageIndex: 0,
    images: [],
    activeBlocks: new Set(),
    unsupportedBlocks: new Map(),
  };
  const renderedChildren = [];

  for (const childId of root.children || []) {
    const markdown = await renderBlock(childId, renderState);
    if (markdown) renderedChildren.push(markdown);
  }

  const markdownBody = renderedChildren.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
  return {
    title,
    markdownBody,
    summary: firstReadableParagraph(markdownBody, title).slice(0, 160),
    sourceUrl: input,
    images: renderState.images,
    sourceStats: {
      blocks: blocks.length,
      images: renderState.images.length,
      unsupportedBlocks: [...renderState.unsupportedBlocks.entries()].map(([type, count]) => ({ type, count })),
    },
  };
}

export async function loadFeishuDocument(input, context) {
  if (!context?.feishu?.appId || !context?.feishu?.appSecret) {
    throw new Error("Feishu app_id and app_secret are required.");
  }
  if (!context.assetDir || !context.assetRelativeDir) {
    throw new Error("assetDir and assetRelativeDir are required for Feishu image downloads.");
  }

  const parsed = parseFeishuDocumentUrl(input);
  const feishu = {
    ...context.feishu,
    openApiBase: String(context.feishu.openApiBase || "https://open.feishu.cn").replace(/\/$/, ""),
  };
  fs.mkdirSync(context.assetDir, { recursive: true });

  const tenantAccessToken = await getTenantAccessToken(feishu);
  const documentToken = parsed.type === "wiki"
    ? await resolveWikiNode(feishu, tenantAccessToken, parsed.token)
    : parsed.token;
  const blocks = await listDocumentBlocks(feishu, tenantAccessToken, documentToken);

  return blocksToArticle(blocks, input, {
    feishu,
    tenantAccessToken,
    assetDir: context.assetDir,
    assetRelativeDir: context.assetRelativeDir,
  });
}

export { parseFeishuDocumentUrl };
