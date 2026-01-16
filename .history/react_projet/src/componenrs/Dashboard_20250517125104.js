import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { Bar, Line } from 'react-chartjs-2';
import jsPDF from "jspdf";
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

  const generatePDF = (row) => {
    const doc = new jsPDF();
    const appreciation = row.appreciation;
    const tuteur = appreciation?.tuteur;
    const stage = row.periode?.stage;

    doc.setFont("helvetica", "bold").setFontSize(18);
    doc.text("Fiche d'Évaluation de Stage", 105, 20, { align: "center" });

    doc.setFontSize(12).setFont("helvetica", "normal");
    doc.text(`Stagiaire: ${row.nom} ${row.prenom}`, 20, 40);
    doc.text(`Email: ${row.email}`, 20, 48);
    doc.text(`Entreprise: ${stage?.entreprise ?? 'Non renseigné'}`, 20, 56);
    doc.text(`Tuteur: ${tuteur ? `${tuteur.nom} ${tuteur.prenom}` : 'Non renseigné'}`, 20, 64);
    doc.text(`Date du stage: ${row.dateDebut} au ${row.dateFin}`, 20, 72);

    let y = 80;

    if (appreciation?.evaluations?.length > 0) {
      doc.text("Appréciations globales:", 20, y);
      y += 5;
      autoTable(doc, {
        head: [["Catégorie", "Valeur"]],
        body: appreciation.evaluations.map((ev) => [ev.categorie, ev.valeur]),
        startY: y,
      });
      y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 10 : y + 30;
    }

    if (appreciation?.competences?.length > 0) {
      doc.addPage();
      y = 20;
      doc.text("Compétences évaluées:", 20, y);
      y += 10;

      appreciation.competences.forEach((competence) => {
        if (competence.intitule !== "Compétences spécifiques") {
          doc.setFont("helvetica", "bold").text(`${competence.intitule} (Note: ${competence.note}/20)`, 20, y);
          y += 5;
          autoTable(doc, {
            head: [["Sous-catégorie", "Valeur"]],
            body: competence.categories.map((cat) => [cat.intitule, cat.valeur]),
            startY: y,
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
        doc.setFontSize(14).setFont("helvetica", "bold");
        doc.text(specificCompetence.intitule, 20, y);
        y += 10;
        autoTable(doc, {
          head: [["Sous-catégorie", "Évaluation"]],
          body: specificCompetence.categories.map((c) => [c.intitule, c.valeur?.toString() ?? ""]),
          startY: y,
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
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Télécharger PDF
        </button>
      ),
    },
  ];
  // Amélioration du style : plus de contraste, hover, responsive, animations subtiles, accessibilité renforcée

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white p-6 space-y-10 max-w-7xl mx-auto">
      {/* Cartes résumé compactes */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          {
            icon: "👨‍🎓",
            value: totalStagiaires,
            label: "Total Stagiaires",
            bgFrom: "from-indigo-500",
            bgTo: "to-indigo-700",
            textColor: "text-indigo-50"
          },
          {
            icon: "🧑‍💼",
            value: totalTuteurs,
            label: "Total Tuteurs",
            bgFrom: "from-green-500",
            bgTo: "to-green-700",
            textColor: "text-green-50"
          },
          {
            icon: "📄",
            value: totalStages,
            label: "Total Stages",
            bgFrom: "from-yellow-400",
            bgTo: "to-yellow-600",
            textColor: "text-yellow-50"
          }
        ].map(({ icon, value, label, bgFrom, bgTo, textColor }, i) => (
          <div
            key={i}
            className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-7 rounded-3xl shadow-xl text-center text-white flex flex-col items-center justify-center transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 border-2 border-white/40`}
            style={{ minWidth: '170px', minHeight: '140px' }}
            role="region"
            aria-label={label}
            tabIndex={0}
          >
            <div className="mb-2 text-5xl drop-shadow-lg">{icon}</div>
            <h2 className="text-4xl font-extrabold tracking-tight drop-shadow">{value}</h2>
            <p className={`mt-1 text-base font-semibold ${textColor} select-none drop-shadow-sm`}>{label}</p>
          </div>
        ))}
      </section>

      {/* Section graphique + table */}
      <section className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-lg mt-10 flex flex-col md:flex-row gap-10 border border-indigo-100">
        {/* Bar chart */}
        <div className="md:flex-1 min-w-[300px] max-w-full flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-indigo-700 flex items-center gap-2 select-none">
            <span className="text-2xl">🏢</span> Stages par Entreprise
          </h3>
          <div className="flex-1 overflow-x-auto">
            <div className="min-w-[280px]" style={{ height: 320 }}>
              <Bar
                data={{
                  labels: stagesParEntreprise.map(item => item.entreprise),
                  datasets: [{
                    label: 'Stages',
                    data: stagesParEntreprise.map(item => item.count),
                    backgroundColor: [
                      'rgba(99, 102, 241, 0.85)', // indigo-500
                      'rgba(16, 185, 129, 0.85)', // green-500
                      'rgba(245, 158, 66, 0.85)', // yellow-500
                      'rgba(244, 63, 94, 0.85)',  // red-500
                      'rgba(59, 130, 246, 0.85)', // blue-500
                      'rgba(251, 191, 36, 0.85)', // yellow-400
                      'rgba(20, 184, 166, 0.85)', // teal-500
                    ],
                    borderRadius: 10,
                    barPercentage: 0.5,
                  }],
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true, backgroundColor: "#6366f1", titleColor: "#fff", bodyColor: "#fff" },
                    title: {
                      display: true,
                      text: 'Nombre de stages par entreprise',
                      font: { size: 15, weight: 'bold' },
                      color: "#3730a3"
                    }
                  },
                  scales: {
                    x: {
                      ticks: { color: '#6366f1', font: { size: 13, weight: "bold" } },
                      grid: { display: false }
                    },
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1, color: '#6366f1', font: { size: 13, weight: "bold" } },
                      grid: { color: '#e0e7ff' }
                    }
                  }
                }}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Table à droite */}
        <div className="md:flex-1 flex flex-col max-w-full">
          <h3 className="text-lg font-semibold mb-4 text-indigo-700 select-none flex items-center gap-2">
            <span className="text-2xl">📋</span> Liste des Stagiaires
          </h3>
          <input
            type="search"
            aria-label="Rechercher un stagiaire"
            placeholder="Rechercher un stagiaire..."
            className="mb-5 p-3 border border-indigo-200 rounded-lg w-full max-w-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-300 text-sm bg-white/80 shadow-inner"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex-1 overflow-y-auto max-h-[340px] rounded-xl border border-indigo-100 shadow-inner bg-white/80">
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              highlightOnHover
              striped
              dense
              noHeader
              customStyles={{
                headCells: {
                  style: {
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    fontSize: '14px',
                    fontWeight: '700',
                    backgroundColor: '#eef2ff', // bg-indigo-50
                    color: '#3730a3',
                    borderBottom: '2px solid #c7d2fe'
                  },
                },
                cells: {
                  style: {
                    paddingLeft: '12px',
                    paddingRight: '12px',
                    fontSize: '13px',
                    lineHeight: '1.4',
                    color: '#312e81'
                  },
                },
                rows: {
                  style: {
                    minHeight: '38px',
                    cursor: 'default',
                    transition: 'background-color 0.2s ease',
                  },
                  highlightOnHoverStyle: {
                    backgroundColor: '#e0e7ff', // indigo-100
                  }
                },
                pagination: {
                  style: {
                    padding: '8px 16px',
                    fontSize: '13px',
                  },
                  pageButtonsStyle: {
                    padding: '8px',
                    fontSize: '13px',
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
