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

 return (
  <div className="min-h-screen bg-gray-50 p-6 space-y-8 max-w-7xl mx-auto">
    {/* Cartes résumé compactes */}
    <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[{
        icon: "👨‍🎓",
        value: totalStagiaires,
        label: "Total Stagiaires",
        bgFrom: "from-indigo-400",
        bgTo: "to-indigo-600",
        textColor: "text-indigo-100"
      }, {
        icon: "🧑‍💼",
        value: totalTuteurs,
        label: "Total Tuteurs",
        bgFrom: "from-green-400",
        bgTo: "to-green-600",
        textColor: "text-green-100"
      }, {
        icon: "📄",
        value: totalStages,
        label: "Total Stages",
        bgFrom: "from-yellow-300",
        bgTo: "to-yellow-500",
        textColor: "text-yellow-100"
      }].map(({ icon, value, label, bgFrom, bgTo, textColor }, i) => (
        <div
          key={i}
          className={`bg-gradient-to-br ${bgFrom} ${bgTo} p-6 rounded-2xl shadow-md text-center text-white flex flex-col items-center transition-transform transform hover:scale-105`}
          style={{ minWidth: '160px' }}
        >
          <div className="mb-1 text-3xl">{icon}</div>
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          <p className={`mt-1 text-sm font-medium ${textColor}`}>{label}</p>
        </div>
      ))}
    </section>

   <section className="bg-white p-5 rounded-2xl shadow-md mt-6 flex flex-col md:flex-row gap-6">
  {/* Bar chart à gauche */}
  <div className="md:flex-1 min-w-[300px] max-w-full">
    <h3 className="text-lg font-semibold mb-3 text-indigo-700 flex items-center gap-2 select-none">
      <span className="text-xl">🏢</span> Stages par Entreprise
    </h3>
    <div className="overflow-x-auto">
      <div className="min-w-[280px]">
        <Bar
          data={{
            labels: stagesParEntreprise.map(item => item.entreprise),
            datasets: [{
              label: 'Stages',
              data: stagesParEntreprise.map(item => item.count),
              backgroundColor: [
                '#6366F1', '#10B981', '#F59E42', '#F43F5E', '#3B82F6', '#FBBF24', '#14B8A6'
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
                ticks: { color: '#4B5563', font: { size: 11 } },
                grid: { display: false }
              },
              y: {
                beginAtZero: true,
                ticks: { stepSize: 1, color: '#4B5563', font: { size: 11 } },
                grid: { color: '#E5E7EB' }
              }
            }
          }}
          style={{ height: 300, width: '100%' }} // fixe hauteur pour éviter décalage
        />
      </div>
    </div>
  </div>

  {/* Table à droite */}
  <div className="md:flex-1 flex flex-col max-w-full">
    <h3 className="text-lg font-semibold mb-3 text-indigo-700 select-none">📋 Liste des Stagiaires</h3>
    <input
      type="text"
      placeholder="Rechercher un stagiaire..."
      className="mb-4 p-2 border border-gray-300 rounded-md w-full max-w-md focus:outline-none focus:ring-2 focus:ring-indigo-400 transition text-sm"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
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
            },
          },
          cells: {
            style: {
              paddingLeft: '8px',
              paddingRight: '8px',
              fontSize: '12px',
              lineHeight: '1.2',
            },
          },
          rows: {
            style: {
              minHeight: '32px',
            },
          },
          pagination: {
            style: {
              padding: '4px 8px',
            },
            pageButtonsStyle: {
              padding: '4px',
              fontSize: '12px',
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
