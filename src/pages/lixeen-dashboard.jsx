import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "./auth/AuthContext";
import { LogoMark } from "../assets/constants/branding";

// ─── US States ────────────────────────────────────────────────────────────────
const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","District of Columbia",
];

function StateSelect({ value, onChange, className = "field-select", placeholder = "Select a state" }) {
  return (
    <select className={className} value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{placeholder}</option>
      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}

// ─── Hash persistence helpers ──────────────────────────────────────────────────
const VALID_VIEWS = ["overview", "tasks", "payments", "profile", "notifications", "settings", "assessment", "verification", "credentials"];
const VALID_SUBTABS = {
  tasks: ["available", "inprogress", "completed"],
  payments: ["overview", "methods", "history", "tax"],
  profile: ["info", "expertise", "security", "notifications"],
  assessment: ["english", "math", "stem"],
};
const DEFAULT_SUBTAB = {
  tasks: "available",
  payments: "overview",
  profile: "info",
  assessment: "english",
};

function parseHash() {
  const raw = window.location.hash.replace("#", "");
  const [view, sub] = raw.split("/");
  return { view, sub };
}
function buildHash(view, sub) { return sub ? `${view}/${sub}` : view; }
function getInitialView() {
  const { view } = parseHash();
  return VALID_VIEWS.includes(view) ? view : "overview";
}
function getInitialSub(view) {
  const { view: hView, sub } = parseHash();
  if (hView === view && VALID_SUBTABS[view]?.includes(sub)) return sub;
  return DEFAULT_SUBTAB[view] ?? null;
}
// ──────────────────────────────────────────────────────────────────────────────

const G = `
@import url('https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@300;400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:#f5f5f5; --surface:#ffffff; --surface2:#f0f0f0; --surface3:#e8e8e8;
  --border:#e0e0e0; --border2:#d0d0d0; --text:#000000; --sub:#000000; --muted:#000000;
  --lime:#c8f026; --lime-dim:rgba(200,240,38,0.08);; --lime-glow:rgba(200,240,38,0.18);;
  --purple:#333333; --red:#1a1a1a; --red-dim:rgba(0,0,0,0.08);
  --amber:#333333; --amber-dim:rgba(0,0,0,0.06); --blue:#1a1a1a; --blue-dim:rgba(0,0,0,0.06);
  --sans:'Anek Devanagari',system-ui,sans-serif;
  --r-pill:999px; --r-card:16px; --r-sm:8px; --sidebar-w:240px; --topbar-h:64px;
}
html,body{height:100%;}
body{font-family:var(--sans);color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:#cccccc;border-radius:4px;}
.shell{display:flex;min-height:100vh;}
.sidebar{width:var(--sidebar-w);flex-shrink:0;background:var(--surface);border-right:1px solid var(--border2);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;z-index:50;overflow-y:auto;overflow-x:hidden;}
.sidebar-top{padding:20px;border-bottom:1px solid var(--border);display:flex;flex-direction:column;gap:16px;}
.sidebar-user{display:flex;align-items:center;gap:10px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-sm);padding:10px 12px;}
.sidebar-av{width:34px;height:34px;border-radius:50%;flex-shrink:0;background:#e0e0e0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#000;}
.sidebar-user-name{font-size:13px;font-weight:700;color:#000;line-height:1.2;}
.sidebar-user-role{font-size:11px;color:var(--muted);}
.sidebar-user-state{font-size:10px;color:var(--muted);margin-top:1px;font-style:italic;}
.sidebar-user-badge{margin-left:auto;font-size:10px;font-weight:700;background:var(--surface2);color:var(--text);border:1px solid var(--border2);border-radius:var(--r-pill);padding:2px 8px;white-space:nowrap;flex-shrink:0;}
.sidebar-nav{padding:16px 12px;flex:1;}
.sidebar-nav-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted);padding:0 8px;margin-bottom:8px;margin-top:16px;}
.sidebar-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:var(--r-sm);font-size:13.5px;font-weight:500;color:var(--sub);cursor:pointer;transition:background 0.15s,color 0.15s;margin-bottom:2px;user-select:none;}
.sidebar-item:hover{background:var(--surface2);color:#000;}
.sidebar-item.active{background:var(--surface2);color:var(--text);border-left:2px solid var(--text);}
.sidebar-item-icon{flex-shrink:0;color:var(--muted);transition:color 0.15s;}
.sidebar-badge{margin-left:auto;font-size:10px;font-weight:700;background:var(--text);color:#fff;border-radius:var(--r-pill);padding:2px 7px;flex-shrink:0;}
.sidebar-item.locked-nav{opacity:0.4;cursor:not-allowed;}
.sidebar-item.locked-nav:hover{background:none;color:var(--sub);}
.sidebar-bottom{padding:12px;border-top:1px solid var(--border);}
.main{margin-left:var(--sidebar-w);flex:1;display:flex;flex-direction:column;min-height:100vh;overflow-x:hidden;}
.topbar{height:var(--topbar-h);display:flex;align-items:center;padding:0 32px;gap:16px;background:var(--surface);border-bottom:1px solid var(--border2);box-shadow:0 1px 0 var(--border2);position:sticky;top:0;z-index:40;}
.topbar-title{font-size:18px;font-weight:800;color:#000;letter-spacing:-0.03em;}
.topbar-sub{font-size:13px;color:var(--muted);margin-left:4px;}
.topbar-right{margin-left:auto;display:flex;align-items:center;gap:10px;}
.topbar-icon-btn{width:36px;height:36px;display:flex;align-items:center;justify-content:center;background:none;border:1px solid var(--border2);border-radius:var(--r-sm);color:var(--sub);cursor:pointer;transition:border-color 0.15s,color 0.15s;}
.topbar-icon-btn:hover{border-color:#000;color:#000;}
.notif-dot{position:relative;}
.notif-dot::after{content:'';position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:var(--text);border:1.5px solid var(--surface);}
.content{padding:28px 32px 48px;flex:1;}
.stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:28px;min-height:110px;}
.stat-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);padding:22px 24px;transition:border-color 0.2s;min-height:110px;}
.stat-card:hover{border-color:var(--border);}
.stat-card-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:10px;}
.stat-card-val{font-size:32px;font-weight:800;color:#000;letter-spacing:-0.04em;line-height:1;margin-bottom:8px;}
.stat-card-val.lime{color:var(--text);font-weight:800;}
.stat-card-delta{display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;}
.delta-up{color:var(--text);} .delta-neutral{color:var(--muted);}
.sec-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;gap:12px;}
.sec-header-left{display:flex;flex-direction:column;gap:2px;}
.sec-title{font-size:16px;font-weight:800;color:#000;letter-spacing:-0.02em;}
.sec-sub{font-size:13px;color:var(--muted);}
.tabs{display:flex;gap:2px;background:var(--surface2);border:1px solid var(--border2);border-radius:var(--r-pill);padding:3px;margin-bottom:20px;}
.tab{padding:8px 18px;border-radius:var(--r-pill);font-family:var(--sans);font-size:13px;font-weight:600;color:var(--muted);border:none;cursor:pointer;background:transparent;transition:background 0.15s,color 0.15s;white-space:nowrap;}
.tab.active{background:#0a0a0a;color:#fff;}
.tab:hover:not(.active){color:var(--sub);}
.task-list{display:flex;flex-direction:column;gap:10px;}
.task-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);padding:20px 24px;display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:start;transition:border-color 0.2s,transform 0.15s;cursor:pointer;}
.task-card:hover{border-color:var(--border);transform:translateY(-1px);}
.task-card-icon{width:44px;height:44px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:20px;background:var(--surface2);border:1px solid var(--border2);}
.task-card-title{font-size:14px;font-weight:700;color:#000;margin-bottom:4px;}
.task-card-tags{display:flex;gap:6px;flex-wrap:wrap;}
.task-tag{font-size:11px;font-weight:600;padding:3px 9px;border-radius:var(--r-pill);background:var(--surface2);border:1px solid var(--border2);color:var(--muted);}
.task-card-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
.task-pay{font-size:18px;font-weight:800;color:var(--text);letter-spacing:-0.03em;}
.task-pay-label{font-size:11px;color:var(--muted);}
.status{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;padding:4px 10px;border-radius:var(--r-pill);}
.status-dot{width:5px;height:5px;border-radius:50%;}
.status-available{background:var(--surface2);color:var(--text);border:1px solid var(--border2);}
.status-available .status-dot{background:var(--text);}
.status-inprogress{background:var(--surface2);color:var(--text);border:1px solid var(--border2);}
.status-inprogress .status-dot{background:var(--text);}
.status-completed{background:var(--surface2);color:var(--sub);border:1px solid var(--border2);}
.status-completed .status-dot{background:var(--sub);}
.prog-wrap{height:7px;background:var(--border2);border-radius:4px;overflow:hidden;flex:1;}
.prog-bar{height:100%;border-radius:4px;background:#000;transition:width 0.4s;}
.active-task-banner{background:linear-gradient(135deg,#f0f8e8 0%,#f5faf0 60%,var(--surface) 100%);border:1px solid rgba(200,240,38,0.2);border-radius:var(--r-card);padding:24px 28px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.active-task-info{flex:1;}
.active-task-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text);margin-bottom:6px;}
.active-task-title{font-size:18px;font-weight:800;color:#000;margin-bottom:10px;letter-spacing:-0.02em;}
.active-task-prog-row{display:flex;align-items:center;gap:12px;}
.active-task-prog-label{font-size:12px;color:var(--muted);white-space:nowrap;}
.active-task-actions{display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap;}
.btn-lime{display:inline-flex;align-items:center;gap:8px;font-family:var(--sans);font-size:13px;font-weight:700;cursor:pointer;border:none;border-radius:var(--r-pill);background:#0a0a0a;color:#fff;padding:0 18px;height:38px;transition:opacity 0.2s;white-space:nowrap;}
.btn-lime:hover{opacity:0.88;}
.btn-outline{display:inline-flex;align-items:center;gap:8px;font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;background:transparent;border-radius:var(--r-pill);border:1.5px solid var(--border2);color:var(--sub);padding:0 18px;height:38px;transition:border-color 0.15s,color 0.15s;white-space:nowrap;}
.btn-outline:hover{border-color:#000;color:#000;}
.btn-ghost{display:inline-flex;align-items:center;gap:6px;font-family:var(--sans);font-size:13px;font-weight:600;cursor:pointer;background:transparent;border:none;color:var(--sub);padding:0;transition:color 0.15s;white-space:nowrap;}
.btn-ghost:hover{color:#000;}
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:28px;}
.three-col{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:28px;}
.card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);}
.card-head{padding:18px 22px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px;}
.card-title{font-size:14px;font-weight:700;color:#000;}
.card-sub{font-size:12px;color:var(--muted);margin-top:2px;}
.card-body{padding:20px 22px;}
.perf-row{display:flex;align-items:center;gap:12px;margin-bottom:14px;}
.perf-row:last-child{margin-bottom:0;}
.perf-label{font-size:13px;color:var(--sub);width:120px;flex-shrink:0;}
.perf-val{font-size:13px;font-weight:700;color:var(--text);width:38px;text-align:right;flex-shrink:0;}
.earnings-chart{display:flex;align-items:flex-end;gap:6px;height:120px;margin-top:16px;}
.ec-bar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;}
.ec-bar{width:100%;border-radius:4px 4px 0 0;background:var(--surface3);transition:background 0.2s;min-height:8px;}
.ec-bar.active{background:var(--text);}
.ec-bar:hover{background:var(--text);opacity:0.5;}
.ec-label{font-size:10px;color:var(--muted);}
.earnings-row{display:flex;align-items:center;justify-content:space-between;padding:14px 0;border-bottom:1px solid var(--border);}
.earnings-row:first-child{padding-top:0;} .earnings-row:last-child{border-bottom:none;padding-bottom:0;}
.earnings-row-label{font-size:13.5px;color:var(--sub);}
.earnings-row-val{font-size:15px;font-weight:700;color:#000;}
.earnings-row-val.lime{color:var(--text);}
.tx-list{display:flex;flex-direction:column;}
.tx-row{display:flex;align-items:center;gap:14px;padding:14px 0;border-bottom:1px solid var(--border);}
.tx-row:last-child{border-bottom:none;}
.tx-icon{width:36px;height:36px;border-radius:10px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;background:var(--surface2);border:1px solid var(--border2);}
.tx-name{font-size:13.5px;font-weight:600;color:#000;margin-bottom:2px;}
.tx-date{font-size:12px;color:var(--muted);}
.tx-amount{margin-left:auto;font-size:14px;font-weight:700;}
.tx-amount.credit{color:var(--text);font-weight:700;} .tx-amount.debit{color:var(--sub);}
.tx-status-label{font-size:11px;color:var(--muted);text-align:right;margin-top:2px;}
.profile-avatar-row{display:flex;align-items:center;gap:20px;margin-bottom:28px;padding-bottom:28px;border-bottom:1px solid var(--border);}
.profile-av-large{width:72px;height:72px;border-radius:50%;flex-shrink:0;background:#e0e0e0;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#000;border:2px solid var(--border2);}
.profile-av-info{flex:1;}
.profile-av-name{font-size:18px;font-weight:800;color:#000;margin-bottom:4px;letter-spacing:-0.02em;}
.profile-av-role{font-size:13px;color:var(--muted);margin-bottom:10px;}
.form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:16px;}
.field{margin-bottom:18px;}
.field-label{display:block;font-size:11px;font-weight:700;color:var(--sub);margin-bottom:7px;text-transform:uppercase;letter-spacing:0.06em;}
.field-input{display:block;width:100%;height:44px;background:var(--surface2);border:1.5px solid var(--border2);border-radius:var(--r-sm);color:#000;font-family:var(--sans);font-size:14px;padding:0 14px;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
.field-input::placeholder{color:#999;}
.field-input:focus{border-color:var(--text);box-shadow:0 0 0 3px rgba(0,0,0,0.07);}
.field-textarea{display:block;width:100%;min-height:90px;background:var(--surface2);border:1.5px solid var(--border2);border-radius:var(--r-sm);color:#000;font-family:var(--sans);font-size:14px;padding:12px 14px;outline:none;resize:vertical;transition:border-color 0.2s,box-shadow 0.2s;}
.field-textarea:focus{border-color:var(--text);box-shadow:0 0 0 3px rgba(0,0,0,0.07);}
.field-select{display:block;width:100%;height:44px;background:var(--surface2);border:1.5px solid var(--border2);border-radius:var(--r-sm);color:#000;font-family:var(--sans);font-size:14px;padding:0 14px;outline:none;cursor:pointer;transition:border-color 0.2s;appearance:none;}
.skill-tags{display:flex;flex-wrap:wrap;gap:7px;margin-top:8px;}
.skill-tag{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:600;padding:5px 12px;border-radius:var(--r-pill);background:var(--surface2);border:1px solid var(--border2);color:var(--text);}
.skill-tag-x{width:14px;height:14px;border-radius:50%;background:rgba(0,0,0,0.1);display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:9px;color:var(--text);flex-shrink:0;}
.skill-tag-x:hover{background:rgba(0,0,0,0.2);}
.skill-add-input{background:var(--surface2);border:1.5px dashed var(--border2);border-radius:var(--r-pill);color:#000;font-family:var(--sans);font-size:12px;padding:5px 12px;outline:none;width:120px;transition:border-color 0.2s;}
.notif-item{display:flex;align-items:flex-start;gap:12px;padding:16px 0;border-bottom:1px solid var(--border);transition:background 0.15s;cursor:pointer;}
.notif-item:last-child{border-bottom:none;}
.notif-item:hover{background:var(--surface2);margin:0 -22px;padding:16px 22px;}
.notif-item.unread{background:#fafafa;}
.notif-item.unread:hover{background:var(--surface2);}
.notif-dot-outer{width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:6px;}
.notif-dot-outer.unread{background:var(--text);} .notif-dot-outer.read{background:var(--border2);}
.notif-icon-wrap{width:36px;height:36px;border-radius:10px;background:var(--surface2);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0;}
.notif-text{font-size:13.5px;color:var(--sub);line-height:1.6;}
.notif-text strong{color:#000;}
.notif-time{font-size:11px;color:var(--muted);margin-top:3px;}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes slideDown{from{opacity:0;transform:translateY(-12px);}to{opacity:1;transform:translateY(0);}}
.payout-next{background:linear-gradient(135deg,#f0f8e8 0%,#f5faf0 60%,var(--surface) 100%);border:1px solid rgba(200,240,38,0.2);border-radius:var(--r-card);padding:24px 26px;display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;flex-wrap:wrap;gap:16px;}
.payout-next-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--text);margin-bottom:6px;}
.payout-next-amount{font-size:36px;font-weight:800;color:#000;letter-spacing:-0.04em;line-height:1;}
.payout-next-sub{font-size:13px;color:var(--muted);margin-top:4px;}
.payout-next-date{text-align:right;}
.payout-date-label{font-size:12px;color:var(--muted);margin-bottom:4px;}
.payout-date-val{font-size:18px;font-weight:800;color:#000;letter-spacing:-0.02em;}
.divider{height:1px;background:var(--border);margin:24px 0;}
.empty{text-align:center;padding:48px 24px;color:var(--muted);}
.empty-icon{font-size:36px;margin-bottom:12px;}
.empty-title{font-size:15px;font-weight:700;color:var(--sub);margin-bottom:6px;}
.empty-desc{font-size:13px;line-height:1.6;}
.completed-table{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);overflow:hidden;}
.completed-table-head{display:grid;grid-template-columns:80px 1fr 110px 130px 90px;gap:0;padding:10px 20px;background:var(--surface2);border-bottom:1px solid var(--border2);}
.completed-table-head-cell{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);}
.completed-table-row{display:grid;grid-template-columns:80px 1fr 110px 130px 90px;gap:0;align-items:center;padding:9px 20px;border-bottom:1px solid var(--border);transition:background 0.15s;cursor:pointer;}
.completed-table-row:last-child{border-bottom:none;}
.completed-table-row:hover{background:var(--surface2);}
.assess-hero{background:linear-gradient(135deg,#f5f5f5 0%,#fafafa 100%);border:1px solid var(--border2);border-radius:var(--r-card);padding:28px 32px;margin-bottom:24px;display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;}
.assess-q-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);padding:28px 32px;margin-bottom:16px;}
.assess-q-num{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:10px;}
.assess-q-text{font-size:16px;font-weight:700;color:#000;line-height:1.55;margin-bottom:20px;letter-spacing:-0.01em;}
.assess-options{display:flex;flex-direction:column;gap:9px;}
.assess-opt{display:flex;align-items:center;gap:12px;padding:13px 16px;border-radius:var(--r-sm);border:1.5px solid var(--border2);background:var(--surface2);cursor:pointer;transition:border-color 0.15s,background 0.15s;font-size:14px;color:#000;font-family:var(--sans);}
.assess-opt:hover{border-color:#999;background:#f8f8f8;}
.assess-opt.selected{border-color:#000;background:#f0f0f0;}
.assess-opt.correct{border-color:#1a7a3f;background:#e8f5ee;}
.assess-opt.wrong{border-color:#c00;background:#fff5f5;}
.assess-opt-letter{width:26px;height:26px;border-radius:50%;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0;background:var(--surface);}
.assess-opt.selected .assess-opt-letter{border-color:#000;background:#000;color:#fff;}
.assess-opt.correct .assess-opt-letter{border-color:#1a7a3f;background:#1a7a3f;color:#fff;}
.assess-opt.wrong .assess-opt-letter{border-color:#c00;background:#c00;color:#fff;}
.assess-progress{display:flex;align-items:center;gap:10px;margin-bottom:20px;}
.assess-prog-bar-wrap{flex:1;height:6px;background:var(--border2);border-radius:3px;overflow:hidden;}
.assess-prog-bar{height:100%;background:#000;border-radius:3px;transition:width 0.4s;}
.assess-result-card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);padding:40px 32px;text-align:center;margin-bottom:16px;}
.assess-score-ring{width:100px;height:100px;border-radius:50%;border:5px solid #000;display:flex;align-items:center;justify-content:center;margin:0 auto 20px;font-size:26px;font-weight:800;color:#000;letter-spacing:-0.04em;}
.assess-toast{position:fixed;top:24px;left:50%;transform:translateX(-50%);background:#000;color:#fff;border-radius:var(--r-pill);padding:12px 22px;font-size:13px;font-weight:600;display:flex;align-items:center;gap:10px;z-index:500;box-shadow:0 8px 32px rgba(0,0,0,0.22);animation:slideDown 0.35s ease;white-space:nowrap;}
.assess-toast-icon{font-size:16px;}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal-box{background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-card);padding:32px 28px;max-width:420px;width:100%;box-shadow:0 24px 64px rgba(0,0,0,0.18);}
.modal-icon{font-size:32px;margin-bottom:16px;}
.modal-title{font-size:17px;font-weight:800;color:#000;margin-bottom:8px;letter-spacing:-0.02em;}
.modal-body{font-size:13.5px;color:#444;line-height:1.65;margin-bottom:24px;}
.modal-body strong{color:#000;}
.modal-actions{display:flex;gap:10px;flex-wrap:wrap;}

/* ── Mobile overlay backdrop ── */
.sidebar-backdrop {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.45);
  z-index: 49;
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
.sidebar-backdrop.open { display: block; }

/* ── Mobile topbar hamburger ── */
.topbar-hamburger {
  display: none;
  flex-direction: column; justify-content: center; align-items: center; gap: 5px;
  width: 36px; height: 36px;
  background: none; border: 1px solid var(--border2);
  border-radius: var(--r-sm); cursor: pointer; flex-shrink: 0;
  transition: border-color 0.15s;
}
.topbar-hamburger:hover { border-color: #000; }
.topbar-hamburger span {
  display: block; width: 15px; height: 1.5px;
  background: #333; border-radius: 2px; transition: all 0.22s;
}
.topbar-hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.topbar-hamburger.open span:nth-child(2) { opacity: 0; }
.topbar-hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ── Mobile topbar logo (hidden on desktop) ── */
.topbar-logo-mobile {
  display: none;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  flex-shrink: 0;
}
.topbar-logo-mobile .nav-logo-mark {
  width: 28px; height: 28px;
  background: var(--lime);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.topbar-logo-mobile .nav-logo-name {
  font-size: 17px; font-weight: 800; color: #0a0a0a; letter-spacing: -0.5px;
}

/* ── Responsive breakpoints ── */
@media (max-width: 1100px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .two-col { grid-template-columns: 1fr; }
  .three-col { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 800px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 50;
    box-shadow: none;
  }
  .sidebar.mobile-open {
    transform: translateX(0);
    box-shadow: 4px 0 32px rgba(0,0,0,0.15);
  }
  .main { margin-left: 0; }
  .topbar { padding: 0 16px; gap: 10px; }
  .topbar-title { display: none; }
  .topbar-sub { display: none; }
  .topbar-hamburger { display: flex; }
  .topbar-logo-mobile { display: flex; }
  .content { padding: 20px 16px 60px; }
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }
  .stat-card { padding: 16px 18px; min-height: auto; }
  .stat-card-val { font-size: 24px; }
  .three-col { grid-template-columns: 1fr; }
  .task-card {
    grid-template-columns: auto 1fr;
    gap: 12px;
  }
  .task-card-right { display: none; }
  .task-card { padding: 14px 16px; }
  .completed-table-head { grid-template-columns: 70px 1fr 90px; }
  .completed-table-row { grid-template-columns: 70px 1fr 90px; }
  .completed-table-row > *:nth-child(3),
  .completed-table-head > *:nth-child(3) { display: none; }
  .tabs {
    overflow-x: auto;
    flex-wrap: nowrap;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .tabs::-webkit-scrollbar { display: none; }
  .tab { white-space: nowrap; padding: 7px 14px; font-size: 12px; }
  .form-grid-2 { grid-template-columns: 1fr; }
  .assess-hero { flex-direction: column; gap: 16px; }
  .assess-hero > div:last-child { width: 100%; }
  .assess-hero > div:last-child button { width: 100%; justify-content: center; }
  .active-task-banner { flex-direction: column; }
  .active-task-actions { flex-direction: row; }
  .jd-bottom-cta { flex-direction: column; align-items: flex-start; }
  .payout-next { flex-direction: column; }
  .card-head { flex-wrap: wrap; gap: 8px; }
}

@media (max-width: 480px) {
  .stats-row { grid-template-columns: 1fr 1fr; gap: 8px; }
  .stat-card-val { font-size: 20px; }
  .stat-card-label { font-size: 10px; }
  .topbar { height: 56px; }
  .content { padding: 16px 12px 60px; }
  :root { --sidebar-w: 260px; }
  .assess-q-card { padding: 20px 18px; }
  .assess-q-text { font-size: 14px; }
  .modal-box { padding: 24px 20px; }
  .modal-actions { flex-direction: column; }
  .modal-actions button { width: 100%; justify-content: center; }
}
.nav-logo{display:flex;align-items:center;gap:10px;text-decoration:none;flex-shrink:0;cursor:pointer;}
.nav-logo-mark{width:34px;height:34px;background:var(--lime);border-radius:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;}
.nav-logo-name{font-size:20px;font-weight:800;color:#0a0a0a;letter-spacing:-0.5px;}
.task-card.locked{opacity:0.6;cursor:not-allowed;}
.task-card.locked:hover{transform:none;border-color:var(--border2);}
.state-edit-row{display:flex;align-items:center;gap:6px;margin-top:2px;}
.state-edit-select{background:var(--surface2);border:1px solid var(--border2);border-radius:6px;color:#000;font-family:var(--sans);font-size:11px;padding:2px 6px;outline:none;cursor:pointer;max-width:140px;appearance:none;}
.state-edit-btn{font-size:10px;font-weight:700;color:var(--text);background:none;border:none;cursor:pointer;padding:0;text-decoration:underline;text-underline-offset:2px;}
/* ── Lock Banner ── */
.lock-banner{display:flex;align-items:flex-start;gap:14px;background:#fffbeb;border:1px solid #fde68a;border-radius:var(--r-card);padding:18px 22px;margin-bottom:28px;}
.lock-banner-icon{font-size:24px;flex-shrink:0;margin-top:2px;}
.lock-banner-title{font-size:14px;font-weight:800;color:#92400e;margin-bottom:4px;}
.lock-banner-desc{font-size:13px;color:#78350f;line-height:1.6;}
/* ── Verification view ── */
.verify-step{display:flex;align-items:flex-start;gap:14px;margin-bottom:16px;}
.verify-step-num{width:28px;height:28px;border-radius:50%;background:#0a0a0a;color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;flex-shrink:0;}
/* ── Credentials view ── */
.platform-row{display:flex;align-items:center;gap:14px;padding:14px 22px;border-bottom:1px solid var(--border);text-decoration:none;transition:background 0.15s;cursor:pointer;}
.platform-row:last-child{border-bottom:none;}
.platform-row:hover{background:var(--surface2);}
.platform-logo{width:42px;height:42px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.cred-field-row{display:flex;gap:8px;align-items:center;margin-bottom:16px;}
.cred-display{flex:1;height:44px;background:#fafafa;border:1.5px solid var(--border2);border-radius:var(--r-sm);color:#000;font-family:var(--sans);font-size:14px;padding:0 14px;display:flex;align-items:center;font-weight:600;user-select:all;}
.copy-btn{height:44px;padding:0 16px;background:var(--surface2);border:1.5px solid var(--border2);border-radius:var(--r-sm);font-family:var(--sans);font-size:12px;font-weight:700;color:var(--sub);cursor:pointer;transition:border-color 0.15s,color 0.15s,background 0.15s;white-space:nowrap;display:flex;align-items:center;gap:6px;flex-shrink:0;}
.copy-btn:hover{border-color:#000;color:#000;}
.copy-btn.copied{background:#000;color:#fff;border-color:#000;}
`;

const getInitials = (n) => {
  if (!n) return "";
  return n.trim().split(/\s+/).filter(Boolean).map(p => p[0].toUpperCase()).join("");
};

const I = ({ n, s = 16, c = "currentColor" }) => {
  const paths = {
    home: <><rect x="3" y="9" width="18" height="13" rx="2" /><polyline points="3 9 12 3 21 9" /></>,
    tasks: <><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="9" y1="9" x2="15" y2="9" /><line x1="9" y1="13" x2="15" y2="13" /></>,
    wallet: <><rect x="2" y="6" width="20" height="14" rx="2" /><path d="M16 14a1 1 0 1 0 2 0 1 1 0 0 0-2 0z" fill={c} /><path d="M2 10h20" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" /></>,
    bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></>,
    trending: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></>,
    edit: <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></>,
    download: <><polyline points="8 17 12 21 16 17" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" /></>,
    search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
    arrow: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
    zap: <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    award: <><circle cx="12" cy="8" r="6" /><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" /></>,
    clipboard: <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
    key: <><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" /></>,
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[n]}</svg>;
};

const formatMemberInfo = (role, confirmedAt) => {
  if (!confirmedAt) return role;
  const date = new Date(confirmedAt);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${role} · Member since ${months[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
};


// ── Assessment Questions ─────────────────────────────────────────────────────
const ASSESSMENT_QUESTIONS = {
  english: [
    { id: "en1", question: "Which sentence uses the correct form of the verb?", options: ["Neither the manager nor the employees was informed.", "Neither the manager nor the employees were informed.", "Neither the manager nor the employees is informed.", "Neither the manager nor the employees are been informed."], answer: 1, explanation: "When using 'neither...nor', the verb agrees with the subject closest to it. 'Employees' is plural, so 'were' is correct." },
    { id: "en2", question: "Identify the rhetorical device used: 'The wind howled and the rain wept across the moor.'", options: ["Simile", "Alliteration", "Personification", "Hyperbole"], answer: 2, explanation: "Personification attributes human qualities (howling, weeping) to non-human things." },
    { id: "en3", question: "Which word is a synonym for 'ephemeral'?", options: ["Eternal", "Transient", "Substantial", "Obscure"], answer: 1, explanation: "'Ephemeral' means lasting for a very short time, which is synonymous with 'transient'." },
    { id: "en4", question: "Choose the correctly punctuated sentence:", options: ["Its a beautiful day, isn't it.", "It's a beautiful day, isn't it?", "Its' a beautiful day isnt it?", "It's a beautiful day isn't it."], answer: 1, explanation: "'It's' is a contraction of 'it is'. The tag question 'isn't it?' requires a question mark." },
    { id: "en5", question: "What is the main purpose of a thesis statement in an essay?", options: ["To provide background information on the topic", "To summarise the conclusion of the essay", "To present the central argument or claim the essay will support", "To list the evidence that will be discussed"], answer: 2, explanation: "A thesis statement presents the central argument or claim that the rest of the essay will support and develop." },
    { id: "en6", question: "Which of the following is an example of a complex sentence?", options: ["She ran, and he followed.", "The dog barked loudly.", "Although it was raining, they continued hiking.", "She is smart. He is kind."], answer: 2, explanation: "A complex sentence contains one independent clause and at least one dependent clause. 'Although it was raining' is the dependent clause." },
    { id: "en7", question: "What does the prefix 'circum-' mean in words like 'circumnavigate'?", options: ["Against", "Through", "Around", "Before"], answer: 2, explanation: "'Circum-' comes from Latin meaning 'around'. To circumnavigate means to travel around something." },
    { id: "en8", question: "In the sentence 'The committee has made its decision', which word is the collective noun?", options: ["Made", "Decision", "Committee", "Its"], answer: 2, explanation: "A collective noun names a group of people or things. 'Committee' refers to a group of people acting as one unit." },
    { id: "en9", question: "Which literary technique involves a direct address to an absent or imaginary person?", options: ["Soliloquy", "Apostrophe", "Aside", "Monologue"], answer: 1, explanation: "Apostrophe is a figure of speech in which a speaker directly addresses someone absent, dead, or imaginary." },
    { id: "en10", question: "Choose the word that correctly completes the sentence: 'The data ___ clearly show an upward trend.'", options: ["is", "was", "are", "has"], answer: 2, explanation: "'Data' is the plural of 'datum' and takes a plural verb in formal writing. 'Are' is correct." },
  ],
  math: [
    { id: "ma1", question: "If f(x) = 3x² − 2x + 1, what is f(−2)?", options: ["9", "17", "13", "21"], answer: 1, explanation: "f(−2) = 3(4) − 2(−2) + 1 = 12 + 4 + 1 = 17" },
    { id: "ma2", question: "A circle has a radius of 7 cm. What is its area? (Use π ≈ 3.14)", options: ["43.96 cm²", "153.86 cm²", "49 cm²", "21.98 cm²"], answer: 1, explanation: "Area = πr² = 3.14 × 49 = 153.86 cm²" },
    { id: "ma3", question: "Solve for x: 2x + 5 = 3x − 7", options: ["x = 2", "x = 12", "x = −2", "x = 7"], answer: 1, explanation: "2x + 5 = 3x − 7 → 5 + 7 = 3x − 2x → x = 12" },
    { id: "ma4", question: "What is the probability of rolling a sum of 7 with two standard six-sided dice?", options: ["1/6", "1/12", "7/36", "5/36"], answer: 0, explanation: "There are 6 ways to roll a 7: (1,6),(2,5),(3,4),(4,3),(5,2),(6,1). Probability = 6/36 = 1/6." },
    { id: "ma5", question: "Which of the following is equivalent to log₂(32)?", options: ["4", "5", "6", "3"], answer: 1, explanation: "log₂(32) = log₂(2⁵) = 5" },
    { id: "ma6", question: "A train travels 360 km in 4 hours. What is its average speed in km/h?", options: ["80 km/h", "90 km/h", "100 km/h", "72 km/h"], answer: 1, explanation: "Speed = Distance ÷ Time = 360 ÷ 4 = 90 km/h" },
    { id: "ma7", question: "What is the value of the expression: 4! + 3! − 2!", options: ["26", "28", "30", "22"], answer: 1, explanation: "4! = 24, 3! = 6, 2! = 2. So 24 + 6 − 2 = 28." },
    { id: "ma8", question: "If a square has a diagonal of 10 cm, what is its side length?", options: ["5√2 cm", "5 cm", "10√2 cm", "√10 cm"], answer: 0, explanation: "For a square with diagonal d: side = d/√2 = 10/√2 = 5√2 cm." },
    { id: "ma9", question: "Which expression is equivalent to (x + 3)(x − 5)?", options: ["x² − 8x − 15", "x² − 2x − 15", "x² + 2x − 15", "x² − 2x + 15"], answer: 1, explanation: "(x+3)(x−5) = x² − 5x + 3x − 15 = x² − 2x − 15" },
    { id: "ma10", question: "What is the median of the data set: {3, 7, 9, 2, 5, 8, 1}?", options: ["5", "7", "9", "3"], answer: 0, explanation: "Sorted: {1, 2, 3, 5, 7, 8, 9}. The middle value (4th of 7) is 5." },
  ],
  stem: [
    { id: "st1", question: "Which law states that the volume of a gas is directly proportional to its temperature at constant pressure?", options: ["Boyle's Law", "Charles's Law", "Avogadro's Law", "Gay-Lussac's Law"], answer: 1, explanation: "Charles's Law states V ∝ T at constant pressure." },
    { id: "st2", question: "What is the Big-O time complexity of binary search on a sorted array?", options: ["O(n)", "O(n²)", "O(log n)", "O(1)"], answer: 2, explanation: "Binary search halves the search space each step, giving O(log n) complexity." },
    { id: "st3", question: "In a DNA double helix, adenine pairs with which base?", options: ["Cytosine", "Guanine", "Uracil", "Thymine"], answer: 3, explanation: "In DNA, adenine (A) pairs with thymine (T) via two hydrogen bonds." },
    { id: "st4", question: "An object is dropped from rest. How far does it fall in 3 seconds? (g = 10 m/s²)", options: ["30 m", "45 m", "90 m", "15 m"], answer: 1, explanation: "s = ½gt² = ½ × 10 × 9 = 45 m" },
    { id: "st5", question: "Which data structure uses LIFO (Last In, First Out) ordering?", options: ["Queue", "Linked List", "Stack", "Binary Tree"], answer: 2, explanation: "A stack operates on LIFO: the last item pushed is the first to be popped." },
    { id: "st6", question: "What is the atomic number of carbon?", options: ["6", "12", "8", "14"], answer: 0, explanation: "Carbon has 6 protons, giving it an atomic number of 6." },
    { id: "st7", question: "Which planet has the most confirmed moons in our solar system?", options: ["Jupiter", "Saturn", "Uranus", "Neptune"], answer: 1, explanation: "As of recent cataloguing, Saturn holds the record with over 140 confirmed moons." },
    { id: "st8", question: "In object-oriented programming, what principle means a subclass can substitute for its parent class?", options: ["Encapsulation", "Polymorphism", "Abstraction", "Liskov Substitution"], answer: 3, explanation: "The Liskov Substitution Principle states that subtypes must be substitutable for their base types." },
    { id: "st9", question: "What is the SI unit of electrical resistance?", options: ["Volt", "Ampere", "Ohm", "Watt"], answer: 2, explanation: "The ohm (Ω) is the SI unit of electrical resistance, named after Georg Simon Ohm." },
    { id: "st10", question: "Which algorithm design paradigm breaks a problem into smaller overlapping subproblems and stores results?", options: ["Greedy", "Divide and Conquer", "Backtracking", "Dynamic Programming"], answer: 3, explanation: "Dynamic programming solves overlapping subproblems and stores (memoises) results to avoid recomputation." },
  ],
};

const ASSESSMENT_META = {
  english: { icon: "📝", label: "English", desc: "Grammar, vocabulary, comprehension & rhetoric", color: "#1a1a2e" },
  math: { icon: "🔢", label: "Mathematics", desc: "Algebra, geometry, statistics & problem solving", color: "#0a0a0a" },
  stem: { icon: "🔬", label: "STEM", desc: "Science, technology, engineering & biology", color: "#111827" },
};

// ── AI Job Platforms ──────────────────────────────────────────────────────────
const AI_JOB_PLATFORMS = [
  {
    name: "Scale AI",
    url: "https://scale.com/jobs",
    logo: "⚖️",
    color: "#6C5CE7",
    desc: "Data annotation & AI training tasks",
    tag: "Top Platform",
  },
  {
    name: "Remotasks",
    url: "https://www.remotasks.com",
    logo: "🎯",
    color: "#00B894",
    desc: "Flexible annotation & labeling work",
    tag: "Beginner Friendly",
  },
  {
    name: "Appen",
    url: "https://appen.com/jobs/",
    logo: "🔵",
    color: "#0984E3",
    desc: "AI data collection & quality review",
    tag: "Global",
  },
  {
    name: "Outlier AI",
    url: "https://outlier.ai/apply",
    logo: "✦",
    color: "#E17055",
    desc: "RLHF & model evaluation projects",
    tag: "High Pay",
  },
  {
    name: "DataAnnotation.tech",
    url: "https://dataannotation.tech",
    logo: "📊",
    color: "#FDCB6E",
    desc: "Coding, writing & AI feedback tasks",
    tag: "Popular",
  },
  {
    name: "Surge AI",
    url: "https://app.surgehq.ai",
    logo: "⚡",
    color: "#F39C12",
    desc: "NLP labeling & prompt writing",
    tag: "Specialized",
  },
  {
    name: "Toloka",
    url: "https://toloka.ai/tolokers/",
    logo: "🌐",
    color: "#2196F3",
    desc: "Crowdsourced AI data tasks",
    tag: "Global",
  },
  {
    name: "Labelbox",
    url: "https://labelbox.com/careers/",
    logo: "🏷️",
    color: "#8E44AD",
    desc: "Enterprise data labeling platform",
    tag: "Enterprise",
  },
  {
    name: "Clickworker",
    url: "https://www.clickworker.com/become-a-clickworker/",
    logo: "🖱️",
    color: "#27AE60",
    desc: "Micro-tasks including text & image work",
    tag: "Micro-tasks",
  },
  {
    name: "Prolific",
    url: "https://www.prolific.com",
    logo: "🧪",
    color: "#E74C3C",
    desc: "Research studies & AI participant tasks",
    tag: "Academic",
  },
];


// ── Verification View ─────────────────────────────────────────────────────────
function VerificationView() {
  const { user } = useAuth();
  const [verificationLink, setVerificationLink] = useState(null);
  const [idVerified, setIdVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles")
      .select("verification_link, id_verified")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setVerificationLink(data?.verification_link ?? null);
        setIdVerified(!!data?.id_verified);
        setLoading(false);
      });
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase.channel("verify-link-" + user.id)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` }, (payload) => {
        if (payload.new?.verification_link !== undefined) setVerificationLink(payload.new.verification_link);
        if (payload.new?.id_verified !== undefined) setIdVerified(!!payload.new.id_verified);
      }).subscribe();
    return () => supabase.removeChannel(ch);
  }, [user?.id]);

  const handleStartVerification = () => {
    if (!verificationLink) return;
    window.open(verificationLink, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px", gap: 12, color: "var(--muted)" }}>
        <div style={{ width: 20, height: 20, border: "2.5px solid var(--border2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
        Loading verification details…
      </div>
    );
  }

  const isApproved = idVerified;

  return (
    <div style={{ maxWidth: 580, margin: "0 auto" }}>
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.06)", marginBottom: 16 }}>
        <div style={{ background: "#0a0a0a", padding: "28px 32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>🛡️</span>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>Identity Verification</div>
          </div>
          <div style={{ fontSize: 13, color: "#aaa", lineHeight: 1.6 }}>
            Lixeen uses a secure, independent third-party service to verify trainer identities. Your data is handled directly by the verification provider and is not stored by Lixeen.
          </div>
        </div>

        <div style={{ padding: "28px 32px" }}>
          {isApproved ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f0faf4", border: "2px solid #b8e0c8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>✅</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#000", marginBottom: 8 }}>Verification Complete</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7, maxWidth: 360, margin: "0 auto" }}>
                Your identity has been successfully verified. You have full access to all platform features.
              </div>
            </div>
          ) : !verificationLink ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#f5f5f5", border: "2px solid #e0e0e0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 16px" }}>⏳</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#000", marginBottom: 8 }}>Your verification link is being prepared</div>
              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.7, maxWidth: 380, margin: "0 auto 20px" }}>
                An administrator will assign your personal verification link shortly. You'll see a button here to begin once it's ready. Check back soon or wait for a notification.
              </div>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#92400e" }}>
                <span>📧</span> Questions? Email <a href="mailto:support@lixeen.com" style={{ color: "#92400e", fontWeight: 600 }}>support@lixeen.com</a>
              </div>
            </div>
          ) : (
            <>
              <p style={{ fontSize: 14, color: "#444", lineHeight: 1.75, marginBottom: 22 }}>
                Your personal verification link is ready. Click the button below to be taken to our secure verification partner. The process typically takes <strong>2–5 minutes</strong> and you'll need a valid government-issued ID.
              </p>
              <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "16px 18px", marginBottom: 24 }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: "#475569", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>What you'll need</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {[
                    { icon: "🪪", label: "Government-issued ID", desc: "Passport, driver's license, or national ID" },
                    { icon: "📷", label: "Camera access", desc: "For document and selfie capture" },
                    { icon: "💡", label: "Good lighting", desc: "Ensure your face and ID are clearly visible" },
                    { icon: "⏱️", label: "~5 minutes", desc: "The full process takes just a few minutes" },
                  ].map(item => (
                    <div key={item.label} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#000", marginBottom: 2 }}>{item.label}</div>
                        <div style={{ fontSize: 11, color: "#666", lineHeight: 1.4 }}>{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button
                onClick={handleStartVerification}
                style={{ width: "100%", padding: "16px", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "opacity 0.15s", fontFamily: "var(--sans)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}
                onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
                onMouseLeave={e => e.currentTarget.style.opacity = "1"}
              >
                <span>🛡️</span>Start Verification →
              </button>
              <p style={{ fontSize: 11, color: "#999", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>
                You'll be redirected to our verification partner in a new tab. Your data is encrypted and securely handled. Questions? <a href="mailto:support@lixeen.com" style={{ color: "#555" }}>support@lixeen.com</a>
              </p>
            </>
          )}
        </div>
      </div>

      {!isApproved && (
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 14, padding: "20px 24px" }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: "#000", marginBottom: 16, letterSpacing: "-0.01em" }}>How it works</div>
          {[
            { n: "1", label: "Receive your link", desc: "An admin assigns you a unique, secure verification URL" },
            { n: "2", label: "Complete verification", desc: "Follow the steps on our partner's platform — takes ~5 minutes" },
            { n: "3", label: "Get approved", desc: "Once approved, your account is fully verified and projects unlocked" },
          ].map(s => (
            <div key={s.n} className="verify-step">
              <div className="verify-step-num">{s.n}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#000", marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ── Credentials View ──────────────────────────────────────────────────────────
// ── REPLACE YOUR EXISTING CredentialsView with this ──────────────────────────
// Also delete the AI_JOB_PLATFORMS constant entirely — it is no longer needed.
//
// The profile columns you need are:
//   lixeen_email     TEXT
//   lixeen_password  TEXT
//   lixeen_links     JSONB   ← new  (array of {name, url, logo, tag, desc})
//
// See add_lixeen_links.sql for the migration.
// ─────────────────────────────────────────────────────────────────────────────

function CredentialsView() {
  const { user } = useAuth();
  const [creds, setCreds] = useState({
    lixeen_email: null,
    lixeen_password: null,
    lixeen_links: [],        // admin-assigned platform links
  });
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState("");

  // ── Initial fetch ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("profiles")
      .select("lixeen_email, lixeen_password, lixeen_links")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        setCreds({
          lixeen_email: data?.lixeen_email ?? null,
          lixeen_password: data?.lixeen_password ?? null,
          lixeen_links: data?.lixeen_links ?? [],
        });
        setLoading(false);
      });
  }, [user?.id]);

  // ── Realtime: update the moment admin assigns anything ────────────────────
  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel("creds-" + user.id)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` },
        (payload) => {
          setCreds({
            lixeen_email: payload.new?.lixeen_email ?? null,
            lixeen_password: payload.new?.lixeen_password ?? null,
            lixeen_links: payload.new?.lixeen_links ?? [],
          });
        }
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, [user?.id]);

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(""), 2200);
    });
  };

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px", gap: 12, color: "var(--muted)" }}>
        <div style={{ width: 20, height: 20, border: "2.5px solid var(--border2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
        Loading credentials…
      </div>
    );
  }

  const hasCredentials = !!creds.lixeen_email;
  const links = Array.isArray(creds.lixeen_links) ? creds.lixeen_links : [];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>

      {/* ── Lixeen Credentials Card ───────────────────────────────────────── */}
      <div className="card" style={{ marginBottom: 20, overflow: "hidden" }}>

        {/* Dark header */}
        <div style={{ background: "#0a0a0a", padding: "24px 28px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "rgba(200,240,38,0.15)", border: "1px solid rgba(200,240,38,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
          }}>🪪</div>
          <div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 3 }}>Lixeen Credentials</div>
            <div style={{ fontSize: 12, color: "#888" }}>Your assigned platform login details</div>
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>
          {!hasCredentials ? (
            /* ── Pending state ── */
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--surface2)", border: "1px solid var(--border2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, margin: "0 auto 16px",
              }}>⏳</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#000", marginBottom: 8 }}>Credentials not yet assigned</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7, maxWidth: 340, margin: "0 auto 20px" }}>
                An administrator will assign your login details shortly. They'll appear here automatically once ready.
              </div>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: 8, padding: "10px 16px", fontSize: 13, color: "#92400e",
              }}>
                <span>📧</span> Questions?{" "}
                <a href="mailto:support@lixeen.com" style={{ color: "#92400e", fontWeight: 600 }}>support@lixeen.com</a>
              </div>
            </div>
          ) : (
            /* ── Credentials available ── */
            <>
              {/* Security notice */}
              <div style={{
                fontSize: 12, color: "#555",
                background: "#fffbeb", border: "1px solid #fde68a",
                borderRadius: 8, padding: "10px 14px", marginBottom: 22,
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>🔒</span> Keep these credentials private. Do not share them with anyone outside Lixeen.
              </div>

              {/* Email */}
              <div style={{ marginBottom: 6 }}>
                <div className="field-label">Email Address</div>
                <div className="cred-field-row">
                  <div className="cred-display">{creds.lixeen_email}</div>
                  <button
                    className={`copy-btn${copied === "email" ? " copied" : ""}`}
                    onClick={() => copyToClipboard(creds.lixeen_email, "email")}
                  >
                    {copied === "email" ? "✓ Copied!" : "📋 Copy"}
                  </button>
                </div>
              </div>

              {/* Password */}
              {creds.lixeen_password && (
                <div style={{ marginBottom: 6 }}>
                  <div className="field-label">Password</div>
                  <div className="cred-field-row">
                    <div
                      className="cred-display"
                      style={{
                        letterSpacing: showPassword ? "normal" : "0.18em",
                        fontFamily: showPassword ? "var(--sans)" : "monospace",
                        fontSize: showPassword ? 14 : 16,
                      }}
                    >
                      {showPassword
                        ? creds.lixeen_password
                        : "•".repeat(Math.min(creds.lixeen_password.length, 16))}
                    </div>
                    <button
                      className="copy-btn"
                      onClick={() => setShowPassword(s => !s)}
                      style={{ padding: "0 12px", minWidth: 44 }}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                    <button
                      className={`copy-btn${copied === "password" ? " copied" : ""}`}
                      onClick={() => copyToClipboard(creds.lixeen_password, "password")}
                    >
                      {copied === "password" ? "✓ Copied!" : "📋 Copy"}
                    </button>
                  </div>
                </div>
              )}

              {/* Tip — only shown if the admin has also assigned links */}
              {links.length > 0 && (
                <div style={{
                  marginTop: 18, padding: "12px 16px",
                  background: "var(--surface2)", border: "1px solid var(--border2)",
                  borderRadius: 8, fontSize: 12, color: "var(--muted)", lineHeight: 1.6,
                  display: "flex", alignItems: "flex-start", gap: 8,
                }}>
                  <span style={{ flexShrink: 0 }}>💡</span>
                  Use these credentials when registering on the platforms assigned to you below.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Assigned Platform Links (admin-controlled) ────────────────────── */}
      {links.length > 0 && (
        <div className="card">
          <div className="card-head">
            <div>
              <div className="card-title">Assigned Platforms</div>
              <div className="card-sub">Platforms your admin has assigned to you</div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: "var(--surface2)", border: "1px solid var(--border2)",
              borderRadius: "var(--r-pill)", padding: "4px 10px", color: "var(--muted)",
              flexShrink: 0,
            }}>
              {links.length} platform{links.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div style={{ padding: "4px 0" }}>
            {links.map((platform, i) => (
              <a
                key={i}
                href={platform.url}
                target="_blank"
                rel="noopener noreferrer"
                className="platform-row"
              >
                {/* Logo / icon */}
                <div
                  className="platform-logo"
                  style={{
                    background: (platform.color || "#333") + "18",
                    border: `1.5px solid ${(platform.color || "#333")}35`,
                  }}
                >
                  {platform.logo || "🔗"}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#000" }}>{platform.name}</span>
                    {platform.tag && (
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        background: (platform.color || "#333") + "18",
                        color: platform.color || "#333",
                        border: `1px solid ${(platform.color || "#333")}30`,
                        borderRadius: "var(--r-pill)",
                        padding: "2px 8px",
                        flexShrink: 0,
                      }}>
                        {platform.tag}
                      </span>
                    )}
                  </div>
                  {platform.desc && (
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>{platform.desc}</div>
                  )}
                </div>

                {/* Arrow */}
                <div style={{ flexShrink: 0, color: "#bbb", fontSize: 18, fontWeight: 300 }}>→</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* No links yet — show a gentle placeholder */}
      {hasCredentials && links.length === 0 && (
        <div className="card">
          <div style={{ padding: "36px 28px", textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🔗</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 6 }}>No platforms assigned yet</div>
            <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.7 }}>
              Your administrator will add platform links here when ready.
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


function AssessmentToast({ subject, score, total, onDismiss }) {
  const meta = ASSESSMENT_META[subject];
  useEffect(() => { const t = setTimeout(onDismiss, 5000); return () => clearTimeout(t); }, [onDismiss]);
  return (
    <div className="assess-toast">
      <span className="assess-toast-icon">🎉</span>
      <span><strong>{meta.icon} {meta.label} assessment complete</strong>{" — "}You scored {score}/{total}</span>
      <button onClick={onDismiss} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontSize: 14, padding: "0 0 0 8px", lineHeight: 1 }}>✕</button>
    </div>
  );
}

function AssessmentQuiz({ subject, onBack, onComplete }) {
  const questions = ASSESSMENT_QUESTIONS[subject];
  const meta = ASSESSMENT_META[subject];
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);
  const [startTime] = useState(Date.now());
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => { if (done) return; const t = setInterval(() => setElapsed(Math.floor((Date.now() - startTime) / 1000)), 1000); return () => clearInterval(t); }, [done, startTime]);
  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const handleSelect = (idx) => { if (revealed) return; setSelected(idx); };
  const handleCheck = () => { if (selected === null) return; setRevealed(true); setAnswers(prev => [...prev, { qIdx: current, chosen: selected, correct: selected === questions[current].answer }]); };
  const handleNext = () => {
    if (current < questions.length - 1) { setCurrent(c => c + 1); setSelected(null); setRevealed(false); }
    else { setDone(true); const score = [...answers, { correct: selected === questions[current].answer }].filter(a => a.correct).length; onComplete && onComplete({ subject, score, total: questions.length }); }
  };
  if (done) {
    const score = answers.filter(a => a.correct).length;
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div>
        <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 20 }}>← Back to Assessments</button>
        <div className="assess-result-card">
          <div className="assess-score-ring">{pct}%</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#000", marginBottom: 8, letterSpacing: "-0.02em" }}>Assessment Complete! 🎉</div>
          <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 8 }}>You answered <strong style={{ color: "#000" }}>{score} of {questions.length}</strong> questions correctly</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>Time taken: {fmtTime(elapsed)}</div>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn-lime" onClick={() => { setCurrent(0); setSelected(null); setAnswers([]); setRevealed(false); setDone(false); }}>Retake Assessment</button>
            <button className="btn-outline" onClick={onBack}>Back to Assessments</button>
          </div>
        </div>
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 14 }}>Answer Review</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {questions.map((q, i) => {
              const a = answers.find(x => x.qIdx === i);
              return (
                <div key={q.id} style={{ background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--r-card)", padding: "18px 22px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, width: 22, height: 22, borderRadius: "50%", background: a?.correct ? "#1a7a3f" : "#c00", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{a?.correct ? "✓" : "✗"}</span>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#000", lineHeight: 1.5 }}>Q{i + 1}. {q.question}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", paddingLeft: 32, lineHeight: 1.6 }}>
                    <span style={{ color: "#1a7a3f", fontWeight: 600 }}>Correct: {q.options[q.answer]}</span>
                    {a && !a.correct && <span style={{ color: "#c00", fontWeight: 600, marginLeft: 12 }}>Your answer: {q.options[a.chosen]}</span>}
                    <div style={{ marginTop: 4 }}>💡 {q.explanation}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  const q = questions[current];
  const letters = ["A", "B", "C", "D"];
  return (
    <div>
      <button className="btn-ghost" onClick={onBack} style={{ marginBottom: 20 }}>← Back to Assessments</button>
      <div className="assess-progress">
        <span style={{ fontSize: 12, fontWeight: 700, color: "#000", whiteSpace: "nowrap" }}>{meta.icon} {meta.label} — Q{current + 1}/{questions.length}</span>
        <div className="assess-prog-bar-wrap"><div className="assess-prog-bar" style={{ width: `${((current) / questions.length) * 100}%` }} /></div>
        <span style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>{fmtTime(elapsed)}</span>
      </div>
      <div className="assess-q-card">
        <div className="assess-q-num">Question {current + 1} of {questions.length}</div>
        <div className="assess-q-text">{q.question}</div>
        <div className="assess-options">
          {q.options.map((opt, idx) => {
            let cls = "assess-opt";
            if (revealed) { if (idx === q.answer) cls += " correct"; else if (idx === selected && idx !== q.answer) cls += " wrong"; } else if (idx === selected) { cls += " selected"; }
            return <div key={idx} className={cls} onClick={() => handleSelect(idx)}><span className="assess-opt-letter">{letters[idx]}</span>{opt}</div>;
          })}
        </div>
        {revealed && <div style={{ marginTop: 18, padding: "12px 16px", background: "#f5f9f0", border: "1px solid #c8e6c9", borderRadius: "var(--r-sm)", fontSize: 13, color: "#1a7a3f", lineHeight: 1.6 }}><strong>Explanation:</strong> {q.explanation}</div>}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {!revealed ? <button className="btn-lime" onClick={handleCheck} disabled={selected === null}>Check Answer</button> : <button className="btn-lime" onClick={handleNext}>{current < questions.length - 1 ? "Next Question →" : "See Results"}</button>}
      </div>
    </div>
  );
}

function AssessmentView({ initialTab, onSubTabChange }) {
  const [tab, setTab] = useState(initialTab || "english");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [toast, setToast] = useState(null);
  const setAndPersist = (t) => { setTab(t); onSubTabChange(t); setActiveQuiz(null); };
  const handleQuizComplete = (result) => { setToast(result); };
  if (activeQuiz) {
    return (<>{toast && <AssessmentToast subject={toast.subject} score={toast.score} total={toast.total} onDismiss={() => setToast(null)} />}<AssessmentQuiz subject={activeQuiz} onBack={() => setActiveQuiz(null)} onComplete={handleQuizComplete} /></>);
  }
  const subjects = ["english", "math", "stem"];
  const OVERVIEW_STATS = { english: { questions: 10, duration: "~15 min", difficulty: "Intermediate" }, math: { questions: 10, duration: "~20 min", difficulty: "Intermediate" }, stem: { questions: 10, duration: "~20 min", difficulty: "Advanced" } };
  const currentMeta = ASSESSMENT_META[tab];
  const currentStats = OVERVIEW_STATS[tab];
  return (
    <>
      {toast && <AssessmentToast subject={toast.subject} score={toast.score} total={toast.total} onDismiss={() => setToast(null)} />}
      <div className="tabs">{subjects.map(s => <button key={s} className={`tab${tab === s ? " active" : ""}`} onClick={() => setAndPersist(s)}>{ASSESSMENT_META[s].icon} {ASSESSMENT_META[s].label}</button>)}</div>
      <div className="assess-hero">
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)", marginBottom: 6 }}>Assessment</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#000", marginBottom: 6, letterSpacing: "-0.02em" }}>{currentMeta.icon} {currentMeta.label} Assessment</div>
          <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>{currentMeta.desc}</div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <span className="task-tag">📋 {currentStats.questions} questions</span>
            <span className="task-tag">⏱ {currentStats.duration}</span>
            <span className="task-tag" style={{ background: "#fff8e8", border: "1px solid #e8cc88", color: "#7a5a00" }}>{currentStats.difficulty}</span>
          </div>
        </div>
        <div style={{ flexShrink: 0 }}><button className="btn-lime" onClick={() => setActiveQuiz(tab)} style={{ height: 44, padding: "0 28px", fontSize: 14 }}>Start Assessment →</button></div>
      </div>
      <div className="two-col" style={{ marginBottom: 0 }}>
        <div className="card">
          <div className="card-head"><div className="card-title">What's Covered</div></div>
          <div className="card-body" style={{ padding: "16px 22px" }}>
            {tab === "english" && <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{["Grammar & syntax", "Vocabulary & word meanings", "Sentence structure & punctuation", "Rhetorical devices & literary techniques", "Reading comprehension strategies"].map(t => <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--sub)" }}><span style={{ color: "#1a7a3f", fontWeight: 700, fontSize: 12 }}>✓</span>{t}</div>)}</div>}
            {tab === "math" && <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{["Algebra & equation solving", "Geometry & measurement", "Probability & statistics", "Functions & graphing", "Number theory & combinatorics"].map(t => <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--sub)" }}><span style={{ color: "#1a7a3f", fontWeight: 700, fontSize: 12 }}>✓</span>{t}</div>)}</div>}
            {tab === "stem" && <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{["Physics & mechanics", "Chemistry & molecular science", "Biology & genetics", "Computer science & algorithms", "Data structures & complexity"].map(t => <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13.5, color: "var(--sub)" }}><span style={{ color: "#1a7a3f", fontWeight: 700, fontSize: 12 }}>✓</span>{t}</div>)}</div>}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div className="card-title">Assessment Guidelines</div></div>
          <div className="card-body" style={{ padding: "16px 22px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {["Read each question carefully before selecting an answer", "Each question has exactly one correct answer", "You'll receive an explanation after each answer", "Results and answer review are shown upon completion", "You can retake the assessment as many times as needed", "These assessments are for practice and self-evaluation only"].map((t, i) => <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--sub)", lineHeight: 1.5 }}><span style={{ color: "var(--muted)", fontWeight: 700, fontSize: 11, flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>{t}</div>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


const HARDCODED_TASKS = [
  { id: "h1", icon: "💬", codename: "Project Bluebeam", title: "Dialogue Preference Labeling", table: "tasks_dialogue_preference", tags: ["RLHF", "Preference"], estTime: "5–8 min", batchSize: 50, deadline: "Mar 20", difficulty: "Intermediate", overview: "You will evaluate pairs of AI-generated dialogue responses and indicate which response is more natural, helpful, and contextually appropriate.", rubric: [], dos: [], donts: [] },
  { id: "h2", icon: "🏆", codename: "Project Ironclad", title: "Response Ranking", table: "tasks_response_ranking", tags: ["RLHF", "Ranking"], estTime: "8–12 min", batchSize: 40, deadline: "Mar 22", difficulty: "Intermediate", overview: "You will rank multiple AI-generated responses to a single user prompt from best to worst.", rubric: [], dos: [], donts: [] },
  { id: "h3", icon: "📋", codename: "Project Waypoint", title: "Instruction Following Evaluation", table: "tasks_instruction_following", tags: ["Evaluation", "Instruction"], estTime: "6–10 min", batchSize: 50, deadline: "Mar 25", difficulty: "Beginner", overview: "You will assess how well AI responses follow specific user instructions.", rubric: [], dos: [], donts: [] },
  { id: "h4", icon: "🛡️", codename: "Project Sentinel", title: "Toxicity / Safety Classification", table: "tasks_toxicity_safety", tags: ["Safety", "Classification"], estTime: "3–5 min", batchSize: 80, deadline: "Mar 18", difficulty: "Beginner", overview: "You will classify AI-generated text for toxicity, harmful content, and policy violations.", rubric: [], dos: [], donts: [] },
  { id: "h5", icon: "🔍", codename: "Project Mirage", title: "Hallucination Detection", table: "tasks_hallucination_detection", tags: ["Factuality", "Safety"], estTime: "8–15 min", batchSize: 30, deadline: "Mar 28", difficulty: "Advanced", overview: "You will identify factual errors, fabricated citations, and unsupported claims in AI-generated responses.", rubric: [], dos: [], donts: [] },
  { id: "h6", icon: "🎯", codename: "Project Compass", title: "Prompt Intent Classification", table: "tasks_prompt_intent", tags: ["Classification", "NLP"], estTime: "2–4 min", batchSize: 100, deadline: "Mar 30", difficulty: "Beginner", overview: "You will classify user prompts by their underlying intent.", rubric: [], dos: [], donts: [] },
  { id: "h7", icon: "✏️", codename: "Project Redline", title: "Response Rewriting / Editing", table: "tasks_response_rewriting", tags: ["Editing", "Quality"], estTime: "10–15 min", batchSize: 25, deadline: "Apr 2", difficulty: "Advanced", overview: "You will rewrite or improve AI-generated responses to better meet quality standards.", rubric: [], dos: [], donts: [] },
  { id: "h8", icon: "✅", codename: "Project Bedrock", title: "Fact Checking", table: "tasks_fact_checking", tags: ["Factuality", "Research"], estTime: "10–20 min", batchSize: 20, deadline: "Apr 5", difficulty: "Advanced", overview: "You will verify the factual accuracy of AI-generated content against reliable sources.", rubric: [], dos: [], donts: [] },
  { id: "h9", icon: "⭐", codename: "Project Distill", title: "Summarization Quality Rating", table: "tasks_summarization_quality", tags: ["Summarization", "Quality"], estTime: "5–8 min", batchSize: 50, deadline: "Apr 8", difficulty: "Intermediate", overview: "You will rate the quality of AI-generated summaries against their source documents.", rubric: [], dos: [], donts: [] },
  { id: "h10", icon: "💻", codename: "Project Codelock", title: "Code Correctness Evaluation", table: "tasks_code_correctness", tags: ["Code", "Evaluation"], estTime: "8–15 min", batchSize: 30, deadline: "Apr 10", difficulty: "Advanced", overview: "You will evaluate whether AI-generated code snippets are correct, efficient, and well-structured.", rubric: [], dos: [], donts: [] },
  { id: "h11", icon: "🌐", codename: "Project Rosetta", title: "Translation Quality Evaluation", table: "tasks_translation_quality", tags: ["Translation", "Quality"], estTime: "6–10 min", batchSize: 40, deadline: "Apr 12", difficulty: "Intermediate", overview: "You will evaluate the quality of AI-generated translations.", rubric: [], dos: [], donts: [] },
  { id: "h12", icon: "🖼️", codename: "Project Lightbox", title: "Image Caption Evaluation", table: "tasks_image_caption", tags: ["Multimodal", "Evaluation"], estTime: "3–6 min", batchSize: 60, deadline: "Apr 15", difficulty: "Beginner", overview: "You will evaluate the quality of AI-generated captions for images.", rubric: [], dos: [], donts: [] },
  { id: "h13", icon: "😊", codename: "Project Pulse", title: "Sentiment Analysis Labeling", table: "tasks_sentiment_analysis", tags: ["NLP", "Labeling"], estTime: "2–3 min", batchSize: 120, deadline: "Apr 18", difficulty: "Beginner", overview: "You will label the sentiment expressed in text samples.", rubric: [], dos: [], donts: [] },
  { id: "h14", icon: "🏷️", codename: "Project Atlas", title: "Named Entity Recognition (NER)", table: "tasks_ner", tags: ["NLP", "Annotation"], estTime: "5–10 min", batchSize: 60, deadline: "Apr 20", difficulty: "Intermediate", overview: "You will identify and label named entities in text.", rubric: [], dos: [], donts: [] },
  { id: "h15", icon: "🔎", codename: "Project Nexus", title: "Search Result Relevance Ranking", table: "tasks_search_relevance", tags: ["Search", "Ranking"], estTime: "6–10 min", batchSize: 40, deadline: "Apr 22", difficulty: "Intermediate", overview: "You will rank search results by their relevance to a given user query.", rubric: [], dos: [], donts: [] },
];

const EC_DATA = [{ month: "Sep", val: 60 }, { month: "Oct", val: 75 }, { month: "Nov", val: 55 }, { month: "Dec", val: 80 }, { month: "Jan", val: 92 }, { month: "Feb", val: 100, active: true }];

function InfoPopover({ content }) {
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  React.useEffect(() => { const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }; if (open) document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, [open]);
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center", flexShrink: 0 }}>
      <span onClick={e => { e.stopPropagation(); setOpen(o => !o); }} style={{ width: 16, height: 16, borderRadius: "50%", border: "1.5px solid #bbb", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#aaa", fontSize: 10, fontWeight: 700, lineHeight: 1, transition: "border-color 0.15s,color 0.15s", userSelect: "none" }} onMouseEnter={e => { e.currentTarget.style.borderColor = "#000"; e.currentTarget.style.color = "#000"; }} onMouseLeave={e => { e.currentTarget.style.borderColor = "#bbb"; e.currentTarget.style.color = "#aaa"; }}>i</span>
      {open && <span style={{ position: "absolute", bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)", background: "#111", color: "#fff", fontSize: 12, lineHeight: 1.55, borderRadius: 8, padding: "10px 13px", whiteSpace: "normal", width: 220, zIndex: 300, boxShadow: "0 8px 24px rgba(0,0,0,0.18)", pointerEvents: "none" }}>{content}<span style={{ position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #111" }} /></span>}
    </span>
  );
}

function OngoingTaskModal({ ongoingTask, targetTask, onClose, onGoToOngoing }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-icon">🔒</div>
        <div className="modal-title">You have an active project</div>
        <div className="modal-body">You're currently working on <strong>{ongoingTask.title}</strong>. You can only work on one project at a time. Please complete or finish your current session before starting <strong>{targetTask.title}</strong>.</div>
        <div className="modal-actions"><button className="btn-lime" onClick={onGoToOngoing}>Continue current project</button><button className="btn-outline" onClick={onClose}>Dismiss</button></div>
      </div>
    </div>
  );
}

function notifIcon(type) {
  const map = { project_assigned: "🚀", project_revoked: "🔒", submission_accepted: "✅", submission_rejected: "❌", payout_processed: "💰", announcement: "📣", general: "📢" };
  return map[type] ?? "📢";
}

function fmtRelTime(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function RecentActivityCard({ onViewAll }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!user?.id) return;
    supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(4).then(({ data }) => setItems(data ?? []));
  }, [user?.id]);
  return (
    <div className="card">
      <div className="card-head"><div><div className="card-title">Recent Activity</div><div className="card-sub">Latest updates across your account</div></div><button className="btn-ghost" onClick={onViewAll}><I n="arrow" s={14} /> View all</button></div>
      <div className="card-body" style={{ padding: "0 22px" }}>
        {items.length === 0 ? <div style={{ padding: "20px 0", color: "var(--muted)", fontSize: 13, textAlign: "center" }}>No recent activity yet.</div> : items.map(n => (
          <div className="notif-item" key={n.id} style={{ cursor: "default" }}>
            <div className={`notif-dot-outer${!n.read ? " unread" : " read"}`} />
            <div className="notif-icon-wrap">{notifIcon(n.type)}</div>
            <div><div className="notif-text"><strong>{n.title}</strong></div>{n.message && <div className="notif-text" style={{ fontWeight: 400 }}>{n.message}</div>}<div className="notif-time">{fmtRelTime(n.created_at)}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}


function OverviewView({ onGoToTasks, onGoToNotifications, projectsLocked, onGoToVerification }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [activeLoading, setActiveLoading] = useState(true);
  useEffect(() => {
    if (!user?.id) return;
    const statsQ = supabase.from("user_responses").select("time_spent_secs, created_at").eq("user_id", user.id).eq("skipped", false);
    const activeQ = supabase.from("user_responses").select("task_table").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1);
    Promise.all([statsQ, activeQ]).then(async ([{ data: rows }, { data: activeRows }]) => {
      const r = rows ?? [];
      const RATE = 25 / 3600;
      const now = new Date();
      const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
      const allTime = r.reduce((s, x) => s + (x.time_spent_secs ?? 0) * RATE, 0);
      const thisWeek = r.filter(x => new Date(x.created_at) >= startOfWeek).reduce((s, x) => s + (x.time_spent_secs ?? 0) * RATE, 0);
      const avgSecs = r.length ? r.reduce((s, x) => s + (x.time_spent_secs ?? 0), 0) / r.length : 0;
      setStats({ count: r.length, allTime, thisWeek, avgMin: Math.round(avgSecs / 60) });
      if (!projectsLocked) {
        const table = activeRows?.[0]?.task_table ?? null;
        const match = table ? HARDCODED_TASKS.find(t => t.table === table) ?? null : null;
        const { data: prof } = await supabase.from("profiles").select("available_projects").eq("id", user.id).single();
        const allowed = prof?.available_projects ?? [];
        const stillAllowed = match && (allowed.length === 0 ? false : allowed.includes(match.table));
        setActiveTask(stillAllowed ? match : null);
      }
      setActiveLoading(false);
    });
  }, [user?.id, projectsLocked]);
  const fmtE = (n) => "$" + n.toFixed(2);
  return (
    <>
      {projectsLocked && (
        <div className="lock-banner">
          <div className="lock-banner-icon">🔒</div>
          <div style={{ flex: 1 }}>
            <div className="lock-banner-title">Projects Access Locked</div>
            <div className="lock-banner-desc">Your project access has been temporarily suspended. Complete identity verification to restore access. Your payments and earnings are unaffected.</div>
          </div>
          <button className="btn-lime" style={{ flexShrink: 0, fontSize: 12, height: 34, padding: "0 16px" }} onClick={onGoToVerification}>
            Submit Docs →
          </button>
        </div>
      )}
      <div className="stats-row">
        {[
          { label: "Tasks Completed", val: stats ? stats.count : "…", delta: stats ? `${stats.count} all time` : "", up: null, info: "Total tasks submitted and accepted." },
          { label: "Total Earned", val: stats ? fmtE(stats.allTime) : "…", delta: stats ? `+${fmtE(stats.thisWeek)} this week` : "", up: true, lime: true, info: "Cumulative earnings at $25/hr based on time spent." },
          { label: "Acceptance Rate", val: "100%", delta: "All submitted tasks", up: true, info: "Percentage of your submissions accepted." },
          { label: "Avg. Turnaround", val: stats ? (stats.avgMin < 1 ? "<1 min" : `${stats.avgMin} min`) : "…", delta: "Per task", up: null, info: "Average time to complete and submit a single task." },
        ].map(s => (
          <div className="stat-card" key={s.label}>
            <div className="stat-card-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>{s.label} <InfoPopover content={s.info} /></div>
            <div className={`stat-card-val${s.lime ? " lime" : ""}`}>{s.val}</div>
            <div className={`stat-card-delta${s.up === true ? " delta-up" : " delta-neutral"}`}>{s.delta}</div>
          </div>
        ))}
      </div>
      {!projectsLocked && !activeLoading && activeTask && (
        <div className="active-task-banner">
          <div className="active-task-info">
            <div className="active-task-label">⚡ Active project</div>
            <div className="active-task-title">{activeTask.codename}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{activeTask.title}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{activeTask.tags?.join(" · ")} · Due {activeTask.deadline}</div>
          </div>
          <div className="active-task-actions">
            <button className="btn-lime" onClick={() => navigate("/project-instructions", { state: { task: activeTask, fromDashboard: true } })}><I n="arrow" s={13} c="#fff" /> Continue</button>
            <button className="btn-outline" onClick={() => navigate("/project-instructions", { state: { task: activeTask, fromDashboard: true } })}>View Brief</button>
          </div>
        </div>
      )}
      {!projectsLocked && !activeLoading && !activeTask && (
        <div style={{ background: "var(--surface)", border: "1px dashed var(--border2)", borderRadius: "var(--r-card)", padding: "24px 28px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 28 }}>📋</div>
          <div><div style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 4 }}>No active project</div><div style={{ fontSize: 13, color: "var(--muted)" }}>Pick a project from the Projects tab to get started.</div></div>
          <button className="btn-lime" style={{ marginLeft: "auto" }} onClick={() => onGoToTasks("available")}>Browse projects</button>
        </div>
      )}
      <div className="two-col">
        <div className="card">
          <div className="card-head"><div><div className="card-title">Performance</div><div className="card-sub">Last 30 days</div></div><I n="trending" s={16} c="var(--text)" /></div>
          <div className="card-body">
            {[{ label: "Acceptance rate", val: 94, info: "Share of submitted tasks approved." }, { label: "On-time delivery", val: 98, info: "Tasks submitted before deadline." }, { label: "Rubric adherence", val: 91, info: "How closely responses follow guidelines." }, { label: "Quality score", val: 88, info: "Composite score based on reviewer feedback." }].map(m => (
              <div className="perf-row" key={m.label}><div className="perf-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>{m.label} <InfoPopover content={m.info} /></div><div className="prog-wrap"><div className="prog-bar" style={{ width: `${m.val}%` }} /></div><div className="perf-val">{m.val}%</div></div>
            ))}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><div><div className="card-title">Monthly Earnings</div><div className="card-sub">Sep 2025 – Feb 2026</div></div><I n="wallet" s={16} c="var(--text)" /></div>
          <div className="card-body">
            <div style={{ marginBottom: 4 }}><div style={{ fontSize: 28, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.04em", lineHeight: 1 }}>{stats ? fmtE(stats.allTime) : "…"}</div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>total earned</div></div>
            <div className="earnings-chart">{EC_DATA.map(d => <div className="ec-bar-wrap" key={d.month}><div className={`ec-bar${d.active ? " active" : ""}`} style={{ height: `${d.val}%` }} /><div className="ec-label">{d.month}</div></div>)}</div>
          </div>
        </div>
      </div>
      <RecentActivityCard onViewAll={onGoToNotifications} />
    </>
  );
}


function ProjectsLockedGate({ onGoToVerification }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "55vh", padding: "40px 20px" }}>
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 20, maxWidth: 460, width: "100%", overflow: "hidden", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", textAlign: "center" }}>
        <div style={{ background: "#0a0a0a", padding: "36px 32px" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔒</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Projects Locked</div>
          <div style={{ fontSize: 13, color: "#888" }}>Identity verification required to access projects</div>
        </div>
        <div style={{ padding: "32px" }}>
          <p style={{ fontSize: 14, color: "#444", lineHeight: 1.75, marginBottom: 28 }}>
            Your project access has been temporarily suspended by an administrator pending identity verification. You can still access your <strong>payments and earnings</strong> at any time.
          </p>
          <button onClick={onGoToVerification} style={{ width: "100%", padding: "14px", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", marginBottom: 12, fontFamily: "var(--sans)", letterSpacing: "-0.01em" }}>
            Complete Verification →
          </button>
          <p style={{ fontSize: 11, color: "#999", lineHeight: 1.6 }}>
            Questions? Email <a href="mailto:support@lixeen.com" style={{ color: "#3dbb00" }}>support@lixeen.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function TasksView({ initialTab, onSubTabChange, projectsLocked, onGoToVerification }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(initialTab || "available");
  const [ongoingTask, setOngoingTask] = useState(null);
  const [ongoingLoading, setOngoingLoading] = useState(true);
  const [availableProjects, setAvailableProjects] = useState(null);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [completedLoading, setCompletedLoading] = useState(false);
  const [guardModal, setGuardModal] = useState(null);
  const setAndPersist = (t) => { setTab(t); onSubTabChange(t); };

  if (projectsLocked) return <ProjectsLockedGate onGoToVerification={onGoToVerification} />;

  useEffect(() => {
    if (!user?.id) return;
    const activeQ = supabase.from("user_responses").select("task_table").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1);
    const profileQ = supabase.from("profiles").select("*").eq("id", user.id).single();
    Promise.all([profileQ, activeQ]).then(([{ data: prof, error: profErr }, { data: activeRows }]) => {
      const allowed = profErr ? [] : (prof?.available_projects ?? []);
      setAvailableProjects(allowed);
      const table = activeRows?.[0]?.task_table ?? null;
      const match = table ? HARDCODED_TASKS.find(t => t.table === table) ?? null : null;
      const stillAllowed = match && allowed.includes(match.table);
      setOngoingTask(stillAllowed ? match : null);
      setOngoingLoading(false);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel("profile-changes-" + user.id).on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` }, (payload) => {
      const allowed = payload.new?.available_projects ?? [];
      setAvailableProjects(allowed);
      setOngoingTask(prev => prev && allowed.includes(prev.table) ? prev : null);
      setOngoingLoading(false);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  const assignedTasks = availableProjects === null ? [] : HARDCODED_TASKS.filter(t => availableProjects.includes(t.table));
  useEffect(() => {
    if (tab !== "completed" || !user?.id) return;
    setCompletedLoading(true);
    supabase.from("user_responses").select("id,source_task_id,task_table,created_at,time_spent_secs").eq("user_id", user.id).eq("skipped", false).order("created_at", { ascending: false }).then(({ data }) => { setCompletedTasks(data ?? []); setCompletedLoading(false); });
  }, [tab, user?.id]);

  const calcEarnings = (secs) => !secs || secs <= 0 ? "$0.00" : "$" + ((secs / 3600) * 25).toFixed(2);
  const totalEarned = completedTasks.reduce((sum, r) => sum + ((r.time_spent_secs ?? 0) / 3600) * 25, 0);
  const fmtDate = (iso) => !iso ? "—" : new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const hasOngoing = !ongoingLoading && ongoingTask !== null;

  const handleStartTasking = (task) => {
    if (ongoingTask && task.id === ongoingTask.id) { navigate("/project-instructions", { state: { task, fromDashboard: true } }); return; }
    if (hasOngoing) { setGuardModal({ targetTask: task }); return; }
    navigate("/project-instructions", { state: { task, fromDashboard: true } });
  };

  return (
    <>
      {guardModal && <OngoingTaskModal ongoingTask={ongoingTask} targetTask={guardModal.targetTask} onClose={() => setGuardModal(null)} onGoToOngoing={() => { setGuardModal(null); navigate("/project-instructions", { state: { task: ongoingTask, fromDashboard: true } }); }} />}
      <div className="stats-row">
        {[
          { label: "Available Now", val: availableProjects === null ? "…" : assignedTasks.length, info: "Projects assigned to you." },
          { label: "In Progress", val: ongoingLoading ? "…" : hasOngoing ? 1 : 0, info: "Projects you have started." },
          { label: "Completed (all time)", val: completedTasks.length, info: "Tasks fully submitted." },
          { label: "Total Earned", val: completedTasks.length ? "$" + totalEarned.toFixed(2) : "—", lime: true, info: "Calculated at $25/hr." },
        ].map(s => (
          <div className="stat-card" key={s.label}><div className="stat-card-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>{s.label} <InfoPopover content={s.info} /></div><div className={`stat-card-val${s.lime ? " lime" : ""}`}>{s.val}</div></div>
        ))}
      </div>
      <div className="tabs">
        {[["available", "Available"], ["inprogress", "In Progress"], ["completed", "Completed"]].map(([k, l]) => (
          <button key={k} className={`tab${tab === k ? " active" : ""}`} onClick={() => setAndPersist(k)}>{l}</button>
        ))}
      </div>
      {tab === "available" && (
        <div className="task-list">
          {assignedTasks.length === 0 && availableProjects !== null ? (
            <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--muted)" }}><div style={{ fontSize: 32, marginBottom: 12 }}>🔒</div><div style={{ fontSize: 15, fontWeight: 700, color: "var(--sub)", marginBottom: 6 }}>No projects assigned yet</div><div style={{ fontSize: 13 }}>An administrator will assign projects to your account.</div></div>
          ) : [...assignedTasks].sort((a, b) => { if (ongoingTask && a.id === ongoingTask.id) return -1; if (ongoingTask && b.id === ongoingTask.id) return 1; return 0; }).map(t => {
            const isOngoing = ongoingTask?.id === t.id;
            const isLocked = hasOngoing && !isOngoing;
            return (
              <div className={`task-card${isLocked ? " locked" : ""}`} key={t.id} onClick={() => !isLocked && handleStartTasking(t)}>
                <div className="task-card-icon">{t.icon}</div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <div className="task-card-title" style={{ marginBottom: 0 }}>{t.codename}</div>
                    {isOngoing && <span style={{ fontSize: 10, fontWeight: 700, background: "#000", color: "#fff", borderRadius: "var(--r-pill)", padding: "2px 8px", letterSpacing: "0.04em" }}>ACTIVE</span>}
                    {isLocked && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "var(--muted)", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--r-pill)", padding: "2px 8px" }}><I n="lock" s={9} c="var(--muted)" /> Locked</span>}
                  </div>
                  <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 5 }}>{t.title}</div>
                  <div className="task-card-tags">{t.tags.map(tag => <span className="task-tag" key={tag}>{tag}</span>)}<span className="task-tag" style={{ background: "#fff8e8", border: "1px solid #e8cc88", color: "#7a5a00" }}>{t.difficulty}</span></div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 5 }}>⏱ {t.estTime} min &nbsp;·&nbsp; {t.batchSize} tasks &nbsp;·&nbsp; Due {t.deadline}</div>
                </div>
                <div className="task-card-right">
                  <div><div className="task-pay">$25</div><div className="task-pay-label">per hour</div></div>
                  {isOngoing ? <button className="btn-lime" style={{ fontSize: 12, height: 32, padding: "0 16px" }} onClick={e => { e.stopPropagation(); handleStartTasking(t); }}>Continue</button> : isLocked ? <button className="btn-outline" style={{ fontSize: 12, height: 32, padding: "0 16px", opacity: 0.5, cursor: "not-allowed" }} disabled><I n="lock" s={11} /> Locked</button> : <button className="btn-lime" style={{ fontSize: 12, height: 32, padding: "0 16px" }} onClick={e => { e.stopPropagation(); handleStartTasking(t); }}>Start Tasking</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {tab === "inprogress" && (
        ongoingLoading ? <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}><div style={{ width: 24, height: 24, border: "2.5px solid var(--border2)", borderTopColor: "var(--text)", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} /></div>
          : !ongoingTask ? <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--muted)" }}><div style={{ fontSize: 32, marginBottom: 12 }}>📋</div><div style={{ fontSize: 15, fontWeight: 700, color: "var(--sub)", marginBottom: 6 }}>No projects in progress</div><div style={{ fontSize: 13 }}>Start a project from the Available tab.</div></div>
            : <div className="task-list"><div className="task-card" onClick={() => handleStartTasking(ongoingTask)}><div className="task-card-icon">{ongoingTask.icon}</div><div><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}><div className="task-card-title" style={{ marginBottom: 0 }}>{ongoingTask.codename}</div><span style={{ fontSize: 10, fontWeight: 700, background: "#000", color: "#fff", borderRadius: "var(--r-pill)", padding: "2px 8px", letterSpacing: "0.04em" }}>ACTIVE</span></div><div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 5 }}>{ongoingTask.title}</div><div className="task-card-tags">{ongoingTask.tags?.map(tag => <span className="task-tag" key={tag}>{tag}</span>)}<span className="task-tag" style={{ background: "#fff8e8", border: "1px solid #e8cc88", color: "#7a5a00" }}>{ongoingTask.difficulty}</span></div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 5 }}>⏱ {ongoingTask.estTime} min &nbsp;·&nbsp; {ongoingTask.batchSize} tasks &nbsp;·&nbsp; Due {ongoingTask.deadline}</div></div><div className="task-card-right"><div><div className="task-pay">$25</div><div className="task-pay-label">per hour</div></div><button className="btn-lime" style={{ fontSize: 12, height: 32, padding: "0 14px" }} onClick={e => { e.stopPropagation(); handleStartTasking(ongoingTask); }}>Continue</button></div></div></div>
      )}
      {tab === "completed" && (
        completedLoading ? <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}><div style={{ width: 24, height: 24, border: "2.5px solid var(--border2)", borderTopColor: "var(--text)", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} /></div>
          : completedTasks.length === 0 ? <div style={{ textAlign: "center", padding: "48px 24px", color: "var(--muted)" }}><div style={{ fontSize: 32, marginBottom: 12 }}>📋</div><div style={{ fontSize: 15, fontWeight: 700, color: "var(--sub)", marginBottom: 6 }}>No completed tasks yet</div><div style={{ fontSize: 13 }}>Tasks you submit will appear here.</div></div>
            : (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "var(--surface)", border: "1px solid var(--border2)", borderRadius: "var(--r-card)", padding: "13px 20px", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{completedTasks.length} task{completedTasks.length !== 1 ? "s" : ""} completed</span>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>Total earned: ${totalEarned.toFixed(2)}</span>
                </div>
                <div className="completed-table">
                  <div className="completed-table-head" style={{ gridTemplateColumns: "80px 1fr 110px 130px 90px" }}>{["Task ID", "Title", "Time Spent", "Date", "Earned"].map(h => <div className="completed-table-head-cell" key={h}>{h}</div>)}</div>
                  {completedTasks.map(r => (
                    <div className="completed-table-row" key={r.id} style={{ gridTemplateColumns: "80px 1fr 110px 130px 90px" }}>
                      <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600 }}>#{String(r.source_task_id ?? "").slice(-4).toUpperCase() || "—"}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, overflow: "hidden" }}><span style={{ fontSize: 14, flexShrink: 0 }}>📝</span><span style={{ fontSize: 13, fontWeight: 600, color: "#000", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.task_table ? r.task_table.replace(/^tasks_/, "").replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : `Task #${r.source_task_id}`}</span></div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.time_spent_secs ? `${Math.floor(r.time_spent_secs / 60)}m ${r.time_spent_secs % 60}s` : "—"}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)" }}>{fmtDate(r.created_at)}</div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: "var(--text)", letterSpacing: "-0.02em" }}>{calcEarnings(r.time_spent_secs)}</div>
                    </div>
                  ))}
                </div>
              </>
            )
      )}
    </>
  );
}


async function upsertProfile(userId, fields) {
  const { error } = await supabase.from("profiles").upsert({ id: userId, ...fields, updated_at: new Date().toISOString() }, { onConflict: "id" });
  return error;
}

function PaymentsView({ initialTab, onSubTabChange }) {
  const { user } = useAuth();
  const [payTab, setPayTab] = useState(initialTab || "overview");
  const [selectedMethod, setSelectedMethod] = useState("bank");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const setAndPersist = (t) => { setPayTab(t); onSubTabChange(t); };
  const [bankForm, setBankForm] = useState({ bank_holder_name: "", bank_name: "", bank_account_type: "checking", bank_routing_number: "", bank_account_number: "" });
  const [paypalForm, setPaypalForm] = useState({ paypal_email: "", paypal_holder_name: "", paypal_currency: "USD" });
  const [taxForm, setTaxForm] = useState({ tax_legal_name: "", tax_ssn: "", tax_dob: "", tax_street: "", tax_city: "", tax_state: "", tax_zip: "", tax_country: "United States" });
  const [earningsData, setEarningsData] = useState(null);
  const [earningsLoading, setEarningsLoading] = useState(true);
  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (!data) return;
      if (data.preferred_payout) setSelectedMethod(data.preferred_payout);
      setBankForm({ bank_holder_name: data.bank_holder_name || "", bank_name: data.bank_name || "", bank_account_type: data.bank_account_type || "checking", bank_routing_number: data.bank_routing_number || "", bank_account_number: data.bank_account_number || "" });
      setPaypalForm({ paypal_email: data.paypal_email || "", paypal_holder_name: data.paypal_holder_name || "", paypal_currency: data.paypal_currency || "USD" });
      setTaxForm({ tax_legal_name: data.tax_legal_name || "", tax_ssn: data.tax_ssn || "", tax_dob: data.tax_dob || "", tax_street: data.tax_street || "", tax_city: data.tax_city || "", tax_state: data.tax_state || "", tax_zip: data.tax_zip || "", tax_country: data.tax_country || "United States" });
    });
    supabase.from("user_responses").select("time_spent_secs,created_at").eq("user_id", user.id).eq("skipped", false).then(({ data }) => {
      const rows = data ?? []; const RATE = 25 / 3600; const now = new Date();
      const startOfWeek = new Date(now); startOfWeek.setDate(now.getDate() - now.getDay()); startOfWeek.setHours(0, 0, 0, 0);
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const lastWeekStart = new Date(startOfWeek); lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1);
      const earn = (s) => (s ?? 0) * RATE;
      const allTime = rows.reduce((s, r) => s + earn(r.time_spent_secs), 0);
      const thisWeek = rows.filter(r => new Date(r.created_at) >= startOfWeek).reduce((s, r) => s + earn(r.time_spent_secs), 0);
      const lastWeek = rows.filter(r => { const d = new Date(r.created_at); return d >= lastWeekStart && d < startOfWeek; }).reduce((s, r) => s + earn(r.time_spent_secs), 0);
      const thisMonth = rows.filter(r => new Date(r.created_at) >= startOfMonth).reduce((s, r) => s + earn(r.time_spent_secs), 0);
      const lastMonth = rows.filter(r => { const d = new Date(r.created_at); return d >= lastMonthStart && d < lastMonthEnd; }).reduce((s, r) => s + earn(r.time_spent_secs), 0);
      const yearToDate = rows.filter(r => new Date(r.created_at) >= startOfYear).reduce((s, r) => s + earn(r.time_spent_secs), 0);
      setEarningsData({ allTime, thisWeek, lastWeek, thisMonth, lastMonth, yearToDate, count: rows.length });
      setEarningsLoading(false);
    });
  }, [user?.id]);
  const fmt = (n) => "$" + n.toFixed(2);
  const E = earningsData;
  const flash = (msg) => { setSaveMsg(msg); setTimeout(() => setSaveMsg(""), 2800); };
  const savePaymentMethod = async () => {
    setSaving(true);
    const fields = selectedMethod === "bank" ? { preferred_payout: "bank", ...bankForm } : { preferred_payout: "paypal", ...paypalForm };
    const err = await upsertProfile(user.id, fields); setSaving(false); flash(err ? "❌ " + err.message : "✓ Payment method saved");
  };
  const saveTax = async () => { setSaving(true); const err = await upsertProfile(user.id, taxForm); setSaving(false); flash(err ? "❌ " + err.message : "✓ Tax details saved"); };
  const setBank = (k, v) => setBankForm(f => ({ ...f, [k]: v }));
  const setPaypal = (k, v) => setPaypalForm(f => ({ ...f, [k]: v }));
  const setTax = (k, v) => setTaxForm(f => ({ ...f, [k]: v }));
  return (
    <>
      <div className="tabs">
        {[["overview", "Overview"], ["methods", "Payment Methods"], ["history", "Transaction History"], ["tax", "Tax Information"]].map(([k, l]) => (<button key={k} className={`tab${payTab === k ? " active" : ""}`} onClick={() => setAndPersist(k)}>{l}</button>))}
      </div>
      {payTab === "overview" && (
        <>
          <div className="payout-next">
            <div><div className="payout-next-label">⚡ This Week's Earnings</div><div className="payout-next-amount">{earningsLoading ? "…" : E ? fmt(E.thisWeek) : "$0.00"}</div><div className="payout-next-sub">{earningsLoading ? "" : ` from ${E?.count ?? 0} completed task${E?.count !== 1 ? "s" : ""} all time`}</div></div>
            <div className="payout-next-date"><div className="payout-date-label">Next payout date</div><div className="payout-date-val">Sat, Mar 8</div><div style={{ fontSize: 12, color: "#000", marginTop: 4 }}>via Bank Transfer</div></div>
          </div>
          <div className="three-col">
            {[{ label: "Total Earned (All time)", val: earningsLoading ? "…" : E ? fmt(E.allTime) : "$0.00", icon: "💰", info: "Gross earnings since joining." }, { label: "Paid Out (All time)", val: "$0.00", icon: "✅", info: "No payouts yet." }, { label: "This Month", val: earningsLoading ? "…" : E ? fmt(E.thisMonth) : "$0.00", icon: "📅", info: "Earnings this calendar month." }].map(s => (
              <div className="stat-card" key={s.label}><div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div><div className="stat-card-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>{s.label} <InfoPopover content={s.info} /></div><div className="stat-card-val lime">{s.val}</div></div>
            ))}
          </div>
          <div className="two-col">
            <div className="card"><div className="card-head"><div className="card-title">Earnings Breakdown</div></div><div className="card-body" style={{ padding: "0 22px" }}>{earningsLoading ? <div style={{ padding: "20px 0", color: "var(--muted)", fontSize: 13 }}>Loading…</div> : [["This week", E ? fmt(E.thisWeek) : "—", true], ["Last week", E ? fmt(E.lastWeek) : "—", false], ["This month", E ? fmt(E.thisMonth) : "—", false], ["Last month", E ? fmt(E.lastMonth) : "—", false], ["Year to date", E ? fmt(E.yearToDate) : "—", false]].map(([label, val, lime]) => (<div className="earnings-row" key={label}><div className="earnings-row-label">{label}</div><div className={`earnings-row-val${lime ? " lime" : ""}`}>{val}</div></div>))}</div></div>
            <div className="card"><div className="card-head"><div><div className="card-title">Payout Schedule</div><div className="card-sub">Weekly every Saturday</div></div><I n="zap" s={16} c="var(--text)" /></div><div className="card-body">{[["Minimum payout", "$10.00"], ["Currency", "USD"], ["Processing time", "1–2 business days"]].map(([label, val]) => (<div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}><span style={{ fontSize: 13, color: "#000" }}>{label}</span><span style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>{val}</span></div>))}<div style={{ marginTop: 16 }}><button className="btn-outline" style={{ width: "100%", justifyContent: "center" }} onClick={() => setAndPersist("methods")}>Manage payment methods</button></div></div></div>
          </div>
        </>
      )}
      {payTab === "methods" && (
        <>
          <div className="sec-header" style={{ marginBottom: 20 }}><div className="sec-header-left"><div className="sec-title">Payment Methods</div><div className="sec-sub">Select your preferred payout method</div></div></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[{ key: "bank", icon: "🏦", label: "Bank Transfer", desc: "Direct deposit to your bank account" }, { key: "paypal", icon: "🅿️", label: "PayPal", desc: "Instant transfer to your PayPal" }].map(opt => (
              <div key={opt.key} onClick={() => setSelectedMethod(opt.key)} style={{ background: "var(--surface)", border: `2px solid ${selectedMethod === opt.key ? "#000" : "var(--border2)"}`, borderRadius: "var(--r-card)", padding: "18px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 14, transition: "border-color 0.15s" }}>
                <div style={{ width: 42, height: 42, borderRadius: 10, background: "var(--surface2)", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{opt.icon}</div>
                <div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 700, color: "#000", marginBottom: 2 }}>{opt.label}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{opt.desc}</div></div>
                <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selectedMethod === opt.key ? "#000" : "var(--border2)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{selectedMethod === opt.key && <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#000" }} />}</div>
              </div>
            ))}
          </div>
          {selectedMethod === "bank" && <div className="card" style={{ marginBottom: 14 }}><div className="card-head"><div><div className="card-title">Bank Transfer Details</div><div className="card-sub">Your bank account information</div></div></div><div className="card-body"><div className="field"><label className="field-label">Account holder name</label><input className="field-input" value={bankForm.bank_holder_name} onChange={e => setBank("bank_holder_name", e.target.value)} placeholder="Full legal name" /></div><div className="form-grid-2"><div className="field"><label className="field-label">Bank name</label><input className="field-input" value={bankForm.bank_name} onChange={e => setBank("bank_name", e.target.value)} placeholder="e.g. Wells Fargo" /></div><div className="field"><label className="field-label">Account type</label><select className="field-select" value={bankForm.bank_account_type} onChange={e => setBank("bank_account_type", e.target.value)}><option value="checking">Checking</option><option value="savings">Savings</option></select></div></div><div className="field"><label className="field-label">Routing number</label><input className="field-input" value={bankForm.bank_routing_number} onChange={e => setBank("bank_routing_number", e.target.value)} placeholder="9-digit routing number" /></div><div className="field"><label className="field-label">Account number</label><input className="field-input" value={bankForm.bank_account_number} onChange={e => setBank("bank_account_number", e.target.value)} placeholder="e.g. ****4291" /></div><div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}><button className="btn-lime" onClick={savePaymentMethod} disabled={saving}>{saving ? "Saving…" : "Save bank details"}</button>{saveMsg && <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{saveMsg}</span>}</div></div></div>}
          {selectedMethod === "paypal" && <div className="card" style={{ marginBottom: 14 }}><div className="card-head"><div><div className="card-title">PayPal Details</div><div className="card-sub">Your PayPal account information</div></div></div><div className="card-body"><div className="field"><label className="field-label">PayPal email address</label><input className="field-input" type="email" value={paypalForm.paypal_email} onChange={e => setPaypal("paypal_email", e.target.value)} placeholder="your@paypal.com" /></div><div className="field"><label className="field-label">Account holder name</label><input className="field-input" value={paypalForm.paypal_holder_name} onChange={e => setPaypal("paypal_holder_name", e.target.value)} placeholder="Full name on PayPal account" /></div><div className="field"><label className="field-label">Currency preference</label><select className="field-select" value={paypalForm.paypal_currency} onChange={e => setPaypal("paypal_currency", e.target.value)}><option>USD</option><option>EUR</option><option>GBP</option><option>NGN</option><option>KES</option></select></div><div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}><button className="btn-lime" onClick={savePaymentMethod} disabled={saving}>{saving ? "Saving…" : "Save PayPal details"}</button>{saveMsg && <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{saveMsg}</span>}</div></div></div>}
          <div className="divider" />
        </>
      )}
      {payTab === "history" && (<><div className="sec-header"><div className="sec-header-left"><div className="sec-title">Transaction History</div><div className="sec-sub">All payouts and adjustments</div></div></div><div className="card"><div className="card-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px", gap: 12, textAlign: "center", color: "var(--muted)" }}><div style={{ fontSize: 36, marginBottom: 4 }}>💸</div><div style={{ fontSize: 15, fontWeight: 700, color: "var(--sub)" }}>No transactions yet</div><div style={{ fontSize: 13, lineHeight: 1.6, maxWidth: 260 }}>Your payouts and adjustments will appear here once your first payment is processed.</div></div></div></>)}
      {payTab === "tax" && (
        <div className="card">
          <div className="card-head"><div><div className="card-title">Tax Information</div><div className="card-sub">Required for payouts above $600/year · Form 1099-NEC</div></div></div>
          <div className="card-body">
            <div style={{ fontSize: 12, color: "#555", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", padding: "10px 14px", marginBottom: 20 }}>🔒 Your tax details are encrypted and used solely to generate your annual 1099-NEC form.</div>
            <div className="form-grid-2">
              <div className="field" style={{ gridColumn: "1/-1" }}><label className="field-label">Legal Full Name</label><input className="field-input" value={taxForm.tax_legal_name} onChange={e => setTax("tax_legal_name", e.target.value)} placeholder="As it appears on your tax documents" /></div>
              <div className="field" style={{ gridColumn: "1/-1" }}><label className="field-label">Social Security Number (SSN)</label><input className="field-input" value={taxForm.tax_ssn} onChange={e => { const raw = e.target.value.replace(/[^0-9]/g, "").slice(0, 9); let fmt = raw; if (raw.length > 5) fmt = raw.slice(0, 3) + "-" + raw.slice(3, 5) + "-" + raw.slice(5); else if (raw.length > 3) fmt = raw.slice(0, 3) + "-" + raw.slice(3); setTax("tax_ssn", fmt); }} placeholder="e.g. 123-45-6789" maxLength={11} style={{ borderColor: taxForm.tax_ssn && !/^\d{3}-\d{2}-\d{4}$/.test(taxForm.tax_ssn) ? "var(--red)" : undefined }} />{taxForm.tax_ssn && !/^\d{3}-\d{2}-\d{4}$/.test(taxForm.tax_ssn) && <div style={{ fontSize: 11.5, color: "var(--red)", marginTop: 5 }}>⚠ Enter a valid SSN in the format 123-45-6789</div>}</div>
              <div className="field" style={{ gridColumn: "1/-1" }}><label className="field-label">Date of Birth</label><input className="field-input" type="date" value={taxForm.tax_dob} onChange={e => setTax("tax_dob", e.target.value)} /></div>
              <div className="field" style={{ gridColumn: "1/-1" }}><label className="field-label">Street Address</label><input className="field-input" value={taxForm.tax_street} onChange={e => setTax("tax_street", e.target.value)} placeholder="123 Main St" /></div>
              <div className="field"><label className="field-label">City</label><input className="field-input" value={taxForm.tax_city} onChange={e => setTax("tax_city", e.target.value)} placeholder="New York" /></div>
              <div className="field"><label className="field-label">State</label><StateSelect value={taxForm.tax_state} onChange={v => setTax("tax_state", v)} /></div>
              <div className="field"><label className="field-label">ZIP / Postal Code</label><input className="field-input" value={taxForm.tax_zip} onChange={e => setTax("tax_zip", e.target.value)} placeholder="10001" /></div>
              <div className="field"><label className="field-label">Country</label><select className="field-select" value={taxForm.tax_country} onChange={e => setTax("tax_country", e.target.value)}><option>United States</option><option>United Kingdom</option><option>Canada</option></select></div>
            </div>
            <div style={{ height: 1, background: "var(--border)", margin: "8px 0 20px" }} />
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#000" }}>2025 Form 1099-NEC</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn-lime" onClick={async () => { if (!taxForm.tax_legal_name || !taxForm.tax_ssn) { alert("Please fill in your legal name and SSN."); return; } if (!/^\d{3}-\d{2}-\d{4}$/.test(taxForm.tax_ssn)) { alert("Please enter a valid SSN in the format 123-45-6789."); return; } await saveTax(); }}><I n="download" s={13} c="#fff" /> Generate 1099</button>
                <button className="btn-outline" onClick={saveTax} disabled={saving}>{saving ? "Saving…" : "Save details"}</button>
              </div>
            </div>
            {saveMsg && <div style={{ fontSize: 13, color: "#000", fontWeight: 600, background: "var(--surface2)", border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", padding: "10px 14px" }}>{saveMsg}</div>}
          </div>
        </div>
      )}
    </>
  );
}


function ProfileView({ initialTab, onSubTabChange, onStateChange }) {
  const { user } = useAuth();
  const [profileTab, setProfileTab] = useState(initialTab || "info");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const setAndPersist = (t) => { setProfileTab(t); onSubTabChange(t); };
  const flash = (msg) => { setSaveMsg(msg); setTimeout(() => setSaveMsg(""), 2800); };
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState({ text: "", ok: false });
  const [sessions, setSessions] = useState([]);
  const [sessLoading, setSessLoading] = useState(false);
  const [revoking, setRevoking] = useState({});
  const [revokingAll, setRevokingAll] = useState(false);
  const flashPw = (text, ok = false) => { setPwMsg({ text, ok }); setTimeout(() => setPwMsg({ text: "", ok: false }), 3500); };
  const detectDevice = () => { const ua = navigator.userAgent; if (/iPhone|iPad/.test(ua)) return "iOS Device"; if (/Android/.test(ua)) return "Android Device"; if (/Mac/.test(ua)) return "macOS"; if (/Windows/.test(ua)) return "Windows PC"; return "Unknown Device"; };
  const detectBrowser = () => { const ua = navigator.userAgent; if (/Chrome/.test(ua) && !/Edge|Edg/.test(ua)) return "Chrome"; if (/Firefox/.test(ua)) return "Firefox"; if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "Safari"; if (/Edg/.test(ua)) return "Edge"; return "Browser"; };
  const loadSessions = async () => { setSessLoading(true); const { data: { session } } = await supabase.auth.getSession(); if (session) { const issuedAt = session.user?.last_sign_in_at ? new Date(session.user.last_sign_in_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }) : "Recently"; setSessions([{ id: session.access_token.slice(-16), device: detectDevice(), browser: detectBrowser(), ip: "—", time: issuedAt, current: true }]); } else { setSessions([]); } setSessLoading(false); };
  const handleChangePassword = async () => { const { current, next, confirm } = pwForm; if (!current) { flashPw("Please enter your current password."); return; } if (next.length < 8) { flashPw("New password must be at least 8 characters."); return; } if (next !== confirm) { flashPw("Passwords do not match."); return; } setPwSaving(true); const { error: signInErr } = await supabase.auth.signInWithPassword({ email: user.email, password: current }); if (signInErr) { flashPw("Current password is incorrect."); setPwSaving(false); return; } const { error: updateErr } = await supabase.auth.updateUser({ password: next }); setPwSaving(false); if (updateErr) { flashPw("Failed to update password: " + updateErr.message); } else { flashPw("Password updated successfully.", true); setPwForm({ current: "", next: "", confirm: "" }); } };
  const handleRevokeSession = async (sess) => { setRevoking(r => ({ ...r, [sess.id]: true })); await supabase.auth.signOut({ scope: "local" }); };
  const handleRevokeAll = async () => { setRevokingAll(true); await supabase.auth.signOut({ scope: "global" }); };
  React.useEffect(() => { if (profileTab === "security") loadSessions(); }, [profileTab]);

  const [infoForm, setInfoForm] = useState({ first_name: user.user_metadata.first_name || "", last_name: user.user_metadata.last_name || "", email: user.user_metadata.email || "", state: "", languages: "" });
  const setInfo = (k, v) => setInfoForm(f => ({ ...f, [k]: v }));
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [primaryDomain, setPrimaryDomain] = useState("Natural Language Processing");
  const [secondaryDomain, setSecondaryDomain] = useState("Data Annotation");
  const [certifications, setCertifications] = useState("");
  const [taskPrefs, setTaskPrefs] = useState({ "RLHF & Preference Ranking": true, "Model Evaluation & Benchmarking": true, "Safety & Red-Teaming": true, "Data Annotation & Labeling": false, "Creative Writing & Scoring": true, "Code Review & Quality Assessment": true });
  const [notifs, setNotifs] = useState({ notif_new_task_email: true, notif_new_task_push: true, notif_accepted_email: true, notif_accepted_push: true, notif_rejected_email: true, notif_rejected_push: false, notif_payout_email: true, notif_payout_push: true, notif_report_email: false, notif_report_push: false, notif_security_email: true, notif_security_push: true });

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => {
      if (!data) return;
      setInfoForm({ first_name: data.first_name || user.user_metadata.first_name || "", last_name: data.last_name || user.user_metadata.last_name || "", email: data.email || user.user_metadata.email || "", state: data.state || "", languages: data.languages || "" });
      if (data.state) onStateChange?.(data.state);
      if (data.skills) setSkills(data.skills);
      if (data.primary_domain) setPrimaryDomain(data.primary_domain);
      if (data.secondary_domain) setSecondaryDomain(data.secondary_domain);
      if (data.certifications) setCertifications(data.certifications);
      if (data.task_preferences && Object.keys(data.task_preferences).length) setTaskPrefs(p => ({ ...p, ...data.task_preferences }));
      setNotifs(prev => ({ ...prev, notif_new_task_email: data.notif_new_task_email ?? prev.notif_new_task_email, notif_new_task_push: data.notif_new_task_push ?? prev.notif_new_task_push, notif_accepted_email: data.notif_accepted_email ?? prev.notif_accepted_email, notif_accepted_push: data.notif_accepted_push ?? prev.notif_accepted_push, notif_rejected_email: data.notif_rejected_email ?? prev.notif_rejected_email, notif_rejected_push: data.notif_rejected_push ?? prev.notif_rejected_push, notif_payout_email: data.notif_payout_email ?? prev.notif_payout_email, notif_payout_push: data.notif_payout_push ?? prev.notif_payout_push, notif_report_email: data.notif_report_email ?? prev.notif_report_email, notif_report_push: data.notif_report_push ?? prev.notif_report_push, notif_security_email: data.notif_security_email ?? prev.notif_security_email, notif_security_push: data.notif_security_push ?? prev.notif_security_push }));
    });
  }, [user?.id]);

  const removeSkill = s => setSkills(sk => sk.filter(x => x !== s));
  const addSkill = e => { if (e.key === "Enter" && newSkill.trim() && !skills.includes(newSkill.trim())) { setSkills(sk => [...sk, newSkill.trim()]); setNewSkill(""); } };
  const togglePref = (label) => setTaskPrefs(p => ({ ...p, [label]: !p[label] }));
  const toggleNotif = (key) => setNotifs(n => ({ ...n, [key]: !n[key] }));
  const saveInfo = async () => { setSaving(true); const err = await upsertProfile(user.id, infoForm); setSaving(false); if (!err) { flash("✓ Personal info saved"); onStateChange?.(infoForm.state); } else { flash("❌ " + err.message); } };
  const saveExpertise = async () => { setSaving(true); const err = await upsertProfile(user.id, { skills, primary_domain: primaryDomain, secondary_domain: secondaryDomain, certifications, task_preferences: taskPrefs }); setSaving(false); flash(err ? "❌ " + err.message : "✓ Expertise saved"); };
  const saveNotifs = async () => { setSaving(true); const err = await upsertProfile(user.id, notifs); setSaving(false); flash(err ? "❌ " + err.message : "✓ Notification preferences saved"); };
  const DOMAIN_OPTS = ["Natural Language Processing", "Computer Vision", "Code & Software", "Multimodal", "Safety & Alignment", "Data Annotation"];

  return (
    <>
      <div className="tabs">
        {[["info", "Personal Info"], ["expertise", "Skills & Expertise"], ["security", "Security"], ["notifications", "Notifications"]].map(([k, l]) => (<button key={k} className={`tab${profileTab === k ? " active" : ""}`} onClick={() => setAndPersist(k)}>{l}</button>))}
      </div>
      {profileTab === "info" && (
        <div className="card"><div className="card-body">
          <div className="profile-avatar-row">
            <div className="profile-av-large">{getInitials(user.user_metadata.full_name)}</div>
            <div className="profile-av-info"><div className="profile-av-name">{user.user_metadata.full_name}</div><div className="profile-av-role">{formatMemberInfo("AI Trainer", user.confirmed_at)}</div></div>
          </div>
          <div className="form-grid-2">
            <div className="field"><label className="field-label">First Name</label><input className="field-input" value={infoForm.first_name} onChange={e => setInfo("first_name", e.target.value)} /></div>
            <div className="field"><label className="field-label">Last Name</label><input className="field-input" value={infoForm.last_name} onChange={e => setInfo("last_name", e.target.value)} /></div>
          </div>
          <div className="field"><label className="field-label">Email address</label><input className="field-input" type="email" value={infoForm.email} onChange={e => setInfo("email", e.target.value)} /></div>
          <div className="field"><label className="field-label">State</label><StateSelect value={infoForm.state} onChange={v => setInfo("state", v)} /></div>
          <div className="field"><label className="field-label">Languages</label><input className="field-input" value={infoForm.languages} onChange={e => setInfo("languages", e.target.value)} placeholder="e.g. English (Native), French (Conversational)" /></div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}><button className="btn-lime" onClick={saveInfo} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>{saveMsg && <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{saveMsg}</span>}</div>
        </div></div>
      )}
      {profileTab === "expertise" && (<><div className="card" style={{ marginBottom: 16 }}><div className="card-head"><div><div className="card-title">Skills</div><div className="card-sub">Used to match you with relevant tasks</div></div></div><div className="card-body"><div className="skill-tags">{skills.map(s => <span className="skill-tag" key={s}>{s}<span className="skill-tag-x" onClick={() => removeSkill(s)}>✕</span></span>)}<input className="skill-add-input" placeholder="+ Add skill" value={newSkill} onChange={e => setNewSkill(e.target.value)} onKeyDown={addSkill} /></div><div style={{ fontSize: 12, color: "var(--muted)", marginTop: 12 }}>Press Enter to add a skill. Click ✕ to remove.</div></div></div><div className="card" style={{ marginBottom: 16 }}><div className="card-head"><div className="card-title">Domains of Expertise</div></div><div className="card-body"><div className="form-grid-2"><div className="field"><label className="field-label">Primary Domain</label><select className="field-select" value={primaryDomain} onChange={e => setPrimaryDomain(e.target.value)}>{DOMAIN_OPTS.map(o => <option key={o}>{o}</option>)}</select></div><div className="field"><label className="field-label">Secondary Domain</label><select className="field-select" value={secondaryDomain} onChange={e => setSecondaryDomain(e.target.value)}>{DOMAIN_OPTS.map(o => <option key={o}>{o}</option>)}</select></div></div><div className="field"><label className="field-label">Certifications / Education</label><textarea className="field-textarea" value={certifications} onChange={e => setCertifications(e.target.value)} placeholder="e.g. B.Sc. Computer Science, University of Lagos" /></div></div></div><div className="card" style={{ marginBottom: 16 }}><div className="card-head"><div><div className="card-title">Task Preferences</div><div className="card-sub">Control what types of tasks you see</div></div></div><div className="card-body">{Object.entries(taskPrefs).map(([label, on]) => (<div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 0", borderBottom: "1px solid var(--border)" }}><span style={{ fontSize: 13.5, color: "var(--sub)" }}>{label}</span><label style={{ position: "relative", width: 40, height: 22, cursor: "pointer", flexShrink: 0 }} onClick={() => togglePref(label)}><span style={{ position: "absolute", inset: 0, borderRadius: 11, background: on ? "#000" : "transparent", transition: "background 0.2s", border: "2px solid #000" }} /><span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 14, height: 14, borderRadius: "50%", background: on ? "#fff" : "#000", transition: "left 0.2s", pointerEvents: "none" }} /></label></div>))}</div></div><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}><button className="btn-lime" onClick={saveExpertise} disabled={saving}>{saving ? "Saving…" : "Save expertise"}</button>{saveMsg && <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{saveMsg}</span>}</div></>)}
      {profileTab === "security" && (<div className="card"><div className="card-body"><h3 style={{ fontSize: 15, fontWeight: 700, color: "#000", marginBottom: 4 }}>Change Password</h3><p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>We'll verify your current password before making changes.</p><div className="field"><label className="field-label">Current Password</label><input className="field-input" type="password" placeholder="Enter current password" value={pwForm.current} onChange={e => setPwForm(f => ({ ...f, current: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleChangePassword()} /></div><div className="form-grid-2"><div className="field"><label className="field-label">New Password</label><input className="field-input" type="password" placeholder="Min. 8 characters" value={pwForm.next} onChange={e => setPwForm(f => ({ ...f, next: e.target.value }))} style={{ borderColor: pwForm.next && pwForm.next.length < 8 ? "#c00" : undefined }} />{pwForm.next && pwForm.next.length < 8 && <div style={{ fontSize: 11, color: "#c00", marginTop: 4 }}>At least 8 characters required</div>}</div><div className="field"><label className="field-label">Confirm New Password</label><input className="field-input" type="password" placeholder="Repeat new password" value={pwForm.confirm} onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))} style={{ borderColor: pwForm.confirm && pwForm.confirm !== pwForm.next ? "#c00" : undefined }} />{pwForm.confirm && pwForm.confirm !== pwForm.next && <div style={{ fontSize: 11, color: "#c00", marginTop: 4 }}>Passwords do not match</div>}</div></div><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}><button className="btn-lime" onClick={handleChangePassword} disabled={pwSaving}>{pwSaving ? "Updating…" : "Update password"}</button>{pwMsg.text && <span style={{ fontSize: 13, fontWeight: 600, color: pwMsg.ok ? "var(--green,#1a7a3f)" : "#c00", display: "flex", alignItems: "center", gap: 5 }}>{pwMsg.ok ? "✓" : "⚠"} {pwMsg.text}</span>}</div><div className="divider" /><h3 style={{ fontSize: 15, fontWeight: 700, color: "#000", marginBottom: 16, marginTop: 4 }}>Two-Factor Authentication</h3><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "var(--surface2)", borderRadius: "var(--r-sm)", border: "1px solid var(--border2)", marginBottom: 24 }}><div><div style={{ fontSize: 14, fontWeight: 600, color: "#000", marginBottom: 3 }}>Authenticator App</div><div style={{ fontSize: 12, color: "var(--muted)" }}>Use Google Authenticator, Authy, or similar</div></div><span className="status status-available"><span className="status-dot" />Not enabled</span></div><div className="divider" /><div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4, marginTop: 4 }}><h3 style={{ fontSize: 15, fontWeight: 700, color: "#000" }}>Active Sessions</h3><button className="btn-ghost" style={{ fontSize: 12 }} onClick={loadSessions}>↻ Refresh</button></div><p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>Devices currently signed in to your account.</p>{sessLoading ? <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 0", color: "var(--muted)", fontSize: 13 }}><div style={{ width: 16, height: 16, border: "2px solid var(--border2)", borderTopColor: "var(--text)", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />Loading sessions…</div> : sessions.length === 0 ? <div style={{ fontSize: 13, color: "var(--muted)", padding: "16px 0" }}>No active sessions found.</div> : <div style={{ border: "1px solid var(--border2)", borderRadius: "var(--r-sm)", overflow: "hidden", marginBottom: 16 }}>{sessions.map((s, i) => (<div key={s.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < sessions.length - 1 ? "1px solid var(--border)" : "none", background: "var(--surface)" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: "var(--surface2)", border: "1px solid var(--border2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{/iOS|iPhone|iPad|Android/.test(s.device) ? "📱" : "💻"}</div><div style={{ flex: 1, minWidth: 0 }}><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}><span style={{ fontSize: 13, fontWeight: 600, color: "#000" }}>{s.browser} on {s.device}</span>{s.current && <span style={{ fontSize: 10, fontWeight: 700, background: "#000", color: "#fff", borderRadius: "var(--r-pill)", padding: "2px 8px", letterSpacing: "0.04em", flexShrink: 0 }}>CURRENT</span>}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>Signed in {s.time}</div></div><button style={{ fontSize: 12, fontWeight: 600, padding: "6px 14px", borderRadius: "var(--r-sm)", border: "1.5px solid #e00", color: "#c00", background: "#fff8f8", cursor: "pointer", flexShrink: 0, opacity: revoking[s.id] ? 0.5 : 1 }} disabled={revoking[s.id]} onClick={() => handleRevokeSession(s)}>{revoking[s.id] ? (s.current ? "Signing out…" : "Revoking…") : (s.current ? "Sign out" : "Revoke")}</button></div>))}</div>}<div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", background: "#fff8f8", border: "1px solid #ffd5d5", borderRadius: "var(--r-sm)" }}><div><div style={{ fontSize: 13, fontWeight: 600, color: "#000", marginBottom: 2 }}>Sign out of all devices</div><div style={{ fontSize: 12, color: "var(--muted)" }}>This will immediately invalidate all active sessions, including this one.</div></div><button style={{ fontSize: 12, fontWeight: 700, padding: "7px 16px", borderRadius: "var(--r-sm)", border: "1.5px solid #e00", color: "#fff", background: "#c00", cursor: "pointer", flexShrink: 0, marginLeft: 16, opacity: revokingAll ? 0.5 : 1 }} disabled={revokingAll} onClick={handleRevokeAll}>{revokingAll ? "Signing out…" : "Revoke all sessions"}</button></div></div></div>)}
      {profileTab === "notifications" && (<div className="card"><div className="card-head"><div className="card-title">Notification Preferences</div></div><div className="card-body" style={{ padding: "0 22px" }}>{[{ label: "New task available", desc: "When a task matching your skills is posted", eKey: "notif_new_task_email", pKey: "notif_new_task_push" }, { label: "Task submission accepted", desc: "When a task you submitted is approved", eKey: "notif_accepted_email", pKey: "notif_accepted_push" }, { label: "Task submission rejected", desc: "When a submission is returned for revision", eKey: "notif_rejected_email", pKey: "notif_rejected_push" }, { label: "Weekly payout processed", desc: "When your earnings are sent to your account", eKey: "notif_payout_email", pKey: "notif_payout_push" }, { label: "Performance report ready", desc: "Weekly summary of your task metrics", eKey: "notif_report_email", pKey: "notif_report_push" }, { label: "Account security alerts", desc: "Login from a new device or location", eKey: "notif_security_email", pKey: "notif_security_push" }].map(n => (<div key={n.label} style={{ padding: "16px 0", borderBottom: "1px solid var(--border)" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}><div><div style={{ fontSize: 14, fontWeight: 600, color: "#000", marginBottom: 3 }}>{n.label}</div><div style={{ fontSize: 12, color: "var(--muted)" }}>{n.desc}</div></div><div style={{ display: "flex", gap: 20, flexShrink: 0 }}>{[["Email", n.eKey], ["Push", n.pKey]].map(([lbl, key]) => { const on = notifs[key]; return (<div key={lbl} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}><span style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{lbl}</span><label style={{ position: "relative", width: 36, height: 20, cursor: "pointer" }} onClick={() => toggleNotif(key)}><span style={{ position: "absolute", inset: 0, borderRadius: 10, background: on ? "#000" : "transparent", border: "2px solid #000", transition: "background 0.2s" }} /><span style={{ position: "absolute", top: 2, left: on ? 16 : 2, width: 12, height: 12, borderRadius: "50%", background: on ? "#fff" : "#000", transition: "left 0.2s", pointerEvents: "none" }} /></label></div>); })}</div></div></div>))}<div style={{ padding: "16px 0", display: "flex", alignItems: "center", gap: 12 }}><button className="btn-lime" onClick={saveNotifs} disabled={saving}>{saving ? "Saving…" : "Save preferences"}</button>{saveMsg && <span style={{ fontSize: 13, color: "var(--text)", fontWeight: 600 }}>{saveMsg}</span>}</div></div></div>)}
    </>
  );
}

function NotificationsView() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const unreadCount = notifs.filter(n => !n.read).length;
  useEffect(() => { if (!user?.id) return; supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50).then(({ data }) => { setNotifs(data ?? []); setLoading(false); }); }, [user?.id]);
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase.channel("user-notifications-" + user.id)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => { setNotifs(prev => [payload.new, ...prev]); })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => { setNotifs(prev => prev.map(n => n.id === payload.new.id ? payload.new : n)); })
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, (payload) => { setNotifs(prev => prev.filter(n => n.id !== payload.old.id)); })
      .subscribe();
    return () => supabase.removeChannel(channel);
  }, [user?.id]);
  const markRead = async (notif) => { if (notif.read) return; setNotifs(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n)); await supabase.from("notifications").update({ read: true }).eq("id", notif.id); };
  const markAllRead = async () => { if (unreadCount === 0) return; setMarking(true); setNotifs(prev => prev.map(n => ({ ...n, read: true }))); await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false); setMarking(false); };
  const deleteNotif = async (e, id) => { e.stopPropagation(); setNotifs(prev => prev.filter(n => n.id !== id)); await supabase.from("notifications").delete().eq("id", id); };
  if (loading) return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "64px", gap: 12, color: "var(--muted)", fontSize: 13 }}><div style={{ width: 20, height: 20, border: "2.5px solid var(--border2)", borderTopColor: "var(--text)", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />Loading notifications…</div>;
  return (
    <div className="card">
      <div className="card-head">
        <div><div className="card-title">Notifications</div><div className="card-sub">{unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}</div></div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>{unreadCount > 0 && <button className="btn-ghost" style={{ fontSize: 12 }} onClick={markAllRead} disabled={marking}>{marking ? "Marking…" : "Mark all as read"}</button>}</div>
      </div>
      {notifs.length === 0 ? (
        <div className="card-body"><div className="empty"><div className="empty-icon">🔔</div><div className="empty-title">No notifications yet</div><div className="empty-desc">You'll be notified here when there are updates to your projects, submissions, or earnings.</div></div></div>
      ) : (
        <div className="card-body" style={{ padding: "0 22px" }}>
          {notifs.map(n => (
            <div key={n.id} className={`notif-item${!n.read ? " unread" : ""}`} onClick={() => markRead(n)}>
              <div className={`notif-dot-outer${!n.read ? " unread" : " read"}`} />
              <div className="notif-icon-wrap">{notifIcon(n.type)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: n.read ? 500 : 700, color: "#000", marginBottom: 3, lineHeight: 1.4 }}>{n.title}</div>
                    {n.message && <div className="notif-text" style={{ fontWeight: 400 }}>{n.message}</div>}
                    <div className="notif-time">{fmtRelTime(n.created_at)}</div>
                  </div>
                  <button onClick={(e) => deleteNotif(e, n.id)} style={{ flexShrink: 0, background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 14, padding: "0 4px", lineHeight: 1 }} onMouseEnter={e => e.currentTarget.style.color = "#000"} onMouseLeave={e => e.currentTarget.style.color = "#ccc"} title="Dismiss">✕</button>
                </div>
                {n.link && <a href={n.link} style={{ fontSize: 11, color: "var(--text)", fontWeight: 600, marginTop: 4, display: "inline-block", textDecoration: "none", borderBottom: "1px solid var(--border2)" }} onClick={e => e.stopPropagation()}>View →</a>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [view, setView] = useState(getInitialView);
  const [taskTab, setTaskTab] = useState(() => getInitialSub("tasks"));
  const [payTab, setPayTab] = useState(() => getInitialSub("payments"));
  const [profileTab, setProfileTab] = useState(() => getInitialSub("profile"));
  const [assessmentTab, setAssessmentTab] = useState(() => getInitialSub("assessment"));
  const [unreadCount, setUnreadCount] = useState(0);
  const [availableCount, setAvailableCount] = useState(null);
  const [userState, setUserState] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── projects_locked state ──
  const [projectsLocked, setProjectsLocked] = useState(false);
  const [lockLoading, setLockLoading] = useState(true);

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("profiles").select("state, projects_locked").eq("id", user.id).single().then(({ data }) => {
      if (data?.state) setUserState(data.state);
      setProjectsLocked(!!data?.projects_locked);
      setLockLoading(false);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    supabase.from("notifications").select("id", { count: "exact" }).eq("user_id", user.id).eq("read", false).then(({ count }) => setUnreadCount(count ?? 0));
    supabase.from("profiles").select("available_projects").eq("id", user.id).single().then(({ data }) => { setAvailableCount((data?.available_projects ?? []).length); });

    const notifCh = supabase.channel("notif-badge-" + user.id)
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${user.id}` }, async () => {
        const { count } = await supabase.from("notifications").select("id", { count: "exact" }).eq("user_id", user.id).eq("read", false);
        setUnreadCount(count ?? 0);
      }).subscribe();

    const profileCh = supabase.channel("profile-badge-" + user.id)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles", filter: `id=eq.${user.id}` }, (payload) => {
        setAvailableCount((payload.new?.available_projects ?? []).length);
        if (payload.new?.state !== undefined) setUserState(payload.new.state);
        if (payload.new?.projects_locked !== undefined) {
          setProjectsLocked(!!payload.new.projects_locked);
          if (!payload.new.projects_locked && view === "verification") setView("tasks");
        }
      }).subscribe();

    return () => { supabase.removeChannel(notifCh); supabase.removeChannel(profileCh); };
  }, [user?.id]);

  useEffect(() => { if (view === "notifications") setUnreadCount(0); }, [view]);

  useEffect(() => {
    const sub = view === "tasks" ? taskTab : view === "payments" ? payTab : view === "profile" ? profileTab : view === "assessment" ? assessmentTab : null;
    window.location.hash = buildHash(view, sub);
  }, [view, taskTab, payTab, profileTab, assessmentTab]);

  useEffect(() => {
    const onPop = () => {
      const { view: v, sub } = parseHash();
      if (VALID_VIEWS.includes(v)) {
        setView(v);
        if (v === "tasks" && VALID_SUBTABS.tasks.includes(sub)) setTaskTab(sub);
        if (v === "payments" && VALID_SUBTABS.payments.includes(sub)) setPayTab(sub);
        if (v === "profile" && VALID_SUBTABS.profile.includes(sub)) setProfileTab(sub);
        if (v === "assessment" && VALID_SUBTABS.assessment.includes(sub)) setAssessmentTab(sub);
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out:", error.message);
    else navigate("/login");
  };

  const handleNavClick = (id) => {
    if (projectsLocked && (id === "tasks" || id === "assessment")) {
      setView("verification");
      closeSidebar();
      return;
    }
    setView(id);
    closeSidebar();
  };

  const goToVerification = () => { setView("verification"); closeSidebar(); };
  const goToTasks = (sub) => { if (projectsLocked) { setView("verification"); return; } setView("tasks"); if (sub) setTaskTab(sub); };

  const NAV = [
    { section: null },
    { id: "overview", label: "Overview", icon: "home" },
    { id: "tasks", label: "Projects", icon: "tasks", badge: !projectsLocked && availableCount !== null && availableCount > 0 ? String(availableCount) : null, lockable: true },
    { id: "payments", label: "Payments", icon: "wallet" },
    { id: "assessment", label: "Assessments", icon: "clipboard", lockable: true },
    { id: "credentials", label: "Credentials", icon: "key" },
    { id: "verification", label: "Verification", icon: "shield" },
    { id: "profile", label: "Profile", icon: "user" },
    { section: "Account" },
    { id: "notifications", label: "Notifications", icon: "bell", badge: unreadCount > 0 ? String(unreadCount) : null },
    { id: "settings", label: "Settings", icon: "settings" },
  ];

  const titles = {
    overview: ["Overview", `Welcome back, ${user.user_metadata.full_name}`],
    tasks: ["Projects", "Browse, manage, and track your work"],
    payments: ["Payments", "Earnings, payouts, and payment methods"],
    profile: ["Profile", "Manage your account and preferences"],
    notifications: ["Notifications", "Your recent alerts and updates"],
    settings: ["Settings", "Platform settings and preferences"],
    assessment: ["Assessments", "Test your knowledge in English, Math, and STEM"],
    verification: ["Verification", "Verify your identity to unlock full platform access"],
    credentials: ["Credentials", "Your Lixeen login and AI job platforms"],
  };
  const [title, subtitle] = titles[view] || titles.overview;

  if (lockLoading) {
    return (
      <>
        <style>{G}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--bg)", gap: 12, color: "var(--muted)", fontSize: 14 }}>
          <div style={{ width: 22, height: 22, border: "2.5px solid var(--border2)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.75s linear infinite" }} />
          Loading…
        </div>
      </>
    );
  }

  return (
    <>
      <style>{G}</style>
      <div className="shell">
        {/* Mobile backdrop */}
        <div className={`sidebar-backdrop${sidebarOpen ? " open" : ""}`} onClick={closeSidebar} />

        <aside className={`sidebar${sidebarOpen ? " mobile-open" : ""}`}>
          <div className="sidebar-top">
            <Link to="/" className="nav-logo" onClick={closeSidebar}>
              <div className="nav-logo-mark"><LogoMark size={18} /></div>
              <span className="nav-logo-name">Lixeen</span>
            </Link>
            <div className="sidebar-user">
              <div className="sidebar-av">{getInitials(user.user_metadata.full_name)}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="sidebar-user-name">{user.user_metadata.full_name}</div>
                <div className="sidebar-user-role">AI Trainer</div>
                {userState ? (
                  <div className="sidebar-user-state">
                    📍 {userState}
                    <button className="state-edit-btn" style={{ marginLeft: 6 }} onClick={() => { setView("profile"); setProfileTab("info"); closeSidebar(); }} title="Edit state">edit</button>
                  </div>
                ) : (
                  <div className="sidebar-user-state">
                    <button className="state-edit-btn" onClick={() => { setView("profile"); setProfileTab("info"); closeSidebar(); }}>+ Add state</button>
                  </div>
                )}
              </div>
              <div className="sidebar-user-badge">Pro</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            {NAV.map((item, i) => {
              if (item.section !== undefined && item.section !== null) return <div className="sidebar-nav-label" key={i}>{item.section}</div>;
              if (!item.id) return null;
              const isLockedNav = projectsLocked && item.lockable;
              return (
                <div
                  key={item.id}
                  className={`sidebar-item${view === item.id ? " active" : ""}${isLockedNav ? " locked-nav" : ""}`}
                  onClick={() => isLockedNav ? goToVerification() : handleNavClick(item.id)}
                  title={isLockedNav ? "Complete verification to unlock" : undefined}
                >
                  <span className="sidebar-item-icon"><I n={item.icon} s={15} /></span>
                  {item.label}
                  {isLockedNav
                    ? <span style={{ marginLeft: "auto", fontSize: 12 }}>🔒</span>
                    : item.badge && <span className="sidebar-badge">{item.badge}</span>
                  }
                </div>
              );
            })}
          </nav>

          <div className="sidebar-bottom">
            <div className="sidebar-item" style={{ color: "var(--sub)" }} onClick={handleLogout}>
              <span className="sidebar-item-icon"><I n="logout" s={15} c="var(--sub)" /></span>Sign out
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <button
              className={`topbar-hamburger${sidebarOpen ? " open" : ""}`}
              onClick={() => setSidebarOpen(o => !o)}
              aria-label="Toggle navigation"
            >
              <span /><span /><span />
            </button>

            <Link to="/" className="topbar-logo-mobile">
              <div className="nav-logo-mark"><LogoMark size={14} /></div>
              <span className="nav-logo-name">Lixeen</span>
            </Link>

            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span className="topbar-title">{title}</span>
              <span className="topbar-sub">— {subtitle}</span>
            </div>

            <div className="topbar-right">
              <button className="topbar-icon-btn"><I n="search" s={15} /></button>
              <button
                className={`topbar-icon-btn${unreadCount > 0 ? " notif-dot" : ""}`}
                onClick={() => { setView("notifications"); closeSidebar(); }}
                style={{ position: "relative" }}
              >
                <I n="bell" s={15} />
                {unreadCount > 0 && (
                  <span style={{ position: "absolute", top: -6, right: -6, minWidth: 18, height: 18, borderRadius: 9, background: "#000", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid var(--surface)" }}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>
              <div className="sidebar-av" style={{ width: 34, height: 34, cursor: "pointer" }} onClick={() => { setView("profile"); closeSidebar(); }}>{getInitials(user.user_metadata.full_name)}</div>
            </div>
          </div>

          <div className="content">
            {view === "overview" && <OverviewView onGoToTasks={goToTasks} onGoToNotifications={() => setView("notifications")} projectsLocked={projectsLocked} onGoToVerification={goToVerification} />}
            {view === "tasks" && <TasksView initialTab={taskTab} onSubTabChange={setTaskTab} projectsLocked={projectsLocked} onGoToVerification={goToVerification} />}
            {view === "payments" && <PaymentsView initialTab={payTab} onSubTabChange={setPayTab} />}
            {view === "profile" && <ProfileView initialTab={profileTab} onSubTabChange={setProfileTab} onStateChange={setUserState} />}
            {view === "notifications" && <NotificationsView />}
            {view === "assessment" && (
              projectsLocked
                ? <ProjectsLockedGate onGoToVerification={goToVerification} />
                : <AssessmentView initialTab={assessmentTab} onSubTabChange={setAssessmentTab} />
            )}
            {view === "verification" && <VerificationView />}
            {view === "credentials" && <CredentialsView />}
            {view === "settings" && (
              <div className="card"><div className="card-body"><div className="empty"><div className="empty-icon">⚙️</div><div className="empty-title">Settings</div><div className="empty-desc">Platform settings and advanced configuration options.<br />More options coming soon.</div></div></div></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}