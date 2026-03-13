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
    search:    <><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></>,
    plus:      <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus:     <line x1="5" y1="12" x2="19" y2="12"/>,
    check:     <polyline points="20 6 9 17 4 12"/>,
    chevron:   <polyline points="9 18 15 12 9 6"/>,
    book:      <><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></>,
    zap:       <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    dollar:    <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    shield:    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    settings:  <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></>,
    globe:     <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    alert:     <><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></>,
    mail:      <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></>,
    clock:     <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>,</>,
    star:      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    trending:  <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none"
      stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[n]}
    </svg>
  );
};

/* ── Data ── */
const CATEGORIES = [
  {
    icon: "book",
    color: "#3dbb00",
    bg: "rgba(61,187,0,0.08)",
    border: "rgba(61,187,0,0.18)",
    title: "Getting Started",
    desc: "Account setup, first task, and platform basics.",
    count: 14,
    articles: [
      "How to create your Lixeen account",
      "Completing your trainer profile",
      "Taking your first skill assessment",
      "Understanding task types",
      "How the level system works",
    ],
  },
  {
    icon: "zap",
    color: "#7c5cfc",
    bg: "rgba(124,92,252,0.08)",
    border: "rgba(124,92,252,0.18)",
    title: "Tasks & Submissions",
    desc: "Browsing tasks, submitting work, and understanding scores.",
    count: 22,
    articles: [
      "How to browse and filter tasks",
      "Submitting a task correctly",
      "Understanding rubric scores",
      "What happens after submission",
      "How to appeal a rejection",
    ],
  },
  {
    icon: "dollar",
    color: "#3dbb00",
    bg: "rgba(61,187,0,0.08)",
    border: "rgba(61,187,0,0.18)",
    title: "Payments & Payouts",
    desc: "Payout schedules, methods, minimums, and delays.",
    count: 18,
    articles: [
      "When do payouts happen?",
      "Supported payout methods by country",
      "Minimum payout threshold ($10)",
      "How to add a bank account",
      "What to do if a payout is delayed",
    ],
  },
  {
    icon: "shield",
    color: "#c03030",
    bg: "rgba(220,50,50,0.08)",
    border: "rgba(220,50,50,0.18)",
    title: "Account & Security",
    desc: "Password, 2FA, account verification, and privacy.",
    count: 11,
    articles: [
      "Enabling two-factor authentication",
      "Changing your email address",
      "How to reset your password",
      "Identity verification (KYC)",
      "Requesting account deletion",
    ],
  },
  {
    icon: "settings",
    color: "#c07000",
    bg: "rgba(220,120,0,0.08)",
    border: "rgba(220,120,0,0.18)",
    title: "Technical Issues",
    desc: "Bugs, browser issues, and performance problems.",
    count: 9,
    articles: [
      "Task interface not loading",
      "Supported browsers and devices",
      "How to report a bug",
      "Submission errors and retries",
      "Slow platform performance",
    ],
  },
  {
    icon: "globe",
    color: "#0070c0",
    bg: "rgba(0,120,210,0.08)",
    border: "rgba(0,120,210,0.18)",
    title: "Tax & Compliance",
    desc: "W-forms, 1099s, reporting thresholds, and deadlines.",
    count: 16,
    articles: [
      "Which tax form do I need?",
      "How to submit your W-8BEN",
      "When is my 1099-NEC issued?",
      "Earnings reporting by country",
      "How to download your tax summary",
    ],
  },
];

const POPULAR = [
  { cat: "Payments", title: "What is the minimum payout amount?", views: "18.4K" },
  { cat: "Getting Started", title: "How do I pass the skill assessment?", views: "14.1K" },
  { cat: "Tasks", title: "Why was my submission rejected?", views: "12.7K" },
  { cat: "Payments", title: "How long do payouts take to arrive?", views: "11.3K" },
  { cat: "Account", title: "How do I verify my identity (KYC)?", views: "9.8K" },
  { cat: "Tax", title: "Do I need to submit a W-9 or W-8BEN?", views: "8.6K" },
  { cat: "Tasks", title: "How do I appeal a rejected task?", views: "7.2K" },
  { cat: "Getting Started", title: "What levels are available and how do I level up?", views: "6.9K" },
];

