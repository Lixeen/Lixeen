import React, { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./auth/AuthContext";
import { useNavigate } from "react-router-dom";

const ALL_PROJECTS = [
    { id: "h1", table: "tasks_dialogue_preference", codename: "Project Bluebeam", title: "Dialogue Preference Labeling", icon: "💬" },
    { id: "h2", table: "tasks_response_ranking", codename: "Project Ironclad", title: "Response Ranking", icon: "🏆" },
    { id: "h3", table: "tasks_instruction_following", codename: "Project Waypoint", title: "Instruction Following Evaluation", icon: "📋" },
    { id: "h4", table: "tasks_toxicity_safety", codename: "Project Sentinel", title: "Toxicity / Safety Classification", icon: "🛡️" },
    { id: "h5", table: "tasks_hallucination_detection", codename: "Project Mirage", title: "Hallucination Detection", icon: "🔍" },
    { id: "h6", table: "tasks_prompt_intent", codename: "Project Compass", title: "Prompt Intent Classification", icon: "🎯" },
    { id: "h7", table: "tasks_response_rewriting", codename: "Project Redline", title: "Response Rewriting / Editing", icon: "✏️" },
    { id: "h8", table: "tasks_fact_checking", codename: "Project Bedrock", title: "Fact Checking", icon: "✅" },
    { id: "h9", table: "tasks_summarization_quality", codename: "Project Distill", title: "Summarization Quality Rating", icon: "⭐" },
    { id: "h10", table: "tasks_code_correctness", codename: "Project Codelock", title: "Code Correctness Evaluation", icon: "💻" },
    { id: "h11", table: "tasks_translation_quality", codename: "Project Rosetta", title: "Translation Quality Evaluation", icon: "🌐" },
    { id: "h12", table: "tasks_image_caption", codename: "Project Lightbox", title: "Image Caption Evaluation", icon: "🖼️" },
    { id: "h13", table: "tasks_sentiment_analysis", codename: "Project Pulse", title: "Sentiment Analysis Labeling", icon: "😊" },
    { id: "h14", table: "tasks_ner", codename: "Project Atlas", title: "Named Entity Recognition (NER)", icon: "🏷️" },
    { id: "h15", table: "tasks_search_relevance", codename: "Project Nexus", title: "Search Result Relevance Ranking", icon: "🔎" },
];

const G = `
@import url('https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bg:#f5f5f5;--surface:#fff;--surface2:#f0f0f0;--border:#e0e0e0;--border2:#d0d0d0;
  --text:#000;--muted:#666;--sans:'Anek Devanagari',system-ui,sans-serif;
  --r-sm:8px;--r-card:12px;--r-pill:999px;--sidebar:220px;--topbar:56px;
  --red:#c00;--red-bg:#fff5f5;--green:#1a7a3f;--green-bg:#f0faf4;
}
html,body{height:100%;background:var(--bg);font-family:var(--sans);color:var(--text);}
*{-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-thumb{background:#ccc;border-radius:4px;}

/* ── Shell layout ── */
.admin-shell{display:flex;height:100vh;overflow:hidden;}

/* ── Sidebar ── */
.admin-sidebar{
  width:var(--sidebar);background:var(--surface);border-right:1px solid var(--border2);
  display:flex;flex-direction:column;flex-shrink:0;
  transition:transform 0.25s ease;
  z-index:150;
}
.admin-main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0;}
.admin-topbar{
  height:var(--topbar);background:var(--surface);border-bottom:1px solid var(--border2);
  display:flex;align-items:center;padding:0 16px;gap:12px;flex-shrink:0;
}
.admin-content{flex:1;overflow-y:auto;padding:16px;}

/* Sidebar overlay for mobile */
.sidebar-overlay{
  display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:140;
}

.sb-brand{padding:18px 20px 10px;font-size:13px;font-weight:800;letter-spacing:-0.02em;border-bottom:1px solid var(--border);}
.sb-brand span{font-size:10px;font-weight:600;color:var(--muted);display:block;margin-top:2px;letter-spacing:0.04em;text-transform:uppercase;}
.sb-nav{padding:10px 10px;flex:1;overflow-y:auto;}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 12px;border-radius:var(--r-sm);font-size:13px;font-weight:600;color:var(--muted);cursor:pointer;transition:all 0.1s;border:none;background:none;width:100%;text-align:left;}
.sb-item:hover{background:var(--surface2);color:var(--text);}
.sb-item.active{background:#000;color:#fff;}
.sb-item .sb-icon{font-size:15px;width:20px;text-align:center;}
.sb-section{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#bbb;padding:14px 12px 6px;}

/* Hamburger button */
.hamburger{
  display:none;align-items:center;justify-content:center;
  width:36px;height:36px;border-radius:var(--r-sm);
  border:1.5px solid var(--border2);background:var(--surface);
  cursor:pointer;flex-shrink:0;
}
.hamburger span{display:block;width:16px;height:2px;background:#000;border-radius:2px;transition:all 0.2s;}
.hamburger span+span{margin-top:3px;}

.card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);overflow:hidden;margin-bottom:16px;}
.card-head{padding:16px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;}
.card-title{font-size:14px;font-weight:700;color:var(--text);}
.card-sub{font-size:12px;color:var(--muted);margin-top:2px;}
.card-body{padding:20px;}

/* ── Stat row ── */
.stat-row{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:20px;}
.stat-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);padding:18px 20px;}
.stat-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:6px;}
.stat-val{font-size:28px;font-weight:800;color:var(--text);letter-spacing:-0.04em;line-height:1;}
.stat-sub{font-size:11px;color:var(--muted);margin-top:5px;}

/* ── Table wrapper for horizontal scroll ── */
.tbl-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;}
.tbl{width:100%;border-collapse:collapse;min-width:700px;}
.tbl th{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);padding:10px 14px;border-bottom:1px solid var(--border2);text-align:left;background:var(--surface2);white-space:nowrap;}
.tbl td{padding:12px 14px;border-bottom:1px solid var(--border);font-size:13px;vertical-align:middle;}
.tbl tr:last-child td{border-bottom:none;}
.tbl tr:hover td{background:#fafafa;}

.badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;padding:3px 9px;border-radius:var(--r-pill);letter-spacing:0.03em;white-space:nowrap;}
.badge-green{background:var(--green-bg);color:var(--green);border:1px solid #b8e0c8;}
.badge-red{background:var(--red-bg);color:var(--red);border:1px solid #ffd5d5;}
.badge-grey{background:var(--surface2);color:var(--muted);border:1px solid var(--border2);}
.badge-blue{background:#eef4ff;color:#1a4a9a;border:1px solid #b8ccf0;}
.badge-purple{background:#f5f0ff;color:#6b21a8;border:1px solid #d8b4fe;}

.btn{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;border-radius:var(--r-sm);font-family:var(--sans);font-size:12.5px;font-weight:600;cursor:pointer;border:none;transition:opacity 0.15s;}
.btn-black{background:#000;color:#fff;} .btn-black:hover{opacity:0.8;}
.btn-outline{background:#fff;color:var(--text);border:1.5px solid var(--border2);} .btn-outline:hover{border-color:#999;background:var(--surface2);}
.btn-danger{background:var(--red-bg);color:var(--red);border:1.5px solid #ffd5d5;} .btn-danger:hover{background:#ffe0e0;}
.btn-sm{padding:5px 11px;font-size:12px;}
.btn:disabled{opacity:0.4;cursor:not-allowed;}

/* ── Project grid ── */
.proj-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;}
.proj-toggle{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:var(--r-sm);border:1.5px solid var(--border2);cursor:pointer;transition:all 0.15s;background:var(--surface);}
.proj-toggle.on{border-color:#000;background:#f8f8f8;}
.proj-toggle.on .proj-check{background:#000;border-color:#000;}
.proj-toggle.on .proj-check::after{opacity:1;}
.proj-check{width:18px;height:18px;border-radius:5px;border:1.5px solid var(--border2);flex-shrink:0;position:relative;transition:all 0.12s;}
.proj-check::after{content:"✓";position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;opacity:0;}
.proj-icon{font-size:16px;}
.proj-info{flex:1;min-width:0;}
.proj-codename{font-size:12px;font-weight:700;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.proj-title{font-size:11px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}

.search-input{padding:8px 12px;border:1.5px solid var(--border2);border-radius:var(--r-sm);font-family:var(--sans);font-size:13px;color:var(--text);background:var(--surface);outline:none;width:240px;transition:border-color 0.15s;}
.search-input:focus{border-color:#999;}

/* ── Detail overlay / panel ── */
.detail-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.35);z-index:200;display:flex;align-items:flex-start;justify-content:flex-end;}
.detail-panel{width:520px;max-width:100vw;height:100vh;background:var(--surface);overflow-y:auto;box-shadow:-4px 0 24px rgba(0,0,0,0.12);}
.detail-header{padding:20px 24px;border-bottom:1px solid var(--border2);display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:var(--surface);z-index:10;}
.detail-body{padding:24px;}

.toast{position:fixed;bottom:24px;right:24px;left:24px;max-width:340px;margin:0 auto;background:#000;color:#fff;font-size:13px;font-weight:600;padding:12px 18px;border-radius:var(--r-sm);z-index:999;box-shadow:0 4px 16px rgba(0,0,0,0.2);animation:slideUp 0.2s ease;}
@keyframes slideUp{from{transform:translateY(12px);opacity:0;}to{transform:translateY(0);opacity:1;}}
@keyframes spin{to{transform:rotate(360deg);}}
.spinner{width:18px;height:18px;border:2.5px solid var(--border2);border-top-color:#000;border-radius:50%;animation:spin 0.7s linear infinite;}
.loading-center{display:flex;align-items:center;justify-content:center;gap:12px;padding:48px;color:var(--muted);font-size:13px;}

/* ── Notification modal ── */
.notif-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:300;display:flex;align-items:center;justify-content:center;padding:16px;}
.notif-modal{background:var(--surface);border-radius:14px;width:100%;max-width:480px;max-height:90vh;display:flex;flex-direction:column;box-shadow:0 8px 40px rgba(0,0,0,0.18);overflow:hidden;}
.notif-modal-head{padding:20px 24px;border-bottom:1px solid var(--border2);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.notif-modal-body{padding:24px;display:flex;flex-direction:column;gap:14px;overflow-y:auto;}
.notif-modal-foot{padding:16px 24px;border-top:1px solid var(--border2);display:flex;gap:10px;justify-content:flex-end;flex-shrink:0;}

.field-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--muted);margin-bottom:5px;display:block;}
.field-input{width:100%;padding:9px 12px;border:1.5px solid var(--border2);border-radius:var(--r-sm);font-family:var(--sans);font-size:13px;color:var(--text);background:#fff;outline:none;transition:border-color 0.15s;}
.field-input:focus{border-color:#000;}
.field-textarea{width:100%;padding:9px 12px;border:1.5px solid var(--border2);border-radius:var(--r-sm);font-family:var(--sans);font-size:13px;color:var(--text);background:#fff;outline:none;resize:vertical;min-height:80px;transition:border-color 0.15s;}
.field-textarea:focus{border-color:#000;}
.field-select{width:100%;padding:9px 12px;border:1.5px solid var(--border2);border-radius:var(--r-sm);font-family:var(--sans);font-size:13px;color:var(--text);background:#fff;outline:none;}

.creds-section{background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-sm);padding:16px;margin-bottom:20px;}
.creds-row{display:flex;gap:8px;align-items:center;margin-top:6px;}
.creds-display{flex:1;padding:9px 12px;background:#fff;border:1.5px solid var(--border2);border-radius:var(--r-sm);font-size:13px;font-weight:600;color:#000;font-family:var(--sans);letter-spacing:0.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.creds-display.empty{color:var(--muted);font-weight:400;font-style:italic;}

/* ── Topbar user email ── */
.topbar-email{margin-left:auto;font-size:12px;color:var(--muted);}

/* ── Mobile card list (alternative to table rows on small screens) ── */
.mobile-user-card{
  background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);
  padding:14px 16px;margin-bottom:10px;display:flex;flex-direction:column;gap:8px;
}

/* ─────────────────────────────────────────────
   RESPONSIVE BREAKPOINTS
───────────────────────────────────────────── */

/* Tablet (≤900px): 2-col stat grid, narrower sidebar */
@media (max-width:900px){
  .stat-row{grid-template-columns:repeat(2,1fr);gap:10px;}
  .stat-val{font-size:22px;}
  .proj-grid{grid-template-columns:repeat(2,1fr);}
  .admin-content{padding:14px;}
  .search-input{width:180px;}
}

/* Mobile (≤680px): sidebar becomes drawer, tables scroll, full-width panel */
@media (max-width:680px){
  /* Sidebar drawer */
  .admin-sidebar{
    position:fixed;top:0;left:0;height:100vh;
    transform:translateX(-100%);
    box-shadow:4px 0 20px rgba(0,0,0,0.15);
  }
  .admin-sidebar.open{transform:translateX(0);}
  .sidebar-overlay{display:block;}

  /* Show hamburger */
  .hamburger{display:flex;}

  /* Hide email on very small screens */
  .topbar-email{display:none;}

  /* Full-width content */
  .admin-content{padding:12px;}
  .admin-topbar{padding:0 12px;gap:8px;}

  /* 1-col stat grid */
  .stat-row{grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:14px;}
  .stat-card{padding:12px 14px;}
  .stat-val{font-size:20px;}
  .stat-label{font-size:10px;}

  /* Full-width detail panel */
  .detail-panel{width:100vw;}
  .detail-body{padding:16px;}
  .detail-header{padding:14px 16px;}

  /* Notification modal full-width */
  .notif-modal{max-height:95vh;border-radius:12px;}
  .notif-modal-body{padding:16px;}
  .notif-modal-head{padding:14px 16px;}
  .notif-modal-foot{padding:12px 16px;}

  /* Project grid 1-col */
  .proj-grid{grid-template-columns:1fr 1fr;}

  /* Search inputs full width */
  .search-input{width:100%;}

  /* Tab header controls stack */
  .tab-header{flex-direction:column;align-items:flex-start !important;gap:10px;}
  .tab-controls{flex-wrap:wrap;width:100%;}
  .tab-controls .search-input{flex:1;min-width:0;}

  /* Toast anchored to bottom */
  .toast{left:12px;right:12px;bottom:16px;max-width:none;}

  /* Responses filters stack */
  .resp-filters{flex-direction:column;align-items:flex-start !important;}
}

/* Extra small (≤400px) */
@media (max-width:400px){
  .stat-row{grid-template-columns:1fr 1fr;}
  .proj-grid{grid-template-columns:1fr;}
  .btn{padding:6px 10px;font-size:12px;}
}
`;

const Icon = ({ n, s = 14 }) => {
    const paths = {
        users: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></>,
        responses: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></>,
        projects: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
        chevR: <polyline points="9 18 15 12 9 6" />,
        x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
        check: <polyline points="20 6 9 17 4 12" />,
        home: <><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></>,
        logout: <><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
        refresh: <><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></>,
        bell: <><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></>,
        send: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
        notifs: <><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /><line x1="9" y1="10" x2="15" y2="10" /><line x1="12" y1="7" x2="12" y2="13" /></>,
        eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
        eyeOff: <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>,
        key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></>,
        copy: <><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" /></>,
        trash: <><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" /></>,
        menu: <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>,
    };
    return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {paths[n]}
        </svg>
    );
};

