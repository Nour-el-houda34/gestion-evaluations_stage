import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import { Modal } from "react-modal";

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
  

  const [modalContent, setModalContent] = useState({ isOpen: false, message: "" });

  const openModal = (message) => {
    setModalContent({ isOpen: true, message });
  };

  const closeModal = () => {
    setModalContent({ isOpen: false, message: "" });
  };

  const handleSubmit = async () => {
    const { stagiaire, stage, tuteur, periode } = data;

    if (!stagiaire?.nom || !stage?.entreprise || !tuteur?.nom) {
      openModal("Veuillez remplir toutes les informations nécessaires.");
      return;
    }

    const updatedCompetences = buildCompetencePayload(categories, competencesSpecifiques);

    try {
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

      const response = await fetch("http://localhost:8081/api/evaluation/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        openModal("Les données ont été envoyées avec succès !");
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

        const details = [
          { label: "Nom et Prénom de Stagiaire :", value: `${payload.stagiaire.nom} ${payload.stagiaire.prenom}` },
          { label: "Nom de l'entreprise :", value: payload.stage.entreprise },
          { label: "Nom et Prénom Tuteur :", value: `${payload.tuteur.nom} ${payload.tuteur.prenom}` },
          { label: "Période de stage du :", value: `${payload.periode.dateDebut} au ${payload.periode.dateFin}` },
          { label: "THEME DU PROJET PRINCIPAL CONFIE A L'ETUDIANT(E) :", value: payload.stage.description },
          { label: "OBJECTIFS ASSIGNES A L'ETUDIANT(E):", value: payload.stage.objectif },
        ];

        details.forEach((detail, index) => {
          doc.setFont("helvetica", "bold").setFontSize(14);
          doc.setTextColor(0, 0, 0);
          let labelWidth = doc.getTextWidth(detail.label);
          doc.text(detail.label, 20, 55 + index * 10);
          doc.setFont("helvetica", "normal").setFontSize(12);
          doc.text(detail.value, 20 + labelWidth + 5, 55 + index * 10);
        });

        // APPRECIATIONS GLOBALES SUR L'ETUDIANT(E)
        doc.setFont("helvetica", "bold").setFontSize(16);
        doc.setTextColor(0, 102, 204);
        doc.text("APPRECIATIONS GLOBALES SUR L'ETUDIANT(E)", 105, 120, { align: "center" });

        const globalAppreciations = payload.appreciation.evaluations.map((evaluation) => ({
          label: evaluation.categorie,
          value: evaluation.valeur,
        }));

        // Draw table for global appreciations
        let startY = 130;
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
          doc.text(appreciation.value, 125, startY + 7);
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
            doc.text(`${competence.intitule}`, 20, startY);
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

        doc.save(`evaluation_${payload.stagiaire.nom}_${payload.stagiaire.prenom}.pdf`);
      } else {
        openModal("Erreur lors de l'envoi des données.");
      }
    } catch (error) {
      console.error("Une erreur est survenue:", error);
      openModal("Une erreur est survenue lors de l'envoi des données.");
    }
  };

  return (
    <>
      <Modal
        isOpen={modalContent.isOpen}
        onRequestClose={closeModal}
        contentLabel="Notification"
        className="modal"
        overlayClassName="overlay"
      >
        <div>
          <p>{modalContent.message}</p>
          <button onClick={closeModal} className="btn-close">
            Fermer
          </button>
        </div>
      </Modal>
    </>
  );
  
  
  
  
  

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-800">
        Évaluations des Compétences
      </h2>

      <div className="space-y-6">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">{cat.nom}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border p-2 text-left">Compétence</th>
                    {niveaux.map((niveau) => (
                      <th key={niveau} className="border p-1 text-center">{niveau}</th>
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
                            className="form-radio h-4 w-4 text-blue-500"
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
                className="w-20 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={cat.note}
                onChange={(e) => handleNoteChange(catIdx, e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">Compétences spécifiques métier</h3>
          {competencesSpecifiques.map((comp, idx) => (
            <div key={idx} className="flex items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Intitulé"
                className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={comp.intitule}
                onChange={(e) => handleSpecificChange(idx, "intitule", e.target.value)}
              />
              <select
                className="w-32 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
          >
            Ajouter une compétence spécifique
          </button>
        </div>

        <div className="flex justify-between mt-8">
          <button
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 shadow-md"
            onClick={handlePrev}
          >
            Retour
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
            onClick={handleSubmit}
          >
            Soumettre
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
