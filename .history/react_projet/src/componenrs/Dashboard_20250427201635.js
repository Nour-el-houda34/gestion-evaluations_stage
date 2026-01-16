import React from "react";

const Dashboard = ({ goToForm }) => {
    return (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-gray-100 rounded-lg shadow-xl">
            <div className="mb-8 text-center">
                <p className="text-lg text-gray-800 leading-relaxed">
                    Bienvenue dans votre espace d'évaluation. Accédez au formulaire d'évaluation du stage en cliquant sur le bouton ci-dessous.
                </p>
            </div>

            <div className="bg-white shadow-lg p-8 rounded-xl w-full max-w-lg text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Étape 1 : Commencez l'évaluation</h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                    Avant de commencer, assurez-vous d'avoir toutes les informations nécessaires pour évaluer le stagiaire de manière précise.
                </p>
                
                <button 
                    onClick={goToForm} 
                    className="p-4 bg-blue-600 text-white font-semibold rounded-lg w-full hover:bg-blue-700 hover:shadow-md transition-all duration-300"
                >
                    Commencer l'Évaluation
                </button>
            </div>

            <div className="mt-10 w-full max-w-lg text-center text-gray-600">
                <p className="text-sm leading-relaxed">
                    Vous pouvez revenir à ce tableau de bord à tout moment pour consulter les informations ou modifier vos réponses. Bonne évaluation !
                </p>
            </div>
        </div>
    );
};

export default Dashboard;
