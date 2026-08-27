---
name: asset-folder-sync
description: 配置、启动、检查或修复 YXW 资产网站的本地图片文件夹同步助手。用于成员希望监控某个本地文件夹、将新图片自动上传到团队资产网站、上传成功后逐张移入“已上传”、失败时保留原图重试，或把共享心选库同步到本地时。也用于更换监听文件夹、项目、成员名、网站地址或心选库路径，以及启用开机自动运行。
---

# 资产文件夹同步

将成员电脑上的图片输出文件夹连接到自托管团队资产网站。不依赖 Lovart CLI、MCP 或网页抓取：任何软件只要把图片写入监听文件夹，同步助手都会处理。

## 首次配置

开始任何安装或启动动作前，按顺序向用户确认：

1. 先问“图片会放在哪个文件夹？请直接发送完整路径。”
2. 再给出明确选项，问“是否同意将团队心选库自动保存到本地，并新建心选库文件夹？”
3. 若同意，询问心选库路径；用户不指定时默认使用监听文件夹下的 `心选库`。
4. 确认成员显示名、团队网站地址和目标项目。网站地址不明确时询问，不猜公网地址；项目列表可从 `<网站地址>/api/projects` 读取后让用户选择。
5. 说明已有图片默认只登记为基线，不会在首次启动时批量上传；只有配置完成后新增或被修改的图片会自动上传。用户明确要求导入已有图片时，才清除基线状态。
6. 最后询问是否随 Windows 登录自动启动。只有用户明确同意后才运行开机启动脚本。

使用 `scripts/Configure-Agent.ps1` 写入配置。此脚本会创建监听文件夹内的 `已上传`，并按选择创建 `心选库`。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Configure-Agent.ps1 `
  -WatchFolder 'C:\完整\图片路径' `
  -ServerUrl 'http://192.168.x.x:43128' `
  -ProjectId '项目ID' `
  -MemberName '成员名' `
  -SyncFavorites `
  -FavoriteFolder 'C:\完整\图片路径\心选库'
```

## 处理规则

- 只监控监听文件夹顶层的 JPG、JPEG、PNG、WebP、GIF；不扫描 `已上传` 或其他子文件夹。
- 文件大小和修改时间稳定至少 5 秒后才上传，避免上传未写完的文件。
- 只有网站明确返回成功，才把原文件原子移动到监听文件夹下的 `已上传`。这等价于从原路径逐张移除并在 `已上传` 留存原始文件，不做“永久删除后再下载”。
- 如果 `已上传` 已有同名文件，在文件名后加时间戳；永不覆盖。
- 服务器离线、上传失败、图片不可读、磁盘达到 80% 或响应不明确时，源文件必须留在原位置，稍后重试。
- 网站判定为重复且返回成功时，也移入 `已上传`，防止反复提交。
- 图片含生成元数据时自动读取提示词；缺失时使用同步占位说明并进入网站待归类流程，成员可补充信息和人工改分类。
- 本地心选库只增量下载当前团队心选图；团队取消心选不会自动删除已经下载的本地文件。

## 启动与检查

运行 `scripts/Start-Agent.ps1` 启动前台同步；需要隐藏后台运行时加 `-Hidden`。运行 `scripts/Get-AgentStatus.ps1` 查看配置、最近扫描、失败原因和移动后的路径。

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Start-Agent.ps1 -Hidden
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Get-AgentStatus.ps1
```

用户同意开机自动启动后，运行：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Install-Autostart.ps1
```

## 变更与安全

- 更换监听路径或项目时重新执行配置脚本；新路径内已有图片重新建立基线。
- 不通过此 Skill 永久删除图片。移入 `已上传` 后的清理由用户自行决定。
- 不把密码、令牌、Cookie 或验证码写入配置。当前团队网站无登录时只保存 URL、项目 ID 和成员显示名。
- 网站端仍是多人共用审核状态的唯一事实来源；Skill 只负责各成员电脑的输入和可选心选下载，不能取代团队网站。
