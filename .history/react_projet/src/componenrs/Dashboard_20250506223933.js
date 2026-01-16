 
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

// Constants for data  
const PIE_DATA = [  
  { name: "Excellent", value: 20 },  
  { name: "Très bien", value: 25 },  
  { name: "Bien", value: 30 },  
  { name: "À améliorer", value: 15 },  
  { name: "Insuffisant", value: 10 },  
];  

const BAR_DATA = [  
  { competence: "Technique", moyenne: 4.1 },  
  { competence: "Communication", moyenne: 3.5 },  
  { competence: "Autonomie", moyenne: 3.8 },  
  { competence: "Esprit d'équipe", moyenne: 4.0 },  
];  

const STAGES_EN_ATTENTE = [  
  { name: "Alice Dupont", end: "03/05/2025", status: "À évaluer" },  
  { name: "Mehdi Lahlou", end: "07/05/2025", status: "En cours" },  
  { name: "Sarah Bensaid", end: "09/05/2025", status: "Non commencé" },  
];  

const KPI = [  
  { title: "Stages évalués", value: 58 },  
  { title: "Stages en cours", value: 12 },  
  { title: "Note moyenne", value: "3.7 / 5" },  
  { title: "Tuteurs actifs", value: 15 },  
];  

// KPIItem Component  
const KPIItem = ({ title, value }) => (  
  <div className="bg-white p-6 rounded-xl shadow-lg text-center transition-transform transform hover:scale-105 hover:shadow-xl duration-300">  
    <h2 className="text-2xl font-semibold text-gray-800">{value}</h2>  
    <p className="text-gray-500 mt-2">{title}</p>  
  </div>  
);  

KPIItem.propTypes = {  
  title: PropTypes.string.isRequired,  
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,  
};  

// PieChartComponent  
const PieChartComponent = ({ data }) => {  
  const COLORS = ["#4CAF50", "#2196F3", "#FFC107", "#FF5722", "#E91E63"];  
  
  return (  
    <ResponsiveContainer width="100%" height={300}>  
      <PieChart>  
        <Pie  
          data={data}  
          cx="50%"  
          cy="50%"  
          outerRadius={100}  
          dataKey="value"  
          labelLine={false}  
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}  
        >  
          {data.map((entry, index) => (  
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />  
          ))}  
        </Pie>  
        <Legend verticalAlign="top" height={36} />  
      </PieChart>  
    </ResponsiveContainer>  
  );  
};  

PieChartComponent.propTypes = {  
  data: PropTypes.arrayOf(PropTypes.shape({  
    name: PropTypes.string.isRequired,  
    value: PropTypes.number.isRequired,  
  })).isRequired,  
};  

// BarChartComponent  
const BarChartComponent = ({ data }) => (  
  <ResponsiveContainer width="100%" height={300}>  
    <BarChart data={data}>  
      <XAxis dataKey="competence" />  
      <YAxis domain={[0, 5]} />  
      <Tooltip />  
      <Bar dataKey="moyenne" fill="#8884d8" radius={[10, 10, 0, 0]} />  
    </BarChart>  
  </ResponsiveContainer>  
);  

BarChartComponent.propTypes = {  
  data: PropTypes.arrayOf(PropTypes.shape({  
    competence: PropTypes.string.isRequired,  
    moyenne: PropTypes.number.isRequired,  
  })).isRequired,  
};  

// TableRow Component  
  

TableRow.propTypes = {  
  stagiaire: PropTypes.shape({  
    name: PropTypes.string.isRequired,  
    end: PropTypes.string.isRequired,  
    status: PropTypes.string.isRequired,  
  }).isRequired,  
};  

const Dashboard = () => {  
  const [totalStagiaires, setTotalStagiaires] = useState(0);
  const [totalTuteurs, setTotalTuteurs] = useState(0);
  const [totalStages, setTotalStages] = useState(0);
  const [stagiaires, setStagiaires] = useState([]);
  
 
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
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-purple-100 text-purple-800">
              <th className="px-2 py-1 text-left border">Nom Complet</th>
              <th className="px-2 py-1 text-left border">Email</th>
              <th className="px-2 py-1 text-left border">Entreprise</th>
              <th className="px-2 py-1 text-left border">Date Début</th>
              <th className="px-2 py-1 text-left border">Date Fin</th>
            </tr>
          </thead>
          <tbody>
          {stagiaires.map((stagiaire, index) => (
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
