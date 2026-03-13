import { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

/* ── Icons ── */
const Arrow = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const I = ({ n, s = 16, c = "currentColor" }) => {
  const paths = {
    clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    chevronL: <polyline points="15 18 9 12 15 6"/>,
    link:     <><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></>,
    twitter:  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>,
    bookmark: <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>,
    check:    <polyline points="20 6 9 17 4 12"/>,
    mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    rss:      <><path d="M4 11a9 9 0 019 9"/><path d="M4 4a16 16 0 0116 16"/><circle cx="5" cy="19" r="1"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[n]}
    </svg>
  );
};

const POST = {
  id: "rlhf-quality-at-scale",
  cat: "Research",
  catColor: "#7c5cfc",
  catBg: "rgba(124,92,252,0.08)",
  catBorder: "rgba(124,92,252,0.2)",
  title: "How We Maintain 94% Acceptance Rates Across 18,000 Trainers",
  subtitle: "Keeping quality consistent at massive scale is the hardest problem in human-data infrastructure. Here's the three-layer system we've built — and what we learned the hard way.",
  author: "Amara Diallo",
  authorRole: "CEO & Co-founder",
  authorInitials: "AD",
  authorColor: "#7c5cfc",
  authorBio: "Amara is the CEO and co-founder of Lixeen. Before Lixeen, she led ML annotation operations at DeepMind across three continents.",
  date: "February 28, 2025",
  readTime: "9 min read",
  tags: ["RLHF", "Quality", "Infrastructure", "Scale"],
  content: [
    { type: "lead", text: "When Lixeen crossed 10,000 active trainers in September 2024, we hit a quality cliff. Our acceptance rate — which had held steady at 96% for months — dropped to 88% in six weeks. It was the most stressful period in our company's history." },
    { type: "p", text: "Here's what we learned, what we built, and why we're sharing it publicly — even though it means describing something competitors could replicate." },
    { type: "h2", text: "Why scale breaks quality" },
    { type: "p", text: "The naive assumption is that quality degrades at scale because you're onboarding lower-quality trainers. That's wrong. In our analysis, the trainers who joined during our growth period were statistically indistinguishable in skill from our earlier cohorts. The problem was structural, not human." },
    { type: "p", text: "At small scale, quality is maintained through personal relationships and tight feedback loops. A QA reviewer knows the trainers they're reviewing. Trainers know who's evaluating their work. That shared context disappears at 10,000 people across 50 countries." },
    { type: "callout", text: "The trainers who joined during our growth period were statistically indistinguishable in skill from our earlier cohorts. The problem was structural, not human." },
    { type: "h2", text: "Layer 1: Rubric clarity scoring" },
    { type: "p", text: "Our first intervention was automated rubric analysis. Before a task batch goes live, our system scores the rubric on seven dimensions: specificity, example density, edge-case coverage, internal consistency, measurability, length appropriateness, and ambiguity score." },
    { type: "p", text: "Rubrics that score below our threshold are flagged for revision before trainers see them. This single change — which we rolled out in November 2024 — accounted for roughly 40% of our acceptance rate recovery. Ambiguous rubrics were, by far, the biggest driver of rejections." },
    { type: "metrics", items: [
      { label: "Acceptance rate recovery from rubric scoring", value: "~40%" },
      { label: "Average rubric revision time", value: "14 min" },
      { label: "Rubrics flagged per 100 submitted", value: "23" },
    ]},
    { type: "h2", text: "Layer 2: Inter-annotator agreement at calibration" },
    { type: "p", text: "The second layer happens before a trainer touches production work. Every new task type requires a calibration phase: we select 20 gold-standard tasks (tasks we've already evaluated internally) and run new trainers through them blind." },
    { type: "p", text: "Trainers who score below 85% agreement with our gold standard on calibration tasks are not assigned to that task type — regardless of their overall level. This felt harsh when we implemented it. It turned out to be essential." },
    { type: "p", text: "The key insight was that skill is not general. A Level 4 trainer who excels at code evaluation might struggle with nuanced safety annotation. The calibration system surfaces this mismatch before it affects production quality." },
    { type: "h2", text: "Layer 3: Continuous sampling with escalation" },
    { type: "p", text: "The third layer is ongoing. Our QA system samples 8% of all submitted tasks for human review by senior reviewers (trainers who've demonstrated >97% acceptance rate over 3+ months). Sampled tasks are reviewed blind — the senior reviewer doesn't know whose work they're evaluating." },
    { type: "p", text: "When a trainer's sampled tasks show a declining quality pattern — even before they'd accumulate enough rejections to trigger a warning — the system flags them for a coaching intervention. We send written feedback and, for Level 3+ trainers, offer a 30-minute video review session with a QA lead." },
    { type: "callout", text: "Coaching interventions sent within 24 hours of quality decline are 3x more effective than interventions sent after a trainer has already received formal rejections." },
    { type: "h2", text: "What we still don't have right" },
    { type: "p", text: "We're honest about the gaps. Our rubric clarity scoring is good on text tasks and poor on multimodal ones — we don't yet have enough training data to score image and audio rubrics reliably. We're working on it." },
    { type: "p", text: "Our calibration system also doesn't yet account for language variation well enough. A Spanish-language task calibrated primarily by Latin American trainers may not surface quality issues for European Spanish submissions. We're building region-specific calibration pools." },
    { type: "p", text: "The overall system works. Our acceptance rate is now at 94% — not back to 96%, but stable and predictable. We know exactly what's causing the remaining 6%, and we're working through it systematically." },
    { type: "h2", text: "Why we're publishing this" },
    { type: "p", text: "We believe in transparency as a competitive advantage, not a liability. Sharing how we work raises the bar for the industry. It also makes it easier to recruit trainers and clients who share our values." },
    { type: "p", text: "If you're building something similar and want to compare notes, reach out. This is a hard problem and we don't think hoarding solutions makes the AI ecosystem better." },
  ],
};

