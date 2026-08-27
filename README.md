# TOONHUB · Skill Atlas

独立于 CinePalette 的公开 skill / 网站角色库。第一版包含：

- TOONHUB 全屏卡通 3D 小人轮播：点击互动、双击进入详情
- 正式 skill 与网站白名单、搜索、类型筛选、标签、版本信息
- 详情页展示简介、使用场景、完整 Markdown 与外部链接
- `/admin/` Decap CMS：用 GitHub 账号编辑 Markdown、简介和版本

## 本地运行

```bash
pnpm install
pnpm dev
```

## GitHub Pages

将目录推送到新仓库 `ljdubxud123103/skill-atlas`，开启 Settings → Pages → GitHub Actions。工作流会发布到：

`https://ljdubxud123103.github.io/skill-atlas/`

## 管理后台

Decap 的 GitHub backend 需要 OAuth 代理，不能把 GitHub Client Secret 放在 GitHub Pages 静态文件中。部署步骤：

1. 在 GitHub 创建 OAuth App，回调地址填写 OAuth 代理的 `/callback`。
2. 使用 Decap 官方文档列出的 Cloudflare Worker / Netlify Function OAuth 代理，在 `public/admin/config.yml` 的 `base_url` 替换 `YOUR-OAUTH-PROXY.example.com`。
3. 将 `repo` 改成实际的新仓库；只有拥有该仓库写权限的 GitHub 账号可以编辑。
4. 访问 `https://ljdubxud123103.github.io/skill-atlas/admin/` 登录并编辑。

每次保存都会提交 Markdown 到 GitHub，Actions 自动重新构建公开站。头像字段暂未开放编辑，等角色设定板确认后再加入。
