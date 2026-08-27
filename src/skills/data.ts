export type Personality = 'bold' | 'calm' | 'playful' | 'warm' | 'precise';
export type EntryKind = 'skill' | 'site';
export type Entry = {
  slug: string; name: string; kind: EntryKind; summary: string; scenarios: string[];
  version: string; updated: string; tags: string[]; avatar: string; avatarLabel: string;
  personality: Personality; contentPath: string; externalUrl?: string;
};

const FIGURINES = [
  'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/1.02464a56.png',
  'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/2.b977faab.png',
  'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/3.4df853b4.png',
  'https://fifth-gentle-45902158.figma.site/_components/v2/4de492f6d9cf8244ad5293233e5c6f52407d42fc/4.4457fbce.png',
];

// Formal 3D figurines generated for the confirmed 15-role roster.
// Relative paths keep the site working on a GitHub Pages project subpath.
const LOCAL_AVATARS: Record<string, string> = {
  'yxw-video-prompt-director': 'avatars/01-yxw-video-prompt-director-3d.png',
  'universal-video-prompt-director': 'avatars/02-universal-video-prompt-director-3d.png',
  'female-3d-microdrama-storyboard': 'avatars/03-female-3d-microdrama-storyboard-3d.png',
  'character-asset-prompt': 'avatars/04-character-asset-prompt-3d.png',
  'yxw-visual-production': 'avatars/05-yxw-visual-production-3d.png',
  'blender-whitebox-motion-studio': 'avatars/06-blender-whitebox-motion-studio-3d.png',
  'storyboarder-whitebox-scene': 'avatars/07-storyboarder-whitebox-scene-3d.png',
  'asset-folder-sync': 'avatars/08-asset-folder-sync-3d.png',
  'find-duplicate-files': 'avatars/09-find-duplicate-files-3d.png',
  'yxw-video-prompt-director-conversation': 'avatars/10-yxw-video-prompt-director-conversation-3d.png',
  cinepalette: 'avatars/11-cinepalette-3d.png',
  'asset-review-studio': 'avatars/12-asset-review-studio-3d.png',
  'face-outfit-studio': 'avatars/13-face-outfit-studio-3d.png',
  'storyboarder-whitebox-studio': 'avatars/14-storyboarder-whitebox-studio-3d.png',
  'video-review-studio': 'avatars/15-video-review-studio-3d.png',
};

