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
    search:   <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    tag:      <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></>,
    chevronL: <polyline points="15 18 9 12 15 6"/>,
    rss:      <><path d="M4 11a9 9 0 019 9"/><path d="M4 4a16 16 0 0116 16"/><circle cx="5" cy="19" r="1"/></>,
    user:     <><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    mail:     <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[n]}
    </svg>
  );
};

/* ── Data ── */
const CATEGORIES = ["All", "Research", "Product", "Platform", "Trainer Tips", "Community", "Company"];

const POSTS = [
  {
    id: "rlhf-quality-at-scale",
    cat: "Research",
    catColor: "#7c5cfc",
    catBg: "rgba(124,92,252,0.08)",
    catBorder: "rgba(124,92,252,0.2)",
    title: "How We Maintain 94% Acceptance Rates Across 18,000 Trainers",
    excerpt: "Keeping quality consistent at massive scale is the hardest problem in human-data infrastructure. Here's the three-layer system we've built — and what we learned the hard way.",
    author: "Amara Diallo",
    authorRole: "CEO & Co-founder",
    authorInitials: "AD",
    authorColor: "#7c5cfc",
    date: "Feb 28, 2025",
    readTime: "9 min read",
    featured: true,
    tags: ["RLHF", "Quality", "Infrastructure"],
  },
  {
    id: "trainer-earnings-report-2024",
    cat: "Platform",
    catColor: "#3dbb00",
    catBg: "rgba(61,187,0,0.08)",
    catBorder: "rgba(61,187,0,0.18)",
    title: "Trainer Earnings Report: 2024 Annual Data",
    excerpt: "We publish our trainer earnings data publicly every year. In 2024, the average active trainer earned $1,840/month. Here's the full breakdown by task type, level, and country.",
    author: "Sasha Petrov",
    authorRole: "Head of Finance",
    authorInitials: "SP",
    authorColor: "#7c5cfc",
    date: "Feb 14, 2025",
    readTime: "6 min read",
    featured: false,
    tags: ["Earnings", "Transparency", "Annual Report"],
  },
  {
    id: "rubric-design-principles",
    cat: "Research",
    catColor: "#7c5cfc",
    catBg: "rgba(124,92,252,0.08)",
    catBorder: "rgba(124,92,252,0.2)",
    title: "Seven Principles for Writing Rubrics That Actually Work",
    excerpt: "Ambiguous rubrics are the single biggest driver of low acceptance rates. After reviewing 4M+ task submissions, here are the patterns we keep seeing — and how to fix them.",
    author: "Léa Fontaine",
    authorRole: "Head of Product",
    authorInitials: "LF",
    authorColor: "#3dbb00",
    date: "Jan 30, 2025",
    readTime: "11 min read",
    featured: false,
    tags: ["Rubrics", "Quality", "Best Practices"],
  },
  {
    id: "level-4-path",
    cat: "Trainer Tips",
    catColor: "#3dbb00",
    catBg: "rgba(61,187,0,0.08)",
    catBorder: "rgba(61,187,0,0.18)",
    title: "From Level 1 to Level 4: What Actually Moves the Needle",
    excerpt: "We interviewed 40 Level 4 trainers to understand how they got there. The answers weren't what we expected — speed matters less than you think.",
    author: "Omar Hassan",
    authorRole: "Head of Growth",
    authorInitials: "OH",
    authorColor: "#f0c820",
    date: "Jan 18, 2025",
    readTime: "7 min read",
    featured: false,
    tags: ["Level Up", "Career", "Tips"],
  },
  {
    id: "safety-red-teaming-process",
    cat: "Research",
    catColor: "#7c5cfc",
    catBg: "rgba(124,92,252,0.08)",
    catBorder: "rgba(124,92,252,0.2)",
    title: "Inside Lixeen's Safety Red-Teaming Process",
    excerpt: "Red-teaming is not just asking trainers to 'try to break the model'. Here's the structured methodology we use with our safety specialist pool — and why it produces better results than internal testing alone.",
    author: "Kenji Nakamura",
    authorRole: "CTO & Co-founder",
    authorInitials: "KN",
    authorColor: "#7c5cfc",
    date: "Jan 6, 2025",
    readTime: "13 min read",
    featured: false,
    tags: ["Safety", "Red-teaming", "AI"],
  },
  {
    id: "dac7-compliance-guide",
    cat: "Platform",
    catColor: "#3dbb00",
    catBg: "rgba(61,187,0,0.08)",
    catBorder: "rgba(61,187,0,0.18)",
    title: "How Lixeen Handles DAC7 Compliance for EU Trainers",
    excerpt: "The EU's DAC7 directive requires platforms like ours to report trainer income to member-state tax authorities. Here's exactly what we collect, what we report, and what it means for you.",
    author: "Sasha Petrov",
    authorRole: "Head of Finance",
    authorInitials: "SP",
    authorColor: "#7c5cfc",
    date: "Dec 20, 2024",
    readTime: "8 min read",
    featured: false,
    tags: ["Tax", "EU", "Compliance"],
  },
  {
    id: "nairobi-trainer-community",
    cat: "Community",
    catColor: "#c07000",
    catBg: "rgba(220,120,0,0.08)",
    catBorder: "rgba(220,120,0,0.18)",
    title: "Meet the Nairobi Trainer Community Running $3K+/Month",
    excerpt: "In Nairobi, a group of 120+ trainers built an informal study group that has produced 14 Level 4 trainers in 18 months. We sat down with the organizers to understand how.",
    author: "Omar Hassan",
    authorRole: "Head of Growth",
    authorInitials: "OH",
    authorColor: "#f0c820",
    date: "Dec 5, 2024",
    readTime: "5 min read",
    featured: false,
    tags: ["Community", "Africa", "Level 4"],
  },
  {
    id: "multimodal-annotation-launch",
    cat: "Product",
    catColor: "#c03030",
    catBg: "rgba(220,50,50,0.08)",
    catBorder: "rgba(220,50,50,0.18)",
    title: "Launching Multimodal Annotation: Images, Audio, and Video",
    excerpt: "Starting today, Lixeen supports image description, audio transcription, and video annotation tasks. Here's what's available now, what's coming next, and how to qualify.",
    author: "Léa Fontaine",
    authorRole: "Head of Product",
    authorInitials: "LF",
    authorColor: "#3dbb00",
    date: "Nov 18, 2024",
    readTime: "4 min read",
    featured: false,
    tags: ["Product", "Multimodal", "Launch"],
  },
  {
    id: "series-a-announcement",
    cat: "Company",
    catColor: "#0070c0",
    catBg: "rgba(0,120,210,0.08)",
    catBorder: "rgba(0,120,210,0.18)",
    title: "Lixeen Raises $12M Series A to Scale Fair AI Labor Infrastructure",
    excerpt: "Today we're announcing our $12M Series A led by Sequoia Capital. Here's what we're building with it — and why we believe the humans behind AI deserve better.",
    author: "Amara Diallo",
    authorRole: "CEO & Co-founder",
    authorInitials: "AD",
    authorColor: "#7c5cfc",
    date: "Oct 1, 2024",
    readTime: "3 min read",
    featured: false,
    tags: ["Funding", "Company", "News"],
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

/* ── Styles ── */
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
.section{padding:100px 40px;max-width:1200px;margin:0 auto;}
.sec-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--lime);background:var(--lime-dim);border:1px solid var(--lime-glow);border-radius:var(--r-pill);padding:5px 14px;margin-bottom:20px;}
.sec-h2{font-size:clamp(32px,4.5vw,52px);font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1.08;margin-bottom:16px;}
.sec-sub{font-size:16px;color:var(--sub);max-width:500px;line-height:1.65;margin-bottom:48px;}