const FAQS = [
  { q: "How do I reset my password?", a: "Go to the login page and click 'Forgot password'. Enter your registered email and you'll receive a reset link within 2 minutes. If it doesn't arrive, check your spam folder or contact support@lixeen.com." },
  { q: "Why is my payout pending?", a: "Payouts are processed within 24–48 hours of task acceptance. Bank transfers can take an additional 1–3 business days depending on your bank. If your payout has been pending for more than 5 business days, contact payments@lixeen.com with your transaction ID." },
  { q: "Can I work from any country?", a: "Lixeen is available in 50+ countries. You can check if your country is supported on the signup page. Some task types may have region restrictions based on language requirements or client preferences." },
  { q: "How is my acceptance rate calculated?", a: "Your acceptance rate is the percentage of submitted tasks that are accepted by our QA team. It's calculated on a rolling 30-day basis. Tasks under appeal are excluded until a decision is made." },
  { q: "What happens if I disagree with a rejection?", a: "You can file an appeal within 7 days of rejection from your task history. Select the task, click 'Appeal', and provide your reasoning. Appeals are reviewed by a senior QA reviewer within 48 hours." },
  { q: "How do I delete my account?", a: "Go to Settings → Account → Delete Account. Any pending payouts will be processed before deletion. Note that deletion is permanent — your task history and earnings records cannot be recovered." },
];

/* ── Helpers ── */
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

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #ffffff;
  --surface:   #f7f7f7;
  --surface2:  #efefef;
  --border:    #e5e5e5;
  --border2:   #dddddd;
  --text:      #0a0a0a;
  --sub:       #555555;
  --muted:     #999999;
  --lime:      #3dbb00;
  --lime-dim:  rgba(61,187,0,0.08);
  --lime-glow: rgba(61,187,0,0.18);
  --purple:    #7c5cfc;
  --sans:      'Anek Devanagari', system-ui, sans-serif;
  --r-pill:    999px;
  --r-card:    16px;
  --r-sm:      8px;
}

html { scroll-behavior: smooth; }
body { font-family: var(--sans); color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }
.divider { height: 1px; background: var(--border); }
.section { padding: 100px 40px; max-width: 1200px; margin: 0 auto; }

.sec-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--lime); background: var(--lime-dim); border: 1px solid var(--lime-glow);
  border-radius: var(--r-pill); padding: 5px 14px; margin-bottom: 20px;
}
.sec-h2 {
  font-size: clamp(32px, 4.5vw, 52px); font-weight: 800; color: var(--text);
  letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 16px;
}
.sec-sub { font-size: 16px; color: var(--sub); max-width: 500px; line-height: 1.65; margin-bottom: 48px; }

/* Buttons */
.btn-primary {
  display: inline-flex; align-items: center;
  font-family: var(--sans); font-size: 15px; font-weight: 700;
  cursor: pointer; border: none; border-radius: var(--r-pill);
  background: var(--text); color: #fff;
  padding: 0 8px 0 26px; height: 52px; transition: opacity 0.2s; white-space: nowrap;
}
.btn-primary .arrow-box {
  width: 36px; height: 36px; border-radius: 50%; background: var(--purple);
  display: flex; align-items: center; justify-content: center; margin-left: 14px; flex-shrink: 0;
}
.btn-primary:hover { opacity: 0.85; }

.btn-outline {
  display: inline-flex; align-items: center;
  font-family: var(--sans); font-size: 15px; font-weight: 600;
  cursor: pointer; border: 1.5px solid var(--border2);
  border-radius: var(--r-pill); background: #fff; color: var(--text);
  padding: 0 8px 0 26px; height: 52px; transition: border-color 0.2s, background 0.2s; white-space: nowrap;
}
.btn-outline .arrow-box {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center; margin-left: 14px; flex-shrink: 0;
}
.btn-outline:hover { border-color: var(--sub); background: var(--surface); }

