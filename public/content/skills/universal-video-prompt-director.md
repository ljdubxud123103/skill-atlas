---
name: universal-video-prompt-director
description: Generate, rewrite, review, or continue complete narrative video prompts and shot lists from scripts, prose, storyboards, still frames, reference assets, or existing prompts. Use for single shots, variable-duration units, full episodes, dialogue and emotional scenes, action staging, montage, transitions, reference-to-video work, first/last-frame continuation, and character-introduction teasers. Preserve source facts and dialogue, route timing and syntax to the supplied content and target model, classify each shot as transitional, narrative, emotional/climactic, or protagonist-charm pacing, apply nine mandatory directing-control methods, keep per-shot position closure visible to the video model, and run the complete iterative Review Loop before delivery. Do not use for still-image asset prompts, image generation, or operating a video-generation platform.
---

# 通用叙事视频提示词导演

## 目标与边界

把剧本、小说、分镜、静帧、参考素材、已有提示词或生成复盘，转换为目标视频模型可直接执行的完整中文提示词。

只处理视频提示词、分镜和导演控制。用户只要求文本时，不生成图片或视频；不重新设计已锁定的人物、服装、场景、道具、画风和音色。

优先保证：

1. 剧本事实、原台词、人物关系与事件顺序不变。
2. 每场只有一个主戏点，单元落点服务于该戏点。
3. 空间、动作、视线、道具、声音与上下镜连续。
4. 镜头、表演、节奏、参考和媒介控制可被目标模型执行。
5. 最终提示词完整但不冗余。

## 必读路由

- 新写、重写、续写或整集处理：完整读取 [references/decision-system.md](references/decision-system.md)、[references/directing-controls.md](references/directing-controls.md)、[references/prompt-contracts.md](references/prompt-contracts.md) 和 [references/review-loop.md](references/review-loop.md)。
- 仅审核已有提示词：完整读取 [references/decision-system.md](references/decision-system.md)、[references/prompt-contracts.md](references/prompt-contracts.md) 和 [references/review-loop.md](references/review-loop.md)；涉及镜头、动作、声音或转场问题时再读 [references/directing-controls.md](references/directing-controls.md)。
- 目标为 Seedance：同时完整读取 [references/seedance-2-5.md](references/seedance-2-5.md)。该文件把官方事实与内部推导分开，禁止把内部经验写成官方规范。

## 冲突裁决

依次服从：

1. 用户本轮明确指令与指定格式。
2. 用户锁定的参考资产、空间拓扑、镜头、时长与收尾。
3. 剧本事实、原台词、人物关系、事件顺序与物理连续性。
4. 当前项目的介质、画幅、风格与平台限制。
5. 用户此前确认且本轮未推翻的规则。
6. 本 Skill 的默认方法与本轮新创意。

不得用情绪强化改写剧情，不得用电影感覆盖锁定事实，不得把推断写成已确认内容。

## 横向知识权重

默认注意力预算总和为 100%：

| 知识域 | 权重 |
| --- | ---: |
| 导演意图／叙事 | 17% |
| 镜头／剪辑／节奏 | 18% |
| 空间／物理／动作 | 17% |
| 表演／情绪／台词 | 16% |
| 视觉媒介／光色／纵深 | 10% |
| 声音／节拍／声线 | 9% |
| 资产／参考一致性 | 8% |
| 模型能力／可行性／安全 | 5% |

按任务类型在相邻领域内动态路由，但总和保持 100%，任何单域不得固定垄断。权重不抵消硬门禁：剧情、台词、身份、空间、动作因果、参考错绑、站位收束、声音来源和平台安全出现 P0 时必须驳回修改。

## 九项强制导演控制方法

每次生成、重写或审核都逐项标记 `适用 / 不适用`；适用项必须落实到最终提示词：

1. **戏点／对比**：先写场景目标、唯一主戏点和核心反差；镜头、表演和声音共同服务一个结果。
2. **空间拓扑**：锁定入口、出口、轴线、遮挡、前中后景、主体距离、进出画路径和空间变化。
3. **动作因果**：关键动作按 `起点 → 过程 → 结果 → 环境反馈` 写完整；非关键流程允许切到结果。
4. **镜头四通道**：分别设计摄影机位置路径、朝向／俯仰、焦点／焦段和稳定性／震动；只保留一条主空间路径，其他通道可作为有动机的从属变化。
5. **节奏／情绪路由**：每镜先判定为过场、叙事推进、情绪／高潮或男女主魅力时刻。无独立情绪与信息结果的过场默认压到 1—1.5 秒；情绪转折、高潮戏点和主角魅力镜主动放慢，给触发、反应、面容／姿态与余韵足够停留。
6. **三种时序**：按用户内容、目标时长和任务需要选择精确秒点、节拍阶段或语义阶段；不默认 15 秒或 30 秒。
7. **动机化转场**：遮挡、匹配、焦点、光色、声音和硬切必须有触发原因、切点与转场后的结果，不用黑白闪或特效掩盖连续性问题。
8. **声音骨架**：让动作声、环境声、静默、声音距离、台词和卡点从初稿共同控制节奏，而不是末尾补充音效清单。
9. **参考职责**：写清每份参考控制什么、优先级、文本可覆盖什么、哪些内容必须不变；不重复粘贴完整资产描述。

