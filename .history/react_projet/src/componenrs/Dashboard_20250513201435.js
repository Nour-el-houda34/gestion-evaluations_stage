import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
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
import jsPDF from "jspdf";

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
      <section className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-r from-purple-900 via-pink-700 to-red-600 rounded-3xl shadow-2xl text-white overflow-hidden transform hover:scale-105 transition-transform duration-500">  
        <div className="relative z-10 text-center space-y-6">  
          <h1 className="text-4xl font-extrabold tracking-wide drop-shadow-lg">✨ Bienvenue dans votre Espace d'Évaluation ✨</h1>  
          <p className="text-base leading-relaxed max-w-lg mx-auto mb-6">  
            Découvrez une expérience fluide et intuitive pour évaluer vos stagiaires. Cliquez sur le bouton ci-dessous pour commencer votre évaluation!  
          </p>  
          <Link  
            to="/formulaire"  
            className="px-8 py-3 bg-white text-gray-800 font-bold rounded-full shadow-lg hover:bg-gray-300 transition-all duration-300 transform hover:scale-110"  
          >  
            🚀 Commencez l'Évaluation  
          </Link>  
        </div>  
      </section>  

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">  
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-transform duration-300">  
          <h2 className="text-3xl font-extrabold text-gray-800">{totalStagiaires}</h2>  
          <p className="text-gray-500 mt-3">Total Stagiaires</p>  
        </div>  
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-transform duration-300">  
          <h2 className="text-3xl font-extrabold text-gray-800">{totalTuteurs}</h2>  
          <p className="text-gray-500 mt-3">Total Tuteurs</p>  
        </div>  
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-transform duration-300">  
          <h2 className="text-3xl font-extrabold text-gray-800">{totalStages}</h2>  
          <p className="text-gray-500 mt-3">Total Stages</p>  
        </div>  
      </section>  

      <section className="bg-white p-6 rounded-3xl shadow-2xl">  
        <h3 className="text-xl font-bold mb-4 text-purple-800">Liste des Stages</h3>  
        <input  
          type="text"  
          placeholder="Rechercher un stagiaire..."  
          className="mb-6 p-3 border rounded-lg w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"  
          value={searchTerm}  
          onChange={(e) => setSearchTerm(e.target.value)}  
        />  

        <DataTable  
          columns={[  
            { name: "Stagiaire", selector: row => `${row.nom} ${row.prenom}`, sortable: true },  
            { name: "Email", selector: row => row.email || 'Non renseigné', sortable: true },  
            { name: "Tuteur", selector: row => row.periodes[0]?.appreciations[0]?.tuteur ? `${row.periodes[0].appreciations[0].tuteur.nom} ${row.periodes[0].appreciations[0].tuteur.prenom}` : 'Non renseigné', sortable: true },  
            { name: "Entreprise", selector: row => row.periodes[0]?.appreciations[0]?.tuteur?.entreprise || 'Non renseigné', sortable: true },  
            { name: "Date Début", selector: row => row.periodes[0]?.dateDebut, sortable: true },  
            { name: "Date Fin", selector: row => row.periodes[0]?.dateFin, sortable: true },  
            {  
              name: "Actions",  
              cell: row => (  
                <button  
                  onClick={() => {  
                    const tableRow = TableRow({ stagiaire: row });  
                    tableRow.props.children[0].props.children[6].props.children.props.onClick();  
                  }}  
                  className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300 transform hover:scale-110 shadow-lg"  
                  title="Télécharger Fiche d'évaluation"  
                >  
                  <svg  
                    xmlns="http://www.w3.org/2000/svg"  
                    className="h-6 w-6"  
                    fill="currentColor"  
                    viewBox="0 0 24 24"  
                  >  
                    <path d="M12 16l4-5h-3V4h-2v7H8l4 5zm-6 2h12v2H6v-2z" />  
                  </svg>  
                </button>  
              ),  
            },  
          ]}  
          data={filteredStagiaires || []}  
          pagination
          paginationPerPage={10} // Set the number of rows per page
          paginationRowsPerPageOptions={[5, 10, 15, 20]} // Add options for rows per page
          highlightOnHover  
          striped  
          customStyles={{  
            rows: {  
              style: {  
                minHeight: '60px',  
              },  
            },  
            headCells: {  
              style: {  
                backgroundColor: '#f3f4f6',  
                fontWeight: 'bold',  
                fontSize: '14px',  
              },  
            },  
          }}  
        />  
      </section>  

      <footer className="text-center text-gray-500 mt-6 text-sm">  
        © {new Date().getFullYear()} Master ISI. Tous droits réservés.  
      </footer>  
    </div>  
  );  
};  

export default Dashboard;

