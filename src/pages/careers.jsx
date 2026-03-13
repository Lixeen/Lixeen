import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
import { Arrow } from '../assets/constants/branding';
import {supabase} from "../lib/supabase"

const G = `
@import url('https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@300;400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:#ffffff; --surface:#f7f7f7; --surface2:#efefef;
  --border:#e5e5e5; --border2:#dddddd;
  --text:#0a0a0a; --sub:#444444; --muted:#888888;
  --accent:#3dbb00; --lime:#c8f026; --lime-dim:rgba(61,187,0,0.09); --lime-glow:rgba(61,187,0,0.2);
  --sans:'Anek Devanagari',system-ui,sans-serif;
  --r-pill:999px; --r-card:16px; --r-sm:8px;
}
html { scroll-behavior: smooth; }
body { font-family: var(--sans); color: var(--text); background: var(--bg); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

.hero { padding: 160px 40px 100px; text-align: center; position: relative; overflow: hidden; background: var(--bg); }
.hero-orb { position: absolute; top: -10%; left: 50%; transform: translateX(-50%); width: 900px; height: 500px; border-radius: 50%; background: radial-gradient(ellipse at 50% 60%, rgba(200,240,38,0.15) 0%, rgba(61,187,0,0.06) 40%, transparent 80%); pointer-events: none; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: var(--sub); background: #fff; border: 1px solid var(--border); border-radius: var(--r-pill); padding: 8px 18px; margin-bottom: 32px; position: relative; z-index: 1; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
.hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
.hero-h1 { font-size: clamp(44px, 6vw, 82px); font-weight: 800; color: var(--text); letter-spacing: -0.03em; line-height: 1.05; max-width: 820px; margin: 0 auto 24px; position: relative; z-index: 1; }
.hero-h1 span { color: var(--accent); }
.hero-sub { font-size: 18px; color: var(--sub); max-width: 560px; line-height: 1.65; margin: 0 auto 48px; font-weight: 400; position: relative; z-index: 1; }
.hero-stats { display: flex; align-items: center; gap: 32px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
.hero-stat { text-align: center; }
.hero-stat-num { font-size: 28px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
.hero-stat-num span { color: var(--accent); }
.hero-stat-label { font-size: 12px; color: var(--muted); font-weight: 500; margin-top: 2px; }
.hero-stat-div { width: 1px; height: 32px; background: var(--border2); }

.mode-toggle {
  display: flex; align-items: center; gap: 0;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-pill); padding: 4px;
  max-width: 420px; margin: 0 auto 64px;
  position: relative; z-index: 1;
}
.mode-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
  font-family: var(--sans); font-size: 14px; font-weight: 600;
  padding: 10px 20px; border-radius: var(--r-pill);
  border: none; cursor: pointer; transition: background 0.2s, color 0.2s;
  background: transparent; color: var(--sub);
}
.mode-btn.active { background: var(--text); color: #fff; }
.mode-btn:not(.active):hover { color: var(--text); }

.section { max-width: 1100px; margin: 0 auto; padding: 100px 40px; }
.sec-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); background: var(--lime-dim); border: 1px solid var(--lime-glow); border-radius: var(--r-pill); padding: 6px 14px; margin-bottom: 20px; }
.sec-h2 { font-size: clamp(32px, 4vw, 52px); font-weight: 800; color: var(--text); letter-spacing: -0.025em; line-height: 1.1; margin-bottom: 16px; }
.sec-sub { font-size: 16px; color: var(--sub); max-width: 520px; line-height: 1.7; margin-bottom: 56px; }
.divider { height: 1px; background: var(--border); }

.perks-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.perk-card { background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); padding: 32px; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; }
.perk-card:hover { border-color: var(--border2); transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
.perk-icon { font-size: 28px; margin-bottom: 16px; }
.perk-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.perk-desc { font-size: 13px; color: var(--sub); line-height: 1.65; }

.dept-filter { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 40px; }
.dept-btn { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--sub); background: #fff; border: 1px solid var(--border); border-radius: var(--r-pill); padding: 8px 18px; cursor: pointer; transition: all 0.15s; white-space: nowrap; }
.dept-btn:hover, .dept-btn.active { background: var(--lime-dim); border-color: var(--lime-glow); color: var(--accent); }
.dept-count { display: inline-flex; align-items: center; justify-content: center; min-width: 18px; height: 18px; border-radius: 9px; background: var(--surface2); font-size: 10px; font-weight: 700; color: var(--sub); padding: 0 4px; }
.dept-btn.active .dept-count { background: var(--lime-dim); color: var(--accent); }

.jobs-group { margin-bottom: 48px; }
.jobs-dept-header { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
.jobs-dept-count { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: none; letter-spacing: 0; }
.job-row { display: flex; align-items: center; justify-content: space-between; background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); padding: 24px 28px; margin-bottom: 12px; gap: 16px; transition: border-color 0.2s, background 0.2s, box-shadow 0.2s; cursor: pointer; }
.job-row:hover { border-color: var(--border2); background: var(--surface); box-shadow: 0 4px 16px rgba(0,0,0,0.05); }
.job-left { flex: 1; min-width: 0; }
.job-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.job-tags { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.job-tag { display: inline-flex; font-size: 12px; font-weight: 600; padding: 4px 12px; border-radius: var(--r-pill); }
.tag-remote { background: var(--lime-dim); color: var(--accent); border: 1px solid var(--lime-glow); }
.tag-ft { background: var(--surface2); color: var(--sub); border: 1px solid var(--border); }
.tag-pay { background: var(--surface2); color: var(--sub); border: 1px solid var(--border); }
.tag-level { background: #f0f0ff; color: #5533cc; border: 1px solid #d8d0ff; }
.job-arrow { width: 36px; height: 36px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: background 0.2s, border-color 0.2s; }
.job-row:hover .job-arrow { background: var(--lime-dim); border-color: var(--lime-glow); }

.pagination {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 0; margin-top: 8px;
  border-top: 1px solid var(--border);
}
.pagination-info { font-size: 13px; color: var(--muted); font-weight: 500; }
.pagination-controls { display: flex; align-items: center; gap: 6px; }
.page-btn {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; border-radius: var(--r-sm);
  border: 1px solid var(--border); background: #fff;
  font-family: var(--sans); font-size: 13px; font-weight: 600;
  color: var(--sub); cursor: pointer; transition: all 0.15s;
}
.page-btn:hover:not(:disabled) { border-color: var(--accent); color: var(--accent); background: var(--lime-dim); }
.page-btn.active { background: var(--text); color: #fff; border-color: var(--text); }
.page-btn:disabled { opacity: 0.35; cursor: not-allowed; }
.page-btn-arrow { width: 36px; height: 36px; }
.page-ellipsis { font-size: 13px; color: var(--muted); padding: 0 4px; line-height: 36px; }

.discipline-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 40px; }
.discipline-card {
  background: #fff; border: 1px solid var(--border); border-radius: var(--r-card);
  padding: 28px 24px; transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s; cursor: pointer;
}
.discipline-card:hover { border-color: var(--accent); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(61,187,0,0.1); }
.discipline-card.featured { border-color: var(--lime-glow); background: linear-gradient(135deg, #fafffe 0%, #f5fff0 100%); }
.discipline-card.selected { border-color: var(--accent); border-width: 2px; box-shadow: 0 0 0 3px rgba(61,187,0,0.08); }
.discipline-icon { font-size: 30px; margin-bottom: 14px; }
.discipline-title { font-size: 15px; font-weight: 800; color: var(--text); margin-bottom: 6px; letter-spacing: -0.01em; }
.discipline-desc { font-size: 13px; color: var(--sub); line-height: 1.6; margin-bottom: 14px; }
.discipline-pay { font-size: 15px; font-weight: 800; color: var(--accent); margin-bottom: 4px; }
.discipline-pay-label { font-size: 11px; color: var(--muted); font-weight: 500; }
.discipline-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 14px; }
.discipline-tag { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: var(--r-pill); background: var(--surface2); border: 1px solid var(--border); color: var(--sub); }
.discipline-role-count { display: inline-flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 600; color: var(--accent); margin-top: 12px; }

.roles-panel { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-card); padding: 28px 32px; margin-bottom: 48px; }
.roles-panel-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
.roles-panel-title { font-size: 16px; font-weight: 800; color: var(--text); letter-spacing: -0.01em; }
.roles-panel-close { display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--sub); background: none; border: 1px solid var(--border); border-radius: var(--r-pill); padding: 6px 14px; cursor: pointer; transition: all 0.15s; }
.roles-panel-close:hover { border-color: var(--border2); color: var(--text); background: #fff; }

.how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: var(--r-card); overflow: hidden; margin-bottom: 56px; }
.how-cell { background: #fff; padding: 32px 28px; transition: background 0.2s; }
.how-cell:hover { background: var(--surface); }
.how-num { font-size: 11px; font-weight: 700; color: var(--accent); margin-bottom: 14px; letter-spacing: 0.1em; text-transform: uppercase; }
.how-title { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
.how-desc { font-size: 13px; color: var(--sub); line-height: 1.65; }

.earnings-banner {
  background: linear-gradient(135deg, #f0fff4 0%, #f5fef0 100%);
  border: 1px solid var(--lime-glow); border-radius: var(--r-card);
  padding: 36px 40px; margin-bottom: 56px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;
}
.earnings-banner-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--accent); margin-bottom: 8px; }
.earnings-banner-title { font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; margin-bottom: 6px; }
.earnings-banner-sub { font-size: 14px; color: var(--sub); line-height: 1.6; }
.earnings-stats { display: flex; gap: 32px; flex-wrap: wrap; }
.earnings-stat { text-align: center; }
.earnings-stat-num { font-size: 26px; font-weight: 800; color: var(--accent); letter-spacing: -0.02em; }
.earnings-stat-label { font-size: 11px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 3px; }

.cta-banner { background: linear-gradient(135deg, #f0f9e6 0%, #f5f0ff 50%, #f0f9e6 100%); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 100px 40px; text-align: center; position: relative; overflow: hidden; }
.cta-banner-glow { position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%); width: 600px; height: 300px; border-radius: 50%; background: radial-gradient(ellipse, rgba(61,187,0,0.12) 0%, transparent 70%); pointer-events: none; }
.cta-banner h2 { font-size: clamp(32px, 4vw, 52px); font-weight: 800; color: var(--text); letter-spacing: -0.025em; margin-bottom: 16px; position: relative; z-index: 1; }
.cta-banner h2 span { color: var(--accent); }
.cta-banner p { font-size: 17px; color: var(--sub); margin-bottom: 40px; position: relative; z-index: 1; max-width: 480px; margin-left: auto; margin-right: auto; line-height: 1.65; }
.cta-actions { display: flex; align-items: center; gap: 12px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
.btn-lime { display: inline-flex; align-items: center; gap: 0; font-family: var(--sans); font-size: 15px; font-weight: 700; cursor: pointer; border: none; border-radius: var(--r-pill); background: var(--text); color: #fff; padding: 0 6px 0 24px; height: 48px; transition: opacity 0.2s; }
.btn-lime:hover { opacity: 0.85; }
.btn-lime .arrow-box { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; margin-left: 10px; }
.btn-outline { display: inline-flex; align-items: center; gap: 0; font-family: var(--sans); font-size: 15px; font-weight: 600; cursor: pointer; border: 1.5px solid var(--border2); border-radius: var(--r-pill); background: #fff; color: var(--text); padding: 0 6px 0 24px; height: 48px; transition: border-color 0.2s, background 0.2s; }
.btn-outline:hover { border-color: var(--sub); background: var(--surface); }
.btn-outline .arrow-box { width: 36px; height: 36px; border-radius: 50%; background: var(--surface); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; margin-left: 10px; }

.loading-state { display: flex; align-items: center; justify-content: center; padding: 80px 40px; flex-direction: column; gap: 16px; }
.loading-spinner { width: 32px; height: 32px; border: 3px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.loading-text { font-size: 14px; color: var(--muted); font-weight: 500; }

.fade-in { opacity: 0; transform: translateY(24px); transition: opacity 0.6s ease, transform 0.6s ease; }
.fade-in.visible { opacity: 1; transform: translateY(0); }

@media (max-width: 900px) {
  .perks-grid { grid-template-columns: 1fr 1fr; }
  .discipline-grid { grid-template-columns: 1fr 1fr; }
  .how-grid { grid-template-columns: 1fr; }
  .earnings-banner { flex-direction: column; align-items: flex-start; }
  .pagination { flex-direction: column; gap: 12px; align-items: flex-start; }
}
@media (max-width: 600px) {
  .perks-grid { grid-template-columns: 1fr; }
  .discipline-grid { grid-template-columns: 1fr; }
  .hero { padding: 120px 20px 80px; }
  .section { padding: 72px 20px; }
  .cta-banner { padding: 60px 20px; }
  .cta-actions { flex-direction: column; align-items: stretch; }
  .cta-actions > * { width: 100%; justify-content: center; }
  .mode-toggle { max-width: 100%; margin: 0 20px 48px; }
  .earnings-banner { padding: 28px 24px; }
  .earnings-stats { gap: 20px; }
  .roles-panel { padding: 20px; }
}
`;

