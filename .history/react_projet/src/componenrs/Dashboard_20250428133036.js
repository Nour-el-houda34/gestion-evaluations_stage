import React from "react";

const Dashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Header */}
            <h1 className="text-4xl font-bold mb-8 text-center text-indigo-700">Tableau de Bord</h1>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[
                    { title: "Stages évalués", value: 58 },
                    { title: "Stages en cours", value: 12 },
                    { title: "Note moyenne", value: "3.7 / 5" },
                    { title: "Tuteurs actifs", value: 15 }
                ].map((item, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                        <h2 className="text-2xl font-bold text-gray-800">{item.value}</h2>
                        <p className="text-gray-500 mt-2">{item.title}</p>
                    </div>
                ))}
            </div>

            {/* Graph Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Placeholder Pie Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700">Répartition des évaluations</h3>
                    <div className="w-full h-64 bg-gradient-to-tr from-indigo-300 via-purple-300 to-blue-300 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        (Graphique circulaire ici)
                    </div>
                </div>

                {/* Placeholder Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-indigo-700">Moyenne par compétence</h3>
                    <div className="w-full h-64 bg-gradient-to-tr from-green-300 via-yellow-300 to-pink-300 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                        (Graphique en barres ici)
                    </div>
                </div>
            </div>

            {/* Tables Section */}
            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                <h3 className="text-xl font-semibold mb-4 text-indigo-700">Stages en Attente d'Évaluation</h3>
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-indigo-100">
                            <th className="px-4 py-2 text-left">Stagiaire</th>
                            <th className="px-4 py-2 text-left">Date de Fin</th>
                            <th className="px-4 py-2 text-left">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { name: "Alice Dupont", end: "03/05/2025", status: "À évaluer" },
                            { name: "Mehdi Lahlou", end: "07/05/2025", status: "En cours" },
                            { name: "Sarah Bensaid", end: "09/05/2025", status: "Non commencé" }
                        ].map((stagiaire, index) => (
                            <tr key={index} className="border-b">
                                <td className="px-4 py-2">{stagiaire.name}</td>
                                <td className="px-4 py-2">{stagiaire.end}</td>
                                <td className="px-4 py-2">{stagiaire.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <footer className="text-center text-gray-400 mt-12">
                © {new Date().getFullYear()} Master ISI. Tous droits réservés.
            </footer>
        </div>
    );
};

export default Dashboard;
