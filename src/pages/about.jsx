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

/* HERO */
.hero{padding:160px 40px 100px;text-align:center;position:relative;overflow:hidden;background:var(--bg);}
.hero-orb{position:absolute;top:-10%;left:50%;transform:translateX(-50%);width:900px;height:500px;border-radius:50%;background:radial-gradient(ellipse at 50% 60%,rgba(200,240,38,0.15) 0%,rgba(61,187,0,0.06) 40%,transparent 80%);pointer-events:none;}
.hero-badge{display:inline-flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--sub);background:#fff;border:1px solid var(--border);border-radius:var(--r-pill);padding:8px 18px;margin-bottom:32px;position:relative;z-index:1;box-shadow:0 2px 8px rgba(0,0,0,0.05);}
.hero-badge-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);}
.hero-h1{font-size:clamp(44px,6vw,82px);font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1.05;max-width:820px;margin:0 auto 24px;position:relative;z-index:1;}
.hero-h1 span{color:var(--accent);}
.hero-sub{font-size:18px;color:var(--sub);max-width:560px;line-height:1.65;margin:0 auto 48px;font-weight:400;position:relative;z-index:1;}
.hero-actions{display:flex;align-items:center;gap:12px;flex-wrap:wrap;justify-content:center;position:relative;z-index:1;}

/* STATS STRIP */
.stats-strip{border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--surface);padding:0 40px;}
.stats-inner{max-width:1100px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);}
.stat-cell{padding:36px 24px;border-right:1px solid var(--border);text-align:center;}
.stat-cell:last-child{border-right:none;}
.stat-num{font-size:42px;font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1;}
.stat-num span{color:var(--accent);}
.stat-label{font-size:13px;color:var(--sub);margin-top:6px;font-weight:500;}

/* SECTION */
.section{max-width:1100px;margin:0 auto;padding:100px 40px;}
.sec-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent);background:var(--lime-dim);border:1px solid var(--lime-glow);border-radius:var(--r-pill);padding:6px 14px;margin-bottom:20px;}
.sec-h2{font-size:clamp(32px,4vw,52px);font-weight:800;color:var(--text);letter-spacing:-0.025em;line-height:1.1;margin-bottom:16px;}
.sec-sub{font-size:16px;color:var(--sub);max-width:520px;line-height:1.7;margin-bottom:56px;}
.divider{height:1px;background:var(--border);}

/* MISSION */
.mission-layout{display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center;}
.mission-text p{font-size:17px;color:var(--sub);line-height:1.8;margin-bottom:20px;}
.mission-text p:last-child{margin-bottom:0;}
.mission-quote{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:36px;position:relative;overflow:hidden;box-shadow:0 4px 16px rgba(0,0,0,0.05);}
.mission-quote::before{content:'"';font-size:120px;font-weight:800;color:var(--lime-dim);position:absolute;top:-20px;left:20px;line-height:1;font-family:var(--sans);}
.mission-quote-text{font-size:20px;font-weight:600;color:var(--text);line-height:1.6;position:relative;z-index:1;margin-bottom:20px;}
.mission-quote-author{font-size:14px;color:var(--sub);position:relative;z-index:1;}
.mission-quote-author strong{color:var(--accent);}

/* VALUES */
.values-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;}
.value-card{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:32px;transition:border-color 0.2s,transform 0.2s,box-shadow 0.2s;}
.value-card:hover{border-color:var(--border2);transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,0.06);}
.value-icon{width:44px;height:44px;border-radius:12px;background:var(--lime-dim);border:1px solid var(--lime-glow);display:flex;align-items:center;justify-content:center;margin-bottom:20px;font-size:20px;}
.value-title{font-size:17px;font-weight:700;color:var(--text);margin-bottom:10px;}
.value-desc{font-size:14px;color:var(--sub);line-height:1.7;}

