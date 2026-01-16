import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import { Navigate } from 'react-router-dom';
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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // redirige vers la page d'authentification
      return;
    }

    // ici appels axios...
  
  // Configurer les headers avec le token
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

  // Génération du PDF avec organisation et couleurs harmonisées
  // Génération du PDF organisé et harmonisé
  const generatePDF = (row) => {
    const doc = new jsPDF();
    const appreciation = row.appreciation;
    const tuteur = appreciation?.tuteur;
    const stage = row.periode?.stage;

    // Palette de couleurs harmonisées
    const colors = {
      primary: [37, 99, 235],      // blue-600
      secondary: [16, 185, 129],   // emerald-500
      accent: [251, 191, 36],      // yellow-400
      text: [30, 41, 59],          // slate-800
      subtitle: [59, 130, 246],    // blue-500
      tableHead: [37, 99, 235],    // blue-600 (background for table head)
      tableBorder: [203, 213, 225] // slate-300
    };

    // Titre principal
    doc.setFont("helvetica", "bold").setFontSize(22);
    doc.setTextColor(...colors.primary);
    doc.text("Évaluation Stage Étudiants", 105, 20, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(...colors.subtitle);
    doc.text("APPRECIATION DU TUTEUR DE STAGE", 105, 32, { align: "center" });

    // Informations générales regroupées
    doc.setFontSize(12).setFont("helvetica", "normal");
    doc.setTextColor(...colors.text);
    let y = 44;

    y += 8;

    // Informations générales organisées
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

    // Thème du projet principal
    if (stage?.theme || stage?.description) {
      doc.setFont("helvetica", "bold").setTextColor(0, 0, 0);
      doc.text("Thème :", 20, y);
      doc.setFont("helvetica", "normal").setTextColor(0, 0, 0);
      const themeLine = `${stage?.theme ?? ""}${stage?.theme && stage?.description ? " - " : ""}${stage?.description ?? ""}`;
      const themeLines = doc.splitTextToSize(themeLine, 130);
      doc.text(themeLines, 100, y);
      y += 7 + (themeLines.length - 1) * 6;
    }

    // Objectifs du projet
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

    // Appréciations globales
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

    // Compétences évaluées
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

      // Compétences spécifiques sur une nouvelle page
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

    // Sauvegarde du PDF
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
  <div className="min-h-screen bg-gray-50 p-6 space-y-8 max-w-7xl mx-auto">
    {/* Cartes résumé compactes */}
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[{
        icon: <FiUser className="text-4xl" />,
        value: totalStagiaires,
        label: "Total Stagiaires",
        bgFrom: "from-blue-500",
        bgTo: "to-blue-700",
        textColor: "text-blue-50"
      }, {
        icon: <FiUsers className="text-4xl" />,
        value: totalTuteurs,
        label: "Total Tuteurs",
        bgFrom: "from-green-500",
        bgTo: "to-green-700",
        textColor: "text-green-50"
      }, {
        icon: <FiFileText className="text-4xl" />,
        value: totalStages,
        label: "Total Stages",
        bgFrom: "from-yellow-400",
        bgTo: "to-yellow-600",
        textColor: "text-yellow-50"
      }].map(({ icon, value, label, bgFrom, bgTo, textColor }, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-6 rounded-2xl shadow-md text-center text-white flex flex-col items-center transition-transform transform hover:scale-105`}
          style={{ minWidth: '160px' }}
        >
          <div className="mb-1">{icon}</div>
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          <p className={`mt-1 text-sm font-medium ${textColor}`}>{label}</p>
        </div>
      ))}
    </section>

    <section className="bg-white p-5 rounded-2xl shadow-md mt-6 flex flex-col md:flex-row gap-6">
      {/* Bar chart à gauche */}
      <div className="md:flex-1 min-w-[300px] max-w-full">
        <h3 className="text-lg font-semibold mb-3 text-blue-700 flex items-center gap-2 select-none">
          <FiHome className="text-xl" /> Stages par Entreprise
        </h3>
        <div className="overflow-x-auto">
          <div className="min-w-[300px]">
            <Bar
              data={{
                labels: stagesParEntreprise.map(item => item.entreprise),
                datasets: [{
                  label: 'Stages',
                  data: stagesParEntreprise.map(item => item.count),
                  backgroundColor: [
                    '#3B82F6', // blue-500
                    '#22C55E', // green-500
                    '#F59E42', // amber-500
                    '#F43F5E', // rose-500
                    '#6366F1', // indigo-500
                    '#FBBF24', // yellow-400
                    '#14B8A6'  // teal-500
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
                    font: { size: 14 }
                  }
                },
                scales: {
                  x: {
                    ticks: { color: '#334155', font: { size: 11 } }, // slate-700
                    grid: { display: false }
                  },
                  y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, color: '#334155', font: { size: 11 } },
                    grid: { color: '#E5E7EB' } // gray-200
                  }
                }
              }}
              style={{ height: 300, width: '100%' }}
            />
          </div>
        </div>
      </div>

      {/* Table à droite */}
      <div className="md:flex-1 flex flex-col max-w-full">
        <h3 className="text-lg font-semibold mb-3 text-blue-700 select-none flex items-center gap-2">
          <FiClipboard className="text-xl" /> Liste des Stagiaires
        </h3>
        <div className="relative w-full max-w-md mb-4">
          <FiSearch className="absolute top-3 left-3 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Rechercher un stagiaire..."
            className="pl-9 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-y-auto max-h-[320px]">
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
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  backgroundColor: '#EFF6FF', // blue-50
                  color: '#1E293B', // slate-800
                },
              },
              cells: {
                style: {
                  paddingLeft: '8px',
                  paddingRight: '8px',
                  fontSize: '12px',
                  lineHeight: '1.2',
                  color: '#334155', // slate-700
                },
              },
              rows: {
                style: {
                  minHeight: '32px',
                  backgroundColor: '#FFFFFF',
                },
                stripedStyle: {
                  backgroundColor: '#F1F5F9', // slate-100
                }
              },
              pagination: {
                style: {
                  padding: '4px 8px',
                },
                pageButtonsStyle: {
                  padding: '4px',
                  fontSize: '12px',
                  color: '#2563EB', // blue-600
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