/* ── HERO ── */
.hc-hero {
  padding: 160px 40px 100px; text-align: center;
  position: relative; overflow: hidden; background: var(--bg);
}
.hc-hero-orb {
  position: absolute; bottom: -10%; left: 50%; transform: translateX(-50%);
  width: 900px; height: 500px; border-radius: 50%;
  background: radial-gradient(ellipse at 50% 40%,
    rgba(61,187,0,0.14) 0%, rgba(124,92,252,0.06) 45%, transparent 75%);
  filter: blur(2px);
  pointer-events: none;
}
.hc-hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500; color: var(--sub);
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-pill); padding: 8px 18px; margin-bottom: 32px;
  position: relative; z-index: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.hc-hero-badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--lime); box-shadow: 0 0 6px rgba(61,187,0,0.5);
  animation: hcpulse 2s infinite;
}
@keyframes hcpulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:0.5; transform:scale(0.8); }
}
.hc-hero-h1 {
  font-size: clamp(44px, 6vw, 80px); font-weight: 800; color: var(--text);
  letter-spacing: -0.03em; line-height: 1.05; max-width: 820px;
  margin: 0 auto 20px; position: relative; z-index: 1;
}
.hc-hero-h1 span { color: var(--lime); }
.hc-hero-sub {
  font-size: 17px; color: var(--sub); max-width: 480px; line-height: 1.65;
  margin: 0 auto 44px; position: relative; z-index: 1;
}

/* Search bar */
.hc-search-wrap {
  max-width: 600px; margin: 0 auto 48px; position: relative; z-index: 1;
}
.hc-search-box {
  width: 100%; background: #fff;
  border: 1px solid var(--border2); border-radius: var(--r-pill);
  display: flex; align-items: center; gap: 0;
  padding: 6px 6px 6px 22px;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.hc-search-box:focus-within {
  border-color: rgba(61,187,0,0.4);
  box-shadow: 0 0 0 3px rgba(61,187,0,0.08);
}
.hc-search-input {
  flex: 1; background: transparent; border: none; outline: none;
  font-family: var(--sans); font-size: 15px; font-weight: 500;
  color: var(--text); padding: 10px 0;
}
.hc-search-input::placeholder { color: var(--muted); }
.hc-search-btn {
  height: 42px; padding: 0 22px; border-radius: var(--r-pill);
  background: var(--text); border: none; cursor: pointer;
  font-family: var(--sans); font-size: 14px; font-weight: 700; color: #fff;
  transition: opacity 0.15s; white-space: nowrap; flex-shrink: 0;
}
.hc-search-btn:hover { opacity: 0.85; }

/* Popular searches */
.hc-popular-searches {
  display: flex; align-items: center; gap: 8px;
  flex-wrap: wrap; justify-content: center;
  position: relative; z-index: 1;
}
.hc-popular-label {
  font-size: 12px; color: var(--muted); font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.08em;
}
.hc-popular-tag {
  font-size: 12.5px; font-weight: 600; color: var(--sub);
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-pill); padding: 6px 14px;
  cursor: pointer; transition: border-color 0.15s, color 0.15s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.hc-popular-tag:hover { border-color: rgba(61,187,0,0.4); color: var(--lime); }

/* ── STATS STRIP ── */
.hc-stats {
  background: #fff;
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
}
.hc-stats-inner {
  max-width: 1200px; margin: 0 auto;
  display: grid; grid-template-columns: repeat(4, 1fr);
}
.hc-stat-cell {
  padding: 32px; text-align: center;
  border-right: 1px solid var(--border);
}
.hc-stat-cell:last-child { border-right: none; }
.hc-stat-val { font-size: 36px; font-weight: 800; color: var(--text); letter-spacing: -0.04em; line-height: 1; margin-bottom: 6px; }
.hc-stat-lbl { font-size: 13px; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.08em; }

/* ── CATEGORIES ── */
.hc-cats-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}
.hc-cat-card {
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 28px;
  cursor: pointer; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  position: relative; overflow: hidden;
}
.hc-cat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.07); }
.hc-cat-card-top {
  display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 16px;
}
.hc-cat-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.hc-cat-count {
  font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--muted);
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-pill); padding: 4px 10px; white-space: nowrap;
}
.hc-cat-title { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.hc-cat-desc { font-size: 13px; color: var(--sub); line-height: 1.6; margin-bottom: 20px; }
.hc-cat-articles { display: flex; flex-direction: column; gap: 6px; }
.hc-cat-article {
  display: flex; align-items: center; gap: 8px;
  font-size: 13px; color: var(--muted); cursor: pointer;
  transition: color 0.15s; padding: 2px 0;
}
.hc-cat-article:hover { color: var(--text); }
.hc-cat-article-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--border2); flex-shrink: 0; transition: background 0.15s;
}
.hc-cat-article:hover .hc-cat-article-dot { background: var(--lime); }
.hc-cat-footer {
  margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border);
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; cursor: pointer; transition: gap 0.15s;
}
.hc-cat-footer:hover { gap: 10px; }

