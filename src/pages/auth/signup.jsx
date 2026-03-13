import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import NavLogo from "../../components/NavLogo";
import { supabase } from "../../lib/supabase";

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT: Replace with your actual reCAPTCHA v2 site key from:
// https://www.google.com/recaptcha/admin  → choose "I'm not a robot" checkbox
// ─────────────────────────────────────────────────────────────────────────────
const RECAPTCHA_SITE_KEY = "YOUR_RECAPTCHA_V2_SITE_KEY";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming", "District of Columbia",
];

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
html,body{height:100%;}
body{font-family:var(--sans);color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden;min-height:100vh;display:flex;flex-direction:column;}
::-webkit-scrollbar{width:4px;} ::-webkit-scrollbar-track{background:transparent;} ::-webkit-scrollbar-thumb{background:#ddd;border-radius:4px;}

.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 68px; display: flex; align-items: center; padding: 0 40px;
  background: rgba(255,255,255,0.96); backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border); box-shadow: 0 1px 0 var(--border);
}
.nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; flex-shrink: 0; cursor: pointer; }
.nav-logo-mark { width: 34px; height: 34px; background: #c8f026; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nav-logo-name { font-size: 20px; font-weight: 800; color: var(--text); letter-spacing: -0.5px; }
.nav-right { display: flex; align-items: center; gap: 10px; margin-left: auto; }
.nav-text-link { font-size: 14px; font-weight: 500; color: var(--sub); cursor: pointer; transition: color 0.15s; padding: 8px 4px; }
.nav-text-link:hover { color: var(--text); }
.nav-text-link span { color: var(--lime); font-weight: 600; }


.auth-root{min-height:100vh;display:grid;grid-template-columns:1fr 1fr;padding-top:68px;}

.auth-left{background:var(--surface);border-right:1px solid var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 72px;position:relative;overflow:hidden;}
.auth-left-orb{position:absolute;bottom:-20%;right:-15%;width:600px;height:400px;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(124,92,252,0.09) 0%,rgba(61,187,0,0.06) 45%,transparent 70%);pointer-events:none;filter:blur(2px);}
.auth-left-orb2{position:absolute;top:-5%;left:-10%;width:400px;height:300px;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(61,187,0,0.06) 0%,transparent 65%);pointer-events:none;}
.auth-left-content{position:relative;z-index:1;width:100%;max-width:420px;}

.auth-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--lime);background:var(--lime-dim);border:1px solid var(--lime-glow);border-radius:var(--r-pill);padding:5px 14px;margin-bottom:28px;}
.auth-eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--lime);animation:pulse 2s infinite;}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1);}50%{opacity:0.5;transform:scale(0.8);}}
.auth-h1{font-size:clamp(28px,3vw,42px);font-weight:800;color:var(--text);letter-spacing:-0.03em;line-height:1.1;margin-bottom:14px;}
.auth-h1 span{color:var(--lime);}
.auth-sub{font-size:15px;color:var(--sub);line-height:1.65;margin-bottom:40px;}
.auth-steps{display:flex;flex-direction:column;gap:0;margin-bottom:40px;border:1px solid var(--border);border-radius:var(--r-card);overflow:hidden;}
.auth-step{display:flex;align-items:flex-start;gap:16px;padding:20px 22px;background:#fff;border-bottom:1px solid var(--border);transition:background 0.15s;}
.auth-step:last-child{border-bottom:none;}
.auth-step:hover{background:var(--surface);}
.auth-step-num{width:26px;height:26px;border-radius:50%;flex-shrink:0;background:var(--lime-dim);border:1px solid var(--lime-glow);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:var(--lime);margin-top:1px;}
.auth-step-title{font-size:14px;font-weight:700;color:var(--text);margin-bottom:3px;}
.auth-step-desc{font-size:13px;color:var(--muted);line-height:1.55;}
.auth-trust{display:flex;align-items:center;gap:12px;background:#fff;border:1px solid var(--border);border-radius:var(--r-card);padding:14px 20px;}
.auth-trust-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);white-space:nowrap;flex-shrink:0;}
.auth-trust-line{width:1px;height:20px;background:var(--border2);flex-shrink:0;}
.auth-trust-logos{display:flex;gap:14px;flex-wrap:wrap;}
.auth-trust-logo{font-size:12px;font-weight:700;color:var(--sub);}

