import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
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

  useEffect(() => {
    axios.get('http://localhost:8081/api/statistiques/listeappreciations')
      .then(res => setStagiaires(res.data));

    axios.get('http://localhost:8081/api/statistiques/totalestagiares')
      .then(res => setTotalStagiaires(res.data));

    axios.get('http://localhost:8081/api/statistiques/totaletuteurs')
      .then(res => setTotalTuteurs(res.data));

    axios.get('http://localhost:8081/api/statistiques/totalestages')
      .then(res => setTotalStages(res.data));

   

    axios.get('http://localhost:8081/api/statistiques/stages-par-entreprise')
      .then(res => setStagesParEntreprise(res.data));

  }, []);

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

  // Génération du PDF avec style de tableau amélioré (borders, alternance, header color, padding)
  const generatePDF = (row) => {
    const doc = new jsPDF();

    // Page 1: APPRECIATION DU TUTEUR DE STAGE
    doc.setFont("helvetica", "bold").setFontSize(22);
    doc.setTextColor(0, 51, 102);
    doc.text("Évaluation Stage Étudiants", 105, 20, { align: "center" });

    doc.setFontSize(18);
    doc.setTextColor(0, 102, 204);
    doc.text("APPRECIATION DU TUTEUR DE STAGE", 105, 40, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    const tuteur = row.appreciation?.tuteur || {};
    const stage = row.periode?.stage || {};
    const details = [
      { label: "Nom et Prénom de Stagiaire :", value: `${row.nom} ${row.prenom}` },
      { label: "Email de Stagiaire :", value: row.email },
      { label: "Nom de l'entreprise :", value: stage.entreprise ?? "Non renseigné" },
      { label: "Nom et Prénom Tuteur :", value: `${tuteur.nom ?? ""} ${tuteur.prenom ?? ""}` },
      { label: "Email de Tuteur :", value: tuteur.email ?? "Non renseigné" },
      { label: "Période de stage du :", value: `${row.dateDebut} au ${row.dateFin}` },
      {
        label: "THEME DU PROJET PRINCIPAL CONFIE A L'ETUDIANT(E) :",
        value: doc.splitTextToSize(stage.description ?? "", 160).join("\n")
      }
    ];

    let yStart = 55;
    details.forEach((detail, index) => {
      doc.setFont("helvetica", "bold").setFontSize(14);
      doc.setTextColor(0, 0, 0);
      let labelWidth = doc.getTextWidth(detail.label);
      doc.text(detail.label, 20, yStart + index * 10);
      doc.setFont("helvetica", "normal").setFontSize(12);

      // Handle long text wrapping for the value
      const maxWidth = 160;
      const lines = doc.splitTextToSize(detail.value, maxWidth);
      lines.forEach((line, lineIndex) => {
        doc.text(line, 20 + labelWidth + 5, yStart + index * 10 + lineIndex * 6);
      });
    });

    // Display objectives as a list
    if (stage.objectif) {
      const objectives = stage.objectif.split("\n").filter(Boolean);
      const objLabel = "OBJECTIFS ASSIGNES A L'ETUDIANT(E):";
      doc.setFont("helvetica", "bold").setFontSize(14);
      doc.text(objLabel, 20, yStart + details.length * 10);
      doc.setFont("helvetica", "normal").setFontSize(12);
      objectives.forEach((obj, idx) => {
        doc.text(`- ${obj}`, 25, yStart + details.length * 10 + 6 + idx * 6);
      });
    }

    // APPRECIATIONS GLOBALES SUR L'ETUDIANT(E)
    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.text("APPRECIATIONS GLOBALES SUR L'ETUDIANT(E)", 105, 160, { align: "center" });

    const globalAppreciations = (row.appreciation?.evaluations || []).map((evaluation) => ({
      label: evaluation.categorie,
      value: evaluation.valeur,
    }));

    // Draw improved table for global appreciations
    let startY = 170;
    const tableColumnWidths = [100, 80];
    const tableHeaders = ["Catégorie", "Valeur"];
    const rowHeight = 10;

    // Table header with background color and white text
    doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(255, 255, 255);
    doc.setFillColor(0, 102, 204);
    doc.roundedRect(20, startY, tableColumnWidths[0], rowHeight, 2, 2, 'F');
    doc.roundedRect(120, startY, tableColumnWidths[1], rowHeight, 2, 2, 'F');
    doc.text(tableHeaders[0], 25, startY + 7);
    doc.text(tableHeaders[1], 125, startY + 7);

    startY += rowHeight;

    // Table rows with border, alternate row color, and padding
    globalAppreciations.forEach((appreciation, idx) => {
      // Alternate row color
      if (idx % 2 === 0) {
        doc.setFillColor(239, 246, 255); // light blue
        doc.rect(20, startY, tableColumnWidths[0], rowHeight, 'F');
        doc.rect(120, startY, tableColumnWidths[1], rowHeight, 'F');
      } else {
        doc.setFillColor(255, 255, 255);
        doc.rect(20, startY, tableColumnWidths[0], rowHeight, 'F');
        doc.rect(120, startY, tableColumnWidths[1], rowHeight, 'F');
      }
      // Borders
      doc.setDrawColor(0, 102, 204);
      doc.rect(20, startY, tableColumnWidths[0], rowHeight);
      doc.rect(120, startY, tableColumnWidths[1], rowHeight);

      doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(33, 37, 41);
      doc.text(appreciation.label, 25, startY + 7);
      doc.text(appreciation.value, 125, startY + 7);
      startY += rowHeight;
    });

    // Add a new page for EVALUATIONS DES COMPETENCES DE L'ETUDIANT(E)
    doc.addPage();

    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.text("EVALUATIONS DES COMPETENCES DE L'ETUDIANT(E)", 105, 20, { align: "center" });
    doc.setTextColor(0, 0, 0);

    startY = 30;

    (row.appreciation?.competences || []).forEach((competence) => {
      if (competence.intitule !== "Compétences spécifiques") {
        // Section title
        doc.setFontSize(14).setFont("helvetica", "bold").setTextColor(0, 51, 102);
        doc.text(`${competence.intitule} (Note: ${competence.note}/20)`, 20, startY);
        startY += rowHeight;

        // Section underline
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 102, 204);
        doc.line(20, startY - 5, 190, startY - 5);

        // Table header
        doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(255, 255, 255);
        doc.setFillColor(0, 102, 204);
        doc.roundedRect(30, startY, 90, rowHeight, 2, 2, 'F');
        doc.roundedRect(120, startY, 50, rowHeight, 2, 2, 'F');
        doc.text("Sous-catégories", 35, startY + 7);
        doc.text("Évaluation", 125, startY + 7);

        startY += rowHeight;

        // Table rows
        competence.categories.forEach((subcat, idx) => {
          // Alternate row color
          if (idx % 2 === 0) {
            doc.setFillColor(241, 245, 249); // light gray
            doc.rect(30, startY, 90, rowHeight, 'F');
            doc.rect(120, startY, 50, rowHeight, 'F');
          } else {
            doc.setFillColor(255, 255, 255);
            doc.rect(30, startY, 90, rowHeight, 'F');
            doc.rect(120, startY, 50, rowHeight, 'F');
          }
          // Borders
          doc.setDrawColor(0, 102, 204);
          doc.rect(30, startY, 90, rowHeight);
          doc.rect(120, startY, 50, rowHeight);

          doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(33, 37, 41);
          doc.text(subcat.intitule, 35, startY + 7);
          doc.text(subcat.valeur?.toString() ?? "", 125, startY + 7);
          startY += rowHeight;

          if (startY > 270) {
            doc.addPage();
            startY = 20;
          }
        });

        startY += 10;
      }
    });

    // Add a new page for "Compétences spécifiques"
    const specificCompetence = (row.appreciation?.competences || []).find(
      (competence) => competence.intitule === "Compétences spécifiques"
    );

    if (specificCompetence) {
      doc.addPage();
      startY = 20;

      doc.setFontSize(14).setFont("helvetica", "bold").setTextColor(0, 51, 102);
      doc.text(`${specificCompetence.intitule}`, 20, startY);
      startY += rowHeight;

      doc.setLineWidth(0.5);
      doc.setDrawColor(0, 102, 204);
      doc.line(20, startY - 5, 190, startY - 5);

      // Table header
      doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(255, 255, 255);
      doc.setFillColor(0, 102, 204);
      doc.roundedRect(30, startY, 90, rowHeight, 2, 2, 'F');
      doc.roundedRect(120, startY, 50, rowHeight, 2, 2, 'F');
      doc.text("Sous-catégories", 35, startY + 7);
      doc.text("Évaluation", 125, startY + 7);

      startY += rowHeight;

      // Table rows
      specificCompetence.categories.forEach((subcat, idx) => {
        if (idx % 2 === 0) {
          doc.setFillColor(241, 245, 249); // light gray
          doc.rect(30, startY, 90, rowHeight, 'F');
          doc.rect(120, startY, 50, rowHeight, 'F');
        } else {
          doc.setFillColor(255, 255, 255);
          doc.rect(30, startY, 90, rowHeight, 'F');
          doc.rect(120, startY, 50, rowHeight, 'F');
        }
        doc.setDrawColor(0, 102, 204);
        doc.rect(30, startY, 90, rowHeight);
        doc.rect(120, startY, 50, rowHeight);

        doc.setFont("helvetica", "normal").setFontSize(12).setTextColor(33, 37, 41);
        doc.text(subcat.intitule, 35, startY + 7);
        doc.text(subcat.valeur?.toString() ?? "", 125, startY + 7);
        startY += rowHeight;

        if (startY > 270) {
          doc.addPage();
          startY = 20;
        }
      });
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