/* ── POPULAR ARTICLES ── */
.hc-popular-grid {
  display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;
}
.hc-popular-row {
  display: flex; align-items: center; gap: 16px;
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 18px 20px;
  cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s;
}
.hc-popular-row:hover { border-color: var(--border2); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.hc-popular-num {
  font-size: 20px; font-weight: 800; color: var(--border2);
  letter-spacing: -0.04em; flex-shrink: 0; min-width: 28px;
  line-height: 1;
}
.hc-popular-body { flex: 1; min-width: 0; }
.hc-popular-cat {
  font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
  text-transform: uppercase; color: var(--lime); margin-bottom: 4px;
}
.hc-popular-title { font-size: 14px; font-weight: 600; color: var(--text); line-height: 1.4; }
.hc-popular-views { font-size: 11px; color: var(--muted); margin-top: 4px; }
.hc-popular-arrow {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  transition: background 0.15s, border-color 0.15s;
}
.hc-popular-row:hover .hc-popular-arrow {
  background: var(--lime-dim); border-color: var(--lime-glow);
}

/* ── FAQ ── */
.hc-faq-list {
  display: flex; flex-direction: column;
  border: 1px solid var(--border); border-radius: var(--r-card);
  overflow: hidden; max-width: 780px; margin: 0 auto;
}
.hc-faq-item { border-bottom: 1px solid var(--border); background: #fff; }
.hc-faq-item:last-child { border-bottom: none; }
.hc-faq-q {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 26px; cursor: pointer; font-size: 15px; font-weight: 600; color: var(--text);
  gap: 14px; user-select: none; transition: background 0.15s;
}
.hc-faq-q:hover { background: var(--surface); }
.hc-faq-toggle {
  width: 24px; height: 24px; border: 1px solid var(--border); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--sub);
  transition: background 0.15s, border-color 0.15s;
}
.hc-faq-q:hover .hc-faq-toggle { background: var(--surface2); border-color: var(--border2); }
.hc-faq-a { padding: 0 26px 20px; font-size: 14px; color: var(--sub); line-height: 1.7; }

/* ── CONTACT STRIP ── */
.hc-contact-strip {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}
.hc-contact-card {
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 28px;
  display: flex; flex-direction: column; gap: 0;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.hc-contact-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.hc-contact-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 16px;
}
.hc-contact-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.hc-contact-desc { font-size: 13px; color: var(--sub); line-height: 1.6; margin-bottom: 20px; flex: 1; }
.hc-contact-action {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 700; cursor: pointer;
  transition: gap 0.15s;
}
.hc-contact-action:hover { gap: 10px; }
.hc-contact-meta { font-size: 11px; color: var(--muted); margin-top: 6px; }

/* ── CTA BANNER ── */
.cta-banner {
  background: linear-gradient(135deg, #f0f9e6 0%, #f5f0ff 50%, #f0f9e6 100%);
  border-top: 1px solid var(--border); border-bottom: 1px solid var(--border);
  padding: 100px 40px; text-align: center; position: relative; overflow: hidden;
}
.cta-glow {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  width: 700px; height: 350px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(61,187,0,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.cta-banner h2 {
  font-size: clamp(32px, 4.5vw, 56px); font-weight: 800; letter-spacing: -0.03em;
  line-height: 1.08; margin-bottom: 16px; color: var(--text); position: relative; z-index: 1;
}
.cta-banner h2 span { color: var(--lime); }
.cta-banner p {
  font-size: 17px; color: var(--sub); margin-bottom: 40px;
  max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.65;
  position: relative; z-index: 1;
}
.cta-actions {
  display: flex; gap: 14px; justify-content: center;
  flex-wrap: wrap; position: relative; z-index: 1;
}

/* ── FOOTER ─── */
.footer { background: var(--surface); border-top: 1px solid var(--border); padding: 56px 40px 32px; }
.footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.footer-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.footer-logo-mark { width: 30px; height: 30px; background: var(--text); border-radius: 9px; display: flex; align-items: center; justify-content: center; }
.footer-logo-name { font-size: 18px; font-weight: 800; color: var(--text); }
.footer-brand-desc { font-size: 13px; color: var(--muted); line-height: 1.65; max-width: 240px; }
.footer-col-title { font-size: 12px; font-weight: 700; color: var(--text); margin-bottom: 16px; letter-spacing: 0.02em; text-transform: uppercase; }
.footer-links { display: flex; flex-direction: column; gap: 10px; }
.footer-link { font-size: 13.5px; color: var(--muted); text-decoration: none; cursor: pointer; transition: color 0.1s; }
.footer-link:hover { color: var(--text); }
.footer-bottom { max-width: 1200px; margin: 0 auto; padding-top: 28px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--muted); }

/* ── RESPONSIVE ── */
@media (max-width: 960px) {
  .hc-cats-grid { grid-template-columns: repeat(2, 1fr); }
  .hc-popular-grid { grid-template-columns: 1fr; }
  .hc-stats-inner { grid-template-columns: repeat(2, 1fr); }
  .hc-stat-cell:nth-child(2) { border-right: none; }
  .hc-contact-strip { grid-template-columns: 1fr; }
}
@media (max-width: 640px) {
  .hc-hero { padding: 120px 20px 80px; }
  .hc-cats-grid { grid-template-columns: 1fr; }
  .section { padding: 64px 20px; }
  .cta-banner { padding: 64px 20px; }
  .hc-stats-inner { grid-template-columns: 1fr 1fr; }
  .cta-actions { flex-direction: column; align-items: stretch; }
  .cta-actions > * { justify-content: center; }
}
`;

/* ── Component ── */
export default function HelpCenter() {
  const [query, setQuery] = useState("");
  const [openFaq, setOpenFaq] = useState(null);
  const [expandedCat, setExpandedCat] = useState(null);

  return (
    <>
      <style>{G}</style>
      <Navbar />

      {/* ── HERO ── */}
      <div className="hc-hero">
        <div className="hc-hero-orb"/>
        <FadeIn>
          <div className="hc-hero-badge">
            <div className="hc-hero-badge-dot"/>
            74 articles · Updated weekly
          </div>
          <h1 className="hc-hero-h1">How can we <span>help you?</span></h1>
          <p className="hc-hero-sub">Search our knowledge base or browse by category below. Most answers are here — we promise.</p>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="hc-search-wrap">
            <div className="hc-search-box">
              <I n="search" s={18} c="var(--muted)"/>
              <input
                className="hc-search-input"
                placeholder="Search for answers…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              <button className="hc-search-btn">Search</button>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={160}>
          <div className="hc-popular-searches">
            <span className="hc-popular-label">Popular:</span>
            {["Payout delay","Appeal rejection","W-8BEN form","Level up","KYC verification"].map(t => (
              <span key={t} className="hc-popular-tag" onClick={() => setQuery(t)}>{t}</span>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* ── STATS ── */}
      <div className="hc-stats">
        <div className="hc-stats-inner">
          {[
            ["74", "Help articles"],
            ["< 4h", "Support response time"],
            ["98%", "Issues resolved"],
            ["50+", "Countries supported"],
          ].map(([v, l]) => (
            <div className="hc-stat-cell" key={l}>
              <div className="hc-stat-val">{v}</div>
              <div className="hc-stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ── */}
      <div className="divider"/>
      <div style={{ background: "var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Browse by Topic</div>
            <h2 className="sec-h2">What do you need help with?</h2>
            <p className="sec-sub">Six categories covering everything on the platform.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="hc-cats-grid">
              {CATEGORIES.map((cat, i) => (
                <div
                  className="hc-cat-card"
                  key={cat.title}
                  style={{ borderColor: expandedCat === i ? cat.border : undefined }}
                  onClick={() => setExpandedCat(expandedCat === i ? null : i)}
                >
                  <div className="hc-cat-card-top">
                    <div className="hc-cat-icon" style={{ background: cat.bg, border: `1px solid ${cat.border}` }}>
                      <I n={cat.icon} s={20} c={cat.color}/>
                    </div>
                    <span className="hc-cat-count">{cat.count} articles</span>
                  </div>
                  <div className="hc-cat-title">{cat.title}</div>
                  <div className="hc-cat-desc">{cat.desc}</div>
                  <div className="hc-cat-articles">
                    {cat.articles.map(a => (
                      <div className="hc-cat-article" key={a}>
                        <div className="hc-cat-article-dot"/>
                        {a}
                      </div>
                    ))}
                  </div>
                  <div className="hc-cat-footer" style={{ color: cat.color }}>
                    View all articles <Arrow size={13} color={cat.color}/>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── POPULAR ARTICLES ── */}
      <div className="divider"/>
      <div style={{ background: "var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Most Viewed</div>
            <h2 className="sec-h2">Popular articles</h2>
            <p className="sec-sub">The questions trainers ask most often — answered.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="hc-popular-grid">
              {POPULAR.map((item, i) => (
                <div className="hc-popular-row" key={item.title}>
                  <div className="hc-popular-num">0{i + 1}</div>
                  <div className="hc-popular-body">
                    <div className="hc-popular-cat">{item.cat}</div>
                    <div className="hc-popular-title">{item.title}</div>
                    <div className="hc-popular-views">{item.views} views</div>
                  </div>
                  <div className="hc-popular-arrow">
                    <Arrow size={13} color="var(--lime)"/>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="divider"/>
      <div style={{ background: "var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="sec-eyebrow" style={{ display: "inline-flex" }}>Quick Answers</div>
              <h2 className="sec-h2">Frequently asked questions</h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="hc-faq-list">
              {FAQS.map((f, i) => (
                <div className="hc-faq-item" key={i}>
                  <div className="hc-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    {f.q}
                    <div className="hc-faq-toggle">
                      <I n={openFaq === i ? "minus" : "plus"} s={12}/>
                    </div>
                  </div>
                  {openFaq === i && <div className="hc-faq-a">{f.a}</div>}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── CONTACT CHANNELS ── */}
      <div className="divider"/>
      <div style={{ background: "var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Still Need Help?</div>
            <h2 className="sec-h2">Reach our team</h2>
            <p className="sec-sub">Can't find what you're looking for? A real human will respond.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="hc-contact-strip">
              {[
                {
                  icon: "mail", color: "#3dbb00", bg: "rgba(61,187,0,0.08)", border: "rgba(61,187,0,0.18)",
                  title: "Submit a Ticket",
                  desc: "For task issues, account problems, appeals, and anything that needs a paper trail.",
                  action: "Open support ticket",
                  meta: "Avg. response < 4 hours",
                },
                {
                  icon: "dollar", color: "#3dbb00", bg: "rgba(61,187,0,0.08)", border: "rgba(61,187,0,0.18)",
                  title: "Payments Support",
                  desc: "Payout delays, incorrect amounts, bank transfer issues, and PayPal problems.",
                  action: "Email payments@lixeen.com",
                  meta: "Avg. response < 2 hours",
                },
                {
                  icon: "trending", color: "#7c5cfc", bg: "rgba(124,92,252,0.08)", border: "rgba(124,92,252,0.18)",
                  title: "Enterprise & Clients",
                  desc: "Data contracts, custom pipelines, white-label, and SLA-backed engagements.",
                  action: "Email clients@lixeen.com",
                  meta: "Response within 1 business day",
                },
              ].map(ch => (
                <div className="hc-contact-card" key={ch.title}>
                  <div className="hc-contact-icon" style={{ background: ch.bg, border: `1px solid ${ch.border}` }}>
                    <I n={ch.icon} s={20} c={ch.color}/>
                  </div>
                  <div className="hc-contact-title">{ch.title}</div>
                  <div className="hc-contact-desc">{ch.desc}</div>
                  <div className="hc-contact-action" style={{ color: ch.color }}>
                    {ch.action} <Arrow size={13} color={ch.color}/>
                  </div>
                  <div className="hc-contact-meta">{ch.meta}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="cta-banner">
        <div className="cta-glow"/>
        <FadeIn>
          <h2>Still not finding <span>what you need?</span></h2>
          <p>Our support team responds to every ticket. Send us a message and we'll get back to you within 4 hours.</p>
          <div className="cta-actions">
            <button className="btn-primary">
              Contact Support
              <div className="arrow-box"><Arrow size={16} color="#fff"/></div>
            </button>
            <button className="btn-outline">
              Browse All Articles
              <div className="arrow-box"><Arrow size={16} color="#555"/></div>
            </button>
          </div>
        </FadeIn>
      </div>

      <Footer />
    </>
  );
}