import { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link, useNavigate } from "react-router-dom";
import { Arrow, I, LogoMark } from '../assets/constants/branding';
import { useAuth } from "./auth/AuthContext";


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
  --lime:      #c8f026;
  --lime-dim:  rgba(80,160,0,0.08);
  --lime-glow: rgba(80,160,0,0.2);
  --purple:    #7c5cfc;
  --sans:      'Anek Devanagari', system-ui, sans-serif;
  --r-pill:    999px;
  --r-card:    16px;
  --r-sm:      8px;
}

html { scroll-behavior: smooth; overflow-x: hidden; }
body { font-family: var(--sans); color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased; overflow-x: hidden; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }


/* Pill CTA button */
.btn-cta {
  display: inline-flex; align-items: center; gap: 0;
  font-family: var(--sans); font-size: 14px; font-weight: 600;
  cursor: pointer; border: 1.5px solid var(--border2);
  border-radius: var(--r-pill);
  background: transparent; color: var(--text);
  padding: 0 6px 0 20px; height: 42px;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  white-space: nowrap;
}
.btn-cta .arrow-box {
  width: 30px; height: 30px; border-radius: 50%;
  background: var(--text);
  display: flex; align-items: center; justify-content: center;
  margin-left: 10px; flex-shrink: 0;
  transition: background 0.2s;
}
.btn-cta:hover { background: var(--text); color: #fff; border-color: var(--text); }
.btn-cta:hover .arrow-box { background: #fff; }

/* Hero pill button */
.btn-hero-primary {
  display: inline-flex; align-items: center; gap: 0;
  font-family: var(--sans); font-size: 15px; font-weight: 600;
  cursor: pointer; border: none;
  border-radius: var(--r-pill);
  background: var(--text);
  color: #fff;
  padding: 0 8px 0 24px; height: 52px;
  transition: opacity 0.2s;
}
.btn-hero-primary .arrow-box {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--purple);
  display: flex; align-items: center; justify-content: center;
  margin-left: 14px; flex-shrink: 0;
}
.btn-hero-primary:hover { opacity: 0.85; }

.btn-hero-outline {
  display: inline-flex; align-items: center; gap: 0;
  font-family: var(--sans); font-size: 15px; font-weight: 600;
  cursor: pointer;
  border: 1.5px solid var(--border2);
  border-radius: var(--r-pill);
  background: #fff;
  color: var(--text);
  padding: 0 8px 0 24px; height: 52px;
  transition: border-color 0.2s, background 0.2s;
}
.btn-hero-outline .arrow-box {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--surface2);
  border: 1px solid var(--border2);
  display: flex; align-items: center; justify-content: center;
  margin-left: 14px; flex-shrink: 0;
}
.btn-hero-outline:hover { border-color: var(--sub); background: var(--surface); }


/* ─── HERO ─── */
.hero {
  min-height: 100vh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  padding: 140px 32px 100px;
  position: relative; overflow: hidden;
  background: var(--bg);
}

.hero-orb {
  position: absolute;
  bottom: -10%; left: 50%; transform: translateX(-50%);
  width: min(900px, 130vw); height: min(520px, 75vw);
  border-radius: 50%;
  background: radial-gradient(ellipse at 50% 40%,
    rgba(200,240,38,0.18) 0%,
    rgba(124,92,252,0.08) 45%,
    transparent 75%
  );
  filter: blur(2px);
  pointer-events: none;
}
.hero-orb-inner {
  position: absolute;
  bottom: -14%; left: 50%; transform: translateX(-50%);
  width: min(600px, 100vw); height: min(340px, 55vw);
  border-radius: 50%;
  background: radial-gradient(ellipse at 50% 30%,
    rgba(200,240,38,0.12) 0%,
    transparent 75%
  );
  filter: blur(1px);
  pointer-events: none;
}