const RELATED = [
  {
    cat: "Research", catColor: "#7c5cfc", catBg: "rgba(124,92,252,0.08)", catBorder: "rgba(124,92,252,0.2)",
    title: "Seven Principles for Writing Rubrics That Actually Work",
    author: "Léa Fontaine", authorInitials: "LF", authorColor: "#3dbb00",
    date: "Jan 30, 2025", readTime: "11 min read",
  },
  {
    cat: "Research", catColor: "#7c5cfc", catBg: "rgba(124,92,252,0.08)", catBorder: "rgba(124,92,252,0.2)",
    title: "Inside Lixeen's Safety Red-Teaming Process",
    author: "Kenji Nakamura", authorInitials: "KN", authorColor: "#7c5cfc",
    date: "Jan 6, 2025", readTime: "13 min read",
  },
  {
    cat: "Trainer Tips", catColor: "#3dbb00", catBg: "rgba(61,187,0,0.08)", catBorder: "rgba(61,187,0,0.18)",
    title: "From Level 1 to Level 4: What Actually Moves the Needle",
    author: "Omar Hassan", authorInitials: "OH", authorColor: "#f0c820",
    date: "Jan 18, 2025", readTime: "7 min read",
  },
];

/* ── FadeIn ── */
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useFadeIn();
  return <div ref={ref} className="fade-in" style={{ transitionDelay: `${delay}ms`, ...style }}>{children}</div>;
}

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

