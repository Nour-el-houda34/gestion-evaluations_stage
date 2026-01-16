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

const StepThree = ({ data, handleStepDataChange }) => {
  const [categories, setCategories] = useState([]);
  const [competencesSpecifiques, setCompetencesSpecifiques] = useState([]);

  // Réinitialisation des catégories et des compétences spécifiques lorsque les données changent
  useEffect(() => {
    if (categories.length === 0) {
      // Initialiser les catégories avec les valeurs déjà présentes dans les données
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

      // Initialiser les compétences spécifiques
      const specific = data?.appreciation?.competences?.find(
        (c) => c.intitule === "Compétences spécifiques"
      );
      setCompetencesSpecifiques(specific?.categories || []);
    }
  }, [data]);  // Cette logique se déclenche chaque fois que 'data' change

  const handleRadioChange = (catIdx, compIdx, value) => {
    const updated = [...categories];
    updated[catIdx].evaluations[compIdx] = value;
    setCategories(updated);
    handleStepDataChange({ appreciation: { competences: buildCompetencePayload(updated, competencesSpecifiques) } });
  };

  const handleNoteChange = (catIdx, value) => {
    const updated = [...categories];
    updated[catIdx].note = value;
    setCategories(updated);
    handleStepDataChange({ appreciation: { competences: buildCompetencePayload(updated, competencesSpecifiques) } });
  };

  const handleSpecificChange = (idx, key, value) => {
    const updated = [...competencesSpecifiques];
    updated[idx][key] = value;
    setCompetencesSpecifiques(updated);
    handleStepDataChange({ appreciation: { competences: buildCompetencePayload(categories, updated) } });
  };

  const addSpecific = () => {
    const updated = [...competencesSpecifiques, { intitule: "", valeur: "" }];
    setCompetencesSpecifiques(updated);
    handleStepDataChange({ appreciation: { competences: buildCompetencePayload(categories, updated) } });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Évaluation des compétences</h2>
      <div className="space-y-6">
        {/* Catégories et compétences spécifiques à afficher */}
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-white p-4 rounded-lg shadow-sm">
            <label className="block text-lg font-medium text-gray-700">{cat.nom} :</label>
            <div className="flex flex-wrap gap-4 mt-2">
              {cat.competences.map((comp, compIdx) => (
                <div key={compIdx} className="flex items-center">
                  <label className="text-gray-600">{comp}</label>
                  <input
                    type="radio"
                    name={`${cat.nom}-${comp}`}
                    value="NA"
                    checked={cat.evaluations[compIdx] === "NA"}
                    onChange={() => handleRadioChange(catIdx, compIdx, "NA")}
                    className="form-radio h-4 w-4 text-indigo-500"
                  />
                  <input
                    type="radio"
                    name={`${cat.nom}-${comp}`}
                    value="DÉBUTANT"
                    checked={cat.evaluations[compIdx] === "DÉBUTANT"}
                    onChange={() => handleRadioChange(catIdx, compIdx, "DÉBUTANT")}
                    className="form-radio h-4 w-4 text-indigo-500"
                  />
                  {/* Plus de boutons radio pour les autres valeurs */}
                </div>
              ))}
            </div>
            {/* Note */}
            <input
              type="text"
              value={cat.note}
              onChange={(e) => handleNoteChange(catIdx, e.target.value)}
              className="mt-2 p-2 border rounded"
            />
          </div>
        ))}

        {/* Compétences spécifiques */}
        <div>
          <h3 className="text-lg font-medium text-gray-700">Compétences spécifiques :</h3>
          {competencesSpecifiques.map((specific, idx) => (
            <div key={idx} className="flex items-center space-x-4">
              <input
                type="text"
                value={specific.intitule}
                onChange={(e) => handleSpecificChange(idx, "intitule", e.target.value)}
                className="w-1/2 p-2 border rounded"
              />
              <input
                type="text"
                value={specific.valeur}
                onChange={(e) => handleSpecificChange(idx, "valeur", e.target.value)}
                className="w-1/2 p-2 border rounded"
              />
            </div>
          ))}
          <button
            onClick={addSpecific}
            className="mt-4 p-2 bg-indigo-500 text-white rounded"
          >
            Ajouter une compétence spécifique
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepThree;

