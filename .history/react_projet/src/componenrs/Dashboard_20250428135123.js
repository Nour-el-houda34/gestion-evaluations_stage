import React from "react";  
import { Link } from "react-router-dom";  
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";  

const Dashboard = () => {  
    const pieData = [  
        { name: "Excellent", value: 20 },  
        { name: "Très bien", value: 25 },  
        { name: "Bien", value: 30 },  
        { name: "À améliorer", value: 15 },  
        { name: "Insuffisant", value: 10 }  
    ];  

    const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#E91E63"];  

    const barData = [  
        { competence: "Technique", moyenne: 4.1 },  
        { competence: "Communication", moyenne: 3.5 },  
        { competence: "Autonomie", moyenne: 3.8 },  
        { competence: "Esprit d'équipe", moyenne: 4.0 }  
    ];  

    const stagesEnAttente = [  
        { name: "Alice Dupont", end: "03/05/2025", status: "À évaluer" },  
        { name: "Mehdi Lahlou", end: "07/05/2025", status: "En cours" },  
        { name: "Sarah Bensaid", end: "09/05/2025", status: "Non commencé" }  
    ];  

    const KPI = [  
        { title: "Stages évalués", value: 58 },  
        { title: "Stages en cours", value: 12 },  
        { title: "Note moyenne", value: "3.7 / 5" },  
        { title: "Tuteurs actifs", value: 15 }  
    ];  

    const TableRow = ({ stagiaire }) => (  
        <tr className="border-b">  
            <td className="px-4 py-2">{stagiaire.name}</td>  
            <td className="px-4 py-2">{stagiaire.end}</td>  
            <td className="px-4 py-2">{stagiaire.status}</td>  
        </tr>  
    );  

    return (  
        <div className="min-h-screen bg-gray-100 p-8 space-y-16">  
            {/* Hero Section */}  
            <section className="relative flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 text-white overflow-hidden">  
                <div className="absolute inset-0 pointer-events-none">  
                    <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>  
                    <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>  
                    <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500 rounded-full opacity-40 animate-spin-slow"></div>  
                </div>  

                <div className="relative z-10 text-center space-y-8">  
                    <h1 className="text-5xl font-extrabold animate-fade-in">Bienvenue dans votre Espace d'Évaluation ✨</h1>  
                    <p className="text-lg leading-relaxed max-w-2xl mx-auto animate-fade-in delay-200">  
                        Découvrez une expérience fluide et intuitive pour évaluer vos stagiaires. Cliquez sur le bouton ci-dessous pour commencer votre évaluation !  
                    </p>  
                    <div className="bg-white text-gray-800 p-10 rounded-3xl shadow-2xl w-full max-w-2xl mx-auto hover:scale-105 transition-transform duration-500 hover:shadow-[0_0_30px_rgba(255,255,255,0.8)]">  
                        <h2 className="text-3xl font-bold mb-6">🌟 Étape 1 : Commencez l'Évaluation</h2>  
                        <p className="mb-8 leading-relaxed">Assurez-vous d'avoir toutes les informations nécessaires pour une évaluation précise et constructive.</p>  
                        <Link to="/formulaire" className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:from-purple-600 hover:to-blue-600 hover:shadow-xl transition-all duration-300 hover:animate-pulse">  
                            🚀 Commencer l'Évaluation  
                        </Link>  
                    </div>  
                </div>  
            </section>  

            {/* Tableau de Bord */}  
            <header className="text-center">  
                <h1 className="text-4xl font-extrabold text-indigo-700">Tableau de Bord</h1>  
                <p className="text-lg text-gray-600">Suivez l'évolution des évaluations de vos stagiaires et découvrez des insights clés.</p>  
            </header>  

            {/* KPI Cards */}  
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6">  
                {KPI.map((item, index) => (  
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">  
                        <h2 className="text-2xl font-bold text-gray-800">{item.value}</h2>  
                        <p className="text-gray-500 mt-2">{item.title}</p>  
                    </div>  
                ))}  
            </section>  

            {/* Graphs */}  
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">  
                <div className="bg-white p-6 rounded-2xl shadow-lg">  
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700">Répartition des évaluations</h3>  
                    <ResponsiveContainer width="100%" height={300}>  
                        <PieChart>  
                            <Pie  
                                data={pieData}  
                                cx="50%"  
                                cy="50%"  
                                outerRadius={100}  
                                dataKey="value"  
                                labelLine={false}  
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}  
                            >  
                                {pieData.map((entry, index) => (  
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />  
                                ))}  
                            </Pie>  
                            <Legend />  
                        </PieChart>  
                    </ResponsiveContainer>  
                </div>  

                <div className="bg-white p-6 rounded-2xl shadow-lg">  
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700">Moyenne par compétence</h3>  
                    <ResponsiveContainer width="100%" height={300}>  
                        <BarChart data={barData}>  
                            <XAxis dataKey="competence" />  
                            <YAxis domain={[0, 5]} />  
                            <Tooltip />  
                            <Bar dataKey="moyenne" fill="#8884d8" radius={[10, 10, 0, 0]} />  
                        </BarChart>  
                    </ResponsiveContainer>  
                </div>  
            </section>  

            {/* Pending Evaluations Table */}  
            <section className="bg-white p-6 rounded-2xl shadow-lg">  
                <h3 className="text-xl font-semibold mb-4 text-indigo-700">Stages en Attente d'Évaluation</h3>  
                <table className="w-full table-auto border-collapse border">  
                    <thead>  
                        <tr className="bg-indigo-100">  
                            <th className="px-4 py-2 text-left border">Stagiaire</th>  
                            <th className="px-4 py-2 text-left border">Date de Fin</th>  
                            <th className="px-4 py-2 text-left border">Statut</th>  
                        </tr>  
                    </thead>  
                    <tbody>  
                        {stagesEnAttente.map((stagiaire, index) => <TableRow key={index} stagiaire={stagiaire} />)}  
                    </tbody>  
                </table>  
            </section>  

            {/* Footer */}  
            <footer className="text-center text-gray-400 mt-8 animate-fade-in delay-500">  
                © {new Date().getFullYear()} Master ISI. Tous droits réservés.  
            </footer>  
        </div>  
    );  
};  

export default Dashboard;  