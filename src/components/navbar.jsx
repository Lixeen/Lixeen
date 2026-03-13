import React from 'react'
import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from "react-router-dom"
import { Arrow, I, LogoMark } from '../assets/constants/branding'
import { supabase } from "../lib/supabase"

const PUBLIC_LINKS = [
    { label: "How it works",  path: "/how-it-works" },
    { label: "Careers",       path: "/careers" },
    { label: "About",         path: "/about" },
    { label: "For Companies", path: "/companies" },
];

const AUTH_LINKS = [
    { label: "Dashboard",     path: "/dashboard" },
    { label: "Browse Tasks",  path: "/dashboard#tasks/available" },
    { label: "Earnings",      path: "/dashboard#payments/overview" },
    { label: "How it works",  path: "/how-it-works" },
];

const G = `
:root {
  --nav-text-static:   #1a1a1a;
  --nav-sub-static:    #555555;
  --nav-border-static: rgba(0,0,0,0.08);
  --nav-text-scrolled: #0a0a0a;
  --nav-sub-scrolled:  #555555;
  --nav-bg-scrolled:   rgba(255,255,255,0.96);
  --nav-border-scrolled: #e5e5e5;
  --accent:  #3dbb00;
  --lime:    #c8f026;
  --surface: #f7f7f7;
  --surface2:#efefef;
  --border:  #e5e5e5;
  --border2: #dddddd;
  --r-pill:  999px;
  --r-sm:    8px;
  --sans:    'Anek Devanagari', system-ui, sans-serif;
}

/* ─── NAV BASE ─── */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 68px; display: flex; align-items: center;
  padding: 0 40px;
  background: transparent;
  border-bottom: 1px solid transparent;
  transition: background 0.35s, border-color 0.35s, box-shadow 0.35s;
}

.nav .nav-logo-name { color: var(--nav-text-static); }
.nav .nav-link      { color: var(--nav-sub-static); }
.nav .nav-link:hover,
.nav .nav-link.active { color: var(--nav-text-static); }
.nav .btn-login     { color: var(--nav-sub-static); border-color: rgba(0,0,0,0.18); }
.nav .btn-login:hover { color: var(--nav-text-static); border-color: rgba(0,0,0,0.4); }
.nav .nav-bell      { color: var(--nav-sub-static); }
.nav .nav-bell:hover { color: var(--nav-text-static); background: rgba(0,0,0,0.06); }
.nav .hamburger     { background: rgba(0,0,0,0.06); border-color: rgba(0,0,0,0.1); }
.nav .hamburger span { background: #333; }

/* Scrolled */
.nav.scrolled {
  background: var(--nav-bg-scrolled);
  border-bottom: 1px solid var(--nav-border-scrolled);
  box-shadow: 0 1px 0 var(--border), 0 4px 24px rgba(0,0,0,0.07);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
}
.nav.scrolled .nav-logo-name { color: var(--nav-text-scrolled); }
.nav.scrolled .nav-link      { color: var(--nav-sub-scrolled); }
.nav.scrolled .nav-link:hover,
.nav.scrolled .nav-link.active { color: var(--nav-text-scrolled); }
.nav.scrolled .btn-login     { color: #555; border-color: var(--border2); }
.nav.scrolled .btn-login:hover { color: #0a0a0a; border-color: #aaa; }
.nav.scrolled .nav-bell      { color: #777; }
.nav.scrolled .nav-bell:hover { color: #0a0a0a; background: var(--surface2); }
.nav.scrolled .hamburger     { background: var(--surface2); border-color: var(--border); }
.nav.scrolled .hamburger span { background: #333; }

/* ─── LOGO ─── */
.nav-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; flex-shrink: 0; margin-right: 48px; cursor: pointer;
}
.nav-logo-mark {
  width: 34px; height: 34px; background: var(--lime);
  border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.nav-logo-name { font-size: 20px; font-weight: 800; color: #0a0a0a; letter-spacing: -0.5px; }

/* ─── NAV LINKS ─── */
.nav-links { display: flex; align-items: center; gap: 0; flex: 1; }
.nav-link {
  display: flex; align-items: center; gap: 6px;
  font-size: 14px; font-weight: 500;
  padding: 8px 16px; border-radius: var(--r-pill);
  cursor: pointer; transition: color 0.15s, background 0.15s;
  text-decoration: none; white-space: nowrap;
}
.nav-link::before {
  content: ''; width: 5px; height: 5px; border-radius: 50%;
  background: #ccc; flex-shrink: 0; transition: background 0.15s;
}
.nav-link:hover::before, .nav-link.active::before { background: var(--accent); }
.nav-link:hover { background: rgba(0,0,0,0.04); }
.nav-link.dashboard-link { font-weight: 700; }
.nav-link.dashboard-link::before { background: var(--accent); }

/* ─── RIGHT SIDE ─── */
.nav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }

/* ─── BUTTONS ─── */
.btn-cta {
  display: inline-flex; align-items: center; gap: 0;
  font-family: var(--sans); font-size: 14px; font-weight: 600;
  cursor: pointer; border: 1.5px solid #0a0a0a; border-radius: var(--r-pill);
  background: transparent; color: #0a0a0a;
  padding: 0 6px 0 20px; height: 42px;
  transition: background 0.2s, color 0.2s, border-color 0.2s; white-space: nowrap;
}
.btn-cta .arrow-box {
  width: 30px; height: 30px; border-radius: 50%; background: #0a0a0a;
  display: flex; align-items: center; justify-content: center;
  margin-left: 10px; flex-shrink: 0; transition: background 0.2s;
}
.btn-cta:hover { background: #0a0a0a; color: #fff; border-color: #0a0a0a; }
.btn-cta:hover .arrow-box { background: #fff; }

.btn-login {
  display: inline-flex; align-items: center;
  font-family: var(--sans); font-size: 14px; font-weight: 500;
  cursor: pointer; border-radius: var(--r-pill); background: transparent;
  padding: 0 18px; height: 38px;
  transition: color 0.15s, border-color 0.15s, background 0.15s;
  white-space: nowrap; border: 1px solid;
}

.btn-outline-dark {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--sans); font-size: 14px; font-weight: 600;
  cursor: pointer; border: 1.5px solid var(--border2); border-radius: var(--r-pill);
  background: #fff; color: #0a0a0a; padding: 0 14px 0 18px; height: 42px; transition: border-color 0.2s;
}
.btn-outline-dark .arrow-box { width: 26px; height: 26px; border-radius: 50%; background: var(--surface2); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; }
.btn-outline-dark:hover { border-color: #aaa; }

.btn-lime {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--sans); font-size: 14px; font-weight: 700;
  cursor: pointer; border: none; border-radius: var(--r-pill);
  background: #0a0a0a; color: #fff; padding: 0 14px 0 18px; height: 42px; transition: opacity 0.2s;
}
.btn-lime .arrow-box { width: 26px; height: 26px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; }
.btn-lime:hover { opacity: 0.85; }

/* ─── BELL ─── */
.nav-bell {
  width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
  background: none; border: none; cursor: pointer; border-radius: 50%;
  transition: color 0.15s, background 0.15s; position: relative;
}
.nav-bell-dot {
  position: absolute; top: 7px; right: 7px; width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent); box-shadow: 0 0 0 2px #fff;
  animation: bellPulse 2s infinite;
}
@keyframes bellPulse {
  0%,100% { opacity:1; transform:scale(1); }
  50%      { opacity:0.6; transform:scale(0.8); }
}

/* ─── NOTIFICATIONS DROPDOWN ─── */
.nav-notif-wrap { position: relative; }

.nav-notif-panel {
  position: absolute; top: calc(100% + 10px); right: 0;
  width: 332px;
  background: #fff; border: 1px solid var(--border);
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 8px 40px rgba(0,0,0,0.13), 0 2px 8px rgba(0,0,0,0.06);
  z-index: 300;
  animation: npDrop 0.18s cubic-bezier(0.16,1,0.3,1);
  transform-origin: top right;
  font-family: var(--sans);
}
@keyframes npDrop {
  from { opacity:0; transform:scale(0.95) translateY(-6px); }
  to   { opacity:1; transform:scale(1) translateY(0); }
}

.np-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:13px 16px 11px; border-bottom:1px solid #f0f0f0;
}
.np-title {
  font-size:13px; font-weight:700; color:#0a0a0a;
  display:flex; align-items:center; gap:7px;
}
.np-badge {
  font-size:10px; font-weight:700; background:var(--accent); color:#fff;
  border-radius:99px; padding:2px 7px; letter-spacing:0.04em;
}
.np-mark-all {
  font-size:11.5px; font-weight:600; color:var(--accent);
  cursor:pointer; background:none; border:none; padding:0;
  font-family:var(--sans); transition:opacity 0.15s;
}
.np-mark-all:hover { opacity:0.7; }

.np-list { max-height:300px; overflow-y:auto; }
.np-list::-webkit-scrollbar { width:3px; }
.np-list::-webkit-scrollbar-thumb { background:#e0e0e0; border-radius:2px; }

.np-item {
  display:flex; align-items:flex-start; gap:11px;
  padding:12px 16px; cursor:pointer;
  border-bottom:1px solid #f7f7f7;
  transition:background 0.12s; position:relative;
}
.np-item:last-child { border-bottom:none; }
.np-item:hover { background:#fafafa; }
.np-item.unread { background:rgba(61,187,0,0.03); }
.np-item.unread:hover { background:rgba(61,187,0,0.07); }
.np-item.unread::before {
  content:''; position:absolute; left:0; top:10px; bottom:10px;
  width:3px; border-radius:0 2px 2px 0; background:var(--accent);
}

.np-icon {
  width:32px; height:32px; border-radius:9px; flex-shrink:0;
  display:flex; align-items:center; justify-content:center; font-size:15px;
}
.np-icon.t-payment { background:rgba(61,187,0,0.1); }
.np-icon.t-task    { background:rgba(124,92,252,0.1); }
.np-icon.t-system  { background:rgba(245,158,11,0.1); }
.np-icon.t-badge   { background:rgba(239,68,68,0.08); }
.np-icon.t-default { background:#f0f0f0; }

.np-body { flex:1; min-width:0; }
.np-msg {
  font-size:13px; color:#333; line-height:1.45; font-weight:500; margin-bottom:3px;
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}
.np-item.unread .np-msg { color:#0a0a0a; font-weight:600; }
.np-time { font-size:11px; color:#aaa; font-weight:500; }

.np-empty {
  padding:28px 16px; text-align:center;
  font-size:13px; color:#bbb; font-weight:500;
}
.np-empty-icon { font-size:26px; margin-bottom:7px; }

.np-footer {
  padding:9px 16px; border-top:1px solid #f0f0f0; text-align:center;
}
.np-footer a {
  font-size:12.5px; font-weight:600; color:var(--accent);
  text-decoration:none; transition:opacity 0.15s;
}
.np-footer a:hover { opacity:0.7; }

/* ─── AVATAR + DROPDOWN ─── */
.nav-user { position: relative; }
.nav-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: #0a0a0a;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff;
  cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; flex-shrink: 0;
}
.nav-avatar:hover, .nav-avatar.open { border-color: var(--accent); }

.user-dropdown {
  position: absolute; top: calc(100% + 10px); right: 0; width: 228px;
  background: #fff; border: 1px solid var(--border); border-radius: 14px; padding: 8px;
  box-shadow: 0 8px 40px rgba(0,0,0,0.12); z-index: 200;
  opacity: 0; pointer-events: none; transform: translateY(-6px);
  transition: opacity 0.15s, transform 0.15s;
}
.user-dropdown.open { opacity: 1; pointer-events: all; transform: translateY(0); }

.dropdown-header {
  padding: 10px 12px 12px; border-bottom: 1px solid var(--border); margin-bottom: 6px;
}
.dropdown-name { font-size: 14px; font-weight: 700; color: #0a0a0a; }
.dropdown-email { font-size: 11px; color: #999; margin-top: 2px; }
.dropdown-level {
  display: inline-flex; align-items: center; gap: 5px;
  font-size: 11px; font-weight: 600; color: var(--accent);
  background: rgba(61,187,0,0.08); border-radius: var(--r-pill); padding: 2px 8px; margin-top: 6px;
}

.dropdown-item {
  display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: var(--r-sm);
  font-size: 13px; font-weight: 500; color: #555;
  cursor: pointer; transition: background 0.1s, color 0.1s; text-decoration: none;
}
.dropdown-item:hover { background: var(--surface); color: #0a0a0a; }
.dropdown-item svg { flex-shrink: 0; }
.dropdown-item.active-item { background: rgba(61,187,0,0.07); color: var(--accent); font-weight: 600; }
.dropdown-divider { height: 1px; background: var(--border); margin: 6px 0; }
.dropdown-item.danger { color: #c03030; }
.dropdown-item.danger:hover { background: rgba(200,40,40,0.07); color: #b02020; }

/* ─── LOADING SHIMMER ─── */
.nav-avatar-loading {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(90deg, var(--surface2) 25%, var(--border) 50%, var(--surface2) 75%);
  background-size: 200% 100%; animation: shimmer 1.4s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

/* ─── HAMBURGER ─── */
.hamburger {
  display: none; flex-direction: column; justify-content: center;
  align-items: center; gap: 5px; width: 38px; height: 38px;
  border-radius: var(--r-sm); cursor: pointer; padding: 0;
  border: 1px solid; transition: background 0.2s;
}
.hamburger span { display: block; width: 16px; height: 1.5px; border-radius: 2px; transition: all 0.2s; }
.hamburger.open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; }
.hamburger.open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

/* ─── MOBILE MENU ─── */
.mobile-menu {
  display: none; position: fixed; top: 68px; left: 0; right: 0;
  background: rgba(255,255,255,0.97); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border); z-index: 99;
  padding: 12px 20px 20px; flex-direction: column; gap: 4px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
}
.mobile-menu.open { display: flex; }
.mobile-menu-link {
  display: block; padding: 12px 16px; font-size: 15px; font-weight: 500; color: #555;
  border-radius: var(--r-sm); cursor: pointer; transition: background 0.1s, color 0.1s; text-decoration: none;
}
.mobile-menu-link:hover { background: var(--surface); color: #0a0a0a; }
.mobile-menu-link.dashboard-mobile { font-weight: 700; color: var(--accent); }
.mobile-menu-divider { height: 1px; background: var(--border); margin: 8px 0; }
.mobile-menu-actions { display: flex; gap: 8px; }

.mobile-user-strip {
  display: flex; align-items: center; gap: 12px; padding: 14px 16px;
  background: var(--surface); border-radius: var(--r-sm); margin-bottom: 4px; border: 1px solid var(--border);
}
.mobile-user-av {
  width: 36px; height: 36px; border-radius: 50%; background: #0a0a0a;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 800; color: #fff; flex-shrink: 0;
}
.mobile-user-name { font-size: 14px; font-weight: 700; color: #0a0a0a; }
.mobile-user-level { font-size: 11px; color: var(--accent); font-weight: 600; }

@media (max-width: 768px) {
  .nav { padding: 0 20px; }
  .nav-links { display: none; }
  .hamburger { display: flex; }
  .btn-login, .btn-cta, .nav-bell { display: none; }
  .nav-avatar { display: flex; }
}
`;