function FadeIn({ children, delay = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) el.classList.add("visible");
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="fade-in" style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

const JOBS_PER_PAGE = 8;
const DISC_PER_PAGE = 6;

function Pagination({ total, perPage, current, onChange }) {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages <= 1) return null;
  const start = (current - 1) * perPage + 1;
  const end = Math.min(current * perPage, total);
  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) { for (let i = 1; i <= totalPages; i++) pages.push(i); return pages; }
    pages.push(1);
    if (current > 3) pages.push("...");
    for (let i = Math.max(2, current - 1); i <= Math.min(totalPages - 1, current + 1); i++) pages.push(i);
    if (current < totalPages - 2) pages.push("...");
    pages.push(totalPages);
    return pages;
  };
  return (
    <div className="pagination">
      <div className="pagination-info">Showing {start}–{end} of {total}</div>
      <div className="pagination-controls">
        <button className="page-btn page-btn-arrow" onClick={() => onChange(current - 1)} disabled={current === 1} title="Previous">←</button>
        {getPages().map((p, i) =>
          p === "..." ? <span key={`e-${i}`} className="page-ellipsis">…</span> :
          <button key={p} className={`page-btn${current === p ? " active" : ""}`} onClick={() => onChange(p)}>{p}</button>
        )}
        <button className="page-btn page-btn-arrow" onClick={() => onChange(current + 1)} disabled={current === Math.ceil(total / perPage)} title="Next">→</button>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="loading-state">
      <div className="loading-spinner" />
      <div className="loading-text">Loading roles…</div>
    </div>
  );
}

