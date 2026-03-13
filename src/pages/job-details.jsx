import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { Arrow } from "../assets/constants/branding";
import {supabase} from "../lib/supabase";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const G = `
@import url('https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@300;400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #ffffff;
  --surface: #f7f7f7;
  --surface2: #efefef;
  --border: #e5e5e5;
  --border2: #dddddd;
  --text: #0a0a0a;
  --sub: #444444;
  --muted: #888888;
  --accent: #3dbb00;
  --lime-dim: rgba(61,187,0,0.09);
  --lime-glow: rgba(61,187,0,0.2);
  --sans: 'Anek Devanagari', system-ui, sans-serif;
  --r-pill: 999px;
  --r-card: 16px;
  --r-sm: 8px;
  --max-w: 1100px;
  --content-w: 720px;
}
html { scroll-behavior: smooth; }
body {
  font-family: var(--sans);
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

/* ── Page wrapper ── */
.jd-page { min-height: 100vh; padding-top: 68px; }

/* ── Loading / Error ── */
.jd-loading, .jd-error {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-height: 60vh; gap: 16px; padding: 40px;
  text-align: center;
}
.jd-spinner {
  width: 36px; height: 36px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: jd-spin 0.75s linear infinite;
}
@keyframes jd-spin { to { transform: rotate(360deg); } }
.jd-loading-text { font-size: 14px; color: var(--muted); font-weight: 500; }
.jd-error-code { font-size: 72px; font-weight: 800; color: var(--border2); letter-spacing: -0.04em; line-height: 1; }
.jd-error-title { font-size: 24px; font-weight: 800; color: var(--text); letter-spacing: -0.02em; }
.jd-error-sub { font-size: 15px; color: var(--sub); max-width: 380px; line-height: 1.65; }

/* ── Breadcrumb bar (NOT sticky — sits right below the navbar) ── */
.jd-breadcrumb-bar {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.jd-breadcrumb-bar-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 40px;
  height: 48px;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
}
.jd-breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 13px; color: var(--muted); font-weight: 500;
  flex: 1; min-width: 0;
}
.jd-breadcrumb a {
  color: var(--muted); text-decoration: none;
  transition: color 0.15s; white-space: nowrap;
}
.jd-breadcrumb a:hover { color: var(--text); }
.jd-breadcrumb-sep { color: var(--border2); flex-shrink: 0; user-select: none; }
.jd-breadcrumb-current {
  color: var(--text); font-weight: 600;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.jd-breadcrumb-back {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: var(--sub);
  text-decoration: none; white-space: nowrap; flex-shrink: 0;
  transition: color 0.15s;
}
.jd-breadcrumb-back:hover { color: var(--text); }

/* ── Hero ── */
.jd-hero {
  background: var(--bg);
  padding: 56px 40px 48px;
  border-bottom: 1px solid var(--border);
}
.jd-hero-inner {
  max-width: var(--max-w); margin: 0 auto;
  display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: start;
}
.jd-hero-left {}
.jd-type-pill {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--accent);
  background: var(--lime-dim); border: 1px solid var(--lime-glow);
  border-radius: var(--r-pill); padding: 5px 14px; margin-bottom: 20px;
}
.jd-hero-title {
  font-size: clamp(28px, 4vw, 46px);
  font-weight: 800; color: var(--text);
  letter-spacing: -0.03em; line-height: 1.08;
  margin-bottom: 20px;
}
.jd-hero-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
.jd-tag {
  display: inline-flex; font-size: 12px; font-weight: 600;
  padding: 5px 14px; border-radius: var(--r-pill);
}
.tag-remote { background: var(--lime-dim); color: var(--accent); border: 1px solid var(--lime-glow); }
.tag-ft     { background: var(--surface2); color: var(--sub); border: 1px solid var(--border); }
.tag-pay    { background: var(--surface2); color: var(--sub); border: 1px solid var(--border); }
.tag-level  { background: #f0f0ff; color: #5533cc; border: 1px solid #d8d0ff; }
.jd-hero-summary {
  font-size: 16px; color: var(--sub); line-height: 1.75;
  font-weight: 400; max-width: 580px;
}

/* Hero right: stats box */
.jd-hero-stats {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 24px 28px;
  min-width: 220px; display: flex; flex-direction: column; gap: 18px;
  flex-shrink: 0;
}
.jd-stat-row { display: flex; gap: 12px; align-items: center; }
.jd-stat-icon { font-size: 18px; flex-shrink: 0; }
.jd-stat-val { font-size: 15px; font-weight: 700; color: var(--text); line-height: 1.2; }
.jd-stat-key { font-size: 11px; color: var(--muted); font-weight: 500; margin-top: 1px; }

/* ── Discipline banner (trainer roles only) ── */
.jd-disc-banner {
  max-width: var(--max-w); margin: 0 auto;
  padding: 0 40px;
}
.jd-disc-banner-inner {
  background: linear-gradient(135deg, #f5fff0 0%, #f0fff8 100%);
  border: 1px solid var(--lime-glow);
  border-radius: var(--r-card);
  padding: 24px 28px;
  margin-top: 32px;
  display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
}
.jd-disc-icon { font-size: 36px; flex-shrink: 0; }
.jd-disc-info {}
.jd-disc-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 4px; }
.jd-disc-name { font-size: 17px; font-weight: 800; color: var(--text); margin-bottom: 2px; letter-spacing: -0.01em; }
.jd-disc-pay { font-size: 22px; font-weight: 800; color: var(--accent); }
.jd-disc-pay-label { font-size: 11px; color: var(--muted); font-weight: 500; margin-left: 6px; }
.jd-disc-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 10px; }
.jd-disc-tag {
  font-size: 11px; font-weight: 600; padding: 3px 10px;
  border-radius: var(--r-pill); background: rgba(255,255,255,0.8);
  border: 1px solid var(--lime-glow); color: var(--sub);
}

/* ── Body layout ── */
.jd-body {
  max-width: var(--max-w); margin: 0 auto;
  padding: 56px 40px 80px;
  display: grid; grid-template-columns: 1fr 300px; gap: 64px; align-items: start;
}
.jd-main {}

/* ── Sections ── */
.jd-section { margin-bottom: 52px; }
.jd-section:last-child { margin-bottom: 0; }
.jd-section-eyebrow {
  font-size: 11px; font-weight: 700; letter-spacing: 0.12em;
  text-transform: uppercase; color: var(--accent);
  margin-bottom: 18px; padding-bottom: 14px;
  border-bottom: 1px solid var(--border);
  display: flex; align-items: center; gap: 8px;
}
.jd-description {
  font-size: 15px; color: var(--sub); line-height: 1.8;
}
.jd-description p + p { margin-top: 14px; }

/* ── Lists ── */
.jd-list {
  list-style: none;
  display: flex; flex-direction: column; gap: 14px;
}
.jd-list li {
  display: flex; gap: 14px; align-items: flex-start;
  font-size: 14px; color: var(--sub); line-height: 1.65;
}
.jd-list li::before {
  content: "";
  width: 6px; height: 6px;
  border-radius: 50%; background: var(--accent);
  flex-shrink: 0; margin-top: 8px;
}
.jd-list.check li::before {
  content: "✓";
  width: auto; height: auto; border-radius: 0;
  background: none; color: var(--accent);
  font-weight: 800; font-size: 13px; margin-top: 1px;
}
.jd-list.optional li::before {
  content: "+";
  background: none; color: var(--border2);
  font-weight: 700; font-size: 15px; margin-top: 0;
}

/* ── Sidebar ── */
.jd-sidebar {}
.jd-sidebar-sticky { position: sticky; top: 24px; display: flex; flex-direction: column; gap: 16px; }

.jd-sidebar-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 24px;
}
.jd-sidebar-card-title {
  font-size: 11px; font-weight: 700; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--muted); margin-bottom: 18px;
}
.jd-sidebar-row {
  display: flex; align-items: flex-start; gap: 12px;
  margin-bottom: 16px;
}
.jd-sidebar-row:last-child { margin-bottom: 0; }
.jd-sidebar-row-icon { font-size: 18px; flex-shrink: 0; line-height: 1.3; }
.jd-sidebar-val { font-size: 14px; font-weight: 700; color: var(--text); line-height: 1.2; }
.jd-sidebar-key { font-size: 11px; color: var(--muted); font-weight: 500; margin-top: 2px; }

/* Apply CTA card */
.jd-apply-card {
  background: linear-gradient(135deg, #f0fff4, #edfff3);
  border: 1px solid var(--lime-glow);
  border-radius: var(--r-card); padding: 24px;
}
.jd-apply-card-title {
  font-size: 16px; font-weight: 800; color: var(--text);
  letter-spacing: -0.01em; margin-bottom: 8px;
}
.jd-apply-card-sub {
  font-size: 13px; color: var(--sub); line-height: 1.6; margin-bottom: 18px;
}
.btn-apply-full {
  display: flex; align-items: center; justify-content: space-between;
  width: 100%;
  font-family: var(--sans); font-size: 14px; font-weight: 700;
  cursor: pointer; border: none; border-radius: var(--r-pill);
  background: var(--accent); color: #fff;
  padding: 0 6px 0 20px; height: 46px;
  transition: opacity 0.2s; text-decoration: none;
}
.btn-apply-full:hover { opacity: 0.85; }
.btn-apply-full .ab {
  width: 34px; height: 34px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* ── Bottom CTA ── */
.jd-bottom-cta {
  background: linear-gradient(135deg, #f0fff4 0%, #f5f0ff 50%, #f0fff4 100%);
  border: 1px solid var(--border); border-radius: var(--r-card);
  padding: 40px;
  display: flex; align-items: center; justify-content: space-between;
  gap: 28px; flex-wrap: wrap; margin-top: 8px;
}
.jd-bottom-cta-left {}
.jd-bottom-cta-eyebrow {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.1em; color: var(--accent); margin-bottom: 8px;
}
.jd-bottom-cta-title {
  font-size: 22px; font-weight: 800; color: var(--text);
  letter-spacing: -0.02em; margin-bottom: 6px;
}
.jd-bottom-cta-sub { font-size: 14px; color: var(--sub); line-height: 1.6; max-width: 400px; }
.btn-cta-primary {
  display: inline-flex; align-items: center; gap: 0;
  font-family: var(--sans); font-size: 15px; font-weight: 700;
  cursor: pointer; border: none; border-radius: var(--r-pill);
  background: var(--text); color: #fff;
  padding: 0 6px 0 24px; height: 50px;
  transition: opacity 0.2s; text-decoration: none; white-space: nowrap;
  flex-shrink: 0;
}
.btn-cta-primary:hover { opacity: 0.82; }
.btn-cta-primary .ab {
  width: 38px; height: 38px; border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex; align-items: center; justify-content: center;
  margin-left: 10px;
}

/* ── Related roles ── */
.jd-related {
  background: var(--surface);
  border-top: 1px solid var(--border);
  padding: 64px 40px;
}
.jd-related-inner { max-width: var(--max-w); margin: 0 auto; }
.jd-related-header {
  display: flex; align-items: baseline; justify-content: space-between;
  margin-bottom: 28px; gap: 16px;
}
.jd-related-title {
  font-size: 22px; font-weight: 800; color: var(--text); letter-spacing: -0.02em;
}
.jd-related-all {
  font-size: 13px; font-weight: 600; color: var(--accent);
  text-decoration: none; white-space: nowrap;
  transition: opacity 0.15s;
}
.jd-related-all:hover { opacity: 0.7; }
.jd-related-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px;
}
.jd-related-card {
  background: #fff; border: 1px solid var(--border);
  border-radius: var(--r-card); padding: 22px 24px;
  cursor: pointer; transition: border-color 0.2s, transform 0.15s, box-shadow 0.2s;
  text-decoration: none; display: block;
}
.jd-related-card:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(61,187,0,0.1);
}
.jd-related-card-disc {
  font-size: 11px; font-weight: 700; text-transform: uppercase;
  letter-spacing: 0.07em; color: var(--muted); margin-bottom: 8px;
}
.jd-related-card-title {
  font-size: 14px; font-weight: 700; color: var(--text);
  line-height: 1.4; margin-bottom: 10px;
}
.jd-related-card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.jd-related-card-tag {
  font-size: 11px; font-weight: 600; padding: 3px 10px;
  border-radius: var(--r-pill);
}

/* ── Responsive ── */
@media (max-width: 920px) {
  .jd-hero-inner { grid-template-columns: 1fr; }
  .jd-hero-stats { flex-direction: row; flex-wrap: wrap; min-width: unset; gap: 20px; }
  .jd-body { grid-template-columns: 1fr; gap: 40px; }
  .jd-sidebar-sticky { position: static; }
  .jd-related-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .jd-hero { padding: 32px 20px 32px; }
  .jd-disc-banner { padding: 0 20px; }
  .jd-body { padding: 36px 20px 60px; }
  .jd-breadcrumb-bar-inner { padding: 0 20px; }
  .jd-related { padding: 48px 20px; }
  .jd-related-grid { grid-template-columns: 1fr; }
  .jd-bottom-cta { padding: 28px 24px; flex-direction: column; align-items: flex-start; }
  .jd-breadcrumb-current { display: none; }
}
`;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const tagClass = (tag) => {
  if (tag === "Remote") return "jd-tag tag-remote";
  if (tag === "Full-time" || tag === "Flexible") return "jd-tag tag-ft";
  if (tag.startsWith("$")) return "jd-tag tag-pay";
  return "jd-tag tag-level";
};

