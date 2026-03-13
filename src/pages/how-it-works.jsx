import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

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
  --sub:       #444444;
  --muted:     #888888;
  --accent:    #3dbb00;
  --lime:      #c8f026;
  --lime-dim:  rgba(61,187,0,0.09);
  --lime-glow: rgba(61,187,0,0.2);
  --purple:    #7c5cfc;
  --sans:      'Anek Devanagari', system-ui, sans-serif;
  --r-pill:    999px;
  --r-card:    16px;
  --r-sm:      8px;
}
html { scroll-behavior: smooth; overflow-x: hidden; }
body { font-family: var(--sans); color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

.btn-cta { display: inline-flex; align-items: center; gap: 0; font-family: var(--sans); font-size: 14px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border2); border-radius: var(--r-pill); background: transparent; color: var(--text); padding: 0 6px 0 20px; height: 42px; transition: background 0.2s, color 0.2s, border-color 0.2s; white-space: nowrap; }
.btn-cta .arrow-box { width: 30px; height: 30px; border-radius: 50%; background: var(--text); display: flex; align-items: center; justify-content: center; margin-left: 10px; flex-shrink: 0; transition: background 0.2s; }
.btn-cta:hover { background: var(--text); color: #fff; border-color: var(--text); }
.btn-cta:hover .arrow-box { background: #fff; }

/* ─── PAGE HERO ─── */
.page-hero { padding: 160px 40px 100px; text-align: center; position: relative; overflow: hidden; background: var(--bg); }
.page-hero-orb { position: absolute; top: -10%; left: 50%; transform: translateX(-50%); width: min(800px,130vw); height: min(400px,65vw); border-radius: 50%; background: radial-gradient(ellipse at 50% 60%, rgba(200,240,38,0.15) 0%, rgba(61,187,0,0.06) 40%, transparent 80%); pointer-events: none; }
.page-hero-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: var(--sub); background: #fff; border: 1px solid var(--border); border-radius: var(--r-pill); padding: 8px 18px; margin-bottom: 32px; position: relative; z-index: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.page-hero-h1 { font-size: clamp(44px, 6vw, 80px); font-weight: 800; color: var(--text); letter-spacing: -0.03em; line-height: 1.05; max-width: 820px; margin: 0 auto 20px; position: relative; z-index: 1; }
.page-hero-h1 span { color: var(--accent); }
.page-hero-sub { font-size: 17px; color: var(--sub); max-width: 520px; line-height: 1.65; margin: 0 auto 48px; font-weight: 400; position: relative; z-index: 1; }
.page-hero-cta { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; justify-content: center; position: relative; z-index: 1; margin-bottom: 72px; }

.jump-links { display: flex; align-items: center; gap: 8px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
.jump-link { display: flex; align-items: center; gap: 6px; font-size: 12.5px; font-weight: 600; color: var(--sub); background: #fff; border: 1px solid var(--border); border-radius: var(--r-pill); padding: 7px 16px; cursor: pointer; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
.jump-link:hover { border-color: var(--accent); color: var(--accent); }

/* ─── MARQUEE ─── */
.marquee-wrap { overflow: hidden; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); background: var(--surface); padding: 16px 0; }
.marquee-track { display: flex; gap: 0; animation: marquee 32s linear infinite; width: max-content; }
.marquee-track:hover { animation-play-state: paused; }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.marquee-item { display: flex; align-items: center; gap: 10px; padding: 0 32px; border-right: 1px solid var(--border); font-size: 13px; font-weight: 600; color: var(--sub); white-space: nowrap; }
.marquee-item .dot { color: var(--accent); font-size: 18px; line-height: 1; }
.marquee-item span { color: var(--accent); font-weight: 700; }

/* ─── SECTION GLOBALS ─── */
.divider { height: 1px; background: var(--border); }
.section { padding: 100px 40px; max-width: 1200px; margin: 0 auto; }
.sec-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); background: var(--lime-dim); border: 1px solid var(--lime-glow); border-radius: var(--r-pill); padding: 5px 14px; margin-bottom: 20px; }
.sec-h2 { font-size: clamp(30px, 4vw, 48px); font-weight: 800; color: var(--text); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px; }
.sec-sub { font-size: 16px; color: var(--sub); max-width: 500px; line-height: 1.65; margin-bottom: 52px; }
.sec-head-row { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 40px; }

.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }

