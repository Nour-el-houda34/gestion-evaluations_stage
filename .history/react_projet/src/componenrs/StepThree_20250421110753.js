import React, { useState, useEffect } from "react";

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
    if (data.appreciation && data.appreciation.competences && categories.length === 0) {  // Vérifie si categories est vide
      const restored = initCategories.map((cat) => {
        const saved = data?.appreciation?.competences?.find((c) => c.intitule === cat.nom);
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

      const specific = data?.appreciation?.competences?.find(
        (c) => c.intitule === "Compétences spécifiques"
      );
      setCompetencesSpecifiques(specific?.categories || []);
    }
  }, [data, categories.length]);  // Ajout de categories.length comme dépendance


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

  const buildEvaluationPayload = (cats) => {
    const payload = [];
    cats.forEach((cat) => {
      cat.competences.forEach((comp, i) => {
        payload.push({
          categorie: comp,
          valeur: cat.evaluations[i] || "",
        });
      });
    });
    return payload;
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

    handleChange("appreciation", {
      ...data.appreciation,
      competences: updatedCompetences, // Met à jour les compétences modifiées
    });

    prevStep();
  };

  const handleSubmit = async () => {
    const { stagiaire, stage, tuteur, periode } = data;

    if (!stagiaire?.nom || !stage?.entreprise || !tuteur?.nom) {
      alert("Veuillez remplir toutes les informations nécessaires.");
      return;
    }

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
          competences: buildCompetencePayload(categories, competencesSpecifiques),
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
      } else {
        alert("Erreur lors de l'envoi des données.");
      }
    } catch (error) {
      console.error("Une erreur est survenue:", error);
      alert("Une erreur est survenue lors de l'envoi des données.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Évaluations des Compétences</h2>

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
              className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={comp.valeur}
              onChange={(e) => handleSpecificChange(idx, "valeur", e.target.value)}
            >
              <option value="">-- Niveau --</option>
              <option value="DEBUTANT">DEBUTANT</option>
              <option value="AUTONOME">AUTONOME</option>
              <option value="AUTONOME +">AUTONOME +</option>
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={addSpecific}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-300"
        >
          Ajouter une compétence
        </button>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={handlePrev}
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors duration-300"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
        >
          Soumettre
        </button>
      </div>
    </div>
  );
};

export default StepThree;
