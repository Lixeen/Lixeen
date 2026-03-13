import { useState, useEffect } from "react";
import Footer from "../../components/footer";
import { Link } from "react-router-dom";
import NavLogo from "../../components/NavLogo";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@300;400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:#ffffff; --surface:#f7f7f7; --surface2:#efefef;
  --border:#e5e5e5; --border2:#dddddd;
  --text:#0a0a0a; --sub:#555555; --muted:#999999;
  --lime:#3dbb00; --lime-dim:rgba(61,187,0,0.08); --lime-glow:rgba(61,187,0,0.18);
  --purple:#7c5cfc;
  --sans:'Anek Devanagari',system-ui,sans-serif;
  --r-pill:999px; --r-card:16px; --r-sm:8px;
}
html { scroll-behavior: smooth; }
body { font-family:var(--sans); color:var(--text); background:var(--bg); -webkit-font-smoothing:antialiased; overflow-x:hidden; }
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}
.nav{position:fixed;top:0;left:0;right:0;z-index:100;height:68px;display:flex;align-items:center;padding:0 40px;background:rgba(255,255,255,0.96);backdrop-filter:blur(20px);border-bottom:1px solid var(--border);box-shadow:0 1px 0 var(--border);}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;cursor:pointer;}
.nav-logo-mark{width:34px;height:34px;background:#c8f026;border-radius:10px;display:flex;align-items:center;justify-content:center;}
.nav-logo-name{font-size:20px;font-weight:800;color:var(--text);letter-spacing:-0.5px;}
.nav-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.nav-link-plain{font-size:14px;font-weight:500;color:var(--sub);cursor:pointer;transition:color 0.15s;padding:8px 4px;text-decoration:none;}
.nav-link-plain:hover{color:var(--text);}
.doc-root{display:grid;grid-template-columns:260px 1fr;max-width:1200px;margin:0 auto;padding:108px 40px 100px;gap:64px;align-items:start;}
.doc-sidebar{position:sticky;top:100px;}
.sidebar-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);margin-bottom:16px;}
.sidebar-nav{display:flex;flex-direction:column;gap:2px;}
.sidebar-link{font-size:13.5px;font-weight:500;color:var(--sub);padding:8px 14px;border-radius:var(--r-sm);cursor:pointer;transition:background 0.15s,color 0.15s;border-left:2px solid transparent;text-decoration:none;display:block;}
.sidebar-link:hover{color:var(--text);background:var(--surface2);}
.sidebar-link.active{color:var(--lime);border-left-color:var(--lime);background:var(--lime-dim);}
.sidebar-divider{height:1px;background:var(--border);margin:20px 0;}
.sidebar-meta{font-size:12px;color:var(--muted);line-height:1.65;}
.sidebar-meta strong{color:var(--sub);display:block;margin-bottom:4px;}
.doc-hero{margin-bottom:56px;padding-bottom:48px;border-bottom:1px solid var(--border);}
.doc-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--lime);background:var(--lime-dim);border:1px solid var(--lime-glow);border-radius:var(--r-pill);padding:5px 14px;margin-bottom:20px;}
.doc-h1{font-size:clamp(32px,4vw,52px);font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1.08;margin-bottom:16px;}
.doc-intro{font-size:16px;color:var(--sub);line-height:1.75;max-width:680px;margin-bottom:28px;}
.doc-meta-row{display:flex;align-items:center;gap:24px;flex-wrap:wrap;}
.doc-meta-item{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--muted);}
.doc-meta-dot{width:6px;height:6px;border-radius:50%;background:var(--border2);flex-shrink:0;}
.doc-meta-item strong{color:var(--sub);}
.doc-section{margin-bottom:56px;scroll-margin-top:96px;}
.doc-section-num{font-size:11px;font-weight:700;color:var(--lime);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:10px;}
.doc-h2{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-0.02em;margin-bottom:18px;line-height:1.2;}
.doc-h3{font-size:16px;font-weight:700;color:var(--text);margin:24px 0 10px;letter-spacing:-0.01em;}
.doc-p{font-size:15px;color:var(--sub);line-height:1.8;margin-bottom:16px;}
.doc-p:last-child{margin-bottom:0;}
.doc-callout{background:var(--surface);border:1px solid var(--border2);border-left:3px solid var(--lime);border-radius:var(--r-sm);padding:18px 22px;margin:24px 0;}
.doc-callout p{font-size:14px;color:var(--sub);line-height:1.7;margin:0;}
.doc-callout strong{color:var(--text);}
.doc-callout.warning{border-left-color:#f59e0b;background:#fffbeb;}
.doc-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin:24px 0;}
.doc-grid-item{background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:20px 22px;box-shadow:0 1px 4px rgba(0,0,0,0.04);}
.doc-grid-item-title{font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px;}
.doc-grid-item-desc{font-size:13px;color:var(--muted);line-height:1.65;}
.doc-list{margin:12px 0 16px 0;display:flex;flex-direction:column;gap:10px;}
.doc-list-item{display:flex;align-items:flex-start;gap:12px;font-size:14.5px;color:var(--sub);line-height:1.7;}
.doc-list-bullet{width:6px;height:6px;border-radius:50%;background:var(--lime);flex-shrink:0;margin-top:9px;}
.doc-table-wrap{overflow-x:auto;margin:20px 0;border-radius:var(--r-card);border:1px solid var(--border2);}
.doc-table{width:100%;border-collapse:collapse;}
.doc-table th{text-align:left;padding:12px 18px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);background:var(--surface2);border-bottom:1px solid var(--border);}
.doc-table td{padding:14px 18px;font-size:13.5px;color:var(--sub);border-bottom:1px solid var(--border);vertical-align:top;line-height:1.65;}
.doc-table tr:last-child td{border-bottom:none;}
.doc-table td:first-child{color:var(--text);font-weight:600;}
.doc-divider{height:1px;background:var(--border);margin-bottom:56px;}
.doc-contact{background:linear-gradient(135deg,#f0f9e6 0%,#f5f0ff 50%,#f0f9e6 100%);border:1px solid var(--border);border-radius:var(--r-card);padding:32px 36px;margin-top:48px;position:relative;overflow:hidden;}
.doc-contact-glow{position:absolute;top:-50%;right:-10%;width:300px;height:300px;border-radius:50%;background:radial-gradient(ellipse,rgba(61,187,0,0.1) 0%,transparent 70%);pointer-events:none;}
.doc-contact h3{font-size:20px;font-weight:800;color:var(--text);margin-bottom:10px;letter-spacing:-0.02em;}
.doc-contact p{font-size:14px;color:var(--sub);line-height:1.7;margin-bottom:20px;}
.doc-contact-email{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:var(--lime);background:var(--lime-dim);border:1px solid var(--lime-glow);border-radius:var(--r-pill);padding:8px 18px;cursor:pointer;text-decoration:none;transition:background 0.2s;}
.doc-contact-email:hover{background:rgba(61,187,0,0.15);}
@media(max-width:900px){.doc-root{grid-template-columns:1fr;padding:96px 24px 80px;gap:40px;}.doc-sidebar{display:none;}.doc-grid{grid-template-columns:1fr;}.nav{padding:0 20px;}}
`;

const SECTIONS = [
  { id:"agreement",       label:"Agreement to Terms" },
  { id:"platform",        label:"The Platform" },
  { id:"accounts",        label:"Accounts & Eligibility" },
  { id:"companies",       label:"Company Obligations" },
  { id:"trainers",        label:"Trainer Obligations" },
  { id:"payments",        label:"Payments & Fees" },
  { id:"ip",              label:"Intellectual Property" },
  { id:"confidential",    label:"Confidentiality" },
  { id:"conduct",         label:"Acceptable Use" },
  { id:"warranties",      label:"Disclaimers & Warranties" },
  { id:"liability",       label:"Limitation of Liability" },
  { id:"indemnification", label:"Indemnification" },
  { id:"termination",     label:"Termination" },
  { id:"disputes",        label:"Disputes & Governing Law" },
  { id:"general",         label:"General Provisions" },
  { id:"contact",         label:"Contact" },
];

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map(id => {
      const el = document.getElementById(id); if (!el) return null;
      const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(id); }, { rootMargin:"-30% 0px -65% 0px" });
      obs.observe(el); return obs;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);
  return active;
}

function Li({ children }) {
  return <div className="doc-list-item"><div className="doc-list-bullet"/><span>{children}</span></div>;
}

export default function TermsOfService() {
  const active = useActiveSection(SECTIONS.map(s => s.id));

  return (
    <>
      <style>{G}</style>
      <nav className="nav">
        <NavLogo />
        <div className="nav-right">
          <Link to="/privacy" className="nav-link-plain">Privacy Policy</Link>
          <Link to="/cookies" className="nav-link-plain">Cookies</Link>
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
          <div className="sidebar-meta" style={{marginTop:14}}><strong>Questions?</strong>legal@lixeen.com</div>
        </aside>

        {/* MAIN */}
        <main>
          <div className="doc-hero">
            <div className="doc-eyebrow">Legal</div>
            <h1 className="doc-h1">Terms of Service</h1>
            <p className="doc-intro">These Terms of Service govern your access to and use of the Lixeen platform. Please read them carefully. By creating an account or using our services, you agree to be bound by these terms.</p>
            <div className="doc-meta-row">
              <div className="doc-meta-item"><div className="doc-meta-dot"/><span>Effective: <strong>March 1, 2026</strong></span></div>
              <div className="doc-meta-item"><div className="doc-meta-dot"/><span>Last updated: <strong>March 1, 2026</strong></span></div>
              <div className="doc-meta-item"><div className="doc-meta-dot"/><span>Version: <strong>3.0</strong></span></div>
            </div>
          </div>

          <section className="doc-section" id="agreement">
            <div className="doc-section-num">Section 01</div>
            <h2 className="doc-h2">Agreement to Terms</h2>
            <p className="doc-p">These Terms of Service ("Terms") constitute a legally binding agreement between you and Lixeen Inc. ("Lixeen"), a Delaware corporation, governing your use of the Lixeen platform, website, APIs, and all related services (collectively, the "Services").</p>
            <p className="doc-p">By registering for an account or otherwise accessing or using our Services, you confirm that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.</p>
            <div className="doc-callout">
              <p><strong>Arbitration notice:</strong> Section 14 of these Terms contains an arbitration clause and class action waiver that affects your legal rights. Please read it carefully.</p>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="platform">
            <div className="doc-section-num">Section 02</div>
            <h2 className="doc-h2">The Platform</h2>
            <p className="doc-p">Lixeen operates a two-sided marketplace connecting AI companies ("Companies") with skilled human contributors ("Trainers") for AI-related tasks including model training, RLHF, model evaluation, safety and red-team testing, and data annotation.</p>
            <p className="doc-p">Lixeen is a platform facilitator. We are not a party to the underlying work product agreements between Companies and Trainers, except as expressly stated in these Terms. We reserve the right to modify, suspend, or discontinue any aspect of the Services at any time.</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="accounts">
            <div className="doc-section-num">Section 03</div>
            <h2 className="doc-h2">Accounts & Eligibility</h2>
            <h3 className="doc-h3">Eligibility</h3>
            <div className="doc-list">
              <Li>Be at least 18 years of age.</Li>
              <Li>Have the legal capacity to enter into a binding contract in your jurisdiction.</Li>
              <Li>Not be located in a country subject to US government embargo or on any US government restricted-party list.</Li>
            </div>
            <h3 className="doc-h3">Account Registration</h3>
            <p className="doc-p">You must provide accurate, complete, and current information during registration. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. Notify us immediately at security@lixeen.com if you suspect unauthorised access.</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="companies">
            <div className="doc-section-num">Section 04</div>
            <h2 className="doc-h2">Company Obligations</h2>
            <h3 className="doc-h3">Task Requirements</h3>
            <div className="doc-list">
              <Li>You will provide clear, accurate, and complete task briefs, rubrics, and guidelines before work commences.</Li>
              <Li>You will not submit tasks that require Trainers to produce illegal content, generate harmful misinformation, or assist in creating weapons.</Li>
              <Li>You are responsible for ensuring that any materials you provide do not infringe the intellectual property rights of third parties.</Li>
              <Li>You will not attempt to establish direct contact with Trainers outside the Lixeen platform for the purpose of circumventing platform fees.</Li>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="trainers">
            <div className="doc-section-num">Section 05</div>
            <h2 className="doc-h2">Trainer Obligations</h2>
            <h3 className="doc-h3">Work Quality & Integrity</h3>
            <div className="doc-list">
              <Li>You will complete tasks honestly, independently, and to the best of your abilities.</Li>
              <Li>You will not use AI tools to automate task completion unless explicitly permitted. Use of AI to generate responses in tasks requiring human judgment constitutes fraud and will result in immediate account termination and forfeiture of pending payments.</Li>
              <Li>You will not share task content, instructions, datasets, or outputs with any third party except as required by law.</Li>
            </div>
            <h3 className="doc-h3">Independent Contractor Status</h3>
            <p className="doc-p">Trainers are independent contractors, not employees, agents, or partners of Lixeen or any Company. You are responsible for all taxes applicable to your earnings and for complying with all applicable laws governing your independent contractor status in your jurisdiction.</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="payments">
            <div className="doc-section-num">Section 06</div>
            <h2 className="doc-h2">Payments & Fees</h2>
            <h3 className="doc-h3">Trainer Payments</h3>
            <div className="doc-list">
              <Li>Trainers are paid for tasks that are accepted and not disputed within the acceptance window (default: 72 hours after submission).</Li>
              <Li>Payments are processed weekly. Minimum payout thresholds may apply depending on your country.</Li>
              <Li>Lixeen retains a platform fee from task compensation. The fee applicable to your account is displayed in your account settings and may be updated with 30 days' notice.</Li>
            </div>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead><tr><th>Situation</th><th>Outcome</th></tr></thead>
                <tbody>
                  {[
                    ["Task accepted within acceptance window","Payment released at next weekly cycle"],
                    ["Task rejected for quality reasons","Payment withheld; trainer may dispute within 5 days"],
                    ["Task cancelled by Company before completion","Partial payment based on work completed"],
                    ["Task cancelled by Trainer after acceptance","No payment; performance score impacted"],
                    ["Platform determines fraudulent submission","Payment forfeited; account may be terminated"],
                  ].map(([s,o]) => <tr key={s}><td>{s}</td><td>{o}</td></tr>)}
                </tbody>
              </table>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="ip">
            <div className="doc-section-num">Section 07</div>
            <h2 className="doc-h2">Intellectual Property</h2>
            <h3 className="doc-h3">Task Outputs</h3>
            <p className="doc-p">Upon full payment for a completed task, Trainers assign to the applicable Company all right, title, and interest — including all intellectual property rights — in and to the task outputs ("Work Product"). This assignment is worldwide, perpetual, irrevocable, and royalty-free.</p>
            <h3 className="doc-h3">Lixeen Platform IP</h3>
            <p className="doc-p">The Lixeen platform, including its software, design, trademarks, logos, and all associated intellectual property, is owned by Lixeen Inc. or its licensors. These Terms do not grant you any right, title, or interest in Lixeen's IP.</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="confidential">
            <div className="doc-section-num">Section 08</div>
            <h2 className="doc-h2">Confidentiality</h2>
            <p className="doc-p">"Confidential Information" means any non-public information disclosed through the platform, including task briefs, datasets, model architectures, evaluation rubrics, business strategies, and pricing details.</p>
            <div className="doc-list">
              <Li>You will not disclose Confidential Information to any third party without prior written consent from the disclosing party.</Li>
              <Li>You will use Confidential Information only for the purposes of completing tasks or receiving services on the platform.</Li>
              <Li>Confidentiality obligations survive termination of your account for a period of three (3) years, or indefinitely for trade secrets.</Li>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="conduct">
            <div className="doc-section-num">Section 09</div>
            <h2 className="doc-h2">Acceptable Use Policy</h2>
            <p className="doc-p">You agree not to use the Lixeen platform for any of the following prohibited activities:</p>
            <div className="doc-grid">
              {[
                { title:"Illegal Activities",    desc:"Any use that violates applicable local, national, or international law, including export control laws and regulations." },
                { title:"Harmful Content",       desc:"Generating, submitting, or facilitating content that promotes violence, hatred, discrimination, or that sexualises minors in any way." },
                { title:"Fraud & Deception",     desc:"Creating fake accounts, misrepresenting your identity or qualifications, submitting AI-generated work as human work, or circumventing quality controls." },
                { title:"Platform Circumvention",desc:"Soliciting or accepting tasks outside the Lixeen platform with parties you first met through Lixeen, for a period of 12 months after last contact on-platform." },
                { title:"Security Violations",   desc:"Attempting to probe, scan, or test the vulnerability of the platform, or circumventing any authentication or security measures." },
                { title:"Interference",          desc:"Transmitting malware, engaging in DDoS attacks, or taking any action that imposes an unreasonable load on our infrastructure." },
              ].map(item => (
                <div className="doc-grid-item" key={item.title}>
                  <div className="doc-grid-item-title">{item.title}</div>
                  <div className="doc-grid-item-desc">{item.desc}</div>
                </div>
              ))}
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="warranties">
            <div className="doc-section-num">Section 10</div>
            <h2 className="doc-h2">Disclaimers & Warranties</h2>
            <div className="doc-callout warning">
              <p><strong>Important:</strong> The following section limits Lixeen's liability and your warranties. Please read carefully.</p>
            </div>
            <p className="doc-p">THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="liability">
            <div className="doc-section-num">Section 11</div>
            <h2 className="doc-h2">Limitation of Liability</h2>
            <p className="doc-p">TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, LIXEEN SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, DATA, GOODWILL, OR BUSINESS OPPORTUNITIES.</p>
            <p className="doc-p">IN NO EVENT SHALL LIXEEN'S TOTAL CUMULATIVE LIABILITY TO YOU EXCEED THE GREATER OF: (A) THE TOTAL FEES PAID BY YOU TO LIXEEN IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM; OR (B) ONE HUNDRED US DOLLARS ($100).</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="indemnification">
            <div className="doc-section-num">Section 12</div>
            <h2 className="doc-h2">Indemnification</h2>
            <p className="doc-p">You agree to defend, indemnify, and hold harmless Lixeen and its affiliates from and against any claims, liabilities, damages, losses, costs, or fees arising out of or relating to:</p>
            <div className="doc-list">
              <Li>Your violation of these Terms or any applicable law or regulation.</Li>
              <Li>Any task content, work product, or materials you submit through the platform.</Li>
              <Li>Your infringement of any intellectual property or other rights of any third party.</Li>
            </div>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="termination">
            <div className="doc-section-num">Section 13</div>
            <h2 className="doc-h2">Termination</h2>
            <h3 className="doc-h3">Termination by You</h3>
            <p className="doc-p">You may close your account at any time from your account settings. No refunds are issued for unused portions of a subscription term, except where required by law.</p>
            <h3 className="doc-h3">Termination by Lixeen</h3>
            <p className="doc-p">We may suspend or terminate your account if you violate these Terms, we reasonably suspect fraudulent or illegal activity, your account remains inactive for 24 consecutive months, or continued operation would expose Lixeen or other users to harm.</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="disputes">
            <div className="doc-section-num">Section 14</div>
            <h2 className="doc-h2">Disputes & Governing Law</h2>
            <div className="doc-callout warning">
              <p><strong>Please read this section carefully.</strong> It requires arbitration of disputes and waives your right to a jury trial or class action. You have 30 days from first accepting these Terms to opt out by emailing legal@lixeen.com with the subject "Arbitration Opt-Out".</p>
            </div>
            <h3 className="doc-h3">Binding Arbitration</h3>
            <p className="doc-p">Any dispute arising out of or relating to these Terms shall be resolved by binding individual arbitration administered by the American Arbitration Association (AAA). The arbitration shall be conducted in English, in Wilmington, Delaware, or by video conference at either party's request.</p>
            <h3 className="doc-h3">Class Action Waiver</h3>
            <p className="doc-p">YOU AGREE THAT ANY CLAIMS MUST BE BROUGHT IN YOUR INDIVIDUAL CAPACITY, AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE PROCEEDING.</p>
            <h3 className="doc-h3">Governing Law</h3>
            <p className="doc-p">These Terms shall be governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="general">
            <div className="doc-section-num">Section 15</div>
            <h2 className="doc-h2">General Provisions</h2>
            <h3 className="doc-h3">Amendments</h3>
            <p className="doc-p">We reserve the right to modify these Terms at any time. For material changes, we will provide at least 14 days' notice via email and a platform notification. Your continued use of the Services after the effective date constitutes acceptance of the updated Terms.</p>
            <h3 className="doc-h3">Severability</h3>
            <p className="doc-p">If any provision of these Terms is found to be invalid or unenforceable, that provision shall be modified to the minimum extent necessary or severed, and the remaining provisions shall continue in full force and effect.</p>
            <h3 className="doc-h3">Assignment</h3>
            <p className="doc-p">You may not assign or transfer these Terms without Lixeen's prior written consent. Lixeen may freely assign these Terms without restriction.</p>
          </section>
          <div className="doc-divider"/>

          <section className="doc-section" id="contact">
            <div className="doc-section-num">Section 16</div>
            <h2 className="doc-h2">Contact</h2>
            <p className="doc-p">For questions, concerns, or notices regarding these Terms of Service, please contact our Legal Team.</p>
            <div className="doc-contact">
              <div className="doc-contact-glow"/>
              <h3>Reach our Legal Team</h3>
              <p>For legal notices, contract enquiries, or questions about these Terms. For data privacy matters, please contact privacy@lixeen.com instead.</p>
              <a className="doc-contact-email" href="mailto:legal@lixeen.com">legal@lixeen.com</a>
              <div style={{marginTop:24,display:"flex",flexDirection:"column",gap:8}}>
                {[
                  ["Mailing address","Lixeen Inc., Legal Department, 1209 Orange Street, Wilmington, DE 19801, United States"],
                  ["Support","For general platform support, visit help.lixeen.com or email support@lixeen.com"],
                  ["Security","To report a security vulnerability, email security@lixeen.com"],
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