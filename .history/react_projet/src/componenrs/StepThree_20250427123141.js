import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";

const niveaux = ["NA", "DEBUTANT", "AUTONOME", "AUTONOME +"];

const initCategories = [
  {
    nom: "Compétences liées à l’individu",
    competences: [
      "Être capable d'analyse et de synthèse",
      "Proposer des méthodes et des axes de travail",
      "Faire adhérer les acteurs",
      "S'intégrer dans un contexte international",
      "S'autoévaluer",
      "Identifier des problèmes complexes",
    ],
  },
  {
    nom: "Compétences liées à l’entreprise",
    competences: [
      "Analyser le fonctionnement de l’entreprise",
      "Identifier la réglementation et les normes",
      "Analyser la demande projet",
      "Comprendre la politique environnementale",
      "Rechercher et sélectionner l'information",
    ],
  },
  {
    nom: "Compétences scientifiques et techniques",
    competences: [
      "Assurer la conception préliminaire de produits / services / processus / usages",
    ],
  },
];

const StepThree = ({ nextStep, prevStep, handleChange, data }) => {
  const [categories, setCategories] = useState([]);
  const [competencesSpecifiques, setCompetencesSpecifiques] = useState([]);

  useEffect(() => {
    if (categories.length === 0) {
      const restored = initCategories.map((cat) => {
        const saved = data.appreciation.competences.find((c) => c.intitule === cat.nom);
        return {
          nom: cat.nom,
          competences: cat.competences,
          note: saved?.note?.toString() || "",
          evaluations: cat.competences.map((comp) => {
            const item = saved?.categories?.find((sc) => sc.intitule === comp);
            return item?.valeur || "";
          }),
        };
      });

      setCategories(restored);

      const specific = data.appreciation.competences.find(
        (c) => c.intitule === "Compétences spécifiques"
      );
      setCompetencesSpecifiques(specific?.categories || []);
    }
  }, [data]);

  const handleRadioChange = (catIdx, compIdx, value) => {
    const updated = [...categories];
    updated[catIdx].evaluations[compIdx] = value;
    setCategories(updated);
  };

  const handleNoteChange = (catIdx, value) => {
    const updated = [...categories];
    updated[catIdx].note = value;
    setCategories(updated);
  };

  const handleSpecificChange = (idx, key, value) => {
    const updated = [...competencesSpecifiques];
    updated[idx][key] = value;
    setCompetencesSpecifiques(updated);
  };

  const addSpecific = () => {
    const updated = [...competencesSpecifiques, { intitule: "", valeur: "" }];
    setCompetencesSpecifiques(updated);
  };

  const buildCompetencePayload = (cats, specs) => {
    const payload = cats.map((cat) => ({
      intitule: cat.nom,
      note: parseInt(cat.note || 0, 10),
      categories: cat.competences.map((comp, i) => ({
        intitule: comp,
        valeur: cat.evaluations[i] || "",
      })),
    }));
    if (specs.length > 0) {
      payload.push({
        intitule: "Compétences spécifiques",
        note: 0,
        categories: specs,
      });
    }
    return payload;
  };

  const handlePrev = () => {
    const updatedCompetences = buildCompetencePayload(categories, competencesSpecifiques);

    if (JSON.stringify(updatedCompetences) !== JSON.stringify(data.appreciation.competences)) {
      handleChange("appreciation", {
        ...data.appreciation,
        competences: updatedCompetences,
      });
    }

    prevStep();
  };

  const handleSubmit = async () => {  
    const { stagiaire, stage, tuteur, periode } = data;  
  
    // Validate required fields  
    if (!stagiaire?.nom || !stage?.entreprise || !tuteur?.nom) {  
      alert("Veuillez remplir toutes les informations nécessaires.");  
      return;  
    }  
  
    const updatedCompetences = buildCompetencePayload(categories, competencesSpecifiques);  
  
    const payload = {  
      stagiaire: {  
        nom: stagiaire.nom || "",  
        prenom: stagiaire.prenom || "",  
        institution: stagiaire.institution || "",  
      },  
      stage: {  
        entreprise: stage.entreprise || "",  
        description: stage.description || "",  
        objectif: stage.objectif || "",  
      },  
      tuteur: {  
        nom: tuteur.nom || "",  
        prenom: tuteur.prenom || "",  
        entreprise: tuteur.entreprise || "",  
      },  
      periode: {  
        dateDebut: periode?.dateDebut || "",  
        dateFin: periode?.dateFin || "",  
      },  
      appreciation: {  
        evaluations: data.appreciation.evaluations,  
        competences: updatedCompetences,  
      },  
    };  
  
    console.log("Données envoyées :", payload);  
  
    try {  
      const response = await fetch("http://localhost:8081/api/evaluation/submit", {  
        method: "POST",  
        headers: {  
          "Content-Type": "application/json",  
        },  
        body: JSON.stringify(payload),  
      });  
  
      if (response.ok) {  
        alert("Les données ont été envoyées avec succès !");  
        generatePDF(payload);  
      } else {  
        alert("Erreur lors de l'envoi des données.");  
      }  
    } catch (error) {  
      console.error("Une erreur est survenue:", error);  
      alert("Une erreur est survenue lors de l'envoi des données.");  
    }  
  };  
  
  const generatePDF = (payload) => {  
    const doc = new jsPDF();  
    
    doc.setFont("helvetica", "bold").setFontSize(20);  
    const titleWidth = doc.getTextWidth("Évaluation Stage Etudiants");  
    doc.text("Évaluation Stage Etudiants", 105 - titleWidth / 2, 20);  
    
    doc.setFontSize(16);  
    const subTitleWidth = doc.getTextWidth("APPRECIATION DU TUTEUR DE STAGE");  
    doc.text("APPRECIATION DU TUTEUR DE STAGE", 105 - subTitleWidth / 2, 30);  
    
    doc.setFontSize(12).setFont("helvetica", "normal");  
    doc.setLineWidth(0.5).line(20, 35, 195, 35); // Separator line  
  
    // Stagiaire and Stage Information  
    const details = [  
      { label: "Nom et Prénom de Stagiaire :", value: `${payload.stagiaire.nom} ${payload.stagiaire.prenom}` },  
      { label: "Nom de l'entreprise :", value: payload.stage.entreprise },  
      { label: "Nom et Prénom Tuteur :", value: `${payload.tuteur.nom} ${payload.tuteur.prenom}` },  
      { label: "Période de stage du :", value: `${payload.periode.dateDebut} au ${payload.periode.dateFin}` },  
      { label: "THEME DU PROJET PRINCIPAL CONFIE A L'ETUDIANT(E) :", value: payload.stage.description },  
      { label: "OBJECTIFS ASSIGNES A L'ETUDIANT(E):", value: payload.stage.objectif },  
    ];  
  
    details.forEach((detail, index) => {  
      doc.setTextColor(0, 102, 204);  
      doc.text(detail.label, 20, 45 + index * 10);  
      doc.setTextColor(0, 0, 0);  
      doc.text(detail.value, 60, 45 + index * 10);  
    });  
  
    doc.line(20, 105, 195, 105); // Another separator line  
  
    // Evaluation section  
    doc.setTextColor(0, 102, 204);  
    doc.text("EVALUATIONS DES COMPETENCES DE L'ETUDIANT(E)", 20, 110);  
    doc.setTextColor(0, 0, 0);  
    doc.text("Évaluation des Compétences de l'Étudiant(e)", 20, 120);  
  
    // Evaluation levels description  
    const evaluationNotes = [  
      "NA : Non applicable - La compétence n'a pas été mise en œuvre, ou très peu.",  
      "Débutant : Applique les connaissances avec assistance.",  
      "Autonome : Met en œuvre les pratiques de manière indépendante.",  
      "Autonome + : Résout des problèmes en fonction du contexte professionnel -"  
    ];  
  
    evaluationNotes.forEach((note, index) => {  
      doc.text(note, 20, 130 + index * 10);  
    });  
  
    // Competency table  
    let yPosition = 180; // Start table position  
    const rowHeight = 10;  
  
    payload.appreciation.competences.forEach((competence) => {  
      doc.setFontSize(12).setFont("helvetica", "bold");  
      doc.text(`${competence.intitule} (Note: ${competence.note}/20)`, 20, yPosition);  
      yPosition += rowHeight;  
  
      doc.setLineWidth(0.5).line(20, yPosition, 195, yPosition);  
      yPosition += 5;  
  
      // Table headers for subcategories  
      doc.setFontSize(10).setFont("helvetica", "normal");  
      doc.setTextColor(255, 255, 255);  // White text for headers  
      doc.setFillColor(0, 102, 204);  
      doc.rect(30, yPosition - 5, 100, 10, "F");  
      doc.text("Sous-catégories", 30, yPosition);  
      
      doc.setFillColor(0, 102, 204);  
      doc.rect(150, yPosition - 5, 45, 10, "F");  
      doc.text("Note", 150, yPosition);  
      yPosition += rowHeight;  
  
      doc.setLineWidth(0.5).line(20, yPosition, 195, yPosition);  
      yPosition += 5;  
  
      // Subcategories  
      competence.categories.forEach((subcat) => {  
        doc.setTextColor(0, 0, 0);  
        doc.text(subcat.intitule, 30, yPosition);  
        doc.text(subcat.valeur.toString(), 150, yPosition);  
        yPosition += rowHeight;  
  
        // Alternate row background color  
        if (yPosition % 2 === 0) {  
          doc.setFillColor(240, 240, 240);  
          doc.rect(20, yPosition - 8, 175, 8, "F");  
        }  
  
        // Handle page overflow  
        if (yPosition > 270) {  
          doc.addPage();  
          yPosition = 20;  
        }  
      });  
  
      yPosition += 10; // Space between competencies  
    });  
  
    doc.save(`evaluation_${payload.stagiaire.nom}_${payload.stagiaire.prenom}.pdf`);  
  };  
  
  
  

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Évaluations des Compétences
      </h2>

      {categories.map((cat, catIdx) => (
        <div key={catIdx} className="mb-8 border p-6 rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">{cat.nom}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="border p-2 text-left">Compétence</th>
                  {niveaux.map((niveau) => (
                    <th key={niveau} className="border p-2 text-center">{niveau}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cat.competences.map((comp, compIdx) => (
                  <tr key={compIdx} className="even:bg-gray-100">
                    <td className="border p-2">{comp}</td>
                    {niveaux.map((niveau) => (
                      <td key={niveau} className="border text-center">
                        <input
                          type="radio"
                          name={`cat${catIdx}_comp${compIdx}`}
                          value={niveau}
                          checked={cat.evaluations[compIdx] === niveau}
                          onChange={() => handleRadioChange(catIdx, compIdx, niveau)}
                          className="form-radio h-4 w-4 text-indigo-600"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center">
            <label className="font-medium mr-4 text-gray-700">Note sur 20 :</label>
            <input
              type="number"
              min="0"
              max="20"
              className="w-20 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={cat.note}
              onChange={(e) => handleNoteChange(catIdx, e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="mt-8 p-6 border rounded-lg shadow-sm bg-gray-50">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">Compétences spécifiques métier</h3>
        {competencesSpecifiques.map((comp, idx) => (
          <div key={idx} className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Intitulé"
              className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={comp.intitule}
              onChange={(e) => handleSpecificChange(idx, "intitule", e.target.value)}
            />
            <select
              className="w-32 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={comp.valeur}
              onChange={(e) => handleSpecificChange(idx, "valeur", e.target.value)}
            >
              {niveaux.map((niveau) => (
                <option key={niveau} value={niveau}>
                  {niveau}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={addSpecific}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          Ajouter une compétence spécifique
        </button>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
          onClick={handlePrev}
        >
          Retour
        </button>
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          onClick={handleSubmit}
        >
          Soumettre
        </button>
      </div>
    </div>
  );
};

export default StepThree;
