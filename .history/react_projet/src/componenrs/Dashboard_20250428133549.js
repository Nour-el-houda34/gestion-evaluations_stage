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
        { compétence: "Technique", moyenne: 4.1 },
        { compétence: "Communication", moyenne: 3.5 },
        { compétence: "Autonomie", moyenne: 3.8 },
        { compétence: "Esprit d'équipe", moyenne: 4.0 }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
            {/* Header */}
            <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-700 drop-shadow-md">
                Tableau de Bord
            </h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { title: "Stages évalués", value: 58 },
                    { title: "Stages en cours", value: 12 },
                    { title: "Note moyenne", value: "3.7 / 5" },
                    { title: "Tuteurs actifs", value: 15 }
                ].map((item, index) => (
                    <div
                        key={index}
                        className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow duration-300"
                    >
                        <h2 className="text-2xl font-bold text-gray-800">{item.value}</h2>
                        <p className="text-gray-500 mt-2">{item.title}</p>
                    </div>
                ))}
            </div>

            {/* Graph Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700">Répartition des évaluations</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={100}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700">Moyenne par compétence</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <XAxis dataKey="compétence" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Bar dataKey="moyenne" fill="#8884d8" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Tables Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold mb-4 text-indigo-700">Stages en Attente d'Évaluation</h3>
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-indigo-100">
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Stagiaire</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Date de Fin</th>
                            <th className="px-4 py-2 text-left font-semibold text-gray-700">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: "Alice Dupont", end: "03/05/2025", status: "À évaluer" },
                            { name: "Mehdi Lahlou", end: "07/05/2025", status: "En cours" },
                            { name: "Sarah Bensaid", end: "09/05/2025", status: "Non commencé" }
                        ].map((stagiaire, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="px-4 py-2">{stagiaire.name}</td>
                                <td className="px-4 py-2">{stagiaire.end}</td>
                                <td className="px-4 py-2">{stagiaire.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <footer className="text-center text-gray-500 mt-12">
                © {new Date().getFullYear()} Master ISI. Tous droits réservés.
            </footer>
        </div>
    );
};

export default Dashboard;
