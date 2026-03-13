import React from 'react'
import { Link } from 'react-router-dom';

const menuItems = [
    {
        title: "Trainers",
        links: [
            { label: "How it works", path: "/how-it-works" },
            { label: "Browse tasks", path: "/task" },
            { label: "Earnings", path: "/earnings" },
            { label: "Leaderboard", path: "/leaderboard" },
            { label: "Trainer levels", path: "/trainer-levels" }
        ]
    },
    {
        title: "Company",
        links: [
            { label: "About", path: "/about" },
            { label: "Blog", path: "/blog" },
            { label: "Careers", path: "/careers" },
            { label: "For companies", path: "/companies" },
            { label: "Press", path: "/press" }
        ]
    },
    {
        title: "Support",
        links: [
            { label: "Help center", path: "/help" },
            { label: "Scoring rubrics", path: "/rubrics" },
            { label: "Payout guide", path: "/payouts" },
            { label: "Tax & compliance", path: "/tax" },
            { label: "Contact", path: "/contact" }
        ]
    }
]

const G = `
  /* ─── FOOTER ─── */
.footer { background: var(--surface); border-top: 1px solid var(--border); padding: 56px 40px 32px; }
.footer-grid { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
.footer-logo-row { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.footer-logo-mark { width: 30px; height: 30px; background: var(--lime); border-radius: 9px; display: flex; align-items: center; justify-content: center; }
.footer-logo-name { font-size: 18px; font-weight: 800; color: #0a0a0a; }
.footer-brand-desc { font-size: 13px; color: #0a0a0a; line-height: 1.65; max-width: 240px; }
.footer-col-title { font-size: 12px; font-weight: 700; color: #0a0a0a; margin-bottom: 16px; letter-spacing: 0.02em; text-transform: uppercase; }
.footer-links { display: flex; flex-direction: column; gap: 10px; }
.footer-link { font-size: 13.5px; color: #111111; text-decoration: none; cursor: pointer; transition: color 0.1s; }
.footer-link:hover { color: #000; }
.footer-bottom { max-width: 1200px; margin: 0 auto; padding-top: 28px; border-top: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #111111; }
`

function Footer() {

    const LogoMark = ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" fill="#000" fillOpacity="0.7" />
            <path d="M10 2L3 7l7 3 7-3L10 2z" fill="#000" fillOpacity="0.4" />
        </svg>
    );

    return (
        <>
        <style>{G}</style>
        <footer className="footer">
            <div className="footer-grid">
                <div>
                    <div className="footer-logo-row">
                        <div className="footer-logo-mark"><LogoMark size={16} /></div>
                        <span className="footer-logo-name">Lixeen</span>
                    </div>
                    <p className="footer-brand-desc">The platform connecting skilled humans with AI labs. Fair pay, transparent processes, global access.</p>
                </div>
                {menuItems.map(col => (
                    <div key={col.title}>
                        <div className="footer-col-title">{col.title}</div>
                        <div className="footer-links">
                            {col.links.map(link => <Link key={link.label} to={link.path} className="footer-link">
                                {link.label}</Link>)}
                        </div>
                    </div>
                ))}
            </div>
            <div className="footer-bottom">
                <span>
                    © {new Date().getFullYear()} Lixeen Inc. All rights reserved.
                </span>

                <div style={{ display: "flex", gap: 24 }}>
                    {[
                        { label: "Privacy", path: "/privacy" },
                        { label: "Terms", path: "/terms" },
                        { label: "Cookies", path: "/cookies" },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.path}
                            className="footer-link"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </footer>
    </>
    )
}

export default Footer