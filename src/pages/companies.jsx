import { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from '../components/footer';

const G = `
@import url('https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@300;400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:#ffffff; --surface:#f7f7f7; --surface2:#efefef;
  --border:#e5e5e5; --border2:#dddddd;
  --text:#0a0a0a; --sub:#444444; --muted:#888888;
  --accent:#3dbb00; --lime:#c8f026; --lime-dim:rgba(61,187,0,0.09); --lime-glow:rgba(61,187,0,0.2);
  --purple:#7c5cfc;
  --sans:'Anek Devanagari',system-ui,sans-serif;
  --r-pill:999px; --r-card:16px; --r-sm:8px;
}
html{scroll-behavior:smooth;}
body{font-family:var(--sans);color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}

/* ─── BUTTONS ─── */
.btn-lime{display:inline-flex;align-items:center;font-family:var(--sans);font-size:15px;font-weight:700;cursor:pointer;border:none;border-radius:var(--r-pill);background:var(--text);color:#fff;padding:0 8px 0 26px;height:52px;transition:opacity 0.2s;white-space:nowrap;}
.btn-lime .arrow-box{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;margin-left:14px;flex-shrink:0;}
.btn-lime:hover{opacity:0.85;}
.btn-lime-lg{display:inline-flex;align-items:center;font-family:var(--sans);font-size:16px;font-weight:700;cursor:pointer;border:none;border-radius:var(--r-pill);background:var(--text);color:#fff;padding:0 10px 0 32px;height:60px;transition:opacity 0.2s;white-space:nowrap;}
.btn-lime-lg .arrow-box{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;margin-left:16px;flex-shrink:0;}
.btn-lime-lg:hover{opacity:0.85;}
.btn-outline-dark{display:inline-flex;align-items:center;font-family:var(--sans);font-size:15px;font-weight:600;cursor:pointer;border:1.5px solid var(--border2);border-radius:var(--r-pill);background:#fff;color:var(--text);padding:0 8px 0 26px;height:52px;transition:border-color 0.2s,background 0.2s;white-space:nowrap;}
.btn-outline-dark .arrow-box{width:36px;height:36px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin-left:14px;flex-shrink:0;}
.btn-outline-dark:hover{border-color:var(--sub);background:var(--surface);}

/* ─── SHARED ─── */
.section{padding:100px 40px;max-width:1200px;margin:0 auto;}
.divider{height:1px;background:var(--border);}
.sec-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);background:var(--lime-dim);border:1px solid var(--lime-glow);border-radius:var(--r-pill);padding:5px 14px;margin-bottom:20px;}
.sec-h2{font-size:clamp(32px,4.5vw,52px);font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1.08;margin-bottom:16px;}
.sec-sub{font-size:16px;color:var(--sub);max-width:500px;line-height:1.65;margin-bottom:48px;}
.sec-head-row{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:36px;flex-wrap:wrap;gap:20px;}
.fade-in{opacity:0;transform:translateY(20px);transition:opacity 0.55s ease,transform 0.55s ease;}
.fade-in.visible{opacity:1;transform:translateY(0);}

/* ─── HERO ─── */
.hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:140px 40px 100px;position:relative;overflow:hidden;background:var(--bg);}
.hero-orb{position:absolute;bottom:-15%;left:50%;transform:translateX(-50%);width:1000px;height:560px;border-radius:50%;background:radial-gradient(ellipse at 50% 40%,rgba(200,240,38,0.18) 0%,rgba(61,187,0,0.06) 45%,transparent 80%);filter:blur(2px);pointer-events:none;}
.hero-orb-inner{position:absolute;bottom:-18%;left:50%;transform:translateX(-50%);width:640px;height:360px;border-radius:50%;background:radial-gradient(ellipse at 50% 30%,rgba(124,92,252,0.08) 0%,transparent 80%);pointer-events:none;}

.float-card{position:absolute;z-index:2;background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:18px 22px;box-shadow:0 8px 32px rgba(0,0,0,0.08);}
.float-card-left{left:3%;top:28%;animation:floatL 7s ease-in-out infinite;}
.float-card-right{right:2%;top:24%;animation:floatR 8s ease-in-out infinite;}
.float-card-bot-right{right:5%;bottom:16%;animation:floatL 9s ease-in-out infinite 1s;}
@keyframes floatL{0%,100%{transform:translateY(0);}50%{transform:translateY(-12px);}}
@keyframes floatR{0%,100%{transform:translateY(0);}50%{transform:translateY(-10px);}}
.fc-label{font-size:11px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:6px;}
.fc-value{font-size:22px;font-weight:800;color:var(--text);margin-bottom:4px;}
.fc-sub{font-size:12px;color:var(--sub);}
.fc-lime{color:var(--accent);}
.fc-row{display:flex;align-items:center;gap:10px;}
.fc-icon{width:40px;height:40px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:20px;}
.fc-icon-blue{background:linear-gradient(135deg,#4f83f5,#7c5cfc);}
.fc-icon-lime{background:linear-gradient(135deg,#a0c020,var(--lime));}
.fc-icon-orange{background:linear-gradient(135deg,#f5a623,#f55f23);}

.hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--sub);background:#fff;border:1px solid var(--border);border-radius:var(--r-pill);padding:8px 20px;margin-bottom:32px;position:relative;z-index:1;box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.hero-badge-dot{width:7px;height:7px;border-radius:50%;background:var(--accent);box-shadow:0 0 6px var(--accent);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.8);}}
.hero-h1{font-size:clamp(52px,7vw,96px);font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1.0;max-width:960px;margin-bottom:10px;position:relative;z-index:1;}
.hero-h1-lime{color:var(--accent);}
.hero-sub{font-size:18px;color:var(--sub);max-width:520px;line-height:1.65;margin-bottom:44px;font-weight:400;position:relative;z-index:1;}
.hero-cta{display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:center;position:relative;z-index:1;margin-bottom:80px;}

.logo-strip{display:flex;align-items:center;gap:0;border:1px solid var(--border);border-radius:var(--r-card);background:#fff;overflow:hidden;position:relative;z-index:1;box-shadow:0 2px 12px rgba(0,0,0,0.05);}
.logo-strip-label{padding:16px 24px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);border-right:1px solid var(--border);white-space:nowrap;}
.logo-strip-logos{display:flex;align-items:center;flex:1;}
.logo-item{padding:16px 28px;border-right:1px solid var(--border);font-size:14px;font-weight:700;color:var(--muted);white-space:nowrap;transition:color 0.2s;}
.logo-item:last-child{border-right:none;}
.logo-item:hover{color:var(--sub);}

/* ─── STATS BAND ─── */
.stats-band{background:var(--surface);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:0;}
.stats-band-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);}
.stat-cell{padding:40px 32px;text-align:center;border-right:1px solid var(--border);}
.stat-cell:last-child{border-right:none;}
.stat-val{font-size:42px;font-weight:800;color:var(--accent);letter-spacing:-0.04em;line-height:1;margin-bottom:8px;}
.stat-lbl{font-size:13px;color:var(--sub);font-weight:500;}

/* ─── HOW IT WORKS ─── */
.how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--border);border:1px solid var(--border);border-radius:var(--r-card);overflow:hidden;}
.how-cell{background:#fff;padding:36px 32px;position:relative;transition:background 0.2s;}
.how-cell:hover{background:var(--surface);}
.how-num{font-size:11px;font-weight:700;color:var(--accent);margin-bottom:20px;letter-spacing:0.1em;text-transform:uppercase;}
.how-icon-wrap{width:46px;height:46px;border:1px solid var(--border);border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;background:var(--surface);}
.how-title{font-size:17px;font-weight:700;color:var(--text);margin-bottom:10px;}
.how-desc{font-size:14px;color:var(--sub);line-height:1.65;}

/* ─── SOLUTIONS ─── */
.solutions-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;}
.solution-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:32px;position:relative;overflow:hidden;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;cursor:default;}
.solution-card:hover{border-color:var(--border2);transform:translateY(-3px);box-shadow:0 8px 24px rgba(0,0,0,0.07);}
.solution-card.featured{grid-column:1/-1;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;background:linear-gradient(135deg,#f0f9e6 0%,#f5fbf0 60%,#fff 100%);border-color:var(--lime-glow);}
.solution-icon{width:52px;height:52px;border-radius:14px;display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:24px;border:1px solid var(--border);background:var(--surface);}
.solution-title{font-size:20px;font-weight:700;color:var(--text);margin-bottom:10px;}
.solution-desc{font-size:14px;color:var(--sub);line-height:1.65;margin-bottom:18px;}
.solution-tags{display:flex;flex-wrap:wrap;gap:6px;}
.solution-tag{font-size:11px;font-weight:600;padding:4px 10px;border-radius:var(--r-pill);background:var(--surface);border:1px solid var(--border);color:var(--muted);}
.solution-card.featured .solution-tag{background:var(--lime-dim);border-color:var(--lime-glow);color:var(--accent);}

.featured-visual{background:#fff;border:1px solid var(--border);border-radius:12px;padding:20px;position:relative;z-index:1;box-shadow:0 4px 16px rgba(0,0,0,0.06);}
.featured-visual-header{font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:16px;}
.perf-row{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;}
.perf-label{font-size:13px;color:var(--sub);}
.perf-bar-wrap{flex:1;height:6px;background:var(--border);border-radius:3px;margin:0 14px;overflow:hidden;}
.perf-bar{height:100%;border-radius:3px;background:var(--accent);}
.perf-val{font-size:13px;font-weight:700;color:var(--accent);}

/* ─── PRICING ─── */
.pricing-custom-wrap{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:stretch;}
.pricing-includes{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:40px;box-shadow:0 2px 12px rgba(0,0,0,0.04);}
.pricing-includes-title{font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);margin-bottom:28px;}
.pricing-includes-items{display:flex;flex-direction:column;gap:0;}
.pricing-include-row{display:flex;align-items:flex-start;gap:14px;padding:18px 0;border-bottom:1px solid var(--border);}
.pricing-include-row:last-child{border-bottom:none;}
.pricing-include-check{width:20px;height:20px;border-radius:50%;flex-shrink:0;margin-top:1px;background:var(--lime-dim);border:1px solid var(--lime-glow);display:flex;align-items:center;justify-content:center;}
.pricing-include-label{font-size:14px;font-weight:600;color:var(--text);margin-bottom:3px;}
.pricing-include-sub{font-size:12px;color:var(--muted);line-height:1.5;}

.pricing-contact-card{background:linear-gradient(160deg,#f0f9e6 0%,#f5fbf2 50%,#fff 100%);border:1px solid var(--lime-glow);border-radius:var(--r-card);padding:40px;display:flex;flex-direction:column;}
.pricing-contact-eyebrow{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--accent);margin-bottom:12px;}
.pricing-contact-title{font-size:clamp(22px,2.5vw,30px);font-weight:800;color:var(--text);letter-spacing:-0.025em;line-height:1.15;margin-bottom:10px;}
.pricing-contact-sub{font-size:14px;color:var(--sub);line-height:1.65;margin-bottom:28px;}
.pricing-form{display:flex;flex-direction:column;gap:12px;flex:1;}
.pricing-form-row{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.pricing-input,.pricing-select,.pricing-textarea{width:100%;background:#fff;border:1px solid var(--border);border-radius:var(--r-sm);color:var(--text);font-family:var(--sans);font-size:13.5px;font-weight:500;padding:11px 14px;outline:none;transition:border-color 0.2s;}
.pricing-input:focus,.pricing-select:focus,.pricing-textarea:focus{border-color:var(--accent);}
.pricing-input::placeholder,.pricing-textarea::placeholder{color:var(--muted);}
.pricing-select{appearance:none;cursor:pointer;}
.pricing-textarea{resize:vertical;min-height:90px;}
.pricing-submit{display:inline-flex;align-items:center;justify-content:space-between;font-family:var(--sans);font-size:15px;font-weight:700;cursor:pointer;border:none;border-radius:var(--r-pill);background:var(--text);color:#fff;padding:0 8px 0 26px;height:52px;transition:opacity 0.2s;margin-top:4px;}
.pricing-submit .arrow-box{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;margin-left:14px;flex-shrink:0;}
.pricing-submit:hover{opacity:0.85;}
.pricing-success{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:12px;}
.pricing-success-icon{font-size:44px;}
.pricing-success-title{font-size:20px;font-weight:800;color:var(--text);}
.pricing-success-sub{font-size:14px;color:var(--sub);line-height:1.6;}

/* ─── TESTIMONIALS ─── */
.testimonials-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;}
.testimonial-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:28px 26px;transition:border-color 0.2s,box-shadow 0.2s;}
.testimonial-card:hover{border-color:var(--border2);box-shadow:0 4px 16px rgba(0,0,0,0.06);}
.quote-mark{font-size:48px;color:var(--accent);line-height:1;margin-bottom:12px;font-weight:800;}
.testimonial-text{font-size:14px;color:var(--sub);line-height:1.75;margin-bottom:24px;}
.testimonial-author{display:flex;align-items:center;gap:12px;}
.testimonial-av{width:40px;height:40px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,var(--purple),#c084fc);color:white;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;}
.testimonial-name{font-size:14px;font-weight:700;color:var(--text);}
.testimonial-role{font-size:12px;color:var(--muted);}
.testimonial-company{font-size:11px;color:var(--accent);font-weight:600;margin-top:1px;}

/* ─── FAQ ─── */
.faq-list{display:flex;flex-direction:column;border:1px solid var(--border);border-radius:var(--r-card);overflow:hidden;max-width:780px;margin:0 auto;}
.faq-item{border-bottom:1px solid var(--border);background:#fff;}
.faq-item:last-child{border-bottom:none;}
.faq-q{display:flex;align-items:center;justify-content:space-between;padding:20px 26px;cursor:pointer;font-size:15px;font-weight:600;color:var(--text);gap:14px;user-select:none;transition:background 0.15s;}
.faq-q:hover{background:var(--surface);}
.faq-toggle{width:24px;height:24px;border:1px solid var(--border);border-radius:50%;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:var(--sub);}
.faq-a{padding:0 26px 20px;font-size:14px;color:var(--sub);line-height:1.7;}

/* ─── CTA BANNER ─── */
.cta-banner{background:linear-gradient(135deg,#f0f9e6 0%,#f5f0ff 50%,#f0f9e6 100%);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:100px 40px;text-align:center;position:relative;overflow:hidden;}
.cta-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:700px;height:350px;border-radius:50%;background:radial-gradient(ellipse,rgba(61,187,0,0.12) 0%,transparent 70%);pointer-events:none;}
.cta-banner h2{font-size:clamp(36px,5vw,64px);font-weight:800;letter-spacing:-0.03em;line-height:1.08;margin-bottom:18px;color:var(--text);position:relative;z-index:1;}
.cta-banner h2 span{color:var(--accent);}
.cta-banner p{font-size:17px;color:var(--sub);margin-bottom:40px;max-width:480px;margin-left:auto;margin-right:auto;line-height:1.65;position:relative;z-index:1;}
.cta-actions{display:flex;gap:14px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;}

@media(max-width:900px){
  .solutions-grid{grid-template-columns:1fr;}
  .solution-card.featured{grid-column:auto;grid-template-columns:1fr;}
  .featured-visual{display:none;}
  .stats-band-inner{grid-template-columns:repeat(2,1fr);}
  .stat-cell:nth-child(2){border-right:none;}
  .pricing-custom-wrap{grid-template-columns:1fr;}
  .testimonials-grid{grid-template-columns:1fr;}
  .how-grid{grid-template-columns:1fr;}
}
@media(max-width:768px){
  .hero{padding:110px 20px 80px;}
  .hero-h1{font-size:clamp(40px,10vw,62px);}
  .hero-cta{flex-direction:column;align-items:stretch;}
  .hero-cta>*{width:100%;justify-content:center;}
  .float-card{display:none;}
  .section{padding:64px 20px;}
  .cta-banner{padding:64px 20px;}
  .cta-actions{flex-direction:column;align-items:stretch;}
  .cta-actions>*{width:100%;justify-content:center;}
  .pricing-form-row{grid-template-columns:1fr;}
}
@media(max-width:480px){
  .stats-band-inner{grid-template-columns:1fr;}
  .stat-cell{border-right:none!important;border-bottom:1px solid var(--border);}
  .stat-cell:last-child{border-bottom:none;}
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
    layers:   <><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></>,
    cpu:      <><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></>,
    plus:     <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    minus:    <line x1="5" y1="12" x2="19" y2="12"/>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
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
    { q:"How quickly can we get started?", a:"Most companies have active trainers within 24–48 hours of signing a contract. We handle skill assessments, onboarding, and quality calibration — you just share your task requirements and rubrics." },
    { q:"How do you ensure annotation quality?", a:"Every trainer is assessed before accessing tasks. We use inter-annotator agreement scoring, automatic outlier detection, and human QA review at configurable sampling rates (default 10%). You get full audit trails." },
    { q:"Can we use our own rubrics and guidelines?", a:"Yes — and we recommend it. You upload your guidelines, we run calibration tasks with your team, and trainers are locked to your rubric. Most teams see >92% rubric adherence within the first batch." },
    { q:"How is our data handled?", a:"All data is encrypted in transit and at rest. Trainers sign NDAs and operate in access-controlled environments. We support SOC 2 Type II, GDPR, and HIPAA-compliant workflows on Enterprise plans." },
    { q:"Do you support multimodal tasks?", a:"Yes — text, code, image description, audio transcription, video annotation, and structured data labeling are all supported. Complex multimodal tasks are matched to trainers with verified domain skills." },
    { q:"What's included in the dedicated account manager?", a:"Your AM handles onboarding, monitors quality metrics daily, flags anomalies before you notice them, and is reachable via Slack. They're your single point of contact for everything." },
  ];
  return (
    <div className="faq-list">
      {FAQS.map((f,i) => (
        <div className="faq-item" key={i}>
          <div className="faq-q" onClick={() => setOpen(open===i ? null : i)}>
            {f.q}<div className="faq-toggle"><I n={open===i?"minus":"plus"} s={12}/></div>
          </div>
          {open===i && <div className="faq-a">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

const PERF_METRICS = [
  { label:"Acceptance rate",  val:94, display:"94%" },
  { label:"On-time delivery", val:98, display:"98%" },
  { label:"Rubric adherence", val:96, display:"96%" },
  { label:"Trainer retention",val:91, display:"91%" },
];

const INCLUDES = [
  { label:"Fully custom scope & volume",       sub:"No fixed tiers — we price around your actual task volume, timeline, and quality requirements." },
  { label:"Dedicated account manager",         sub:"A single point of contact reachable via Slack, available from day one through delivery." },
  { label:"Priority trainer matching",         sub:"Your project is matched to pre-vetted trainers with verified skills in your domain." },
  { label:"Custom rubrics & calibration",      sub:"We build to your spec — your guidelines, your ground truth, your quality bar." },
  { label:"SLA-backed turnaround",             sub:"Contractual delivery commitments with automatic escalation if timelines slip." },
  { label:"Data security & compliance",        sub:"SOC 2 Type II, GDPR, and HIPAA-compatible workflows available on request." },
  { label:"Flexible billing",                  sub:"Monthly, milestone-based, or task-based billing — structured to match your procurement process." },
];

const SOLUTIONS = [
  { featured:true,  icon:"🧠", title:"Custom AI Model Training",     desc:"Build proprietary models fine-tuned to your domain. Our network of 18,000+ specialists provides the high-quality human feedback your models need — at any scale, any timeline.", tags:["RLHF","Fine-tuning","Domain Expertise","Custom Rubrics","Quality Assurance"] },
  { icon:"🔍", title:"Evaluation & Benchmarking",  desc:"Measure model performance with human ground truth. Get rubric-based scoring, comparative evaluation, and regression testing across model versions.", tags:["Model Evals","A/B Testing","Regression"] },
  { icon:"🛡️", title:"Safety & Red-Teaming",       desc:"Identify failure modes before they reach users. Dedicated safety trainers stress-test your models for harmful outputs, jailbreaks, and edge cases.", tags:["Red-teaming","Content Moderation","Bias Detection"] },
  { icon:"📊", title:"Data Annotation & Labeling", desc:"Structured annotation at scale. Text, code, multimodal — our trainers follow your schemas with precision and deliver audit-ready datasets.", tags:["NLP","Code","Multimodal","Structured Data"] },
  { icon:"⚡", title:"Rapid Deployment",           desc:"Go from requirements to active trainers in under 48 hours. Our onboarding pipeline, skill matching, and quality controls are built for speed.", tags:["48h Launch","Dedicated PM","SLA Guaranteed"] },
];

const TESTIMONIALS = [
  { quote:"We went from idea to active training pipeline in 36 hours. The quality of trainers and the speed of turnaround is unmatched — we've tried three other vendors.", name:"Priya S.", role:"Head of AI", company:"Meridian AI", initials:"PS" },
  { quote:"The safety red-teaming team found failure modes our own team missed after six months of testing. These are genuinely expert annotators, not click farms.", name:"Carlos R.", role:"AI Safety Lead", company:"Seren Labs", initials:"CR" },
  { quote:"We scaled from 200 to 12,000 tasks per month over six weeks without any drop in quality. The infrastructure just works.", name:"Nadia F.", role:"ML Platform Engineer", company:"Volant", initials:"NF" },
];

function PricingSection() {
  const [form, setForm] = useState({ name:"", company:"", email:"", volume:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const change = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const submit = () => { if (!form.name || !form.email || !form.company) return; setSubmitted(true); };

  return (
    <div className="pricing-custom-wrap">
      <div className="pricing-includes">
        <div className="pricing-includes-title">Everything included</div>
        <div className="pricing-includes-items">
          {INCLUDES.map(item => (
            <div className="pricing-include-row" key={item.label}>
              <div className="pricing-include-check"><I n="check" s={10} c="var(--accent)"/></div>
              <div><div className="pricing-include-label">{item.label}</div><div className="pricing-include-sub">{item.sub}</div></div>
            </div>
          ))}
        </div>
      </div>
      <div className="pricing-contact-card">
        <div className="pricing-contact-eyebrow">Get a Quote</div>
        <div className="pricing-contact-title">Tell us about your project</div>
        <div className="pricing-contact-sub">We'll scope your requirements and send a custom proposal within one business day. No sales pressure, no generic decks.</div>
        {submitted ? (
          <div className="pricing-success">
            <div className="pricing-success-icon">✅</div>
            <div className="pricing-success-title">Request received</div>
            <div className="pricing-success-sub">We'll reach out to <strong style={{ color:"var(--accent)" }}>{form.email}</strong> within one business day with a tailored proposal.</div>
          </div>
        ) : (
          <div className="pricing-form">
            <div className="pricing-form-row">
              <input className="pricing-input" name="name" placeholder="Your name" value={form.name} onChange={change}/>
              <input className="pricing-input" name="company" placeholder="Company" value={form.company} onChange={change}/>
            </div>
            <input className="pricing-input" name="email" type="email" placeholder="Work email" value={form.email} onChange={change}/>
            <select className="pricing-select" name="volume" value={form.volume} onChange={change}>
              <option value="">Estimated monthly task volume…</option>
              <option>Under 1,000 tasks / month</option>
              <option>1,000 – 10,000 tasks / month</option>
              <option>10,000 – 50,000 tasks / month</option>
              <option>50,000 – 200,000 tasks / month</option>
              <option>200,000+ tasks / month</option>
            </select>
            <textarea className="pricing-textarea" name="message" placeholder="Briefly describe your use case — task type, timeline, quality requirements…" value={form.message} onChange={change}/>
            <button className="pricing-submit" onClick={submit}>
              Request a Proposal
              <div className="arrow-box"><Arrow size={16} color="#fff"/></div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ForCompanies() {
  return (
    <>
      <style>{G}</style>
      <Navbar />

      <section className="hero">
        <div className="hero-orb"/>
        <div className="hero-orb-inner"/>

        <div className="float-card float-card-left">
          <div className="fc-label">Live Task Volume</div>
          <div className="fc-value fc-lime">12,840</div>
          <div className="fc-sub">tasks completed today</div>
        </div>

        <div className="float-card float-card-right" style={{ minWidth:200 }}>
          <div className="fc-label" style={{ marginBottom:14 }}>Quality Score</div>
          {[["Accuracy","97%"],["Speed","98%"],["Rubric","96%"]].map(([k,v]) => (
            <div key={k} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontSize:12, color:"var(--sub)" }}>{k}</span>
              <span style={{ fontSize:13, fontWeight:700, color:"var(--accent)" }}>{v}</span>
            </div>
          ))}
        </div>

        <div className="float-card float-card-bot-right">
          <div className="fc-row">
            <div className="fc-icon fc-icon-orange">👥</div>
            <div>
              <div className="fc-label">Active Trainers</div>
              <div className="fc-value">18,400+</div>
              <div className="fc-sub">across 50+ countries</div>
            </div>
          </div>
        </div>

        <FadeIn>
          <div className="hero-badge"><div className="hero-badge-dot"/>Trusted by leading AI labs and enterprises</div>
        </FadeIn>
        <FadeIn delay={80}><h1 className="hero-h1">Human Intelligence,<br/><span className="hero-h1-lime">At Your Scale.</span></h1></FadeIn>
        <FadeIn delay={160}><p className="hero-sub">Lixeen gives AI teams on-demand access to 18,000+ skilled trainers for model training, evaluation, safety testing, and data labeling — with enterprise-grade quality controls built in.</p></FadeIn>
        <FadeIn delay={240}>
          <div className="hero-cta">
            <button className="btn-lime-lg">Book a Demo<div className="arrow-box"><Arrow size={18} color="#fff"/></div></button>
            <button className="btn-outline-dark">View Pricing<div className="arrow-box"><Arrow size={16} color="#555"/></div></button>
          </div>
        </FadeIn>
        <FadeIn delay={320}>
          <div className="logo-strip">
            <div className="logo-strip-label">Trusted by teams at</div>
            <div className="logo-strip-logos">
              {["Anthropic","OpenAI","Cohere","Mistral","Stability AI","Inflection"].map(co => (
                <div key={co} className="logo-item">{co}</div>
              ))}
            </div>
          </div>
        </FadeIn>
      </section>

      <div className="stats-band">
        <div className="stats-band-inner">
          {[["240K+","Tasks completed monthly"],["94%","Average acceptance rate"],["<24h","Median turnaround"],["50+","Countries covered"]].map(([v,l]) => (
            <div className="stat-cell" key={l}><div className="stat-val">{v}</div><div className="stat-lbl">{l}</div></div>
          ))}
        </div>
      </div>

      <div className="divider"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Process</div>
            <h2 className="sec-h2">From Brief to Results in Days</h2>
            <p className="sec-sub">We've stripped the complexity out of enterprise AI data procurement.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="how-grid">
              {[
                { n:"01", icon:"layers",   title:"Share your requirements",   desc:"Tell us your task type, volume, quality bar, and timeline. We'll scope the project and match you with trainers who have verified skills in your domain." },
                { n:"02", icon:"cpu",      title:"We configure & calibrate",  desc:"Our team sets up your rubrics, runs calibration batches with your ground truth, and onboards trainers. Quality is locked before volume work begins." },
                { n:"03", icon:"activity", title:"Receive production data",    desc:"Completed tasks are delivered to your S3, GCS, or via API in your preferred format. You get live dashboards, quality metrics, and full audit trails." },
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

      <div className="divider"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Solutions</div>
            <h2 className="sec-h2">Everything Your AI Team Needs</h2>
            <p className="sec-sub">From early-stage fine-tuning to production-scale safety testing.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="solutions-grid">
              {SOLUTIONS.map((s,i) => (
                s.featured ? (
                  <div className="solution-card featured" key={i}>
                    <div style={{ position:"relative", zIndex:1 }}>
                      <div className="solution-icon">{s.icon}</div>
                      <div className="solution-title">{s.title}</div>
                      <div className="solution-desc">{s.desc}</div>
                      <div className="solution-tags">{s.tags.map(t => <span className="solution-tag" key={t}>{t}</span>)}</div>
                    </div>
                    <div className="featured-visual" style={{ position:"relative", zIndex:1 }}>
                      <div className="featured-visual-header">Platform Performance</div>
                      {PERF_METRICS.map(m => (
                        <div className="perf-row" key={m.label}>
                          <span className="perf-label">{m.label}</span>
                          <div className="perf-bar-wrap"><div className="perf-bar" style={{ width:`${m.val}%` }}/></div>
                          <span className="perf-val">{m.display}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="solution-card" key={i}>
                    <div style={{ position:"relative", zIndex:1 }}>
                      <div className="solution-icon">{s.icon}</div>
                      <div className="solution-title">{s.title}</div>
                      <div className="solution-desc">{s.desc}</div>
                      <div className="solution-tags">{s.tags.map(t => <span className="solution-tag" key={t}>{t}</span>)}</div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="divider"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">Pricing</div>
            <h2 className="sec-h2">Custom Pricing, Built Around You</h2>
            <p className="sec-sub">Every engagement is scoped to your volume, task type, and quality requirements. No rigid tiers, no wasted budget.</p>
          </FadeIn>
          <FadeIn delay={100}><PricingSection/></FadeIn>
        </div>
      </div>

      <div className="divider"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:44 }}>
              <div className="sec-eyebrow" style={{ display:"inline-flex" }}>Testimonials</div>
              <h2 className="sec-h2">What AI Teams Are Saying</h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="testimonials-grid">
              {TESTIMONIALS.map((t,i) => (
                <div className="testimonial-card" key={i}>
                  <div className="quote-mark">"</div>
                  <p className="testimonial-text">{t.quote}</p>
                  <div className="testimonial-author">
                    <div className="testimonial-av">{t.initials}</div>
                    <div>
                      <div className="testimonial-name">{t.name}</div>
                      <div className="testimonial-role">{t.role}</div>
                      <div className="testimonial-company">{t.company}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="divider"/>
      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div style={{ textAlign:"center", marginBottom:48 }}>
              <div className="sec-eyebrow" style={{ display:"inline-flex" }}>FAQ</div>
              <h2 className="sec-h2">Enterprise Questions, Answered</h2>
            </div>
          </FadeIn>
          <FadeIn delay={100}><FAQ/></FadeIn>
        </div>
      </div>

      <div className="cta-banner">
        <div className="cta-glow"/>
        <FadeIn>
          <h2>Ready to Build <span>Better AI?</span></h2>
          <p>Talk to our team. We'll scope your project, answer your questions, and get you started — often within 48 hours.</p>
          <div className="cta-actions">
            <button className="btn-lime-lg">Book a Demo<div className="arrow-box"><Arrow size={18} color="#fff"/></div></button>
            <button className="btn-outline-dark" style={{ height:60, paddingLeft:32, paddingRight:10, fontSize:16 }}>
              View Pricing<div className="arrow-box"><Arrow size={16} color="#555"/></div>
            </button>
          </div>
        </FadeIn>
      </div>

      <Footer />
    </>
  );
}