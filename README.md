# 星桜笔记：Hexo 源码与维护说明

这是站点的 **Hexo 源码工作区**。`public/` 是生成产物，`.deploy_git/` 是独立部署工作区；不要在里面直接修文章或配置。

本轮整理不改变既有文章 URL、不改正文、不提交源码、不推送。日期表示作者填写的发布日期，不应根据复制文件产生的 CreationTime 推断历史发表时间。

## 1. 环境与恢复

- 当前已验证环境：Node **24.20.0**（`.node-version`）、npm **11.19.0**、Hexo **6.2.0**。
- 本项目统一使用 **npm + package-lock.json**。本轮没有重新安装/升级依赖，也没有删除既有 `yarn.lock`；它暂作为旧文件保留，不要混用 Yarn 安装。旧锁文件和未启用的主题/COS 插件留待单独清理。
- 已知：`package-lock.json` 仍是 `lockfileVersion: 1`（npm 6 时代）。依赖齐全，`npm ci` 目前能成功，但会提示 "old lockfile" 并每次都向 registry 补取元数据（`npm ci` 不会重写锁文件）。有空时联网执行 `npm install --package-lock-only` 升级锁文件，之后重新验证。
- 需要 Git。Windows 上 Git 不在 PATH 时，工具会尝试 `C:\Program Files\Git\cmd\git.exe`，也可设置 `GIT_EXECUTABLE`。
- PowerShell 若拦截 `npm.ps1`，使用以下 `npm.cmd` 写法。其他终端使用 `npm`。

在新克隆中依次执行，**上一步失败时不要继续**：

```powershell
npm.cmd ci
npm.cmd run setup
npm.cmd run verify
```

`setup` 只在主题目录不存在时克隆 `config/theme-lock.json` 指定的仓库，并检出完整提交 SHA。目录已经存在时只检查：提交必须完全一致，且不能有未提交的主题改动。它不会 reset、覆盖自定义主题、暂存文件或提交。

当前固定版本：Butterfly 4.3.1，提交 `7e830959205b54896690f3ca6ccd82c0e2487631`。不是自动拉取最新版本。更新主题时需要明确审查新版本，修改锁文件并重新验证。

目录与配置名称保持同样大小写：

```text
_config.yml 中 theme: Butterfly
_config.Butterfly.yml
themes/Butterfly/
```

这样 Linux 不依赖 Windows 的大小写容错。本轮保留现有目录名称，没有批量重命名。

## 2. 配置如何保存

| 文件 | 用途 |
|---|---|
| `_config.yml` | 站点普通配置，已取消误导性的忽略规则、保持在跟踪中；**但已提交的版本仍是默认模板，真实配置只存在于工作区**（见 2.1） |
| `config/butterfly.example.yml` | 可提交的当前主题设置快照，凭据类字段为空 |
| `_config.Butterfly.yml` | 本机完整设置，继续忽略，不在本轮公开其凭据 |
| `config/theme-lock.json` | 主题来源、版本与固定提交 |
| `config/post-urls.json` | 既有 15 篇文章 URL 基线，构建不会自动改写 |
| `config/validation.json` | 明确列出的历史空文章例外及原因 |

`npm run setup` **仅在本机主题配置不存在时**复制示例，不会覆盖已有设置。新克隆恢复的是无凭据配置；如需 Gitalk，需自行在被忽略的本机配置中填写 `gitalk.client_id` / `gitalk.client_secret`。缺少时构建警告，不谎称评论已可用。

主题普通设置变更后，可以显式更新去凭据快照：

```powershell
npm.cmd run config:example -- --write
```

生成器按凭据字段名称清空值，不改变本机配置。**这是辅助措施，不是完整的泄密扫描器**：提交前仍需检查差异，特别是 URL、任意自定义字段和嵌入代码中的令牌。

注意：Gitalk 会把所配置的 client secret 放入公开 HTML。环境变量或 `.gitignore` 不能保护已经注入前端的值；本工具不会测试 OAuth 权限或轮换凭据。

另外，旧 `_config.aurora.yml` 仍是已跟踪文件，历史提交也未清理。`.gitignore` 不会取消既有跟踪或清除历史。当前工作区含多项先前改动，**不要直接 `git add -A` 全量提交**；源码提交、历史凭据处置需另行审查。

### 2.1 源码提交现状

站点真实配置此前只存在于工作区（已提交的 `_config.yml` 曾长期是 Hexo 默认模板：`title: Hexo`、`author: John Doe`、`theme: aurora`）。首次结构整理共 6 个提交，已推送到 `origin/hexo`：

