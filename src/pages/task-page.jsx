import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useAuth } from "./auth/AuthContext";

const G = `
@import url('https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@300;400;500;600;700;800&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg:#f5f5f5; --surface:#ffffff; --surface2:#f0f0f0;
  --border:#e0e0e0; --border2:#d0d0d0; --text:#000000; --sub:#333333; --muted:#666666;
  --sans:'Anek Devanagari',system-ui,sans-serif; --mono:'SF Mono','Fira Code',monospace;
  --r-pill:999px; --r-card:10px; --r-sm:6px; --topbar-h:52px;
  --green:#1a7a3f; --green-bg:#f0faf4; --red:#a02020; --red-bg:#fdf2f2;
}
html,body{height:100%;background:var(--bg);}
*{-webkit-font-smoothing:antialiased;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:var(--border2);border-radius:3px;}
.app{font-family:var(--sans);font-size:13.5px;color:var(--text);display:flex;flex-direction:column;height:100vh;overflow:hidden;}
.topbar{height:var(--topbar-h);background:var(--surface);border-bottom:1px solid var(--border2);display:flex;align-items:center;padding:0 20px;flex-shrink:0;position:relative;z-index:10;gap:10px;}
.topbar-left{display:flex;align-items:center;gap:10px;flex:1;min-width:0;}
.topbar-right{display:flex;align-items:center;gap:8px;flex-shrink:0;}
.back-btn{display:flex;align-items:center;gap:5px;font-size:12.5px;font-weight:600;color:var(--muted);cursor:pointer;background:none;border:none;font-family:var(--sans);padding:5px 7px;border-radius:var(--r-sm);transition:background 0.1s,color 0.1s;flex-shrink:0;}
.back-btn:hover{background:var(--surface2);color:var(--text);}
.topbar-divider{width:1px;height:18px;background:var(--border2);flex-shrink:0;}
.task-meta-title{font-size:13px;font-weight:600;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.task-meta-sub{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:6px;margin-top:1px;}
.timer-center{position:absolute;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:5px;pointer-events:none;}
.timer-digits{display:flex;align-items:baseline;gap:3px;font-family:var(--mono);font-size:14px;font-weight:600;letter-spacing:0.02em;color:var(--text);transition:color 0.4s;}
.timer-digits.warning{color:#8a6400;} .timer-digits.urgent{color:var(--red);}
.timer-slash{color:var(--border2);font-weight:300;font-size:13px;margin:0 2px;}
.timer-total{color:var(--muted);font-weight:400;font-size:12px;}
.timer-bar-wrap{width:64px;height:2px;background:var(--border);border-radius:2px;overflow:hidden;}
.timer-bar-fill{height:100%;background:var(--border2);border-radius:2px;transition:width 1s linear,background 0.4s;}
.timer-bar-fill.warning{background:#8a6400;} .timer-bar-fill.urgent{background:var(--red);}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:6px 13px;border-radius:var(--r-sm);font-family:var(--sans);font-size:12.5px;font-weight:600;cursor:pointer;border:none;transition:opacity 0.15s,background 0.1s;white-space:nowrap;}
.btn-primary{background:var(--text);color:white;} .btn-primary:hover{opacity:0.82;} .btn-primary:disabled{opacity:0.35;cursor:not-allowed;}
.btn-secondary{background:var(--surface);color:var(--sub);border:1.5px solid var(--border2);}
.btn-secondary:hover{background:var(--surface2);color:var(--text);border-color:#aaa;}
.btn-sm{padding:5px 11px;font-size:12px;}
.main{flex:1;display:flex;overflow:hidden;}
.left-panel{flex:1;display:flex;flex-direction:column;overflow:hidden;border-right:1px solid var(--border2);}
.section-header{display:flex;align-items:center;justify-content:space-between;padding:9px 18px;border-bottom:1px solid var(--border);background:var(--surface2);flex-shrink:0;}
.section-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);}
.section-hint{font-size:11px;color:var(--muted);font-style:italic;}
.prompt-section{border-bottom:1px solid var(--border2);background:var(--surface);flex-shrink:0;}
.prompt-body{padding:16px 20px;}
.prompt-text{font-size:14px;line-height:1.65;color:var(--text);}
.responses-section{flex:1;display:flex;flex-direction:column;overflow:hidden;}
.responses-grid{flex:1;display:grid;grid-template-columns:1fr 1fr;overflow:hidden;}
.response-col{display:flex;flex-direction:column;overflow:hidden;background:var(--surface);border-right:1px solid var(--border2);}
.response-col:last-child{border-right:none;}
.response-header{display:flex;align-items:center;padding:9px 16px;border-bottom:1px solid var(--border);background:var(--surface2);flex-shrink:0;}
.response-label{font-size:12px;font-weight:700;color:var(--text);display:flex;align-items:center;gap:7px;}
.response-badge{width:20px;height:20px;border-radius:50%;background:#1a1a1a;color:white;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center;}
.response-badge.b{background:#555;}
.response-body{flex:1;overflow-y:auto;padding:16px 18px;font-size:13.5px;line-height:1.75;color:var(--sub);}
.response-body p{margin-bottom:10px;} .response-body p:last-child{margin-bottom:0;}
.rubric-panel{width:348px;flex-shrink:0;display:flex;flex-direction:column;overflow:hidden;background:var(--surface);}
.rubric-header{padding:13px 18px 11px;border-bottom:1px solid var(--border2);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
.rubric-title{font-size:13px;font-weight:700;color:var(--text);}
.rubric-count{font-size:11px;font-family:var(--mono);color:var(--muted);}
.rubric-body{flex:1;overflow-y:auto;}
.rubric-item{padding:14px 18px;border-bottom:1px solid var(--border);}
.rubric-item:last-child{border-bottom:none;}
.rubric-q{font-size:12.5px;font-weight:700;color:var(--text);margin-bottom:3px;display:flex;align-items:flex-start;justify-content:space-between;gap:8px;}
.rubric-req{font-size:11px;color:var(--red);font-weight:500;flex-shrink:0;}
.rubric-desc{font-size:11.5px;color:var(--muted);margin-bottom:10px;line-height:1.45;}
.choice-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
.choice-btn{display:flex;align-items:center;gap:7px;padding:7px 10px;border:1.5px solid var(--border2);border-radius:var(--r-sm);font-family:var(--sans);font-size:12px;font-weight:500;color:var(--muted);background:var(--surface);cursor:pointer;transition:all 0.12s;user-select:none;white-space:nowrap;}
.choice-btn:hover{border-color:var(--border2);background:var(--surface2);color:var(--sub);}
.radio-dot{width:13px;height:13px;border-radius:50%;border:1.5px solid var(--border2);flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:all 0.12s;background:transparent;}
.radio-dot-inner{width:6px;height:6px;border-radius:50%;background:transparent;transition:background 0.12s;}
.choice-btn.sel-a{border-color:var(--text);background:var(--text);color:white;}
.choice-btn.sel-a .radio-dot{border-color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.15);}
.choice-btn.sel-a .radio-dot-inner{background:white;}
.choice-btn.sel-b{border-color:#444;background:#444;color:white;}
.choice-btn.sel-b .radio-dot{border-color:rgba(255,255,255,0.5);background:rgba(255,255,255,0.15);}
.choice-btn.sel-b .radio-dot-inner{background:white;}
.choice-btn.sel-good{border-color:var(--green);background:var(--green-bg);color:var(--green);}
.choice-btn.sel-good .radio-dot{border-color:var(--green);}
.choice-btn.sel-good .radio-dot-inner{background:var(--green);}
.choice-btn.sel-bad{border-color:var(--red);background:var(--red-bg);color:var(--red);}
.choice-btn.sel-bad .radio-dot{border-color:var(--red);}
.choice-btn.sel-bad .radio-dot-inner{background:var(--red);}
.comment-area{width:100%;padding:9px 11px;min-height:80px;border:1.5px solid var(--border2);border-radius:var(--r-sm);font-family:var(--sans);font-size:13px;color:var(--text);background:var(--surface);outline:none;resize:none;line-height:1.55;transition:border-color 0.15s;}
.comment-area:focus{border-color:#aaa;}
.comment-area::placeholder{color:var(--muted);}
.char-count{font-size:11px;font-family:var(--mono);color:var(--muted);text-align:right;margin-top:4px;}
.rubric-footer{padding:13px 18px;border-top:1px solid var(--border2);flex-shrink:0;display:flex;flex-direction:column;gap:9px;}
.progress-row{display:flex;align-items:center;justify-content:space-between;}
.progress-dots{display:flex;gap:4px;align-items:center;}
.pdot{width:6px;height:6px;border-radius:50%;background:var(--border2);transition:background 0.2s;}
.pdot.done{background:var(--text);} .pdot.missing{background:#e0b8b8;}
.pct-label{font-size:11px;color:var(--muted);font-family:var(--mono);}
.submit-row{display:flex;gap:8px;}
.validation-msg{font-size:11.5px;color:var(--red);display:flex;align-items:center;gap:5px;}
.submitted-overlay{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:40px 28px;text-align:center;}
.check-circle{width:50px;height:50px;border-radius:50%;background:var(--green-bg);border:1px solid #b8e0c8;display:flex;align-items:center;justify-content:center;}
.submitted-title{font-size:17px;font-weight:700;letter-spacing:-0.3px;}
.submitted-sub{font-size:13px;color:var(--muted);line-height:1.6;max-width:220px;}
.state-overlay{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:40px 28px;text-align:center;color:var(--muted);}
.state-title{font-size:15px;font-weight:700;color:var(--text);}
.state-sub{font-size:13px;color:var(--muted);line-height:1.6;max-width:220px;}
.spinner{width:28px;height:28px;border:2.5px solid var(--border2);border-top-color:var(--text);border-radius:50%;animation:spin 0.75s linear infinite;}
@keyframes spin{to{transform:rotate(360deg);}}
`;