详细执行与检查见 [references/directing-controls.md](references/directing-controls.md)。

## 强制执行顺序

纵向注意力预算总和为 100%：

1. **能力与输入路由 8%**：确认目标模型、介质、参考类型、输出格式和真实平台能力。
2. **来源事实与戏点 12%**：锁剧情、台词、人物、结果、核心对比和用户排他要求。
3. **空间拓扑与参考职责 13%**：锁轴线、尺度、进出边界、主体层级、不变量和参考优先级。
4. **动作／镜头／节奏预演 20%**：先在内部完成动作因果、镜头四通道、时序语法与转场设计。
5. **表演／台词／声音编舞 15%**：把情绪落实为可见表演和可听节拍，原台词逐字保留。
6. **模型化序列化与压缩 12%**：只写模型需要的控制量，删除重复资产、品牌堆叠和无效铁律。
7. **冲突／可行性／Review 15%**：形成 V0，运行完整 Review Loop，累计修订至全部通过。
8. **导出与连续性台账 5%**：交付模型专属完整版本，维护序号和跨单元承接。

禁止先堆写提示词再补逻辑；先完成预演，再序列化。

## 时长与时序

- 时长由用户给定内容、原稿边界、目标模型能力、台词容量、动作负荷和叙事目标共同决定。
- 秒数分配前先完成节奏／情绪路由：`T 过场｜P 叙事推进｜E 情绪／高潮｜C 主角魅力`。T 默认 1—1.5 秒；P 只给完成信息或因果所需时长；E 与 C 延长到观众能看清变化、面容、姿态和余韵，但不得用重复微动作或无意义慢动作灌时长。
- 不把 Seedance 2.5 的最长 30 秒误写成每条默认 30 秒。
- 原稿有可靠秒点且用户要求保留时使用精确秒点；音乐卡点、表演节奏或喜剧节拍优先使用节拍阶段；长镜头、开放时长或 30 秒叙事优先使用语义阶段。
- 用户锁定总时长时，各段连续、无重叠、无空档，总和准确；承载不下时删减、拆分或请求最少必要确认，不加速念词。

完整路由见 [references/decision-system.md](references/decision-system.md)。

## 媒介、风格与电影参考

- 先识别真人实拍、手机纪实、2D、3D CG、白模、绿幕、混合媒介或其他形式，再选择一致的镜头、光线和材质语言。
- 不设置永久 `35mm Kodak Vision3 500T` 或任何通用胶片基底。
- 电影、导演和摄影师参考完全可选。用户或原稿提供时保留并转译为可执行变量；没有时不主动补片名。
- 片名不能代替焦段、构图、光向、材质、运动、节奏和声音。

## 模型可见的站位收束

每个主镜头结尾都把 `【镜头结尾·站位收束】` 明确写给视频模型；用户格式不允许新增字段时，把同等内容写进该镜最接近的既有字段。至少包含：

- 人物画面位置、远近、朝向与视线目标。
- 动作终点、支撑和重心。
- 道具归属、持握手、状态与落点。
- 情绪余韵与声音尾点。
- 下一镜可直接承接的起点。

站位收束不是内部隐藏账本，也不能只写“保持连续”。

## 输出纪律

- 用户有模板时保留字段名、标点和顺序；没有时使用 [references/prompt-contracts.md](references/prompt-contracts.md) 的标准格式。
- 最终交付完整、可直接复制的目标模型版本，不只给方向、审核表或局部补丁。
- 每段连续台词的可发声原文只出现一次。语气、停顿、重音和与台词同步的运镜先写在台词前，不直接引述台词片段；台词后只写无声余韵。完整契约见 [references/prompt-contracts.md](references/prompt-contracts.md)。
- 不伪造参考图、资产 ID、角色绑定、音色、版本或平台语法。
- 只写本条真实风险的负向限制；删除通用长串、重复“必须严格”和互相冲突的命令。
- 每次修改累计保留此前已确认且本轮未推翻的要求。
- 未经 [references/review-loop.md](references/review-loop.md) 最终一轮全部通过，不得标记为可直接生成版本。