| 提交 | 内容 |
|---|---|
| `b708f48` | 构建校验工具与维护文档（`tools/`、`config/`、`README.md`、`.node-version`、`package.json`、`.gitignore`、`scaffolds/`） |
| `5dee57e` | 文章按分类重组到子目录并改名（`source/`，含 29 项重命名） |
| `55cbba8` | 提交真实站点配置：主题与永久链接（`_config.yml`） |
| `b2cd5d5` | 合并远端 `origin/hexo`（含网页端清空密钥的提交 `f02e9cc`） |
| `2435b8d` | 更正文档：记录提交现状与剩余项 |
| `d045e8b` | 清理未启用主题：停止跟踪 `_config.aurora.yml`、移除失效的子模块条目、提交 `_config.landscape.yml` 删除 |

推送为快进（`f02e9cc..d045e8b`），未使用强制推送；`master`（Pages 产物）未被本次操作改动。

合并时 `_config.yml` 的 deploy 段冲突，取本地版本：两侧写的都是空的注释占位符，取任一侧等价。

**历史里的凭据删不掉**：`b4d3348` 中仍能找到那对腾讯云密钥。`git commit` 无法从历史抹除，要真正止损只能去控制台轮换或作废。

仍未提交，需要单独决定：

| 文件 | 说明 |
|---|---|
| `_config.aurora.yml` | 已跟踪且含真实 Gitalk 凭据；直接提交新版本会再写入一份，建议连同停用主题一起清理 |
| `_config.landscape.yml` | 已删除但未提交（Landscape 未启用） |
| `package-lock.json` | 既有修改，与本次改动无关；将来升级锁文件时一并处理 |
| `.idea/*` | IDE 本地文件，建议保持不提交 |

后续提交源码的规则：用精确路径分批暂存（**不要 `git add -A`**）→ 扫描暂存 diff 的**新增行**是否含非空凭据字段（只看新增行，否则会误报历史删除行）→ 与 `npm run verify` 一起通过 → 最后才决定是否推送。

## 3. 新建与发布文章

推荐先创建草稿：

```powershell
npm.cmd run new -- "笔记标题"
```

这会写入 `source/_drafts/`，不出现在正式站点。新的 post/draft 模板都提供非空 `urlname`（初始为标题）、日期、可选封面及标签/分类。

命令会先校验标题、写完后再次解析草稿的 front matter，确认 `title`/`urlname` 与输入完全一致；不一致就报错而不是静默写错。因此标题不能：以 YAML 指示符（`- : ? , [ ] { } # & * ! > | @ ' " %` 或反引号）开头、包含 `{}`/`[]`、包含 `" #"`、或整体是 `null`/`true`/纯数字/日期形式。`C#基础`、`学习: 基础` 这类标题正常可用。

编辑示例：

```yaml
---
title: MySQL 学习笔记
urlname: mysql-notes
date: 2026-09-14 20:00:00
cover: /images/covers/mysql.jpg
tags: [MySQL]
categories: [数据库]
---
这里填写正文。示例日期请按实际写作/发布日期修改。
```

检查完正文后，通过 Hexo 发布草稿，再构建：

```powershell
npx.cmd hexo publish "笔记标题"
npm.cmd run verify
```

也可用已安装的本地 Hexo 命令：`node node_modules/hexo/bin/hexo publish "笔记标题"`。

- 不要留空 `urlname:`，不要在发布后随意随标题改它。
- 当前 permalink 仍是 `/post/:year/:month/:urlname/`，拼音转换仍启用。年月或 `urlname` 变化会改变网址。
- `Hello World` 显式设置 `urlname: index`，仅把已有默认值写清楚，旧网址不变。
- 分类/标签由 front matter 决定，不根据目录名自动生成。
- 新增文章验证通过后，可把其 `source -> path` 加到 `config/post-urls.json`，纳入后续防回归保护；已有基线不能为了让检查通过而直接删除或覆盖。计划改网址时应先设计旧网址重定向。

## 4. 构建与校验

```powershell
npm.cmd run check:posts    # 加载文章、检查元数据和 URL；不写 public
npm.cmd run clean          # 只清理 public/ 与 db.json 缓存（走同一套目录防护）
npm.cmd run build          # 配置检查 -> clean -> 源处理（before_generate 内做文章检查）-> generate --bail -> 输出检查
npm.cmd run check:output   # 检查当前 public 和当前文章是否对应
npm.cmd test               # 本地回归测试；不访问远端
npm.cmd run verify        # 测试 + 完整构建校验
npm.cmd run server        # 常规本地预览；不是发布校验入口
```

