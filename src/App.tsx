import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import StarsStat from './components/StarsStat';
import AboutPage from './components/AboutPage';
import NumbersStat from "./components/NumbersStat.tsx";
import StarsResult from "./components/StarsResult.tsx";
import NumbersResult from "./components/NumbersResult.tsx";
import HomePage from "./components/HomePage.tsx";

const App: React.FC = () => {
    return (
        <Router>
            <Navbar/>
            <div className="content">
                <Routes>
                    <Route path="/" element={<HomePage/>}/>

                    <Route path="/numbersResult" element={<NumbersResult/>}/>
                    <Route path="/starsResult" element={<StarsResult/>}/>

                    <Route path="/NumbersStat" element={<NumbersStat/>}/>
                    <Route path="/starsStat" element={<StarsStat/>}/>

                    <Route path="/a-propos" element={<AboutPage/>}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
