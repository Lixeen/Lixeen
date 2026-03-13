import React from 'react'
import { Link } from 'react-router-dom'

function NavLogo() {

    const LogoMark = ({ size = 18 }) => (
        <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
            <path d="M10 2L3 7v6l7 5 7-5V7L10 2z" fill="#000" fillOpacity="0.7" />
            <path d="M10 2L3 7l7 3 7-3L10 2z" fill="#000" fillOpacity="0.4" />
        </svg>
    );
    return (
        <>
            <Link to="/" className="nav-logo">
                <div className="nav-logo-mark">
                    <LogoMark size={18} />
                </div>
                <span className="nav-logo-name">Lixeen</span>
            </Link>
        </>
    )
}

export default NavLogo