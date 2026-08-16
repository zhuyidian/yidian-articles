#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadFeishuDocument, parseFeishuDocumentUrl } from "./lib/feishu-docx.mjs";

const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const POSTS_DIR = path.join(PROJECT_ROOT, "src", "content", "posts");
const STAGING_ROOT = path.join(PROJECT_ROOT, ".feishu-imports");
const DEFAULT_CONFIG_PATH = path.join(PROJECT_ROOT, "config", "local.secrets.json");
const DEFAULT_MAIN_SITE_FILE = path.resolve(PROJECT_ROOT, "..", "main-site", "src", "utils", "articles.ts");
const DEFAULT_ARTICLE_BASE_URL = "https://articles.yidianhub.com";

function printUsage() {
  console.log(`Usage:
  pnpm feishu:import -- --url <feishu-url> --slug <post-slug> [options]

Required:
  --url <url>                  Feishu document or wiki URL.

Options:
  --slug <slug>                Optional lowercase English URL slug. Omit to derive one from the Feishu title.
  --published <ISO-8601>       Publish timestamp. Defaults to the local import time.
  --tags <tag1,tag2>           Comma-separated tags.
  --category <name>            Category. Defaults to 文章.
  --description <text>         Override the generated article summary.
  --config <path>              Local config. Defaults to config/local.secrets.json.
  --article-base-url <url>     Defaults to https://articles.yidianhub.com.
  --main-site-file <path>      Path to main-site/src/utils/articles.ts.
  --no-sync-main-site          Do not update the main-site fallback article list.
  --overwrite                  Replace an existing post with the same slug.
  --dry-run                    Download and validate without creating a post.
  --help                       Show this help.
`);
}

function parseArgs(argv) {
  const options = {
    syncMainSite: true,
    dryRun: false,
    overwrite: false,
    tags: "",
    category: "文章",
    config: DEFAULT_CONFIG_PATH,
    articleBaseUrl: DEFAULT_ARTICLE_BASE_URL,
    mainSiteFile: DEFAULT_MAIN_SITE_FILE,
  };
  const values = new Set([
    "url",
    "slug",
    "published",
    "tags",
    "category",
    "description",
    "config",
    "article-base-url",
    "main-site-file",
  ]);

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }
    if (argument === "--dry-run") {
      options.dryRun = true;
      continue;
    }
    if (argument === "--no-sync-main-site") {
      options.syncMainSite = false;
      continue;
    }
    if (argument === "--overwrite") {
      options.overwrite = true;
      continue;
    }
    if (!argument.startsWith("--")) throw new Error(`Unknown argument: ${argument}`);

    const key = argument.slice(2);
    if (!values.has(key)) throw new Error(`Unknown argument: ${argument}`);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) throw new Error(`Argument ${argument} requires a value.`);
    index += 1;

    const optionKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    options[optionKey] = value;
  }

  return options;
}

function stripJsonHashComments(content) {
  let result = "";
  let inString = false;
  let escaped = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    if (inString) {
      result += character;
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') {
      inString = true;
      result += character;
      continue;
    }
    if (character === "#") {
      while (index < content.length && content[index] !== "\n" && content[index] !== "\r") index += 1;
      if (index < content.length) result += content[index];
      continue;
    }
    result += character;
  }

  return result;
}

function resolveProjectPath(value) {
  return path.isAbsolute(value) ? value : path.resolve(PROJECT_ROOT, value);
}

async function loadFeishuConfig(configPath) {
  const resolvedConfigPath = resolveProjectPath(configPath);
  let raw;
  try {
    raw = await fs.readFile(resolvedConfigPath, "utf8");
  } catch {
    throw new Error(`Feishu config does not exist: ${resolvedConfigPath}. Copy config/local.secrets.example.json to config/local.secrets.json and fill in the app credentials.`);
  }

  let config;
  try {
    config = JSON.parse(stripJsonHashComments(raw).replace(/^\uFEFF/, ""));
  } catch (error) {
    throw new Error(`Cannot parse Feishu config: ${error.message}`);
  }

  if (!config.feishu?.app_id || !config.feishu?.app_secret) {
    throw new Error("Feishu config requires feishu.app_id and feishu.app_secret.");
  }

  return {
    appId: config.feishu.app_id,
    appSecret: config.feishu.app_secret,
    openApiBase: config.feishu.open_api_base || "https://open.feishu.cn",
  };
}