检查内容：

- 发布文章的标题、日期、非空 `urlname`，未替换的模板占位符。
- 按 Hexo **最终拼音 URL** 检查重复、大小写/编码别名、既有文章网址变化或删除。
- 新的空正文不允许发布。既有 `C#基础` 和 `运算符` 两篇空文章目前以**精确路径 + 原因**保留警告，避免本轮改变已发布内容；补完正文后移除对应例外。不是全局允许空文章。
- HTML 中真实的 `script[src]`、`link[href]`、图片、媒体、链接等本地静态引用，包括文件大小写和目录下的 `index.html`。
- 文章预期输出文件和页面标题；`[object Object]` 不是可忽略的链接，必须报错。
- CDN 地址覆盖项必须是 URL 字符串或 null；`enable: true` 这类对象、以及 `true`/`undefined`/`object Object` 这类序列化成字符串的值都会被拒绝。

输出检查使用 HTML 解析器，不再整段删除 script 后声称脚本链接无误。外链、OAuth、浏览器运行时动态请求、CSS 内部依赖和网络可达性不在静态检查保证范围内。

本轮同时修正 `_config.Butterfly.yml` 中两个错误 CDN 覆盖项，让主题使用原有默认地址；本地搜索与动态彩带的启用状态仍由各自顶层配置决定，没有擅自开启彩带。

## 5. 图片和自定义资源

本轮不移动已有图片，以免引入断链。新资源可采用：

```text
source/images/covers/                       # 共享封面（使用时自行创建）
source/images/common/                       # 共享图标等
source/_posts/MySQL8_base/运算符/cover.jpg     # 文章专用资源
```

专用图片和 Markdown 保持同名目录配对；`cover: cover.jpg` 使用文章资源目录，`cover: /images/covers/mysql.jpg` 使用站点共享目录。图片未放入前不要直接复制示例路径。

主题自定义样式/脚本建议放到 `source/css/`、`source/js/`，通过主题 `inject` 设置引用，尽量不直接修改固定版本主题。

## 6. 部署边界

**build、verify、setup、new 都不会推送。** `.deploy_git` 在本轮未被同步或改动。

未来明确决定部署时：

```powershell
npm.cmd run deploy -- --confirm
```

部署入口先重新构建并通过全部检查，才调用已有 Hexo Git 部署器；没有 `--confirm` 会立即失败。已有部署器仍按 `_config.yml` 向 GitHub `master` 推送（插件自身可能使用强制推送），不是推源码 `hexo` 分支。请先确认目标和远端状态。

源码分支 `hexo` 已提交并推送到 `origin`；`master`（GitHub Pages 产物）仍只在明确 `--confirm` 时更新。推送源码用常规 `git push origin hexo`，**不要推送 `master`**。本工具不改 SSH 配置、不添加新密钥、不新增自动部署工作流。直接调用 `hexo deploy` 会绕过本工具的校验，日常请使用上面的 npm 入口。

## 7. 后续独立处理

- **源码推送**：后续每次推送前先 `git fetch` 比较 `hexo...origin/hexo`，不要仅凭两个 SHA 不同判断谁领先。
- **依赖清理**：`hexo-theme-aurora`、`hexo-theme-landscape`、两个 COS 部署插件仍在 `package.json` 且都未使用。**删除依赖必须同时重写 `package-lock.json`**，否则 `npm ci` 会因 package.json 与锁文件不同步而直接失败；而 npm 11 处理这个 `lockfileVersion: 1` 的旧锁时会整体升级格式。这是需要联网、单独提交并重新验证的改动，不要只改 `package.json`。
- **凭据轮换**：腾讯云那对密钥仍留在历史 `b4d3348` 中，`git commit` 无法抹除，只能去控制台轮换或作废。
- **评论系统**：Gitalk 的 client secret 会进入公开 HTML，这是该方案本身的性质；如需更换，先改本机被忽略的主题配置再验证。
- **两篇空文章**：`C#基础`、`运算符` 仍是空正文，补完后从 `config/validation.json` 移除对应例外。
- **GitHub Actions**：如需要，先验证全新依赖安装，再单独确认部署权限与工作流。

已处理：`_config.aurora.yml` 停止跟踪（含真实 Gitalk 凭据，且 Aurora 未启用）；`_config.landscape.yml` 的删除已提交；`themes/landfarz` 这个没有 `.gitmodules` 的失效子模块条目已从索引移除。
