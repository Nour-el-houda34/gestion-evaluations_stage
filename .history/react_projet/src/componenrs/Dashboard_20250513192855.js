import React, { useEffect, useState } from 'react';
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

const TableRow = ({ stagiaire }) => {
  const downloadPDF = () => {
    const doc = new jsPDF();

    const periode = stagiaire.periodes[0];
    const appreciation = periode?.appreciations[0];
    const tuteur = appreciation?.tuteur;
    const stage = periode?.stage;

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

    const details = [
      { label: "Nom et Prénom de Stagiaire :", value: `${stagiaire.nom} ${stagiaire.prenom}` },
      { label: "Email de Stagiaire :", value: stagiaire.email ?? 'Non renseigné' },
      { label: "Nom de l'entreprise :", value: stage?.entreprise ?? 'Non renseigné' },
      { label: "Nom et Prénom Tuteur :", value: tuteur ? `${tuteur.nom} ${tuteur.prenom}` : 'Non renseigné' },
      { label: "Email de Tuteur :", value: tuteur?.email ?? 'Non renseigné' },
      { label: "Période de stage du :", value: `${periode?.dateDebut ?? 'Non renseigné'} au ${periode?.dateFin ?? 'Non renseigné'}` },
      { label: "THEME DU PROJET PRINCIPAL CONFIE A L'ETUDIANT(E) :", value: stage?.description ?? 'Non renseigné' },
    ];

    details.forEach((detail, index) => {
      doc.setFont("helvetica", "bold").setFontSize(14);
      let labelWidth = doc.getTextWidth(detail.label);
      doc.text(detail.label, 20, 55 + index * 10);
      doc.setFont("helvetica", "normal").setFontSize(12);

      const maxWidth = 160;
      const lines = doc.splitTextToSize(detail.value, maxWidth);
      lines.forEach((line, lineIndex) => {
        doc.text(line, 20 + labelWidth + 5, 55 + index * 10 + lineIndex * 6);
      });
    });

    doc.setFont("helvetica", "bold").setFontSize(16);
    doc.setTextColor(0, 102, 204);
    doc.text("APPRECIATIONS GLOBALES SUR L'ETUDIANT(E)", 105, 160, { align: "center" });

    const globalAppreciations = appreciation?.evaluations?.map((evaluation) => ({
      label: evaluation.categorie,
      value: evaluation.valeur,
    })) || [];

    // Draw table for global appreciations
    let startY = 170;
    const tableColumnWidths = [100, 80];
    const tableHeaders = ["Catégorie", "Valeur"];

    // Draw table headers
    doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(255, 255, 255);
    doc.setFillColor(0, 102, 204);
    doc.rect(20, startY, tableColumnWidths[0], 10, "F");
    doc.rect(120, startY, tableColumnWidths[1], 10, "F");
    doc.text(tableHeaders[0], 25, startY + 7);
    doc.text(tableHeaders[1], 125, startY + 7);

    startY += 10;

    // Draw table rows
    doc.setFont("helvetica", "normal").setTextColor(0, 0, 0);
    globalAppreciations.forEach((appreciation) => {
      doc.rect(20, startY, tableColumnWidths[0], 10);
      doc.rect(120, startY, tableColumnWidths[1], 10);
      doc.text(appreciation.label, 25, startY + 7);
      doc.text(appreciation.value.toString(), 125, startY + 7);
      startY += 10;
    });

    // Add a new page for EVALUATIONS DES COMPETENCES DE L'ETUDIANT(E)
    doc.addPage();
doc.setFont("helvetica", "bold").setFontSize(16);
doc.setTextColor(0, 102, 204);
doc.text("EVALUATIONS DES COMPETENCES DE L'ETUDIANT(E)", 105, 20, { align: "center" });
doc.setTextColor(0, 0, 0);

startY = 30;
let rowHeight = 10;

payload.appreciation.competences.forEach((competence) => {
  doc.setFontSize(14).setFont("helvetica", "bold");
  if (competence.intitule !== "Compétences spécifiques") {
    doc.text(`${competence.intitule} (Note: ${competence.note}/20)`, 20, startY);
  } else {
    // Skip "Compétences spécifiques" for now
    return;
  }
  startY += rowHeight;

  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 102, 204);
  doc.line(20, startY - 5, 190, startY - 5);

  startY += 5;

  doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(0, 102, 204);
  doc.text("Sous-catégories", 30, startY);
  doc.text("Evaluation", 150, startY);
  startY += rowHeight;

  doc.setFont("helvetica", "normal").setTextColor(0, 0, 0);
  competence.categories.forEach((subcat) => {
    doc.text(subcat.intitule, 30, startY);
    doc.text(subcat.valeur.toString(), 150, startY);
    startY += rowHeight;

    if (startY > 270) {
      doc.addPage();
      startY = 20;
    }
  });

  startY += 10;
});

// Add a new page for "Compétences spécifiques"
const specificCompetence = payload.appreciation.competences.find(
  (competence) => competence.intitule === "Compétences spécifiques"
);

if (specificCompetence) {
  doc.addPage();
  startY = 20;

  doc.setFontSize(14).setFont("helvetica", "bold");
  doc.text(`${specificCompetence.intitule}`, 20, startY);
  startY += rowHeight;

  doc.setLineWidth(0.5);
  doc.setDrawColor(0, 102, 204);
  doc.line(20, startY - 5, 190, startY - 5);

  startY += 5;

  doc.setFontSize(12).setFont("helvetica", "bold").setTextColor(0, 102, 204);
  doc.text("Sous-catégories", 30, startY);
  doc.text("Evaluation", 150, startY);
  startY += rowHeight;

  doc.setFont("helvetica", "normal").setTextColor(0, 0, 0);
  specificCompetence.categories.forEach((subcat) => {
    doc.text(subcat.intitule, 30, startY);
    doc.text(subcat.valeur.toString(), 150, startY);
    startY += rowHeight;

    if (startY > 270) {
      doc.addPage();
      startY = 20;
    }
  });
}
    doc.save(`evaluation_${stagiaire.nom}_${stagiaire.prenom}.pdf`);
  };

  

  return (
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
          <td className="px-4 py-3">
            <button
              onClick={downloadPDF}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Télécharger PDF
            </button>
          </td>
        </tr>
      ))}
    </>
  );
};

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
      <section className="relative flex flex-col items-center justify-center p-6 bg-gradient-to-r from-purple-800 via-pink-700 to-red-600 rounded-2xl shadow-lg text-white overflow-hidden">  
        <div className="relative z-10 text-center space-y-4">  
          <h1 className="text-3xl font-bold tracking-wide">✨ Bienvenue dans votre Espace d'Évaluation ✨</h1>  
          <p className="text-sm leading-relaxed max-w-md mx-auto mb-4">  
            Découvrez une expérience fluide et intuitive pour évaluer vos stagiaires. Cliquez sur le bouton ci-dessous pour commencer votre évaluation!  
          </p>  
          <div className="mb-6" /> {/* Espace ajouté ici */}  
          <Link  
            to="/formulaire"  
            className="px-6 py-2 bg-white text-gray-800 font-bold rounded-full shadow-md hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"  
          >  
            🚀 Commencez l'Évaluation  
          </Link>  
        </div>  
      </section>  

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">  
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">  
          <h2 className="text-2xl font-semibold text-gray-800">{totalStagiaires}</h2>  
          <p className="text-gray-500 mt-2">Total Stagiaires</p>  
        </div>  
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">  
          <h2 className="text-2xl font-semibold text-gray-800">{totalTuteurs}</h2>  
          <p className="text-gray-500 mt-2">Total Tuteurs</p>  
        </div>  
        <div className="bg-white p-6 rounded-xl shadow-lg text-center">  
          <h2 className="text-2xl font-semibold text-gray-800">{totalStages}</h2>  
          <p className="text-gray-500 mt-2">Total Stages</p>  
        </div>  
      </section>  

      <section className="bg-white p-4 rounded-2xl shadow-lg">
        <h3 className="text-lg font-bold mb-2 text-purple-700">Liste des Stage</h3>
        <input
          type="text"
          placeholder="Rechercher un stagiaire..."
          className="mb-4 p-2 border rounded w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-purple-100 text-purple-800">
                <th className="px-4 py-2 text-left border">Stagiare</th>
                <th className="px-4 py-2 text-left border">Email</th>
                <th className="px-4 py-2 text-left border">Tuteur</th>
                <th className="px-4 py-2 text-left border">Entreprise</th>
                <th className="px-4 py-2 text-left border">Date Début</th>
                <th className="px-4 py-2 text-left border">Date Fin</th>
              </tr>
            </thead>
            <tbody>
              {filteredStagiaires.map((stagiaire, index) => (
                <TableRow key={index} stagiaire={stagiaire} />
              ))}
            </tbody>
          </table>
        </div>
      </section> 

      <footer className="text-center text-gray-500 mt-4 text-sm">  
        © {new Date().getFullYear()} Master ISI. Tous droits réservés.  
      </footer>  
    </div>  
  );  
};  

export default Dashboard;

