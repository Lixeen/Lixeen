import { useState, useEffect, useRef } from "react";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";
import NavLogo from "../../components/NavLogo";

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
  --lime-bright: #c8f026;
  --lime-dim:  rgba(61,187,0,0.07);
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

/* ─── NAV ─── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 68px; display: flex; align-items: center;
  padding: 0 40px;
  background: rgba(255,255,255,0.96);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 0 var(--border);
}
.nav-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; flex-shrink: 0; cursor: pointer;
}
.nav-logo-mark {
  width: 34px; height: 34px; background: var(--lime-bright);
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
}
.nav-logo-name { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
.nav-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.nav-link-plain {
  font-size: 14px; font-weight: 500; color: var(--sub);
  cursor: pointer; transition: color 0.15s; padding: 8px 14px;
  border-radius: var(--r-pill); text-decoration: none;
}
.nav-link-plain:hover { color: var(--text); background: var(--surface2); }

/* ─── LAYOUT ─── */
.doc-root {
  display: grid;
  grid-template-columns: 260px 1fr;
  max-width: 1200px;
  margin: 0 auto;
  padding: 108px 40px 100px;
  gap: 64px;
  align-items: start;
}

/* ─── SIDEBAR ─── */
.doc-sidebar { position: sticky; top: 100px; }
.sidebar-label {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--muted); margin-bottom: 16px;
}
.sidebar-nav { display: flex; flex-direction: column; gap: 2px; }
.sidebar-link {
  font-size: 13.5px; font-weight: 500; color: var(--sub);
  padding: 8px 14px; border-radius: var(--r-sm); cursor: pointer;
  transition: background 0.15s, color 0.15s; border-left: 2px solid transparent;
  text-decoration: none; display: block;
}
.sidebar-link:hover { color: var(--text); background: var(--surface2); }
.sidebar-link.active { color: var(--lime); border-left-color: var(--lime); background: var(--lime-dim); }

.sidebar-divider { height: 1px; background: var(--border); margin: 20px 0; }
.sidebar-meta { font-size: 12px; color: var(--muted); line-height: 1.65; }
.sidebar-meta strong { color: var(--sub); display: block; margin-bottom: 4px; }

/* ─── HERO ─── */
.doc-hero {
  margin-bottom: 56px; padding-bottom: 48px;
  border-bottom: 1px solid var(--border);
  position: relative; overflow: hidden;
}
.doc-hero-orb {
  position: absolute; top: -60%; right: -15%;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(ellipse at 50% 50%,
    rgba(200,240,38,0.12) 0%,
    rgba(124,92,252,0.05) 50%,
    transparent 75%
  );
  pointer-events: none;
}
.doc-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--lime); background: var(--lime-dim); border: 1px solid var(--lime-glow);
  border-radius: var(--r-pill); padding: 5px 14px; margin-bottom: 20px;
}
.doc-h1 {
  font-size: clamp(32px, 4vw, 52px); font-weight: 800; color: var(--text);
  letter-spacing: -0.03em; line-height: 1.08; margin-bottom: 16px;
}
.doc-intro { font-size: 16px; color: var(--sub); line-height: 1.75; max-width: 680px; margin-bottom: 28px; }

.doc-meta-row { display: flex; align-items: center; gap: 24px; flex-wrap: wrap; }
.doc-meta-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }
.doc-meta-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lime-bright); flex-shrink: 0; }
.doc-meta-item strong { color: var(--sub); }

/* ─── SECTIONS ─── */
.doc-section { margin-bottom: 56px; scroll-margin-top: 96px; }
.doc-section-num {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 10.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em;
  color: var(--lime); background: var(--lime-dim); border: 1px solid var(--lime-glow);
  border-radius: var(--r-pill); padding: 3px 12px; margin-bottom: 14px;
}
.doc-h2 {
  font-size: clamp(20px, 2.5vw, 26px); font-weight: 800; color: var(--text);
  letter-spacing: -0.02em; margin-bottom: 18px; line-height: 1.2;
}
.doc-h3 { font-size: 15px; font-weight: 700; color: var(--text); margin: 24px 0 10px; letter-spacing: -0.01em; }
.doc-p { font-size: 15px; color: var(--sub); line-height: 1.8; margin-bottom: 16px; }
.doc-p:last-child { margin-bottom: 0; }

