import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 📊 Chart.js & react-chartjs-2
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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

  useEffect(() => {
    axios.get('http://localhost:8081/api/statistiques/listeappreciations')
      .then(res => setStagiaires(res.data))
      .catch(err => console.error('Erreur chargement stagiaires:', err));

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

      const specificCompetence = row.appreciation.competences.find(
        (competence) => competence.intitule === "Compétences spécifiques"
      );

      if (specificCompetence) {
        doc.addPage();
        let y = 20;
        doc.setFontSize(14).setFont("helvetica", "bold");
        doc.text(`${specificCompetence.intitule}`, 20, y);
        y += 10;

        autoTable(doc, {
          head: [["Sous-catégorie", "Évaluation"]],
          body: specificCompetence.categories.map((subcat) => [
            subcat.intitule,
            subcat.valeur?.toString() ?? "",
          ]),
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
    {
      name: "Email",
      selector: row => row.email,
    },
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
    {
      name: "Date Début",
      selector: row => row.dateDebut,
    },
    {
      name: "Date Fin",
      selector: row => row.dateFin,
    },
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
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 p-4 space-y-8">
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">{totalStagiaires}</h2>
          <p className="text-gray-500">Total Stagiaires</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">{totalTuteurs}</h2>
          <p className="text-gray-500">Total Tuteurs</p>
        </div>
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-3xl font-extrabold text-gray-800">{totalStages}</h2>
          <p className="text-gray-500">Total Stages</p>
        </div>
      </section>

      {/* 🔶 Graphique Bar Chart */}
      <section className="bg-white p-6 rounded-3xl shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-purple-800">📊 Statistiques des Effectifs</h3>
        <Bar
          data={{
            labels: ['Stagiaires', 'Tuteurs', 'Stages'],
            datasets: [
              {
                label: 'Nombre total',
                data: [totalStagiaires, totalTuteurs, totalStages],
                backgroundColor: ['#6366F1', '#EC4899', '#10B981'],
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Vue globale des effectifs',
              },
            },
          }}
        />
      </section>

      <section className="bg-white p-6 rounded-3xl shadow-2xl">
        <h3 className="text-xl font-bold mb-4 text-purple-800">Liste des Stages</h3>
        <input
          type="text"
          placeholder="Rechercher un stagiaire..."
          className="mb-6 p-3 border rounded-lg w-full focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <DataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          striped
        />
      </section>

      <footer className="text-center text-gray-500 mt-6 text-sm">
        © {new Date().getFullYear()} Master ISI. Tous droits réservés.
      </footer>
    </div>
  );
};

export default Dashboard;
