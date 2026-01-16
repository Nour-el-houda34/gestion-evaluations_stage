import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import LoginForm from "./components/LoginForm";
import FormulaireApreciation from './components/FormulaireApreciation';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />

        {/* Routes protégées */}
        <Route 
          path="/Dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/formulaire" 
          element={
            <PrivateRoute>
              <FormulaireApreciation />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;
