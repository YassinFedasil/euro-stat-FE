// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import StatisticsPage from './components/StatisticsPage'; // Exemple de page de statistiques
import AboutPage from './components/AboutPage'; // Exemple de page À propos
import Draws from "./components/Draws.tsx";
import HomePage from "./components/HomePage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Navbar /> {/* Ajout de la barre de menu */}
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/tirages" element={<Draws />} />
                    <Route path="/statistiques" element={<StatisticsPage />} />
                    <Route path="/a-propos" element={<AboutPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
