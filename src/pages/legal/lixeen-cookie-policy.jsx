import { useState, useEffect } from "react";
import Footer from "../../components/footer";
import NavLogo from "../../components/NavLogo";
import { Link } from "react-router-dom";

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
  --r-pill:    999px; --r-card: 16px; --r-sm: 8px;
}

html { scroll-behavior: smooth; }
body { font-family: var(--sans); color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

/* NAV */
.nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 68px; display: flex; align-items: center; padding: 0 40px; background: rgba(255,255,255,0.96); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); box-shadow: 0 1px 0 var(--border); }
.nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; cursor: pointer; }
.nav-logo-mark { width: 34px; height: 34px; background: #c8f026; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.nav-logo-name { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
.nav-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.nav-link-plain { font-size: 14px; font-weight: 500; color: var(--sub); cursor: pointer; transition: color 0.15s; padding: 8px 4px; text-decoration: none; }
.nav-link-plain:hover { color: var(--text); }

/* LAYOUT */
.doc-root { display: grid; grid-template-columns: 260px 1fr; max-width: 1200px; margin: 0 auto; padding: 108px 40px 100px; gap: 64px; align-items: start; }

/* SIDEBAR */
.doc-sidebar { position: sticky; top: 100px; }
.sidebar-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 16px; }
.sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
.sidebar-link { font-size: 13.5px; font-weight: 500; color: var(--sub); padding: 8px 14px; border-radius: var(--r-sm); cursor: pointer; transition: background 0.15s, color 0.15s; border-left: 2px solid transparent; text-decoration: none; display: block; }
.sidebar-link:hover { color: var(--text); background: var(--surface2); }
.sidebar-link.active { color: var(--lime); border-left-color: var(--lime); background: var(--lime-dim); }
.sidebar-divider { height: 1px; background: var(--border); margin: 20px 0; }
.sidebar-meta { font-size: 12px; color: var(--muted); line-height: 1.65; }
.sidebar-meta strong { color: var(--sub); display: block; margin-bottom: 4px; }

/* HERO */
.doc-hero { margin-bottom: 56px; padding-bottom: 48px; border-bottom: 1px solid var(--border); }
.doc-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--lime); background: var(--lime-dim); border: 1px solid var(--lime-glow); border-radius: var(--r-pill); padding: 5px 14px; margin-bottom: 20px; }
.doc-h1 { font-size: clamp(32px,4vw,52px); font-weight: 800; color: var(--text); letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 16px; }
.doc-intro { font-size: 16px; color: var(--sub); line-height: 1.75; max-width: 680px; margin-bottom: 28px; }
.doc-meta-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.doc-meta-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }
.doc-meta-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border2); flex-shrink: 0; }
.doc-meta-item strong { color: var(--sub); }

/* SECTIONS */
.doc-section { margin-bottom: 56px; scroll-margin-top: 96px; }
.doc-section-num { font-size: 11px; font-weight: 700; color: var(--lime); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; }
.doc-h2 { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 18px; line-height: 1.2; }
.doc-h3 { font-size: 16px; font-weight: 700; color: var(--text); margin: 24px 0 10px; letter-spacing: -0.01em; }
.doc-p { font-size: 15px; color: var(--sub); line-height: 1.8; margin-bottom: 16px; }
.doc-p:last-child { margin-bottom: 0; }

.doc-callout { background: var(--surface); border: 1px solid var(--border2); border-left: 3px solid var(--lime); border-radius: var(--r-sm); padding: 18px 22px; margin: 24px 0; }
.doc-callout p { font-size: 14px; color: var(--sub); line-height: 1.7; margin: 0; }
.doc-callout strong { color: var(--text); }

.doc-list { margin: 12px 0 16px 0; display: flex; flex-direction: column; gap: 10px; }
.doc-list-item { display: flex; align-items: flex-start; gap: 12px; font-size: 14.5px; color: var(--sub); line-height: 1.7; }
.doc-list-bullet { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); flex-shrink: 0; margin-top: 9px; }

