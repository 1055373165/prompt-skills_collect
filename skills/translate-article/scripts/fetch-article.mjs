#!/usr/bin/env node

/**
 * fetch-article.js — Standalone script for the translate-article skill.
 *
 * Usage: node fetch-article.js <url> [--output <dir>] [--from-file <path>]
 *
 * Fetches an English article via Playwright, extracts content with Readability,
 * downloads images, and outputs English Markdown + assets directory.
 * Translation is handled by Claude (the skill invoker), not this script.
 */

import { resolve, dirname, join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { mkdir, writeFile, readFile, access } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, '..', '..', '..');
const TOOL_DIR = join(PROJECT_ROOT, 'article-zh-tool');

// ---------------------------------------------------------------------------
// Argument parsing (minimal, no external deps)
// ---------------------------------------------------------------------------
function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = { url: null, output: join(PROJECT_ROOT, 'article-zh'), fromFile: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' || args[i] === '-o') {
      opts.output = resolve(args[++i]);
    } else if (args[i] === '--from-file') {
      opts.fromFile = resolve(args[++i]);
    } else if (!args[i].startsWith('-')) {
      opts.url = args[i];
    }
  }
  return opts;
}

// ---------------------------------------------------------------------------
// Dynamic imports from article-zh-tool (reuse existing modules)
// ---------------------------------------------------------------------------
async function loadModules() {
  try {
    await access(join(TOOL_DIR, 'node_modules'));
  } catch {
    console.error(`❌ 依赖未安装。请先运行:\n  cd ${TOOL_DIR} && npm install && npx playwright install chromium`);
    process.exit(1);
  }

  // Import from the tool's src/ directory
  const { fetchPage } = await import(join(TOOL_DIR, 'src', 'fetcher.js'));
  const { extractArticle } = await import(join(TOOL_DIR, 'src', 'extractor.js'));
  const { downloadAssets } = await import(join(TOOL_DIR, 'src', 'downloader.js'));
  return { fetchPage, extractArticle, downloadAssets };
}

// ---------------------------------------------------------------------------
// Slug generation
// ---------------------------------------------------------------------------
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

// ---------------------------------------------------------------------------
// Progress logger
// ---------------------------------------------------------------------------
function log(msg) {
  const ts = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  process.stderr.write(`[${ts}] ${msg}\n`);
}

// ---------------------------------------------------------------------------
// Build metadata header for the English markdown
// ---------------------------------------------------------------------------
function buildHeader(title, author, date, url) {
  let header = `# ${title}\n\n`;
  const meta = [];
  if (author) meta.push(`**Author**: ${author}`);
  if (date) meta.push(`**Date**: ${date}`);
  if (url) meta.push(`**Source**: ${url}`);
  if (meta.length > 0) {
    header += meta.join('  \n') + '\n\n---\n\n';
  }
  return header;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const opts = parseArgs(process.argv);

  if (!opts.url && !opts.fromFile) {
    console.error('用法: node fetch-article.js <url> [--output <dir>] [--from-file <path>]');
    process.exit(1);
  }

  const { fetchPage, extractArticle, downloadAssets } = await loadModules();

  let markdown, title, author, date, sourceUrl;

  if (opts.fromFile) {
    // ----- From local file -----
    log(`模式: 从本地文件读取 ${opts.fromFile}`);
    markdown = await readFile(opts.fromFile, 'utf-8');
    title = basename(opts.fromFile, extname(opts.fromFile));
    sourceUrl = null;
    author = null;
    date = null;
  } else {
    // ----- Full pipeline: fetch → extract -----
    log('===== 阶段一: 网页抓取 =====');
    const { html, metadata, finalUrl } = await fetchPage(opts.url, { onProgress: log });
    sourceUrl = finalUrl;

    log('===== 阶段二: 正文提取 =====');
    const article = extractArticle(html, finalUrl);
    markdown = article.markdown;
    title = article.title || metadata.title || 'untitled';
    author = article.author || metadata.author || null;
    date = metadata.date || null;

    log(`标题: ${title}`);
    log(`作者: ${author || '未知'}`);
    log(`正文长度: ${markdown.length} 字符`);

    if (markdown.length < 200) {
      log('⚠️  提取的正文过短，可能是重度 SPA 页面。建议手动复制正文后使用 --from-file 模式。');
    }
  }

  // Prepare output directory
  const slug = slugify(title);
  const articleDir = join(opts.output, slug);
  const assetsDir = join(articleDir, 'assets');
  await mkdir(assetsDir, { recursive: true });

  // Phase 3: Download assets
  log('===== 阶段三: 媒体资源下载 =====');
  const baseUrl = sourceUrl || '';
  const { markdown: mdWithLocalAssets, downloadedCount, failedCount } =
    await downloadAssets(markdown, baseUrl, assetsDir, { onProgress: log });

  // Save English version
  const enFilePath = join(articleDir, 'article.md');
  const header = buildHeader(title, author, date, sourceUrl);
  await writeFile(enFilePath, header + mdWithLocalAssets, 'utf-8');
  log(`英文原文已保存: ${enFilePath}`);

  // Save metadata
  const metadata = {
    title,
    author,
    date,
    source_url: sourceUrl,
    fetched_at: new Date().toISOString(),
    asset_count: downloadedCount,
    failed_assets: failedCount,
    translated: false,
  };
  const metadataPath = join(articleDir, 'metadata.json');
  await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

  // Print summary to stdout (for Claude to parse)
  const summary = {
    status: 'success',
    output_dir: articleDir,
    article_file: enFilePath,
    metadata_file: metadataPath,
    title,
    author,
    content_length: mdWithLocalAssets.length,
    asset_count: downloadedCount,
    failed_assets: failedCount,
  };

  console.log('\n' + JSON.stringify(summary, null, 2));

  log('');
  log('✅ 抓取完成！等待翻译...');
  log(`   输出目录: ${articleDir}/`);
  log(`   ├── article.md          (英文原文)`);
  log(`   ├── metadata.json       (元数据)`);
  log(`   └── assets/             (${downloadedCount} 个媒体文件)`);
}

main().catch((err) => {
  console.error(`\n❌ 错误: ${err.message}`);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
