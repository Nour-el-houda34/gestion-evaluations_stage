import React, { useEffect, useState } from 'react';
import DataTable from "react-data-table-component";
import axios from 'axios';
import { Link } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

  // 🔄 Aplatir les données : une ligne par période de stage
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

  // 🔍 Filtrage par nom ou prénom
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

    // AutoTable: Evaluation globale
    if (appreciation?.evaluations) {
      doc.text("Appréciations globales:", 20, 85);
      doc.autoTable({
        head: [["Catégorie", "Valeur"]],
        body: appreciation.evaluations.map((ev) => [ev.categorie, ev.valeur]),
        startY: 90,
      });
    }

    // AutoTable: Compétences
    if (appreciation?.competences?.length > 0) {
      doc.addPage();
      doc.text("Compétences évaluées:", 20, 20);
      appreciation.competences.forEach((comp) => {
        doc.setFont("helvetica", "bold").text(`${comp.intitule} (Note: ${comp.note}/20)`, 20, doc.lastAutoTable.finalY + 10 || 30);
        doc.autoTable({
          head: [["Sous-catégorie", "Valeur"]],
          body: comp.categories.map((cat) => [cat.intitule, cat.valeur]),
          startY: doc.lastAutoTable ? doc.lastAutoTable.finalY + 15 : 35,
        });
      });
    }

    doc.save(`evaluation_${row.nom}_${row.prenom}.pdf`);
  };

  // 🧾 Colonnes du DataTable
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
      {/* Section d'en-tête */}
      <section className="relative flex flex-col items-center justify-center p-8 bg-gradient-to-r from-purple-900 via-pink-700 to-red-600 rounded-3xl shadow-2xl text-white overflow-hidden">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-extrabold">✨ Bienvenue dans votre Espace d'Évaluation ✨</h1>
          <p className="text-base">Découvrez une expérience intuitive pour évaluer vos stagiaires.</p>
          <Link
            to="/formulaire"
            className="px-8 py-3 bg-white text-gray-800 font-bold rounded-full shadow-lg hover:bg-gray-300 transition-all duration-300"
          >
            🚀 Commencez l'Évaluation
          </Link>
        </div>
      </section>

      {/* Statistiques */}
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

      {/* DataTable */}
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