/* ── HERO ── */
.blog-hero{padding:160px 40px 80px;position:relative;overflow:hidden;background:var(--bg);}
.blog-hero-orb{position:absolute;bottom:-10%;left:50%;transform:translateX(-50%);width:900px;height:500px;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,rgba(61,187,0,0.12) 0%,rgba(124,92,252,0.06) 45%,transparent 75%);filter:blur(2px);pointer-events:none;}
.blog-hero-inner{max-width:1200px;margin:0 auto;position:relative;z-index:1;}
.blog-hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--sub);background:#fff;border:1px solid var(--border);border-radius:var(--r-pill);padding:8px 18px;margin-bottom:28px;box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.blog-hero-dot{width:6px;height:6px;border-radius:50%;background:var(--lime);box-shadow:0 0 6px rgba(61,187,0,0.5);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.8);}}
.blog-hero-h1{font-size:clamp(44px,5.5vw,76px);font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1.05;margin-bottom:18px;max-width:700px;}
.blog-hero-h1 span{color:var(--lime);}
.blog-hero-sub{font-size:17px;color:var(--sub);line-height:1.65;max-width:520px;margin-bottom:40px;}

/* Search + filter row */
.blog-controls{display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.blog-search-wrap{position:relative;flex:1;min-width:240px;max-width:360px;}
.blog-search-icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);pointer-events:none;}
.blog-search-input{width:100%;background:#fff;border:1px solid var(--border2);border-radius:var(--r-pill);font-family:var(--sans);font-size:14px;font-weight:500;color:var(--text);padding:10px 18px 10px 40px;outline:none;transition:border-color 0.2s,box-shadow 0.2s;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
.blog-search-input:focus{border-color:rgba(61,187,0,0.35);box-shadow:0 0 0 3px rgba(61,187,0,0.07);}
.blog-search-input::placeholder{color:var(--muted);}

/* Category pills */
.cat-pills{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.cat-pill{font-size:13px;font-weight:600;color:var(--sub);background:#fff;border:1px solid var(--border);border-radius:var(--r-pill);padding:8px 16px;cursor:pointer;transition:all 0.15s;white-space:nowrap;box-shadow:0 1px 3px rgba(0,0,0,0.04);}
.cat-pill:hover{color:var(--text);border-color:var(--border2);}
.cat-pill.active{background:var(--lime-dim);border-color:var(--lime-glow);color:var(--lime);}

/* ── FEATURED POST ── */
.featured-post{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);overflow:hidden;display:grid;grid-template-columns:1fr 1fr;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;cursor:pointer;margin-bottom:48px;}
.featured-post:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 8px 32px rgba(0,0,0,0.08);}
.featured-visual{background:linear-gradient(135deg,#f0f9e6 0%,#f5f0ff 60%,#f0f9e6 100%);display:flex;align-items:center;justify-content:center;padding:60px 48px;position:relative;overflow:hidden;min-height:360px;}
.featured-visual-orb{position:absolute;bottom:-30%;left:50%;transform:translateX(-50%);width:400px;height:200px;border-radius:50%;background:radial-gradient(ellipse,rgba(61,187,0,0.18) 0%,transparent 70%);pointer-events:none;}
.featured-graphic{position:relative;z-index:1;text-align:center;}
.featured-graphic-num{font-size:80px;font-weight:800;color:var(--text);letter-spacing:-0.04em;line-height:1;opacity:0.9;}
.featured-graphic-label{font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:var(--lime);margin-top:8px;}
.featured-content{padding:48px;}
.featured-meta{display:flex;align-items:center;gap:8px;margin-bottom:20px;flex-wrap:wrap;}
.featured-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;padding:4px 12px;border-radius:var(--r-pill);}
.featured-read{font-size:12px;color:var(--muted);}
.featured-title{font-size:clamp(22px,2.5vw,30px);font-weight:800;color:var(--text);letter-spacing:-0.025em;line-height:1.2;margin-bottom:16px;}
.featured-excerpt{font-size:14px;color:var(--sub);line-height:1.75;margin-bottom:28px;}
.featured-author{display:flex;align-items:center;gap:12px;}
.featured-av{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#fff;flex-shrink:0;}
.featured-author-name{font-size:14px;font-weight:700;color:var(--text);}
.featured-author-role{font-size:12px;color:var(--muted);}
.featured-cta{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:700;color:var(--lime);margin-top:24px;cursor:pointer;transition:gap 0.15s;}
.featured-cta:hover{gap:12px;}

/* ── POSTS GRID ── */
.posts-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;}
.post-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);overflow:hidden;cursor:pointer;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;display:flex;flex-direction:column;}
.post-card:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.07);}
.post-card-top{padding:28px 28px 0;}
.post-card-meta{display:flex;align-items:center;gap:8px;margin-bottom:16px;flex-wrap:wrap;}
.post-cat-tag{display:inline-flex;font-size:11px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;padding:3px 10px;border-radius:var(--r-pill);}
.post-date{font-size:12px;color:var(--muted);}
.post-card-title{font-size:17px;font-weight:800;color:var(--text);letter-spacing:-0.02em;line-height:1.3;margin-bottom:12px;}
.post-card-excerpt{font-size:13px;color:var(--sub);line-height:1.7;margin-bottom:0;}
.post-card-bottom{padding:20px 28px 28px;margin-top:auto;}
.post-card-divider{height:1px;background:var(--border);margin-bottom:20px;}
.post-card-author{display:flex;align-items:center;gap:10px;}
.post-av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;flex-shrink:0;}
.post-author-name{font-size:13px;font-weight:600;color:var(--text);}
.post-read-time{font-size:12px;color:var(--muted);}
.post-card-tags{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;}
.post-tag{font-size:11px;font-weight:600;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:var(--r-pill);padding:3px 10px;}