const G = `
@import url('https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#ffffff;--surface:#f7f7f7;--surface2:#efefef;
  --border:#e5e5e5;--border2:#dddddd;
  --text:#0a0a0a;--sub:#555555;--muted:#999999;
  --lime:#3dbb00;--lime-dim:rgba(61,187,0,0.08);--lime-glow:rgba(61,187,0,0.18);
  --purple:#7c5cfc;
  --sans:'Anek Devanagari',system-ui,sans-serif;
  --r-pill:999px;--r-card:16px;--r-sm:8px;
}
html{scroll-behavior:smooth;}
body{font-family:var(--sans);color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}

.fade-in{opacity:0;transform:translateY(20px);transition:opacity 0.55s ease,transform 0.55s ease;}
.fade-in.visible{opacity:1;transform:translateY(0);}
.divider{height:1px;background:var(--border);}
.sec-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--lime);background:var(--lime-dim);border:1px solid var(--lime-glow);border-radius:var(--r-pill);padding:5px 14px;margin-bottom:20px;}
.sec-h2{font-size:clamp(28px,3.5vw,44px);font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1.08;margin-bottom:16px;}

/* ── READING PROGRESS BAR ── */
.progress-bar{position:fixed;top:68px;left:0;right:0;height:2px;background:var(--border);z-index:99;}
.progress-fill{height:100%;background:var(--lime);transition:width 0.1s linear;}

/* ── BACK NAV ── */
.post-back-wrap{border-bottom:1px solid var(--border);background:var(--bg);margin-top:68px;}
.post-back{max-width:1200px;margin:0 auto;padding:14px 40px;}
.post-back-btn{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--sub);cursor:pointer;transition:color 0.15s;}
.post-back-btn:hover{color:var(--text);}

/* ── HERO ── */
.post-hero{max-width:1200px;margin:0 auto;padding:40px 40px 0;}
.post-hero-inner{max-width:780px;}
.post-hero-meta{display:flex;align-items:center;gap:10px;margin-bottom:24px;flex-wrap:wrap;}
.post-cat{display:inline-flex;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:4px 12px;border-radius:var(--r-pill);}
.post-meta-sep{width:3px;height:3px;border-radius:50%;background:var(--border2);}
.post-meta-item{font-size:13px;color:var(--muted);display:flex;align-items:center;gap:5px;}
.post-hero-title{font-size:clamp(32px,4.5vw,56px);font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1.1;margin-bottom:20px;}
.post-hero-subtitle{font-size:18px;color:var(--sub);line-height:1.7;margin-bottom:36px;max-width:640px;}
.post-hero-author{display:flex;align-items:center;gap:14px;padding:20px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:0;}
.post-av{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:800;color:#fff;flex-shrink:0;}
.post-author-name{font-size:15px;font-weight:700;color:var(--text);}
.post-author-role{font-size:13px;color:var(--muted);}
.post-hero-share{display:flex;align-items:center;gap:6px;margin-left:auto;}
.share-btn{width:34px;height:34px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:border-color 0.15s,color 0.15s,background 0.15s;color:var(--sub);}
.share-btn:hover{border-color:var(--border2);background:var(--surface2);color:var(--text);}

/* ── LAYOUT: sidebar + article ── */
.post-layout{max-width:1200px;margin:0 auto;padding:60px 40px 100px;display:grid;grid-template-columns:1fr 280px;gap:60px;align-items:start;}

/* ── ARTICLE BODY ── */
.article-lead{font-size:20px;color:var(--text);line-height:1.75;font-weight:500;margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid var(--border);}
.article-p{font-size:16px;color:var(--sub);line-height:1.85;margin-bottom:24px;}
.article-h2{font-size:clamp(22px,2.5vw,28px);font-weight:800;color:var(--text);letter-spacing:-0.025em;line-height:1.2;margin:48px 0 16px;}
.article-callout{background:linear-gradient(135deg,#f0f9e6,#f5f0ff);border:1px solid rgba(61,187,0,0.2);border-left:3px solid var(--lime);border-radius:0 var(--r-sm) var(--r-sm) 0;padding:20px 24px;margin:32px 0;font-size:17px;font-weight:600;color:var(--text);line-height:1.65;font-style:italic;}
.article-metrics{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:28px;margin:32px 0;display:grid;grid-template-columns:repeat(3,1fr);gap:0;box-shadow:0 2px 12px rgba(0,0,0,0.04);}
.article-metric{padding:0 24px;border-right:1px solid var(--border);text-align:center;}
.article-metric:first-child{padding-left:0;text-align:left;}
.article-metric:last-child{border-right:none;padding-right:0;text-align:right;}
.metric-value{font-size:28px;font-weight:800;color:var(--lime);letter-spacing:-0.03em;margin-bottom:6px;}
.metric-label{font-size:12px;color:var(--muted);line-height:1.5;}

/* ── SIDEBAR ── */
.post-sidebar{position:sticky;top:96px;}
.sidebar-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:24px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
.sidebar-title{font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--muted);margin-bottom:16px;}
.toc-list{display:flex;flex-direction:column;gap:2px;}
.toc-item{font-size:13px;color:var(--sub);padding:6px 10px;border-radius:var(--r-sm);cursor:pointer;transition:background 0.1s,color 0.1s;line-height:1.4;border-left:2px solid transparent;}
.toc-item:hover{background:var(--surface);color:var(--text);}
.toc-item.active{border-left-color:var(--lime);color:var(--lime);background:var(--lime-dim);}
.sidebar-tags{display:flex;flex-wrap:wrap;gap:6px;}
.sidebar-tag{font-size:12px;font-weight:600;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:var(--r-pill);padding:4px 12px;cursor:pointer;transition:color 0.15s,border-color 0.15s;}
.sidebar-tag:hover{color:var(--lime);border-color:var(--lime-glow);}
.sidebar-share-btns{display:flex;flex-direction:column;gap:8px;}
.sidebar-share-btn{display:flex;align-items:center;gap:10px;padding:10px 14px;border-radius:var(--r-sm);border:1px solid var(--border);background:transparent;font-family:var(--sans);font-size:13px;font-weight:600;color:var(--sub);cursor:pointer;transition:border-color 0.15s,color 0.15s,background 0.15s;}
.sidebar-share-btn:hover{background:var(--surface);color:var(--text);border-color:var(--border2);}

/* ── AUTHOR BIO ── */
.author-bio-section{border-top:1px solid var(--border);padding-top:48px;margin-top:48px;}
.author-bio-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:28px;display:flex;gap:20px;align-items:flex-start;box-shadow:0 2px 8px rgba(0,0,0,0.04);}
.author-bio-av{width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:800;color:#fff;flex-shrink:0;}
.author-bio-name{font-size:17px;font-weight:800;color:var(--text);margin-bottom:4px;}
.author-bio-role{font-size:13px;color:var(--lime);font-weight:600;margin-bottom:10px;}
.author-bio-text{font-size:14px;color:var(--sub);line-height:1.65;}

/* ── RELATED POSTS ── */
.related-section{background:var(--surface);border-top:1px solid var(--border);}
.related-inner{max-width:1200px;margin:0 auto;padding:80px 40px;}
.related-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:40px;}
.related-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:24px;cursor:pointer;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;}
.related-card:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.06);}
.related-cat{display:inline-flex;font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;padding:3px 10px;border-radius:var(--r-pill);margin-bottom:14px;}
.related-title{font-size:15px;font-weight:700;color:var(--text);line-height:1.4;margin-bottom:16px;}
.related-footer{display:flex;align-items:center;gap:8px;}
.related-av{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;color:#fff;flex-shrink:0;}
.related-author{font-size:12px;color:var(--muted);}
.related-read{font-size:12px;color:var(--muted);margin-left:auto;}

/* ── NEWSLETTER ── */
.post-newsletter{background:linear-gradient(135deg,#f0f9e6 0%,#f5f0ff 50%,#f0f9e6 100%);border-top:1px solid var(--border);padding:80px 40px;text-align:center;position:relative;overflow:hidden;}
.post-newsletter-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:300px;border-radius:50%;background:radial-gradient(ellipse,rgba(61,187,0,0.12) 0%,transparent 70%);pointer-events:none;}
.post-newsletter h2{font-size:clamp(28px,3.5vw,44px);font-weight:800;color:var(--text);letter-spacing:-0.03em;margin-bottom:12px;position:relative;z-index:1;}
.post-newsletter h2 span{color:var(--lime);}
.post-newsletter p{font-size:16px;color:var(--sub);margin-bottom:32px;position:relative;z-index:1;}
.post-newsletter-form{display:flex;gap:8px;justify-content:center;position:relative;z-index:1;max-width:440px;margin:0 auto;}
.post-nl-input{flex:1;background:#fff;border:1px solid var(--border2);border-radius:var(--r-pill);font-family:var(--sans);font-size:14px;font-weight:500;color:var(--text);padding:12px 20px;outline:none;transition:border-color 0.2s;}
.post-nl-input:focus{border-color:rgba(61,187,0,0.35);}
.post-nl-input::placeholder{color:var(--muted);}
.post-nl-btn{display:inline-flex;align-items:center;gap:0;font-family:var(--sans);font-size:14px;font-weight:700;cursor:pointer;border:none;border-radius:var(--r-pill);background:var(--text);color:#fff;padding:0 6px 0 20px;height:48px;transition:opacity 0.2s;white-space:nowrap;flex-shrink:0;}
.post-nl-btn .arrow-box{width:34px;height:34px;border-radius:50%;background:var(--purple);display:flex;align-items:center;justify-content:center;margin-left:10px;}
.post-nl-btn:hover{opacity:0.85;}

@media(max-width:960px){
  .post-layout{grid-template-columns:1fr;}
  .post-sidebar{display:none;}
  .related-grid{grid-template-columns:1fr 1fr;}
  .article-metrics{grid-template-columns:1fr;}
  .article-metric{border-right:none;border-bottom:1px solid var(--border);padding:16px 0;text-align:left !important;}
  .article-metric:last-child{border-bottom:none;}
}
@media(max-width:640px){
  .post-back{padding:12px 20px;}
  .post-hero{padding:28px 20px 0;}
  .post-layout{padding:40px 20px 80px;}
  .related-grid{grid-template-columns:1fr;}
  .related-inner{padding:60px 20px;}
  .post-newsletter{padding:60px 20px;}
  .post-newsletter-form{flex-direction:column;}
}
`;

