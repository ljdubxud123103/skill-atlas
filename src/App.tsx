import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ExternalLink, Search, Sparkles } from 'lucide-react';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { ENTRIES, HERO_IMAGES, type Entry } from './skills/data';

const modulo = (value: number, length: number) => (value + length) % length;
const BASE_URL = './';

const reactions: Record<Entry['personality'], string[]> = {
  bold: ['镜头就位，准备开拍。', '别眨眼，下一帧更精彩。'],
  calm: ['我已经把流程理顺了。', '慢一点，细节会自己出现。'],
  playful: ['被你发现啦。', '今天要不要试一个新状态？'],
  warm: ['来，跟我一起把故事讲出来。', '收到你的眼神了。'],
  precise: ['参数锁定，开始工作。', '每一格都值得核对。'],
};

type SlideRole = 'center' | 'left' | 'right' | 'back';

function Avatar({ item, className = '' }: { item: Entry; className?: string }) {
  return (
    <span className={`avatar avatar--${item.personality} ${className}`}>
      <img src={`${BASE_URL}${item.avatar}`} alt="" draggable={false} />
    </span>
  );
}

function Hero({ open }: { open: (entry: Entry) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [reaction, setReaction] = useState('点击角色，让她回应你。双击进入完整档案。');
  const timerRef = useRef<number | null>(null);
  const active = ENTRIES[activeIndex];

  const release = useCallback(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setAnimating(false), 680);
  }, []);

  const goTo = useCallback((index: number) => {
    if (index === activeIndex || animating) return;
    setAnimating(true);
    setActiveIndex(modulo(index, HERO_IMAGES.length));
    release();
  }, [activeIndex, animating, release]);

  const navigate = useCallback((direction: 'next' | 'prev') => {
    if (animating) return;
    goTo(activeIndex + (direction === 'next' ? 1 : -1));
  }, [activeIndex, animating, goTo]);

  useEffect(() => {
    HERO_IMAGES.forEach(({ src }) => { const image = new Image(); image.src = src; });
    const resize = () => setMobile(window.innerWidth < 640);
    resize();
    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      if (!animating) navigate('next');
    }, 6200);
    return () => window.clearInterval(interval);
  }, [animating, navigate]);

  const roleFor = (index: number): SlideRole | 'off' => {
    const distance = modulo(index - activeIndex, HERO_IMAGES.length);
    if (distance === 0) return 'center';
    if (distance === 1) return 'right';
    if (distance === HERO_IMAGES.length - 1) return 'left';
    if (distance === 2) return 'back';
    return 'off';
  };

  const respond = () => {
    const lines = reactions[active.personality];
    setReaction(lines[Math.floor(Math.random() * lines.length)]);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    event.currentTarget.style.setProperty('--mx', `${x.toFixed(3)}`);
    event.currentTarget.style.setProperty('--my', `${y.toFixed(3)}`);
  };

  return (
    <section className="hero" style={{ backgroundColor: HERO_IMAGES[activeIndex].bg }}>
      <div className="hero__stage" onPointerMove={onPointerMove} onPointerLeave={(event) => { event.currentTarget.style.setProperty('--mx', '0'); event.currentTarget.style.setProperty('--my', '0'); }}>
        <div className="hero__wash" />
        <div className="hero__grid" />
        <div className="hero__grain" />
        <div className="hero__ghost" aria-hidden="true">3D SHAPE</div>
        <div className="hero__brand">TOONHUB <span>/</span> SKILL ATLAS</div>

        <div className="hero__intro">
          <span className="eyebrow">PERSONA LIBRARY <b>·</b> {ENTRIES.length} CHARACTERS</span>
          <h1>每个 skill，<br /><em>都有自己的性格。</em></h1>
          <p>一个会呼吸的工作流档案馆。点击让角色回应，双击进入完整内容。</p>
        </div>

        <div className={`hero__carousel ${animating ? 'is-animating' : ''}`}>
          {HERO_IMAGES.map((image, index) => {
            const entry = ENTRIES[index];
            const role = roleFor(index);
            return (
              <button
                type="button"
                key={image.src}
                className={`figurine figurine--${role}`}
                onClick={() => role === 'center' ? respond() : goTo(index)}
                onDoubleClick={() => open(entry)}
                aria-label={`${entry.name}，点击切换或互动，双击查看详情`}
              >
                <span className="figurine__halo" />
                <img src={image.src} alt={`${entry.name} 3D 角色`} draggable={false} />
              </button>
            );
          })}
        </div>

        <div className="hero__speech" aria-live="polite"><Sparkles size={15} /> {reaction}</div>

        <div className="hero__meta">
          <div className="hero__meta-copy" key={active.slug}>
            <p className="hero__title">{active.name}</p>
            <p className="hero__caption">{active.summary}</p>
          </div>
          <div className="hero__controls">
            <button type="button" onClick={() => navigate('prev')} aria-label="上一个角色"><ArrowLeft size={22} /></button>
            <button type="button" onClick={() => navigate('next')} aria-label="下一个角色"><ArrowRight size={22} /></button>
          </div>
        </div>

        <div className="hero__roster" aria-label="首屏角色快速选择">
          {ENTRIES.map((entry, index) => (
            <button type="button" key={entry.slug} className={index === activeIndex ? 'active' : ''} onClick={() => goTo(index)} aria-label={`切换到 ${entry.name}`}>
              <span className="hero__roster-number">{String(index + 1).padStart(2, '0')}</span>
              <img src={`${BASE_URL}${entry.avatar}`} alt="" />
              <span>{entry.name}</span>
            </button>
          ))}
        </div>

        <button type="button" className="hero__discover" onClick={() => open(active)}>DISCOVER IT <ArrowRight size={22} /></button>
        <div className="hero__hint">{mobile ? '点击互动 · 双击打开' : 'CLICK TO INTERACT · DOUBLE-CLICK TO OPEN'}</div>
        <div className="hero__progress" aria-hidden="true"><span style={{ width: `${((activeIndex + 1) / HERO_IMAGES.length) * 100}%` }} /></div>
      </div>
    </section>
  );
}

