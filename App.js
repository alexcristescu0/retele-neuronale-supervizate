import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Prezentare from './pagini/Prezentare';
import Experiment from './componente/Experiment';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<Prezentare />} />
                    <Route path="/experiment" element={<Experiment />} />
                    <Route path="/aplicatie" element={<Experiment />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;