/* ─── STEPS ─── */
.steps-list { display: flex; flex-direction: column; gap: 0; }
.step-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0; border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden; margin-bottom: 12px; transition: border-color 0.2s; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
.step-row:hover { border-color: var(--border2); }
.step-row.flip { direction: rtl; }
.step-row.flip > * { direction: ltr; }
.step-content { background: #fff; padding: 52px 56px; display: flex; flex-direction: column; justify-content: center; }
.step-number { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent); margin-bottom: 20px; }
.step-icon-wrap { width: 52px; height: 52px; border: 1px solid var(--border); border-radius: 14px; background: var(--surface); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; }
.step-title { font-size: clamp(22px, 2.5vw, 30px); font-weight: 800; color: var(--text); letter-spacing: -0.02em; line-height: 1.15; margin-bottom: 14px; }
.step-desc { font-size: 15px; color: var(--sub); line-height: 1.7; margin-bottom: 24px; }
.step-bullets { display: flex; flex-direction: column; gap: 10px; }
.step-bullet { display: flex; align-items: flex-start; gap: 10px; font-size: 13.5px; color: var(--sub); line-height: 1.5; }
.step-bullet-dot { width: 18px; height: 18px; border-radius: 50%; flex-shrink: 0; margin-top: 1px; background: var(--lime-dim); border: 1px solid var(--lime-glow); display: flex; align-items: center; justify-content: center; }

.step-visual { background: var(--surface); padding: 40px; display: flex; align-items: center; justify-content: center; min-height: 380px; position: relative; overflow: hidden; }
.step-visual::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 50%, rgba(61,187,0,0.05) 0%, transparent 70%); }

