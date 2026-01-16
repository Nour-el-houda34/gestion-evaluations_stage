import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 text-white">
            <div className="mb-12 text-center">
                <h1 className="text-4xl font-extrabold mb-4 drop-shadow-lg">
                    Bienvenue dans votre Espace d'Évaluation ✨
                </h1>
                <p className="text-lg leading-relaxed max-w-2xl mx-auto">
                    Découvrez une expérience fluide et intuitive pour évaluer vos stagiaires. Cliquez sur le bouton ci-dessous pour commencer votre évaluation et laissez la magie opérer !
                </p>
            </div>

            <div className="bg-white shadow-2xl p-10 rounded-3xl w-full max-w-2xl text-center transform hover:scale-105 transition-transform duration-500">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    🌟 Étape 1 : Commencez l'Évaluation
                </h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                    Assurez-vous d'avoir toutes les informations nécessaires pour une évaluation précise et constructive. Prenez votre temps, chaque détail compte !
                </p>
                
                <Link 
                    to="/formulaire" 
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-purple-600 hover:to-blue-600 hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    aria-label="Commencer l'Évaluation"
                >
                    🚀 Commencer l'Évaluation
                </Link>
            </div>

            <footer className="mt-12 text-center text-sm text-gray-200">
                © {new Date().getFullYear()} Master ISI. Tous droits réservés.
            </footer>
        </div>
    );
};

export default Dashboard;