.auth-right{background:var(--bg);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 72px;}
.auth-form-wrap{width:100%;max-width:420px;}
.auth-form-title{font-size:26px;font-weight:800;color:var(--text);letter-spacing:-0.03em;margin-bottom:6px;}
.auth-form-sub{font-size:14px;color:var(--sub);margin-bottom:32px;}
.auth-form-sub a{color:var(--lime);cursor:pointer;text-decoration:none;font-weight:600;}
.auth-form-sub a:hover{text-decoration:underline;}

.field{margin-bottom:14px;}
.field-row-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:14px;}
.field-label{display:block;font-size:12px;font-weight:600;color:var(--sub);margin-bottom:7px;text-transform:uppercase;letter-spacing:0.06em;}
.field-input{display:block;width:100%;height:48px;background:var(--surface);border:1.5px solid var(--border2);border-radius:var(--r-sm);color:var(--text);font-family:var(--sans);font-size:14px;padding:0 16px;outline:none;transition:border-color 0.2s,box-shadow 0.2s;}
.field-input::placeholder{color:var(--muted);}
.field-input:focus{border-color:rgba(61,187,0,0.4);box-shadow:0 0 0 3px rgba(61,187,0,0.07);}
.field-input.has-error{border-color:rgba(239,68,68,0.5);}
.field-input.has-error:focus{box-shadow:0 0 0 3px rgba(239,68,68,0.07);}
.field-select{display:block;width:100%;height:48px;background:var(--surface);border:1.5px solid var(--border2);border-radius:var(--r-sm);color:var(--text);font-family:var(--sans);font-size:14px;padding:0 40px 0 16px;outline:none;cursor:pointer;transition:border-color 0.2s,box-shadow 0.2s;appearance:none;-webkit-appearance:none;}
.field-select:focus{border-color:rgba(61,187,0,0.4);box-shadow:0 0 0 3px rgba(61,187,0,0.07);}
.field-select.has-error{border-color:rgba(239,68,68,0.5);}
.field-select.is-placeholder{color:var(--muted);}
.field-pw{position:relative;}
.field-pw .field-input{padding-right:48px;}
.field-pw-toggle{position:absolute;right:14px;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;color:var(--muted);display:flex;align-items:center;padding:0;transition:color 0.15s;}
.field-pw-toggle:hover{color:var(--sub);}
.pw-strength{margin-top:8px;}
.pw-strength-bars{display:flex;gap:4px;margin-bottom:4px;}
.pw-bar{flex:1;height:3px;border-radius:2px;background:var(--border2);transition:background 0.3s;}
.pw-bar.weak{background:#ef4444;} .pw-bar.fair{background:#f97316;} .pw-bar.good{background:#eab308;} .pw-bar.strong{background:var(--lime);}
.pw-strength-label{font-size:11px;color:var(--muted);}
.field-error{font-size:12px;color:#dc2626;margin-top:5px;}

/* ── CAPTCHA ── */
.captcha-wrap{
  margin:16px 0 6px;
  padding:14px 16px;
  background:var(--surface);
  border:1.5px solid var(--border2);
  border-radius:var(--r-card);
  display:flex;
  flex-direction:column;
  gap:10px;
}
.captcha-wrap.captcha-error-border{border-color:rgba(239,68,68,0.5);}
.captcha-label{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:var(--sub);margin-bottom:2px;}
.captcha-note{font-size:11px;color:var(--muted);display:flex;align-items:center;gap:5px;margin-top:4px;}
.captcha-err-msg{font-size:12px;color:#dc2626;display:flex;align-items:center;gap:5px;}
@media(max-width:480px){
  .captcha-wrap .g-recaptcha{transform:scale(0.88);transform-origin:0 0;}
}

.btn-submit{display:flex;align-items:center;justify-content:center;gap:0;width:100%;height:52px;border-radius:var(--r-pill);background:var(--text);border:none;color:#fff;font-family:var(--sans);font-size:15px;font-weight:700;cursor:pointer;transition:opacity 0.2s;margin-top:8px;padding:0 8px 0 24px;}
.btn-submit:hover{opacity:0.85;}
.btn-submit:disabled{opacity:0.45;cursor:not-allowed;}
.btn-submit-arrow{width:34px;height:34px;border-radius:50%;background:var(--purple);display:flex;align-items:center;justify-content:center;margin-left:auto;flex-shrink:0;}

.auth-terms{font-size:12px;color:var(--muted);text-align:center;margin-top:16px;line-height:1.6;}
.auth-terms a{color:var(--sub);cursor:pointer;transition:color 0.15s;}
.auth-terms a:hover{color:var(--text);}

.success-wrap{text-align:center;}
.success-icon-ring{width:80px;height:80px;border-radius:50%;background:var(--lime-dim);border:2px solid var(--lime-glow);display:flex;align-items:center;justify-content:center;margin:0 auto 24px;font-size:36px;animation:popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both;}
@keyframes popIn{from{opacity:0;transform:scale(0.5);}to{opacity:1;transform:scale(1);}}
.success-title{font-size:24px;font-weight:800;color:var(--text);letter-spacing:-0.03em;margin-bottom:10px;}
.success-email-chip{display:inline-flex;align-items:center;gap:8px;background:var(--surface);border:1px solid var(--border2);border-radius:var(--r-pill);padding:6px 14px;font-size:13px;font-weight:600;color:var(--text);margin-bottom:20px;}
.success-desc{font-size:14px;color:var(--sub);line-height:1.7;margin-bottom:28px;}
.success-tips{background:var(--surface);border:1px solid var(--border);border-radius:var(--r-card);padding:18px 20px;text-align:left;margin-bottom:24px;}
.success-tips-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:var(--muted);margin-bottom:12px;}
.success-tip{display:flex;align-items:flex-start;gap:10px;font-size:13px;color:var(--sub);line-height:1.55;margin-bottom:10px;}
.success-tip:last-child{margin-bottom:0;}
.success-tip-dot{width:5px;height:5px;border-radius:50%;background:var(--lime);flex-shrink:0;margin-top:6px;}
.btn-resend{width:100%;height:48px;border-radius:var(--r-pill);border:1.5px solid var(--border2);background:transparent;font-family:var(--sans);font-size:14px;font-weight:600;color:var(--sub);cursor:pointer;transition:border-color 0.15s,color 0.15s;}
.btn-resend:hover:not(:disabled){border-color:var(--text);color:var(--text);}
.btn-resend:disabled{opacity:0.45;cursor:not-allowed;}
.resend-msg{font-size:12px;color:var(--lime);margin-top:10px;font-weight:600;}

@media(max-width:900px){
  .auth-root{grid-template-columns:1fr;}
  .auth-left{display:none;}
  .auth-right{padding:40px 28px;min-height:calc(100vh - 68px);}
  .nav{padding:0 20px;}
  .field-row-2{grid-template-columns:1fr;}
}
`;

// ── SVG helpers ───────────────────────────────────────────────────────────────
const Arrow = ({ size = 16, color = "#fff" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);
const EyeIcon = ({ open }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    {open
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>}
  </svg>
);

function getPasswordStrength(pw) {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_CLASSES = ["", "weak", "fair", "good", "strong"];

// ── reCAPTCHA hook ─────────────────────────────────────────────────────────────
// Dynamically injects the reCAPTCHA v2 script once per page load, then renders
// the checkbox widget into the provided containerRef.
function useRecaptcha(containerRef, siteKey) {
  const widgetIdRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const render = () => {
      if (!containerRef.current || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        size: "normal",
      });
      setReady(true);
    };

    if (window.grecaptcha?.render) {
      window.grecaptcha.ready(render);
    } else {
      // Only inject the script tag once across remounts
      if (!document.getElementById("recaptcha-script")) {
        const script = document.createElement("script");
        script.id = "recaptcha-script";
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit&hl=en";
        script.async = true;
        script.defer = true;
        script.onload = () => window.grecaptcha.ready(render);
        document.head.appendChild(script);
      } else {
        // Script exists but may still be loading — poll
        const poll = setInterval(() => {
          if (window.grecaptcha?.render) {
            clearInterval(poll);
            window.grecaptcha.ready(render);
          }
        }, 100);
        return () => clearInterval(poll);
      }
    }
  }, [containerRef, siteKey]);

  const getToken = useCallback(() => {
    if (widgetIdRef.current === null || !window.grecaptcha) return null;
    return window.grecaptcha.getResponse(widgetIdRef.current) || null;
  }, []);

  const reset = useCallback(() => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      window.grecaptcha.reset(widgetIdRef.current);
    }
  }, []);

  return { ready, getToken, reset };
}

// ── Success Screen ─────────────────────────────────────────────────────────────
function SuccessScreen({ email }) {
  const navigate = useNavigate();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const timerRef = useRef(null);

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    setResending(true);
    await supabase.auth.resend({ type: "signup", email });
    setResending(false); setResent(true); setCooldown(60);
    timerRef.current = setInterval(() => {
      setCooldown(c => { if (c <= 1) { clearInterval(timerRef.current); return 0; } return c - 1; });
    }, 1000);
  };

  return (
    <div className="success-wrap">
      <div className="success-icon-ring">✉️</div>
      <div className="success-title">Check your inbox</div>
      <div className="success-email-chip">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
        </svg>
        {email}
      </div>
      <p className="success-desc">We've sent a confirmation link to your email. Click it to verify your account and get started.</p>
      <div className="success-tips">
        <div className="success-tips-title">Didn't get it?</div>
        <div className="success-tip"><span className="success-tip-dot" />Check your <strong>spam or junk folder</strong>.</div>
        <div className="success-tip"><span className="success-tip-dot" />Make sure <strong>{email}</strong> is correct.</div>
        <div className="success-tip"><span className="success-tip-dot" />Allow a minute or two for delivery.</div>
      </div>
      <button className="btn-resend" onClick={handleResend} disabled={resending || cooldown > 0}>
        {resending ? "Resending…" : cooldown > 0 ? `Resend in ${cooldown}s` : "Resend confirmation email"}
      </button>
      {resent && cooldown > 0 && <div className="resend-msg">✓ Email resent — check your inbox</div>}
      <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 20, lineHeight: 1.6 }}>
        Wrong email?{" "}
        <span onClick={() => navigate("/sign-up")} style={{ color: "var(--lime)", fontWeight: 600, cursor: "pointer" }}>Start over</span>
      </p>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function SignUp() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", state: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [signUpError, setSignUpError] = useState("");
  const [success, setSuccess] = useState(false);
  const submittedRef = useRef(false);
  const navigate = useNavigate();

  // reCAPTCHA
  const captchaContainerRef = useRef(null);
  const { getToken, reset: resetCaptcha } = useRecaptcha(captchaContainerRef, RECAPTCHA_SITE_KEY);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: null }));
    setSignUpError("");
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Required";
    if (!form.lastName.trim()) e.lastName = "Required";
    if (!form.email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.state) e.state = "Please select your state";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8) e.password = "Must be at least 8 characters";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    // ── CAPTCHA CHECK ──
    const captchaToken = getToken();
    if (!captchaToken) {
      setErrors(prev => ({ ...prev, captcha: "Please complete the CAPTCHA to continue." }));
      return;
    }

    if (submittedRef.current) return;
    submittedRef.current = true;
    setLoading(true);
    setSignUpError("");

    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin + "/dashboard",
        data: {
          first_name: form.firstName,
          last_name: form.lastName,
          full_name: `${form.firstName} ${form.lastName}`,
          state: form.state,
        },
      },
    });

    setLoading(false);

    if (error) {
      submittedRef.current = false;
      setSignUpError(error.message);
      resetCaptcha(); // let them try again
      return;
    }

    setSuccess(true);
  };

  const pwStrength = getPasswordStrength(form.password);

  return (
    <>
      <style>{G}</style>
      <nav className="nav">
        <NavLogo />
        <div className="nav-right">
          <span className="nav-text-link">
            Already have an account? <span onClick={() => navigate("/login")}>Sign in</span>
          </span>
        </div>
      </nav>

      <div className="auth-root">
        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-left-orb" /><div className="auth-left-orb2" />
          <div className="auth-left-content">
            <div className="auth-eyebrow"><div className="auth-eyebrow-dot" />Join 18,400+ active trainers</div>
            <h1 className="auth-h1">Get paid to shape<br /><span>the future of AI.</span></h1>
            <p className="auth-sub">Work on meaningful tasks — from writing and evaluation to safety testing — on your own schedule, from anywhere in the world.</p>
            <div className="auth-steps">
              {[
                { n: "01", title: "Create your profile", desc: "Tell us your skills, languages, and areas of expertise. Takes less than 5 minutes." },
                { n: "02", title: "Get matched to tasks", desc: "We surface tasks that fit your background. No bidding, no cold outreach — just relevant work." },
                { n: "03", title: "Complete work & get paid", desc: "Submit tasks, receive feedback, and get paid reliably. Transparent rates, no surprises." },
              ].map(s => (
                <div className="auth-step" key={s.n}>
                  <div className="auth-step-num">{s.n}</div>
                  <div><div className="auth-step-title">{s.title}</div><div className="auth-step-desc">{s.desc}</div></div>
                </div>
              ))}
            </div>
            <div className="auth-trust">
              <span className="auth-trust-label">Avg. earnings</span>
              <div className="auth-trust-line" />
              <div className="auth-trust-logos">
                {["$18–$45/hr", "50+ countries", "240K+ tasks/mo", "Paid weekly"].map(co => (
                  <span key={co} className="auth-trust-logo">{co}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            {success ? <SuccessScreen email={form.email} /> : (
              <>
                <div className="auth-form-title">Join as a trainer</div>
                <div className="auth-form-sub">Already have an account? <a onClick={() => navigate("/login")}>Sign in</a></div>

                <div className="field-row-2">
                  <div className="field" style={{ margin: 0 }}>
                    <label className="field-label">First name</label>
                    <input className={`field-input${errors.firstName ? " has-error" : ""}`} placeholder="Ada"
                      value={form.firstName} onChange={e => set("firstName", e.target.value)} />
                    {errors.firstName && <div className="field-error">{errors.firstName}</div>}
                  </div>
                  <div className="field" style={{ margin: 0 }}>
                    <label className="field-label">Last name</label>
                    <input className={`field-input${errors.lastName ? " has-error" : ""}`} placeholder="Lovelace"
                      value={form.lastName} onChange={e => set("lastName", e.target.value)} />
                    {errors.lastName && <div className="field-error">{errors.lastName}</div>}
                  </div>
                </div>

                <div className="field">
                  <label className="field-label">Email</label>
                  <input className={`field-input${errors.email ? " has-error" : ""}`} type="email"
                    placeholder="you@email.com" value={form.email} onChange={e => set("email", e.target.value)} />
                  {errors.email && <div className="field-error">{errors.email}</div>}
                </div>

                <div className="field">
                  <label className="field-label">State</label>
                  <div style={{ position: "relative" }}>
                    <select className={`field-select${!form.state ? " is-placeholder" : ""}${errors.state ? " has-error" : ""}`}
                      value={form.state} onChange={e => set("state", e.target.value)}>
                      <option value="">Select your state…</option>
                      {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", pointerEvents: "none" }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                  {errors.state && <div className="field-error">{errors.state}</div>}
                </div>

                <div className="field">
                  <label className="field-label">Password</label>
                  <div className="field-pw">
                    <input className={`field-input${errors.password ? " has-error" : ""}`}
                      type={showPw ? "text" : "password"} placeholder="Min. 8 characters"
                      value={form.password} onChange={e => set("password", e.target.value)} />
                    <button className="field-pw-toggle" onClick={() => setShowPw(v => !v)}>
                      <EyeIcon open={showPw} />
                    </button>
                  </div>
                  {form.password && (
                    <div className="pw-strength">
                      <div className="pw-strength-bars">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className={`pw-bar${pwStrength >= i ? " " + STRENGTH_CLASSES[pwStrength] : ""}`} />
                        ))}
                      </div>
                      <div className="pw-strength-label">{STRENGTH_LABELS[pwStrength]}</div>
                    </div>
                  )}
                  {errors.password && <div className="field-error">{errors.password}</div>}
                </div>

                {/* ── reCAPTCHA v2 ── */}
                <div className={`captcha-wrap${errors.captcha ? " captcha-error-border" : ""}`}>
                  <div className="captcha-label">Security check</div>
                  {/* reCAPTCHA widget mounts here */}
                  <div ref={captchaContainerRef} />
                  <div className="captcha-note">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                    Protected by Google reCAPTCHA
                  </div>
                  {errors.captcha && (
                    <div className="captcha-err-msg">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {errors.captcha}
                    </div>
                  )}
                </div>

                {signUpError && (
                  <div style={{ fontSize: 13, color: "#dc2626", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "var(--r-sm)", padding: "10px 14px", marginBottom: 8 }}>
                    ⚠ {signUpError}
                  </div>
                )}

                <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
                  {loading ? "Creating account…" : "Create account"}
                  {!loading && <div className="btn-submit-arrow"><Arrow size={15} /></div>}
                </button>

                <p className="auth-terms">
                  By creating an account, you agree to Lixeen's{" "}
                  <a onClick={() => navigate("/terms")}>Terms of Service</a>,{" "}
                  <a onClick={() => navigate("/privacy")}>Privacy Policy</a>, and{" "}
                  <a onClick={() => navigate("/cookies")}>Cookie Policy</a>.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}