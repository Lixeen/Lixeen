import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@300;400;500;600;700;800&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #f5f5f5;
  --surface:   #ffffff;
  --surface2:  #f0f0f0;
  --surface3:  #e8e8e8;
  --border:    #e0e0e0;
  --border2:   #d0d0d0;
  --text:      #000000;
  --sub:       #000000;
  --muted:     #666666;
  --sans:      'Anek Devanagari', system-ui, sans-serif;
  --r-pill:    999px;
  --r-card:    16px;
  --r-sm:      8px;
  --topbar-h:  64px;
}

html, body { height: 100%; }
body { font-family: var(--sans); color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased; }
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #cccccc; border-radius: 4px; }
.topbar { height: var(--topbar-h); display: flex; align-items: center; padding: 0 40px; gap: 16px; background: var(--surface); border-bottom: 1px solid var(--border2); position: sticky; top: 0; z-index: 40; box-shadow: 0 1px 0 var(--border2); }
.topbar-logo { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.topbar-logo-mark { width: 32px; height: 32px; background: #c8f026; border-radius: 9px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.topbar-logo-name { font-size: 18px; font-weight: 800; color: var(--text); letter-spacing: -0.4px; }
.topbar-divider { width: 1px; height: 24px; background: var(--border2); margin: 0 4px; }
.topbar-page-label { font-size: 13px; color: var(--muted); font-weight: 500; }
.topbar-right { margin-left: auto; display: flex; align-items: center; gap: 10px; }
.topbar-icon-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: none; border: 1px solid var(--border2); border-radius: var(--r-sm); color: var(--muted); cursor: pointer; transition: border-color 0.15s, color 0.15s; }
.topbar-icon-btn:hover { border-color: #000; color: #000; }
.notif-dot { position: relative; }
.notif-dot::after { content: ''; position: absolute; top: 6px; right: 6px; width: 7px; height: 7px; border-radius: 50%; background: #000; border: 1.5px solid var(--surface); }
.topbar-av { width: 34px; height: 34px; border-radius: 50%; background: #e0e0e0; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #000; cursor: pointer; border: 1.5px solid var(--border2); flex-shrink: 0; }
.page { max-width: 860px; margin: 0 auto; padding: 40px 24px 100px; }
.breadcrumb { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); margin-bottom: 28px; }
.breadcrumb-sep { color: var(--border2); }
.breadcrumb-link { color: var(--muted); cursor: pointer; transition: color 0.15s; text-decoration: none; }
.breadcrumb-link:hover { color: #000; }
.breadcrumb-current { color: #000; font-weight: 600; }
.project-hero { background: var(--surface); border: 1px solid var(--border2); border-radius: var(--r-card); padding: 32px 36px; margin-bottom: 24px; }
.project-hero-top { display: flex; align-items: flex-start; gap: 18px; margin-bottom: 20px; }
.project-hero-icon { width: 56px; height: 56px; border-radius: 14px; background: var(--surface2); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 26px; flex-shrink: 0; }
.project-hero-meta { flex: 1; }
.project-hero-title { font-size: 22px; font-weight: 800; color: #000; letter-spacing: -0.03em; margin-bottom: 8px; }
.project-hero-tags { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.project-tag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: var(--r-pill); background: var(--surface2); border: 1px solid var(--border2); color: var(--muted); }
.project-hero-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border-top: 1px solid var(--border); padding-top: 20px; }
.project-stat { padding: 0 20px; border-right: 1px solid var(--border); }
.project-stat:first-child { padding-left: 0; }
.project-stat:last-child { border-right: none; }
.project-stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 5px; }
.project-stat-val { font-size: 20px; font-weight: 800; color: #000; letter-spacing: -0.03em; }
.project-stat-sub { font-size: 11px; color: var(--muted); margin-top: 2px; }
.section-card { background: var(--surface); border: 1px solid var(--border2); border-radius: var(--r-card); margin-bottom: 16px; overflow: hidden; }
.section-card-head { padding: 18px 24px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none; }
.section-card-head.closed { border-bottom: none; }
.section-card-head-left { display: flex; align-items: center; gap: 12px; }
.section-number { width: 24px; height: 24px; border-radius: 50%; background: #000; color: #fff; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.section-card-title { font-size: 14px; font-weight: 700; color: #000; }
.section-card-body { padding: 22px 24px; }
.prose { font-size: 13.5px; color: #333; line-height: 1.75; }
.prose p { margin-bottom: 14px; }
.prose p:last-child { margin-bottom: 0; }
.prose strong { color: #000; font-weight: 700; }
.step-list { display: flex; flex-direction: column; gap: 16px; }
.step { display: flex; gap: 16px; align-items: flex-start; }
.step-num { width: 28px; height: 28px; border-radius: 50%; border: 2px solid #000; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; color: #000; flex-shrink: 0; margin-top: 1px; }
.step-content { flex: 1; }
.step-title { font-size: 13.5px; font-weight: 700; color: #000; margin-bottom: 4px; }
.step-desc { font-size: 13px; color: #444; line-height: 1.65; }
.rubric-table { width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; }
.rubric-table th { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); text-align: left; padding: 10px 14px; background: var(--surface2); border-bottom: 1px solid var(--border2); }
.rubric-table td { font-size: 13px; color: #333; padding: 12px 14px; border-bottom: 1px solid var(--border); vertical-align: top; line-height: 1.6; }
.rubric-table tr:last-child td { border-bottom: none; }
.rubric-table td:first-child { font-weight: 700; color: #000; width: 160px; }
.rubric-score { display: inline-flex; align-items: center; justify-content: center; min-width: 40px; padding: 0 8px; height: 26px; border-radius: 6px; font-size: 12px; font-weight: 700; background: var(--surface2); border: 1px solid var(--border2); color: #000; }
.do-dont { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.do-card { background: #f8fef0; border: 1px solid #c8e888; border-radius: var(--r-sm); padding: 18px; }
.dont-card { background: #fef8f8; border: 1px solid #e8b8b8; border-radius: var(--r-sm); padding: 18px; }
.do-dont-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 12px; }
.do-card .do-dont-label { color: #3d7010; }
.dont-card .do-dont-label { color: #a02020; }
.do-dont-item { display: flex; gap: 9px; font-size: 12.5px; color: #333; line-height: 1.55; margin-bottom: 9px; }
.do-dont-item:last-child { margin-bottom: 0; }
.do-dont-item-icon { flex-shrink: 0; font-size: 13px; margin-top: 1px; }
.faq-item { border-bottom: 1px solid var(--border); }
.faq-item:last-child { border-bottom: none; }
.faq-q { display: flex; align-items: center; justify-content: space-between; padding: 14px 0; cursor: pointer; user-select: none; gap: 16px; }
.faq-q-text { font-size: 13.5px; font-weight: 600; color: #000; }
.faq-chevron { flex-shrink: 0; transition: transform 0.2s; }
.faq-chevron.open { transform: rotate(180deg); }
.faq-a { font-size: 13px; color: #444; line-height: 1.7; padding-bottom: 14px; }
.progress-bar-wrap { height: 6px; background: var(--border2); border-radius: 4px; overflow: hidden; margin-top: 6px; }
.progress-bar-fill { height: 100%; background: #000; border-radius: 4px; transition: width 0.4s; }
.read-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 3px 9px; border-radius: var(--r-pill); background: var(--surface2); border: 1px solid var(--border2); color: var(--muted); }
.read-badge.done { background: #f0f8e0; border-color: #b8d870; color: #3d7010; }
.diff-badge { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: var(--r-pill); }
.diff-beginner     { background: #f0faf4; border: 1px solid #a8ddb8; color: #1a7a3f; }
.diff-intermediate { background: #fff8e8; border: 1px solid #e8cc88; color: #7a5a00; }
.diff-advanced     { background: #fdf2f2; border: 1px solid #e8b8b8; color: #a02020; }
.sticky-footer { position: fixed; bottom: 0; left: 0; right: 0; background: var(--surface); border-top: 1px solid var(--border2); padding: 14px 40px; display: flex; align-items: center; justify-content: space-between; gap: 16px; z-index: 30; box-shadow: 0 -2px 12px rgba(0,0,0,0.06); }
.sticky-footer-left { font-size: 13px; color: var(--muted); }
.sticky-footer-left strong { color: #000; }
.sticky-footer-right { display: flex; gap: 10px; }
.btn-lime { display: inline-flex; align-items: center; gap: 8px; font-family: var(--sans); font-size: 13px; font-weight: 700; cursor: pointer; border: none; border-radius: var(--r-pill); background: #0a0a0a; color: #ffffff; padding: 0 20px; height: 40px; transition: opacity 0.2s; white-space: nowrap; }
.btn-lime:hover { opacity: 0.85; }
.btn-outline { display: inline-flex; align-items: center; gap: 8px; font-family: var(--sans); font-size: 13px; font-weight: 600; cursor: pointer; background: transparent; border-radius: var(--r-pill); border: 1.5px solid var(--border2); color: var(--sub); padding: 0 20px; height: 40px; transition: border-color 0.15s, color 0.15s; white-space: nowrap; }
.btn-outline:hover { border-color: #000; color: #000; }
@media (max-width: 680px) {
  .topbar { padding: 0 20px; }
  .topbar-page-label { display: none; }
  .page { padding: 24px 16px 100px; }
  .project-hero { padding: 22px 20px; }
  .project-hero-stats { grid-template-columns: 1fr 1fr; }
  .do-dont { grid-template-columns: 1fr; }
  .sticky-footer { padding: 12px 20px; flex-wrap: wrap; }
}
`;

const I = ({ n, s = 16, c = "currentColor" }) => {
  const paths = {
    bell:    [<path key="a" d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>, <path key="b" d="M13.73 21a2 2 0 0 1-3.46 0"/>],
    search:  [<circle key="a" cx="11" cy="11" r="8"/>, <line key="b" x1="21" y1="21" x2="16.65" y2="16.65"/>],
    chevron: [<polyline key="a" points="6 9 12 15 18 9"/>],
    arrow:   [<line key="a" x1="5" y1="12" x2="19" y2="12"/>, <polyline key="b" points="12 5 19 12 12 19"/>],
    check:   [<polyline key="a" points="20 6 9 17 4 12"/>],
    back:    [<line key="a" x1="19" y1="12" x2="5" y2="12"/>, <polyline key="b" points="12 19 5 12 12 5"/>],
    book:    [<path key="a" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>, <path key="b" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>],
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {paths[n]}
    </svg>
  );
};

const LogoMark = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" fill="#000" fillOpacity="0.7"/>
    <path d="M10 2L3 7l7 3 7-3L10 2z" fill="#000" fillOpacity="0.4"/>
  </svg>
);

const GENERIC_FAQS = [
  { q: "What happens if I'm unsure which response to prefer?", a: "Use your best judgment based on the rubric. If responses feel truly equal across all criteria, you may select 'Tie' — but use this sparingly. Most responses will have meaningful differences." },
  { q: "Can I flag a task if the content seems harmful or off-topic?", a: "Yes. Use the 'Flag' button at the top of any task. Flagged tasks are reviewed by our QA team and will not count against your acceptance rate." },
  { q: "How long should I spend on each task?", a: "Follow the estimated time shown on the project card. Rushing leads to lower quality scores. If a task takes longer due to genuine complexity, that's fine — quality is prioritised over speed." },
  { q: "Will my feedback be visible to AI companies?", a: "Your individual responses are shared with the client company for training purposes, but never attributed to you personally. All data is anonymised before delivery." },
  { q: "What if I disagree with the rubric weighting?", a: "Apply the rubric as specified for consistency across annotators. You can share feedback about the rubric through the platform's feedback form after completing your batch." },
];

const GENERIC_STEPS = [
  { title: "Read the prompt or source content", desc: "Understand exactly what is being asked or what content is being evaluated. Consider the user's intent, tone, and what a genuinely good response would look like before reviewing the AI output(s)." },
  { title: "Review the first item fully", desc: "Read the entire response, document, or output without skimming. Note strengths and weaknesses across the rubric dimensions before moving on." },
  { title: "Review the second item (if applicable)", desc: "For comparison tasks, evaluate the second output independently. Avoid anchoring — try to assess it on its own merits before comparing to the first." },
  { title: "Apply the rubric", desc: "Use the criteria in Section 3 to form a structured judgment. You may take brief notes in the comment box before submitting." },
  { title: "Make your selection", desc: "Choose your preference, classification, or rating. You will then be asked to leave a comment explaining your reasoning — this is required." },
  { title: "Submit and continue", desc: "Hit Submit to move to the next task. You can pause and resume your session at any time — progress is saved automatically." },
];

function DiffBadge({ diff }) {
  if (!diff) return null;
  const cls = diff === "Beginner" ? "diff-beginner" : diff === "Advanced" ? "diff-advanced" : "diff-intermediate";
  return <span className={`diff-badge ${cls}`}>{diff}</span>;
}

function CollapsibleSection({ number, title, children, readSections, markRead }) {
  const [open, setOpen] = React.useState(number === 1);
  const isRead = readSections.includes(number);
  return (
    <div className="section-card">
      <div className={`section-card-head${!open ? " closed" : ""}`} onClick={() => setOpen(o => !o)}>
        <div className="section-card-head-left">
          <div className="section-number">{number}</div>
          <div className="section-card-title">{title}</div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          {isRead && <span className="read-badge done">✓ Read</span>}
          <span className={`faq-chevron${open ? " open" : ""}`}><I n="chevron" s={16} c="var(--muted)"/></span>
        </div>
      </div>
      {open && (
        <div className="section-card-body">
          {children}
          {!isRead && (
            <div style={{ marginTop:20, paddingTop:16, borderTop:"1px solid var(--border)", display:"flex", justifyContent:"flex-end" }}>
              <button className="btn-outline" style={{ height:32, fontSize:12, padding:"0 14px" }} onClick={e => { e.stopPropagation(); markRead(number); }}>
                <I n="check" s={12}/> Mark as read
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ProjectInstructions() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task ?? null;

  const [faqOpen, setFaqOpen] = useState({});
  const [readSections, setReadSections] = useState([]);
  const markRead = n => setReadSections(s => s.includes(n) ? s : [...s, n]);
  const toggleFaq = i => setFaqOpen(s => ({ ...s, [i]: !s[i] }));
  const totalSections = 5;
  const progress = Math.round((readSections.length / totalSections) * 100);

  const codename   = task?.codename   ?? null;
  const title      = task?.title      ?? "Project Instructions";
  const icon       = task?.icon       ?? "📋";
  const tags       = task?.tags       ?? [];
  const difficulty = task?.difficulty ?? "Intermediate";
  const estTime    = task?.estTime    ?? "5–10 min";
  const batchSize  = task?.batchSize  ?? 50;
  const deadline   = task?.deadline   ?? "TBD";
  const overview   = task?.overview   ?? "You will evaluate AI-generated outputs and provide quality ratings and preferences to help improve AI model training.";
  const rubric     = task?.rubric     ?? [
    { criterion:"Overall Preference", desc:"Which output do you prefer overall?",        weight:"40%" },
    { criterion:"Accuracy",           desc:"Is the content correct and well-supported?", weight:"30%" },
    { criterion:"Clarity",            desc:"Is the output clear and easy to understand?", weight:"20%" },
    { criterion:"Safety",             desc:"Does the output avoid harmful content?",      weight:"10%" },
  ];
  const dos   = task?.dos   ?? ["Read the full content before rating", "Apply the rubric consistently", "Flag content that appears harmful or problematic"];
  const donts = task?.donts ?? ["Rush through tasks to maximise volume", "Select a response based on length alone", "Use Tie unless responses are genuinely indistinguishable"];

  // Navigate back to dashboard tasks/available tab
  const handleBackToProjects = () => {
    navigate("/dashboard#tasks/available");
  };

  // Navigate to task page, passing the task object in state
  const handleStartTasking = () => {
    navigate("/task", { state: { task } });
  };

  return (
    <>
      <style>{G}</style>

      <div className="topbar">
        <div className="topbar-logo">
          <div className="topbar-logo-mark"><LogoMark size={16}/></div>
          <span className="topbar-logo-name">Lixeen</span>
        </div>
        <div className="topbar-divider"/>
        <span className="topbar-page-label">Project Instructions</span>
        <div className="topbar-right">
          <button className="topbar-icon-btn"><I n="search" s={15}/></button>
          <button className="topbar-icon-btn notif-dot"><I n="bell" s={15}/></button>
          <div className="topbar-av">NK</div>
        </div>
      </div>

      <div className="page">

        {/* ── Breadcrumb — always points back to tasks/available ── */}
        <div className="breadcrumb">
          <span className="breadcrumb-link" onClick={handleBackToProjects}>Projects</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-link" onClick={handleBackToProjects}>Available</span>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-current">{codename ?? title}</span>
        </div>

        <div className="project-hero">
          <div className="project-hero-top">
            <div className="project-hero-icon">{icon}</div>
            <div className="project-hero-meta">
              {codename && (
                <div style={{ fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--muted)",marginBottom:6 }}>{codename}</div>
              )}
              <div className="project-hero-title">{title}</div>
              <div className="project-hero-tags">
                {tags.map(t => <span className="project-tag" key={t}>{t}</span>)}
                <DiffBadge diff={difficulty}/>
              </div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
              <div style={{ fontSize:24, fontWeight:800, color:"#000", letterSpacing:"-0.04em" }}>$25</div>
              <div style={{ fontSize:11, color:"var(--muted)" }}>per hour</div>
            </div>
          </div>
          <div className="project-hero-stats">
            <div className="project-stat">
              <div className="project-stat-label">Est. per task</div>
              <div className="project-stat-val">{estTime.split("–")[0]}</div>
              <div className="project-stat-sub">{estTime} min avg.</div>
            </div>
            <div className="project-stat">
              <div className="project-stat-label">Batch size</div>
              <div className="project-stat-val">{batchSize}</div>
              <div className="project-stat-sub">Tasks per session</div>
            </div>
            <div className="project-stat">
              <div className="project-stat-label">Deadline</div>
              <div className="project-stat-val">{deadline}</div>
              <div className="project-stat-sub">Submit by 11:59 PM EST</div>
            </div>
            <div className="project-stat">
              <div className="project-stat-label">Difficulty</div>
              <div className="project-stat-val" style={{ fontSize:14, paddingTop:4 }}><DiffBadge diff={difficulty}/></div>
            </div>
          </div>
        </div>

        <div style={{ background:"var(--surface)", border:"1px solid var(--border2)", borderRadius:"var(--r-card)", padding:"14px 22px", marginBottom:24, display:"flex", alignItems:"center", gap:14 }}>
          <I n="book" s={15} c="var(--muted)"/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, color:"var(--muted)", marginBottom:4 }}>
              {readSections.length === totalSections ? "All sections read — you're ready to start!" : "Read all sections before starting"}
            </div>
            <div className="progress-bar-wrap">
              <div className="progress-bar-fill" style={{ width:`${progress}%` }}/>
            </div>
          </div>
          <div style={{ fontSize:12, fontWeight:700, color:"#000", whiteSpace:"nowrap" }}>
            {readSections.length} of {totalSections} read
          </div>
        </div>

        <CollapsibleSection number={1} title="Project Overview" readSections={readSections} markRead={markRead}>
          <div className="prose">
            <p>{overview}</p>
            <p>You do not need any technical background in AI. What matters most is your ability to <strong>read carefully</strong>, apply consistent judgment, and follow the rubric provided in Section 3.</p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection number={2} title="Step-by-Step Guide" readSections={readSections} markRead={markRead}>
          <div className="step-list">
            {GENERIC_STEPS.map((s, i) => (
              <div className="step" key={i}>
                <div className="step-num">{i + 1}</div>
                <div className="step-content">
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </CollapsibleSection>

        <CollapsibleSection number={3} title="Evaluation Rubric" readSections={readSections} markRead={markRead}>
          <div style={{ marginBottom:16, fontSize:13.5, color:"#333", lineHeight:1.7 }}>
            Score each response on the dimensions below. Your overall preference should reflect a <strong style={{ color:"#000" }}>holistic judgment</strong> — not simply the highest average score.
          </div>
          <table className="rubric-table">
            <thead>
              <tr>
                <th>Criterion</th>
                <th>What to look for</th>
                <th style={{ width:70, textAlign:"center" }}>Weight</th>
              </tr>
            </thead>
            <tbody>
              {rubric.map(r => (
                <tr key={r.criterion}>
                  <td>{r.criterion}</td>
                  <td>{r.desc}</td>
                  <td style={{ textAlign:"center" }}><span className="rubric-score">{r.weight}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CollapsibleSection>

        <CollapsibleSection number={4} title="Do's and Don'ts" readSections={readSections} markRead={markRead}>
          <div className="do-dont">
            <div className="do-card">
              <div className="do-dont-label">✓ Do</div>
              {dos.map((t, i) => (
                <div className="do-dont-item" key={i}>
                  <span className="do-dont-item-icon" style={{ color:"#3d7010" }}>✓</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
            <div className="dont-card">
              <div className="do-dont-label">✗ Don't</div>
              {donts.map((t, i) => (
                <div className="do-dont-item" key={i}>
                  <span className="do-dont-item-icon" style={{ color:"#a02020" }}>✗</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection number={5} title="Frequently Asked Questions" readSections={readSections} markRead={markRead}>
          {GENERIC_FAQS.map((f, i) => (
            <div className="faq-item" key={i}>
              <div className="faq-q" onClick={() => toggleFaq(i)}>
                <span className="faq-q-text">{f.q}</span>
                <span className={`faq-chevron${faqOpen[i] ? " open" : ""}`}><I n="chevron" s={15} c="var(--muted)"/></span>
              </div>
              {faqOpen[i] && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </CollapsibleSection>

      </div>

      <div className="sticky-footer">
        <div className="sticky-footer-left">
          <strong>{title}</strong> · {batchSize} tasks · $25/hr · Due {deadline}
        </div>
        <div className="sticky-footer-right">
          <button className="btn-outline" onClick={handleBackToProjects}>
            <I n="back" s={14}/> Back to Projects
          </button>
          <button
            className="btn-lime"
            onClick={handleStartTasking}
            disabled={readSections.length < totalSections}
            style={{ opacity: readSections.length < totalSections ? 0.45 : 1, cursor: readSections.length < totalSections ? "not-allowed" : "pointer" }}
          >
            <I n="arrow" s={13} c="#fff"/> Start Tasking
          </button>
        </div>
      </div>
    </>
  );
}