const DropIcon = ({ d }) => (
  <svg width={14} height={14} viewBox="0 0 14 14" fill="none">
    <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ICONS = {
  dashboard: "M2 2h4v4H2zM8 2h4v4H8zM2 8h4v4H2zM8 8h4v4H8z",
  tasks:     "M3 6h8M3 10h5M7 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V6L7 2z",
  earnings:  "M7 1v12M4 4l3-3 3 3M4 10l3 3 3-3",
  settings:  "M7 9.5A2.5 2.5 0 1 0 7 4.5a2.5 2.5 0 0 0 0 5zm5.2-1.1.8.5-.9 1.6-.9-.5a4.5 4.5 0 0 1-1 .6l-.1 1H8.9l-.1-1a4.5 4.5 0 0 1-1-.6l-.9.5-.9-1.6.8-.5a4.6 4.6 0 0 1 0-1.2l-.8-.5.9-1.6.9.5a4.5 4.5 0 0 1 1-.6l.1-1h1.2l.1 1c.36.14.69.34 1 .6l.9-.5.9 1.6-.8.5c.06.4.06.8 0 1.2z",
  logout:    "M9.5 7H1m0 0 2.5-2.5M1 7l2.5 2.5M5 2H12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5",
};

function getInitials(name, email) {
  if (name) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email ? email.slice(0, 2).toUpperCase() : "??";
}

function getDisplayName(user) {
  return user.user_metadata?.full_name
    || user.user_metadata?.name
    || user.email?.split("@")[0]
    || "Trainer";
}

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60)    return 'Just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function notifIcon(type) {
  const map = { payment:'💰', task:'📋', badge:'🏅', system:'🔔', info:'ℹ️', warning:'⚠️' };
  return map[type] || '🔔';
}