function localTimestamp(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  const second = String(date.getSeconds()).padStart(2, "0");
  const offsetMinutes = -date.getTimezoneOffset();
  const offsetSign = offsetMinutes >= 0 ? "+" : "-";
  const offsetHour = String(Math.floor(Math.abs(offsetMinutes) / 60)).padStart(2, "0");
  const offsetMinute = String(Math.abs(offsetMinutes) % 60).padStart(2, "0");
  return `${year}-${month}-${day}T${hour}:${minute}:${second}${offsetSign}${offsetHour}:${offsetMinute}`;
}

function isValidCalendarDate(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));
  return !Number.isNaN(date.getTime())
    && date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
}

function validatePublished(value) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    if (!isValidCalendarDate(year, month, day)) {
      throw new Error("--published is not a valid calendar date.");
    }
    return value;
  }

  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|[+-](\d{2}):(\d{2}))$/);
  if (!match) {
    throw new Error("--published must use YYYY-MM-DD or an ISO-8601 timestamp such as 2026-08-11T20:30:45+08:00.");
  }

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, timezone, offsetHourText, offsetMinuteText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);

  if (
    !isValidCalendarDate(year, month, day)
    || hour > 23
    || minute > 59
    || second > 59
  ) {
    throw new Error("--published is not a valid ISO-8601 timestamp.");
  }

  if (timezone !== "Z") {
    const offsetHour = Number(offsetHourText);
    const offsetMinute = Number(offsetMinuteText);
    if (offsetHour > 14 || offsetMinute > 59 || (offsetHour === 14 && offsetMinute !== 0)) {
      throw new Error("--published has an invalid UTC offset.");
    }
  }

  if (Number.isNaN(new Date(value).getTime())) {
    throw new Error("--published is not a valid ISO-8601 timestamp.");
  }

  return value;
}

function validateSlug(value) {
  const slug = String(value || "").trim().toLowerCase();
  if (!/^[a-z0-9]+(?:[a-z0-9-]*[a-z0-9])?$/.test(slug)) {
    throw new Error("--slug must use a lowercase English URL slug such as 'example-post'. Omit --slug to generate one from the Feishu title.");
  }
  return slug;
}

function fallbackSlug(url) {
  return `feishu-${parseFeishuDocumentUrl(url).token.toLowerCase()}`;
}

function suggestedSlugFromTitle(title, url) {
  const replacements = [
    [/一点\s*API/gi, " yidian api "],
    [/VS\s*Code/gi, " vscode "],
    [/Open\s*Code/gi, " open code "],
    [/Codex\s*CLI/gi, " codex cli "],
    [/CodeX/gi, " codex "],
    [/使用教程/gi, " "],
    [/接入使用/gi, " setup "],
    [/接入/gi, " setup "],
    [/兑换\s*key/gi, " redeem key "],
    [/兑换/gi, " redeem "],
    [/密钥/gi, " key "],
    [/配置/gi, " "],
  ];

  let normalizedTitle = String(title || "");
  for (const [pattern, replacement] of replacements) {
    normalizedTitle = normalizedTitle.replace(pattern, replacement);
  }

  const candidate = normalizedTitle
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return candidate || fallbackSlug(url);
}

function parseTags(value) {
  return [...new Set(String(value || "").split(",").map((tag) => tag.trim()).filter(Boolean))];
}

function yamlString(value) {
  return JSON.stringify(String(value || ""));
}

function buildMarkdown({ article, published, tags, category, description }) {
  const cover = article.images[0] ? `./${article.images[0].relativePath}` : "";
  const frontmatter = [
    "---",
    `title: ${yamlString(article.title)}`,
    `published: ${published}`,
    `description: ${yamlString(description || article.summary)}`,
    `image: ${yamlString(cover)}`,
    `tags: ${JSON.stringify(tags)}`,
    `category: ${yamlString(category)}`,
    "draft: false",
    "---",
  ];

  return `${frontmatter.join("\n")}\n\n${article.markdownBody}\n`;
}

function imageReferenceCount(markdown) {
  return [...markdown.matchAll(/!\[[^\]]*\]\((?:\.\/)?images\/[^)]+\)/g)].length;
}

async function listImageFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  return entries.filter((entry) => entry.isFile()).map((entry) => entry.name).sort();
}

