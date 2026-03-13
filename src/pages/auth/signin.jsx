import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import NavLogo from "../../components/NavLogo";

// ─────────────────────────────────────────────────────────────────────────────
// Replace with your v2 site key from https://www.google.com/recaptcha/admin
// Type: Challenge (v2) → "I'm not a robot" Checkbox
// ─────────────────────────────────────────────────────────────────────────────
const RECAPTCHA_SITE_KEY = "6LcQ9IgsAAAAAI11M2zzGVC8trV80OKJrT3pvQKo";

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
  --lime-dim:  rgba(61,187,0,0.08);
  --lime-glow: rgba(61,187,0,0.18);
  --purple:    #7c5cfc;
  --sans:      'Anek Devanagari', system-ui, sans-serif;
  --r-pill:    999px;
  --r-card:    16px;
  --r-sm:      8px;
}

html, body { height: 100%; }
body {
  font-family: var(--sans); color: var(--text); background: var(--bg);
  -webkit-font-smoothing: antialiased; overflow-x: hidden; min-height: 100vh;
  display: flex; flex-direction: column;
}
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

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

.auth-root { min-height: 100vh; display: grid; grid-template-columns: 1fr 1fr; padding-top: 68px; }

.auth-left {
  background: var(--surface); border-right: 1px solid var(--border);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 60px 72px; position: relative; overflow: hidden;
}
.auth-left-orb { position: absolute; bottom: -20%; left: -10%; width: 600px; height: 400px; border-radius: 50%; background: radial-gradient(ellipse at 50% 50%, rgba(61,187,0,0.1) 0%, rgba(124,92,252,0.06) 40%, transparent 70%); pointer-events: none; filter: blur(2px); }
.auth-left-orb2 { position: absolute; top: -10%; right: -10%; width: 400px; height: 300px; border-radius: 50%; background: radial-gradient(ellipse at 50% 50%, rgba(124,92,252,0.07) 0%, transparent 65%); pointer-events: none; }
.auth-left-content { position: relative; z-index: 1; width: 100%; max-width: 420px; }

.auth-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11.5px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--lime); background: var(--lime-dim); border: 1px solid var(--lime-glow); border-radius: var(--r-pill); padding: 5px 14px; margin-bottom: 28px; }
.auth-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--lime); animation: pulse 2s infinite; }
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.5;transform:scale(0.8);} }
.auth-h1 { font-size: clamp(28px,3vw,42px); font-weight: 800; color: var(--text); letter-spacing: -0.03em; line-height: 1.1; margin-bottom: 14px; }
.auth-h1 span { color: var(--lime); }
.auth-sub { font-size: 15px; color: var(--sub); line-height: 1.65; margin-bottom: 44px; }

.auth-metrics { display: flex; flex-direction: column; gap: 12px; margin-bottom: 44px; }
.auth-metric { display: flex; align-items: center; gap: 14px; background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); padding: 16px 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
.auth-metric-icon { width: 40px; height: 40px; border-radius: 10px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 18px; background: var(--lime-dim); border: 1px solid var(--lime-glow); }
.auth-metric-val { font-size: 20px; font-weight: 800; color: var(--text); line-height: 1; margin-bottom: 2px; }
.auth-metric-lbl { font-size: 12px; color: var(--muted); }

