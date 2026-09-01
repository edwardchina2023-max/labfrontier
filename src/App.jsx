import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Atom,
  Brain,
  Check,
  EnvelopeSimple,
  Flask,
  List,
  MagnifyingGlass,
  RocketLaunch,
  X,
} from "@phosphor-icons/react";

const navItems = [
  ["最新前沿", "latest"],
  ["实验室", "labs"],
  ["科学家", "scientists"],
  ["科技史", "history"],
  ["关于我们", "about"],
];

const stories = [
  {
    issue: "No.026",
    category: "封面故事",
    title: "新型量子材料的临界时刻",
    deck: "当拓扑、强关联与超导相遇，科学家正在改写物质的边界。",
    tags: ["量子材料", "拓扑物态", "超导机理"],
    body: "一项真正改变产业的材料突破，往往从一个反常的实验信号开始。我们回到低温实验室、同步辐射装置与材料生长现场，寻找下一代计算和能源技术的物质基础。",
  },
  {
    issue: "No.025",
    category: "AI for Science",
    title: "AI for Science 的下一站：从预测到发现",
    deck: "模型开始提出假设、调用仪器，并从真实实验中继续学习。",
    tags: ["AI Scientist", "自动实验", "科研基础设施"],
    body: "当模型、机器人与实验数据进入同一个闭环，实验室本身正在变成一种可编程系统。新的竞争不只发生在算法层，也发生在仪器接口、数据标准和实验吞吐量上。",
  },
  {
    issue: "No.024",
    category: "脑科学",
    title: "脑机接口的范式转移：从植入到共生",
    deck: "更高密度的神经记录，正在打开人类与机器协作的新边界。",
    tags: ["神经工程", "脑机接口", "临床转化"],
    body: "脑机接口正在从单次展示走向长期、稳定和临床可用。真正的挑战已经从能否读取信号，转向如何理解意图、保护组织，并建立人与设备之间可靠的反馈回路。",
  },
];

const frontiers = [
  { number: "01", icon: Flask, title: "可编程实验室", english: "PROGRAMMABLE LAB", text: "AI 设计实验，机器人执行，真实数据回到模型。科学发现开始形成连续闭环。" },
  { number: "02", icon: Brain, title: "可编程生命", english: "PROGRAMMABLE BIOLOGY", text: "从读取基因到设计蛋白、细胞与组织，生命科学正在进入工程化时代。" },
  { number: "03", icon: Atom, title: "可编程物质", english: "PROGRAMMABLE MATTER", text: "材料从发现走向生成：计算、合成、实验和制造在同一系统中快速迭代。" },
  { number: "04", icon: RocketLaunch, title: "可编程现实", english: "PROGRAMMABLE REALITY", text: "机器人、能源、太空与新制造，把机器智能从屏幕带入真实世界。" },
];

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;

function BrandLogo({ dark = false }) {
  return <img className="brand-logo" src={asset(dark ? "brand/logo-lockup.png" : "brand/logo-lockup-white.png")} alt="实验室前线 LAB FRONTIER" />;
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

function Modal({ open, onClose, children, label }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event) => event.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal" role="dialog" aria-modal="true" aria-label={label} onMouseDown={(event) => event.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="关闭"><X size={26} /></button>
        {children}
      </section>
    </div>
  );
}