const raw = [
  ['yxw-video-prompt-director','YXW 视频提示词导演','skill','把中文剧本、分镜和参考视频整理成可直接生成的 Seedance 视频提示词。',['15 秒视频单元','情绪对手戏','转场变装'],'2026.08','2026-08-26',['视频','Seedance','分镜'],0,'镜头导演','bold'],
  ['universal-video-prompt-director','Universal Video Prompt Director','skill','面向完整叙事视频的通用导演工作流，覆盖动作、对白、蒙太奇与连续性。',['长台词反应镜头','动作调度','首尾帧衔接'],'2026.08','2026-08-26',['视频','叙事','导演'],1,'叙事导演','calm'],
  ['female-3d-microdrama-storyboard','女频 3D 微短剧分镜','skill','把女频短剧场次拆成最长 30 秒、情绪和机位明确的 3D 漫剧生成单元。',['女主重大选择','关系转折','情绪渐变'],'2026.08','2026-08-26',['女频','3D 漫剧','分镜'],2,'微剧编舞','warm'],
  ['character-asset-prompt','角色资产提示词','skill','生成角色脸基准、身材比例、妆发服装和三视图资产板。',['角色三视图','服装闭环','表情状态'],'2026.08','2026-08-26',['角色','资产','提示词'],3,'角色造型师','playful'],
  ['yxw-visual-production','YXW 视觉生产总控','skill','统筹人物、场景、静帧和视频提示词，建立整剧视觉资产与审核闭环。',['整剧资产规划','静帧提示词','跨镜头一致性'],'2026.08','2026-08-26',['视觉生产','整剧','审核'],0,'视觉总监','precise'],
  ['blender-whitebox-motion-studio','Blender 白膜运镜工作室','skill','在 Blender 后台搭建可编辑白膜场景、人物站位、摄影机轨迹与预览。',['文生白膜','空间复刻','摄影机绑定'],'1.1','2026-08-12',['Blender','白膜','运镜'],1,'空间工程师','precise'],
  ['storyboarder-whitebox-scene','Storyboarder 白膜场景','skill','把空间轮廓、人物站位和分镜机位转成可编辑的 3D 白膜项目。',['空间搭建','人物走位','五视角复刻'],'2026.08','2026-08-12',['Storyboarder','白膜','场景'],2,'场景设计师','calm'],
  ['asset-folder-sync','YXW 资产文件夹同步','skill','监控本地图片文件夹，自动上传团队资产网站并归档成功文件。',['文件夹监听','自动上传','失败重试'],'2026.08','2026-08-26',['资产','同步','自动化'],1,'资产管家','calm'],
  ['find-duplicate-files','重复文件审计','skill','按内容指纹查找重复文件，生成报告和待审核清理计划。',['SHA-256 校验','重复组报告','安全隔离'],'2026.08','2026-08-12',['文件','审计','自动化'],2,'文件审计员','precise'],
  ['yxw-video-prompt-director-conversation','视频提示词对话导演','skill','把多轮对话中的剧本事实、镜头连续性和修改意见收束成可执行提示词。',['多轮修改','事实锁定','连续性检查'],'2026.08','2026-08-26',['视频','对话','审核'],3,'对话导演','calm'],
  ['cinepalette','CinePalette 电影色彩图库','site','按色调检索电影截图，提取参考图色板，并整理到收藏和项目板。',['色相检索','参考图识色','项目板整理'],'1.0.0','2026-08-25',['网站','电影','色彩'],2,'电影调色师','precise','https://ljdubxud123103.github.io/'],
  ['asset-review-studio','资产审核工作室','site','用于本地资产审核、批注与交付记录的网页工作室。',['资产审核','批注记录','交付核对'],'0.0.0','2026-08-13',['网站','审核','资产'],3,'审核员','precise'],
  ['face-outfit-studio','脸与服装工作室','site','角色脸型、妆发与服装搭配的可视化工作台。',['脸型对比','服装搭配','角色资产确认'],'0.1.0','2026-08-13',['网站','角色','服装'],0,'造型顾问','playful'],
  ['storyboarder-whitebox-studio','Storyboarder 白膜工作室','site','用于场景白膜搭建、人物摆位和机位预演的网页工作室。',['白膜预演','人物走位','机位管理'],'1.0.0','2026-08-12',['网站','Storyboarder','预演'],1,'预演导演','bold'],
  ['video-review-studio','视频审片工作室','site','批量上传视频、收集审片意见并管理已上传与待上传文件。',['视频上传','审片意见','失败重试'],'0.1.0','2026-08-13',['网站','视频','审片'],3,'审片制片','calm'],
] as const;

export const ENTRIES: Entry[] = raw.map(([slug,name,kind,summary,scenarios,version,updated,tags,avatar,avatarLabel,personality,externalUrl]) => ({
  slug, name, kind: kind as EntryKind, summary, scenarios: [...scenarios], version, updated, tags: [...tags], avatar: LOCAL_AVATARS[slug] ?? FIGURINES[avatar], avatarLabel, personality: personality as Personality, contentPath: `content/${kind === 'skill' ? 'skills' : 'sites'}/${slug}.md`, ...(externalUrl ? { externalUrl } : {}),
}));

// The first four colors and transparent renders follow the supplied TOONHUB
// prompt. Every remaining slide uses one of the owner's own extracted figures.
const HERO_PALETTE = [
  '#F4845F', '#6BBF7A', '#E882B4', '#6EB5FF', '#C6A45B', '#6E9C9C',
  '#B47D66', '#7B8DB8', '#C56F85', '#79926F', '#9A7A58', '#6E8798',
  '#AD7698', '#8F8A5E', '#5F8494',
];

export const HERO_IMAGES = ENTRIES.map((entry, index) => ({
  // Cutouts keep the user's characters dimensional on the stage, without a
  // rectangular portrait background.
  src: entry.avatar.replace('-3d.png', '-cutout.png'),
  bg: HERO_PALETTE[index % HERO_PALETTE.length],
  panel: HERO_PALETTE[index % HERO_PALETTE.length],
}));