export default function CareersPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("trainer");

  // ── Supabase data ──
  const [departments, setDepartments] = useState([]);
  const [inHouseRoles, setInHouseRoles] = useState([]);  // flat, with dept name
  const [disciplines, setDisciplines] = useState([]);
  const [trainerRoles, setTrainerRoles] = useState([]);  // flat, with discipline info
  const [loading, setLoading] = useState(true);

  // ── Trainer state ──
  const [trainerFilter, setTrainerFilter] = useState("All");
  const [expandedDisc, setExpandedDisc] = useState(null);
  const [discPage, setDiscPage] = useState(1);
  const [rolePage, setRolePage] = useState(1);
  const [allRolesPage, setAllRolesPage] = useState(1);

  // ── In-house state ──
  const [inHouseFilter, setInHouseFilter] = useState("All");
  const [inHousePage, setInHousePage] = useState(1);

  // ── Fetch data from Supabase ──
  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [deptsRes, inHouseRes, disciplinesRes, trainerRes] = await Promise.all([
          supabase.from("departments").select("*").order("id"),
          supabase
            .from("inhouse_roles")
            .select("*, departments(name)")
            .order("id"),
          supabase.from("disciplines").select("*").order("id"),
          supabase
            .from("trainer_roles")
            .select("*, disciplines(id, title, icon, pay_range, pay_label, tags, featured)")
            .order("id"),
        ]);

        if (deptsRes.error) throw deptsRes.error;
        if (inHouseRes.error) throw inHouseRes.error;
        if (disciplinesRes.error) throw disciplinesRes.error;
        if (trainerRes.error) throw trainerRes.error;

        setDepartments(deptsRes.data || []);

        // Flatten: attach dept name from joined departments table
        const flatInHouse = (inHouseRes.data || []).map(r => ({
          ...r,
          dept: r.departments?.name || "Unknown",
        }));
        setInHouseRoles(flatInHouse);

        setDisciplines(disciplinesRes.data || []);

        // Flatten: attach discipline info
        const flatTrainer = (trainerRes.data || []).map(r => ({
          ...r,
          discipline: r.disciplines?.title || "Unknown",
          icon: r.disciplines?.icon || "",
          discFeatured: r.disciplines?.featured || false,
          discPayRange: r.disciplines?.pay_range || "",
          discPayLabel: r.disciplines?.pay_label || "",
          discTags: r.disciplines?.tags || [],
        }));
        setTrainerRoles(flatTrainer);

      } catch (err) {
        console.error("Supabase fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  // ── Derived counts ──
  const totalInHouse = inHouseRoles.length;
  const totalTrainer = trainerRoles.length;
  const inHouseDepts = ["All", ...departments.map(d => d.name)];

  const tagClass = tag => {
    if (tag === "Remote") return "job-tag tag-remote";
    if (tag === "Full-time" || tag === "Flexible") return "job-tag tag-ft";
    if (tag.startsWith("$")) return "job-tag tag-pay";
    return "job-tag tag-level";
  };

  const switchMode = (m) => {
    setMode(m);
    setTrainerFilter("All"); setExpandedDisc(null);
    setDiscPage(1); setRolePage(1); setAllRolesPage(1);
    setInHouseFilter("All"); setInHousePage(1);
  };

  const handleTrainerFilter = (d) => {
    setTrainerFilter(d);
    setExpandedDisc(d === "All" ? null : d);
    setDiscPage(1); setRolePage(1); setAllRolesPage(1);
  };

  const handleDiscClick = (title) => {
    if (expandedDisc === title) { setExpandedDisc(null); } else { setExpandedDisc(title); setRolePage(1); }
  };

  // Navigate to job detail page
  const handleJobClick = (role, type) => {
    navigate(`/careers/${type}/${role.slug}`);
  };

  // ── Discipline helpers ──
  // Build discipline list with role count from trainerRoles
  const disciplinesWithCounts = disciplines.map(d => ({
    ...d,
    roles: trainerRoles.filter(r => r.discipline === d.title),
  }));

  const discSource = trainerFilter === "All"
    ? disciplinesWithCounts
    : disciplinesWithCounts.filter(d => d.title === trainerFilter);
  const pagedDiscs = discSource.slice((discPage - 1) * DISC_PER_PAGE, discPage * DISC_PER_PAGE);

  const expandedDiscObj = expandedDisc
    ? disciplinesWithCounts.find(d => d.title === expandedDisc)
    : null;
  const pagedExpandedRoles = expandedDiscObj
    ? expandedDiscObj.roles.slice((rolePage - 1) * JOBS_PER_PAGE, rolePage * JOBS_PER_PAGE)
    : [];

  const pagedAllTrainerRoles = trainerRoles.slice((allRolesPage - 1) * JOBS_PER_PAGE, allRolesPage * JOBS_PER_PAGE);

  // ── In-house helpers ──
  const inHouseSource = inHouseFilter === "All"
    ? inHouseRoles
    : inHouseRoles.filter(r => r.dept === inHouseFilter);
  const pagedInHouseRoles = inHouseSource.slice((inHousePage - 1) * JOBS_PER_PAGE, inHousePage * JOBS_PER_PAGE);
  const groupedInHouseRoles = pagedInHouseRoles.reduce((acc, r) => {
    if (!acc[r.dept]) acc[r.dept] = [];
    acc[r.dept].push(r);
    return acc;
  }, {});

  const inHouseCountByDept = (deptName) =>
    deptName === "All" ? totalInHouse : inHouseRoles.filter(r => r.dept === deptName).length;

  return (
    <>
      <style>{G}</style>
      <Navbar />

      {/* HERO */}
      <div className="hero">
        <div className="hero-orb"/>
        <FadeIn>
          <div className="hero-badge">
            <div className="hero-badge-dot"/>
            {loading ? "Loading…" : `${totalInHouse} Team Roles · ${totalTrainer} Trainer Roles · 100% Remote`}
          </div>
          <h1 className="hero-h1">
            Two ways to join<br/>
            <span>the Lixeen team</span>
          </h1>
          <p className="hero-sub">
            Whether you want to build the platform or train the AI — there's a place for you here. All roles are remote and open globally.
          </p>
          <div className="hero-stats">
            <div className="hero-stat"><div className="hero-stat-num">{loading ? "—" : totalInHouse}</div><div className="hero-stat-label">Team Openings</div></div>
            <div className="hero-stat-div"/>
            <div className="hero-stat"><div className="hero-stat-num">{loading ? "—" : totalTrainer}</div><div className="hero-stat-label">Trainer Roles</div></div>
            <div className="hero-stat-div"/>
            <div className="hero-stat"><div className="hero-stat-num"><span>{loading ? "—" : disciplines.length}</span></div><div className="hero-stat-label">Disciplines</div></div>
            <div className="hero-stat-div"/>
            <div className="hero-stat"><div className="hero-stat-num"><span>100%</span></div><div className="hero-stat-label">Remote</div></div>
          </div>
        </FadeIn>
      </div>

      <div className="divider"/>

      {/* MODE TOGGLE */}
      <div style={{ background: "var(--bg)", padding: "48px 40px 0", display: "flex", justifyContent: "center" }}>
        <FadeIn>
          <div className="mode-toggle">
            <button className={`mode-btn${mode === "trainer" ? " active" : ""}`} onClick={() => switchMode("trainer")}>
              🎓 Become a Trainer
            </button>
            <button className={`mode-btn${mode === "inhouse" ? " active" : ""}`} onClick={() => switchMode("inhouse")}>
              🏢 Join the Team
            </button>
          </div>
        </FadeIn>
      </div>

      {/* ══ TRAINER MODE ══ */}
      {mode === "trainer" && (
        <>
          <div style={{ background: "var(--bg)" }}>
            <div className="section" style={{ paddingBottom: 0 }}>
              <FadeIn>
                <div className="earnings-banner">
                  <div className="earnings-banner-left">
                    <div className="earnings-banner-label">Trainer Earnings</div>
                    <div className="earnings-banner-title">Earn from your expertise — on your schedule</div>
                    <div className="earnings-banner-sub">Tasks pay by the hour, calculated from time spent. Top trainers earn $3,000–5,000+/month working part-time.</div>
                  </div>
                  <div className="earnings-stats">
                    <div className="earnings-stat"><div className="earnings-stat-num">$20–56</div><div className="earnings-stat-label">Hourly rate range</div></div>
                    <div className="earnings-stat"><div className="earnings-stat-num">24h</div><div className="earnings-stat-label">Payout turnaround</div></div>
                    <div className="earnings-stat"><div className="earnings-stat-num">50+</div><div className="earnings-stat-label">Countries supported</div></div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>

          <div style={{ background: "var(--bg)" }}>
            <div className="section" style={{ paddingBottom: 0 }}>
              <FadeIn>
                <div className="sec-eyebrow">How it works</div>
                <h2 className="sec-h2">From signup to payout in three steps</h2>
                <p className="sec-sub">No interviews, no waiting. Sign up, pass a short skill check, and start earning.</p>
              </FadeIn>
              <FadeIn delay={100}>
                <div className="how-grid">
                  {[
                    { n: "01", title: "Sign up & assess", desc: "Create your account and complete a short discipline assessment. We use this to match you to tasks in your areas of expertise." },
                    { n: "02", title: "Pick up tasks", desc: "Browse your personalized task feed. Every task shows the pay rate, estimated time, difficulty level, and deadline upfront." },
                    { n: "03", title: "Get paid", desc: "Submit your work. Once reviewed and accepted, earnings hit your balance within 24 hours. Withdraw at any time via bank or PayPal." },
                  ].map(s => (
                    <div className="how-cell" key={s.n}>
                      <div className="how-num">Step {s.n}</div>
                      <div className="how-title">{s.title}</div>
                      <div className="how-desc">{s.desc}</div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>

          <div style={{ background: "var(--bg)" }}>
            <div className="section">
              <FadeIn>
                <div className="sec-eyebrow">Disciplines</div>
                <h2 className="sec-h2">Find your field</h2>
                <p className="sec-sub">
                  We hire trainers across {disciplines.length} subject areas. Click any discipline card to browse its open roles.
                </p>
              </FadeIn>

              {/* Discipline filter pills */}
              <FadeIn delay={80}>
                <div className="dept-filter">
                  {["All", ...disciplines.map(d => d.title)].map(d => {
                    const count = d === "All"
                      ? totalTrainer
                      : (disciplinesWithCounts.find(x => x.title === d)?.roles.length ?? 0);
                    return (
                      <button
                        key={d}
                        className={`dept-btn${trainerFilter === d ? " active" : ""}`}
                        onClick={() => handleTrainerFilter(d)}
                      >
                        {d === "All" ? "All Disciplines" : d.split(" ")[0]}
                        <span className="dept-count">{count}</span>
                      </button>
                    );
                  })}
                </div>
              </FadeIn>

              {loading ? (
                <LoadingState />
              ) : (
                <>
                  {/* Discipline cards */}
                  <FadeIn delay={120}>
                    <div className="discipline-grid">
                      {pagedDiscs.map(disc => (
                        <div
                          key={disc.title}
                          className={`discipline-card${disc.featured ? " featured" : ""}${expandedDisc === disc.title ? " selected" : ""}`}
                          onClick={() => handleDiscClick(disc.title)}
                        >
                          <div className="discipline-icon">{disc.icon}</div>
                          <div className="discipline-title">{disc.title}</div>
                          <div className="discipline-desc">{disc.description}</div>
                          <div className="discipline-pay">{disc.pay_range}</div>
                          <div className="discipline-pay-label">{disc.pay_label}</div>
                          <div className="discipline-tags">
                            {(disc.tags || []).map(t => <span className="discipline-tag" key={t}>{t}</span>)}
                          </div>
                          <div className="discipline-role-count">
                            {disc.roles.length} open role{disc.roles.length !== 1 ? "s" : ""} →
                          </div>
                        </div>
                      ))}
                    </div>

                    {trainerFilter === "All" && (
                      <Pagination
                        total={disciplinesWithCounts.length}
                        perPage={DISC_PER_PAGE}
                        current={discPage}
                        onChange={(p) => { setDiscPage(p); setExpandedDisc(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      />
                    )}
                  </FadeIn>

                  {/* Expanded discipline panel */}
                  {expandedDisc && expandedDiscObj && (
                    <FadeIn>
                      <div className="roles-panel">
                        <div className="roles-panel-header">
                          <div className="roles-panel-title">
                            {expandedDiscObj.icon} {expandedDiscObj.title} — {expandedDiscObj.roles.length} Open Role{expandedDiscObj.roles.length !== 1 ? "s" : ""}
                          </div>
                          <button className="roles-panel-close" onClick={() => setExpandedDisc(null)}>✕ Close</button>
                        </div>
                        {pagedExpandedRoles.map(role => (
                          <div className="job-row" key={role.slug} onClick={() => handleJobClick(role, "trainer")}>
                            <div className="job-left">
                              <div className="job-title">{role.title}</div>
                              <div className="job-tags">
                                {(role.tags || []).map(tag => <span key={tag} className={tagClass(tag)}>{tag}</span>)}
                              </div>
                            </div>
                            <div className="job-arrow"><Arrow size={14} color="var(--accent)"/></div>
                          </div>
                        ))}
                        <Pagination total={expandedDiscObj.roles.length} perPage={JOBS_PER_PAGE} current={rolePage} onChange={setRolePage} />
                      </div>
                    </FadeIn>
                  )}

                  {/* All roles flat list */}
                  {trainerFilter === "All" && !expandedDisc && (
                    <FadeIn delay={160}>
                      <div style={{ marginTop: 16 }}>
                        <div className="jobs-dept-header" style={{ marginBottom: 20 }}>
                          <span>All Trainer Roles</span>
                          <span className="jobs-dept-count">{totalTrainer} roles across {disciplines.length} disciplines</span>
                        </div>
                        {pagedAllTrainerRoles.map(role => (
                          <div className="job-row" key={role.slug} onClick={() => handleJobClick(role, "trainer")}>
                            <div className="job-left">
                              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                  {role.icon} {role.discipline}
                                </span>
                              </div>
                              <div className="job-title">{role.title}</div>
                              <div className="job-tags">
                                {(role.tags || []).map(tag => <span key={tag} className={tagClass(tag)}>{tag}</span>)}
                              </div>
                            </div>
                            <div className="job-arrow"><Arrow size={14} color="var(--accent)"/></div>
                          </div>
                        ))}
                        <Pagination total={totalTrainer} perPage={JOBS_PER_PAGE} current={allRolesPage} onChange={setAllRolesPage} />
                      </div>
                    </FadeIn>
                  )}

                  {/* Filtered single discipline flat list */}
                  {trainerFilter !== "All" && !expandedDisc && (() => {
                    const disc = disciplinesWithCounts.find(d => d.title === trainerFilter);
                    if (!disc) return null;
                    const pagedRoles = disc.roles.slice((rolePage - 1) * JOBS_PER_PAGE, rolePage * JOBS_PER_PAGE);
                    return (
                      <FadeIn>
                        <div style={{ marginTop: 16 }}>
                          <div className="jobs-dept-header" style={{ marginBottom: 20 }}>
                            <span>{disc.icon} {disc.title}</span>
                            <span className="jobs-dept-count">{disc.roles.length} open roles</span>
                          </div>
                          {pagedRoles.map(role => (
                            <div className="job-row" key={role.slug} onClick={() => handleJobClick(role, "trainer")}>
                              <div className="job-left">
                                <div className="job-title">{role.title}</div>
                                <div className="job-tags">
                                  {(role.tags || []).map(tag => <span key={tag} className={tagClass(tag)}>{tag}</span>)}
                                </div>
                              </div>
                              <div className="job-arrow"><Arrow size={14} color="var(--accent)"/></div>
                            </div>
                          ))}
                          <Pagination total={disc.roles.length} perPage={JOBS_PER_PAGE} current={rolePage} onChange={setRolePage} />
                        </div>
                      </FadeIn>
                    );
                  })()}
                </>
              )}
            </div>
          </div>

          <div className="cta-banner">
            <div className="cta-banner-glow"/>
            <FadeIn>
              <h2>Ready to start <span>training AI?</span></h2>
              <p>Join 18,400+ trainers earning from their expertise. Free to join — no interview required.</p>
              <div className="cta-actions">
                <Link to="/sign-up">
                  <button className="btn-lime">Create Free Account<div className="arrow-box"><Arrow size={16} color="#fff"/></div></button>
                </Link>
                <Link to="/dashboard#assessment">
                  <button className="btn-outline">Take a Skill Assessment<div className="arrow-box"><Arrow size={16} color="#555"/></div></button>
                </Link>
              </div>
            </FadeIn>
          </div>
        </>
      )}

      {/* ══ IN-HOUSE MODE ══ */}
      {mode === "inhouse" && (
        <>
          <div style={{ background: "var(--surface)" }}>
            <div className="section">
              <FadeIn>
                <div className="sec-eyebrow">Why Lixeen</div>
                <h2 className="sec-h2">What we offer</h2>
                <p className="sec-sub">We take care of the people who take care of the platform.</p>
              </FadeIn>
              <FadeIn delay={100}>
                <div className="perks-grid">
                  {[
                    { icon: "🌐", title: "Fully Remote", desc: "Work from anywhere in the world. We're async-first and have teammates across 22 countries." },
                    { icon: "💰", title: "Competitive Comp", desc: "Market-rate salaries benchmarked quarterly, equity for all full-time employees, and annual reviews." },
                    { icon: "🏥", title: "Health Coverage", desc: "Full medical, dental, and vision for you and dependents. Available wherever local law permits." },
                    { icon: "📚", title: "$2,000 Learning Budget", desc: "Annual budget for courses, conferences, books, or anything else that helps you grow professionally." },
                    { icon: "⏱️", title: "Async by Default", desc: "No mandatory standups. You own your schedule. We communicate through thoughtful writing, not back-to-back calls." },
                    { icon: "📈", title: "Meaningful Equity", desc: "Every full-time hire gets equity. We want everyone to have a stake in what we're building together." },
                  ].map(p => (
                    <div className="perk-card" key={p.title}>
                      <div className="perk-icon">{p.icon}</div>
                      <div className="perk-title">{p.title}</div>
                      <div className="perk-desc">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
          </div>

          <div className="divider"/>

          <div style={{ background: "var(--bg)" }}>
            <div className="section">
              <FadeIn>
                <div className="sec-eyebrow">Open Roles</div>
                <h2 className="sec-h2">Find your place</h2>
                <p className="sec-sub">{totalInHouse} open positions across engineering, product, operations, and research.</p>
              </FadeIn>

              <FadeIn delay={80}>
                <div className="dept-filter">
                  {inHouseDepts.map(d => (
                    <button
                      key={d}
                      className={`dept-btn${inHouseFilter === d ? " active" : ""}`}
                      onClick={() => { setInHouseFilter(d); setInHousePage(1); }}
                    >
                      {d} <span className="dept-count">{inHouseCountByDept(d)}</span>
                    </button>
                  ))}
                </div>
              </FadeIn>

              {loading ? (
                <LoadingState />
              ) : (
                <FadeIn delay={140}>
                  {Object.entries(groupedInHouseRoles).map(([dept, roles]) => (
                    <div className="jobs-group" key={dept}>
                      <div className="jobs-dept-header">
                        <span>{dept}</span>
                        <span className="jobs-dept-count">{inHouseCountByDept(dept)} roles</span>
                      </div>
                      {roles.map(role => (
                        <div className="job-row" key={role.slug} onClick={() => handleJobClick(role, "inhouse")}>
                          <div className="job-left">
                            <div className="job-title">{role.title}</div>
                            <div className="job-tags">
                              {(role.tags || []).map(tag => <span key={tag} className={tagClass(tag)}>{tag}</span>)}
                            </div>
                          </div>
                          <div className="job-arrow"><Arrow size={14} color="var(--accent)"/></div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <Pagination total={inHouseSource.length} perPage={JOBS_PER_PAGE} current={inHousePage} onChange={setInHousePage} />
                </FadeIn>
              )}
            </div>
          </div>

          <div className="cta-banner">
            <div className="cta-banner-glow"/>
            <FadeIn>
              <h2>Don't see your role? <span>Reach out anyway.</span></h2>
              <p>We keep a list of standout candidates for roles we haven't posted yet. Send us a note at careers@lixeen.com.</p>
              <div className="cta-actions">
                <button className="btn-lime">Send Open Application<div className="arrow-box"><Arrow size={16} color="#fff"/></div></button>
                <button className="btn-outline">Learn About the Team<div className="arrow-box"><Arrow size={16} color="#555"/></div></button>
              </div>
            </FadeIn>
          </div>
        </>
      )}

      <Footer />
    </>
  );
}