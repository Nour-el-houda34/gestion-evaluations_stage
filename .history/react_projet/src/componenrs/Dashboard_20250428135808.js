import React from "react";  
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
  <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-2xl transition-shadow duration-300">  
    <h2 className="text-2xl font-bold text-gray-800">{value}</h2>  
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
        <Legend />  
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
  <tr className="border-b">  
    <td className="px-4 py-2">{stagiaire.name}</td>  
    <td className="px-4 py-2">{stagiaire.end}</td>  
    <td className="px-4 py-2">{stagiaire.status}</td>  
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
  return (  
    <div className="min-h-screen bg-gray-100 p-8 space-y-16">  
      {/* Hero Section */}  
<section className="relative flex flex-col items-center justify-center p-4 ">  
  <div className="relative z-10 text-center">  
    <h1 className="text-3xl font-bold animate-fade-in">Bienvenue dans votre Espace d'Évaluation ✨</h1>  
    <p className="text-lg leading-relaxed mt-2 animate-fade-in delay-200">  
      Cliquez ci-dessous pour commencer votre évaluation !  
    </p>  
    <Link to="/formulaire" className="mt-4 p-3 bg-white text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition-all duration-300" aria-label="Commencer l'Évaluation">  
      🚀 Commencer l'Évaluation  
    </Link>  
  </div>  
</section>  

      {/* Dashboard Section */}  
      <header className="text-center">  
        <h1 className="text-4xl font-extrabold text-indigo-700">Tableau de Bord</h1>  
        <p className="text-lg text-gray-600">Suivez l'évolution des évaluations de vos stagiaires et découvrez des insights clés.</p>  
      </header>  

      {/* KPI Cards */}  
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">  
        {KPI.map((item, index) => (  
          <KPIItem key={index} title={item.title} value={item.value} />  
        ))}  
      </section>  

      {/* Graphs */}  
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">  
        <div className="bg-white p-6 rounded-2xl shadow-lg">  
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Répartition des évaluations</h3>  
          <PieChartComponent data={PIE_DATA} />  
        </div>  

        <div className="bg-white p-6 rounded-2xl shadow-lg">  
          <h3 className="text-xl font-semibold mb-4 text-indigo-700">Moyenne par compétence</h3>  
          <BarChartComponent data={BAR_DATA} />  
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
            {STAGES_EN_ATTENTE.map((stagiaire, index) => <TableRow key={index} stagiaire={stagiaire} />)}  
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