function EntryRow({ entry, open }: { entry: Entry; open: (entry: Entry) => void }) {
  return (
    <button type="button" className="entry-row" onClick={() => open(entry)}>
      <span className="entry-row__index">{entry.kind === 'skill' ? 'SK' : 'ST'}</span>
      <Avatar item={entry} className="entry-row__avatar" />
      <span className="entry-row__body">
        <span className="entry-row__top"><span>{entry.kind === 'skill' ? 'SKILL' : 'SITE'}</span><span>v{entry.version}</span></span>
        <strong>{entry.name}</strong>
        <span>{entry.summary}</span>
      </span>
      <span className="entry-row__tags">{entry.tags.slice(0, 2).map((tag) => <i key={tag}>{tag}</i>)}</span>
      <ArrowRight size={20} className="entry-row__arrow" />
    </button>
  );
}

function Library() {
  const routerNavigate = useNavigate();
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState<'all' | 'skill' | 'site'>('all');
  const filtered = useMemo(() => ENTRIES.filter((entry) => (kind === 'all' || entry.kind === kind) && `${entry.name} ${entry.summary} ${entry.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [kind, query]);
  const open = (entry: Entry) => routerNavigate(`/skills/${entry.slug}`);
  return (
    <main>
      <Hero open={open} />
      <section className="library">
        <header className="library__header">
          <div><span className="eyebrow">THE ATLAS</span><h2>技能与网站<br /><em>角色库。</em></h2><p>公开展示当前有效的工作流。完整内容保留在每个角色的档案里。</p></div>
          <span className="library__count">{String(filtered.length).padStart(2, '0')} ENTRIES</span>
        </header>
        <div className="toolbar"><label><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索 skill、网站或标签" /></label><div className="filters">{(['all', 'skill', 'site'] as const).map((value) => <button type="button" key={value} className={kind === value ? 'active' : ''} onClick={() => setKind(value)}>{value === 'all' ? '全部' : value === 'skill' ? 'Skills' : 'Sites'}</button>)}</div></div>
        <div className="entry-list">{filtered.map((entry) => <EntryRow key={entry.slug} entry={entry} open={open} />)}</div>
      </section>
    </main>
  );
}

function Detail() {
  const { slug } = useParams();
  const routerNavigate = useNavigate();
  const entry = ENTRIES.find((item) => item.slug === slug);
  const [content, setContent] = useState('正在读取完整内容…');
  useEffect(() => {
    if (!entry) return;
    fetch(`${BASE_URL}${entry.contentPath}`).then((response) => response.ok ? response.text() : Promise.reject()).then(setContent).catch(() => setContent('暂未找到公开内容文件。'));
  }, [entry]);
  if (!entry) return <main className="empty"><h1>找不到这个角色</h1><button type="button" onClick={() => routerNavigate('/')}>返回角色库</button></main>;
  return <main className="detail"><header className="detail__nav"><button type="button" onClick={() => routerNavigate('/')}><ArrowLeft size={18} /> 返回角色库</button><span>{entry.kind === 'skill' ? 'SKILL PROFILE' : 'SITE PROFILE'}</span></header><section className="detail__hero"><Avatar item={entry} className="detail__avatar" /><div><span className="eyebrow">{entry.avatarLabel}</span><h1>{entry.name}</h1><p>{entry.summary}</p><div className="chips">{entry.scenarios.map((scenario) => <span key={scenario}>{scenario}</span>)}</div></div>{entry.externalUrl && <a href={entry.externalUrl} target="_blank" rel="noreferrer" className="external">打开网站 <ExternalLink size={16} /></a>}</section><section className="detail__content"><div className="detail__content-head"><div><span className="eyebrow">FULL CONTENT</span><h2>完整 Markdown</h2></div><span>VERSION {entry.version} · UPDATED {entry.updated}</span></div><pre>{content}</pre></section></main>;
}

export default function App() { return <Routes><Route path="/" element={<Library />} /><Route path="/skills/:slug" element={<Detail />} /></Routes>; }