.auth-quote { background: #fff; border: 1px solid var(--border); border-radius: var(--r-card); padding: 22px 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
.auth-quote-mark { font-size: 36px; color: var(--lime); line-height: 1; font-weight: 800; margin-bottom: 8px; }
.auth-quote-text { font-size: 13.5px; color: var(--sub); line-height: 1.7; margin-bottom: 16px; }
.auth-quote-author { display: flex; align-items: center; gap: 10px; }
.auth-quote-av { width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; background: linear-gradient(135deg, var(--purple), #c084fc); color: white; font-size: 11px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
.auth-quote-name { font-size: 13px; font-weight: 700; color: var(--text); }
.auth-quote-role { font-size: 11px; color: var(--muted); }
.auth-quote-company { font-size: 11px; color: var(--lime); font-weight: 600; }

.auth-right { background: var(--bg); display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding: 80px 72px 60px; }
.auth-form-wrap { width: 100%; max-width: 400px; }
.auth-form-title { font-size: 26px; font-weight: 800; color: var(--text); letter-spacing: -0.03em; margin-bottom: 6px; }
.auth-form-sub { font-size: 14px; color: var(--sub); margin-bottom: 32px; }
.auth-form-sub a { color: var(--lime); cursor: pointer; text-decoration: none; font-weight: 600; }
.auth-form-sub a:hover { text-decoration: underline; }

.field-pw { position: relative; }
.field-pw .field-input { padding-right: 48px; }
.field-pw-toggle { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--muted); display: flex; align-items: center; padding: 0; transition: color 0.15s; }
.field-pw-toggle:hover { color: var(--sub); }
.field-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px; }
.field-forgot { font-size: 12px; color: var(--muted); cursor: pointer; transition: color 0.15s; }
.field-forgot:hover { color: var(--lime); }

.field { margin-bottom: 16px; }
.field-label { display: block; font-size: 12px; font-weight: 600; color: var(--sub); margin-bottom: 7px; text-transform: uppercase; letter-spacing: 0.06em; }
.field-input { display: block; width: 100%; height: 48px; background: var(--surface); border: 1.5px solid var(--border2); border-radius: var(--r-sm); color: var(--text); font-family: var(--sans); font-size: 14px; padding: 0 16px; outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
.field-input::placeholder { color: var(--muted); }
.field-input:focus { border-color: rgba(61,187,0,0.4); box-shadow: 0 0 0 3px rgba(61,187,0,0.07); }
.field-input.has-error { border-color: rgba(239,68,68,0.5); }
.field-input.has-error:focus { border-color: rgba(239,68,68,0.7); box-shadow: 0 0 0 3px rgba(239,68,68,0.07); }
.field-error { font-size: 12px; color: #dc2626; margin-top: 5px; }

.auth-error-banner { display: flex; align-items: flex-start; gap: 12px; background: rgba(239,68,68,0.05); border: 1px solid rgba(239,68,68,0.2); border-left: 3px solid #ef4444; border-radius: var(--r-sm); padding: 14px 16px; margin-bottom: 22px; animation: errIn 0.2s ease; }
@keyframes errIn { from{opacity:0;transform:translateY(-6px);} to{opacity:1;transform:translateY(0);} }
.auth-error-icon { width: 22px; height: 22px; border-radius: 50%; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
.auth-error-body { flex: 1; min-width: 0; }
.auth-error-title { font-size: 13px; font-weight: 700; color: #dc2626; margin-bottom: 3px; }
.auth-error-msg { font-size: 12.5px; color: #ef4444; line-height: 1.5; opacity: 0.8; }
.auth-error-dismiss { background: none; border: none; cursor: pointer; padding: 0; color: rgba(239,68,68,0.3); font-size: 20px; line-height: 1; flex-shrink: 0; transition: color 0.15s; }
.auth-error-dismiss:hover { color: #ef4444; }

/* ── CAPTCHA ── */
.captcha-wrap {
  margin: 4px 0 16px;
  padding: 14px 16px;
  background: var(--surface);
  border: 1.5px solid var(--border2);
  border-radius: var(--r-card);
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: border-color 0.2s;
}
.captcha-wrap.captcha-invalid { border-color: rgba(239,68,68,0.5); }
.captcha-header { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--sub); }
.captcha-note { font-size: 11px; color: var(--muted); display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.captcha-err { font-size: 12px; color: #dc2626; display: flex; align-items: center; gap: 5px; }
@media (max-width: 480px) {
  .captcha-wrap > div:nth-child(2) { transform: scale(0.88); transform-origin: 0 0; }
}

.btn-submit { display: flex; align-items: center; justify-content: center; gap: 0; width: 100%; height: 52px; border-radius: var(--r-pill); background: var(--text); border: none; color: #fff; font-family: var(--sans); font-size: 15px; font-weight: 700; cursor: pointer; transition: opacity 0.2s; margin-top: 8px; padding: 0 8px 0 24px; }
.btn-submit:hover:not(:disabled) { opacity: 0.85; }
.btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
.btn-submit-arrow { width: 34px; height: 34px; border-radius: 50%; background: var(--purple); display: flex; align-items: center; justify-content: center; margin-left: auto; flex-shrink: 0; }

.auth-terms { font-size: 12px; color: var(--muted); text-align: center; margin-top: 20px; line-height: 1.6; }
.auth-terms a { color: var(--sub); cursor: pointer; transition: color 0.15s; }
.auth-terms a:hover { color: var(--text); }

@media (max-width: 900px) {
  .auth-root { grid-template-columns: 1fr; }
  .auth-left { display: none; }
  .auth-right { padding: 40px 28px; min-height: calc(100vh - 68px); }
  .nav { padding: 0 20px; }
}
`;

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
      ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
      : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>}
  </svg>
);

const WarnIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const friendlyError = (raw = "") => {
  const m = raw.toLowerCase();
  if (m.includes("invalid login credentials") || m.includes("invalid email or password"))
    return { title: "Incorrect email or password", msg: "Wrong email or password. Please check and try again." };
  if (m.includes("email not confirmed"))
    return { title: "Email not verified", msg: "Please click the confirmation link we sent to your inbox before signing in." };
  if (m.includes("too many requests") || m.includes("rate limit"))
    return { title: "Too many attempts", msg: "You've been temporarily locked out. Please wait a few minutes." };
  if (m.includes("user not found"))
    return { title: "No account found", msg: "We couldn't find an account for this email. Double-check the spelling or create a new account." };
  if (m.includes("network") || m.includes("fetch"))
    return { title: "Connection error", msg: "We couldn't reach our servers. Check your internet connection and try again." };
  return { title: "Sign-in failed", msg: raw || "Something went wrong. Please try again." };
};

// ── reCAPTCHA hook ─────────────────────────────────────────────────────────────
function useRecaptcha(containerRef, siteKey) {
  const widgetIdRef = useRef(null);

  useEffect(() => {
    const renderWidget = () => {
      if (!containerRef.current || widgetIdRef.current !== null) return;
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        size: "normal",
      });
    };

    if (window.grecaptcha?.render) {
      window.grecaptcha.ready(renderWidget);
    } else {
      if (!document.getElementById("recaptcha-script")) {
        const script = document.createElement("script");
        script.id = "recaptcha-script";
        script.src = "https://www.google.com/recaptcha/api.js?render=explicit&hl=en";
        script.async = true;
        script.defer = true;
        script.onload = () => window.grecaptcha.ready(renderWidget);
        document.head.appendChild(script);
      } else {
        const poll = setInterval(() => {
          if (window.grecaptcha?.render) {
            clearInterval(poll);
            window.grecaptcha.ready(renderWidget);
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

  return { getToken, reset };
}

// ── Main ───────────────────────────────────────────────────────────────────────
export default function SignIn() {
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [errors, setErrors]       = useState({});
  const [authError, setAuthError] = useState(null);
  const [loading, setLoading]     = useState(false);
  const navigate = useNavigate();

  // ── reCAPTCHA ──
  const captchaRef = useRef(null);
  const { getToken, reset: resetCaptcha } = useRecaptcha(captchaRef, RECAPTCHA_SITE_KEY);

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    return e;
  };

  const clearAuthError = () => { if (authError) setAuthError(null); };

  const handleSubmit = async () => {
    setAuthError(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    
    const captchaToken = getToken();
    if (!captchaToken) {
      setErrors(prev => ({ ...prev, captcha: "Please complete the security check before continuing." }));
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(friendlyError(error.message));
      setLoading(false);
      resetCaptcha();
    } else {
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <>
      <style>{G}</style>
      <nav className="nav">
        <NavLogo />
        <div className="nav-right">
          <span className="nav-text-link">
            Don't have an account? <span onClick={() => navigate("/sign-up")}>Sign up</span>
          </span>
        </div>
      </nav>

      <div className="auth-root">
        {/* LEFT */}
        <div className="auth-left">
          <div className="auth-left-orb" /><div className="auth-left-orb2" />
          <div className="auth-left-content">
            <div className="auth-eyebrow"><div className="auth-eyebrow-dot" />18,400+ Active Trainers</div>
            <h1 className="auth-h1">The world's AI runs on<br /><span>human expertise.</span></h1>
            <p className="auth-sub">Sign back in to manage your training pipelines, track quality metrics, and scale your AI data operations.</p>
            <div className="auth-metrics">
              {[
                { icon: "⚡", val: "240K+", lbl: "Tasks completed monthly" },
                { icon: "✓",  val: "94%",   lbl: "Average acceptance rate" },
                { icon: "🌍", val: "50+",   lbl: "Countries covered" },
              ].map(m => (
                <div className="auth-metric" key={m.lbl}>
                  <div className="auth-metric-icon">{m.icon}</div>
                  <div><div className="auth-metric-val">{m.val}</div><div className="auth-metric-lbl">{m.lbl}</div></div>
                </div>
              ))}
            </div>
            <div className="auth-quote">
              <div className="auth-quote-mark">"</div>
              <p className="auth-quote-text">We scaled from 200 to 12,000 tasks per month over six weeks without any drop in quality. The infrastructure just works.</p>
              <div className="auth-quote-author">
                <div className="auth-quote-av">NF</div>
                <div>
                  <div className="auth-quote-name">Nadia F.</div>
                  <div className="auth-quote-role">ML Platform Engineer</div>
                  <div className="auth-quote-company">Volant</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="auth-right">
          <div className="auth-form-wrap">
            <div className="auth-form-title">Welcome back</div>
            <div className="auth-form-sub">New to Lixeen? <a onClick={() => navigate("/sign-up")}>Create an account</a></div>

            {authError && (
              <div className="auth-error-banner" role="alert">
                <div className="auth-error-icon"><WarnIcon /></div>
                <div className="auth-error-body">
                  <div className="auth-error-title">{authError.title}</div>
                  <div className="auth-error-msg">{authError.msg}</div>
                </div>
                <button className="auth-error-dismiss" onClick={() => setAuthError(null)}>×</button>
              </div>
            )}

            <div className="field">
              <label className="field-label">Email address</label>
              <input className={`field-input${errors.email ? " has-error" : ""}`} type="email"
                placeholder="you@company.com" value={email}
                onChange={e => { setEmail(e.target.value); setErrors(x => ({...x,email:null})); clearAuthError(); }} />
              {errors.email && <div className="field-error">{errors.email}</div>}
            </div>

            <div className="field">
              <div className="field-row">
                <label className="field-label" style={{margin:0}}>Password</label>
                <span className="field-forgot">Forgot password?</span>
              </div>
              <div className="field-pw">
                <input className={`field-input${errors.password ? " has-error" : ""}`}
                  type={showPw ? "text" : "password"} placeholder="••••••••••" value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(x => ({...x,password:null})); clearAuthError(); }} />
                <button className="field-pw-toggle" onClick={() => setShowPw(v => !v)}><EyeIcon open={showPw} /></button>
              </div>
              {errors.password && <div className="field-error">{errors.password}</div>}
            </div>

            {/* ── reCAPTCHA v2 ── */}
            <div className={`captcha-wrap${errors.captcha ? " captcha-invalid" : ""}`}>
              <div className="captcha-header">Security check</div>
              <div ref={captchaRef} />
              <div className="captcha-note">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                Protected by Google reCAPTCHA
              </div>
              {errors.captcha && (
                <div className="captcha-err">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {errors.captcha}
                </div>
              )}
            </div>

            <button className="btn-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
              {!loading && <div className="btn-submit-arrow"><Arrow size={15} /></div>}
            </button>

            <p className="auth-terms">
              By continuing, you agree to Lixeen's{" "}
              <a onClick={() => navigate("/terms")}>Terms of Service</a> and{" "}
              <a onClick={() => navigate("/privacy")}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}