/* ─── CALLOUT ─── */
.doc-callout {
  background: var(--surface); border: 1px solid var(--border2);
  border-left: 3px solid var(--lime); border-radius: var(--r-sm);
  padding: 18px 22px; margin: 24px 0;
}
.doc-callout p { font-size: 14px; color: var(--sub); line-height: 1.7; margin: 0; }
.doc-callout strong { color: var(--text); }

/* ─── GRID — matches homepage features-grid pattern ─── */
.doc-grid {
  display: grid; grid-template-columns: repeat(2, 1fr);
  gap: 1px; background: var(--border);
  border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden;
  margin: 24px 0;
}
.doc-grid-item {
  background: #fff; padding: 22px 24px;
  transition: background 0.2s;
}
.doc-grid-item:hover { background: var(--surface); }
.doc-grid-item-title { font-size: 13px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
.doc-grid-item-desc { font-size: 13px; color: var(--muted); line-height: 1.65; }

/* ─── LIST ─── */
.doc-list { margin: 12px 0 16px 0; display: flex; flex-direction: column; gap: 10px; }
.doc-list-item { display: flex; align-items: flex-start; gap: 12px; font-size: 14.5px; color: var(--sub); line-height: 1.7; }
.doc-list-bullet { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); flex-shrink: 0; margin-top: 9px; }

/* ─── TABLE ─── */
.doc-table-wrap { overflow-x: auto; margin: 20px 0; border-radius: var(--r-card); border: 1px solid var(--border2); }
.doc-table { width: 100%; border-collapse: collapse; }
.doc-table th {
  text-align: left; padding: 12px 18px;
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.08em; color: var(--muted);
  background: var(--surface2); border-bottom: 1px solid var(--border);
}
.doc-table td {
  padding: 14px 18px; font-size: 13.5px; color: var(--sub);
  border-bottom: 1px solid var(--border); vertical-align: top; line-height: 1.65;
}
.doc-table tr:last-child td { border-bottom: none; }
.doc-table td:first-child { color: var(--text); font-weight: 600; white-space: nowrap; }

/* ─── DIVIDER ─── */
.doc-divider { height: 1px; background: var(--border); margin-bottom: 56px; }