function notifTypeIcon(type) {
    const map = {
        project_assigned: "🚀", project_revoked: "🔒", submission_accepted: "✅",
        submission_rejected: "❌", payout_processed: "💰", announcement: "📣", general: "📢",
    };
    return map[type] ?? "📢";
}

function fmtRelTime(iso) {
    if (!iso) return "—";
    const diff = Date.now() - new Date(iso).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}d ago`;
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function Toast({ msg, onDone }) {
    useEffect(() => { const t = setTimeout(onDone, 2800); return () => clearTimeout(t); }, []);
    return <div className="toast">{msg}</div>;
}

async function sendEmailAndNotification({ userId, to, userName, type, title, message, link, emailExtras = {} }) {
    const { error: dbErr } = await supabase.from("notifications").insert({
        user_id: userId, type, title, message, read: false,
        ...(link ? { link } : {}),
    });
    if (dbErr) console.error("[notifications] insert error:", dbErr.message);
    try {
        const { error } = await supabase.functions.invoke("send-email", {
            body: {
                to, type, userName, subject: title, title, body: message,
                ...(link ? { ctaUrl: link, ctaLabel: "View" } : {}),
                ...emailExtras,
            },
        });
        if (error) console.error("[send-email] error:", error);
    } catch (err) {
        console.error("[send-email] failed:", err);
    }
}

const NOTIF_TYPES = [
    { value: "general", label: "📢 General" },
    { value: "project_assigned", label: "🚀 Project Assigned" },
    { value: "project_revoked", label: "🔒 Project Revoked" },
    { value: "submission_accepted", label: "✅ Submission Accepted" },
    { value: "payout_processed", label: "💰 Payout Processed" },
    { value: "announcement", label: "📣 Announcement" },
];

function NotificationModal({ profile, onClose, onSent }) {
    const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.email;
    const [tab, setTab] = useState("email");
    const [form, setForm] = useState({
        type: "announcement", subject: "", title: "", body: "",
        ctaLabel: "Go to Dashboard", ctaUrl: "https://app.lixeen.com/dashboard",
        message: "", link: "",
    });
    const [sending, setSending] = useState(false);
    const [err, setErr] = useState("");
    const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

    const handleSend = async () => {
        if (tab === "email") {
            if (!form.subject.trim()) { setErr("Subject is required."); return; }
            if (!form.title.trim()) { setErr("Title is required."); return; }
            if (!form.body.trim()) { setErr("Body is required."); return; }
            setSending(true); setErr("");
            try {
                const { error } = await supabase.functions.invoke("send-email", {
                    body: {
                        to: profile.email, userName: name, type: form.type,
                        subject: form.subject.trim(), title: form.title.trim(), body: form.body.trim(),
                        ...(form.ctaLabel.trim() && form.ctaUrl.trim()
                            ? { ctaLabel: form.ctaLabel.trim(), ctaUrl: form.ctaUrl.trim() } : {}),
                    },
                });
                if (error) { setErr("Failed to send email: " + error.message); setSending(false); return; }
            } catch (e) { setErr("Error: " + e.message); setSending(false); return; }
        } else {
            if (!form.title.trim()) { setErr("Title is required."); return; }
            if (!form.message.trim()) { setErr("Message is required."); return; }
            setSending(true); setErr("");
            await sendEmailAndNotification({
                userId: profile.id, to: profile.email, userName: name, type: form.type,
                title: form.title.trim(), message: form.message.trim(),
                link: form.link.trim() || null,
            });
        }
        setSending(false);
        onSent();
    };

    const tabStyle = (t) => ({
        flex: 1, padding: "8px 0", fontSize: 13, fontWeight: 600, cursor: "pointer",
        border: "none", borderBottom: tab === t ? "2px solid #000" : "2px solid transparent",
        background: "none", color: tab === t ? "#000" : "var(--muted)", transition: "all 0.1s",
    });

    return (
        <div className="notif-overlay" onClick={onClose}>
            <div className="notif-modal" onClick={e => e.stopPropagation()}>
                <div className="notif-modal-head">
                    <div>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>Message User</div>
                        <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>To: {name} · {profile.email}</div>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={onClose}><Icon n="x" s={13} /></button>
                </div>
                <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 20px", flexShrink: 0 }}>
                    <button style={tabStyle("email")} onClick={() => { setTab("email"); setErr(""); }}>✉️ Email</button>
                    <button style={tabStyle("notif")} onClick={() => { setTab("notif"); setErr(""); }}>🔔 Notification</button>
                </div>
                <div className="notif-modal-body">
                    <div>
                        <label className="field-label">Type</label>
                        <select className="field-select" value={form.type} onChange={e => set("type", e.target.value)}>
                            {NOTIF_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                        </select>
                    </div>
                    {tab === "email" ? (<>
                        <div><label className="field-label">Subject</label><input className="field-input" placeholder="e.g. Getting Started with Lixeen" value={form.subject} onChange={e => set("subject", e.target.value)} /></div>
                        <div><label className="field-label">Title <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(heading in email)</span></label><input className="field-input" placeholder="e.g. Welcome to Lixeen!" value={form.title} onChange={e => set("title", e.target.value)} /></div>
                        <div><label className="field-label">Body</label><textarea className="field-textarea" placeholder="Write the email content…" value={form.body} onChange={e => set("body", e.target.value)} style={{ minHeight: 90 }} /></div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
                            <div><label className="field-label">Button label <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label><input className="field-input" placeholder="Go to Dashboard" value={form.ctaLabel} onChange={e => set("ctaLabel", e.target.value)} /></div>
                            <div><label className="field-label">Button URL <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label><input className="field-input" placeholder="https://app.lixeen.com/dashboard" value={form.ctaUrl} onChange={e => set("ctaUrl", e.target.value)} /></div>
                        </div>
                    </>) : (<>
                        <div><label className="field-label">Title</label><input className="field-input" placeholder="e.g. Your submission was accepted" value={form.title} onChange={e => set("title", e.target.value)} /></div>
                        <div><label className="field-label">Message</label><textarea className="field-textarea" placeholder="Write the notification body…" value={form.message} onChange={e => set("message", e.target.value)} /></div>
                        <div><label className="field-label">Link <span style={{ fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>(optional)</span></label><input className="field-input" placeholder="e.g. /dashboard#tasks/available" value={form.link} onChange={e => set("link", e.target.value)} /></div>
                    </>)}
                    {err && <div style={{ fontSize: 12, color: "var(--red)", background: "var(--red-bg)", border: "1px solid #ffd5d5", borderRadius: "var(--r-sm)", padding: "9px 12px" }}>⚠ {err}</div>}
                </div>
                <div className="notif-modal-foot">
                    <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                    <button className="btn btn-black" onClick={handleSend} disabled={sending}>
                        <Icon n="send" s={13} />{sending ? "Sending…" : tab === "email" ? "Send Email" : "Send Notification"}
                    </button>
                </div>
            </div>
        </div>
    );
}

function CredentialsSection({ profile, onToast }) {
    const [email, setEmail] = useState(profile.lixeen_email ?? "");
    const [password, setPassword] = useState(profile.lixeen_password ?? "");
    const [showPw, setShowPw] = useState(false);
    const [saving, setSaving] = useState(false);
    const [clearing, setClearing] = useState(false);
    const [links, setLinks] = useState(Array.isArray(profile.lixeen_links) ? profile.lixeen_links : []);
    const [linkSaving, setLinkSaving] = useState(false);
    const [newLink, setNewLink] = useState({ name: "", url: "", logo: "", color: "#333333", tag: "", desc: "" });
    const [addingLink, setAddingLink] = useState(false);
    const hasCredentials = !!profile.lixeen_email;

    const handleSave = async () => {
        if (!email.trim()) { onToast("❌ Email is required."); return; }
        if (!password.trim()) { onToast("❌ Password is required."); return; }
        setSaving(true);
        const { error } = await supabase.from("profiles").update({ lixeen_email: email.trim(), lixeen_password: password.trim() }).eq("id", profile.id);
        setSaving(false);
        if (error) { onToast("❌ Failed to save: " + error.message); return; }
        profile.lixeen_email = email.trim(); profile.lixeen_password = password.trim();
        onToast("✓ Credentials saved for " + (profile.first_name || profile.email));
    };

    const handleClear = async () => {
        if (!window.confirm("Clear credentials for this user?")) return;
        setClearing(true);
        const { error } = await supabase.from("profiles").update({ lixeen_email: null, lixeen_password: null }).eq("id", profile.id);
        setClearing(false);
        if (error) { onToast("❌ Failed to clear: " + error.message); return; }
        setEmail(""); setPassword("");
        profile.lixeen_email = null; profile.lixeen_password = null;
        onToast("✓ Credentials cleared");
    };

    const saveLinks = async (updated) => {
        setLinkSaving(true);
        const { error } = await supabase.from("profiles").update({ lixeen_links: updated }).eq("id", profile.id);
        setLinkSaving(false);
        if (error) { onToast("❌ Failed to save links: " + error.message); return false; }
        profile.lixeen_links = updated; return true;
    };

    const handleAddLink = async () => {
        if (!newLink.name.trim() || !newLink.url.trim()) { onToast("❌ Name and URL are required."); return; }
        const updated = [...links, { ...newLink, name: newLink.name.trim(), url: newLink.url.trim() }];
        if (await saveLinks(updated)) {
            setLinks(updated);
            setNewLink({ name: "", url: "", logo: "", color: "#333333", tag: "", desc: "" });
            setAddingLink(false);
            onToast("✓ Platform link added");
        }
    };

    const handleRemoveLink = async (idx) => {
        const updated = links.filter((_, i) => i !== idx);
        if (await saveLinks(updated)) { setLinks(updated); onToast("✓ Link removed"); }
    };

    const setNL = (k, v) => setNewLink(f => ({ ...f, [k]: v }));

    return (
        <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Lixeen Credentials</div>
                {hasCredentials
                    ? <span className="badge badge-green" style={{ marginLeft: "auto" }}>✓ Assigned</span>
                    : <span className="badge badge-grey" style={{ marginLeft: "auto" }}>Not assigned</span>}
            </div>

            <div style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", padding: 16, marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>
                    These credentials are shown to the user in their Credentials tab.
                </div>
                <div style={{ marginBottom: 10 }}>
                    <label className="field-label">Lixeen Email</label>
                    <input className="field-input" style={{ background: "#fff" }} placeholder="e.g. john.doe@lixeen.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div style={{ marginBottom: 14 }}>
                    <label className="field-label">Password</label>
                    <div style={{ display: "flex", gap: 6 }}>
                        <input className="field-input" type={showPw ? "text" : "password"} style={{ flex: 1, background: "#fff" }} placeholder="Assign a password" value={password} onChange={e => setPassword(e.target.value)} />
                        <button className="btn btn-outline btn-sm" onClick={() => setShowPw(s => !s)} style={{ flexShrink: 0, padding: "0 10px" }} title={showPw ? "Hide" : "Show"}>
                            {showPw ? "🙈" : "👁️"}
                        </button>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    <button className="btn btn-black btn-sm" style={{ flex: 1, justifyContent: "center" }} onClick={handleSave} disabled={saving}>
                        {saving ? "Saving…" : hasCredentials ? "Update Credentials" : "Assign Credentials"}
                    </button>
                    {hasCredentials && (
                        <button className="btn btn-danger btn-sm" onClick={handleClear} disabled={clearing} title="Clear credentials">
                            {clearing ? "…" : "🗑 Clear"}
                        </button>
                    )}
                </div>
            </div>

            <div style={{ background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text)" }}>Platform Links</div>
                        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Shown in the user's Credentials tab.</div>
                    </div>
                    <button className="btn btn-outline btn-sm" onClick={() => setAddingLink(a => !a)}>{addingLink ? "Cancel" : "+ Add Link"}</button>
                </div>
                {links.length > 0 && (
                    <div style={{ border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", overflow: "hidden", marginBottom: addingLink ? 14 : 0, background: "#fff" }}>
                        {links.map((l, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderBottom: i < links.length - 1 ? "1px solid var(--border)" : "none", fontSize: 12 }}>
                                <span style={{ fontSize: 16, flexShrink: 0 }}>{l.logo || "🔗"}</span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, color: "#000", marginBottom: 1 }}>{l.name}</div>
                                    <div style={{ color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.url}</div>
                                </div>
                                {l.tag && (
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: (l.color || "#333") + "18", color: l.color || "#333", border: `1px solid ${(l.color || "#333")}30`, borderRadius: "var(--r-pill)", flexShrink: 0 }}>{l.tag}</span>
                                )}
                                <button onClick={() => handleRemoveLink(i)} disabled={linkSaving}
                                    style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 14, padding: "0 4px", flexShrink: 0, lineHeight: 1 }}
                                    onMouseEnter={e => e.currentTarget.style.color = "#c00"}
                                    onMouseLeave={e => e.currentTarget.style.color = "#ccc"}
                                    title="Remove link">✕</button>
                            </div>
                        ))}
                    </div>
                )}
                {links.length === 0 && !addingLink && (
                    <div style={{ fontSize: 12, color: "var(--muted)", padding: "8px 0", fontStyle: "italic" }}>
                        No platform links assigned yet.
                    </div>
                )}
                {addingLink && (
                    <div style={{ background: "#fff", border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", padding: 14, marginTop: links.length > 0 ? 0 : 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>New Platform Link</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                            <div><label className="field-label">Platform Name *</label><input className="field-input" style={{ background: "var(--surface2)" }} placeholder="e.g. Scale AI" value={newLink.name} onChange={e => setNL("name", e.target.value)} /></div>
                            <div><label className="field-label">URL *</label><input className="field-input" style={{ background: "var(--surface2)" }} placeholder="https://scale.com/jobs" value={newLink.url} onChange={e => setNL("url", e.target.value)} /></div>
                            <div><label className="field-label">Emoji / Logo</label><input className="field-input" style={{ background: "var(--surface2)" }} placeholder="⚖️" value={newLink.logo} onChange={e => setNL("logo", e.target.value)} /></div>
                            <div><label className="field-label">Tag</label><input className="field-input" style={{ background: "var(--surface2)" }} placeholder="e.g. Top Platform" value={newLink.tag} onChange={e => setNL("tag", e.target.value)} /></div>
                            <div>
                                <label className="field-label">Brand Color</label>
                                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                    <input type="color" value={newLink.color} onChange={e => setNL("color", e.target.value)} style={{ width: 44, height: 36, padding: 2, border: "1.5px solid var(--border2)", borderRadius: "var(--r-sm)", cursor: "pointer", background: "#fff" }} />
                                    <input className="field-input" style={{ background: "var(--surface2)", flex: 1 }} placeholder="#6C5CE7" value={newLink.color} onChange={e => setNL("color", e.target.value)} />
                                </div>
                            </div>
                            <div><label className="field-label">Description</label><input className="field-input" style={{ background: "var(--surface2)" }} placeholder="Short description…" value={newLink.desc} onChange={e => setNL("desc", e.target.value)} /></div>
                        </div>
                        {newLink.name && (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", marginBottom: 12, fontSize: 12 }}>
                                <span style={{ fontSize: 18 }}>{newLink.logo || "🔗"}</span>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, color: "#000" }}>{newLink.name || "Platform Name"}</div>
                                    {newLink.desc && <div style={{ color: "var(--muted)", fontSize: 11 }}>{newLink.desc}</div>}
                                </div>
                                {newLink.tag && (
                                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", background: newLink.color + "18", color: newLink.color, border: `1px solid ${newLink.color}30`, borderRadius: "var(--r-pill)" }}>{newLink.tag}</span>
                                )}
                                <span style={{ color: "#bbb" }}>→</span>
                            </div>
                        )}
                        <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn btn-black btn-sm" onClick={handleAddLink} disabled={linkSaving} style={{ flex: 1, justifyContent: "center" }}>
                                {linkSaving ? "Saving…" : "Add Platform Link"}
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={() => { setAddingLink(false); setNewLink({ name: "", url: "", logo: "", color: "#333333", tag: "", desc: "" }); }}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function UserPanel({ profile, responses, onClose, onSave, onToast }) {
    const [selected, setSelected] = useState(new Set(profile.available_projects ?? []));
    const [saving, setSaving] = useState(false);
    const [showNotif, setShowNotif] = useState(false);
    const [notifSent, setNotifSent] = useState(false);
    const [locked, setLocked] = useState(!!profile.projects_locked);
    const [lockSaving, setLockSaving] = useState(false);
    const [verifyLink, setVerifyLink] = useState(profile.verification_link ?? "");
    const [isVerified, setIsVerified] = useState(!!profile.is_verified);
    const [verifyLinkSaving, setVerifyLinkSaving] = useState(false);
    const [verifyLinkSaved, setVerifyLinkSaved] = useState(false);

    const toggle = (table) => {
        setSelected(prev => { const next = new Set(prev); next.has(table) ? next.delete(table) : next.add(table); return next; });
    };

    const handleSave = async () => {
        setSaving(true);
        const prevProjects = new Set(profile.available_projects ?? []);
        const nextProjects = [...selected];
        const userName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.email;
        const newlyGranted = ALL_PROJECTS.filter(p => selected.has(p.table) && !prevProjects.has(p.table));
        const newlyRevoked = ALL_PROJECTS.filter(p => !selected.has(p.table) && prevProjects.has(p.table));
        const { error } = await supabase.from("profiles").update({ available_projects: nextProjects }).eq("id", profile.id);
        if (!error) {
            await Promise.all(newlyGranted.map(p => sendEmailAndNotification({ userId: profile.id, to: profile.email, userName, type: "project_assigned", title: `You've been assigned to ${p.codename}`, message: `You now have access to ${p.codename} — ${p.title}. Log in to your dashboard to start tasking.`, link: "/dashboard#tasks/available", emailExtras: { projectCodename: p.codename, projectTitle: p.title } })));
            await Promise.all(newlyRevoked.map(p => sendEmailAndNotification({ userId: profile.id, to: profile.email, userName, type: "project_revoked", title: `Access to ${p.codename} has been removed`, message: `Your access to ${p.codename} has been removed by an administrator.`, link: "/dashboard#tasks/available", emailExtras: { projectCodename: p.codename } })));
        }
        setSaving(false);
        onSave(profile.id, nextProjects, error);
    };

    const handleSaveVerifyLink = async () => {
        setVerifyLinkSaving(true);
        const { error } = await supabase.from("profiles").update({ verification_link: verifyLink.trim() || null }).eq("id", profile.id);
        setVerifyLinkSaving(false);
        if (!error) { setVerifyLinkSaved(true); setTimeout(() => setVerifyLinkSaved(false), 2500); }
    };

    const handleToggleVerified = async () => {
        const next = !isVerified;
        const { error } = await supabase.from("profiles").update({ is_verified: next }).eq("id", profile.id);
        if (!error) setIsVerified(next);
    };

    const handleToggleLock = async () => {
        setLockSaving(true);
        const newLocked = !locked;
        const { error } = await supabase.from("profiles").update({ projects_locked: newLocked }).eq("id", profile.id);
        if (!error) {
            setLocked(newLocked);
            const userName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.email;
            await sendEmailAndNotification({ userId: profile.id, to: profile.email, userName, type: "general", title: newLocked ? "Action Required: Submit Tax Documents" : "Projects Unlocked", message: newLocked ? "Your projects page has been locked. Please submit your tax documents to regain access." : "Your projects page has been unlocked. You can now access your projects.", link: "/dashboard#tasks" });
        }
        setLockSaving(false);
    };

    const userResponses = responses.filter(r => r.user_id === profile.id);
    const earned = userResponses.reduce((s, r) => s + ((r.time_spent_secs ?? 0) / 3600) * 25, 0);
    const name = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || profile.email || "—";

    return (
        <>
            <div className="detail-overlay" onClick={onClose}>
                <div className="detail-panel" onClick={e => e.stopPropagation()}>
                    <div className="detail-header">
                        <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {profile.email}{profile.state ? ` · 📍 ${profile.state}` : ""}
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: 8, flexShrink: 0, marginLeft: 8 }}>
                            <button className="btn btn-outline btn-sm" onClick={() => setShowNotif(true)}>
                                <Icon n="bell" s={13} /><span style={{ display: "none" }} className="btn-label"> Message</span>
                            </button>
                            <button className="btn btn-outline btn-sm" onClick={onClose}><Icon n="x" s={13} /></button>
                        </div>
                    </div>

                    <div className="detail-body">
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
                            {[
                                { label: "Responses", val: userResponses.filter(r => !r.skipped).length },
                                { label: "Skipped", val: userResponses.filter(r => r.skipped).length },
                                { label: "Earned", val: "$" + earned.toFixed(2) },
                            ].map(s => (
                                <div key={s.label} style={{ background: "var(--surface2)", borderRadius: "var(--r-sm)", padding: "12px 14px" }}>
                                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 4 }}>{s.label}</div>
                                    <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>{s.val}</div>
                                </div>
                            ))}
                        </div>

                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Recent Submissions</div>
                        {userResponses.length === 0 ? (
                            <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, padding: "12px 0" }}>No submissions yet.</div>
                        ) : (
                            <div style={{ border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", overflow: "hidden", marginBottom: 24 }}>
                                {userResponses.slice(0, 6).map((r, i) => (
                                    <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderBottom: i < Math.min(userResponses.length, 6) - 1 ? "1px solid var(--border)" : "none", fontSize: 12 }}>
                                        <div style={{ flex: 1, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {r.task_table ? r.task_table.replace(/^tasks_/, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "—"}
                                        </div>
                                        <div style={{ color: "var(--muted)", flexShrink: 0 }}>{r.time_spent_secs ? `${Math.floor(r.time_spent_secs / 60)}m ${r.time_spent_secs % 60}s` : "—"}</div>
                                        <span className={`badge ${r.skipped ? "badge-grey" : "badge-green"}`}>{r.skipped ? "Skipped" : "Submitted"}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <CredentialsSection profile={profile} onToast={onToast} />

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: locked ? "#fff5f5" : "#f0faf4", border: `1px solid ${locked ? "#ffd5d5" : "#b8e0c8"}`, borderRadius: "var(--r-sm)", marginBottom: 20, gap: 12 }}>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: locked ? "var(--red)" : "var(--green)" }}>{locked ? "🔒 Projects Locked" : "🔓 Projects Unlocked"}</div>
                                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>{locked ? "User must submit tax documents to access projects." : "User can access their assigned projects."}</div>
                            </div>
                            <button className={`btn btn-sm ${locked ? "btn-outline" : "btn-danger"}`} onClick={handleToggleLock} disabled={lockSaving} style={{ minWidth: 80, flexShrink: 0 }}>
                                {lockSaving ? "Saving…" : locked ? "Unlock" : "Lock Projects"}
                            </button>
                        </div>

                        <div style={{ marginBottom: 20, padding: 16, background: "var(--surface2)", borderRadius: "var(--r-sm)", border: "1px solid var(--border2)" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Identity Verification</div>
                                {isVerified ? <span className="badge badge-green">✓ Verified</span> : <span className="badge badge-grey">Not Verified</span>}
                            </div>
                            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
                                Paste the user's unique verification URL. The user will see a button linking to this URL in their dashboard.
                            </div>
                            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                                <input className="field-input" style={{ flex: 1, minWidth: 0 }} placeholder="https://verify.example.com/session/abc123…" value={verifyLink} onChange={e => { setVerifyLink(e.target.value); setVerifyLinkSaved(false); }} />
                                <button className="btn btn-black btn-sm" onClick={handleSaveVerifyLink} disabled={verifyLinkSaving} style={{ whiteSpace: "nowrap", flexShrink: 0 }}>
                                    {verifyLinkSaving ? "…" : verifyLinkSaved ? "✓ Saved" : "Save"}
                                </button>
                            </div>
                            <button className="btn btn-sm" onClick={handleToggleVerified} style={{ background: isVerified ? "var(--red-bg)" : "var(--green-bg)", color: isVerified ? "var(--red)" : "var(--green)", border: `1px solid ${isVerified ? "#ffd5d5" : "#b8e0c8"}`, fontSize: 11 }}>
                                {isVerified ? "✕ Mark as Unverified" : "✓ Mark as Verified"}
                            </button>
                        </div>

                        <div style={{ marginBottom: 20 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
                                <div style={{ fontSize: 13, fontWeight: 700 }}>Project Access</div>
                                <div style={{ display: "flex", gap: 8 }}>
                                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(new Set())}>Clear all</button>
                                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(new Set(ALL_PROJECTS.map(p => p.table)))}>Grant all</button>
                                </div>
                            </div>
                            <div className="proj-grid" style={{ marginBottom: 20 }}>
                                {ALL_PROJECTS.map(p => (
                                    <div key={p.table} className={`proj-toggle${selected.has(p.table) ? " on" : ""}`} onClick={() => toggle(p.table)}>
                                        <div className="proj-check" />
                                        <div className="proj-icon">{p.icon}</div>
                                        <div className="proj-info">
                                            <div className="proj-codename">{p.codename}</div>
                                            <div className="proj-title">{p.title}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: "flex", gap: 10 }}>
                                <button className="btn btn-black" style={{ flex: 1, justifyContent: "center" }} onClick={handleSave} disabled={saving}>
                                    {saving ? "Saving…" : "Save project access"}
                                </button>
                                <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                            </div>
                            {notifSent && (
                                <div style={{ marginTop: 12, padding: "10px 14px", background: "var(--green-bg)", border: "1px solid #b8e0c8", borderRadius: "var(--r-sm)", fontSize: 13, color: "var(--green)", fontWeight: 600 }}>
                                    ✓ Notification sent successfully
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showNotif && (
                <NotificationModal profile={profile} onClose={() => setShowNotif(false)} onSent={() => {
                    setShowNotif(false); setNotifSent(true); setTimeout(() => setNotifSent(false), 3000);
                }} />
            )}
        </>
    );
}

// ── Users Tab ────────────────────────────────────────────────────────────────
function UsersTab({ profiles, responses, loading, onRefresh, onToast }) {
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [notifying, setNotifying] = useState(null);

    const filtered = profiles.filter(p => {
        const name = [p.first_name, p.last_name, p.email].filter(Boolean).join(" ").toLowerCase();
        return name.includes(search.toLowerCase());
    });

    const handleSave = async (userId, projects, error) => {
        if (error) { onToast("❌ Failed to save: " + error.message); return; }
        onToast("✓ Project access updated");
        await onRefresh();
        setSelected(s => s ? { ...s, available_projects: projects } : null);
    };

    return (
        <>
            <div className="tab-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>All Users <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>({filtered.length})</span></div>
                <div className="tab-controls" style={{ display: "flex", gap: 10 }}>
                    <input className="search-input" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)} />
                    <button className="btn btn-outline" onClick={onRefresh}><Icon n="refresh" s={13} /></button>
                </div>
            </div>

            {loading ? (
                <div className="loading-center"><div className="spinner" /> Loading users…</div>
            ) : (
                <div className="card">
                    <div className="tbl-wrap">
                        <table className="tbl">
                            <thead>
                                <tr>
                                    <th>User</th><th>Email</th><th>State</th><th>Email Confirmed</th>
                                    <th>ID Verified</th><th>Projects Locked</th><th>Credentials</th>
                                    <th>Projects</th><th>Submissions</th><th>Earned</th><th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(p => {
                                    const userResp = responses.filter(r => r.user_id === p.id);
                                    const earned = userResp.filter(r => !r.skipped).reduce((s, r) => s + ((r.time_spent_secs ?? 0) / 3600) * 25, 0);
                                    const name = [p.first_name, p.last_name].filter(Boolean).join(" ") || "—";
                                    const projCount = (p.available_projects ?? []).length;
                                    return (
                                        <tr key={p.id}>
                                            <td>
                                                <div style={{ fontWeight: 600 }}>{name}</div>
                                                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2, fontFamily: "monospace" }}>{p.id.slice(0, 8)}…</div>
                                            </td>
                                            <td style={{ color: "var(--muted)" }}>{p.email ?? "—"}</td>
                                            <td>{p.state ? <span style={{ fontSize: 12 }}>📍 {p.state}</span> : <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>}</td>
                                            <td>{p.email_confirmed ? <span className="badge badge-green">✓ Confirmed</span> : <span className="badge badge-red">Unconfirmed</span>}</td>
                                            <td>{p.is_verified ? <span className="badge badge-green">✓ Verified</span> : <span className="badge badge-grey">Not verified</span>}</td>
                                            <td>{p.projects_locked ? <span className="badge badge-red">🔒 Locked</span> : <span className="badge badge-green">🔓 Open</span>}</td>
                                            <td>{p.lixeen_email ? <span className="badge badge-purple">🪪 Assigned</span> : <span className="badge badge-grey">None</span>}</td>
                                            <td>
                                                {projCount === 0 ? <span className="badge badge-red">No access</span>
                                                    : projCount === ALL_PROJECTS.length ? <span className="badge badge-green">All ({projCount})</span>
                                                        : <span className="badge badge-blue">{projCount} project{projCount !== 1 ? "s" : ""}</span>}
                                            </td>
                                            <td>{userResp.filter(r => !r.skipped).length}</td>
                                            <td style={{ fontWeight: 700 }}>${earned.toFixed(2)}</td>
                                            <td>
                                                <div style={{ display: "flex", gap: 6 }}>
                                                    <button className="btn btn-outline btn-sm" onClick={() => setNotifying(p)}><Icon n="bell" s={11} /></button>
                                                    <button className="btn btn-outline btn-sm" onClick={() => setSelected(p)}>Manage <Icon n="chevR" s={11} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                                {filtered.length === 0 && (
                                    <tr><td colSpan={11} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>No users found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selected && <UserPanel profile={selected} responses={responses} onClose={() => setSelected(null)} onSave={handleSave} onToast={onToast} />}
            {notifying && (
                <NotificationModal profile={notifying} onClose={() => setNotifying(null)} onSent={() => {
                    setNotifying(null);
                    onToast("✓ Notification sent to " + ([notifying.first_name, notifying.last_name].filter(Boolean).join(" ") || notifying.email));
                }} />
            )}
        </>
    );
}

// ── Responses Tab ────────────────────────────────────────────────────────────
function ResponsesTab({ profiles, responses, loading, onRefresh }) {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const getName = (userId) => {
        const p = profiles.find(p => p.id === userId);
        return p ? [p.first_name, p.last_name].filter(Boolean).join(" ") || p.email || "—" : userId?.slice(0, 8) + "…";
    };

    const filtered = responses.filter(r => {
        if (filter === "submitted" && r.skipped) return false;
        if (filter === "skipped" && !r.skipped) return false;
        const name = getName(r.user_id).toLowerCase();
        const table = (r.task_table ?? "").toLowerCase();
        return name.includes(search.toLowerCase()) || table.includes(search.toLowerCase());
    });

    const fmtDate = iso => iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

    return (
        <>
            <div className="tab-header resp-filters" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>All Responses <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>({filtered.length})</span></div>
                <div className="tab-controls" style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <select style={{ padding: "7px 10px", border: "1.5px solid var(--border2)", borderRadius: "var(--r-sm)", fontFamily: "var(--sans)", fontSize: 13, background: "#fff" }} value={filter} onChange={e => setFilter(e.target.value)}>
                        <option value="all">All responses</option>
                        <option value="submitted">Submitted only</option>
                        <option value="skipped">Skipped only</option>
                    </select>
                    <input className="search-input" placeholder="Search user or project…" value={search} onChange={e => setSearch(e.target.value)} />
                    <button className="btn btn-outline" onClick={onRefresh}><Icon n="refresh" s={13} /></button>
                </div>
            </div>
            {loading ? (
                <div className="loading-center"><div className="spinner" /> Loading responses…</div>
            ) : (
                <div className="card">
                    <div className="tbl-wrap">
                        <table className="tbl">
                            <thead><tr><th>User</th><th>Project</th><th>Task ID</th><th>Status</th><th>Time Spent</th><th>Earned</th><th>Submitted</th></tr></thead>
                            <tbody>
                                {filtered.slice(0, 100).map(r => (
                                    <tr key={r.id}>
                                        <td style={{ fontWeight: 600 }}>{getName(r.user_id)}</td>
                                        <td>
                                            <div style={{ fontWeight: 600, fontSize: 12 }}>{ALL_PROJECTS.find(p => p.table === r.task_table)?.codename ?? "—"}</div>
                                            <div style={{ fontSize: 11, color: "var(--muted)" }}>{r.task_table?.replace(/^tasks_/, "").replace(/_/g, " ") ?? "—"}</div>
                                        </td>
                                        <td style={{ fontFamily: "monospace", fontSize: 11, color: "var(--muted)" }}>{r.source_task_id ? String(r.source_task_id).slice(0, 8) + "…" : "—"}</td>
                                        <td><span className={`badge ${r.skipped ? "badge-grey" : "badge-green"}`}>{r.skipped ? "Skipped" : "Submitted"}</span></td>
                                        <td style={{ color: "var(--muted)" }}>{r.time_spent_secs ? `${Math.floor(r.time_spent_secs / 60)}m ${r.time_spent_secs % 60}s` : "—"}</td>
                                        <td style={{ fontWeight: 700 }}>{r.skipped ? "—" : "$" + ((r.time_spent_secs ?? 0) / 3600 * 25).toFixed(2)}</td>
                                        <td style={{ color: "var(--muted)", fontSize: 11 }}>{fmtDate(r.created_at)}</td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "32px" }}>No responses found.</td></tr>}
                                {filtered.length > 100 && <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "12px", fontSize: 12 }}>Showing first 100 of {filtered.length} rows.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
}

// ── Projects Tab ─────────────────────────────────────────────────────────────
function ProjectsTab({ profiles, responses }) {
    return (
        <>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Project Overview</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
                {ALL_PROJECTS.map(p => {
                    const projResp = responses.filter(r => r.task_table === p.table && !r.skipped);
                    const usersCount = new Set(projResp.map(r => r.user_id)).size;
                    const assignedTo = profiles.filter(pr => (pr.available_projects ?? []).includes(p.table));
                    const earned = projResp.reduce((s, r) => s + ((r.time_spent_secs ?? 0) / 3600 * 25), 0);
                    return (
                        <div className="card" key={p.id} style={{ marginBottom: 0 }}>
                            <div className="card-body">
                                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                                    <span style={{ fontSize: 22 }}>{p.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 13, fontWeight: 700 }}>{p.codename}</div>
                                        <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.title}</div>
                                    </div>
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                    {[
                                        { label: "Assigned users", val: assignedTo.length },
                                        { label: "Active workers", val: usersCount },
                                        { label: "Submissions", val: projResp.length },
                                        { label: "Total paid out", val: "$" + earned.toFixed(2) },
                                    ].map(s => (
                                        <div key={s.label} style={{ background: "var(--surface2)", borderRadius: 6, padding: "8px 10px" }}>
                                            <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
                                            <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 2 }}>{s.val}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
}

// ── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab({ profiles, loading: parentLoading, onToast }) {
    const [notifs, setNotifs] = useState([]);
    const [nLoading, setNLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");
    const [userFilter, setUserFilter] = useState("all");
    const [deleting, setDeleting] = useState({});

    useEffect(() => {
        setNLoading(true);
        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(500)
            .then(({ data, error }) => {
                if (error) console.error("Notifications fetch error:", error.message);
                setNotifs(data ?? []);
                setNLoading(false);
            });
    }, []);

    const getName = (userId) => {
        const p = profiles.find(p => p.id === userId);
        return p ? [p.first_name, p.last_name].filter(Boolean).join(" ") || p.email || "—" : userId?.slice(0, 8) + "…";
    };

    const filtered = notifs.filter(n => {
        if (filter === "unread" && n.read) return false;
        if (filter === "read" && !n.read) return false;
        if (typeFilter !== "all" && n.type !== typeFilter) return false;
        if (userFilter !== "all" && n.user_id !== userFilter) return false;
        const name = getName(n.user_id).toLowerCase();
        const title = (n.title ?? "").toLowerCase();
        const msg = (n.message ?? "").toLowerCase();
        return name.includes(search.toLowerCase()) || title.includes(search.toLowerCase()) || msg.includes(search.toLowerCase());
    });

    const handleDelete = async (id) => {
        setDeleting(d => ({ ...d, [id]: true }));
        const { error } = await supabase.from("notifications").delete().eq("id", id);
        if (error) { onToast("❌ Failed to delete"); setDeleting(d => ({ ...d, [id]: false })); }
        else { setNotifs(prev => prev.filter(n => n.id !== id)); onToast("✓ Notification deleted"); }
    };

    const totalUnread = notifs.filter(n => !n.read).length;
    const totalRead = notifs.filter(n => n.read).length;
    const types = [...new Set(notifs.map(n => n.type))].filter(Boolean);
    const usersWithNotifs = profiles.filter(p => notifs.some(n => n.user_id === p.id));
    const fmtDate = iso => iso ? new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }) : "—";

    return (
        <>
            <div className="stat-row" style={{ marginBottom: 20 }}>
                {[
                    { label: "Total Sent", val: notifs.length, sub: "all time" },
                    { label: "Unread", val: totalUnread, sub: "awaiting user" },
                    { label: "Read", val: totalRead, sub: "seen by user" },
                    { label: "Users Reached", val: new Set(notifs.map(n => n.user_id)).size, sub: "unique recipients" },
                ].map(s => (
                    <div className="stat-card" key={s.label}>
                        <div className="stat-label">{s.label}</div>
                        <div className="stat-val">{s.val}</div>
                        <div className="stat-sub">{s.sub}</div>
                    </div>
                ))}
            </div>
            <div className="tab-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>All Notifications <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)", marginLeft: 6 }}>({filtered.length})</span></div>
                <div className="tab-controls" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                    {[
                        [filter, setFilter, [["all", "All statuses"], ["unread", "Unread only"], ["read", "Read only"]]],
                        [typeFilter, setTypeFilter, [["all", "All types"], ...types.map(t => [t, `${notifTypeIcon(t)} ${t.replace(/_/g, " ")}`])]],
                        [userFilter, setUserFilter, [["all", "All users"], ...usersWithNotifs.map(p => [p.id, [p.first_name, p.last_name].filter(Boolean).join(" ") || p.email])]],
                    ].map(([val, setter, opts], i) => (
                        <select key={i} style={{ padding: "7px 10px", border: "1.5px solid var(--border2)", borderRadius: "var(--r-sm)", fontFamily: "var(--sans)", fontSize: 12, background: "#fff", maxWidth: 160 }}
                            value={val} onChange={e => setter(e.target.value)}>
                            {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                        </select>
                    ))}
                    <input className="search-input" style={{ width: 160 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
                    <button className="btn btn-outline" onClick={() => {
                        setNLoading(true);
                        supabase.from("notifications").select("*").order("created_at", { ascending: false }).limit(500)
                            .then(({ data }) => { setNotifs(data ?? []); setNLoading(false); });
                    }}><Icon n="refresh" s={13} /></button>
                </div>
            </div>
            {nLoading || parentLoading ? (
                <div className="loading-center"><div className="spinner" /> Loading notifications…</div>
            ) : (
                <div className="card">
                    {filtered.length === 0 ? (
                        <div style={{ padding: "48px", textAlign: "center", color: "var(--muted)" }}>
                            <div style={{ fontSize: 32, marginBottom: 12 }}>🔔</div>
                            <div style={{ fontSize: 14, fontWeight: 600 }}>No notifications found</div>
                        </div>
                    ) : (
                        <div className="tbl-wrap">
                            <table className="tbl">
                                <thead><tr><th>Recipient</th><th>Type</th><th>Title & Message</th><th>Status</th><th>Sent</th><th></th></tr></thead>
                                <tbody>
                                    {filtered.map(n => (
                                        <tr key={n.id}>
                                            <td>
                                                <div style={{ fontWeight: 600, fontSize: 13 }}>{getName(n.user_id)}</div>
                                                <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "monospace", marginTop: 2 }}>{n.user_id?.slice(0, 8)}…</div>
                                            </td>
                                            <td>
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 12, fontWeight: 600, background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--r-pill)", padding: "3px 10px", whiteSpace: "nowrap" }}>
                                                    {notifTypeIcon(n.type)} {n.type?.replace(/_/g, " ") ?? "general"}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: 240 }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</div>
                                                {n.message && <div style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.message}</div>}
                                                {n.link && <div style={{ fontSize: 10, color: "#888", marginTop: 2 }}>🔗 {n.link}</div>}
                                            </td>
                                            <td>{n.read ? <span className="badge badge-grey"><Icon n="eye" s={9} /> Read</span> : <span className="badge badge-blue">● Unread</span>}</td>
                                            <td style={{ fontSize: 11, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtDate(n.created_at)}</td>
                                            <td><button className="btn btn-danger btn-sm" disabled={deleting[n.id]} onClick={() => handleDelete(n.id)} style={{ fontSize: 11 }}>{deleting[n.id] ? "…" : "Delete"}</button></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

// ── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function AdminDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [view, setView] = useState("users");
    const [profiles, setProfiles] = useState([]);
    const [responses, setResponses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [checking, setChecking] = useState(true);
    const [toast, setToast] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const totalEarned = responses.filter(r => !r.skipped).reduce((s, r) => s + ((r.time_spent_secs ?? 0) / 3600 * 25), 0);

    useEffect(() => {
        if (!user?.id) return;
        supabase.from("profiles").select("*").eq("id", user.id).single()
            .then(({ data, error }) => {
                if (error) console.error("Admin check error:", error.message, error.code);
                setIsAdmin(data?.is_admin ?? false);
                setChecking(false);
            });
    }, [user?.id]);

    const fetchAll = useCallback(async () => {
        setLoading(true);
        const [{ data: prof }, { data: resp }] = await Promise.all([
            supabase.from("profiles_with_verification").select("*").order("created_at", { ascending: false }).limit(10000),
            supabase.from("user_responses").select("id, user_id, task_table, source_task_id, time_spent_secs, skipped, created_at").order("created_at", { ascending: false }).limit(10000),
        ]);
        setProfiles(prof ?? []);
        setResponses(resp ?? []);
        setLoading(false);
    }, []);

    useEffect(() => { if (!checking && isAdmin) fetchAll(); }, [checking, isAdmin]);

    const showToast = (msg) => setToast(msg);

    // Close sidebar when navigating on mobile
    const handleNav = (id) => { setView(id); setSidebarOpen(false); };

    if (checking) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", gap: 12, color: "#666", fontFamily: "system-ui" }}>
            <div className="spinner" /> Checking access…
        </div>
    );

    if (!isAdmin) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", flexDirection: "column", gap: 16, fontFamily: "system-ui", padding: 24, textAlign: "center" }}>
            <div style={{ fontSize: 48 }}>🔒</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Admin access required</div>
            <div style={{ fontSize: 14, color: "#666" }}>Your account does not have admin privileges.</div>
            <button onClick={() => navigate("/dashboard")} style={{ marginTop: 8, padding: "9px 20px", background: "#000", color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", fontWeight: 600 }}>
                Back to Dashboard
            </button>
        </div>
    );

    const NAV = [
        { id: "users", label: "Users", icon: "users" },
        { id: "responses", label: "Responses", icon: "responses" },
        { id: "projects", label: "Projects", icon: "projects" },
        { id: "notifications", label: "Notifications", icon: "notifs" },
    ];

    return (
        <>
            <style>{G}</style>
            <div className="admin-shell">
                {/* Sidebar overlay (mobile) */}
                {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

                <aside className={`admin-sidebar${sidebarOpen ? " open" : ""}`}>
                    <div className="sb-brand">⚡ Admin Panel<span>Tasker Platform</span></div>
                    <nav className="sb-nav">
                        <div className="sb-section">Management</div>
                        {NAV.map(n => (
                            <button key={n.id} className={`sb-item${view === n.id ? " active" : ""}`} onClick={() => handleNav(n.id)}>
                                <span className="sb-icon"><Icon n={n.icon} s={14} /></span>{n.label}
                            </button>
                        ))}
                        <div className="sb-section">Navigation</div>
                        <button className="sb-item" onClick={() => navigate("/dashboard")}>
                            <span className="sb-icon"><Icon n="home" s={14} /></span>Back to App
                        </button>
                    </nav>
                </aside>

                <div className="admin-main">
                    <header className="admin-topbar">
                        {/* Hamburger */}
                        <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle menu">
                            <span /><span /><span />
                        </button>

                        <div style={{ fontWeight: 700, fontSize: 14 }}>{NAV.find(n => n.id === view)?.label}</div>
                        <div className="topbar-email" style={{ marginLeft: "auto", fontSize: 12, color: "var(--muted)" }}>
                            Signed in as <strong>{user?.email}</strong>
                        </div>
                    </header>

                    <div className="admin-content">
                        <div className="stat-row">
                            {[
                                { label: "Total Users", val: profiles.length, sub: "registered accounts" },
                                { label: "Submissions", val: responses.filter(r => !r.skipped).length, sub: "completed responses" },
                                { label: "Total Paid Out", val: "$" + totalEarned.toFixed(2), sub: "at $25/hr" },
                                { label: "Active Projects", val: ALL_PROJECTS.length, sub: "in the platform" },
                            ].map(s => (
                                <div className="stat-card" key={s.label}>
                                    <div className="stat-label">{s.label}</div>
                                    <div className="stat-val">{s.val}</div>
                                    <div className="stat-sub">{s.sub}</div>
                                </div>
                            ))}
                        </div>

                        {view === "users" && <UsersTab profiles={profiles} responses={responses} loading={loading} onRefresh={fetchAll} onToast={showToast} />}
                        {view === "responses" && <ResponsesTab profiles={profiles} responses={responses} loading={loading} onRefresh={fetchAll} />}
                        {view === "projects" && <ProjectsTab profiles={profiles} responses={responses} />}
                        {view === "notifications" && <NotificationsTab profiles={profiles} loading={loading} onToast={showToast} />}
                    </div>
                </div>
            </div>

            {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
        </>
    );
}