/* Visual cards */
.vis-profile-card { background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); padding: 28px; width: 100%; max-width: 300px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); position: relative; z-index: 1; }
.vis-avatar { width: 52px; height: 52px; border-radius: 50%; background: linear-gradient(135deg, var(--purple), #c084fc); display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: 800; color: #fff; margin-bottom: 14px; }
.vis-name { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
.vis-role { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
.vis-skill-row { display: flex; flex-direction: column; gap: 10px; }
.vis-skill { display: flex; flex-direction: column; gap: 5px; }
.vis-skill-label { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--sub); }
.vis-skill-bar { height: 4px; background: var(--border); border-radius: 4px; overflow: hidden; }
.vis-skill-fill { height: 100%; border-radius: 4px; background: var(--accent); }
.vis-check-row { display: flex; align-items: center; gap: 8px; margin-top: 18px; padding-top: 18px; border-top: 1px solid var(--border); }
.vis-check-badge { display: inline-flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600; color: var(--accent); background: var(--lime-dim); border: 1px solid var(--lime-glow); border-radius: var(--r-pill); padding: 4px 10px; }

.vis-task-feed { display: flex; flex-direction: column; gap: 8px; width: 100%; max-width: 320px; position: relative; z-index: 1; }
.vis-task-item { background: #fff; border: 1px solid var(--border); border-radius: var(--r-sm); padding: 14px 16px; transition: border-color 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.vis-task-item:first-child { border-color: var(--accent); box-shadow: 0 0 0 1px var(--lime-glow); }
.vis-task-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.vis-task-type { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
.vis-task-diff { font-size: 10px; font-weight: 600; padding: 2px 8px; border-radius: var(--r-pill); }
.diff-easy   { background: rgba(61,187,0,0.1); color: var(--accent); border: 1px solid rgba(61,187,0,0.2); }
.diff-medium { background: rgba(200,110,0,0.08); color: #b06000; border: 1px solid rgba(200,110,0,0.18); }
.diff-hard   { background: rgba(200,40,40,0.08); color: #b03030; border: 1px solid rgba(200,40,40,0.18); }
.vis-task-title { font-size: 13px; font-weight: 600; color: var(--text); margin-bottom: 10px; line-height: 1.4; }
.vis-task-bottom { display: flex; justify-content: space-between; align-items: center; }
.vis-task-reward { font-size: 14px; font-weight: 800; color: var(--accent); }
.vis-task-dl { font-size: 11px; color: var(--muted); }

.vis-submit-card { background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); padding: 28px; width: 100%; max-width: 300px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); position: relative; z-index: 1; }
.vis-submit-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.vis-submit-sub { font-size: 12px; color: var(--muted); margin-bottom: 20px; }
.vis-rubric-row { display: flex; flex-direction: column; gap: 9px; margin-bottom: 20px; }
.vis-rubric-item { display: flex; justify-content: space-between; align-items: center; }
.vis-rubric-label { font-size: 12px; color: var(--sub); }
.vis-rubric-chips { display: flex; gap: 5px; }
.vis-chip { font-size: 10.5px; font-weight: 600; padding: 3px 9px; border-radius: var(--r-sm); border: 1.5px solid var(--border); background: var(--surface); color: var(--muted); }
.vis-chip.sel { background: var(--text); border-color: var(--text); color: #fff; }
.vis-submit-btn { width: 100%; height: 38px; border-radius: var(--r-sm); background: var(--text); border: none; font-family: var(--sans); font-size: 13px; font-weight: 700; color: #fff; cursor: pointer; }

.vis-earnings-card { background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); padding: 28px; width: 100%; max-width: 300px; box-shadow: 0 8px 32px rgba(0,0,0,0.08); position: relative; z-index: 1; }
.vis-earn-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 5px; }
.vis-earn-val { font-size: 36px; font-weight: 800; color: var(--accent); letter-spacing: -0.03em; margin-bottom: 4px; }
.vis-earn-period { font-size: 12px; color: var(--muted); margin-bottom: 22px; }
.vis-earn-chart { display: flex; align-items: flex-end; gap: 5px; height: 60px; margin-bottom: 20px; }
.vis-earn-bar { flex: 1; border-radius: 3px 3px 0 0; background: var(--border); }
.vis-earn-bar.hi { background: var(--text); }
.vis-payout-row { display: flex; align-items: center; justify-content: space-between; padding-top: 18px; border-top: 1px solid var(--border); }
.vis-payout-label { font-size: 12.5px; color: var(--sub); }
.vis-payout-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 700; color: #fff; background: var(--text); border: none; border-radius: var(--r-pill); padding: 6px 14px; cursor: pointer; }

/* ─── TASK TYPES ─── */
.types-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden; }
.type-cell { background: #fff; padding: 32px 28px; transition: background 0.2s; cursor: default; }
.type-cell:hover { background: var(--surface); }
.type-icon-wrap { width: 46px; height: 46px; border: 1px solid var(--border); border-radius: 12px; background: var(--surface); display: flex; align-items: center; justify-content: center; margin-bottom: 18px; }
.type-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.type-desc { font-size: 13.5px; color: var(--sub); line-height: 1.6; margin-bottom: 16px; }
.type-meta { display: flex; align-items: center; justify-content: space-between; }
.type-pay { font-size: 15px; font-weight: 800; color: var(--accent); }
.type-diff { font-size: 10.5px; font-weight: 600; padding: 3px 9px; border-radius: var(--r-pill); }

/* ─── FEATURES ─── */
.features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden; }
.feature-cell { background: #fff; padding: 36px 34px; transition: background 0.2s; }
.feature-cell:hover { background: var(--surface); }
.feature-icon-wrap { width: 44px; height: 44px; border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 18px; background: var(--surface); }
.feature-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 9px; }
.feature-desc { font-size: 14px; color: var(--sub); line-height: 1.65; }

/* ─── PAY TABLE ─── */
.pay-table { border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden; margin-top: 8px; box-shadow: 0 2px 12px rgba(0,0,0,0.04); }
.pay-table-head { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; background: var(--surface); border-bottom: 1px solid var(--border); padding: 12px 24px; }
.pay-table-hcell { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); }
.pay-table-row { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; padding: 18px 24px; border-bottom: 1px solid var(--border); background: #fff; transition: background 0.15s; align-items: center; }
.pay-table-row:last-child { border-bottom: none; }
.pay-table-row:hover { background: var(--surface); }
.pay-task { font-size: 14px; font-weight: 600; color: var(--text); }
.pay-rate { font-size: 15px; font-weight: 800; color: var(--accent); }
.pay-time { font-size: 13px; color: var(--sub); }
.pay-level { font-size: 10.5px; font-weight: 600; padding: 3px 9px; border-radius: var(--r-pill); background: var(--surface); border: 1px solid var(--border); color: var(--sub); display: inline-block; }

/* ─── TESTIMONIALS ─── */
.testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.testimonial-card { background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); padding: 26px 24px; transition: border-color 0.2s, box-shadow 0.2s; }
.testimonial-card:hover { border-color: var(--border2); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.stars { display: flex; gap: 2px; margin-bottom: 16px; }
.star { color: var(--accent); font-size: 13px; }
.testimonial-text { font-size: 14px; color: var(--sub); line-height: 1.7; margin-bottom: 20px; }
.testimonial-author { display: flex; align-items: center; gap: 12px; }
.testimonial-av { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, var(--purple), #c084fc); color: white; font-size: 12px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.testimonial-name { font-size: 13.5px; font-weight: 700; color: var(--text); }
.testimonial-role { font-size: 11.5px; color: var(--muted); }

/* ─── FAQ ─── */
.faq-list { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden; max-width: 740px; margin: 0 auto; }
.faq-item { border-bottom: 1px solid var(--border); background: #fff; }
.faq-item:last-child { border-bottom: none; }
.faq-q { display: flex; align-items: center; justify-content: space-between; padding: 20px 26px; cursor: pointer; font-size: 15px; font-weight: 600; color: var(--text); gap: 14px; user-select: none; transition: background 0.15s; }
.faq-q:hover { background: var(--surface); }
.faq-toggle { width: 24px; height: 24px; border: 1px solid var(--border); border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--sub); transition: background 0.15s; }
.faq-q:hover .faq-toggle { background: var(--surface2); }
.faq-a { padding: 0 26px 20px; font-size: 14px; color: var(--sub); line-height: 1.7; }

/* ─── CTA BANNER ─── */
.cta-banner { background: linear-gradient(135deg, #f0f9e6 0%, #f5f0ff 50%, #f0f9e6 100%); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 100px 40px; text-align: center; position: relative; overflow: hidden; }
.cta-banner-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: min(600px,100vw); height: min(300px,50vw); border-radius: 50%; background: radial-gradient(ellipse, rgba(61,187,0,0.12) 0%, transparent 70%); pointer-events: none; }
.cta-banner h2 { font-size: clamp(32px, 4.5vw, 54px); font-weight: 800; letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px; color: var(--text); position: relative; z-index: 1; }
.cta-banner h2 span { color: var(--accent); }
.cta-banner p { font-size: 16px; color: var(--sub); margin-bottom: 36px; max-width: 440px; margin-left: auto; margin-right: auto; line-height: 1.65; position: relative; z-index: 1; }
.cta-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }

.btn-lime { display: inline-flex; align-items: center; gap: 0; font-family: var(--sans); font-size: 15px; font-weight: 700; cursor: pointer; border: none; border-radius: var(--r-pill); background: var(--text); color: #fff; padding: 0 8px 0 26px; height: 52px; transition: opacity 0.2s; }
.btn-lime .arrow-box { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; margin-left: 14px; flex-shrink: 0; }
.btn-lime:hover { opacity: 0.85; }

.btn-outline-dark { display: inline-flex; align-items: center; gap: 0; font-family: var(--sans); font-size: 15px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border2); border-radius: var(--r-pill); background: #fff; color: var(--text); padding: 0 8px 0 26px; height: 52px; transition: border-color 0.2s, background 0.2s; }
.btn-outline-dark .arrow-box { width: 36px; height: 36px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin-left: 14px; flex-shrink: 0; }
.btn-outline-dark:hover { border-color: var(--sub); background: var(--surface); }

@media (max-width: 900px) {
  .step-row { grid-template-columns: 1fr; }
  .step-row.flip { direction: ltr; }
  .types-grid { grid-template-columns: 1fr 1fr; }
  .features-grid { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .pay-table-head, .pay-table-row { grid-template-columns: 1fr 1fr; }
  .pay-table-head > *:nth-child(3), .pay-table-head > *:nth-child(4),
  .pay-table-row  > *:nth-child(3), .pay-table-row  > *:nth-child(4) { display: none; }
}
@media (max-width: 600px) {
  .page-hero { padding: 110px 20px 72px; }
  .page-hero-h1 { font-size: clamp(34px,9vw,52px); max-width:100%; }
  .page-hero-sub { max-width:100%; font-size:15px; }
  .page-hero-cta { flex-direction:column; align-items:stretch; }
  .page-hero-cta > * { width:100%; justify-content:center; }
  .jump-links { gap:6px; }
  .jump-link { font-size:11px; padding:6px 12px; }
  .section { padding: 56px 20px; }
  .step-content { padding: 28px 20px; }
  .step-visual { min-height: 280px; padding: 24px 20px; }
  .step-title { font-size: clamp(20px, 6vw, 26px); }
  .vis-profile-card, .vis-submit-card, .vis-earnings-card { max-width: 100%; }
  .vis-task-feed { max-width: 100%; }
  .types-grid { grid-template-columns: 1fr; }
  .features-grid { grid-template-columns: 1fr; }
  .testimonials-grid { grid-template-columns: 1fr; }
  .pay-table-head, .pay-table-row { grid-template-columns: 1fr 1fr; padding: 14px 16px; }
  .pay-table-head > *:nth-child(3), .pay-table-head > *:nth-child(4),
  .pay-table-row > *:nth-child(3), .pay-table-row > *:nth-child(4) { display: none; }
  .pay-task { font-size: 12px; }
  .cta-banner { padding: 56px 20px; }
  .cta-banner h2 { font-size: clamp(26px,8vw,40px); }
  .cta-actions { flex-direction: column; align-items: stretch; }
  .cta-actions > * { width: 100%; justify-content: center; }
  .sec-head-row { flex-direction: column; align-items: flex-start; gap: 12px; }
}
`;

const Arrow = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const I = ({ n, s = 16, c = "currentColor" }) => {
  const paths = {
    check:    <polyline points="20 6 9 17 4 12"/>,
    zap:      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>,
    shield:   <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    bar:      <><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></>,
    dollar:   <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></>,
    users:    <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></>,
    globe:    <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></>,
    clock:    <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus:    <line x1="5" y1="12" x2="19" y2="12"/>,
    cpu:      <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>,
    edit:     <><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    star:     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    award:    <><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    list:     <><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></>,
    lock:     <><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[n]}</svg>;
};

function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } }, { threshold: 0.08 });
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
  const FAQS = [
    { q:"Do I need a background in AI or machine learning?", a:"Not at all. What we need is human judgment — careful reading, consistent reasoning, and attention to detail. Domain expertise in writing, coding, science, or other fields is valued, but you don't need to understand how AI models are built." },
    { q:"How long does it take to complete the skill assessment?", a:"Most trainers complete the onboarding assessment in 15–25 minutes. It covers basic comprehension, attention to detail, and optionally domain-specific mini-tasks if you're applying for specialized work like code evaluation." },
    { q:"Can I work part-time or casually?", a:"Yes. There's no minimum commitment. Tasks are asynchronous — you pick them up when you're available. Some trainers work a few hours a week, others full-time. The platform adapts to your schedule." },
    { q:"What happens if my submission is rejected?", a:"You'll receive written feedback explaining what didn't meet the rubric. Rejected tasks don't count against your account. Review the feedback, study the rubric, and try again — most trainers see their acceptance rate improve quickly." },
    { q:"How does the Level system work?", a:"You start at Level 1 with access to entry-level tasks. As you complete tasks and maintain a high acceptance rate, you earn XP and level up. Higher levels unlock better-paying tasks, priority queues, and exclusive project types." },
    { q:"Is my personal data kept private?", a:"Your individual submissions are shared with client companies anonymized — never attributed to you personally. Your personal information is never sold or shared with third parties. See our Privacy Policy for full details." },
  ];
  return (
    <div className="faq-list">
      {FAQS.map((f, i) => (
        <div className="faq-item" key={i}>
          <div className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
            {f.q}
            <div className="faq-toggle"><I n={open === i ? "minus" : "plus"} s={12} c="currentColor"/></div>
          </div>
          {open === i && <div className="faq-a">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

const MARQUEE_ITEMS = [
  ["NLP Ranking","$3.40/hr"],["Code Evaluation","$6.80/hr"],["Safety Labeling","$2.10/hr"],
  ["Fact Checking","$5.20/hr"],["Chain-of-Thought","$8.50/hr"],["Rewriting","$4.50/hr"],
  ["Sentiment Analysis","$2.80/hr"],["Hallucination Detection","$4.00/hr"],["Instruction Following","$5.60/hr"],
];

const EARN_BAR_HEIGHTS = [30, 45, 35, 55, 70, 50, 80, 65, 95, 100];

export default function HowItWorks() {
  return (
    <>
      <style>{G}</style>
      <Navbar />

      <section className="page-hero" id="top">
        <div className="page-hero-orb"/>
        <FadeIn>
          <div className="page-hero-badge">
            <I n="users" s={12} c="var(--accent)"/> For Trainers · Free to Join
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <h1 className="page-hero-h1">Everything you need to<br/><span>start earning</span> on Lixeen</h1>
        </FadeIn>
        <FadeIn delay={160}>
          <p className="page-hero-sub">From signing up to your first payout — here's exactly how it works, step by step.</p>
        </FadeIn>
        <FadeIn delay={240}>
          <div className="page-hero-cta">
            <Link to="/sign-up">
              <button className="btn-lime">Create Free Account<div className="arrow-box"><Arrow size={16} color="#fff"/></div></button>
            </Link>
            <button className="btn-outline-dark">Browse Open Tasks<div className="arrow-box"><Arrow size={16} color="#555"/></div></button>
          </div>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="jump-links">
            {[["Sign Up","#signup"],["Browse Tasks","#browse"],["Submit Work","#submit"],["Get Paid","#paid"],["Level Up","#level"]].map(([l,h]) => (
              <a key={l} href={h} className="jump-link">{l}</a>
            ))}
          </div>
        </FadeIn>
      </section>

      <div className="marquee-wrap">
        <div className="marquee-track">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map(([type, rate], i) => (
            <div className="marquee-item" key={i}><span className="dot">·</span> {type} <span>{rate}</span></div>
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      <div className="divider" id="signup"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="steps-list">
              <div className="step-row">
                <div className="step-content">
                  <div className="step-number">Step 01</div>
                  <div className="step-icon-wrap"><I n="users" s={20} c="var(--sub)"/></div>
                  <div className="step-title">Create your profile & pass the assessment</div>
                  <div className="step-desc">Sign up in under two minutes. Then complete a short skill assessment — it's how we match you to tasks where you'll perform best and earn the most.</div>
                  <div className="step-bullets">
                    {["Free to join — no application fee or commitment","Assessment takes 15–25 minutes on average","Tell us your specializations: NLP, code, safety, science, and more","Immediate access to your personalized task feed once approved"].map((b,i) => (
                      <div className="step-bullet" key={i}><div className="step-bullet-dot"><I n="check" s={9} c="var(--accent)"/></div><span>{b}</span></div>
                    ))}
                  </div>
                </div>
                <div className="step-visual">
                  <div className="vis-profile-card">
                    <div className="vis-avatar">JM</div>
                    <div className="vis-name">Jordan M.</div>
                    <div className="vis-role">Trainer · Nairobi, KE</div>
                    <div className="vis-skill-row">
                      {[["NLP & Text",88],["Code Review",74],["Fact Checking",91]].map(([label,pct]) => (
                        <div className="vis-skill" key={label}>
                          <div className="vis-skill-label"><span>{label}</span><span style={{ color:"var(--accent)", fontWeight:700 }}>{pct}%</span></div>
                          <div className="vis-skill-bar"><div className="vis-skill-fill" style={{ width:`${pct}%` }}/></div>
                        </div>
                      ))}
                    </div>
                    <div className="vis-check-row">
                      <div className="vis-check-badge"><I n="check" s={11} c="var(--accent)"/> Assessment Passed</div>
                      <span style={{ fontSize:11, color:"var(--muted)", marginLeft:"auto" }}>Just now</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* STEP 2 */}
      <div className="divider" id="browse"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div className="step-row flip">
              <div className="step-content">
                <div className="step-number">Step 02</div>
                <div className="step-icon-wrap"><I n="list" s={20} c="var(--sub)"/></div>
                <div className="step-title">Browse your personalized task feed</div>
                <div className="step-desc">Your feed surfaces tasks matched to your skills and level. Every task shows the reward rate, estimated time, difficulty, and deadline — upfront, no surprises.</div>
                <div className="step-bullets">
                  {["Filter by task type, difficulty, pay rate, and deadline","Task previews let you judge fit before committing","New tasks added daily across all specializations","Reserve a task to lock it in before you start"].map((b,i) => (
                    <div className="step-bullet" key={i}><div className="step-bullet-dot"><I n="check" s={9} c="var(--accent)"/></div><span>{b}</span></div>
                  ))}
                </div>
              </div>
              <div className="step-visual">
                <div className="vis-task-feed">
                  {[
                    { type:"Code Eval",  title:"Evaluate Python correctness — 20 functions",     reward:"$6.80/hr", diff:"hard",   dl:"18h left" },
                    { type:"Ranking",    title:"Rank GPT-4 responses for helpfulness (50 pairs)", reward:"$3.40/hr", diff:"easy",   dl:"2d left" },
                    { type:"Fact Check", title:"Rate factuality in long-form summaries",          reward:"$5.20/hr", diff:"medium", dl:"1d left" },
                  ].map((t,i) => (
                    <div className="vis-task-item" key={i}>
                      <div className="vis-task-top"><span className="vis-task-type">{t.type}</span><span className={`vis-task-diff diff-${t.diff}`}>{t.diff}</span></div>
                      <div className="vis-task-title">{t.title}</div>
                      <div className="vis-task-bottom"><span className="vis-task-reward">{t.reward}</span><span className="vis-task-dl">{t.dl}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* STEP 3 */}
      <div className="divider" id="submit"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="step-row">
              <div className="step-content">
                <div className="step-number">Step 03</div>
                <div className="step-icon-wrap"><I n="edit" s={20} c="var(--sub)"/></div>
                <div className="step-title">Read, evaluate, and submit your rating</div>
                <div className="step-desc">Each task gives you a clear rubric. Read the prompt and both responses carefully, rate across structured criteria, leave a comment, and submit.</div>
                <div className="step-bullets">
                  {["Structured rubrics take the guesswork out of evaluation","A timer tracks your session — you set your own pace","Flag problematic content with one click for QA review","Submissions reviewed within 24–48 hours with written feedback"].map((b,i) => (
                    <div className="step-bullet" key={i}><div className="step-bullet-dot"><I n="check" s={9} c="var(--accent)"/></div><span>{b}</span></div>
                  ))}
                </div>
              </div>
              <div className="step-visual">
                <div className="vis-submit-card">
                  <div className="vis-submit-title">Rate the Responses</div>
                  <div className="vis-submit-sub">4/6 answered · 0% complete</div>
                  <div className="vis-rubric-row">
                    {[{ label:"Overall Preference", sel:"A" },{ label:"Instruction Following", sel:"B" },{ label:"Correctness", sel:"A" },{ label:"Clarity", sel:null }].map(({ label, sel }) => (
                      <div className="vis-rubric-item" key={label}>
                        <span className="vis-rubric-label">{label}</span>
                        <div className="vis-rubric-chips">
                          <span className={`vis-chip${sel==="A"?" sel":""}`}>A</span>
                          <span className={`vis-chip${sel==="B"?" sel":""}`}>B</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="vis-submit-btn">Submit Rating</button>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* STEP 4 */}
      <div className="divider" id="paid"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div className="step-row flip">
              <div className="step-content">
                <div className="step-number">Step 04</div>
                <div className="step-icon-wrap"><I n="dollar" s={20} c="var(--sub)"/></div>
                <div className="step-title">Get paid reliably, withdraw anytime</div>
                <div className="step-desc">Once your submission is accepted, earnings appear in your balance within 24–48 hours. Request a payout whenever you're ready — no waiting periods, no lock-ins.</div>
                <div className="step-bullets">
                  {["Earnings credited within 24–48h of acceptance","Bank transfer and PayPal in 50+ countries","$10 minimum withdrawal threshold","W-2 / tax documents generated directly from the platform"].map((b,i) => (
                    <div className="step-bullet" key={i}><div className="step-bullet-dot"><I n="check" s={9} c="var(--accent)"/></div><span>{b}</span></div>
                  ))}
                </div>
              </div>
              <div className="step-visual">
                <div className="vis-earnings-card">
                  <div className="vis-earn-label">This Month</div>
                  <div className="vis-earn-val">$2,841</div>
                  <div className="vis-earn-period">March 2025 · 247 tasks</div>
                  <div className="vis-earn-chart">
                    {EARN_BAR_HEIGHTS.map((h,i) => (
                      <div key={i} className={`vis-earn-bar${i>=8?" hi":""}`} style={{ height:`${h}%` }}/>
                    ))}
                  </div>
                  <div className="vis-payout-row">
                    <div>
                      <div className="vis-earn-label" style={{ marginBottom:2 }}>Available Balance</div>
                      <div style={{ fontSize:18, fontWeight:800, color:"var(--text)" }}>$2,841.00</div>
                    </div>
                    <button className="vis-payout-btn"><Arrow size={13} color="#fff"/> Withdraw</button>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      {/* TASK TYPES */}
      <div className="divider"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Task Types</div>
            <div className="sec-head-row"><div><h2 className="sec-h2">What kind of work is it?</h2><p className="sec-sub">Six categories of tasks, ranging from simple preference rankings to expert code evaluation.</p></div></div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="types-grid">
              {[
                { icon:"bar",     title:"Response Ranking",      desc:"Compare two AI responses and select your preferred one across structured criteria. The most common task type — great for getting started.", pay:"$2–4/hr",  diff:"easy" },
                { icon:"check",   title:"Fact Checking",         desc:"Verify factual claims in AI-generated text against known sources. Flag hallucinations, inaccuracies, or unsupported statements.", pay:"$4–6/hr",  diff:"medium" },
                { icon:"cpu",     title:"Code Evaluation",       desc:"Assess the correctness, efficiency, and style of Python, JavaScript, or other code. Requires programming knowledge.", pay:"$6–10/hr", diff:"hard" },
                { icon:"shield",  title:"Safety Labeling",       desc:"Identify harmful, biased, or policy-violating content. Requires careful judgment and adherence to detailed guidelines.", pay:"$2–4/hr",  diff:"easy" },
                { icon:"edit",    title:"Rewriting",             desc:"Improve ambiguous prompts or model instructions to be clearer, more precise, and more effective. Tests your writing quality.", pay:"$3–6/hr",  diff:"medium" },
                { icon:"trending",title:"Reasoning Evaluation",  desc:"Score chain-of-thought responses for logical consistency and correctness. Our highest-paying category.", pay:"$7–12/hr", diff:"hard" },
              ].map(t => (
                <div className="type-cell" key={t.title}>
                  <div className="type-icon-wrap"><I n={t.icon} s={19} c="var(--sub)"/></div>
                  <div className="type-title">{t.title}</div>
                  <div className="type-desc">{t.desc}</div>
                  <div className="type-meta"><span className="type-pay">{t.pay}</span><span className={`type-diff diff-${t.diff}`}>{t.diff}</span></div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* PAY TABLE */}
      <div className="divider"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Earnings</div>
            <h2 className="sec-h2">What can you expect to earn?</h2>
            <p className="sec-sub">Pay varies by task type and difficulty. Here's a realistic sample of live rates.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="pay-table">
              <div className="pay-table-head">
                {["Task Type","Rate","Avg. Time","Min. Level"].map(h => <div className="pay-table-hcell" key={h}>{h}</div>)}
              </div>
              {[
                { task:"Safety Labeling (40-item batch)",        rate:"$2.10/hr", time:"8 min/task",  level:"Level 1" },
                { task:"NLP Response Ranking (50 pairs)",        rate:"$3.40/hr", time:"5 min/task",  level:"Level 1" },
                { task:"Rewrite ambiguous instructions",         rate:"$4.50/hr", time:"10 min/task", level:"Level 2" },
                { task:"Fact-checking long-form summaries",      rate:"$5.20/hr", time:"12 min/task", level:"Level 2" },
                { task:"Python code correctness (20 functions)", rate:"$6.80/hr", time:"15 min/task", level:"Level 3" },
                { task:"Chain-of-thought reasoning evaluation",  rate:"$8.50/hr", time:"18 min/task", level:"Level 4" },
              ].map(r => (
                <div className="pay-table-row" key={r.task}>
                  <div className="pay-task">{r.task}</div>
                  <div className="pay-rate">{r.rate}</div>
                  <div className="pay-time">{r.time}</div>
                  <div><span className="pay-level">{r.level}</span></div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* LEVEL UP */}
      <div className="divider" id="level"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Progression</div>
            <h2 className="sec-h2">Grow your rank. Earn more.</h2>
            <p className="sec-sub">A four-level system that rewards quality and consistency with access to better tasks and higher pay.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="features-grid">
              {[
                { icon:"star",   title:"Level 1 — Starter",     desc:"Access to entry-level ranking and safety tasks. Build your acceptance rate and earn XP toward Level 2. Most trainers reach Level 2 within their first two weeks." },
                { icon:"zap",    title:"Level 2 — Contributor", desc:"Unlocks fact-checking and rewriting tasks. Eligible for priority queues during high-demand periods. Average Level 2 trainer earns $800–1,400/month." },
                { icon:"award",  title:"Level 3 — Expert",      desc:"Access to code evaluation and specialized science tasks. Invite-only projects from premium clients. Average Level 3 trainer earns $1,600–2,800/month." },
                { icon:"shield", title:"Level 4 — Master",      desc:"Highest-paying tasks including reasoning evaluation and model fine-tuning projects. Top Lixeen earners at this level bring in $3,000–5,000+ monthly." },
              ].map(f => (
                <div className="feature-cell" key={f.title}>
                  <div className="feature-icon-wrap"><I n={f.icon} s={18} c="var(--sub)"/></div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* PLATFORM FEATURES */}
      <div className="divider"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Platform</div>
            <h2 className="sec-h2">Built for serious trainers</h2>
            <p className="sec-sub">Every feature designed to help you work efficiently, get paid fairly, and improve over time.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="features-grid">
              {[
                { icon:"bar",     title:"Performance Dashboard",  desc:"Track acceptance rate, average score, earnings, and level across all task types. See exactly where to improve." },
                { icon:"clock",   title:"Flexible Scheduling",    desc:"No set hours, no minimum commitment. Tasks are async — pick up and pause whenever you want, from wherever you are." },
                { icon:"lock",    title:"Transparent Rubrics",    desc:"Every task includes a detailed rubric before you start. No ambiguity, no guesswork — you know exactly what's expected." },
                { icon:"dollar",  title:"Fast, Reliable Payouts", desc:"Earnings credited within 24–48h of acceptance. Withdraw anytime via bank transfer or PayPal, $10 minimum." },
                { icon:"globe",   title:"Global Availability",    desc:"Available in 50+ countries. Multiple payout currencies supported. Localized tax tools included." },
                { icon:"trending",title:"Actionable Feedback",    desc:"Every rejection comes with written feedback from our QA team so you understand exactly how to improve your next submission." },
              ].map(f => (
                <div className="feature-cell" key={f.title}>
                  <div className="feature-icon-wrap"><I n={f.icon} s={18} c="var(--sub)"/></div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="divider"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:40 }}>
              <div className="sec-eyebrow" style={{ display:"inline-flex" }}>Testimonials</div>
              <h2 className="sec-h2">What trainers are saying</h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="testimonials-grid">
              {[
                { text:"I've tried three other platforms. Lixeen is the only one where the scoring rubrics actually make sense and the feedback is actionable. My acceptance rate went from 72% to 91% in two months.", name:"Jordan M.", role:"Level 3 Trainer · Nairobi", initials:"JM" },
                { text:"The W-2 feature alone saved me hours during tax season. Everything is in one place — earnings history, payout records, tax forms. I wish every gig platform worked this way.", name:"Amara K.", role:"Level 4 Trainer · Lagos", initials:"AK" },
                { text:"I work on code evaluation tasks between client projects. The pay is competitive and the platform is clean. Submissions reviewed within 24 hours — no waiting weeks to hear back.", name:"Siddharth P.", role:"Level 4 Trainer · Mumbai", initials:"SP" },
              ].map((t,i) => (
                <div className="testimonial-card" key={i}>
                  <div className="stars">{[1,2,3,4,5].map(s => <span key={s} className="star">★</span>)}</div>
                  <p className="testimonial-text">"{t.text}"</p>
                  <div className="testimonial-author">
                    <div className="testimonial-av">{t.initials}</div>
                    <div><div className="testimonial-name">{t.name}</div><div className="testimonial-role">{t.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      {/* FAQ */}
      <div className="divider"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:44 }}>
              <div className="sec-eyebrow" style={{ display:"inline-flex" }}>FAQ</div>
              <h2 className="sec-h2">Common questions</h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}><FAQ/></FadeIn>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-banner">
        <div className="cta-banner-glow"/>
        <FadeIn>
          <h2>Ready to <span>get started?</span></h2>
          <p>Free to join. No commitment. Your first task could be live in under 30 minutes.</p>
          <div className="cta-actions">
            <Link to="/sign-up">
              <button className="btn-lime">Create Free Account<div className="arrow-box"><Arrow size={16} color="#fff"/></div></button>
            </Link>
            <button className="btn-outline-dark">Browse Open Tasks<div className="arrow-box"><Arrow size={16} color="#555"/></div></button>
          </div>
        </FadeIn>
      </div>

      <Footer />
    </>
  );
}