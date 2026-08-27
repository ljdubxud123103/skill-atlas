# TOONHUB 发布清单

## 1. 创建独立 GitHub 仓库

建议使用公开仓库：`ljdubxud123103/skill-atlas`。它与原来的 CinePalette 仓库完全分开。

在本地项目目录执行：

```bash
git commit -m "feat: initial TOONHUB skill atlas"
git remote add origin https://github.com/ljdubxud123103/skill-atlas.git
git push -u origin main
```

然后在 GitHub 仓库的 Settings → Pages 中选择 GitHub Actions，现有的 `.github/workflows/deploy.yml` 会自动发布到：

`https://ljdubxud123103.github.io/skill-atlas/`

## 2. 启用只允许本人编辑的后台

Decap CMS 的 GitHub backend 需要 OAuth 代理。推荐使用 Cloudflare Worker：

1. 创建 GitHub OAuth App，回调地址填写 OAuth Worker 的 `/callback`。
2. 部署 `sterlingwes/decap-proxy` 到 Cloudflare Worker。
3. 将 `GITHUB_OAUTH_ID` 和 `GITHUB_OAUTH_SECRET` 作为 Worker Secret 保存。
4. 把 `public/admin/config.yml` 的 `backend.base_url` 改成 Worker URL。
5. 保持仓库只有你的 GitHub 账号拥有写权限。

这样网站可以公开浏览，但只有拥有仓库写权限的账号可以保存 Markdown、简介和版本信息。

## 3. 上线前检查

- 首页 15 个角色头像均使用 `*-3d.png`，无卡片边框。
- `/admin/` 能打开 Decap CMS 登录页。
- GitHub 登录成功后可以编辑 `public/content/skills` 和 `public/content/sites`。
- 保存内容后 GitHub Actions 自动重新构建网站。
