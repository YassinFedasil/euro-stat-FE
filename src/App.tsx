// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DrawDataTables from './components/DrawDataTables';
import StatisticsPage from './components/StatisticsPage'; // Exemple de page de statistiques
import AboutPage from './components/AboutPage'; // Exemple de page À propos
import HomePage from "./components/HomePage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Navbar /> {/* Ajout de la barre de menu */}
            <div className="content">
                <Routes>
                    <Route path="/" element={<DrawDataTables />} />
                    <Route path="/tirages" element={<HomePage />} />
                    <Route path="/statistiques" element={<StatisticsPage />} />
                    <Route path="/a-propos" element={<AboutPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
