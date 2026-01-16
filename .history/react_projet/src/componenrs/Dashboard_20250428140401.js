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
return (  
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-8 space-y-16">  
       { /* Hero Section */}  
            <section className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 rounded-3xl shadow-2xl text-white">  
                <div className="relative z-10 text-center space-y-6">  
                <h1 className="text-5xl font-extrabold animate-fade-in">✨ Bienvenue dans votre Univers d'Évaluation ✨</h1>  
                <p className="text-xl leading-relaxed animate-fade-in delay-200">  
                    Plongez dans une expérience d'évaluation extraordinaire et commencez votre aventure magique dès maintenant !  
                </p>  
                <Link to="/formulaire" className="mt-6 px-8 py-4 bg-white text-gray-800 font-bold rounded-full shadow-lg hover:bg-gray-300 hover:shadow-xl transition-all duration-300 transform hover:scale-105" aria-label="Commencer l'Évaluation">  
                    🚀 Lancer l'Aventure  
                </Link>  
                </div>  
                <div className="absolute inset-0 bg-gradient-to-r from-purple-700 via-pink-600 to-red-500 opacity-60 rounded-3xl blur-xl"></div>  
                <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-20 rounded-full animate-pulse"></div>  
                <div className="absolute bottom-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full animate-pulse delay-300"></div>  
            </section>  

            {/* Dashboard Section */}  

        {/* KPI Cards */}  
        <section className="grid grid-cols-1 md:grid-cols-4 gap-8">  
            {KPI.map((item, index) => (  
                <KPIItem key={index} title={item.title} value={item.value} />  
            ))}  
        </section>  

        {/* Graphs */}  
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">  
            <div className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">  
                <h3 className="text-2xl font-bold mb-4 text-purple-700">Répartition des évaluations</h3>  
                <PieChartComponent data={PIE_DATA} />  
            </div>  

            <div className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">  
                <h3 className="text-2xl font-bold mb-4 text-purple-700">Moyenne par compétence</h3>  
                <BarChartComponent data={BAR_DATA} />  
            </div>  
        </section>  

        {/* Pending Evaluations Table */}  
        <section className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-300">  
            <h3 className="text-2xl font-bold mb-4 text-purple-700">Stages en Attente d'Évaluation</h3>  
            <table className="w-full table-auto border-collapse border rounded-lg overflow-hidden">  
                <thead>  
                    <tr className="bg-purple-100 text-purple-800">  
                        <th className="px-4 py-3 text-left border">Stagiaire</th>  
                        <th className="px-4 py-3 text-left border">Date de Fin</th>  
                        <th className="px-4 py-3 text-left border">Statut</th>  
                    </tr>  
                </thead>  
                <tbody>  
                    {STAGES_EN_ATTENTE.map((stagiaire, index) => <TableRow key={index} stagiaire={stagiaire} />)}  
                </tbody>  
            </table>  
        </section>  

        {/* Footer */}  
        <footer className="text-center text-gray-500 mt-8 animate-fade-in delay-500">  
            © {new Date().getFullYear()} Master ISI. Tous droits réservés.  
        </footer>  
    </div>  
);  
};  

export default Dashboard;