export function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [subscribeOpen, setSubscribeOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [query, setQuery] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const key = query.trim().toLowerCase();
    return stories.filter((story) => [story.title, story.deck, ...story.tags].join(" ").toLowerCase().includes(key));
  }, [query]);
  const subscribe = (event) => { event.preventDefault(); setSubscribed(true); };

  return (
    <main id="top">
      <Header onSearch={() => setSearchOpen(true)} onSubscribe={() => setSubscribeOpen(true)} />
      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-image" src={asset("images/hero-lab.jpg")} alt="科学家站在深科技实验装置前" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <p className="eyebrow">LAB FRONTIER · ISSUE 026</p>
          <h1 id="hero-title">未来，<br />首先发生在实验室。</h1>
          <p className="hero-deck">追踪科学突破如何从实验室走向产业与文明。</p>
          <button className="primary-button" onClick={() => document.getElementById("latest")?.scrollIntoView({ behavior: "smooth" })}>进入前线 <ArrowUpRight size={22} /></button>
        </div>
        <button className="scroll-cue" onClick={() => document.getElementById("latest")?.scrollIntoView({ behavior: "smooth" })}>SCROLL TO DISCOVER <ArrowDown size={17} /></button>
        <div id="latest" className="feature-strip">
          <div className="issue-index"><span>封面故事</span><strong>No.026</strong></div>
          <button className="feature-main" onClick={() => setSelectedStory(stories[0])}><span><strong>新型量子材料的临界时刻</strong><small>当拓扑、强关联与超导相遇，科学家正在改写物质的边界。</small><span className="feature-tags">量子材料　拓扑物态　超导机理</span><span className="feature-read">阅读文章</span></span><ArrowRight size={30} /></button>
          <div className="feature-side">
            {stories.slice(1).map((story) => <button key={story.issue} onClick={() => setSelectedStory(story)}><em>{story.issue}</em><span>{story.title}</span><ArrowRight size={22} /></button>)}
          </div>
        </div>
      </section>

      <section id="labs" className="frontier-section section-pad">
        <header className="section-heading"><div><p className="eyebrow dark">RESEARCH FRONTIERS / 研究前沿</p><h2>理解下一个时代，<br />从上游开始。</h2></div><p>我们不追逐赛道热词。我们寻找正在实验室里形成、未来可能改变产业结构的底层能力。</p></header>
        <div className="frontier-list">
          {frontiers.map(({ number, icon: Icon, title, english, text }) => <article key={number}><span className="frontier-number">{number}</span><Icon size={38} weight="thin" /><h3>{title}</h3><p className="frontier-english">{english}</p><p>{text}</p></article>)}
        </div>
      </section>

      <section id="scientists" className="scientist-section">
        <div className="scientist-image-wrap"><img src={asset("images/scientist-lab.jpg")} alt="生物学实验室中的科学家" /><span>THE PEOPLE IN THE LAB</span></div>
        <div className="scientist-copy"><p className="eyebrow">实验室里的人 / SCIENTIST PROFILE</p><h2>伟大的发现，<br />首先是人的选择。</h2><p>他们选择一个问题，忍受漫长的不确定性，在失败中重新设计实验。我们记录突破，也记录突破发生以前的那些年。</p><button className="text-link" onClick={() => setSelectedStory({ issue: "PEOPLE 001", category: "实验室里的人", title: "科学如何成为一生的工作", deck: "从问题、方法到组织，理解科学家真正改变世界的方式。", tags: ["科学家", "实验室文化", "长期主义"], body: "实验室前线的人物报道，不从履历和奖项开始，而从一个科学问题如何占据一个人的时间开始。我们关心选择、失败、组织与判断，也关心那些让发现最终走出实验室的合作。" })}>进入人物档案 <ArrowRight size={21} /></button></div>
      </section>

      <section id="history" className="history-section section-pad">
        <div className="history-copy"><p className="eyebrow">THE EXPERIMENTS THAT CHANGED THE WORLD</p><h2>八十年，<br />十二次文明级跨越。</h2><p>从晶体管、信息论和互联网，到基因组、CRISPR 与 AlphaFold。科技史不是发明清单，而是人类不断扩展现实边界的过程。</p><a className="primary-button light" href="#history-timeline">打开科技史时间轴 <ArrowRight size={22} /></a></div>
        <div className="history-image"><img src={asset("images/archive-lab.jpg")} alt="档案感工业实验室现场" /></div>
        <div id="history-timeline" className="timeline">{["1947 晶体管", "1969 阿波罗与互联网", "2003 人类基因组", "2012 CRISPR", "2024 AlphaFold"].map((item) => <span key={item}>{item}</span>)}</div>
      </section>

      <section className="field-note"><img src={asset("images/mission-lab.jpg")} alt="航天任务控制中心" /><div className="field-note-copy"><p className="eyebrow">FIELD NOTE / 现场笔记</p><h2>实验室并不只在一栋楼里。</h2><p>它也在发射场、深海舱、极地站、超级计算中心和创业公司的自动化生产线上。哪里正在检验人类能力的边界，哪里就是前线。</p></div></section>

      <section id="about" className="manifesto section-pad"><div><p className="eyebrow dark">WHY LAB FRONTIER</p><h2>什么样的组织，<br />决定了什么样的问题<br />有机会被解决。</h2></div><div className="manifesto-side"><p>“实验室前线”关注的不只是发现，也关注承载发现的组织：大学实验室、国家实验室、企业研究院、创业公司和新的科研机构。</p><p>我们相信，理解科学如何发生，是理解未来如何到来的第一步。</p><button className="text-link dark-link" onClick={() => setSubscribeOpen(true)}>订阅我们的每周前沿 <ArrowRight size={21} /></button></div></section>

      <footer><div className="footer-brand"><BrandLogo /><p>梦开始的地方<br /><span>WHERE THE FUTURE BEGINS.</span></p></div><div className="footer-links"><div><strong>内容</strong><a href="#latest">最新前沿</a><a href="#labs">实验室</a><a href="#scientists">科学家</a><a href="#history">科技史</a></div><div><strong>联系</strong><button onClick={() => setSubscribeOpen(true)}>订阅前沿</button><a href="mailto:hello@labfrontier.cn">内容合作</a><a href="#about">关于我们</a></div></div><div className="footer-bottom"><span>© 2026 LAB FRONTIER</span><span>科学 · 产业 · 人</span></div></footer>

      <Modal open={searchOpen} onClose={() => { setSearchOpen(false); setQuery(""); }} label="搜索实验室前线"><p className="modal-kicker">SEARCH / 搜索</p><h2>寻找一个科学问题</h2><div className="search-field"><MagnifyingGlass size={24} /><input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="输入关键词，例如：AI、量子材料、脑机接口" /></div><div className="search-results">{query && !searchResults.length && <p>没有找到匹配内容，换一个关键词试试。</p>}{searchResults.map((story) => <button key={story.issue} onClick={() => { setSearchOpen(false); setSelectedStory(story); }}><span>{story.issue}</span>{story.title}<ArrowRight size={20} /></button>)}</div></Modal>

      <Modal open={subscribeOpen} onClose={() => { setSubscribeOpen(false); setSubscribed(false); }} label="订阅实验室前线">{subscribed ? <div className="success-state"><Check size={42} /><h2>欢迎来到前线。</h2><p>订阅信息已经记录。每周，我们会把最值得关注的实验室故事送到你面前。</p><button className="primary-button" onClick={() => setSubscribeOpen(false)}>完成</button></div> : <><p className="modal-kicker">WEEKLY FRONTIER / 每周前沿</p><h2>未来首先发生在哪里？</h2><p className="modal-intro">每周一封信：3 个实验室事件、1 个趋势级选题，以及我们对产业化路径的判断。</p><form className="subscribe-form" onSubmit={subscribe}><label>邮箱地址<input type="email" required placeholder="name@example.com" /></label><button className="primary-button" type="submit"><EnvelopeSimple size={21} />确认订阅</button></form></>}</Modal>

      <Modal open={Boolean(selectedStory)} onClose={() => setSelectedStory(null)} label={selectedStory?.title || "文章预览"}>{selectedStory && <article className="story-modal"><p className="modal-kicker">{selectedStory.issue} / {selectedStory.category}</p><h2>{selectedStory.title}</h2><p className="story-deck">{selectedStory.deck}</p><div className="story-tags">{selectedStory.tags.map((tag) => <span key={tag}>{tag}</span>)}</div><p>{selectedStory.body}</p><button className="primary-button" onClick={() => setSelectedStory(null)}>继续探索 <ArrowRight size={21} /></button></article>}</Modal>
    </main>
  );
}
