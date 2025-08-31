// src/components/Navbar.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Navbar.css';

const Navbar: React.FC = () => {
    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <Link to="/" className="navbar-link">Accueil</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/numbersResult" className="navbar-link">Numbers Result</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/starsResult" className="navbar-link">Stars Result</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/NumbersStat" className="navbar-link">Numbers Stat</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/starsStat" className="navbar-link">Stars Stat</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/a-propos" className="navbar-link">À propos</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
