---
name: find-duplicate-files
description: 按文件内容而不是文件名查找逐字节相同的重复文件，使用文件大小分组、抽样指纹和 SHA-256 完整校验提升速度，并生成清晰的终端摘要、中文可视化 HTML 报告、CSV、JSON 与待审核清理计划。适用于扫描文件夹或磁盘中的重复、相同、复制、备份或改名文件，比较名称不同但内容相同的文件，估算可释放空间，以及安全隔离或删除已确认的重复项。
---

# 重复文件查找

使用随附脚本快速扫描文件、清晰说明结果，并且只在用户明确审核后执行清理。

## 扫描

执行：

```powershell
python "<Skill目录>\scripts\duplicate_files.py" scan "<待扫描文件夹>"
```

扫描多个文件夹时，依次添加路径。常用参数：

```text
--output <目录>                指定报告输出目录
--min-size <字节数>           忽略小于指定大小的文件
--exclude <通配模式>          排除匹配路径，可重复使用
--workers <数量>              设置并行计算数量，默认自动选择
--keep oldest|newest|shortest 选择建议保留项的规则
--sample-size <字节数>        设置快速指纹的抽样块大小
--open                         扫描结束后打开 HTML 报告
```

自动使用以下分级策略：

1. 先按精确字节大小分组，不读取文件内容。
2. 对体积较大的同尺寸候选文件，只读取开头、中间和末尾来计算快速指纹。
3. 只对通过快速筛选的少量候选文件计算完整 SHA-256。
4. 将 SHA-256 相同的文件作为重复项写入报告。
5. 在实际清理前重新计算哈希，并逐字节比较文件内容。

不得使用文件名、修改时间、扩展名或抽样指纹代替最终内容校验。

## 展示结果

向用户说明重复组数量、重复路径数量、预计可释放空间、扫描错误，并返回以下可点击文件：

- `duplicate-report.html`：用于可视化审核
- `cleanup-plan.csv`：用于确认保留与清理决定
- `duplicate-files.csv`：用于电子表格分析
- `duplicate-files.json`：用于自动化处理

明确说明 `cleanup-plan.csv` 只包含建议操作，不代表已经删除文件：

- `KEEP`：建议保留的副本
- `DELETE`：普通的独立重复副本
- `SKIP_HARDLINK`：与保留项指向同一物理文件的硬链接
- `REVIEW_HARDLINK`：需要人工核对的硬链接；移除单个链接可能不会释放空间

## 可视化报告标准

保持 `duplicate-report.html` 为完全自包含的真实 HTML、CSS 和 JavaScript，不依赖网络资源，不使用截图或图片作为页面背景。

- 使用白色和极浅灰背景、轻量蓝紫强调色、浅色边框与克制阴影。
- 内容最大宽度保持 1440px，优先适配 1920×1080、1600×900 和 1440×900 横屏。
- 仅保留标题、四张统计卡片、搜索框、两个 CSV 按钮、折叠按钮和重复文件分组。
- 使用绿色表示建议保留与可释放空间，使用红色或粉红色表示建议清理。
- 使用内联 SVG 绘制图标，避免外部字体、图片、框架和运行时依赖。
- 不增加侧边栏、菜单、账户、设置、图表、历史记录或磁盘分析功能。

## 安全清理

用户只要求“查找”“检查”或“扫描”重复文件时，绝不执行清理。

更改文件前：

1. 请用户审核 HTML 或 CSV，并明确确认要保留和清理的文件。
2. 优先使用可恢复的隔离模式，不直接永久删除。
3. 先执行演练：

```powershell
python "<Skill目录>\scripts\duplicate_files.py" apply "<报告目录>\cleanup-plan.csv"
```

4. 向用户显示演练确认的文件数量和大小。
5. 只有获得明确同意后，才把计划中标记为 `DELETE` 的文件移入隔离区：

```powershell
python "<Skill目录>\scripts\duplicate_files.py" apply "<报告目录>\cleanup-plan.csv" --execute --mode quarantine --confirm MOVE_TO_QUARANTINE
```

只有用户明确要求不可恢复地删除时，才使用永久删除：

```powershell
python "<Skill目录>\scripts\duplicate_files.py" apply "<报告目录>\cleanup-plan.csv" --execute --mode delete --confirm PERMANENT_DELETE
```

如果文件发生变化、缺少可保留的相同副本、路径变成符号链接、SHA-256 不一致或逐字节比较失败，必须终止整个执行操作。隔离完成后，返回隔离目录和 `manifest.json` 恢复清单；不得把隔离表述为已经删除。

## 安全规则

- 跳过符号链接和目录联接的目标，避免循环扫描和含义不明确的清理操作。
- 把无法读取的文件错误写入报告，不得声称已经完整扫描。
- 默认排除以前生成的 `duplicate-file-report-*` 和 `.duplicate-quarantine-*` 目录。
- 除非用户明确要求，否则不要扫描系统目录、应用数据、云端占位文件或整个系统磁盘。
- 如果无法判断应保留哪个副本，不得代替用户编辑 `cleanup-plan.csv`；应询问用户希望保留的文件或规则。
- 把 SHA-256 表述为抗碰撞的内容标识，不得表述为数学意义上绝对唯一。
