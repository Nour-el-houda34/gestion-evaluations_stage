import logo from './logo.svg';
import './App.css';

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./componenrs/Dashboard";
import FormulaireApreciation from './componenrs/FormulaireApreciation'; // Assure-toi que le chemin est correct

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/formulaire" element={<FormulaireApreciation />} />
      </Routes>
    </Router>
  );
};

export default App;