const I = ({ n, s = 14, c = "currentColor" }) => {
  const p = {
    chevL: <polyline points="15 18 9 12 15 6" />,
    check: <polyline points="20 6 9 17 4 12" />,
    flag:  <><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" /></>,
    tag:   <><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    skip:  <><polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" /></>,
  };
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      {p[n]}
    </svg>
  );
};

const TOTAL_SECS = 3600;
function pad(n) { return String(n).padStart(2, "0"); }

function useTimer(taskId) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    setElapsed(0);
    const id = setInterval(() => setElapsed(e => e < TOTAL_SECS ? e + 1 : e), 1000);
    return () => clearInterval(id);
  }, [taskId]);
  const h = Math.floor(elapsed / 3600);
  const m = Math.floor((elapsed % 3600) / 60);
  const s = elapsed % 60;
  const display = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  const fillPct = (elapsed / TOTAL_SECS) * 100;
  const urgency = elapsed >= 3000 ? "urgent" : elapsed >= 2700 ? "warning" : "";
  return { display, fillPct, urgency, elapsed };
}

const RUBRIC = [
  { id: "overall",     question: "Overall Preference",    desc: "Which response do you prefer overall?",                        required: true },
  { id: "instruction", question: "Instruction Following", desc: "Which response better follows the given instructions?",         required: true },
  { id: "accuracy",    question: "Accuracy",              desc: "Which response contains more accurate and correct information?", required: true },
  { id: "clarity",     question: "Clarity",               desc: "Which response is clearer and easier to understand?",           required: true },
  { id: "depth",       question: "Depth & Detail",        desc: "Which response provides more useful depth on the topic?",       required: true },
  { id: "examples",    question: "Quality of Examples",   desc: "Which response uses better, more illustrative examples?",       required: true },
];

