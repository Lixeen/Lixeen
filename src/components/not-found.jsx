import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Arrow } from "../assets/constants/branding";

/* ── FadeIn ── */
function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("visible"); obs.disconnect(); }
    }, { threshold: 0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
function FadeIn({ children, delay = 0, style = {} }) {
  const ref = useFadeIn();
  return (
    <div ref={ref} className="fade-in" style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </div>
  );
}

/* ── Quick links ── */
const LINKS = [
  { label: "Homepage",      path: "/",             desc: "Back to where it all starts" },
  { label: "Browse Tasks",  path: "/tasks",        desc: "Find work available right now" },
  { label: "Help Center",   path: "/help",         desc: "Answers to common questions" },
  { label: "Contact Us",    path: "/contact",      desc: "Talk to a real human" },
];

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
body {
  font-family: var(--sans); color: var(--text); background: var(--bg);
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
}
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

.fade-in { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }
.divider { height: 1px; background: var(--border); }

/* ── PAGE WRAPPER ── */
.notfound-page {
  min-height: 100vh;
  display: flex; flex-direction: column;
  padding-top: 68px; /* nav height */
}

/* ── HERO ── */
.notfound-hero {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  text-align: center;
  padding: 80px 40px 64px;
  position: relative; overflow: hidden;
  background: var(--bg);
}

/* Subtle orb */
.notfound-orb {
  position: absolute; bottom: -15%; left: 50%; transform: translateX(-50%);
  width: 800px; height: 400px; border-radius: 50%;
  background: radial-gradient(ellipse at 50% 40%,
    rgba(61,187,0,0.09) 0%, rgba(124,92,252,0.05) 50%, transparent 75%);
  filter: blur(2px); pointer-events: none;
}

/* ── BIG 404 ── */
.notfound-number {
  font-size: clamp(120px, 18vw, 220px);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 1;
  color: var(--text);
  position: relative; z-index: 1;
  /* Clipped with lime underline accent */
  margin-bottom: 0;
  user-select: none;
}
.notfound-number-accent {
  display: block;
  width: 64px; height: 5px;
  background: var(--lime);
  border-radius: var(--r-pill);
  margin: 12px auto 36px;
  position: relative; z-index: 1;
  animation: accentPop 0.6s 0.4s both cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes accentPop {
  from { transform: scaleX(0); opacity: 0; }
  to   { transform: scaleX(1); opacity: 1; }
}

/* ── COPY ── */
.notfound-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--lime); background: var(--lime-dim); border: 1px solid var(--lime-glow);
  border-radius: var(--r-pill); padding: 5px 14px; margin-bottom: 20px;
  position: relative; z-index: 1;
}
.notfound-title {
  font-size: clamp(28px, 4vw, 48px); font-weight: 800; color: var(--text);
  letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 16px;
  max-width: 600px; position: relative; z-index: 1;
}
.notfound-sub {
  font-size: 17px; color: var(--sub); line-height: 1.65;
  max-width: 460px; margin-bottom: 44px;
  position: relative; z-index: 1;
}

/* ── CTA BUTTONS ── */
.notfound-actions {
  display: flex; gap: 12px; justify-content: center;
  flex-wrap: wrap; position: relative; z-index: 1; margin-bottom: 72px;
}
.btn-primary {
  display: inline-flex; align-items: center;
  font-family: var(--sans); font-size: 15px; font-weight: 700;
  cursor: pointer; border: none; border-radius: var(--r-pill);
  background: var(--text); color: #fff;
  padding: 0 8px 0 26px; height: 52px; transition: opacity 0.2s; white-space: nowrap;
}
.btn-primary .arrow-box {
  width: 36px; height: 36px; border-radius: 50%; background: var(--purple);
  display: flex; align-items: center; justify-content: center;
  margin-left: 14px; flex-shrink: 0;
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

/* ── QUICK LINKS ── */
.notfound-links-label {
  font-size: 12px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--muted); margin-bottom: 16px;
  position: relative; z-index: 1;
}
.notfound-links {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px;
  max-width: 820px; width: 100%; position: relative; z-index: 1;
}
.notfound-link-card {
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 18px 20px;
  text-decoration: none; color: inherit;
  display: flex; flex-direction: column; gap: 4px; text-align: left;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.notfound-link-card:hover {
  border-color: var(--border2); transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.06);
}
.notfound-link-label {
  font-size: 14px; font-weight: 700; color: var(--text);
}
.notfound-link-desc {
  font-size: 12px; color: var(--muted); line-height: 1.4;
}
.notfound-link-arrow {
  margin-top: 10px; color: var(--lime);
}

/* ── RESPONSIVE ── */
@media (max-width: 680px) {
  .notfound-hero { padding: 60px 20px 48px; }
  .notfound-actions { flex-direction: column; align-items: stretch; }
  .notfound-actions > * { justify-content: center; }
  .notfound-links { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 400px) {
  .notfound-links { grid-template-columns: 1fr; }
}
`;

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <style>{G}</style>
      <Navbar />

      <div className="notfound-page">
        <div className="notfound-hero">
          <div className="notfound-orb" />

          {/* Big number */}
          <FadeIn>
            <div className="notfound-number">404</div>
            <span className="notfound-number-accent" />
          </FadeIn>

          {/* Copy */}
          <FadeIn delay={80}>
            <div className="notfound-eyebrow">Page not found</div>
            <h1 className="notfound-title">This page doesn't exist — yet.</h1>
            <p className="notfound-sub">
              The URL you followed may be broken, outdated, or the page may have moved.
              Let's get you somewhere useful.
            </p>
          </FadeIn>

          {/* CTAs */}
          <FadeIn delay={160}>
            <div className="notfound-actions">
              <button className="btn-primary" onClick={() => navigate(-1)}>
                Go back
                <div className="arrow-box">
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
                    stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                </div>
              </button>
              <Link to="/" className="btn-outline">
                Go to Homepage
                <div className="arrow-box">
                  <Arrow size={15} color="#555" />
                </div>
              </Link>
            </div>
          </FadeIn>

          {/* Quick links */}
          <FadeIn delay={240}>
            <div className="notfound-links-label">Or jump to</div>
            <div className="notfound-links">
              {LINKS.map((link) => (
                <Link key={link.path} to={link.path} className="notfound-link-card">
                  <div className="notfound-link-label">{link.label}</div>
                  <div className="notfound-link-desc">{link.desc}</div>
                  <div className="notfound-link-arrow">
                    <Arrow size={13} color="var(--lime)" />
                  </div>
                </Link>
              ))}
            </div>
          </FadeIn>
        </div>

        <div className="divider" />
        <Footer />
      </div>
    </>
  );
}