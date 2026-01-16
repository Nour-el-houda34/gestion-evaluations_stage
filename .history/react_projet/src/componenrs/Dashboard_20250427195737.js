// Dashboard.js
import React from "react";

const Dashboard = ({ goToForm }) => {
  return (
    <div className="dashboard-container">
      <h1 className="text-2xl font-bold">Tableau de Bord</h1>
      <p>Bienvenue dans le tableau de bord. Vous pouvez accéder au formulaire d'évaluation en cliquant sur le bouton ci-dessous.</p>
      <button 
        onClick={goToForm} 
        className="mt-4 p-2 bg-blue-500 text-white rounded">
        Commencer l'Évaluation
      </button>
    </div>
  );
};

export default Dashboard;
