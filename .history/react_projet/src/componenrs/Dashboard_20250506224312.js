import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";  
import {  
  PieChart,  
  Pie,  
  Cell,  
  BarChart,  
  Bar,  
  XAxis,  
  YAxis,  
  Tooltip,  
  ResponsiveContainer,  
  Legend,  
} from "recharts";  
import PropTypes from "prop-types";  

const TableRow = ({ stagiaire }) => (
    <>
      {stagiaire.periodes.map((periode, index) => (
        <tr key={index} className="border-b hover:bg-gray-50 transition-colors duration-300">
          <td className="px-4 py-3">{stagiaire.nom} {stagiaire.prenom}</td>
          <td className="px-4 py-3">{stagiaire.email || 'Non renseigné'}</td>
          <td className="px-4 py-3"></td>
          <td className="px-4 py-3">{stagiaire.email || 'Non renseigné'}</td>
          <td className="px-4 py-3">
            {periode.appreciations.length > 0 && periode.appreciations[0].tuteur
              ? `${periode.appreciations[0].tuteur.nom} ${periode.appreciations[0].tuteur.prenom}`
              : 'Non renseigné'}
          </td>
          <td className="px-4 py-3">
            {periode.appreciations.length > 0 && periode.appreciations[0].tuteur
              ? `${periode.appreciations[0].tuteur.entreprise} `
              : 'Non renseigné'}
          </td>
          <td className="px-4 py-3">{periode.dateDebut}</td>
          <td className="px-4 py-3">{periode.dateFin}</td>
        </tr>
      ))}
    </>
  );

const Dashboard = () => {  
  const [totalStagiaires, setTotalStagiaires] = useState(0);
  const [totalTuteurs, setTotalTuteurs] = useState(0);
  const [totalStages, setTotalStages] = useState(0);
  const [stagiaires, setStagiaires] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term
  
  useEffect(() => {
    axios.get('http://localhost:8081/api/statistiques/listeappreciations')
      .then(res => {
        setStagiaires(res.data);
      })
      .catch(err => console.error('Erreur de chargement des stagiaires:', err));

    axios.get('http://localhost:8081/api/statistiques/totalestagiares')
      .then(res => setTotalStagiaires(res.data))
      .catch(err => console.error('Erreur chargement stagiaires:', err));

    axios.get('http://localhost:8081/api/statistiques/totaletuteurs')
      .then(res => setTotalTuteurs(res.data))
      .catch(err => console.error('Erreur chargement tuteurs:', err));

    axios.get('http://localhost:8081/api/statistiques/totalestages')
      .then(res => setTotalStages(res.data))
      .catch(err => console.error('Erreur chargement stages:', err));
  }, []);

  // Filter stagiaires based on search term
  const filteredStagiaires = stagiaires.filter(stagiaire =>
    `${stagiaire.nom} ${stagiaire.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (  
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 space-y-8">  
      <section className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-800 via-pink-700 to-red-600 rounded-2xl shadow-lg text-white overflow-hidden">  
        <div className="relative z-10 text-center space-y-4">  
          <h1 className="text-3xl font-bold tracking-wide">✨ Bienvenue dans votre Espace d'Évaluation ✨</h1>  
          <p className="text-sm leading-relaxed max-w-md mx-auto mb-4">  
            Découvrez une expérience fluide et intuitive pour évaluer vos stagiaires. Cliquez sur le bouton ci-dessous pour commencer votre évaluation!  
          </p>  
          <div className="mb-6" /> {/* Espace ajouté ici */}  
          <Link  
            to="/formulaire"  
            className="px-6 py-2 bg-white text-gray-800 font-bold rounded-full shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"  
          >  
            🚀 Commencez l'Évaluation  
          </Link>  
        </div>  
      </section>  

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">  
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">  
          <h2 className="text-2xl font-semibold text-gray-800">{totalStagiaires}</h2>  
          <p className="text-gray-500 mt-2">Total Stagiaires</p>  
        </div>  
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">  
          <h2 className="text-2xl font-semibold text-gray-800">{totalTuteurs}</h2>  
          <p className="text-gray-500 mt-2">Total Tuteurs</p>  
        </div>  
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">  
          <h2 className="text-2xl font-semibold text-gray-800">{totalStages}</h2>  
          <p className="text-gray-500 mt-2">Total Stages</p>  
        </div>  
      </section>  

      <section className="bg-white p-4 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold mb-2 text-purple-700">Liste des Stagiaires</h3>
        <input
          type="text"
          placeholder="Rechercher un stagiaire..."
          className="mb-4 p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-purple-100 text-purple-800">
              <th className="px-2 py-1 text-left border">Nom Complet</th>
              <th className="px-2 py-1 text-left border">Email</th>
              <th className="px-2 py-1 text-left border">Tuteur</th>
              <th className="px-2 py-1 text-left border">Entreprise</th>
              <th className="px-2 py-1 text-left border">Date Début</th>
              <th className="px-2 py-1 text-left border">Date Fin</th>
            </tr>
          </thead>
          <tbody>
            {filteredStagiaires.map((stagiaire, index) => (
              <TableRow key={index} stagiaire={stagiaire} />
            ))}
          </tbody>
        </table>
      </section> 

      <footer className="text-center text-gray-500 mt-4 text-sm">  
        © {new Date().getFullYear()} Master ISI. Tous droits réservés.  
      </footer>  
    </div>  
  );  
};  

export default Dashboard;