/* Floating cards */
.hero-card-left {
  position: absolute; left: 3%; top: 30%;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: 16px 20px;
  display: flex; align-items: center; gap: 14px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  z-index: 2;
  animation: floatL 6s ease-in-out infinite;
}
@keyframes floatL {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
.hero-card-icon {
  width: 44px; height: 44px; border-radius: 12px;
  background: linear-gradient(135deg, #e040fb, #ff6b6b);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.hero-card-label { font-size: 11px; color: var(--muted); font-weight: 500; margin-bottom: 2px; }
.hero-card-value { font-size: 18px; font-weight: 800; color: var(--text); }

.hero-card-right {
  position: absolute; right: 2%; top: 20%;
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: 18px 22px;
  min-width: 220px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.07);
  z-index: 2;
  animation: floatR 7s ease-in-out infinite;
}
@keyframes floatR {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}
.hero-card-right-title {
  font-size: 12px; font-weight: 700; color: var(--text);
  margin-bottom: 12px;
}
.mini-chart {
  display: flex; align-items: flex-end; gap: 4px; height: 50px;
}
.mini-bar {
  flex: 1; border-radius: 3px 3px 0 0;
  background: var(--surface2);
  transition: background 0.2s;
}
.mini-bar.hi { background: var(--text); }

.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500;
  color: var(--sub);
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r-pill);
  padding: 8px 18px;
  margin-bottom: 32px;
  position: relative; z-index: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.hero-badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #3dbb00;
  box-shadow: 0 0 6px rgba(61,187,0,0.5);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:0.5; transform:scale(0.8); }
}

.hero-h1 {
  font-size: clamp(52px, 7vw, 96px);
  font-weight: 800;
  color: var(--text);
  letter-spacing: -0.03em;
  line-height: 1.0;
  max-width: 900px;
  margin-bottom: 10px;
  position: relative; z-index: 1;
}
.hero-h1-lime {
  color: #3dbb00;
  display: block;
}
.hero-sub {
  font-size: 17px;
  color: var(--sub);
  max-width: 480px;
  line-height: 1.65;
  margin-bottom: 40px;
  font-weight: 400;
  position: relative; z-index: 1;
}
.hero-cta {
  display: flex; align-items: center; gap: 12px;
  flex-wrap: wrap; justify-content: center;
  position: relative; z-index: 1;
  margin-bottom: 72px;
}

/* Stats row */
.hero-stats {
  display: flex; align-items: stretch; gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  background: #fff;
  overflow: hidden;
  position: relative; z-index: 1;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
}
.hero-stat {
  padding: 18px 32px;
  border-right: 1px solid var(--border);
  text-align: center;
}
.hero-stat:last-child { border-right: none; }
.hero-stat-val {
  font-size: 26px; font-weight: 800;
  color: var(--text); line-height: 1; margin-bottom: 5px;
}
.hero-stat-lbl {
  font-size: 11px; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600;
}

/* ─── MARQUEE ─── */
.marquee-wrap {
  overflow: hidden;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: var(--surface);
  padding: 16px 0;
}
.marquee-track {
  display: flex; gap: 0;
  animation: marquee 30s linear infinite;
  width: max-content;
}
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.marquee-item {
  display: flex; align-items: center; gap: 10px;
  padding: 0 32px;
  border-right: 1px solid var(--border);
  font-size: 13px; font-weight: 600;
  color: var(--sub); white-space: nowrap;
}
.marquee-item .dot { color: #3dbb00; font-size: 18px; line-height: 1; }
.marquee-item span { color: #3dbb00; font-weight: 700; }

/* ─── SECTIONS ─── */
.section { padding: 100px 40px; max-width: 1200px; margin: 0 auto; }
.section-full { padding: 100px 40px; }

.sec-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11.5px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: #3dbb00;
  background: rgba(61,187,0,0.08);
  border: 1px solid rgba(61,187,0,0.18);
  border-radius: var(--r-pill);
  padding: 5px 14px;
  margin-bottom: 20px;
}
.sec-h2 {
  font-size: clamp(32px, 4.5vw, 52px);
  font-weight: 800; color: var(--text);
  letter-spacing: -0.03em; line-height: 1.1;
  margin-bottom: 16px;
}
.sec-sub {
  font-size: 16px; color: var(--sub);
  max-width: 500px; line-height: 1.65;
  margin-bottom: 48px;
}
.sec-head-row {
  display: flex; align-items: flex-end;
  justify-content: space-between; margin-bottom: 36px;
}

/* ─── HOW IT WORKS ─── */
.how-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--r-card); overflow: hidden;
}
.how-cell {
  background: #fff;
  padding: 36px 32px; position: relative;
  transition: background 0.2s;
}
.how-cell:hover { background: var(--surface); }
.how-num {
  font-size: 11px; font-weight: 700;
  font-family: var(--sans);
  color: #3dbb00; margin-bottom: 20px;
  letter-spacing: 0.1em; text-transform: uppercase;
}
.how-icon-wrap {
  width: 46px; height: 46px;
  border: 1px solid var(--border);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 20px; background: var(--surface);
}
.how-title {
  font-size: 17px; font-weight: 700; color: var(--text);
  margin-bottom: 10px; letter-spacing: -0.2px;
}
.how-desc { font-size: 14px; color: var(--sub); line-height: 1.65; }

