import React, { useEffect, useState } from "react";
import { PieChartComponent } from "../componenrs/PieChartComponent";
import { BarChartComponent } from "../componenrs/BarChartComponent";
import { TableRow } from "../components/TableRow";
import { Link } from "react-router-dom";

const DEFAULT_PIE_DATA = [
  { name: "Communication", value: 400 },
  { name: "Travail en équipe", value: 300 },
  { name: "Créativité", value: 300 },
  { name: "Autonomie", value: 200 },
];

const DEFAULT_BAR_DATA = [
  { name: "Communication", moyenne: 4.5 },
  { name: "Travail en équipe", moyenne: 4.2 },
  { name: "Créativité", moyenne: 4.8 },
  { name: "Autonomie", moyenne: 4.0 },
];

const STAGES_EN_ATTENTE = [
  { nom: "Jean Dupont", dateFin: "2024-06-30", statut: "En attente" },
  { nom: "Alice Martin", dateFin: "2024-07-15", statut: "En attente" },
];

export const Dashboard = () => {
  const [statistiques, setStatistiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/statistiques")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((data) => {
        setStatistiques(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <section className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-800 via-pink-600 to-red-500 rounded-3xl shadow-xl text-white space-y-6 overflow-hidden transition-all duration-300 hover:shadow-2xl">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold tracking-wide">✨ Bienvenue sur le Tableau de Bord</h1>
          <p className="text-md max-w-xl mx-auto">
            Visualisez facilement les évaluations des stagiaires grâce à des graphiques clairs et des données dynamiques.
          </p>
          <Link
            to="/formulaire"
            className="inline-block bg-white text-purple-700 font-semibold px-6 py-2 rounded-full shadow hover:bg-gray-100 transition duration-300"
          >
            🚀 Commencer une Évaluation
          </Link>
        </div>
      </section>

      <section className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="text-red-500">Erreur : {error}</p>
        ) : statistiques.length > 0 ? (
          statistiques.map((chart, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <h4 className="text-xl font-semibold text-center text-gray-700 mb-4">
                📊 {chart.titre}
              </h4>
              <PieChartComponent data={chart.data} />
            </div>
          ))
        ) : (
          <PieChartComponent data={DEFAULT_PIE_DATA} />
        )}
      </section>

      <section className="mt-10">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-xl font-bold mb-4 text-center text-purple-700">💡 Compétences Moyennes</h3>
          <BarChartComponent data={DEFAULT_BAR_DATA} />
        </div>
      </section>

      <section className="mt-10 bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
        <h3 className="text-xl font-bold mb-4 text-purple-700 text-center">📅 Stages en Attente</h3>
        <table className="w-full text-sm text-left text-gray-600 border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gradient-to-r from-purple-600 to-pink-500 text-white">
            <tr>
              <th className="px-4 py-2">Stagiaire</th>
              <th className="px-4 py-2">Fin</th>
              <th className="px-4 py-2">Statut</th>
            </tr>
          </thead>
          <tbody>
            {STAGES_EN_ATTENTE.map((stagiaire, index) => (
              <TableRow key={index} stagiaire={stagiaire} />
            ))}
          </tbody>
        </table>
      </section>

      <footer className="text-center text-gray-500 mt-8 text-sm italic">
        © {new Date().getFullYear()} — Master ISI. Interface conçue avec 💜.
      </footer>
    </div>
  );
};