/* ─── CONTACT — mirrors homepage CTA banner ─── */
.doc-contact {
  background: linear-gradient(135deg, #f0f9e6 0%, #f5f0ff 50%, #f0f9e6 100%);
  border: 1px solid var(--border); border-radius: var(--r-card);
  padding: 32px 36px; margin-top: 48px; position: relative; overflow: hidden;
}
.doc-contact-glow {
  position: absolute; top: -50%; right: -10%;
  width: 300px; height: 300px; border-radius: 50%;
  background: radial-gradient(ellipse, rgba(61,187,0,0.1) 0%, transparent 70%);
  pointer-events: none;
}
.doc-contact h3 { font-size: 20px; font-weight: 800; color: var(--text); margin-bottom: 10px; letter-spacing: -0.02em; }
.doc-contact p { font-size: 14px; color: var(--sub); line-height: 1.7; margin-bottom: 20px; }
.doc-contact-email {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 14px; font-weight: 600; color: #fff;
  background: var(--text); border-radius: var(--r-pill);
  padding: 10px 22px; cursor: pointer; text-decoration: none; transition: opacity 0.2s;
}
.doc-contact-email:hover { opacity: 0.85; }

/* ─── RESPONSIVE ─── */
@media (max-width: 900px) {
  .doc-root { grid-template-columns: 1fr; padding: 96px 24px 80px; gap: 40px; }
  .doc-sidebar { display: none; }
  .doc-grid { grid-template-columns: 1fr; }
  .nav { padding: 0 20px; }
}
`;

const LogoMark = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" fill="#000" fillOpacity="0.7" />
    <path d="M10 2L3 7l7 3 7-3L10 2z" fill="#000" fillOpacity="0.4" />
  </svg>
);

const SECTIONS = [
  { id: "overview",      label: "Overview" },
  { id: "information",   label: "Information We Collect" },
  { id: "how-we-use",    label: "How We Use Your Data" },
  { id: "sharing",       label: "Sharing & Disclosure" },
  { id: "retention",     label: "Data Retention" },
  { id: "security",      label: "Security" },
  { id: "rights",        label: "Your Rights" },
  { id: "cookies",       label: "Cookies & Tracking" },
  { id: "international", label: "International Transfers" },
  { id: "children",      label: "Children's Privacy" },
  { id: "changes",       label: "Policy Changes" },
  { id: "contact",       label: "Contact Us" },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(([e]) => {
        if (e.isIntersecting) setActive(id);
      }, { rootMargin: "-30% 0px -65% 0px" });
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);
  return active;
}

function Li({ children }) {
  return (
    <div className="doc-list-item">
      <div className="doc-list-bullet" />
      <span>{children}</span>
    </div>
  );
}

export default function PrivacyPolicy() {
  const active = useActiveSection(SECTIONS.map(s => s.id));

  return (
    <>
      <style>{G}</style>

      <nav className="nav">
        <NavLogo />
        <div className="nav-right">
          <Link to="/terms"   className="nav-link-plain">Terms</Link>
          <Link to="/cookies" className="nav-link-plain">Cookies</Link>
          <Link to="/"        className="nav-link-plain">← Back to Home</Link>
        </div>
      </nav>

      <div className="doc-root">

        {/* SIDEBAR */}
        <aside className="doc-sidebar">
          <div className="sidebar-label">On this page</div>
          <nav className="sidebar-nav">
            {SECTIONS.map(s => (
              <a key={s.id} href={`#${s.id}`}
                className={`sidebar-link${active === s.id ? " active" : ""}`}>
                {s.label}
              </a>
            ))}
          </nav>
          <div className="sidebar-divider" />
          <div className="sidebar-meta"><strong>Last updated</strong>March 1, 2026</div>
          <div className="sidebar-meta" style={{ marginTop: 14 }}><strong>Effective date</strong>March 1, 2026</div>
          <div className="sidebar-meta" style={{ marginTop: 14 }}><strong>Questions?</strong>privacy@lixeen.com</div>
        </aside>

        {/* MAIN */}
        <main className="doc-main">

          <div className="doc-hero">
            <div className="doc-hero-orb" />
            <div className="doc-eyebrow">Legal</div>
            <h1 className="doc-h1">Privacy Policy</h1>
            <p className="doc-intro">
              At Lixeen, your privacy is foundational — not an afterthought. This policy explains exactly what personal data we collect, why we collect it, how we use and protect it, and what rights you have over it. We've written it in plain language so you actually understand it.
            </p>
            <div className="doc-meta-row">
              <div className="doc-meta-item"><div className="doc-meta-dot" /><span>Effective: <strong>March 1, 2026</strong></span></div>
              <div className="doc-meta-item"><div className="doc-meta-dot" /><span>Last updated: <strong>March 1, 2026</strong></span></div>
              <div className="doc-meta-item"><div className="doc-meta-dot" /><span>Version: <strong>2.1</strong></span></div>
            </div>
          </div>

          {/* 1 */}
          <section className="doc-section" id="overview">
            <div className="doc-section-num">Section 01</div>
            <h2 className="doc-h2">Overview & Who We Are</h2>
            <p className="doc-p">Lixeen Inc. ("Lixeen", "we", "us", or "our") operates the Lixeen platform — a marketplace that connects AI companies and research labs with skilled human trainers for tasks including model training, evaluation, safety testing, and data annotation. This Privacy Policy applies to all users of our platform: companies, individual trainers, and visitors to our website at lixeen.com.</p>
            <p className="doc-p">Lixeen Inc. is incorporated in Delaware, United States, and acts as the data controller for personal information collected through our services. When we share data with third parties who process it on our behalf, those parties act as data processors under our instruction.</p>
            <div className="doc-callout">
              <p><strong>The short version:</strong> We collect what we need to run the platform, pay trainers fairly, and maintain quality. We don't sell your data. We don't share it with advertisers. We protect it with industry-standard security practices.</p>
            </div>
          </section>
          <div className="doc-divider" />

          {/* 2 */}
          <section className="doc-section" id="information">
            <div className="doc-section-num">Section 02</div>
            <h2 className="doc-h2">Information We Collect</h2>
            <p className="doc-p">We collect information in three ways: information you provide directly, information generated through your use of the platform, and information received from third parties.</p>
            <h3 className="doc-h3">Information You Provide</h3>
            <div className="doc-list">
              <Li><strong>Account registration:</strong> Name, email address, password, and account type (company or trainer).</Li>
              <Li><strong>Trainer profile:</strong> Skills, languages, areas of expertise, educational background, work history, and portfolio samples.</Li>
              <Li><strong>Company profile:</strong> Company name, industry, size, billing address, and contact details.</Li>
              <Li><strong>Payment information:</strong> For trainers, bank account or payment service details for payouts. For companies, credit card or invoice details. Full payment card numbers are never stored on our servers — they are handled directly by our PCI-DSS-compliant payment processors.</Li>
              <Li><strong>Tax documentation:</strong> For trainers earning above applicable thresholds, we may collect tax identification information (e.g. W-9, W-8BEN) as required by law.</Li>
              <Li><strong>Communications:</strong> Messages you send through our platform, support tickets, and feedback forms.</Li>
              <Li><strong>Task submissions:</strong> The content of tasks you complete, including text, annotations, responses, and evaluations.</Li>
            </div>
            <h3 className="doc-h3">Information Collected Automatically</h3>
            <div className="doc-list">
              <Li><strong>Usage data:</strong> Pages visited, features used, time spent on tasks, click patterns, and navigation paths.</Li>
              <Li><strong>Device and browser data:</strong> IP address, browser type and version, operating system, screen resolution, and device identifiers.</Li>
              <Li><strong>Performance data:</strong> Task completion rates, acceptance rates, turnaround times, and quality scores.</Li>
              <Li><strong>Log data:</strong> Server logs including request timestamps, referring URLs, and error logs.</Li>
            </div>
            <h3 className="doc-h3">Information From Third Parties</h3>
            <div className="doc-list">
              <Li><strong>Google OAuth:</strong> If you sign in with Google, we receive your name, email address, and profile photo from Google. We do not receive your Google password.</Li>
              <Li><strong>Identity verification providers:</strong> For anti-fraud and compliance purposes, we may receive verification status from identity verification partners.</Li>
              <Li><strong>Payment processors:</strong> Stripe and similar providers may share transaction status and fraud signals with us.</Li>
            </div>
          </section>
          <div className="doc-divider" />

          {/* 3 */}
          <section className="doc-section" id="how-we-use">
            <div className="doc-section-num">Section 03</div>
            <h2 className="doc-h2">How We Use Your Information</h2>
            <p className="doc-p">We use the information we collect for specific, legitimate purposes. We do not use your data for purposes incompatible with those described here without your consent.</p>
            <div className="doc-grid">
              {[
                { title: "Platform Operations",   desc: "To create and manage your account, match trainers to tasks, process payments, and deliver core platform functionality." },
                { title: "Quality & Safety",      desc: "To monitor task quality, detect fraud, prevent abuse, and maintain the integrity of our trainer and company ecosystems." },
                { title: "Communications",        desc: "To send you task notifications, payment confirmations, policy updates, and support responses. You can opt out of non-essential communications." },
                { title: "Legal Compliance",      desc: "To comply with tax reporting obligations, respond to lawful legal requests, and enforce our Terms of Service." },
                { title: "Product Improvement",   desc: "To analyse usage patterns and improve platform features, matching algorithms, and quality control systems. We use aggregated and anonymised data for this." },
                { title: "Security",              desc: "To detect, investigate, and prevent security incidents, unauthorised access, and fraudulent activity on the platform." },
              ].map(item => (
                <div className="doc-grid-item" key={item.title}>
                  <div className="doc-grid-item-title">{item.title}</div>
                  <div className="doc-grid-item-desc">{item.desc}</div>
                </div>
              ))}
            </div>
            <h3 className="doc-h3">Legal Basis for Processing (GDPR)</h3>
            <p className="doc-p">For users in the European Economic Area (EEA) and United Kingdom, our legal bases for processing personal data are:</p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead><tr><th>Processing Activity</th><th>Legal Basis</th></tr></thead>
                <tbody>
                  {[
                    ["Account creation and management", "Contract performance"],
                    ["Processing payments and payouts", "Contract performance"],
                    ["Tax reporting and compliance", "Legal obligation"],
                    ["Fraud detection and prevention", "Legitimate interests"],
                    ["Platform analytics and improvement", "Legitimate interests"],
                    ["Marketing communications", "Consent (opt-in)"],
                    ["Identity verification", "Legal obligation / Legitimate interests"],
                  ].map(([activity, basis]) => (
                    <tr key={activity}><td>{activity}</td><td>{basis}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          <div className="doc-divider" />

          {/* 4 */}
          <section className="doc-section" id="sharing">
            <div className="doc-section-num">Section 04</div>
            <h2 className="doc-h2">Sharing & Disclosure</h2>
            <p className="doc-p">We do not sell, rent, or trade your personal information to third parties. We share data only in the following limited circumstances:</p>
            <h3 className="doc-h3">Service Providers</h3>
            <p className="doc-p">We work with trusted third-party vendors who process data on our behalf under strict data processing agreements. These include:</p>
            <div className="doc-list">
              <Li><strong>Payment processors (Stripe):</strong> To process company billing and trainer payouts.</Li>
              <Li><strong>Cloud infrastructure (AWS, Google Cloud):</strong> To host and operate the platform.</Li>
              <Li><strong>Identity verification providers:</strong> To verify trainer identities and prevent fraud.</Li>
              <Li><strong>Analytics providers:</strong> To understand platform usage. We use privacy-preserving configurations and do not share personally identifiable data with analytics vendors.</Li>
              <Li><strong>Customer support tools:</strong> To manage support tickets and communications.</Li>
            </div>
            <h3 className="doc-h3">Between Platform Users</h3>
            <p className="doc-p">Company clients can see trainer performance metrics, task completion rates, and skill profiles, but never trainers' personal contact information, payment details, or full legal names unless explicitly shared by the trainer. Trainers can see task briefs and company names, but not company billing or contact details.</p>
            <h3 className="doc-h3">Legal Requirements</h3>
            <p className="doc-p">We may disclose your information if required by law, regulation, legal process, or enforceable governmental request, or where we believe disclosure is necessary to protect the rights, property, or safety of Lixeen, our users, or the public.</p>
            <h3 className="doc-h3">Business Transfers</h3>
            <p className="doc-p">In the event of a merger, acquisition, or sale of all or substantially all of our assets, your information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on our platform prior to any such transfer.</p>
            <div className="doc-callout">
              <p><strong>We will never:</strong> Sell your personal data to data brokers, share your data with advertisers for targeting purposes, or disclose task content to unauthorised parties.</p>
            </div>
          </section>
          <div className="doc-divider" />

          {/* 5 */}
          <section className="doc-section" id="retention">
            <div className="doc-section-num">Section 05</div>
            <h2 className="doc-h2">Data Retention</h2>
            <p className="doc-p">We retain personal information only for as long as necessary to fulfil the purposes described in this policy, comply with legal obligations, resolve disputes, and enforce our agreements.</p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead><tr><th>Data Type</th><th>Retention Period</th><th>Reason</th></tr></thead>
                <tbody>
                  {[
                    ["Account information", "Duration of account + 3 years", "Contract obligations and dispute resolution"],
                    ["Task submissions and outputs", "5 years from task completion", "Quality auditing and client contractual obligations"],
                    ["Payment records", "7 years", "Tax and financial regulatory requirements"],
                    ["Tax documentation (W-9/W-8BEN)", "7 years", "IRS and applicable tax law requirements"],
                    ["Support communications", "3 years from last contact", "Service quality and dispute resolution"],
                    ["Usage and log data", "13 months", "Security monitoring and fraud detection"],
                    ["Marketing preferences", "Until opt-out + 1 year", "Compliance with consent records"],
                  ].map(([type, period, reason]) => (
                    <tr key={type}>
                      <td>{type}</td>
                      <td style={{ color: "var(--lime)", fontWeight: 600 }}>{period}</td>
                      <td>{reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="doc-p">When your account is deleted, we anonymise or delete personal data subject to the retention periods above. Anonymised, aggregated data may be retained indefinitely for platform analytics.</p>
          </section>
          <div className="doc-divider" />

          {/* 6 */}
          <section className="doc-section" id="security">
            <div className="doc-section-num">Section 06</div>
            <h2 className="doc-h2">Security</h2>
            <p className="doc-p">We implement administrative, technical, and physical safeguards designed to protect your personal information against unauthorised access, loss, destruction, or alteration.</p>
            <div className="doc-list">
              <Li><strong>Encryption in transit:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher.</Li>
              <Li><strong>Encryption at rest:</strong> Sensitive data fields (including payment information and tax identifiers) are encrypted at rest using AES-256.</Li>
              <Li><strong>Access controls:</strong> Internal access to personal data is restricted to employees with a documented need. All access is logged and reviewed.</Li>
              <Li><strong>SOC 2 Type II:</strong> Our infrastructure partners maintain SOC 2 Type II certification. Enterprise plans include access to our security documentation.</Li>
              <Li><strong>Penetration testing:</strong> We conduct annual third-party penetration tests and address critical findings within 30 days.</Li>
              <Li><strong>Incident response:</strong> We maintain a formal incident response plan. In the event of a data breach affecting your rights, we will notify affected users within 72 hours as required by GDPR Article 33.</Li>
            </div>
            <p className="doc-p">No method of transmission over the internet or electronic storage is completely secure. While we strive to protect your personal information, we cannot guarantee its absolute security.</p>
          </section>
          <div className="doc-divider" />

          {/* 7 */}
          <section className="doc-section" id="rights">
            <div className="doc-section-num">Section 07</div>
            <h2 className="doc-h2">Your Rights</h2>
            <p className="doc-p">Depending on your location, you may have the following rights regarding your personal data. We honour these rights for all users globally, not just those in jurisdictions where they are legally mandated.</p>
            <div className="doc-grid">
              {[
                { title: "Right to Access",           desc: "Request a copy of all personal data we hold about you, including how it's used and with whom it's shared." },
                { title: "Right to Rectification",    desc: "Correct inaccurate or incomplete personal data. You can update most information directly in your account settings." },
                { title: "Right to Erasure",          desc: "Request deletion of your personal data. Subject to legal retention obligations, we will delete your data within 30 days." },
                { title: "Right to Portability",      desc: "Receive your personal data in a structured, machine-readable format (JSON or CSV) to transfer to another service." },
                { title: "Right to Object",           desc: "Object to processing based on legitimate interests, including profiling. We will stop unless we have compelling grounds." },
                { title: "Right to Restrict Processing", desc: "Request that we limit how we process your data while a dispute is pending or while you verify a rectification request." },
              ].map(item => (
                <div className="doc-grid-item" key={item.title}>
                  <div className="doc-grid-item-title">{item.title}</div>
                  <div className="doc-grid-item-desc">{item.desc}</div>
                </div>
              ))}
            </div>
            <h3 className="doc-h3">California Residents (CCPA/CPRA)</h3>
            <p className="doc-p">California residents have additional rights under the California Consumer Privacy Act, including the right to know, the right to delete, the right to correct, the right to opt out of the sale or sharing of personal information, and the right to non-discrimination for exercising these rights. We do not sell or share personal information as defined by the CCPA.</p>
            <h3 className="doc-h3">How to Exercise Your Rights</h3>
            <p className="doc-p">Submit requests to <strong style={{ color: "var(--lime)" }}>privacy@lixeen.com</strong> or via the Privacy Settings section of your account dashboard. We will respond within 30 days. We may require identity verification before processing sensitive requests.</p>
          </section>
          <div className="doc-divider" />

          {/* 8 */}
          <section className="doc-section" id="cookies">
            <div className="doc-section-num">Section 08</div>
            <h2 className="doc-h2">Cookies & Tracking Technologies</h2>
            <p className="doc-p">We use cookies and similar tracking technologies to operate the platform, remember your preferences, and understand how the platform is used.</p>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead><tr><th>Cookie Type</th><th>Purpose</th><th>Can be disabled?</th></tr></thead>
                <tbody>
                  {[
                    ["Essential",  "Authentication, session management, security tokens. Required for the platform to function.", "No"],
                    ["Functional", "Language preferences, dashboard layout, notification settings.", "Yes"],
                    ["Analytics",  "Aggregate usage statistics to improve the platform. No personally identifiable data is shared with analytics providers.", "Yes"],
                    ["Security",   "Fraud detection, bot prevention (e.g. reCAPTCHA signals).", "No"],
                  ].map(([type, purpose, disable]) => (
                    <tr key={type}>
                      <td>{type}</td>
                      <td>{purpose}</td>
                      <td style={{ color: disable === "No" ? "var(--muted)" : "var(--lime)", fontWeight: 600 }}>{disable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="doc-p">You can manage cookie preferences through the Cookie Settings panel, accessible from the footer of any page. Disabling non-essential cookies will not affect your ability to use core platform features.</p>
          </section>
          <div className="doc-divider" />

          {/* 9 */}
          <section className="doc-section" id="international">
            <div className="doc-section-num">Section 09</div>
            <h2 className="doc-h2">International Data Transfers</h2>
            <p className="doc-p">Lixeen operates globally and may transfer personal data to countries outside your country of residence, including the United States. When we transfer personal data from the EEA, UK, or Switzerland to the United States or other third countries, we rely on the following safeguards:</p>
            <div className="doc-list">
              <Li><strong>Standard Contractual Clauses (SCCs):</strong> We use the European Commission's approved SCCs for transfers to service providers outside the EEA.</Li>
              <Li><strong>UK International Data Transfer Agreements (IDTAs):</strong> For transfers from the United Kingdom, we use ICO-approved IDTAs.</Li>
              <Li><strong>Adequacy decisions:</strong> Where the European Commission or UK ICO has determined that a destination country provides adequate protection, we rely on that adequacy decision.</Li>
            </div>
            <p className="doc-p">A copy of our data transfer mechanisms is available upon request at privacy@lixeen.com.</p>
          </section>
          <div className="doc-divider" />

          {/* 10 */}
          <section className="doc-section" id="children">
            <div className="doc-section-num">Section 10</div>
            <h2 className="doc-h2">Children's Privacy</h2>
            <p className="doc-p">The Lixeen platform is intended for users who are 18 years of age or older. We do not knowingly collect or solicit personal information from anyone under the age of 18. If you believe we have inadvertently collected information from a minor, please contact us immediately at privacy@lixeen.com and we will delete that information as quickly as possible.</p>
          </section>
          <div className="doc-divider" />

          {/* 11 */}
          <section className="doc-section" id="changes">
            <div className="doc-section-num">Section 11</div>
            <h2 className="doc-h2">Policy Changes</h2>
            <p className="doc-p">We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:</p>
            <div className="doc-list">
              <Li>Post the updated policy on this page with a revised "Last updated" date.</Li>
              <Li>Send an email notification to all registered users at least 14 days before the changes take effect.</Li>
              <Li>Display a prominent banner on the platform dashboard until you acknowledge the update.</Li>
            </div>
            <p className="doc-p">Your continued use of the platform after the effective date of any changes constitutes your acceptance of the updated Privacy Policy. If you do not agree with material changes, you may close your account before the effective date.</p>
          </section>
          <div className="doc-divider" />

          {/* 12 */}
          <section className="doc-section" id="contact">
            <div className="doc-section-num">Section 12</div>
            <h2 className="doc-h2">Contact Us</h2>
            <p className="doc-p">If you have questions, concerns, or requests regarding this Privacy Policy or your personal data, please reach out to our Privacy Team. We aim to respond to all privacy enquiries within 5 business days.</p>
            <div className="doc-contact">
              <div className="doc-contact-glow" />
              <h3>Get in touch with our Privacy Team</h3>
              <p>For data requests, privacy concerns, or questions about this policy. For urgent security matters, please mark your email subject "URGENT: Security".</p>
              <a className="doc-contact-email" href="mailto:privacy@lixeen.com">privacy@lixeen.com</a>
              <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Mailing address", "Lixeen Inc., 1209 Orange Street, Wilmington, DE 19801, United States"],
                  ["EU Representative", "Available to EEA users upon request at privacy@lixeen.com"],
                  ["UK Representative", "Available to UK users upon request at privacy@lixeen.com"],
                  ["DPA / Data Processing Agreement", "Enterprise customers can request our standard DPA at legal@lixeen.com"],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", whiteSpace: "nowrap", paddingTop: 2, minWidth: 90 }}>{label}</span>
                    <span style={{ fontSize: 13, color: "var(--sub)", lineHeight: 1.65 }}>{val}</span>
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