/* ── NEWSLETTER ── */
.newsletter-band{background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);}
.newsletter-inner{max-width:1200px;margin:0 auto;padding:72px 40px;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;}
.newsletter-eyebrow{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--lime);background:var(--lime-dim);border:1px solid var(--lime-glow);border-radius:var(--r-pill);padding:4px 12px;margin-bottom:16px;}
.newsletter-title{font-size:clamp(26px,3vw,38px);font-weight:800;color:var(--text);letter-spacing:-0.025em;line-height:1.15;margin-bottom:12px;}
.newsletter-sub{font-size:15px;color:var(--sub);line-height:1.65;}
.newsletter-form{display:flex;gap:8px;}
.newsletter-input{flex:1;background:#fff;border:1px solid var(--border2);border-radius:var(--r-pill);font-family:var(--sans);font-size:14px;font-weight:500;color:var(--text);padding:12px 20px;outline:none;transition:border-color 0.2s;}
.newsletter-input:focus{border-color:rgba(61,187,0,0.35);}
.newsletter-input::placeholder{color:var(--muted);}
.newsletter-btn{display:inline-flex;align-items:center;gap:0;font-family:var(--sans);font-size:14px;font-weight:700;cursor:pointer;border:none;border-radius:var(--r-pill);background:var(--text);color:#fff;padding:0 6px 0 20px;height:48px;transition:opacity 0.2s;white-space:nowrap;flex-shrink:0;}
.newsletter-btn .arrow-box{width:34px;height:34px;border-radius:50%;background:var(--purple);display:flex;align-items:center;justify-content:center;margin-left:10px;}
.newsletter-btn:hover{opacity:0.85;}
.newsletter-note{font-size:12px;color:var(--muted);margin-top:10px;}

/* ── PAGINATION ── */
.pagination{display:flex;align-items:center;justify-content:center;gap:6px;padding:48px 0 0;}
.page-btn{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;cursor:pointer;border:1px solid var(--border);background:transparent;color:var(--sub);transition:all 0.15s;}
.page-btn:hover{border-color:var(--border2);color:var(--text);}
.page-btn.active{background:var(--text);border-color:var(--text);color:#fff;}
.page-btn.arrow-btn{color:var(--muted);}

/* ── CTA BANNER ── */
.cta-banner{background:linear-gradient(135deg,#f0f9e6 0%,#f5f0ff 50%,#f0f9e6 100%);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:100px 40px;text-align:center;position:relative;overflow:hidden;}
.cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:350px;border-radius:50%;background:radial-gradient(ellipse,rgba(61,187,0,0.12) 0%,transparent 70%);pointer-events:none;}
.cta-banner h2{font-size:clamp(32px,4vw,52px);font-weight:800;letter-spacing:-0.03em;line-height:1.08;margin-bottom:16px;color:var(--text);position:relative;z-index:1;}
.cta-banner h2 span{color:var(--lime);}
.cta-banner p{font-size:17px;color:var(--sub);margin-bottom:40px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.65;position:relative;z-index:1;}
.cta-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;}
.btn-primary{display:inline-flex;align-items:center;font-family:var(--sans);font-size:15px;font-weight:700;cursor:pointer;border:none;border-radius:var(--r-pill);background:var(--text);color:#fff;padding:0 8px 0 26px;height:52px;transition:opacity 0.2s;white-space:nowrap;}
.btn-primary .arrow-box{width:36px;height:36px;border-radius:50%;background:var(--purple);display:flex;align-items:center;justify-content:center;margin-left:14px;flex-shrink:0;}
.btn-primary:hover{opacity:0.85;}
.btn-outline{display:inline-flex;align-items:center;font-family:var(--sans);font-size:15px;font-weight:600;cursor:pointer;border:1.5px solid var(--border2);border-radius:var(--r-pill);background:#fff;color:var(--text);padding:0 8px 0 26px;height:52px;transition:border-color 0.2s,background 0.2s;white-space:nowrap;}
.btn-outline .arrow-box{width:36px;height:36px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin-left:14px;flex-shrink:0;}
.btn-outline:hover{border-color:var(--sub);background:var(--surface);}

@media(max-width:960px){
  .featured-post{grid-template-columns:1fr;}
  .featured-visual{display:none;}
  .posts-grid{grid-template-columns:repeat(2,1fr);}
  .newsletter-inner{grid-template-columns:1fr;}
}
@media(max-width:640px){
  .blog-hero{padding:120px 20px 60px;}
  .section{padding:64px 20px;}
  .posts-grid{grid-template-columns:1fr;}
  .newsletter-inner{padding:48px 20px;}
  .newsletter-form{flex-direction:column;}
  .newsletter-btn{justify-content:center;}
  .cta-banner{padding:64px 20px;}
  .cta-actions{flex-direction:column;align-items:stretch;}
  .cta-actions>*{justify-content:center;}
}
`;

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const featured = POSTS.find(p => p.featured);
  const rest = POSTS.filter(p => !p.featured);

  const filtered = rest.filter(p => {
    const matchCat = activeCategory === "All" || p.cat === activeCategory;
    const matchSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <style>{G}</style>
      <Navbar />

      {/* ── HERO ── */}
      <div className="blog-hero">
        <div className="blog-hero-orb"/>
        <div className="blog-hero-inner">
          <FadeIn>
            <div className="blog-hero-badge">
              <div className="blog-hero-dot"/>
              Insights from the Lixeen team
            </div>
            <h1 className="blog-hero-h1">The Lixeen <span>Blog</span></h1>
            <p className="blog-hero-sub">Research, platform updates, trainer stories, and honest writing about the AI labor economy.</p>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="blog-controls">
              <div className="blog-search-wrap">
                <span className="blog-search-icon"><I n="search" s={16} c="var(--muted)"/></span>
                <input
                  className="blog-search-input"
                  placeholder="Search posts…"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="cat-pills">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`cat-pill${activeCategory === cat ? " active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >{cat}</button>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="divider"/>

      {/* ── CONTENT ── */}
      <div style={{ background: "var(--bg)" }}>
        <div className="section">

          {featured && activeCategory === "All" && !searchQuery && (
            <FadeIn>
              <div className="featured-post">
                <div className="featured-visual">
                  <div className="featured-visual-orb"/>
                  <div className="featured-graphic">
                    <div className="featured-graphic-num">94%</div>
                    <div className="featured-graphic-label">Acceptance rate</div>
                  </div>
                </div>
                <div className="featured-content">
                  <div className="featured-meta">
                    <span
                      className="featured-badge"
                      style={{ background: featured.catBg, border: `1px solid ${featured.catBorder}`, color: featured.catColor }}
                    >
                      ★ Featured · {featured.cat}
                    </span>
                    <span className="featured-read"><I n="clock" s={12} c="var(--muted)"/> &nbsp;{featured.readTime}</span>
                    <span className="featured-read">{featured.date}</span>
                  </div>
                  <div className="featured-title">{featured.title}</div>
                  <div className="featured-excerpt">{featured.excerpt}</div>
                  <div className="featured-author">
                    <div className="featured-av" style={{ background: featured.authorColor }}>{featured.authorInitials}</div>
                    <div>
                      <div className="featured-author-name">{featured.author}</div>
                      <div className="featured-author-role">{featured.authorRole}</div>
                    </div>
                  </div>
                  <div className="featured-cta">
                    Read article <Arrow size={14} color="var(--lime)"/>
                  </div>
                </div>
              </div>
            </FadeIn>
          )}

          <FadeIn delay={100}>
            {filtered.length > 0 ? (
              <div className="posts-grid">
                {filtered.map((post) => (
                  <div className="post-card" key={post.id}>
                    <div className="post-card-top">
                      <div className="post-card-meta">
                        <span
                          className="post-cat-tag"
                          style={{ background: post.catBg, border: `1px solid ${post.catBorder}`, color: post.catColor }}
                        >{post.cat}</span>
                        <span className="post-date">{post.date}</span>
                      </div>
                      <div className="post-card-title">{post.title}</div>
                      <div className="post-card-excerpt">{post.excerpt}</div>
                    </div>
                    <div className="post-card-bottom">
                      <div className="post-card-divider"/>
                      <div className="post-card-author">
                        <div className="post-av" style={{ background: post.authorColor }}>{post.authorInitials}</div>
                        <div style={{ flex: 1 }}>
                          <div className="post-author-name">{post.author}</div>
                          <div className="post-read-time">{post.readTime}</div>
                        </div>
                        <Arrow size={14} color="var(--lime)"/>
                      </div>
                      <div className="post-card-tags">
                        {post.tags.map(t => <span className="post-tag" key={t}>{t}</span>)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--muted)", fontSize: 16 }}>
                No posts match your search. <span style={{ color: "var(--lime)", cursor: "pointer" }} onClick={() => { setSearchQuery(""); setActiveCategory("All"); }}>Clear filters</span>
              </div>
            )}
          </FadeIn>

          {filtered.length > 0 && (
            <div className="pagination">
              <button className="page-btn arrow-btn"><I n="chevronL" s={14}/></button>
              {[1,2,3].map(n => (
                <button key={n} className={`page-btn${n === 1 ? " active" : ""}`}>{n}</button>
              ))}
              <button className="page-btn arrow-btn" style={{ transform: "rotate(180deg)" }}><I n="chevronL" s={14}/></button>
            </div>
          )}
        </div>
      </div>

      {/* ── NEWSLETTER ── */}
      <div className="newsletter-band">
        <div className="newsletter-inner">
          <FadeIn>
            <div className="newsletter-eyebrow"><I n="rss" s={11} c="var(--lime)"/> Subscribe</div>
            <div className="newsletter-title">Get new posts in your inbox</div>
            <div className="newsletter-sub">No fluff. Research, product updates, and trainer stories — every two weeks. Unsubscribe anytime.</div>
          </FadeIn>
          <FadeIn delay={80}>
            {subscribed ? (
              <div style={{ fontSize: 16, color: "var(--lime)", fontWeight: 700, padding: "20px 0" }}>
                ✓ You're subscribed. Look out for our next issue.
              </div>
            ) : (
              <>
                <div className="newsletter-form">
                  <input
                    className="newsletter-input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button className="newsletter-btn" onClick={() => email && setSubscribed(true)}>
                    Subscribe
                    <div className="arrow-box"><Arrow size={14} color="#fff"/></div>
                  </button>
                </div>
                <div className="newsletter-note">No spam. Unsubscribe anytime.</div>
              </>
            )}
          </FadeIn>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="cta-banner">
        <div className="cta-glow"/>
        <FadeIn>
          <h2>Ready to start <span>earning?</span></h2>
          <p>Join 12,000+ trainers across 50+ countries. Free to join, no commitment.</p>
          <div className="cta-actions">
            <button className="btn-primary">
              Create Free Account
              <div className="arrow-box"><Arrow size={16} color="#fff"/></div>
            </button>
            <button className="btn-outline">
              Browse Open Tasks
              <div className="arrow-box"><Arrow size={14} color="#555"/></div>
            </button>
          </div>
        </FadeIn>
      </div>

      <Footer />
    </>
  );
}