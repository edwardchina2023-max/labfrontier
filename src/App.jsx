import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  EnvelopeSimple,
  List,
  MagnifyingGlass,
  PlayCircle,
  Quotes,
  X,
} from "@phosphor-icons/react";
import {
  archiveImages,
  brandFilmBeats,
  contentWorlds,
  featuredStories,
  labStories,
} from "./content";

const navItems = [
  ["最新选题", "latest"],
  ["内容宇宙", "worlds"],
  ["实验室故事", "stories"],
  ["品牌影像", "film"],
  ["关于我们", "about"],
];

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

function BrandLogo({ dark = false }) {
  return (
    <img
      className="brand-logo"
      src={asset(dark ? "brand/logo-lockup.png" : "brand/logo-lockup-white.png")}
      alt="实验室前线 LAB FRONTIER"
    />
  );
}

function Header({ onSearch, onSubscribe }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
      <button className="logo-button" onClick={() => go("top")} aria-label="返回首页"><BrandLogo /></button>
      <nav className="desktop-nav" aria-label="主导航">
        {navItems.map(([label, id]) => <button key={id} onClick={() => go(id)}>{label}</button>)}
      </nav>
      <div className="header-actions">
        <button className="icon-button" onClick={onSearch} aria-label="搜索"><MagnifyingGlass size={22} /></button>
        <button className="subscribe-button" onClick={onSubscribe}>订阅前沿</button>
        <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="打开菜单"><List size={27} /></button>
      </div>
      <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`} aria-hidden={!menuOpen}>
        <div className="mobile-menu-top"><BrandLogo /><button className="icon-button" onClick={() => setMenuOpen(false)} aria-label="关闭菜单"><X size={27} /></button></div>
        <nav aria-label="移动端导航">
          {navItems.map(([label, id], index) => <button key={id} onClick={() => go(id)}><span>0{index + 1}</span>{label}<ArrowRight size={24} /></button>)}
        </nav>
        <button className="mobile-menu-subscribe" onClick={() => { setMenuOpen(false); onSubscribe(); }}>订阅每周前沿 <ArrowUpRight size={22} /></button>
      </div>
    </header>
  );
}

function Modal({ open, onClose, children, label, wide = false }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className={`modal ${wide ? "modal-wide" : ""}`} role="dialog" aria-modal="true" aria-label={label} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭"><X size={26} /></button>
        {children}
      </section>
    </div>
  );
}

function StoryArticle({ story, onClose }) {
  return (
    <article className="story-modal">
      <p className="modal-kicker">{story.issue} / {story.category}</p>
      <h2>{story.title}</h2>
      <p className="story-deck">{story.deck}</p>
      <div className="story-tags">{story.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <div className="story-body">{story.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      <blockquote>一个实验室细节 → 一个新技术 → 三个独立信号 → 一个产业结构变化 → 一个关于人的问题。</blockquote>
      <button className="primary-button" onClick={onClose}>继续探索 <ArrowRight size={21} /></button>
    </article>
  );
}

export function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedLabStory, setSelectedLabStory] = useState(null);
  const [selectedPoster, setSelectedPoster] = useState(null);
  const [filmOpen, setFilmOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [showAllStories, setShowAllStories] = useState(false);
  const [showAllArchive, setShowAllArchive] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const key = query.trim().toLowerCase();
    const features = featuredStories.map((story) => ({ type: "feature", story, searchable: [story.title, story.deck, ...story.tags].join(" ") }));
    const history = labStories.map((story) => ({ type: "history", story, searchable: [story.title, story.hook, story.year].join(" ") }));
    return [...features, ...history].filter((item) => item.searchable.toLowerCase().includes(key)).slice(0, 8);
  }, [query]);

  const openSearchResult = (item) => {
    setSearchOpen(false);
    setQuery("");
    if (item.type === "feature") setSelectedStory(item.story);
    else setSelectedLabStory(item.story);
  };

  const subscribe = (event) => {
    event.preventDefault();
    setSubscribed(true);
  };

  const visibleLabStories = showAllStories ? labStories : labStories.slice(0, 8);
  const visibleArchive = showAllArchive ? archiveImages : archiveImages.slice(0, 12);

  return (
    <main id="top">
      <Header onSearch={() => setSearchOpen(true)} onSubscribe={() => setSubscribeOpen(true)} />

      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-image" src={asset("images/hero-lab.jpg")} alt="实验人员站在深科技实验装置前" />
        <div className="hero-shade" />
        <div className="hero-copy hero-copy-brand">
          <p className="eyebrow">LAB FRONTIER · BRAND MANIFESTO</p>
          <h1 id="hero-title">你每天看到的<br />科技新闻，<br />已经太晚了。</h1>
          <p className="hero-deck">当一项技术成为新闻，真正的故事可能已经在实验室里发生了十年。</p>
          <button className="primary-button" onClick={() => document.getElementById("latest")?.scrollIntoView({ behavior: "smooth" })}>去未来开始的地方 <ArrowUpRight size={22} /></button>
        </div>
        <button className="scroll-cue" onClick={() => document.getElementById("latest")?.scrollIntoView({ behavior: "smooth" })}>SCROLL TO THE SOURCE <ArrowDown size={17} /></button>
        <div id="latest" className="feature-strip">
          <div className="issue-index"><span>旗舰深稿</span><strong>No.001</strong></div>
          <button className="feature-main" onClick={() => setSelectedStory(featuredStories[0])}>
            <span><strong>{featuredStories[0].title}</strong><small>{featuredStories[0].deck}</small><span className="feature-tags">可编程实验室　MHS　AI FOR SCIENCE</span><span className="feature-read">阅读深稿</span></span><ArrowRight size={30} />
          </button>
          <div className="feature-side">
            {featuredStories.slice(1).map((story) => <button key={story.issue} onClick={() => setSelectedStory(story)}><em>{story.issue}</em><span>{story.title}</span><ArrowRight size={22} /></button>)}
          </div>
        </div>
      </section>

      <section id="worlds" className="worlds-section section-pad">
        <header className="section-heading">
          <div><p className="eyebrow dark">THE CONTENT UNIVERSE / 内容宇宙</p><h2>从实验室出发，<br />一直追到真实世界。</h2></div>
          <p>实验室前线不是普通科技资讯站。我们沿着“实验室 → 科学家 → 技术 → 产品 → 公司 → 产业 → 人”追踪未来如何发生。</p>
        </header>
        <div className="world-grid">
          {contentWorlds.map((world) => <article key={world.number}><div className="world-top"><span>{world.number}</span><em>{world.english}</em></div><h3>{world.title}</h3><strong>{world.question}</strong><p>{world.text}</p></article>)}
        </div>
      </section>

      <section className="founder-section">
        <div className="founder-image-wrap"><img src={asset("images/scientist-lab.jpg")} alt="真实实验室中的研究现场" /><span>REAL PEOPLE · REAL LABS · REAL FUTURE</span></div>
        <div className="founder-copy">
          <p className="eyebrow">黄师傅 / EDWARD HUANG</p>
          <h2>去源头。<br />见真人。<br />把未来讲明白。</h2>
          <p>黄师傅不是传统科技博主。他长期处在科学、人文与商业的交界处，进入实验室采访科学家，也继续追问技术为什么出现、如何进入产业，以及它最终会把人带向哪里。</p>
          <div className="founder-pillars"><span>人文世界</span><span>企业与商业</span><span>科学现场</span></div>
          <p className="founder-signoff">在现场，理解世界。<br /><small>I go where ideas meet reality.</small></p>
        </div>
      </section>

      <section className="method-section section-pad">
        <div className="method-intro"><p className="eyebrow">OUR METHOD / 内容方法</p><h2>新闻只是入口。<br />实验室才是源头。</h2><p>我们不从“今天有什么热点”出发，而是把每一条科技新闻反向追溯到最早的论文、科学家与实验室。</p></div>
        <div className="trace-path" aria-label="实验室前线反向溯源路径">
          {["NEWS", "COMPANY", "TECHNOLOGY", "PAPER", "SCIENTIST", "LAB"].map((step, index, items) => <div className="trace-step" key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < items.length - 1 && <ArrowRight size={18} />}</div>)}
        </div>
        <div className="method-rules">
          <div><strong>S</strong><span>论文、实验室、高校、专利与监管文件</span><small>确认事实</small></div>
          <div><strong>A</strong><span>科学家本人、公司研究团队、学术组织</span><small>找到人</small></div>
          <div><strong>B</strong><span>Reuters、FT、Nature News 等权威媒体</span><small>理解新闻</small></div>
          <div><strong>C</strong><span>社交媒体、中文科技媒体与公开讨论</span><small>发现线索</small></div>
        </div>
        <div className="editorial-os">
          <div><Clock size={25} /><span>06:00</span><strong>全球巡视</strong></div><div><Clock size={25} /><span>08:00</span><strong>确认选题</strong></div><div><Clock size={25} /><span>12:00</span><strong>确认核心</strong></div><div><Clock size={25} /><span>18:00</span><strong>终审成品</strong></div>
        </div>
        <p className="editorial-chain">SCAN → FILTER → TRACE → VERIFY → CLUSTER → SCORE → PITCH</p>
      </section>

      <section id="stories" className="story-archive section-pad">
        <header className="section-heading story-heading">
          <div><p className="eyebrow dark">SEASON ONE / 第一季</p><h2>20个实验室故事，<br />重新讲述现代文明。</h2></div>
          <p>从伦琴追下的异常、图灵与香农的午间谈话，到 Bell Labs、青霉素与《科学：无尽的前沿》。每个故事都从一间房间开始。</p>
        </header>
        <div className="lab-story-grid">
          {visibleLabStories.map((story) => <button key={story.number} onClick={() => setSelectedLabStory(story)}><div><span>{story.number}</span><em>{story.year}</em></div><h3>{story.title}</h3><p>{story.hook}</p><span className="card-action">打开口播脚本 <ArrowRight size={18} /></span></button>)}
        </div>
        <button className="archive-toggle" onClick={() => setShowAllStories((value) => !value)}>{showAllStories ? "收起故事档案" : "查看全部 20 个故事"} <ArrowDown className={showAllStories ? "is-rotated" : ""} size={19} /></button>
      </section>

      <section id="film" className="brand-film">
        <img src={asset("images/mission-lab.jpg")} alt="实验室前线品牌影片中的任务现场" /><div className="brand-film-shade" />
        <div className="brand-film-copy"><p className="eyebrow">BRAND FILM 01 · 75 SEC</p><h2>《未来还没有名字的时候》</h2><p>世界真正改变之前，往往没有发布会，没有热搜，甚至没有人相信。它可能只是一段解释不了的数据、一次失败的实验、一个没人愿意相信的想法。</p><button className="primary-button" onClick={() => setFilmOpen(true)}><PlayCircle size={25} />打开品牌片分镜</button></div>
        <blockquote><Quotes size={28} />多数人因为看见，所以相信。<br />少数人因为相信，所以看见。</blockquote>
      </section>

      <section className="visual-archive section-pad">
        <header className="archive-heading"><div><p className="eyebrow">VISUAL ARCHIVE / 品牌视觉档案</p><h2>36张科学家与科技里程碑概念原画</h2></div><p>这些原画来自此前品牌视觉探索，用于建立真实实验室、历史档案与纪录摄影的方向。正式商业发布时，将逐张替换为确认授权、公版或自行拍摄的原始影像。</p></header>
        <div className="poster-grid">
          {visibleArchive.map((poster) => <button key={poster.id} onClick={() => setSelectedPoster(poster)} aria-label={`查看概念原画 ${String(poster.id).padStart(2, "0")}`}><img loading="lazy" src={asset(poster.src)} alt={poster.alt} /><span>ARCHIVE {String(poster.id).padStart(2, "0")}</span></button>)}
        </div>
        <button className="archive-toggle light-toggle" onClick={() => setShowAllArchive((value) => !value)}>{showAllArchive ? "收起视觉档案" : "查看全部 36 张原画"} <ArrowDown className={showAllArchive ? "is-rotated" : ""} size={19} /></button>
      </section>

      <section id="about" className="manifesto section-pad">
        <div><p className="eyebrow dark">WHY LAB FRONTIER</p><h2>前沿科技发现与<br />价值转化媒体。</h2></div>
        <div className="manifesto-side"><p>我们的长期目标，是成为中国最具现场感、国际视野和产业洞察力的前沿科技内容品牌之一，并建立连接实验室、科学家、企业家、产业与资本的长期知识网络。</p><p>黄师傅 / Edward Huang 是终身人格品牌；实验室前线 / LAB FRONTIER 是可以团队化、公司化和长期积累的媒体品牌。</p><div className="venture-path"><span>MEDIA</span><ArrowRight size={17} /><span>NETWORK</span><ArrowRight size={17} /><span>DEAL FLOW</span><ArrowRight size={17} /><span>VENTURE</span></div><button className="text-link dark-link" onClick={() => setSubscribeOpen(true)}>订阅我们的每周前沿 <ArrowRight size={21} /></button></div>
      </section>

      <footer>
        <div className="footer-brand"><BrandLogo /><p>梦开始的地方<br /><span>WHERE THE FUTURE BEGINS.</span></p></div>
        <div className="footer-links"><div><strong>内容</strong><a href="#latest">最新选题</a><a href="#worlds">内容宇宙</a><a href="#stories">实验室故事</a><a href="#film">品牌影像</a></div><div><strong>联系</strong><button onClick={() => setSubscribeOpen(true)}>订阅前沿</button><a href="mailto:hello@labfrontier.cn">内容合作</a><a href="#about">关于我们</a></div></div>
        <div className="footer-bottom"><span>© 2026 LAB FRONTIER</span><span>去源头 · 见真人 · 把未来讲明白</span></div>
      </footer>

      <Modal open={searchOpen} onClose={() => { setSearchOpen(false); setQuery(""); }} label="搜索实验室前线">
        <p className="modal-kicker">SEARCH / 搜索</p><h2>回到故事的源头</h2><div className="search-field"><MagnifyingGlass size={24} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入关键词，例如：图灵、青霉素、AI 实验室" /></div><div className="search-results">{query && !searchResults.length && <p>没有找到匹配内容，换一个关键词试试。</p>}{searchResults.map((item) => <button key={`${item.type}-${item.story.number || item.story.issue}`} onClick={() => openSearchResult(item)}><span>{item.story.number || item.story.issue}</span>{item.story.title}<ArrowRight size={20} /></button>)}</div>
      </Modal>

      <Modal open={subscribeOpen} onClose={() => { setSubscribeOpen(false); setSubscribed(false); }} label="订阅实验室前线">
        {subscribed ? <div className="success-state"><Check size={42} /><h2>欢迎来到前线。</h2><p>订阅信息已经记录。每周，我们会把最值得关注的实验室故事送到你面前。</p><button className="primary-button" onClick={() => setSubscribeOpen(false)}>完成</button></div> : <><p className="modal-kicker">WEEKLY FRONTIER / 实验室内参</p><h2>新闻只是入口，实验室才是源头。</h2><p className="modal-intro">每周一封信：新论文、新实验室、新科学家、新公司，以及我们对产业化路径的判断。</p><form className="subscribe-form" onSubmit={subscribe}><label>邮箱地址<input type="email" required placeholder="name@example.com" /></label><button className="primary-button" type="submit"><EnvelopeSimple size={21} />确认订阅</button></form></>}
      </Modal>

      <Modal open={Boolean(selectedStory)} onClose={() => setSelectedStory(null)} label={selectedStory?.title || "文章预览"} wide>{selectedStory && <StoryArticle story={selectedStory} onClose={() => setSelectedStory(null)} />}</Modal>

      <Modal open={Boolean(selectedLabStory)} onClose={() => setSelectedLabStory(null)} label={selectedLabStory?.title || "实验室故事"}>
        {selectedLabStory && <article className="lab-story-modal"><p className="modal-kicker">STORY {selectedLabStory.number} / {selectedLabStory.year}</p><h2>{selectedLabStory.title}</h2><p className="story-deck">{selectedLabStory.hook}</p><p>{selectedLabStory.body}</p><div className="script-note"><strong>口播结构</strong><span>一个异常或人物动作 → 历史现场 → 科学意义 → 回到人的选择</span></div><button className="primary-button" onClick={() => setSelectedLabStory(null)}>返回故事档案 <ArrowRight size={21} /></button></article>}
      </Modal>

      <Modal open={filmOpen} onClose={() => setFilmOpen(false)} label="品牌片分镜" wide>
        <article className="film-modal"><p className="modal-kicker">BRAND FILM 01 / 未来还没有名字的时候</p><h2>75秒品牌母片</h2><p className="story-deck">前半段克制、冷、暗；后半段逐渐出现真实颜色与人的脸。机器越来越多，最后重新找到人。</p><div className="film-beats">{brandFilmBeats.map((beat) => <div key={beat.time}><span>{beat.time}</span><h3>{beat.title}</h3><p>{beat.visual}</p></div>)}</div><blockquote>未来，从来不是从发布会开始的。我们想去得更早一点，去那些未来还没有名字的地方。</blockquote><button className="primary-button" onClick={() => setFilmOpen(false)}>关闭分镜</button></article>
      </Modal>

      <Modal open={Boolean(selectedPoster)} onClose={() => setSelectedPoster(null)} label="概念原画" wide>
        {selectedPoster && <div className="poster-modal"><img src={asset(selectedPoster.src)} alt={selectedPoster.alt} /><div><p className="modal-kicker">VISUAL ARCHIVE {String(selectedPoster.id).padStart(2, "0")}</p><h2>科学家与科技里程碑概念原画</h2><p>视觉方向：真实人物、真实实验室、历史档案与克制的编辑设计。本图为品牌视觉研究稿。</p></div></div>}
      </Modal>
    </main>
  );
}
