import React, { useState } from "react";

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
      "Identifier des problèmes complexes"
    ],
    note: ""
  },
  {
    nom: "Compétences liées à l’entreprise",
    competences: [
      "Analyser le fonctionnement de l’entreprise",
      "Identifier la réglementation et les normes",
      "Analyser la demande projet",
      "Comprendre la politique environnementale",
      "Rechercher et sélectionner l'information"
    ],
    note: ""
  },
  {
    nom: "Compétences scientifiques et techniques",
    competences: [
      "Assurer la conception préliminaire de produits / services / processus / usages"
    ],
    note: ""
  }
];

const StepThree = ({ nextStep, prevStep, handleChange, data }) => {
  const [categories, setCategories] = useState(
    initCategories.map((cat) => ({
      ...cat,
      evaluations: cat.competences.map(() => "")
    }))
  );

  const [competencesSpecifiques, setCompetencesSpecifiques] = useState([]);

  const handleRadioChange = (catIdx, compIdx, value) => {
    const updated = [...categories];
    updated[catIdx].evaluations[compIdx] = value;
    setCategories(updated);
    handleChange({ evaluations: buildEvaluationPayload(updated) });
  };

  const handleNoteChange = (catIdx, value) => {
    const updated = [...categories];
    updated[catIdx].note = value;
    setCategories(updated);
    handleChange({
      competences: buildCompetencePayload(updated, competencesSpecifiques)
    });
  };

  const handleSpecificChange = (idx, key, value) => {
    const updated = [...competencesSpecifiques];
    updated[idx][key] = value;
    setCompetencesSpecifiques(updated);
    handleChange({
      competences: buildCompetencePayload(categories, updated)
    });
  };

  const addSpecific = () => {
    setCompetencesSpecifiques([
      ...competencesSpecifiques,
      { intitule: "", valeur: "" }
    ]);
  };

  const buildEvaluationPayload = (cats) => {
    const payload = [];
    cats.forEach((cat) => {
      cat.competences.forEach((comp, i) => {
        payload.push({
          categorie: comp,
          valeur: cat.evaluations[i] || ""
        });
      });
    });
    return payload;
  };

  const buildCompetencePayload = (cats, specifics) => {
    const payload = cats.map((cat) => ({
      intitule: cat.nom,
      note: parseInt(cat.note || 0),
      categories: cat.competences.map((comp, i) => ({
        intitule: comp,
        valeur: cat.evaluations[i] || ""
      }))
    }));
    if (specifics.length > 0) {
      payload.push({
        intitule: "Compétences spécifiques",
        note: 0,
        categories: specifics
      });
    }
    return payload;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Évaluations des Compétences
      </h2>

      {categories.map((cat, catIdx) => (
        <div key={catIdx} className="mb-8">
          <h3 className="text-xl font-semibold text-indigo-600 mb-4">{cat.nom}</h3>
          <table className="min-w-full bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
            <thead className="bg-indigo-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Compétence</th>
                {niveaux.map((niveau) => (
                  <th key={niveau} className="px-4 py-2 text-center">
                    {niveau}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cat.competences.map((comp, compIdx) => (
                <tr key={compIdx} className="hover:bg-gray-100">
                  <td className="px-4 py-2">{comp}</td>
                  {niveaux.map((niveau) => (
                    <td key={niveau} className="px-4 py-2 text-center">
                      <input
                        type="radio"
                        name={`competence_${catIdx}_cat_${compIdx}`}
                        value={niveau}
                        checked={cat.evaluations[compIdx] === niveau}
                        onChange={() => handleRadioChange(catIdx, compIdx, niveau)}
                        className="mr-2"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <label className="font-medium">Note sur 20 pour cette catégorie :</label>
            <input
              type="number"
              min="0"
              max="20"
              className="border p-2 rounded-md w-20 mt-2"
              value={cat.note}
              onChange={(e) => handleNoteChange(catIdx, e.target.value)}
            />
          </div>
        </div>
      ))}

      {/* Compétences spécifiques */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-indigo-600 mb-4">Compétences spécifiques métier</h3>
        {competencesSpecifiques.map((comp, idx) => (
          <div key={idx} className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Intitulé"
              className="border p-2 flex-1 rounded-md"
              value={comp.intitule}
              onChange={(e) => handleSpecificChange(idx, "intitule", e.target.value)}
            />
            <select
              className="border p-2 rounded-md"
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
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
        >
          Ajouter une compétence
        </button>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-400 text-white px-6 py-3 rounded-md hover:bg-gray-500 transition duration-200"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition duration-200"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default StepThree;
