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
                    <Link to="/tirages" className="navbar-link">Tirages</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/statistiques" className="navbar-link">Statistiques</Link>
                </li>
                <li className="navbar-item">
                    <Link to="/a-propos" className="navbar-link">À propos</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