/* ─── TASK CARDS ─── */
.tasks-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}
.task-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  padding: 22px 24px; cursor: pointer;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  position: relative; overflow: hidden;
}
.task-card:hover {
  border-color: #3dbb00;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(61,187,0,0.1);
}
.task-card-top {
  display: flex; align-items: flex-start;
  justify-content: space-between; gap: 10px; margin-bottom: 12px;
}
.task-card-type {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--muted);
}
.task-card-diff {
  font-size: 10.5px; font-weight: 600;
  padding: 3px 9px; border-radius: var(--r-pill); flex-shrink: 0;
}
.diff-easy   { background: rgba(61,187,0,0.1); color: #3dbb00; border: 1px solid rgba(61,187,0,0.2); }
.diff-medium { background: rgba(220,120,0,0.08); color: #c07000; border: 1px solid rgba(220,120,0,0.18); }
.diff-hard   { background: rgba(220,50,50,0.08); color: #c03030; border: 1px solid rgba(220,50,50,0.18); }
.task-card-title {
  font-size: 14px; font-weight: 600; color: var(--text);
  line-height: 1.45; margin-bottom: 16px;
}
.task-card-bottom {
  display: flex; align-items: center; justify-content: space-between;
}
.task-card-reward { font-size: 16px; font-weight: 800; color: #3dbb00; }
.task-card-dl { font-size: 11px; color: var(--muted); }

/* ─── FEATURES ─── */
.features-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 1px; background: var(--border);
  border: 1px solid var(--border);
  border-radius: var(--r-card); overflow: hidden;
}
.feature-cell {
  background: #fff; padding: 36px 34px;
  transition: background 0.2s;
}
.feature-cell:hover { background: var(--surface); }
.feature-icon-wrap {
  width: 44px; height: 44px;
  border: 1px solid var(--border); border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 18px; background: var(--surface);
}
.feature-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 9px; }
.feature-desc { font-size: 14px; color: var(--sub); line-height: 1.65; }

/* ─── TESTIMONIALS ─── */
.testimonials-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;
}
.testimonial-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 26px 24px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.testimonial-card:hover { border-color: var(--border2); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.stars { display: flex; gap: 2px; margin-bottom: 16px; }
.star { color: #3dbb00; font-size: 13px; }
.testimonial-text {
  font-size: 14px; color: var(--sub); line-height: 1.7;
  margin-bottom: 20px;
}
.testimonial-author { display: flex; align-items: center; gap: 12px; }
.testimonial-av {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, var(--purple), #c084fc);
  color: white; font-size: 12px; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.testimonial-name { font-size: 13.5px; font-weight: 700; color: var(--text); }
.testimonial-role { font-size: 11.5px; color: var(--muted); }

/* ─── FAQ ─── */
.faq-list {
  display: flex; flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--r-card); overflow: hidden;
  max-width: 740px; margin: 0 auto;
}
.faq-item { border-bottom: 1px solid var(--border); background: #fff; }
.faq-item:last-child { border-bottom: none; }
.faq-q {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 26px; cursor: pointer;
  font-size: 15px; font-weight: 600; color: var(--text);
  gap: 14px; user-select: none; transition: background 0.15s;
}
.faq-q:hover { background: var(--surface); }
.faq-toggle {
  width: 24px; height: 24px; border: 1px solid var(--border);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--sub);
  transition: background 0.15s, border-color 0.15s;
}
.faq-q:hover .faq-toggle { background: var(--surface2); border-color: var(--border2); }
.faq-a {
  padding: 0 26px 20px;
  font-size: 14px; color: var(--sub); line-height: 1.7;
}

/* ─── CTA BANNER ─── */
.cta-banner {
  background: linear-gradient(135deg, #f0f9e6 0%, #f5f0ff 50%, #f0f9e6 100%);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 80px 40px;
  text-align: center; position: relative; overflow: hidden;
}
.cta-banner-glow {
  position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
  width: min(600px, 100vw); height: min(300px, 50vw); border-radius: 50%;
  background: radial-gradient(ellipse, rgba(61,187,0,0.12) 0%, transparent 70%);
  pointer-events: none;
}
.cta-banner h2 {
  font-size: clamp(32px, 4.5vw, 54px);
  font-weight: 800; letter-spacing: -0.03em;
  line-height: 1.1; margin-bottom: 16px; color: var(--text);
  position: relative; z-index: 1;
}
.cta-banner h2 span { color: #3dbb00; }
.cta-banner p {
  font-size: 16px; color: var(--sub);
  margin-bottom: 36px; max-width: 420px;
  margin-left: auto; margin-right: auto; line-height: 1.65;
  position: relative; z-index: 1;
}
.cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }

.btn-lime {
  display: inline-flex; align-items: center; gap: 0;
  font-family: var(--sans); font-size: 15px; font-weight: 700;
  cursor: pointer; border: none;
  border-radius: var(--r-pill);
  background: var(--text); color: #fff;
  padding: 0 8px 0 26px; height: 52px;
  transition: opacity 0.2s;
}
.btn-lime .arrow-box {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  margin-left: 14px; flex-shrink: 0;
}
.btn-lime:hover { opacity: 0.85; }

.btn-outline-dark {
  display: inline-flex; align-items: center; gap: 0;
  font-family: var(--sans); font-size: 15px; font-weight: 600;
  cursor: pointer; border: 1.5px solid var(--border2);
  border-radius: var(--r-pill);
  background: #fff; color: var(--text);
  padding: 0 8px 0 26px; height: 52px;
  transition: border-color 0.2s, background 0.2s;
}
.btn-outline-dark .arrow-box {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center;
  margin-left: 14px; flex-shrink: 0;
}
.btn-outline-dark:hover { border-color: var(--sub); background: var(--surface); }

/* ─── DIVIDER ─── */
.divider { height: 1px; background: var(--border); }

/* ─── FADE IN ─── */
.fade-in {
  opacity: 0; transform: translateY(20px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}
.fade-in.visible { opacity: 1; transform: translateY(0); }

/* ─── LOGGED-IN QUICK NAV ─── */
.auth-quick-nav {
  display: flex; align-items: stretch; gap: 0;
  border: 1px solid var(--border);
  border-radius: var(--r-card);
  background: #fff; overflow: hidden;
  box-shadow: 0 2px 12px rgba(0,0,0,0.05);
  position: relative; z-index: 1;
}
.auth-quick-nav-item {
  padding: 18px 28px;
  border-right: 1px solid var(--border);
  text-align: center; cursor: pointer;
  transition: background 0.15s; text-decoration: none;
  display: flex; flex-direction: column; align-items: center; gap: 4px;
}
.auth-quick-nav-item:last-child { border-right: none; }
.auth-quick-nav-item:hover { background: var(--surface); }
.auth-quick-nav-label { font-size: 13px; font-weight: 700; color: var(--text); }
.auth-quick-nav-cta { font-size: 11px; color: #3dbb00; font-weight: 600; white-space: nowrap; }

/* ─── MOBILE ─── */
@media (max-width: 768px) {
  .hero { padding: 100px 20px 72px; }
  .hero-h1 { font-size: clamp(36px, 10vw, 56px); }
  .hero-sub { font-size: 15px; max-width: 100%; }
  .hero-cta { flex-direction: column; align-items: stretch; }
  .hero-cta > * { width: 100%; justify-content: center; }
  .hero-stats { flex-direction: column; width: 100%; }
  .hero-stat { border-right: none !important; border-bottom: 1px solid var(--border); padding: 14px 20px; }
  .hero-stat:last-child { border-bottom: none; }
  .hero-stat-val { font-size: 20px; }
  .hero-card-left { display: none; }
  .hero-card-right { display: none; }

  .auth-quick-nav { flex-wrap: wrap; width: 100%; }
  .auth-quick-nav-item { flex: 1 1 calc(50% - 1px); border-bottom: 1px solid var(--border); padding: 14px 16px; }
  .auth-quick-nav-item:nth-child(odd) { border-right: 1px solid var(--border); }
  .auth-quick-nav-item:nth-last-child(-n+2) { border-bottom: none; }

  .section, .section-full { padding: 56px 20px; }
  .sec-head-row { flex-direction: column; align-items: flex-start; gap: 16px; }
  .sec-sub { max-width: 100%; }
  .how-grid { grid-template-columns: 1fr; }
  .tasks-grid { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .faq-list { max-width: 100%; }

  .cta-banner { padding: 56px 20px; }
  .cta-banner h2 { font-size: clamp(26px, 8vw, 40px); }
  .cta-banner p { max-width: 100%; }
  .cta-actions { flex-direction: column; align-items: stretch; }
  .cta-actions > * { width: 100%; justify-content: center; }

  .btn-hero-primary, .btn-hero-outline, .btn-lime, .btn-outline-dark { width: 100%; justify-content: center; }
  .marquee-item { padding: 0 16px; }
}
`;

/* ── DATA ── */
const FEATURED_TASKS = [
  { type:"Ranking",    title:"Rank GPT-4 responses for helpfulness (50 pairs)",   reward:"$23.40/hr", diff:"easy",   dl:"2d left"  },
  { type:"Code Eval",  title:"Evaluate Python code correctness — 20 functions",   reward:"$46.80/hr", diff:"hard",   dl:"18h left" },
  { type:"Fact Check", title:"Rate factuality in long-form Wikipedia summaries",  reward:"$15.20/hr", diff:"medium", dl:"1d left"  },
  { type:"Safety",     title:"Flag harmful content in 40-item batch",             reward:"$32.10/hr", diff:"easy",   dl:"4d left"  },
  { type:"Eval",       title:"Score reasoning quality in chain-of-thought tasks", reward:"$18.50/hr", diff:"hard",   dl:"2d left"  },
  { type:"Rewrite",    title:"Rewrite ambiguous model instructions clearly",       reward:"$24.50/hr", diff:"medium", dl:"3d left"  },
];

const FAQS = [
  { q:"How do I get started as a trainer?", a:"Sign up, complete the onboarding assessment to verify your skills, and you'll immediately gain access to available tasks matching your specializations. Most trainers complete their first task within an hour of signing up." },
  { q:"How much can I earn?", a:"Earnings vary by task type and difficulty. Easy tasks start at $2/hr equivalent, while complex code evaluation or reasoning tasks can pay $8–12/hr. Top trainers on our platform earn $3,000–5,000+ per month." },
  { q:"When and how do I get paid?", a:"Payouts are processed on a rolling basis. Once your submission is accepted and reviewed, earnings appear in your balance within 24–48 hours. You can request a payout at any time via bank transfer or PayPal, with a $10 minimum threshold." },
  { q:"What qualifications do I need?", a:"No formal qualifications required for most tasks. We look for attention to detail, consistency, and domain knowledge in your specialization areas. Some tasks (like code evaluation) require demonstrated programming ability." },
  { q:"Is the work available globally?", a:"Yes. Lixeen operates in 50+ countries. All work is remote and asynchronous — work when you want, from wherever you are. Payout methods vary by region." },
];

const MARQUEE_ITEMS = [
  ["NLP Ranking","$33.40/hr"],["Code Evaluation","$56.80/hr"],["Safety Labeling","$22.10/hr"],
  ["Fact Checking","$25.20/hr"],["Chain-of-Thought","$18.50/hr"],["Rewriting","$24.50/hr"],
  ["Sentiment Analysis","$22.80/hr"],["Hallucination Detection","$24.00/hr"],["Instruction Following","$25.60/hr"],
];

const BAR_HEIGHTS = [20, 35, 25, 60, 45, 80, 55, 90, 70, 100];

/* ── Hooks & helpers ── */
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useFadeIn();
  return <div ref={ref} className="fade-in" style={{ transitionDelay:`${delay}ms`, ...style }}>{children}</div>;
}

function FAQ() {
  const [open, setOpen] = useState(null);
  return (
    <div className="faq-list">
      {FAQS.map((f, i) => (
        <div className="faq-item" key={i}>
          <div className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
            {f.q}
            <div className="faq-toggle">
              <I n={open === i ? "minus" : "plus"} s={12} c="currentColor"/>
            </div>
          </div>
          {open === i && <div className="faq-a">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

export default function Homepage() {
  const { user } = useAuth();

  return (
    <>
      <style>{G}</style>
      <Navbar />

      {/* ── HERO: branches on auth state ── */}
      {user ? (

        /* ══════════════════════════════════════
           LOGGED-IN HERO
        ══════════════════════════════════════ */
        <section style={{
          minHeight: "60vh",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center",
          padding: "140px 32px 80px",
          background: "var(--bg)",
          position: "relative", overflow: "hidden",
        }}>
          {/* Subtle background glow */}
          <div style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 800, height: 440, borderRadius: "50%",
            background: "radial-gradient(ellipse at 50% 40%, rgba(200,240,38,0.13) 0%, rgba(124,92,252,0.06) 50%, transparent 75%)",
            filter: "blur(2px)", pointerEvents: "none",
          }}/>

          {/* Welcome badge */}
          <FadeIn>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 500, color: "var(--sub)",
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: "var(--r-pill)", padding: "8px 18px",
              marginBottom: 28, boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              position: "relative", zIndex: 1,
            }}>
              <div style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#3dbb00",
                boxShadow: "0 0 6px rgba(61,187,0,0.5)",
                animation: "pulse 2s infinite",
              }}/>
              Welcome back, {user.user_metadata?.full_name?.split(" ")[0] || "Trainer"}
            </div>
          </FadeIn>

          {/* Headline */}
          <FadeIn delay={80}>
            <h1 style={{
              fontSize: "clamp(40px, 5.5vw, 72px)",
              fontWeight: 800, color: "var(--text)",
              letterSpacing: "-0.03em", lineHeight: 1.05,
              maxWidth: 760, marginBottom: 16,
              position: "relative", zIndex: 1,
            }}>
              Ready to train today,{" "}
              <span style={{ color: "#3dbb00" }}>
                {user.user_metadata?.full_name?.split(" ")[0] || "Trainer"}?
              </span>
            </h1>
          </FadeIn>

          {/* Subtext */}
          <FadeIn delay={160}>
            <p style={{
              fontSize: 17, color: "var(--sub)", maxWidth: 460,
              lineHeight: 1.65, marginBottom: 36, fontWeight: 400,
              position: "relative", zIndex: 1,
            }}>
              Your dashboard is ready. Pick up where you left off or browse new tasks available today.
            </p>
          </FadeIn>

          {/* CTA buttons */}
          <FadeIn delay={240}>
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              flexWrap: "wrap", justifyContent: "center",
              position: "relative", zIndex: 1, marginBottom: 48,
            }}>
              <Link to="/dashboard#tasks/available">
                <button className="btn-hero-primary">
                  Browse Tasks
                  <div className="arrow-box"><Arrow size={16} color="#fff"/></div>
                </button>
              </Link>
              <Link to="/dashboard#overview">
                <button className="btn-hero-outline">
                  Go to Dashboard
                  <div className="arrow-box"><Arrow size={16} color="#555"/></div>
                </button>
              </Link>
            </div>
          </FadeIn>

          {/* Quick nav strip */}
          <FadeIn delay={320}>
            <div className="auth-quick-nav">
              {[
                { label: "Projects",    cta: "View Tasks →",      to: "/dashboard#tasks/available"  },
                { label: "Payments",    cta: "View Earnings →",   to: "/dashboard#payments/overview"},
                { label: "Assessments", cta: "Take a Test →",     to: "/dashboard#assessment"       },
                { label: "Profile",     cta: "Edit Profile →",    to: "/dashboard#profile/info"     },
              ].map(({ label, cta, to }) => (
                <Link to={to} key={label} className="auth-quick-nav-item">
                  <span className="auth-quick-nav-label">{label}</span>
                  <span className="auth-quick-nav-cta">{cta}</span>
                </Link>
              ))}
            </div>
          </FadeIn>
        </section>

      ) : (

        /* ══════════════════════════════════════
           LOGGED-OUT HERO (original)
        ══════════════════════════════════════ */
        <section className="hero">
          <div className="hero-orb"/>
          <div className="hero-orb-inner"/>

          <div className="hero-card-left">
            <div className="hero-card-icon">🎯</div>
            <div>
              <div className="hero-card-label">Total Earnings</div>
              <div className="hero-card-value">$4.2M+</div>
            </div>
          </div>

          <div className="hero-card-right">
            <div className="hero-card-right-title">Task Analytics</div>
            <div className="mini-chart">
              {BAR_HEIGHTS.map((h, i) => (
                <div key={i} className={`mini-bar${i >= 7 ? " hi" : ""}`} style={{ height:`${h}%` }}/>
              ))}
            </div>
          </div>

          <FadeIn>
            <div className="hero-badge">
              <div className="hero-badge-dot"/>
              Now hiring in 50+ countries
            </div>
          </FadeIn>

          <FadeIn delay={80}>
            <h1 className="hero-h1">
              Train the AI.<br/>
              Get Paid
              <span className="hero-h1-lime"> Fairly.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={160}>
            <p className="hero-sub">
              Lixeen connects skilled humans with AI labs that need real intelligence — for ranking, evaluation, safety, and beyond.
            </p>
          </FadeIn>

          <FadeIn delay={240}>
            <div className="hero-cta">
              <Link to="/sign-up">
                <button className="btn-hero-primary">
                  Start Earning Today
                  <div className="arrow-box"><Arrow size={16} color="#fff"/></div>
                </button>
              </Link>
              <Link to="/dashboard#tasks">
                <button className="btn-hero-outline">
                  Browse Open Tasks
                  <div className="arrow-box"><Arrow size={16} color="#555"/></div>
                </button>
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={320}>
            <div className="hero-stats">
              {[["$4.2M+","Paid Out"],["18,400+","Active Trainers"],["50+","Countries"],["240K+","Tasks Done"]].map(([v,l]) => (
                <div className="hero-stat" key={l}>
                  <div className="hero-stat-val">{v}</div>
                  <div className="hero-stat-lbl">{l}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>
      )}

      {/* ── MARQUEE ── */}
      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(([type, rate], i) => (
            <div className="marquee-item" key={i}>
              <span className="dot">·</span> {type} <span>{rate}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="divider"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Process</div>
            <div className="sec-head-row">
              <div>
                <h2 className="sec-h2">How Lixeen Works</h2>
                <p className="sec-sub">From signup to payout in three straightforward steps.</p>
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="how-grid">
              {[
                { n:"01", icon:"users",  title:"Create your profile",  desc:"Sign up and complete a short skill assessment. Tell us your specializations — NLP, code, safety, reasoning — and we match you to the right tasks." },
                { n:"02", icon:"cpu",    title:"Pick up tasks",         desc:"Browse your personalized task feed. Each task shows the reward rate, estimated time, difficulty, and deadline upfront. No surprises." },
                { n:"03", icon:"dollar", title:"Get paid reliably",     desc:"Submit your work. Once reviewed and accepted, earnings hit your balance within 24–48 hours. Withdraw anytime via bank transfer or PayPal." },
              ].map(cell => (
                <div className="how-cell" key={cell.n}>
                  <div className="how-num">Step {cell.n}</div>
                  <div className="how-icon-wrap"><I n={cell.icon} s={18} c="var(--sub)"/></div>
                  <div className="how-title">{cell.title}</div>
                  <div className="how-desc">{cell.desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── FEATURED TASKS ── */}
      <div className="divider"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-head-row">
              <div>
                <div className="sec-eyebrow">Open Tasks</div>
                <h2 className="sec-h2">Available Right Now</h2>
                <p className="sec-sub">A sample of what's live on the platform today.</p>
              </div>
              <Link to="/dashboard#tasks">
                <button className="btn-outline-dark">
                  View all tasks
                  <div className="arrow-box"><Arrow size={14} color="#555"/></div>
                </button>
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="tasks-grid">
              {FEATURED_TASKS.map((t, i) => (
                <Link to="/dashboard#tasks" key={i} style={{ textDecoration: "none" }}>
                  <div className="task-card">
                    <div className="task-card-top">
                      <div className="task-card-type">{t.type}</div>
                      <span className={`task-card-diff diff-${t.diff}`}>{t.diff}</span>
                    </div>
                    <div className="task-card-title">{t.title}</div>
                    <div className="task-card-bottom">
                      <div className="task-card-reward">{t.reward}</div>
                      <div className="task-card-dl">{t.dl}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div className="divider"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Platform</div>
            <h2 className="sec-h2">Built for Serious Trainers</h2>
            <p className="sec-sub">Everything you need to work efficiently, get paid fairly, and grow your reputation.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="features-grid">
              {[
                { icon:"bar",    title:"Performance Dashboard", desc:"Track your acceptance rate, average score, earnings, and rank across all task types. Know exactly where to improve.",      to:"/dashboard#overview"          },
                { icon:"dollar", title:"Transparent Pay Rates", desc:"Every task shows the reward upfront. No hidden deductions. Earnings hit your balance within 24–48h of acceptance.",       to:"/dashboard#payments"          },
                { icon:"shield", title:"W-2 & Tax Compliance",  desc:"Generate IRS-compliant W-2 statements directly from the platform. Built-in tools for tax filing season.",                to:"/dashboard#payments/tax"      },
                { icon:"zap",    title:"Level-Up System",       desc:"Complete tasks, earn badges, and climb trainer levels. Higher levels unlock better-paying tasks and priority queues.",    to:"/dashboard#tasks"             },
                { icon:"clock",  title:"Flexible Scheduling",   desc:"Work on your schedule. Tasks are asynchronous — no set hours, no minimum commitment. Pick up and pause anytime.",        to:"/dashboard#tasks/available"   },
                { icon:"globe",  title:"Global Payouts",        desc:"Bank transfer and PayPal supported in 50+ countries. Set your payout schedule — manual, bi-weekly, or monthly.",        to:"/dashboard#payments/methods"  },
              ].map(f => (
                <Link to={f.to} key={f.title} style={{ textDecoration: "none" }}>
                  <div className="feature-cell">
                    <div className="feature-icon-wrap"><I n={f.icon} s={18} c="var(--sub)"/></div>
                    <div className="feature-title">{f.title}</div>
                    <div className="feature-desc">{f.desc}</div>
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── TESTIMONIALS ── */}
      <div className="divider"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:40 }}>
              <div className="sec-eyebrow" style={{ display:"inline-flex" }}>Testimonials</div>
              <h2 className="sec-h2">What Trainers Are Saying</h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="testimonials-grid">
              {[
                { text:"I've tried three other platforms. Lixeen is the only one where the scoring rubrics actually make sense and the feedback is actionable. My acceptance rate went from 72% to 91% in two months.", name:"Jordan M.", role:"Level 3 Trainer · Nairobi", initials:"JM" },
                { text:"The W-2 feature alone saved me hours during tax season. Everything is in one place — earnings history, payout records, tax forms. I wish every gig platform worked this way.", name:"Amara K.", role:"Level 4 Trainer · Lagos", initials:"AK" },
                { text:"I work on code evaluation tasks between client projects. The pay is competitive and the platform is clean. Submissions reviewed within 24 hours — no waiting weeks to hear back.", name:"Siddharth P.", role:"Level 4 Trainer · Mumbai", initials:"SP" },
              ].map((t, i) => (
                <div className="testimonial-card" key={i}>
                  <div className="stars">{[1,2,3,4,5].map(s => <span key={s} className="star">★</span>)}</div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-av">{t.initials}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* ── FAQ ── */}
      <div className="divider"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:44 }}>
              <div className="sec-eyebrow" style={{ display:"inline-flex" }}>FAQ</div>
              <h2 className="sec-h2">Common Questions</h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}><FAQ/></FadeIn>
        </div>
      </div>

      {/* ── CTA BANNER ── */}
      <div className="cta-banner">
        <div className="cta-banner-glow"/>
        <FadeIn>
          <h2>Ready to Start <span>Training AI?</span></h2>
          <p>Join 18,400+ trainers earning from their expertise. Free to join — start today.</p>
          <div className="cta-actions">
            <Link to={user ? "/dashboard#tasks/available" : "/sign-up"}>
              <button className="btn-lime">
                {user ? "Browse Tasks" : "Create Free Account"}
                <div className="arrow-box"><Arrow size={16} color="#fff"/></div>
              </button>
            </Link>
            <Link to={user ? "/dashboard#overview" : "/dashboard#tasks/available"}>
              <button className="btn-outline-dark">
                {user ? "Go to Dashboard" : "Browse Open Tasks"}
                <div className="arrow-box"><Arrow size={14} color="#555"/></div>
              </button>
            </Link>
          </div>
        </FadeIn>
      </div>

      {/* ── FOOTER ── */}
      <Footer />
    </>
  );
}