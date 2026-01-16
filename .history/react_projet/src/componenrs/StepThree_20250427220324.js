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

    if (!stagiaire?.nom || !stage?.entreprise || !tuteur?.nom) {
      alert("Veuillez remplir toutes les informations nécessaires.");
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
        alert("Les données ont été envoyées avec succès !");

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

        doc.setFont("helvetica", "bold").setFontSize(18);
        doc.setTextColor(0, 102, 204);
        doc.text("EVALUATIONS DES COMPETENCES DE L'ETUDIANT(E)", 105, 20, { align: "center" });

        // Competence categories table
        const categoriesTable = categories.map((cat) => ({
          nom: cat.nom,
          evaluations: cat.evaluations.map((evalValue, index) => ({
            competence: cat.competences[index],
            evaluation: evalValue,
          })),
        }));

        startY = 30;
        categoriesTable.forEach((cat) => {
          doc.setFontSize(14).setFont("helvetica", "bold").text(cat.nom, 20, startY);
          startY += 10;
          cat.evaluations.forEach((evaluation) => {
            doc.setFontSize(12).setFont("helvetica", "normal");
            doc.text(`${evaluation.competence}: ${evaluation.evaluation}`, 20, startY);
            startY += 7;
          });
          startY += 5;
        });

        doc.save("evaluation_stage.pdf");
      }
    } catch (error) {
      console.error("Erreur d'envoi des données :", error);
      alert("Une erreur est survenue lors de l'envoi des données.");
    }
  };

  return (
    <div>
      <h2>Compétences à évaluer</h2>
      <div className="categories">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="category">
            <h3>{cat.nom}</h3>
            {cat.competences.map((comp, compIdx) => (
              <div key={compIdx} className="competence">
                <label>{comp}</label>
                <div className="radio-buttons">
                  {niveaux.map((niveau, index) => (
                    <div key={index}>
                      <input
                        type="radio"
                        id={`${catIdx}_${compIdx}_${niveau}`}
                        name={`${catIdx}_${compIdx}`}
                        value={niveau}
                        checked={cat.evaluations[compIdx] === niveau}
                        onChange={(e) => handleRadioChange(catIdx, compIdx, e.target.value)}
                      />
                      <label htmlFor={`${catIdx}_${compIdx}_${niveau}`}>{niveau}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div>
              <label>Note globale</label>
              <select
                value={cat.note}
                onChange={(e) => handleNoteChange(catIdx, e.target.value)}
              >
                {niveaux.map((niveau, index) => (
                  <option key={index} value={niveau}>
                    {niveau}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="specific-competencies">
        <h3>Compétences spécifiques</h3>
        {competencesSpecifiques.map((spec, idx) => (
          <div key={idx}>
            <input
              type="text"
              value={spec.intitule}
              onChange={(e) => handleSpecificChange(idx, "intitule", e.target.value)}
              placeholder="Intitulé"
            />
            <input
              type="text"
              value={spec.valeur}
              onChange={(e) => handleSpecificChange(idx, "valeur", e.target.value)}
              placeholder="Valeur"
            />
          </div>
        ))}
        <button onClick={addSpecific}>Ajouter une compétence spécifique</button>
      </div>
      <div className="actions">
        <button onClick={handlePrev}>Retour</button>
        <button onClick={handleSubmit}>Soumettre</button>
      </div>
    </div>
  );
};

export default StepThree;
