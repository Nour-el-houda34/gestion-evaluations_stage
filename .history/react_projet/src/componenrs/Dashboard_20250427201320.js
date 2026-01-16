import React from "react";

const Dashboard = ({ goToForm }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-100 rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-blue-600 mb-2">Tableau de Bord</h1>
        <p className="text-lg text-gray-700">Bienvenue dans votre espace d'évaluation. Vous pouvez accéder au formulaire d'évaluation du stage en cliquant sur le bouton ci-dessous.</p>
      </div>

      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-md text-center">
        <img 
          src="https://www.pexels.com/photo/photo-of-people-having-a-meeting-3184339/" 
          
          className="mx-auto mb-4 rounded-lg shadow-md"
        />
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Étape 1 : Commencez l'évaluation</h2>
        <p className="text-gray-600 mb-6">Avant de commencer, veuillez vérifier que vous avez toutes les informations nécessaires pour évaluer le stagiaire.</p>
        
        <button 
          onClick={goToForm} 
          className="mt-4 p-3 bg-blue-500 text-white rounded-lg w-full hover:bg-blue-600 transition-all duration-300"
        >
          Commencer l'Évaluation
        </button>
      </div>

      <div className="mt-8 w-full max-w-md text-center text-gray-600">
        <p className="text-sm">Vous pouvez revenir à ce tableau de bord à tout moment pour consulter les informations ou modifier vos réponses.</p>
      </div>
    </div>
  );
};

export default Dashboard;