.doc-table-wrap { overflow-x: auto; margin: 20px 0; border-radius: var(--r-card); border: 1px solid var(--border2); }
.doc-table { width: 100%; border-collapse: collapse; }
.doc-table th { text-align: left; padding: 12px 18px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); background: var(--surface2); border-bottom: 1px solid var(--border); }
.doc-table td { padding: 14px 18px; font-size: 13.5px; color: var(--sub); border-bottom: 1px solid var(--border); vertical-align: top; line-height: 1.65; }
.doc-table tr:last-child td { border-bottom: none; }
.doc-table td:first-child { color: var(--text); font-weight: 600; }

.doc-divider { height: 1px; background: var(--border); margin-bottom: 56px; }

/* COOKIE CARDS */
.cookie-cards { display: flex; flex-direction: column; gap: 12px; margin: 24px 0; }
.cookie-card { background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden; transition: border-color 0.2s, box-shadow 0.2s; }
.cookie-card:hover { border-color: var(--border2); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.cookie-card-head { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; gap: 16px; }
.cookie-card-left { display: flex; align-items: center; gap: 14px; }
.cookie-card-icon { width: 42px; height: 42px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 19px; background: var(--surface); border: 1px solid var(--border); }
.cookie-card-name { font-size: 15px; font-weight: 700; color: var(--text); margin-bottom: 3px; }
.cookie-card-sub { font-size: 12px; color: var(--muted); }
.cookie-card-badge { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; padding: 4px 12px; border-radius: var(--r-pill); flex-shrink: 0; }
.badge-required { background: var(--surface2); color: var(--muted); border: 1px solid var(--border2); }
.badge-optional { background: var(--lime-dim); color: var(--lime); border: 1px solid var(--lime-glow); }
.cookie-card-body { padding: 18px 24px 20px; border-top: 1px solid var(--border); }
.cookie-card-desc { font-size: 14px; color: var(--sub); line-height: 1.7; margin-bottom: 14px; }
.cookie-card-examples { display: flex; flex-wrap: wrap; gap: 6px; }
.cookie-tag { font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: var(--r-pill); background: var(--surface); border: 1px solid var(--border2); color: var(--muted); }

/* TOGGLE */
.pref-section { background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden; margin: 24px 0; }
.pref-row { display: flex; align-items: center; justify-content: space-between; padding: 20px 24px; gap: 24px; border-bottom: 1px solid var(--border); }
.pref-row:last-child { border-bottom: none; }
.pref-row-info { flex: 1; }
.pref-row-title { font-size: 14px; font-weight: 700; color: var(--text); margin-bottom: 4px; }
.pref-row-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
.pref-toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; cursor: pointer; }
.pref-toggle input { opacity: 0; width: 0; height: 0; position: absolute; }
.pref-toggle-track { position: absolute; inset: 0; border-radius: 12px; background: var(--border2); transition: background 0.2s; border: 1px solid var(--border2); }
.pref-toggle input:checked + .pref-toggle-track { background: var(--lime); border-color: var(--lime); }
.pref-toggle-thumb { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.15); transition: transform 0.2s; pointer-events: none; }
.pref-toggle input:checked ~ .pref-toggle-thumb { transform: translateX(20px); }
.pref-toggle-disabled { opacity: 0.4; cursor: not-allowed; }

.pref-save-row { display: flex; align-items: center; gap: 14px; margin-top: 20px; }
.btn-primary { display: inline-flex; align-items: center; font-family: var(--sans); font-size: 14px; font-weight: 700; cursor: pointer; border: none; border-radius: var(--r-pill); background: var(--text); color: #fff; padding: 0 8px 0 22px; height: 46px; transition: opacity 0.2s; white-space: nowrap; }
.btn-primary .arrow-box { width: 30px; height: 30px; border-radius: 50%; background: var(--purple); display: flex; align-items: center; justify-content: center; margin-left: 12px; flex-shrink: 0; }
.btn-primary:hover { opacity: 0.85; }
.btn-outline-sm { display: inline-flex; align-items: center; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border2); border-radius: var(--r-pill); background: transparent; color: var(--sub); padding: 10px 18px; transition: border-color 0.2s, color 0.2s; white-space: nowrap; }
.btn-outline-sm:hover { border-color: var(--sub); color: var(--text); }
.pref-saved { font-size: 13px; color: var(--lime); font-weight: 600; opacity: 0; transition: opacity 0.3s; }
.pref-saved.show { opacity: 1; }

