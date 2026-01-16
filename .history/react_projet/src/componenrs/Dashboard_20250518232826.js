import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import jsPDF from "jspdf";
import { FiHome, FiUsers, FiUserCheck, FiFileText, FiSearch, FiClipboard, FiUser } from 'react-icons/fi';

import autoTable from "jspdf-autotable";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [totalStagiaires, setTotalStagiaires] = useState(0);
  const [totalTuteurs, setTotalTuteurs] = useState(0);
  const [totalStages, setTotalStages] = useState(0);
  const [stagiaires, setStagiaires] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [stagesParFiliere, setStagesParFiliere] = useState([]);
  const [stagesParEntreprise, setStagesParEntreprise] = useState([]);
  const [evolutionStages, setEvolutionStages] = useState([]);

 const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) {
      navigate('/'); 
      return;
    }

    
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  };

  axios.get('http://localhost:8081/api/statistiques/listeappreciations', config)
    .then(res => setStagiaires(res.data))
    .catch(err => console.error(err));

  axios.get('http://localhost:8081/api/statistiques/totalestagiares', config)
    .then(res => setTotalStagiaires(res.data))
    .catch(err => console.error(err));

  axios.get('http://localhost:8081/api/statistiques/totaletuteurs', config)
    .then(res => setTotalTuteurs(res.data))
    .catch(err => console.error(err));

  axios.get('http://localhost:8081/api/statistiques/totalestages', config)
    .then(res => setTotalStages(res.data))
    .catch(err => console.error(err));

  axios.get('http://localhost:8081/api/statistiques/stages-par-entreprise', config)
    .then(res => setStagesParEntreprise(res.data))
    .catch(err => console.error(err));

}, [navigate]);


  const flattenedData = stagiaires.flatMap((stagiaire) =>
    stagiaire.periodes.map((periode) => ({
      nom: stagiaire.nom,
      prenom: stagiaire.prenom,
      email: stagiaire.email || 'Non renseigné',
      dateDebut: periode.dateDebut,
      dateFin: periode.dateFin,
      appreciation: periode.appreciations[0] || {},
      periode: periode,
    }))
  );

  const filteredData = flattenedData.filter((row) =>
    `${row.nom} ${row.prenom}`.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const generatePDF = (row) => {
    const doc = new jsPDF();
    const appreciation = row.appreciation;
    const tuteur = appreciation?.tuteur;
    const stage = row.periode?.stage;


    const colors = {
      primary: [37, 99, 235],     
      secondary: [16, 185, 129],   
      accent: [251, 191, 36],   
      text: [30, 41, 59],     
      subtitle: [59, 130, 246],  
      tableHead: [37, 99, 235],    
      tableBorder: [203, 213, 225] 
    };


    doc.setFont("helvetica", "bold").setFontSize(22);
    doc.setTextColor(...colors.primary);
    doc.text("Évaluation Stage Étudiants", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(...colors.subtitle);
    doc.text("APPRECIATION DU TUTEUR DE STAGE", 105, 32, { align: "center" });

   
    doc.setFontSize(12).setFont("helvetica", "normal");
    doc.setTextColor(...colors.text);
    let y = 44;

    y += 8;

    
    const infoRows = [
      { label: "Stagiaire", value: `${row.nom} ${row.prenom}` },
      { label: "Email", value: row.email },
      { label: "Entreprise", value: stage?.entreprise ?? 'Non renseigné' },
      { label: "Tuteur", value: tuteur ? `${tuteur.nom} ${tuteur.prenom}` : 'Non renseigné' },
      { label: "Date du stage", value: `${row.dateDebut} au ${row.dateFin}` },
    ];

    infoRows.forEach(({ label, value }) => {
      doc.setFont("helvetica", "bold").setTextColor(...colors.text);
      doc.text(`${label} :`, 20, y);
      doc.setFont("helvetica", "normal").setTextColor(...colors.text);
      doc.text(value, 100, y);
      y += 7;
    });

    
    if (stage?.theme || stage?.description) {
      doc.setFont("helvetica", "bold").setTextColor(0, 0, 0);
      doc.text("Thème :", 20, y);
      doc.setFont("helvetica", "normal").setTextColor(0, 0, 0);
      const themeLine = `${stage?.theme ?? ""}${stage?.theme && stage?.description ? " - " : ""}${stage?.description ?? ""}`;
      const themeLines = doc.splitTextToSize(themeLine, 130);
      doc.text(themeLines, 100, y);
      y += 7 + (themeLines.length - 1) * 6;
    }


    if (stage?.objectif) {
      doc.setFont("helvetica", "bold").setTextColor(0, 0, 0);
      doc.text("Objectifs assignés à l'étudiant(e) :", 20, y);
      doc.setFont("helvetica", "normal").setTextColor(0, 0, 0);
      const objectives = stage.objectif
        .split("\n")
        .map((obj) => obj.trim())
        .filter(Boolean);
      const objLines = objectives.flatMap((obj) =>
        doc.splitTextToSize(`- ${obj}`, 130)
      );
      doc.text(objLines, 100, y);
      y += 7 + objLines.length * 6;
    }

  
    if (appreciation?.evaluations?.length > 0) {
      y += 5;
      doc.setFont("helvetica", "bold").setFontSize(16).setTextColor(...colors.subtitle);
      doc.text("APPRÉCIATIONS GLOBALES", 105, y, { align: "center" });
      y += 10;
      autoTable(doc, {
        head: [["Catégorie", "Valeur"]],
        body: appreciation.evaluations.map((ev) => [ev.categorie, ev.valeur]),
        startY: y,
        headStyles: {
          fillColor: colors.tableHead,
          textColor: [255, 255, 255],
          fontStyle: 'bold',
          fontSize: 11,
        },
        bodyStyles: {
          textColor: colors.text,
          fontSize: 10,
        },
        styles: {
          lineColor: colors.tableBorder,
          lineWidth: 0.2,
        }
      });
      y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : y + 30;
    }


    if (appreciation?.competences?.length > 0) {
    
      doc.addPage();
      y = 20;
      doc.setFontSize(16);
    doc.setTextColor(...colors.subtitle);
      doc.text("COMPÉTENCES ÉVALUÉES", 105, y, { align: "center" });
      y += 12;

      appreciation.competences.forEach((competence) => {
        if (competence.intitule !== "Compétences spécifiques") {
          doc.setFont("helvetica", "bold").setFontSize(12).setTextColor(0, 0, 0);
          doc.text(`${competence.intitule} (Note: ${competence.note}/20)`, 20, y);
          y += 5;
          autoTable(doc, {
            head: [["Sous-catégorie", "Valeur"]],
            body: competence.categories.map((cat) => [cat.intitule, cat.valeur]),
            startY: y,
            headStyles: {
              fillColor: colors.tableHead,
              textColor: [255, 255, 255],
              fontStyle: 'bold',
              fontSize: 10,
            },
            bodyStyles: {
              textColor: colors.text,
              fontSize: 10,
            },
            styles: {
              lineColor: colors.tableBorder,
              lineWidth: 0.2,
            }
          });
          y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : y + 30;
        }
      });

      
      const specificCompetence = appreciation.competences.find(
        (c) => c.intitule === "Compétences spécifiques"
      );
      if (specificCompetence) {
        doc.addPage();
        y = 20;
         doc.setFontSize(16);
          doc.setTextColor(...colors.subtitle);
        doc.text("COMPÉTENCES SPÉCIFIQUES", 105, y, { align: "center" });
        y += 12;
        autoTable(doc, {
          head: [["Sous-catégorie", "Évaluation"]],
          body: specificCompetence.categories.map((c) => [c.intitule, c.valeur?.toString() ?? ""]),
          startY: y,
          headStyles: {
            fillColor: colors.tableHead,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
          },
          bodyStyles: {
            textColor: colors.text,
            fontSize: 10,
          },
          styles: {
            lineColor: colors.tableBorder,
            lineWidth: 0.2,
          }
        });
      }
    }

    
    doc.save(`evaluation_${row.nom}_${row.prenom}.pdf`);
  };

  const columns = [
    {
      name: "Stagiaire",
      selector: row => `${row.nom} ${row.prenom}`,
      sortable: true,
    },
    { name: "Email", selector: row => row.email },
    {
      name: "Tuteur",
      selector: row => row.appreciation?.tuteur
        ? `${row.appreciation.tuteur.nom} ${row.appreciation.tuteur.prenom}`
        : "Non renseigné",
    },
    {
      name: "Entreprise",
      selector: row => row.appreciation?.tuteur?.entreprise ?? "Non renseigné",
    },
    { name: "Date Début", selector: row => row.dateDebut },
    { name: "Date Fin", selector: row => row.dateFin },
    {
      name: "Actions",
      cell: row => (
        <button
          onClick={() => generatePDF(row)}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center"
          title="Télécharger PDF"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
          </svg>
        </button>
      ),
    },
  ];

return (
  <div className="min-h-screen bg-gray-50 p-4 space-y-5 max-w-7xl mx-auto">

    {/* Lien pour commencer l'évaluation des stages */}
    <div className="flex justify-end mb-2">
      <a
        href="/formulaire"
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition font-medium text-sm"
      >
        <FiUserCheck className="text-base" />
        Commencer l'évaluation des stages
      </a>
    </div>

    <section className="grid grid-cols-1 sm:grid-cols-3 gap-2">
      {[{
        icon: <FiUser className="text-2xl" />,
        value: totalStagiaires,
        label: "Total Stagiaires",
        bgFrom: "from-blue-500",
        bgTo: "to-blue-700",
        textColor: "text-blue-50"
      }, {
        icon: <FiUsers className="text-2xl" />,
        value: totalTuteurs,
        label: "Total Tuteurs",
        bgFrom: "from-green-500",
        bgTo: "to-green-700",
        textColor: "text-green-50"
      }, {
        icon: <FiFileText className="text-2xl" />,
        value: totalStages,
        label: "Total Stages",
        bgFrom: "from-yellow-400",
        bgTo: "to-yellow-600",
        textColor: "text-yellow-50"
      }].map(({ icon, value, label, bgFrom, bgTo, textColor }, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-3 rounded-xl shadow-md text-center text-white flex flex-col items-center transition-transform transform hover:scale-105`}
          style={{ minWidth: '110px', maxWidth: '140px' }}
        >
          <div className="mb-0.5">{icon}</div>
          <h2 className="text-xl font-bold tracking-tight">{value}</h2>
          <p className={`mt-0.5 text-xs font-medium ${textColor}`}>{label}</p>
        </div>
      ))}
    </section>

    <section className="bg-white p-4 rounded-2xl shadow-md mt-4 flex flex-col md:flex-row gap-4">

      <div className="md:flex-1 min-w-[220px] max-w-full">
        <h3 className="text-base font-semibold mb-2 text-blue-700 flex items-center gap-2 select-none">
          <FiHome className="text-lg" /> Stages par Entreprise
        </h3>
        <div className="overflow-x-auto">
          <div className="min-w-[220px]">
            <Bar
              data={{
                labels: stagesParEntreprise.map(item => item.entreprise),
                datasets: [{
                  label: 'Stages',
                  data: stagesParEntreprise.map(item => item.count),
                  backgroundColor: [
                    '#3B82F6', 
                    '#22C55E',
                    '#F59E42', 
                    '#F43F5E',
                    '#6366F1', 
                    '#FBBF24', 
                    '#14B8A6'  
                  ],
                  borderRadius: 6,
                  barPercentage: 0.5,
                }],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: { enabled: true },
                  title: {
                    display: true,
                    text: 'Nombre de stages par entreprise',
                    font: { size: 13 }
                  }
                },
                scales: {
                  x: {
                    ticks: { color: '#334155', font: { size: 10 } }, 
                    grid: { display: false }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: '#334155', font: { size: 10 } },
                    grid: { color: '#E5E7EB' } 
                  }
                }
              }}
              style={{ height: 220, width: '100%' }}
            />
          </div>
        </div>
      </div>

      <div className="md:flex-1 flex flex-col max-w-full">
        <h3 className="text-base font-semibold mb-2 text-blue-700 select-none flex items-center gap-2">
          <FiClipboard className="text-lg" /> Liste des Stagiaires
        </h3>
        <div className="relative w-full max-w-md mb-2">
          <FiSearch className="absolute top-2.5 left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher un stagiaire..."
            className="pl-9 p-1.5 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-xs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto max-h-[220px]">
          <DataTable
            columns={columns}
            data={filteredData}
            pagination
            highlightOnHover
            striped
            dense
            customStyles={{
              headCells: {
                style: {
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  backgroundColor: '#EFF6FF',
                  color: '#1E293B',
                },
              },
              cells: {
                style: {
                  paddingLeft: '6px',
                  paddingRight: '6px',
                  fontSize: '11px',
                  lineHeight: '1.1',
                  color: '#334155', 
                },
              },
              rows: {
                style: {
                  minHeight: '24px',
                  backgroundColor: '#FFFFFF',
                },
                stripedStyle: {
                  backgroundColor: '#F1F5F9', 
                }
              },
              pagination: {
                style: {
                  padding: '2px 4px',
                },
                pageButtonsStyle: {
                  padding: '2px',
                  fontSize: '11px',
                  color: '#2563EB', 
                }
              }
            }}
          />
        </div>
      </div>
    </section>
  </div>
);



};

export default Dashboard;