async function sha256(filePath) {
  const bytes = await fs.readFile(filePath);
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

async function buildManifest({ postDirectory, article, markdown, slug, published }) {
  const imageDirectory = path.join(postDirectory, "images");
  const files = await listImageFiles(imageDirectory);
  const images = await Promise.all(files.map(async (filename) => {
    const filePath = path.join(imageDirectory, filename);
    const stat = await fs.stat(filePath);
    return { filename, bytes: stat.size, sha256: await sha256(filePath) };
  }));

  return {
    sourceUrl: article.sourceUrl,
    title: article.title,
    slug,
    published,
    importedAt: new Date().toISOString(),
    sourceStats: article.sourceStats,
    validation: {
      downloadedImages: images.length,
      markdownImageReferences: imageReferenceCount(markdown),
    },
    images,
  };
}

function renderMainSiteFallbackEntry({ title, description, slug, published, articleBaseUrl }) {
  const date = published.slice(0, 10).replace(/-/g, "/");
  const href = `${articleBaseUrl.replace(/\/$/, "")}/posts/${slug}/`;
  return [
    "  {",
    `    date: ${JSON.stringify(date)},`,
    `    title: ${JSON.stringify(title)},`,
    `    excerpt: ${JSON.stringify(description)},`,
    `    href: ${JSON.stringify(href)},`,
    "    meta: '最新文章',",
    "  },",
  ].join("\n");
}

async function planMainSiteFallbackUpdate({ mainSiteFile, title, description, slug, published, articleBaseUrl }) {
  const resolvedPath = resolveProjectPath(mainSiteFile);
  let source;
  try {
    source = await fs.readFile(resolvedPath, "utf8");
  } catch {
    throw new Error(`Main-site fallback file does not exist: ${resolvedPath}. Use --no-sync-main-site to publish only to the article site.`);
  }

  const href = `${articleBaseUrl.replace(/\/$/, "")}/posts/${slug}/`;
  if (source.includes(href)) return { changed: false, path: resolvedPath, source };

  const declaration = "const fallbackArticles: LatestArticle[] = [";
  const insertionPoint = source.indexOf(declaration);
  if (insertionPoint < 0) throw new Error(`Cannot find fallbackArticles in ${resolvedPath}.`);

  const insertAt = insertionPoint + declaration.length;
  const entry = renderMainSiteFallbackEntry({ title, description, slug, published, articleBaseUrl });
  return {
    changed: true,
    path: resolvedPath,
    source: `${source.slice(0, insertAt)}\n${entry}${source.slice(insertAt)}`,
  };
}

async function atomicWrite(filePath, content) {
  const temporaryPath = `${filePath}.feishu-import-${process.pid}-${Date.now()}.tmp`;
  await fs.writeFile(temporaryPath, content, "utf8");
  try {
    await fs.rename(temporaryPath, filePath);
  } catch (error) {
    if (!["EPERM", "EACCES"].includes(error.code)) throw error;
    await fs.copyFile(temporaryPath, filePath);
    await fs.rm(temporaryPath, { force: true });
  }
}

async function publishStagedPost(stagedPostDirectory, destination, { overwrite = false } = {}) {
  let destinationExisted = false;
  try {
    await fs.mkdir(destination);
  } catch (error) {
    if (error.code === "EEXIST") {
      if (!overwrite) throw new Error(`Post already exists: ${destination}`);
      destinationExisted = true;
    } else {
      throw error;
    }
  }

  try {
    const entries = await fs.readdir(stagedPostDirectory, { withFileTypes: true });
    if (destinationExisted) {
      const stagedNames = new Set(entries.map((entry) => entry.name));
      const existingEntries = await fs.readdir(destination, { withFileTypes: true });
      for (const existingEntry of existingEntries) {
        if (!stagedNames.has(existingEntry.name)) {
          await fs.rm(path.join(destination, existingEntry.name), { recursive: existingEntry.isDirectory(), force: true });
        }
      }
    }
    for (const entry of entries) {
      await fs.cp(
        path.join(stagedPostDirectory, entry.name),
        path.join(destination, entry.name),
        { recursive: entry.isDirectory(), force: overwrite, errorOnExist: !overwrite },
      );
    }
  } catch (error) {
    if (!destinationExisted) await fs.rm(destination, { recursive: true, force: true });
    throw error;
  }
}

async function createStagingDirectory() {
  await fs.mkdir(STAGING_ROOT, { recursive: true });

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const directory = path.join(STAGING_ROOT, `import-${Date.now()}-${crypto.randomUUID()}`);
    try {
      await fs.mkdir(directory);
      return directory;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
  }

  throw new Error("Could not create a unique Feishu import staging directory.");
}

function formatUnsupportedBlocks(unsupportedBlocks) {
  return unsupportedBlocks.map(({ type, count }) => `${type} (${count})`).join(", ");
}

async function run() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    printUsage();
    return;
  }
  if (!options.url) throw new Error("--url is required.");

  const published = validatePublished(options.published || localTimestamp());
  const tags = parseTags(options.tags);
  const category = String(options.category || "文章").trim() || "文章";
  const articleBaseUrl = new URL(options.articleBaseUrl).origin;
  const feishu = await loadFeishuConfig(options.config);

  const stagingDirectory = await createStagingDirectory();
  const stagedPostDirectory = path.join(stagingDirectory, "post");
  let articleMoved = false;

  try {
    const stagedImageDirectory = path.join(stagedPostDirectory, "images");
    await fs.mkdir(stagedImageDirectory, { recursive: true });
    const article = await loadFeishuDocument(options.url, {
      feishu,
      assetDir: stagedImageDirectory,
      assetRelativeDir: "images",
    });
    const slug = options.slug ? validateSlug(options.slug) : suggestedSlugFromTitle(article.title, options.url);
    const slugSource = options.slug ? "explicit" : slug.startsWith("feishu-") ? "fallback" : "title";
    const destination = path.join(POSTS_DIR, slug);

    const markdown = buildMarkdown({
      article,
      published,
      tags,
      category,
      description: options.description,
    });
    const imageFiles = await listImageFiles(stagedImageDirectory);
    const imageReferences = imageReferenceCount(markdown);

    if (article.sourceStats.images !== imageFiles.length || article.sourceStats.images !== imageReferences) {
      throw new Error(`Image validation failed: source=${article.sourceStats.images}, downloaded=${imageFiles.length}, markdown=${imageReferences}.`);
    }

    const report = {
      title: article.title,
      slug,
      slugSource,
      published,
      images: article.sourceStats.images,
      blocks: article.sourceStats.blocks,
      unsupportedBlocks: article.sourceStats.unsupportedBlocks,
      target: destination,
      mainSiteSync: options.syncMainSite,
      dryRun: options.dryRun,
    };

    if (options.dryRun) {
      console.log(JSON.stringify(report, null, 2));
      if (article.sourceStats.unsupportedBlocks.length > 0) process.exitCode = 2;
      return;
    }

    if (article.sourceStats.unsupportedBlocks.length > 0) {
      throw new Error(`The document has unsupported Feishu blocks: ${formatUnsupportedBlocks(article.sourceStats.unsupportedBlocks)}. No article was published.`);
    }

    const manifest = await buildManifest({ postDirectory: stagedPostDirectory, article, markdown, slug, published });
    await fs.writeFile(path.join(stagedPostDirectory, "index.md"), markdown, "utf8");
    await fs.writeFile(path.join(stagedPostDirectory, "import-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");

    const mainSitePlan = options.syncMainSite
      ? await planMainSiteFallbackUpdate({
        mainSiteFile: options.mainSiteFile,
        title: article.title,
        description: options.description || article.summary,
        slug,
        published,
        articleBaseUrl,
      })
      : undefined;

    await publishStagedPost(stagedPostDirectory, destination, { overwrite: options.overwrite });
    articleMoved = true;

    try {
      if (mainSitePlan?.changed) await atomicWrite(mainSitePlan.path, mainSitePlan.source);
    } catch (error) {
      await fs.rm(destination, { recursive: true, force: true });
      articleMoved = false;
      throw error;
    }

    console.log(JSON.stringify({
      ...report,
      mainSiteFallbackUpdated: Boolean(mainSitePlan?.changed),
      postPath: destination,
      articleUrl: `${articleBaseUrl}/posts/${slug}/`,
    }, null, 2));
  } finally {
    if (!articleMoved) await fs.rm(stagedPostDirectory, { recursive: true, force: true });
    await fs.rm(stagingDirectory, { recursive: true, force: true });
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