/* CTA BANNER */
.cta-banner{background:linear-gradient(135deg,#f0f9e6 0%,#f5f0ff 50%,#f0f9e6 100%);border-top:1px solid var(--border);border-bottom:1px solid var(--border);padding:100px 40px;text-align:center;position:relative;overflow:hidden;}
.cta-banner-glow{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:600px;height:300px;border-radius:50%;background:radial-gradient(ellipse,rgba(61,187,0,0.12) 0%,transparent 70%);pointer-events:none;}
.cta-banner h2{font-size:clamp(32px,4vw,52px);font-weight:800;color:var(--text);letter-spacing:-0.025em;margin-bottom:16px;position:relative;z-index:1;}
.cta-banner h2 span{color:var(--accent);}
.cta-banner p{font-size:17px;color:var(--sub);margin-bottom:40px;position:relative;z-index:1;}
.cta-actions{display:flex;align-items:center;gap:12px;justify-content:center;flex-wrap:wrap;position:relative;z-index:1;}

.btn-lime{display:inline-flex;align-items:center;gap:0;font-family:var(--sans);font-size:15px;font-weight:700;cursor:pointer;border:none;border-radius:var(--r-pill);background:var(--text);color:#fff;padding:0 6px 0 24px;height:48px;transition:opacity 0.2s;}
.btn-lime:hover{opacity:0.85;}
.btn-lime .arrow-box{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;margin-left:10px;}
.btn-outline{display:inline-flex;align-items:center;gap:0;font-family:var(--sans);font-size:15px;font-weight:600;cursor:pointer;border:1.5px solid var(--border2);border-radius:var(--r-pill);background:#fff;color:var(--text);padding:0 6px 0 24px;height:48px;transition:border-color 0.2s,background 0.2s;}
.btn-outline:hover{border-color:var(--sub);background:var(--surface);}
.btn-outline .arrow-box{width:36px;height:36px;border-radius:50%;background:var(--surface);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;margin-left:10px;}

.fade-in{opacity:0;transform:translateY(24px);transition:opacity 0.6s ease,transform 0.6s ease;}
.fade-in.visible{opacity:1;transform:translateY(0);}

@media(max-width:900px){
  .mission-layout{grid-template-columns:1fr;}
  .values-grid{grid-template-columns:1fr 1fr;}
  .stats-inner{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:600px){
  .values-grid{grid-template-columns:1fr;}
  .stats-inner{grid-template-columns:1fr 1fr;}
  .hero{padding:120px 20px 80px;}
  .section{padding:72px 20px;}
  .cta-banner{padding:60px 20px;}
  .cta-actions{flex-direction:column;align-items:stretch;}
  .cta-actions>*{width:100%;justify-content:center;}
}
`;

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) el.classList.add("visible"); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="fade-in" style={{ transitionDelay:`${delay}ms` }}>{children}</div>;
}

const Arrow = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 14 14" fill="none">
    <path d="M2.5 11.5L11.5 2.5M11.5 2.5H5M11.5 2.5V9" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function AboutPage() {
  const values = [
    { icon:"🌍", title:"Global by Default",     desc:"We built for the world from day one. 50+ countries, localized payouts, multilingual support. Geography shouldn't limit opportunity." },
    { icon:"🔍", title:"Radical Transparency",  desc:"Every rubric, every rejection, every rate — visible upfront. No hidden algorithms. No surprise policy changes. You deserve to know how the game works." },
    { icon:"⚖️", title:"Fair Compensation",     desc:"We publish pay rates publicly and fight for above-market rates on every client contract. Trainers earn more on Lixeen than anywhere else." },
    { icon:"🔒", title:"Privacy First",          desc:"Your data is yours. We collect the minimum required to operate, never sell personal data, and give you full export and deletion rights." },
    { icon:"🤝", title:"Earned Trust",           desc:"Trust goes both ways. We hold clients to SLAs and trainers to quality standards — because a reliable platform benefits everyone on it." },
    { icon:"📈", title:"Growth Mindset",         desc:"We invest in our trainers' growth through detailed feedback, skill progression, and access to increasingly complex tasks over time." },
  ];

  return (
    <>
      <style>{G}</style>
      <Navbar />

      <div className="hero">
        <div className="hero-orb"/>
        <FadeIn>
          <div className="hero-badge"><div className="hero-badge-dot"/>Founded 2023 · Series A · 50+ Countries</div>
          <h1 className="hero-h1">The platform <span>built for the humans</span> behind AI</h1>
          <p className="hero-sub">Lixeen connects skilled people worldwide with AI labs that need real human intelligence — transparently, fairly, and at scale.</p>
          <div className="hero-actions">
            <button className="btn-lime">Join Lixeen<div className="arrow-box"><Arrow size={16} color="#fff"/></div></button>
            <button className="btn-outline">Meet the Team<div className="arrow-box"><Arrow size={16} color="#555"/></div></button>
          </div>
        </FadeIn>
      </div>

      <div className="stats-strip">
        <div className="stats-inner">
          {[
            { num:"12,841", suf:"",    label:"Active Trainers" },
            { num:"50",     suf:"+",   label:"Countries Represented" },
            { num:"$2.1",   suf:"M+",  label:"Paid Out to Trainers" },
            { num:"94",     suf:"M+",  label:"Tasks Completed" },
          ].map(s => (
            <div className="stat-cell" key={s.label}>
              <div className="stat-num">{s.num}<span>{s.suf}</span></div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background:"var(--bg)" }}>
        <div className="section">
          <FadeIn>
            <div className="mission-layout">
              <div className="mission-text">
                <div className="sec-eyebrow">Our Mission</div>
                <h2 className="sec-h2">AI needs humans. Humans deserve better.</h2>
                <p>Every large language model was shaped by thousands of hours of human feedback. That labor — ranking responses, writing corrections, flagging errors — is invisible in the finished product but essential to its quality.</p>
                <p>We built Lixeen because the people doing this work deserved a platform that treated them like professionals: transparent rubrics, fair pay, real feedback, and a clear path to growth.</p>
                <p>We're not a gig platform. We're an infrastructure layer for the AI economy — and we're building it with the trainers who power it at the center.</p>
              </div>
              <div>
                <div className="mission-quote">
                  <p className="mission-quote-text">The intelligence of every AI system is borrowed from human minds. It's time we compensated the lenders.</p>
                  <div className="mission-quote-author">— <strong>Amara Diallo</strong>, CEO & Co-founder</div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="divider"/>
      <div style={{ background:"var(--surface)" }}>
        <div className="section">
          <FadeIn>
            <div className="sec-eyebrow">What We Believe</div>
            <h2 className="sec-h2">Our values</h2>
            <p className="sec-sub">Six principles that guide every product decision, every hiring call, and every client negotiation.</p>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="values-grid">
              {values.map(v => (
                <div className="value-card" key={v.title}>
                  <div className="value-icon">{v.icon}</div>
                  <div className="value-title">{v.title}</div>
                  <div className="value-desc">{v.desc}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="cta-banner">
        <div className="cta-banner-glow"/>
        <FadeIn>
          <h2>Ready to <span>join us?</span></h2>
          <p>Thousands of trainers across 50+ countries have already made Lixeen their primary platform.</p>
          <div className="cta-actions">
            <button className="btn-lime">Create Free Account<div className="arrow-box"><Arrow size={16} color="#fff"/></div></button>
            <button className="btn-outline">View Open Roles<div className="arrow-box"><Arrow size={16} color="#555"/></div></button>
          </div>
        </FadeIn>
      </div>

      <Footer />
    </>
  );
}