const TOC = POST.content.filter(b => b.type === "h2").map(b => b.text);

export default function BlogPost() {
  const progress = useReadingProgress();
  const [copied, setCopied] = useState(false);
  const [activeToc, setActiveToc] = useState(0);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBlock = (block, i) => {
    switch (block.type) {
      case "lead":
        return <div key={i} className="article-lead">{block.text}</div>;
      case "p":
        return <p key={i} className="article-p">{block.text}</p>;
      case "h2":
        return <h2 key={i} className="article-h2">{block.text}</h2>;
      case "callout":
        return <blockquote key={i} className="article-callout">{block.text}</blockquote>;
      case "metrics":
        return (
          <div key={i} className="article-metrics">
            {block.items.map((m, j) => (
              <div key={j} className="article-metric">
                <div className="metric-value">{m.value}</div>
                <div className="metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        );
      default: return null;
    }
  };

  return (
    <>
      <style>{G}</style>
      <Navbar />

      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }}/>
      </div>

      <div className="post-back-wrap">
        <div className="post-back">
          <div className="post-back-btn">
            <I n="chevronL" s={14} c="currentColor"/> Back to Blog
          </div>
        </div>
      </div>

      <div className="post-hero">
        <div className="post-hero-inner">
          <FadeIn>
            <div className="post-hero-meta">
              <span className="post-cat" style={{ background: POST.catBg, border: `1px solid ${POST.catBorder}`, color: POST.catColor }}>{POST.cat}</span>
              <span className="post-meta-sep"/>
              <span className="post-meta-item"><I n="clock" s={12} c="var(--muted)"/> {POST.readTime}</span>
              <span className="post-meta-sep"/>
              <span className="post-meta-item">{POST.date}</span>
            </div>
            <h1 className="post-hero-title">{POST.title}</h1>
            <p className="post-hero-subtitle">{POST.subtitle}</p>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="post-hero-author">
              <div className="post-av" style={{ background: POST.authorColor }}>{POST.authorInitials}</div>
              <div>
                <div className="post-author-name">{POST.author}</div>
                <div className="post-author-role">{POST.authorRole}</div>
              </div>
              <div className="post-hero-share">
                <button className="share-btn" title="Copy link" onClick={handleCopy}>
                  {copied ? <I n="check" s={14} c="var(--lime)"/> : <I n="link" s={14}/>}
                </button>
                <button className="share-btn" title="Share on Twitter"><I n="twitter" s={14}/></button>
                <button className="share-btn" title="Bookmark"><I n="bookmark" s={14}/></button>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="post-layout">
        <div className="article-body">
          <FadeIn>
            {POST.content.map((block, i) => renderBlock(block, i))}
          </FadeIn>
          <div className="author-bio-section">
            <div className="author-bio-card">
              <div className="author-bio-av" style={{ background: POST.authorColor }}>{POST.authorInitials}</div>
              <div>
                <div className="author-bio-name">{POST.author}</div>
                <div className="author-bio-role">{POST.authorRole}</div>
                <div className="author-bio-text">{POST.authorBio}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="post-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">In this article</div>
            <div className="toc-list">
              {TOC.map((item, i) => (
                <div key={i} className={`toc-item${activeToc === i ? " active" : ""}`} onClick={() => setActiveToc(i)}>{item}</div>
              ))}
            </div>
          </div>
          <div className="sidebar-card">
            <div className="sidebar-title">Tags</div>
            <div className="sidebar-tags">
              {POST.tags.map(t => <span key={t} className="sidebar-tag">{t}</span>)}
            </div>
          </div>
          <div className="sidebar-card">
            <div className="sidebar-title">Share this article</div>
            <div className="sidebar-share-btns">
              <button className="sidebar-share-btn" onClick={handleCopy}>
                <I n={copied ? "check" : "link"} s={14} c={copied ? "var(--lime)" : "currentColor"}/>
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button className="sidebar-share-btn"><I n="twitter" s={14}/> Share on Twitter</button>
              <button className="sidebar-share-btn"><I n="mail" s={14}/> Share via email</button>
            </div>
          </div>
        </div>
      </div>

      <div className="related-section">
        <div className="related-inner">
          <FadeIn>
            <div className="sec-eyebrow">Keep Reading</div>
            <h2 className="sec-h2">Related articles</h2>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="related-grid">
              {RELATED.map((p, i) => (
                <div className="related-card" key={i}>
                  <span className="related-cat" style={{ background: p.catBg, border: `1px solid ${p.catBorder}`, color: p.catColor }}>{p.cat}</span>
                  <div className="related-title">{p.title}</div>
                  <div className="related-footer">
                    <div className="related-av" style={{ background: p.authorColor }}>{p.authorInitials}</div>
                    <span className="related-author">{p.author}</span>
                    <span className="related-read">{p.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="post-newsletter">
        <div className="post-newsletter-glow"/>
        <FadeIn>
          <h2>Enjoyed this? <span>Subscribe.</span></h2>
          <p>New articles every two weeks. Research, platform updates, trainer stories.</p>
          {subscribed ? (
            <div style={{ color: "var(--lime)", fontWeight: 700, fontSize: 16, position: "relative", zIndex: 1 }}>
              ✓ You're subscribed. See you in your inbox.
            </div>
          ) : (
            <div className="post-newsletter-form">
              <input className="post-nl-input" type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)}/>
              <button className="post-nl-btn" onClick={() => email && setSubscribed(true)}>
                Subscribe
                <div className="arrow-box"><Arrow size={14} color="#fff"/></div>
              </button>
            </div>
          )}
        </FadeIn>
      </div>

      <Footer />
    </>
  );
}