const OPTS = [
  { value: "a",    label: "Response A", cls: "sel-a" },
  { value: "b",    label: "Response B", cls: "sel-b" },
  { value: "good", label: "Both Good",  cls: "sel-good" },
  { value: "bad",  label: "Both Bad",   cls: "sel-bad" },
];

function ChoiceGroup({ value, onChange }) {
  return (
    <div className="choice-grid">
      {OPTS.map(opt => {
        const sel = value === opt.value;
        return (
          <button
            key={opt.value}
            className={`choice-btn${sel ? ` ${opt.cls}` : ""}`}
            onClick={() => onChange(sel ? null : opt.value)}
          >
            <span className="radio-dot"><span className="radio-dot-inner" /></span>
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function TextEvalTask() {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  // ── Project context passed from ProjectInstructions via router state ───────
  const projectTask = location.state?.task ?? null;

  // Which table to read tasks from — driven by the project's `table` field.
  // Each project table (tasks_dialogue_preference, tasks_hallucination_detection,
  // etc.) is queried directly. Completion is tracked in user_responses using
  // source_task_id (the row id in the project table) + task_table (the table name).
  // task_id is set to null to avoid the FK constraint on writingtasks.
  const taskTable = projectTask?.table ?? "writingtasks";

  // ── State ──────────────────────────────────────────────────────────────────
  const [task,       setTask]       = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [allDone,    setAllDone]    = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ratings,    setRatings]    = useState({});
  const [comment,    setComment]    = useState("");
  const [submitted,  setSubmitted]  = useState(false);
  const [showVal,    setShowVal]    = useState(false);

  const { display, fillPct, urgency, elapsed } = useTimer(task?.id);

  // ── Fetch next unattempted task from the project-specific table ────────────
  const fetchTask = async () => {
    if (!user?.id) return;
    setLoading(true);
    setRatings({});
    setComment("");
    setSubmitted(false);
    setShowVal(false);

    // IDs already answered or skipped in this project table by this user.
    // source_task_id stores the actual row id from the project table.
    const { data: done, error: doneErr } = await supabase
      .from("user_responses")
      .select("source_task_id")
      .eq("user_id", user.id)
      .eq("task_table", taskTable);

    if (doneErr) {
      console.error("Error fetching completed tasks:", doneErr.message);
      setLoading(false);
      return;
    }

    const doneIds = (done ?? []).map(r => r.source_task_id).filter(Boolean);

    // Fetch the next unanswered task directly from the project table.
    let query = supabase.from(taskTable).select("*");
    if (doneIds.length > 0) {
      // UUIDs must be quoted inside the PostgREST IN filter
      query = query.not("id", "in", `(${doneIds.map(id => `"${id}"`).join(",")})`);
    }
    const { data, error } = await query.limit(1).single();

    if (error || !data) {
      setAllDone(true);
      setTask(null);
    } else {
      setTask(data);
      setAllDone(false);
    }
    setLoading(false);
  };

  useEffect(() => { if (user?.id) fetchTask(); }, [user?.id, taskTable]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const reqIds      = RUBRIC.filter(r => r.required).map(r => r.id);
  const answered    = reqIds.filter(id => ratings[id]);
  const reqComplete = answered.length === reqIds.length;
  const hasNote     = comment.trim().length > 0;
  const canSub      = reqComplete && hasNote;
  const doneCt      = Object.values(ratings).filter(Boolean).length;
  const compPct     = Math.round(((doneCt + (hasNote ? 1 : 0)) / (RUBRIC.length + 1)) * 100);

  const setRating = (id, val) => {
    setRatings(prev => ({ ...prev, [id]: val }));
    if (showVal) setShowVal(false);
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  // task_id is intentionally omitted (null) to avoid the FK → writingtasks.
  // source_task_id + task_table together identify the exact row in the project table.
  const handleSubmit = async () => {
    if (!canSub) { setShowVal(true); return; }
    setSubmitting(true);

    const { error } = await supabase.from("user_responses").insert({
      user_id:          user.id,
      task_id:          null,            // null — FK constraint bypassed
      source_task_id:   task.id,         // actual id from the project table
      task_table:       taskTable,       // which project table this came from
      response:         ratings.overall,
      ratings,
      comment:          comment.trim(),
      skipped:          false,
      time_spent_secs:  elapsed,         // seconds from task load to submit
    });

    if (error) {
      console.error("Submit error:", error.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  // ── Skip ───────────────────────────────────────────────────────────────────
  const handleSkip = async () => {
    if (!task) return;
    await supabase.from("user_responses").insert({
      user_id:          user.id,
      task_id:          null,
      source_task_id:   task.id,
      task_table:       taskTable,
      skipped:          true,
      response:         "skipped",
      ratings:          {},
      comment:          "",
      time_spent_secs:  0,   // skipped — no pay
    });
    fetchTask();
  };

  const handleNext = () => fetchTask();

  // ── Navigation ─────────────────────────────────────────────────────────────
  const handleBack = () => {
    if (projectTask) {
      navigate("/project-instructions", { state: { task: projectTask } });
    } else {
      navigate("/dashboard#tasks/inprogress");
    }
  };

  const handleBackToDashboard = () => navigate("/dashboard#tasks/completed");

  // ── Display values ─────────────────────────────────────────────────────────
  const taskTitle = projectTask?.title           ?? task?.title    ?? "Text Evaluation";
  const taskType  = projectTask?.tags?.[0]       ?? task?.type     ?? "Text Eval";
  const prompt    = task?.prompt                 ?? "";
  const respA     = task?.response_a             ?? "";
  const respB     = task?.response_b             ?? "";

  return (
    <>
      <style>{G}</style>
      <div className="app">

        <header className="topbar">
          <div className="topbar-left">
            <button className="back-btn" onClick={handleBack}>
              <I n="chevL" s={13} /> Back to Brief
            </button>
            <div className="topbar-divider" />
            <div>
              <div className="task-meta-title">{taskTitle}</div>
              <div className="task-meta-sub">
                <span style={{ display:"flex", alignItems:"center", gap:3 }}>
                  <I n="tag" s={10} /> {taskType}
                </span>
                <span style={{ color:"var(--border2)" }}>·</span>
                <span style={{ fontFamily:"var(--mono)" }}>$25/hr</span>
              </div>
            </div>
          </div>

          {task && (
            <div className="timer-center">
              <div className={`timer-digits${urgency ? ` ${urgency}` : ""}`}>
                <span>{display}</span>
                <span className="timer-slash">/</span>
                <span className="timer-total">1:00:00</span>
              </div>
              <div className="timer-bar-wrap">
                <div className={`timer-bar-fill${urgency ? ` ${urgency}` : ""}`} style={{ width:`${fillPct}%` }} />
              </div>
            </div>
          )}

          <div className="topbar-right">
            {task && !submitted && (
              <button className="btn btn-secondary btn-sm" onClick={handleSkip}>
                <I n="skip" s={12} /> Skip
              </button>
            )}
          </div>
        </header>

        <div className="main">

          {loading && (
            <div className="state-overlay" style={{ width:"100%" }}>
              <div className="spinner" />
              <div className="state-sub">Loading next task…</div>
            </div>
          )}

          {!loading && allDone && (
            <div className="state-overlay" style={{ width:"100%" }}>
              <div className="check-circle">
                <I n="check" s={22} c="var(--green)" />
              </div>
              <div className="state-title">All tasks completed!</div>
              <div className="state-sub">
                You've finished every available task for <strong>{taskTitle}</strong>. Check back soon for more.
              </div>
              <button className="btn btn-primary" style={{ marginTop:8 }} onClick={handleBackToDashboard}>
                Back to Dashboard
              </button>
            </div>
          )}

          {!loading && task && (
            <>
              <div className="left-panel">
                <div className="prompt-section">
                  <div className="section-header">
                    <span className="section-title">Prompt</span>
                  </div>
                  <div className="prompt-body">
                    <div className="prompt-text">{prompt}</div>
                  </div>
                </div>

                <div className="responses-section">
                  <div className="section-header">
                    <span className="section-title">Responses</span>
                    <span className="section-hint">Evaluate both before rating</span>
                  </div>
                  <div className="responses-grid">
                    <div className="response-col">
                      <div className="response-header">
                        <div className="response-label">
                          <span className="response-badge">A</span>Response A
                        </div>
                      </div>
                      <div className="response-body">
                        {respA.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                    </div>
                    <div className="response-col">
                      <div className="response-header">
                        <div className="response-label">
                          <span className="response-badge b">B</span>Response B
                        </div>
                      </div>
                      <div className="response-body">
                        {respB.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rubric-panel">
                <div className="rubric-header">
                  <span className="rubric-title">Rate the Responses</span>
                  <span className="rubric-count">{answered.length}/{reqIds.length} answered</span>
                </div>

                {submitted ? (
                  <div className="submitted-overlay">
                    <div className="check-circle">
                      <I n="check" s={22} c="var(--green)" />
                    </div>
                    <div className="submitted-title">Submitted!</div>
                    <div className="submitted-sub">Your rating has been recorded. Ready for the next one?</div>
                    <button className="btn btn-primary" style={{ marginTop:8 }} onClick={handleNext}>
                      Next Task →
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="rubric-body">
                      {RUBRIC.map(item => (
                        <div className="rubric-item" key={item.id}>
                          <div className="rubric-q">
                            <span>{item.question}</span>
                            {item.required && <span className="rubric-req">*</span>}
                          </div>
                          <div className="rubric-desc">{item.desc}</div>
                          <ChoiceGroup
                            value={ratings[item.id] || null}
                            onChange={val => setRating(item.id, val)}
                          />
                        </div>
                      ))}

                      <div className="rubric-item">
                        <div className="rubric-q">
                          <span>Choice Comment</span>
                          <span className="rubric-req">*</span>
                        </div>
                        <div className="rubric-desc">Briefly explain your overall preference and any notable differences observed.</div>
                        <textarea
                          className="comment-area"
                          placeholder="e.g. Response B provides a more concrete and relatable example with actual figures, making the concept easier to grasp…"
                          value={comment}
                          onChange={e => setComment(e.target.value)}
                        />
                        <div className="char-count">{comment.length} chars</div>
                      </div>
                    </div>

                    <div className="rubric-footer">
                      {showVal && !canSub && (
                        <div className="validation-msg">
                          <I n="alert" s={13} c="var(--red)" />
                          {!reqComplete
                            ? `${reqIds.length - answered.length} required field${reqIds.length - answered.length > 1 ? "s" : ""} missing`
                            : "Please add a comment before submitting"}
                        </div>
                      )}
                      <div className="progress-row">
                        <div className="progress-dots">
                          {RUBRIC.map(item => (
                            <div
                              key={item.id}
                              className={`pdot${ratings[item.id] ? " done" : showVal && item.required ? " missing" : ""}`}
                            />
                          ))}
                          <div className={`pdot${hasNote ? " done" : showVal ? " missing" : ""}`} />
                        </div>
                        <span className="pct-label">{compPct}% complete</span>
                      </div>
                      <div className="submit-row">
                        <button
                          className="btn btn-primary"
                          style={{ flex:1, justifyContent:"center" }}
                          onClick={handleSubmit}
                          disabled={submitting}
                        >
                          {submitting ? "Saving…" : "Submit Rating"}
                        </button>
                        <button className="btn btn-secondary btn-sm">
                          <I n="flag" s={12} /> Flag
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}