function notifTypeClass(type) {
  const map = { payment:'t-payment', task:'t-task', badge:'t-badge', system:'t-system' };
  return map[type] || 't-default';
}

function Navbar() {
    const [session, setSession]               = useState(undefined);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled]             = useState(false);
    const [dropdownOpen, setDropdownOpen]     = useState(false);
    const [notifOpen, setNotifOpen]           = useState(false);
    const [notifications, setNotifications]   = useState([]);
    const [notifLoading, setNotifLoading]     = useState(false);
    const notifRef = useRef(null);

    /* ── Supabase auth ── */
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) { setDropdownOpen(false); setNotifOpen(false); }
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };

    /* ── Scroll ── */
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    /* ── User dropdown click-outside ── */
    useEffect(() => {
        if (!dropdownOpen) return;
        const handler = (e) => { if (!e.target.closest(".nav-user")) setDropdownOpen(false); };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [dropdownOpen]);

    /* ── Notif click-outside ── */
    useEffect(() => {
        if (!notifOpen) return;
        const handler = (e) => {
            if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [notifOpen]);

    /* ── Fetch notifications ── */
    async function fetchNotifications() {
        setNotifLoading(true);
        try {
            const { data: { session: s } } = await supabase.auth.getSession();
            if (!s?.user?.id) return;
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', s.user.id)
                .order('created_at', { ascending: false })
                .limit(5);
            if (!error && data) setNotifications(data);
        } catch (e) {
            console.error('Notifications error:', e);
        } finally {
            setNotifLoading(false);
        }
    }

    /* ── Fetch on mount once session is known ── */
    useEffect(() => {
        if (session?.user?.id) fetchNotifications();
        else if (session === null) setNotifications([]); // logged out — clear
    }, [session?.user?.id]);

    function toggleNotif() {
        const next = !notifOpen;
        setNotifOpen(next);
        if (next) { fetchNotifications(); setDropdownOpen(false); }
    }

    async function markAllRead() {
        const ids = notifications.filter(n => !n.read).map(n => n.id);
        if (!ids.length) return;
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        await supabase.from('notifications').update({ read: true }).in('id', ids);
    }

    async function markRead(id) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        await supabase.from('notifications').update({ read: true }).eq('id', id);
    }

    const user         = session?.user ?? null;
    const loading      = session === undefined;
    const navLinks     = user ? AUTH_LINKS : PUBLIC_LINKS;
    const displayName  = user ? getDisplayName(user) : null;
    const initials     = user ? getInitials(displayName, user.email) : null;
    const trainerLevel = user?.user_metadata?.trainer_level ?? null;
    const hasUnread    = notifications.some(n => !n.read);
    const unreadCount  = notifications.filter(n => !n.read).length;

    return (
        <>
            <style>{G}</style>

            <nav className={`nav${scrolled ? " scrolled" : ""}`}>
                <Link to="/" className="nav-logo">
                    <div className="nav-logo-mark"><LogoMark size={18} /></div>
                    <span className="nav-logo-name">Lixeen</span>
                </Link>

                <div className="nav-links">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.path}
                            to={link.path}
                            className={({ isActive }) =>
                                `nav-link${isActive ? " active" : ""}${link.path === "/dashboard" ? " dashboard-link" : ""}`
                            }
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </div>

                <div className="nav-right">
                    {loading ? (
                        <div className="nav-avatar-loading" />
                    ) : user ? (
                        <>
                            {/* ── Bell + notifications dropdown ── */}
                            <div className="nav-notif-wrap" ref={notifRef}>
                                <button className="nav-bell" aria-label="Notifications" onClick={toggleNotif}>
                                    <I n="bell" s={18} />
                                    {hasUnread && <span className="nav-bell-dot" />}
                                </button>

                                {notifOpen && (
                                    <div className="nav-notif-panel">
                                        <div className="np-header">
                                            <span className="np-title">
                                                Notifications
                                                {unreadCount > 0 && <span className="np-badge">{unreadCount} NEW</span>}
                                            </span>
                                            {hasUnread && (
                                                <button className="np-mark-all" onClick={markAllRead}>Mark all read</button>
                                            )}
                                        </div>

                                        <div className="np-list">
                                            {notifLoading ? (
                                                <div className="np-empty" style={{ padding:'22px 0' }}>Loading…</div>
                                            ) : notifications.length === 0 ? (
                                                <div className="np-empty">
                                                    <div className="np-empty-icon">🔔</div>
                                                    No notifications yet
                                                </div>
                                            ) : notifications.map(n => (
                                                <div
                                                    key={n.id}
                                                    className={`np-item${n.read ? '' : ' unread'}`}
                                                    onClick={() => markRead(n.id)}
                                                >
                                                    <div className={`np-icon ${notifTypeClass(n.type)}`}>
                                                        {notifIcon(n.type)}
                                                    </div>
                                                    <div className="np-body">
                                                        <div className="np-msg">
                                                            {n.message || n.title || n.body || 'New notification'}
                                                        </div>
                                                        <div className="np-time">{timeAgo(n.created_at)}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="np-footer">
                                            <Link to="/dashboard#notifications" onClick={() => setNotifOpen(false)}>
                                                View all notifications →
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* ── Avatar + user dropdown ── */}
                            <div className="nav-user">
                                <div
                                    className={`nav-avatar${dropdownOpen ? " open" : ""}`}
                                    onClick={() => { setDropdownOpen(o => !o); setNotifOpen(false); }}
                                    aria-label="Account menu"
                                    title={displayName}
                                >
                                    {initials}
                                </div>

                                <div className={`user-dropdown${dropdownOpen ? " open" : ""}`}>
                                    <div className="dropdown-header">
                                        <div className="dropdown-name">{displayName}</div>
                                        <div className="dropdown-email">{user.email}</div>
                                        {trainerLevel && (
                                            <div className="dropdown-level">⚡ {trainerLevel}</div>
                                        )}
                                    </div>

                                    {[
                                        { to: "/dashboard", icon: ICONS.dashboard, label: "Dashboard" },
                                        { to: "/tasks",     icon: ICONS.tasks,     label: "Browse Tasks" },
                                        { to: "/earnings",  icon: ICONS.earnings,  label: "Earnings" },
                                        { to: "/settings",  icon: ICONS.settings,  label: "Settings" },
                                    ].map(({ to, icon, label }) => (
                                        <NavLink
                                            key={to}
                                            className={({ isActive }) =>
                                                `dropdown-item${isActive ? " active-item" : ""}`
                                            }
                                            to={to}
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <DropIcon d={icon}/> {label}
                                        </NavLink>
                                    ))}

                                    <div className="dropdown-divider"/>
                                    <div className="dropdown-item danger" onClick={handleLogout}>
                                        <DropIcon d={ICONS.logout}/> Log out
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                            <button className="btn-login">Log in</button>
                            </Link>
                            <Link to="/contact">
                            <button className="btn-cta">
                                Get In Touch
                                <div className="arrow-box"><Arrow size={14} color="#fff" /></div>
                            </button>
                            </Link>
                        </>
                    )}

                    <button
                        className={`hamburger${mobileMenuOpen ? " open" : ""}`}
                        onClick={() => setMobileMenuOpen(o => !o)}
                        aria-label="Toggle menu"
                    >
                        <span /><span /><span />
                    </button>
                </div>
            </nav>

            {/* ── Mobile menu ── */}
            <div className={`mobile-menu${mobileMenuOpen ? " open" : ""}`}>
                {user && (
                    <div className="mobile-user-strip">
                        <div className="mobile-user-av">{initials}</div>
                        <div>
                            <div className="mobile-user-name">{displayName}</div>
                            {trainerLevel && (
                                <div className="mobile-user-level">⚡ {trainerLevel}</div>
                            )}
                        </div>
                    </div>
                )}

                {navLinks.map(l => (
                    <NavLink
                        key={l.path}
                        to={l.path}
                        className={`mobile-menu-link${l.path === "/dashboard" ? " dashboard-mobile" : ""}`}
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {l.label}
                    </NavLink>
                ))}

                <div className="mobile-menu-divider"/>

                {user ? (
                    <div className="mobile-menu-actions">
                        <NavLink
                            to="/settings"
                            className="mobile-menu-link"
                            style={{ flex: 1 }}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Settings
                        </NavLink>
                        <span
                            className="mobile-menu-link"
                            style={{ flex: 1, color: "#c03030" }}
                            onClick={handleLogout}
                        >
                            Log out
                        </span>
                    </div>
                ) : (
                    <div className="mobile-menu-actions">
                        <button className="btn-outline-dark" style={{ flex: 1, justifyContent: "center" }}>
                            Log in <div className="arrow-box"><Arrow size={14} color="#555"/></div>
                        </button>
                        <button className="btn-lime" style={{ flex: 1, justifyContent: "center" }}>
                            Get started <div className="arrow-box"><Arrow size={14} color="#fff"/></div>
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default Navbar;