---
argument-hint: <article-url>
description: 抓取英文技术文章网页并翻译为中文 Markdown。输入一个 URL，自动完成： Playwright 抓取 → Readability 正文提取 → 图片下载 → 中文重写。 当用户提供英文文章链接、说"翻译这篇文章"、"把这个链接翻译成中文"、 "translate this article"、或者给出 medium.com / substack.com / x.com 等技术博客 URL 时，使用此 skill。即使用户只是贴了一个链接没有明确说 "翻译"，只要链接指向英文技术文章，也应主动建议使用此 skill。
disable-model-invocation: true
name: translate-article
---

## 总览

这个 skill 分两个阶段执行：

1. **抓取阶段**（脚本）：运行 `fetch-article.js` 脚本，用 Playwright 抓取网页、提取正文、下载图片
2. **翻译阶段**（你来做）：读取提取的英文 Markdown，按翻译提示词将其重写为中文

你就是翻译引擎——不需要调用任何外部 API。

## 第一步：运行抓取脚本

确保 Node.js 18+ 可用，然后运行抓取脚本：

```bash
export NVM_DIR="$HOME/.nvm" && [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && nvm use 18 2>/dev/null; node ${CLAUDE_SKILL_DIR}/scripts/fetch-article.mjs $ARGUMENTS
```

这个脚本会：
- 用 Playwright headless Chromium 加载页面（处理 JS 渲染、懒加载、cookie 弹窗）
- 用 Readability 提取正文，用 Turndown 转为 Markdown
- 下载所有图片到 `assets/` 目录，重写 Markdown 中的图片路径
- 输出到 `article-zh/<slug>/` 目录

脚本运行结束后，会打印输出目录路径。记住这个路径。

### 如果脚本失败

- **依赖未安装**：运行 `cd <project-root>/article-zh-tool && npm install && npx playwright install chromium`
- **Node 版本过低**：需要 Node.js 18+，用 `nvm use 18` 切换
- **页面抓取为空**：部分重度 SPA 页面（如 openai.com）Readability 无法提取，告知用户手动复制正文到 Markdown 文件，然后用 `--from-file` 模式

## 第二步：读取翻译提示词

读取翻译提示词文件：

```
prompt1.md
```

这个文件定义了完整的翻译规范，包括：
- 角色定义（中文技术社区资深作者）
- 核心原则（技术准确 > 中文原创感 > 信息完整 > 不加私货）
- 术语处理三级规则
- 中文表达铁律（翻译腔识别与消除）
- 叙述视角规则
- 自审清单

**你必须严格遵循这个提示词中的所有规则。**

## 第三步：翻译

1. 读取第一步输出的 `article.md` 文件
2. 跳过文件开头的 metadata header（标题、作者、来源等 `---` 分隔线之前的部分），只翻译正文
3. 按照 `prompt1.md` 中的工作流程执行翻译：
   - 通读原文，建立术语映射表、叙述视角判断、文章结构骨架
   - 按中文逻辑重组结构
   - 逐段用中文重写（不是逐句翻译）
   - 自审并修正
4. 图片引用路径保持不变（`assets/img-XXX.ext`），不要修改
5. 代码块、命令、变量名、URL 保持原样，不翻译

## 第四步：保存输出

将翻译结果保存到同一目录下的 `article-zh.md`：

```
article-zh/<slug>/article-zh.md
```

同时更新 `metadata.json`，将 `"translated": false` 改为 `"translated": true`。

## 第五步：确认

向用户报告：
- 输出目录路径
- 文章标题（中英文）
- 图片数量
- 翻译是否完成

## 注意事项

- 翻译时遇到超长文章（超过你的输出限制），按 `##` 标题分段翻译，每段写入后继续下一段
- 如果用户提供的不是 URL 而是本地文件路径，跳过第一步，直接读取文件进行翻译
- 翻译结果不要包含任何译者注、翻译说明或提示词痕迹