const relatedTagClass = (tag) => {
  if (tag === "Remote") return "jd-related-card-tag tag-remote";
  if (tag === "Full-time" || tag === "Flexible") return "jd-related-card-tag tag-ft";
  if (tag.startsWith("$")) return "jd-related-card-tag tag-pay";
  return "jd-related-card-tag tag-level";
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function JobDetailPage() {
  const { type, slug } = useParams();
  const navigate = useNavigate();

  const [job, setJob]           = useState(null);
  const [discInfo, setDiscInfo] = useState(null);
  const [related, setRelated]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  const isTrainer = type === "trainer";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });

    async function fetchJob() {
      setLoading(true);
      setNotFound(false);
      setJob(null);
      setDiscInfo(null);
      setRelated([]);

      try {
        if (!isTrainer) {
          const { data, error } = await supabase
            .from("inhouse_roles")
            .select("*, departments(name)")
            .eq("slug", slug)
            .single();

          if (error || !data) { setNotFound(true); return; }
          setJob({ ...data, dept: data.departments?.name ?? "Team" });

          const { data: rel } = await supabase
            .from("inhouse_roles")
            .select("id, title, slug, tags, salary_range, departments(name)")
            .eq("department_id", data.department_id)
            .neq("slug", slug)
            .limit(3);

          setRelated((rel || []).map(r => ({ ...r, dept: r.departments?.name ?? "" })));

        } else {
          const { data, error } = await supabase
            .from("trainer_roles")
            .select(`*, disciplines(id, title, icon, description, pay_range, pay_label, tags, featured)`)
            .eq("slug", slug)
            .single();

          if (error || !data) { setNotFound(true); return; }
          setJob(data);
          setDiscInfo(data.disciplines ?? null);

          const { data: rel } = await supabase
            .from("trainer_roles")
            .select("id, title, slug, tags, pay_range, level")
            .eq("discipline_id", data.discipline_id)
            .neq("slug", slug)
            .limit(3);

          setRelated(rel || []);
        }
      } catch (err) {
        console.error("JobDetailPage fetch error:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [type, slug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <style>{G}</style>
        <Navbar />
        <div className="jd-loading">
          <div className="jd-spinner" />
          <div className="jd-loading-text">Loading role…</div>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Not found ── */
  if (notFound || !job) {
    return (
      <>
        <style>{G}</style>
        <Navbar />
        <div className="jd-error">
          <div className="jd-error-code">404</div>
          <div className="jd-error-title">Role not found</div>
          <div className="jd-error-sub">
            This position may have been filled or the link may be incorrect.
          </div>
          <Link to="/careers" style={{ marginTop: 20 }}>
            <button style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "var(--sans)", fontSize: 14, fontWeight: 600,
              cursor: "pointer", border: "1px solid var(--border)",
              borderRadius: "var(--r-pill)", background: "#fff",
              color: "var(--sub)", padding: "10px 20px",
            }}>
              ← Back to all roles
            </button>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  /* ── Derived ── */
  const payDisplay   = isTrainer ? job.pay_range : job.salary_range;
  const applyPath    = "/sign-up";
  const relatedLabel = isTrainer
    ? `More ${discInfo?.title ?? ""} Roles`
    : `More ${job.dept ?? ""} Roles`;

  const stats = isTrainer
    ? [
        { icon: "💰", val: payDisplay,        key: "Task rate range"       },
        { icon: "🌐", val: "100% Remote",     key: "Work from anywhere"    },
        { icon: "📊", val: job.level,         key: "Experience level"      },
        { icon: "⏰", val: "Flexible hours",  key: "Set your own schedule" },
        { icon: "⚡", val: "24h",             key: "Payout turnaround"     },
      ]
    : [
        { icon: "💰", val: payDisplay,              key: "Annual salary"     },
        { icon: "🌐", val: "100% Remote",           key: "Work from anywhere" },
        { icon: "🏢", val: job.dept,                key: "Department"         },
        { icon: "📋", val: "Full-time",             key: "Employment type"    },
        { icon: "🩺", val: "Health, dental, vision", key: "Benefits"          },
      ];

  /* ── Render ── */
  return (
    <>
      <style>{G}</style>
      <Navbar />

      <div className="jd-page">

        {/* ── Breadcrumb bar — sits flush below the navbar, NOT sticky ── */}
        <div className="jd-breadcrumb-bar">
          <div className="jd-breadcrumb-bar-inner">
            <nav className="jd-breadcrumb">
              <Link to="/careers">Careers</Link>
              <span className="jd-breadcrumb-sep">›</span>

              {isTrainer ? (
                <>
                  <Link to="/careers">Trainers</Link>
                  {discInfo && (
                    <>
                      <span className="jd-breadcrumb-sep">›</span>
                      <span
                        style={{ color: "var(--sub)", cursor: "pointer", whiteSpace: "nowrap" }}
                        onClick={() => navigate("/careers")}
                      >
                        {discInfo.icon} {discInfo.title}
                      </span>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Link to="/careers">Team</Link>
                  {job.dept && (
                    <>
                      <span className="jd-breadcrumb-sep">›</span>
                      <span style={{ color: "var(--sub)", whiteSpace: "nowrap" }}>{job.dept}</span>
                    </>
                  )}
                </>
              )}

              <span className="jd-breadcrumb-sep">›</span>
              <span className="jd-breadcrumb-current">{job.title}</span>
            </nav>

            <Link to="/careers" className="jd-breadcrumb-back">
              ← All Roles
            </Link>
          </div>
        </div>

        {/* ── Hero ── */}
        <div className="jd-hero">
          <div className="jd-hero-inner">

            {/* Left */}
            <div className="jd-hero-left">
              <div className="jd-type-pill">
                {isTrainer ? "🎓 Trainer Opportunity" : "🏢 Team Position"}
              </div>
              <h1 className="jd-hero-title">{job.title}</h1>
              <div className="jd-hero-tags">
                {(job.tags ?? []).map(tag => (
                  <span key={tag} className={tagClass(tag)}>{tag}</span>
                ))}
              </div>
              {job.summary && (
                <p className="jd-hero-summary">{job.summary}</p>
              )}
            </div>

            {/* Right: stats */}
            <div className="jd-hero-stats">
              {stats.filter(s => s.val).map(s => (
                <div className="jd-stat-row" key={s.key}>
                  <span className="jd-stat-icon">{s.icon}</span>
                  <div>
                    <div className="jd-stat-val">{s.val}</div>
                    <div className="jd-stat-key">{s.key}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Discipline banner (trainer only) ── */}
        {isTrainer && discInfo && (
          <div className="jd-disc-banner">
            <div className="jd-disc-banner-inner">
              <div className="jd-disc-icon">{discInfo.icon}</div>
              <div className="jd-disc-info">
                <div className="jd-disc-label">Discipline</div>
                <div className="jd-disc-name">{discInfo.title}</div>
                <div>
                  <span className="jd-disc-pay">{discInfo.pay_range}</span>
                  <span className="jd-disc-pay-label">{discInfo.pay_label}</span>
                </div>
                {discInfo.tags?.length > 0 && (
                  <div className="jd-disc-tags">
                    {discInfo.tags.map(t => (
                      <span className="jd-disc-tag" key={t}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Body ── */}
        <div className="jd-body">

          {/* Main column */}
          <main className="jd-main">

            {job.description && (
              <section className="jd-section">
                <div className="jd-section-eyebrow">About the Role</div>
                <div className="jd-description">
                  {job.description.split("\n\n").map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            )}

            {job.responsibilities?.length > 0 && (
              <section className="jd-section">
                <div className="jd-section-eyebrow">What You'll Do</div>
                <ul className="jd-list">
                  {job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </section>
            )}

            {job.requirements?.length > 0 && (
              <section className="jd-section">
                <div className="jd-section-eyebrow">What We're Looking For</div>
                <ul className="jd-list check">
                  {job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </section>
            )}

            {job.nice_to_have?.length > 0 && (
              <section className="jd-section">
                <div className="jd-section-eyebrow">Nice to Have</div>
                <ul className="jd-list optional">
                  {job.nice_to_have.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </section>
            )}

            {/* Bottom CTA */}
            <div className="jd-bottom-cta">
              <div className="jd-bottom-cta-left">
                <div className="jd-bottom-cta-eyebrow">Ready to Apply?</div>
                <div className="jd-bottom-cta-title">
                  {isTrainer
                    ? "Join 18,400+ trainers earning from their expertise"
                    : "Join the Lixeen team"}
                </div>
                <div className="jd-bottom-cta-sub">
                  {isTrainer
                    ? "Free to join. No interview required. Start earning within 48 hours of passing your short skill assessment."
                    : "We review every application carefully. If your background is a strong fit, you'll hear from us within 7 business days."}
                </div>
              </div>
              <Link to={applyPath} className="btn-cta-primary">
                {isTrainer ? "Create Free Account" : "Submit Application"}
                <span className="ab"><Arrow size={16} color="#fff" /></span>
              </Link>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="jd-sidebar">
            <div className="jd-sidebar-sticky">

              {/* Apply card */}
              <div className="jd-apply-card">
                <div className="jd-apply-card-title">
                  {isTrainer ? "Start earning today" : "Apply for this role"}
                </div>
                <div className="jd-apply-card-sub">
                  {isTrainer
                    ? "Free to join. Pass a short skill check and start picking up tasks within 48 hours."
                    : "Send your application and we'll review it within 7 business days."}
                </div>
                <Link to={applyPath} className="btn-apply-full">
                  {isTrainer ? "Create Free Account" : "Apply Now"}
                  <span className="ab"><Arrow size={15} color="#fff" /></span>
                </Link>
              </div>

              {/* Role details */}
              <div className="jd-sidebar-card">
                <div className="jd-sidebar-card-title">Role Details</div>

                {payDisplay && (
                  <div className="jd-sidebar-row">
                    <span className="jd-sidebar-row-icon">💰</span>
                    <div>
                      <div className="jd-sidebar-val">{payDisplay}</div>
                      <div className="jd-sidebar-key">{isTrainer ? "Task rate range" : "Annual salary"}</div>
                    </div>
                  </div>
                )}

                <div className="jd-sidebar-row">
                  <span className="jd-sidebar-row-icon">🌐</span>
                  <div>
                    <div className="jd-sidebar-val">100% Remote</div>
                    <div className="jd-sidebar-key">Open globally</div>
                  </div>
                </div>

                {isTrainer && job.level && (
                  <div className="jd-sidebar-row">
                    <span className="jd-sidebar-row-icon">📊</span>
                    <div>
                      <div className="jd-sidebar-val">{job.level}</div>
                      <div className="jd-sidebar-key">Experience level</div>
                    </div>
                  </div>
                )}

                {!isTrainer && job.dept && (
                  <div className="jd-sidebar-row">
                    <span className="jd-sidebar-row-icon">🏢</span>
                    <div>
                      <div className="jd-sidebar-val">{job.dept}</div>
                      <div className="jd-sidebar-key">Department</div>
                    </div>
                  </div>
                )}

                <div className="jd-sidebar-row">
                  <span className="jd-sidebar-row-icon">{isTrainer ? "⏰" : "📋"}</span>
                  <div>
                    <div className="jd-sidebar-val">{isTrainer ? "Flexible" : "Full-time"}</div>
                    <div className="jd-sidebar-key">Schedule</div>
                  </div>
                </div>

                {isTrainer && (
                  <div className="jd-sidebar-row">
                    <span className="jd-sidebar-row-icon">⚡</span>
                    <div>
                      <div className="jd-sidebar-val">Within 24 hours</div>
                      <div className="jd-sidebar-key">Payout turnaround</div>
                    </div>
                  </div>
                )}

                {!isTrainer && (
                  <div className="jd-sidebar-row">
                    <span className="jd-sidebar-row-icon">🩺</span>
                    <div>
                      <div className="jd-sidebar-val">Health + dental + vision</div>
                      <div className="jd-sidebar-key">Benefits</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Discipline card (trainer only) */}
              {isTrainer && discInfo && (
                <div className="jd-sidebar-card" style={{
                  background: "linear-gradient(135deg, #f5fff0, #f0fff8)",
                  borderColor: "var(--lime-glow)",
                }}>
                  <div className="jd-sidebar-card-title">Discipline</div>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{discInfo.icon}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: "var(--text)", marginBottom: 4, letterSpacing: "-0.01em" }}>
                    {discInfo.title}
                  </div>
                  {discInfo.description && (
                    <div style={{ fontSize: 12, color: "var(--sub)", lineHeight: 1.6, marginBottom: 12 }}>
                      {discInfo.description}
                    </div>
                  )}
                  <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)" }}>
                    {discInfo.pay_range}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>
                    {discInfo.pay_label}
                  </div>
                  {discInfo.tags?.length > 0 && (
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {discInfo.tags.map(t => (
                        <span key={t} style={{
                          fontSize: 11, fontWeight: 600, padding: "3px 10px",
                          borderRadius: "var(--r-pill)", background: "rgba(255,255,255,0.8)",
                          border: "1px solid var(--lime-glow)", color: "var(--sub)",
                        }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Copy link */}
              <button
                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  gap: 8, width: "100%",
                  fontFamily: "var(--sans)", fontSize: 13, fontWeight: 600,
                  cursor: "pointer", border: "1px solid var(--border)",
                  borderRadius: "var(--r-pill)", background: "#fff",
                  color: "var(--sub)", padding: "10px 20px",
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)";  e.currentTarget.style.color = "var(--sub)"; }}
              >
                🔗 Copy link to role
              </button>

            </div>
          </aside>
        </div>

        {/* ── Related roles ── */}
        {related.length > 0 && (
          <div className="jd-related">
            <div className="jd-related-inner">
              <div className="jd-related-header">
                <div className="jd-related-title">{relatedLabel}</div>
                <Link to="/careers" className="jd-related-all">View all roles →</Link>
              </div>
              <div className="jd-related-grid">
                {related.map(r => (
                  <div
                    key={r.slug}
                    className="jd-related-card"
                    onClick={() => navigate(`/careers/${type}/${r.slug}`)}
                  >
                    {isTrainer ? (
                      <div className="jd-related-card-disc">
                        {discInfo?.icon} {discInfo?.title}
                      </div>
                    ) : r.dept && (
                      <div className="jd-related-card-disc">{r.dept}</div>
                    )}
                    <div className="jd-related-card-title">{r.title}</div>
                    <div className="jd-related-card-tags">
                      {(r.tags ?? []).slice(0, 3).map(tag => (
                        <span key={tag} className={relatedTagClass(tag)}>{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
    </>
  );
}