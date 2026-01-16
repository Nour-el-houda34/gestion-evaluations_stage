import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 text-white relative overflow-hidden">
            {/* Background Particles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
                <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500 rounded-full opacity-40 animate-spin-slow"></div>
                {/* Additional Magical Particles */}
                <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-pink-400 rounded-full opacity-50 animate-ping"></div>
                <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/5 w-12 h-12 bg-green-400 rounded-full opacity-40 animate-bounce"></div>
                {/* Shooting Stars */}
                <div className="absolute top-0 left-0 w-2 h-2 bg-white rounded-full opacity-70 animate-shooting-star"></div>
                <div className="absolute top-1/3 right-0 w-2 h-2 bg-white rounded-full opacity-70 animate-shooting-star"></div>
            </div>

            <div className="relative z-10 mb-12 text-center">
                <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg animate-fade-in">
                    Bienvenue dans votre Espace d'Évaluation ✨
                </h1>
                <p className="text-lg leading-relaxed max-w-2xl mx-auto animate-fade-in delay-200">
                    Découvrez une expérience fluide et intuitive pour évaluer vos stagiaires. Cliquez sur le bouton ci-dessous pour commencer votre évaluation et laissez la magie opérer !
                </p>
            </div>

            <div className="relative z-10 bg-white shadow-2xl p-10 rounded-3xl w-full max-w-2xl text-center transform hover:scale-105 transition-transform duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    🌟 Étape 1 : Commencez l'Évaluation
                </h2>
                <p className="text-gray-700 mb-8 leading-relaxed">
                    Assurez-vous d'avoir toutes les informations nécessaires pour une évaluation précise et constructive. Prenez votre temps, chaque détail compte !
                </p>
                
                <Link to="/formulaire" className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full w-full hover:from-purple-600 hover:to-blue-600 hover:shadow-xl transition-all duration-300 hover:animate-pulse">
                    🚀 Commencer l'Évaluation
                </Link>
            </div>

            <footer className="relative z-10 mt-12 text-center text-sm text-gray-200 animate-fade-in delay-500">
                © {new Date().getFullYear()} Master ISI . Tous droits réservés.
            </footer>
        </div>
    );
};

export default Dashboard;
