import { useState, useEffect, useRef } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Arrow, I } from '../assets/constants/branding';

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

html { scroll-behavior: smooth; }
body { font-family: var(--sans); color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased; overflow-x: hidden; }

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

/* ─── HERO ─── */
.hero {
  padding: 160px 40px 80px;
  text-align: center;
  position: relative; overflow: hidden;
  background: var(--bg);
}
.hero-orb {
  position: absolute; top: -10%; left: 50%; transform: translateX(-50%);
  width: 800px; height: 400px; border-radius: 50%;
  background: radial-gradient(ellipse at 50% 60%,
    rgba(200,240,38,0.13) 0%, rgba(80,160,0,0.06) 40%, transparent 80%);
  pointer-events: none;
}
.hero-badge {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 13px; font-weight: 500; color: var(--sub);
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-pill); padding: 8px 18px;
  margin-bottom: 32px; position: relative; z-index: 1;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.hero-badge-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #3dbb00; box-shadow: 0 0 6px rgba(61,187,0,0.5);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%,100% { opacity:1; transform:scale(1); }
  50% { opacity:0.5; transform:scale(0.8); }
}
.hero-h1 {
  font-size: clamp(40px, 5.5vw, 72px);
  font-weight: 800; color: var(--text);
  letter-spacing: -0.03em; line-height: 1.05;
  max-width: 720px; margin: 0 auto 20px;
  position: relative; z-index: 1;
}
.hero-h1 span { color: #3dbb00; }
.hero-sub {
  font-size: 17px; color: var(--sub);
  max-width: 480px; line-height: 1.65;
  margin: 0 auto; position: relative; z-index: 1;
}

/* ─── LAYOUT ─── */
.contact-layout {
  max-width: 1100px; margin: 0 auto;
  padding: 80px 40px 100px;
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 64px; align-items: start;
}

/* ─── CHANNELS ─── */
.channels-title { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 8px; }
.channels-sub { font-size: 14px; color: var(--sub); line-height: 1.65; margin-bottom: 40px; }

.channel-card {
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 22px 26px;
  margin-bottom: 12px; display: flex; align-items: center; gap: 18px;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; cursor: pointer;
}
.channel-card:hover {
  border-color: #3dbb00; transform: translateX(4px);
  box-shadow: 0 4px 16px rgba(61,187,0,0.08);
}
.channel-icon-wrap {
  width: 48px; height: 48px; border-radius: 14px;
  background: rgba(61,187,0,0.08); border: 1px solid rgba(61,187,0,0.18);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.channel-info { flex: 1; }
.channel-title { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.channel-detail { font-size: 13px; color: #3dbb00; font-weight: 600; }
.channel-note { font-size: 12px; color: var(--muted); margin-top: 2px; }
.channel-arrow {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--surface); border: 1px solid var(--border);
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}

/* ─── RESPONSE TIMES ─── */
.resp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 32px; }
.resp-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 12px; padding: 16px 20px;
  transition: border-color 0.2s;
}
.resp-card:hover { border-color: var(--border2); }
.resp-label { font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 6px; }
.resp-time { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
.resp-time span { color: #3dbb00; }
.resp-type { font-size: 12px; color: var(--sub); margin-top: 2px; }

/* ─── FORM ─── */
.form-card {
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 40px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.04);
}
.form-title { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
.form-subtitle { font-size: 13px; color: var(--sub); margin-bottom: 32px; }
.form-group { margin-bottom: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.form-label { font-size: 11px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--sub); margin-bottom: 8px; display: block; }
.form-input, .form-select, .form-textarea {
  width: 100%; background: var(--surface); border: 1.5px solid var(--border2);
  border-radius: var(--r-sm); color: var(--text);
  font-family: var(--sans); font-size: 14px; font-weight: 500;
  padding: 12px 16px; outline: none; transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
  border-color: #3dbb00; box-shadow: 0 0 0 3px rgba(61,187,0,0.08);
}
.form-input::placeholder, .form-textarea::placeholder { color: var(--muted); }
.form-select { appearance: none; cursor: pointer; }
.form-textarea { resize: vertical; min-height: 120px; }
.form-submit {
  width: 100%; display: inline-flex; align-items: center; justify-content: center;
  gap: 0; font-family: var(--sans); font-size: 15px; font-weight: 700;
  cursor: pointer; border: none; border-radius: var(--r-pill);
  background: var(--text); color: #fff;
  padding: 0 6px 0 28px; height: 50px; margin-top: 8px; transition: opacity 0.2s;
}
.form-submit:hover { opacity: 0.85; }
.form-submit .arrow-box {
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center; margin-left: 12px;
}
.form-success { text-align: center; padding: 20px 0; }
.form-success-icon { font-size: 48px; margin-bottom: 16px; }
.form-success-title { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 8px; }
.form-success-sub { font-size: 14px; color: var(--sub); line-height: 1.6; }

/* ─── FAQ ─── */
.faq-section { max-width: 1100px; margin: 0 auto; padding: 80px 40px 100px; }
.faq-section-title {
  font-size: 22px; font-weight: 800; color: var(--text);
  letter-spacing: -0.02em; margin-bottom: 24px;
}
.faq-list {
  display: flex; flex-direction: column;
  border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden;
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
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; color: var(--sub); transition: background 0.15s, border-color 0.15s;
}
.faq-q:hover .faq-toggle { background: var(--surface2); border-color: var(--border2); }
.faq-a { padding: 0 26px 20px; font-size: 14px; color: var(--sub); line-height: 1.7; }

/* ─── SEC EYEBROW ─── */
.sec-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  color: #3dbb00; background: rgba(61,187,0,0.08); border: 1px solid rgba(61,187,0,0.18);
  border-radius: var(--r-pill); padding: 5px 14px; margin-bottom: 20px;
}

/* ─── DIVIDER ─── */
.divider { height: 1px; background: var(--border); }

/* ─── FADE IN ─── */
.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }

/* ─── MOBILE ─── */
@media (max-width: 900px) {
  .contact-layout { grid-template-columns: 1fr; gap: 40px; }
}
@media (max-width: 600px) {
  .hero { padding: 120px 20px 60px; }
  .hero-h1 { font-size: clamp(32px, 9vw, 48px); }
  .contact-layout { padding: 60px 20px 80px; }
  .faq-section { padding: 60px 20px 80px; }
  .form-row { grid-template-columns: 1fr; }
  .resp-grid { grid-template-columns: 1fr; }
}
`;

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="fade-in" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const faqs = [
  { q: "How quickly do you respond to support tickets?", a: "Trainer support tickets are typically answered within 4–8 business hours. Enterprise and client inquiries receive responses within one business day." },
  { q: "What's the best channel for payout issues?", a: "Submit a support ticket and select 'Payments & Payouts' as the category. Our payments team reviews these with highest priority, usually within 2 hours." },
  { q: "Can I appeal a rejected submission?", a: "Yes. Use the Appeals form in your dashboard within 7 days of rejection. Alternatively, contact support and reference your task ID." },
  { q: "How do I report a platform bug?", a: "Email bugs@lixeen.com with your browser, OS, and a short description of what happened. Screenshots or screen recordings are extremely helpful." },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", category: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  return (
    <>
      <style>{G}</style>
      <Navbar />

      {/* ── HERO ── */}
      <div className="hero">
        <div className="hero-orb"/>
        <FadeIn>
          <div className="hero-badge">
            <div className="hero-badge-dot"/>
            Average response: &lt;4 hours
          </div>
          <h1 className="hero-h1">We're here. <span>Talk to us.</span></h1>
          <p className="hero-sub">Real humans respond to every message. Choose your channel below, or fill out the form and we'll get back to you fast.</p>
        </FadeIn>
      </div>

      <div className="divider"/>

      {/* ── MAIN LAYOUT ── */}
      <div className="contact-layout">

        {/* ── CHANNELS ── */}
        <FadeIn>
          <div>
            <div className="sec-eyebrow">Get in touch</div>
            <div className="channels-title">Contact channels</div>
            <div className="channels-sub">Pick the right channel for your need and we'll route it to the right team immediately.</div>

            {[
              { icon: "💬", title: "Trainer Support",    detail: "support@lixeen.com",  note: "Task issues, appeals, account problems", resp: "< 4 hrs"        },
              { icon: "💳", title: "Payments & Payouts", detail: "payments@lixeen.com", note: "Payout delays, bank issues, refunds",     resp: "< 2 hrs"        },
              { icon: "🤝", title: "Enterprise & Clients",detail:"clients@lixeen.com",  note: "Data contracts, custom pipelines, SLAs",  resp: "1 business day" },
              { icon: "📰", title: "Press & Media",      detail: "press@lixeen.com",    note: "Interviews, quotes, brand assets",        resp: "24 hrs"         },
              { icon: "💼", title: "Careers",            detail: "careers@lixeen.com",  note: "Open applications, hiring questions",     resp: "3–5 days"       },
            ].map(ch => (
              <div className="channel-card" key={ch.title}>
                <div className="channel-icon-wrap">{ch.icon}</div>
                <div className="channel-info">
                  <div className="channel-title">{ch.title}</div>
                  <div className="channel-detail">{ch.detail}</div>
                  <div className="channel-note">{ch.note} · {ch.resp}</div>
                </div>
                <div className="channel-arrow">
                  <Arrow size={13} color="#3dbb00"/>
                </div>
              </div>
            ))}

            <div className="resp-grid">
              {[
                { label: "Trainer Support", time: "< 4", unit: "hrs"  },
                { label: "Payment Issues",  time: "< 2", unit: "hrs"  },
                { label: "Enterprise",      time: "1",   unit: "day"  },
                { label: "Press",           time: "24",  unit: "hrs"  },
              ].map(r => (
                <div className="resp-card" key={r.label}>
                  <div className="resp-label">{r.label}</div>
                  <div className="resp-time"><span>{r.time}</span> {r.unit}</div>
                  <div className="resp-type">Avg. response</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* ── FORM ── */}
        <FadeIn delay={120}>
          <div className="form-card">
            {submitted ? (
              <div className="form-success">
                <div className="form-success-icon">✅</div>
                <div className="form-success-title">Message sent!</div>
                <div className="form-success-sub">
                  We've received your message and will respond to{" "}
                  <strong style={{ color: "#3dbb00" }}>{form.email}</strong>{" "}
                  within the timeframe listed for your topic.
                </div>
              </div>
            ) : (
              <>
                <div className="sec-eyebrow">Send a message</div>
                <div className="form-title">Get in touch directly</div>
                <div className="form-subtitle">Fill out the form and the right team will follow up.</div>

                <div className="form-row">
                  <div>
                    <label className="form-label">Full Name</label>
                    <input className="form-input" name="name" placeholder="Jordan M." value={form.name} onChange={handleChange}/>
                  </div>
                  <div>
                    <label className="form-label">Email Address</label>
                    <input className="form-input" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={handleChange}/>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-select" name="category" value={form.category} onChange={handleChange}>
                    <option value="">Select a category…</option>
                    <option>Trainer Support</option>
                    <option>Payments & Payouts</option>
                    <option>Account & Security</option>
                    <option>Enterprise / Client Inquiry</option>
                    <option>Press & Media</option>
                    <option>Careers</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <input className="form-input" name="subject" placeholder="Brief summary of your issue…" value={form.subject} onChange={handleChange}/>
                </div>

                <div className="form-group">
                  <label className="form-label">Message</label>
                  <textarea className="form-textarea" name="message" placeholder="Describe your question or issue in as much detail as possible. For task-related issues, include your Task ID." value={form.message} onChange={handleChange}/>
                </div>

                <button className="form-submit" onClick={handleSubmit}>
                  Send Message
                  <div className="arrow-box"><Arrow size={16} color="#fff"/></div>
                </button>
              </>
            )}
          </div>
        </FadeIn>
      </div>

      {/* ── FAQ ── */}
      <div className="divider"/>
      <div style={{ background: "var(--surface)" }}>
        <div className="faq-section">
          <FadeIn>
            <div className="sec-eyebrow">FAQ</div>
            <div className="faq-section-title">Quick answers</div>
            <div className="faq-list">
              {faqs.map((f, i) => (
                <div className="faq-item" key={i} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <div className="faq-q">
                    {f.q}
                    <div className="faq-toggle">
                      {openFaq === i ? "−" : "+"}
                    </div>
                  </div>
                  {openFaq === i && <div className="faq-a">{f.a}</div>}
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </div>

      <Footer />
    </>
  );
}