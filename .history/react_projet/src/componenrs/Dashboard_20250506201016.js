 
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
const TableRow = ({ stagiaire }) => (  
  <tr className="border-b hover:bg-gray-50 transition-colors duration-300">  
    <td className="px-4 py-3">{stagiaire.name}</td>  
    <td className="px-4 py-3">{stagiaire.end}</td>  
    <td className="px-4 py-3">{stagiaire.status}</td>  
  </tr>  
);  

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
  useEffect(() => {
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
  </div>
);  
};  

export default Dashboard;