/* CONTACT CARD */
.doc-contact { background: linear-gradient(135deg, #f0f9e6 0%, #f5f0ff 50%, #f0f9e6 100%); border: 1px solid var(--border); border-radius: var(--r-card); padding: 32px 36px; margin-top: 48px; position: relative; overflow: hidden; }
.doc-contact-glow { position: absolute; top: -50%; right: -10%; width: 300px; height: 300px; border-radius: 50%; background: radial-gradient(ellipse, rgba(61,187,0,0.1) 0%, transparent 70%); pointer-events: none; }
.doc-contact h3 { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 10px; letter-spacing: -0.02em; }
.doc-contact p { font-size: 14px; color: var(--sub); line-height: 1.7; margin-bottom: 20px; }
.doc-contact-email { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--lime); background: var(--lime-dim); border: 1px solid var(--lime-glow); border-radius: var(--r-pill); padding: 8px 18px; cursor: pointer; text-decoration: none; transition: background 0.2s; }
.doc-contact-email:hover { background: rgba(61,187,0,0.15); }

@media (max-width: 900px) {
  .doc-root { grid-template-columns: 1fr; padding: 96px 24px 80px; gap: 40px; }
  .doc-sidebar { display: none; }
  .nav { padding: 0 20px; }
  .pref-row { flex-direction: column; align-items: flex-start; gap: 14px; }
}
`;

const Arrow = ({ size = 14, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const SECTIONS = [
  { id: "overview",     label: "What Are Cookies?" },
  { id: "how-we-use",  label: "How We Use Cookies" },
  { id: "types",       label: "Types of Cookies" },
  { id: "third-party", label: "Third-Party Cookies" },
  { id: "preferences", label: "Your Preferences" },
  { id: "browser",     label: "Browser Controls" },
  { id: "duration",    label: "Cookie Durations" },
  { id: "updates",     label: "Policy Updates" },
  { id: "contact",     label: "Contact Us" },
];

const COOKIE_TYPES = [
  { icon:"🔒", name:"Essential Cookies",  sub:"Always active",                 required:true,  desc:"These cookies are strictly necessary for the Lixeen platform to function. They enable core features like user authentication, session management, security token handling, and fraud prevention. Without these cookies, the platform cannot operate.", examples:["auth_session","csrf_token","device_id","rate_limit_key","sec_challenge"] },
  { icon:"⚙️", name:"Functional Cookies", sub:"Personalisation & preferences", required:false, desc:"These cookies remember your choices and settings to provide a more personalised experience. This includes your dashboard layout preferences, notification settings, language selection, timezone, and UI state. Disabling these cookies will not prevent you from using the platform, but some preferences will reset between sessions.", examples:["ui_prefs","locale","timezone","dashboard_layout","notif_settings"] },
  { icon:"📊", name:"Analytics Cookies",  sub:"Usage & performance insights",  required:false, desc:"We use analytics cookies to understand how users interact with the platform in aggregate — which features are used most, where people encounter friction, and how platform performance can be improved. These cookies do not track you across third-party sites.", examples:["_lx_session","_lx_ref","perf_trace","feature_flags"] },
  { icon:"🛡️", name:"Security Cookies",  sub:"Fraud & bot prevention",        required:true,  desc:"These cookies support our fraud detection and bot prevention systems. They help us identify unusual access patterns, verify that task submissions are coming from legitimate human users, and protect the platform from automated abuse.", examples:["_recaptcha","bot_score","risk_signal","fingerprint_id"] },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id); if (!el) return null;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { rootMargin: "-30% 0px -65% 0px" });
      obs.observe(el); return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);
  return active;
}

function Li({ children }) {
  return <div className="doc-list-item"><div className="doc-list-bullet"/><span>{children}</span></div>;
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <label className={`pref-toggle${disabled ? " pref-toggle-disabled" : ""}`}>
      <input type="checkbox" checked={checked} onChange={onChange} disabled={disabled}/>
      <div className="pref-toggle-track"/>
      <div className="pref-toggle-thumb"/>
    </label>
  );
}

export default function CookiePolicy() {
  const active = useActiveSection(SECTIONS.map(s => s.id));
  const [prefs, setPrefs] = useState({ functional: true, analytics: true });
  const [saved, setSaved] = useState(false);

  const savePrefs = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <>
      <style>{G}</style>
      <nav className="nav">
        <NavLogo />
        <div className="nav-right">
          <Link to="/terms"   className="nav-link-plain">Terms</Link>
          <Link to="/privacy" className="nav-link-plain">Privacy</Link>
          <Link to="/"        className="nav-link-plain">Back to Home</Link>
        </div>
      </nav>

      <div className="doc-root">
        {/* SIDEBAR */}
        <aside className="doc-sidebar">
          <div className="sidebar-label">On this page</div>
          <nav className="sidebar-nav">
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`} className={`sidebar-link${active===s.id?" active":""}`}>{s.label}</a>
            ))}
          </nav>
          <div className="sidebar-divider"/>
          <div className="sidebar-meta"><strong>Last updated</strong>March 1, 2026</div>
          <div className="sidebar-meta" style={{marginTop:14}}><strong>Effective date</strong>March 1, 2026</div>
          <div className="sidebar-meta" style={{marginTop:14}}><strong>Questions?</strong>privacy@lixeen.com</div>
        </aside>

        {/* MAIN */}
        <main>
          <div className="doc-hero">
            <div className="doc-eyebrow">Legal</div>
            <h1 className="doc-h1">Cookie Policy</h1>
            <p className="doc-intro">This policy explains what cookies and similar tracking technologies are, how Lixeen uses them, and the choices you have. We've kept it clear and direct — no legal maze. You can also manage your cookie preferences directly on this page.</p>
            <div className="doc-meta-row">
              <div className="doc-meta-item"><div className="doc-meta-dot"/><span>Effective: <strong>March 1, 2026</strong></span></div>
              <div className="doc-meta-item"><div className="doc-meta-dot"/><span>Last updated: <strong>March 1, 2026</strong></span></div>
              <div className="doc-meta-item"><div className="doc-meta-dot"/><span>Version: <strong>1.2</strong></span></div>
            </div>
          </div>

          <section className="doc-section" id="overview">
            <div className="doc-section-num">Section 01</div>
            <h2 className="doc-h2">What Are Cookies?</h2>
            <p className="doc-p">Cookies are small text files stored on your device when you visit a website or use a web application. They are widely used to make sites work efficiently, remember your preferences, and provide information to site owners.</p>
            <p className="doc-p">Beyond cookies, we also use similar tracking technologies including:</p>
            <div className="doc-list">
              <Li><strong>Local storage:</strong> A browser feature that stores data locally on your device. Unlike cookies, local storage data is not automatically sent to our servers and has no built-in expiry.</Li>
              <Li><strong>Session storage:</strong> Similar to local storage but cleared automatically when your browser tab is closed. We use this for temporary UI state.</Li>
              <Li><strong>Pixel tags / web beacons:</strong> Tiny invisible images that signal when content has been loaded. We do not currently use these for marketing purposes.</Li>
              <Li><strong>Device fingerprinting signals:</strong> Certain security cookies collect non-personal technical attributes of your device to generate fraud risk signals. These are never used for advertising.</Li>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="how-we-use">
            <div className="doc-section-num">Section 02</div>
            <h2 className="doc-h2">How We Use Cookies</h2>
            <p className="doc-p">Lixeen uses cookies for four distinct purposes. We do not use cookies for advertising, retargeting, or to build profiles for sale to third parties.</p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead><tr><th>Purpose</th><th>Description</th><th>Can be disabled?</th></tr></thead>
                <tbody>
                  {[
                    ["Authentication & security","Keep you logged in securely, protect your account from session hijacking, and verify the integrity of requests.","No"],
                    ["Fraud & bot prevention","Detect automated abuse, protect task submissions from being fabricated by bots, and enforce rate limits.","No"],
                    ["Personalisation","Remember your dashboard settings, language, timezone, and UI preferences between sessions.","Yes"],
                    ["Analytics","Measure how features are used in aggregate to improve the platform. No personal data is shared with analytics providers.","Yes"],
                  ].map(([p,d,dis]) => (
                    <tr key={p}><td>{p}</td><td>{d}</td><td style={{color:dis==="No"?"var(--muted)":"var(--lime)",fontWeight:600}}>{dis}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="doc-callout">
              <p><strong>We never use cookies for advertising.</strong> Lixeen does not serve ads, does not partner with ad networks, and does not use cookies to track you across other websites for marketing purposes.</p>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="types">
            <div className="doc-section-num">Section 03</div>
            <h2 className="doc-h2">Types of Cookies We Use</h2>
            <p className="doc-p">Below is a detailed breakdown of each category of cookie we use, what it does, and whether you can disable it.</p>
            <div className="cookie-cards">
              {COOKIE_TYPES.map(c => (
                <div className="cookie-card" key={c.name}>
                  <div className="cookie-card-head">
                    <div className="cookie-card-left">
                      <div className="cookie-card-icon">{c.icon}</div>
                      <div><div className="cookie-card-name">{c.name}</div><div className="cookie-card-sub">{c.sub}</div></div>
                    </div>
                    <span className={`cookie-card-badge ${c.required?"badge-required":"badge-optional"}`}>{c.required?"Required":"Optional"}</span>
                  </div>
                  <div className="cookie-card-body">
                    <div className="cookie-card-desc">{c.desc}</div>
                    <div className="cookie-card-examples">{c.examples.map(e => <span className="cookie-tag" key={e}>{e}</span>)}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="third-party">
            <div className="doc-section-num">Section 04</div>
            <h2 className="doc-h2">Third-Party Cookies</h2>
            <p className="doc-p">Some cookies on the Lixeen platform are set by third-party services we use. These third parties operate under their own privacy policies, and we have data processing agreements in place with each of them.</p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead><tr><th>Provider</th><th>Purpose</th><th>Category</th><th>Privacy Policy</th></tr></thead>
                <tbody>
                  {[
                    ["Google reCAPTCHA","Bot and fraud detection on login and task submission forms","Security","policies.google.com/privacy"],
                    ["Stripe","Payment processing and fraud signals for billing flows","Essential","stripe.com/privacy"],
                    ["Plausible Analytics","Privacy-preserving, cookieless-first aggregate analytics (no personal data)","Analytics","plausible.io/privacy"],
                    ["Intercom","In-app customer support chat widget and support ticket management","Functional","intercom.com/legal/privacy"],
                  ].map(([p,pur,cat,pol]) => (
                    <tr key={p}><td>{p}</td><td>{pur}</td><td style={{color:cat==="Essential"||cat==="Security"?"var(--muted)":"var(--lime)",fontWeight:600}}>{cat}</td><td style={{color:"var(--muted)",fontSize:12}}>{pol}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="preferences">
            <div className="doc-section-num">Section 05</div>
            <h2 className="doc-h2">Your Cookie Preferences</h2>
            <p className="doc-p">You can manage your non-essential cookie preferences below. Essential and security cookies cannot be disabled as they are required for the platform to function.</p>
            <div className="pref-section">
              {[
                { key:"essential", title:"Essential & Security Cookies", desc:"Required for authentication, session management, fraud prevention, and platform security. Cannot be disabled.", disabled:true, value:true },
                { key:"functional", title:"Functional Cookies", desc:"Remember your preferences, layout settings, language, and UI customisations between sessions.", disabled:false, value:prefs.functional },
                { key:"analytics", title:"Analytics Cookies", desc:"Help us understand how the platform is used in aggregate to improve features and performance. No personal data is shared.", disabled:false, value:prefs.analytics },
              ].map(row => (
                <div className="pref-row" key={row.key}>
                  <div className="pref-row-info">
                    <div className="pref-row-title">{row.title}</div>
                    <div className="pref-row-desc">{row.desc}</div>
                  </div>
                  <Toggle checked={row.value} disabled={row.disabled} onChange={() => { if (!row.disabled) setPrefs(p => ({...p,[row.key]:!p[row.key]})); }}/>
                </div>
              ))}
            </div>
            <div className="pref-save-row">
              <button className="btn-primary" onClick={savePrefs}>
                Save preferences
                <div className="arrow-box"><Arrow size={13}/></div>
              </button>
              <button className="btn-outline-sm" onClick={() => setPrefs({functional:false,analytics:false})}>Reject all optional</button>
              <span className={`pref-saved${saved?" show":""}`}>✓ Preferences saved</span>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="browser">
            <div className="doc-section-num">Section 06</div>
            <h2 className="doc-h2">Browser-Level Cookie Controls</h2>
            <p className="doc-p">All modern browsers allow you to manage cookies at the browser level.</p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead><tr><th>Browser</th><th>How to manage cookies</th></tr></thead>
                <tbody>
                  {[
                    ["Google Chrome","Settings → Privacy and security → Cookies and other site data"],
                    ["Mozilla Firefox","Settings → Privacy & Security → Cookies and Site Data"],
                    ["Apple Safari","Preferences → Privacy → Manage Website Data"],
                    ["Microsoft Edge","Settings → Cookies and site permissions → Cookies and site data"],
                    ["Opera","Settings → Advanced → Privacy & security → Content settings → Cookies"],
                  ].map(([b,p]) => <tr key={b}><td>{b}</td><td>{p}</td></tr>)}
                </tbody>
              </table>
            </div>
            <p className="doc-p">Please be aware that blocking all cookies at the browser level will prevent you from logging in to Lixeen and will break core platform functionality.</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="duration">
            <div className="doc-section-num">Section 07</div>
            <h2 className="doc-h2">Cookie Durations</h2>
            <p className="doc-p">Cookies fall into two categories based on how long they persist on your device:</p>
            <div className="doc-list">
              <Li><strong>Session cookies:</strong> Temporary cookies that exist only for the duration of your browser session. Automatically deleted when you close your browser.</Li>
              <Li><strong>Persistent cookies:</strong> Cookies with a defined expiry date that remain on your device until they expire or are manually deleted.</Li>
            </div>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead><tr><th>Cookie Category</th><th>Type</th><th>Max Duration</th></tr></thead>
                <tbody>
                  {[
                    ["Essential (auth session)","Session","Until browser close or explicit logout"],
                    ["Essential (CSRF token)","Session","Until browser close"],
                    ["Security (device ID)","Persistent","12 months"],
                    ["Security (fraud signals)","Persistent","6 months"],
                    ["Functional (UI preferences)","Persistent","12 months"],
                    ["Analytics","Persistent","13 months"],
                    ["Third-party (reCAPTCHA)","Persistent","6 months (Google's policy)"],
                  ].map(([c,t,d]) => <tr key={c}><td>{c}</td><td>{t}</td><td style={{color:"var(--lime)",fontWeight:600}}>{d}</td></tr>)}
                </tbody>
              </table>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="updates">
            <div className="doc-section-num">Section 08</div>
            <h2 className="doc-h2">Policy Updates</h2>
            <p className="doc-p">We may update this Cookie Policy from time to time. When we make material changes, we will update the "Last updated" date and notify logged-in users via a platform banner.</p>
            <div className="doc-list">
              <Li>Minor updates will be made without individual notification.</Li>
              <Li>Material changes will be communicated with at least 14 days' notice.</Li>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="contact">
            <div className="doc-section-num">Section 09</div>
            <h2 className="doc-h2">Contact Us</h2>
            <p className="doc-p">If you have questions about this Cookie Policy or how we use cookies, our Privacy Team is happy to help.</p>
            <div className="doc-contact">
              <div className="doc-contact-glow"/>
              <h3>Questions about cookies?</h3>
              <p>Reach out to our Privacy Team for any questions about this policy, to request a full list of cookies we set, or to raise a concern about how we use tracking technologies.</p>
              <a className="doc-contact-email" href="mailto:privacy@lixeen.com">privacy@lixeen.com</a>
              <div style={{marginTop:24,display:"flex",flexDirection:"column",gap:8}}>
                {[
                  ["Mailing address","Lixeen Inc., 1209 Orange Street, Wilmington, DE 19801, United States"],
                  ["Response time","We aim to respond to all cookie and privacy enquiries within 5 business days."],
                  ["Related policies","For broader data practices, see our Privacy Policy and Terms of Service."],
                ].map(([label,val]) => (
                  <div key={label} style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                    <span style={{fontSize:12,fontWeight:700,color:"var(--muted)",textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap",paddingTop:2,minWidth:80}}>{label}</span>
                    <span style={{fontSize:13,color:"var(--sub)",lineHeight:1.6}}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}