import React from "react";

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

const niveauxPossibles = ["DEBUTANT", "AUTONOME", "AUTONOME +"];

const StepThree = ({ nextStep, prevStep, handleChange, data }) => {
  // Récupération des données depuis data
  const categoriesData = initCategories.map((cat) => {
    const saved = data.appreciation?.competences?.find((c) => c.intitule === cat.nom);
    return {
      nom: cat.nom,
      note: saved?.note?.toString() || "",
      evaluations: cat.competences.map((label) => {
        const evalItem = saved?.categories?.find((e) => e.intitule === label);
        return { intitule: label, valeur: evalItem?.valeur || "" };
      }),
    };
  });

  const competencesSpecifiques =
    data.appreciation?.competences?.find((c) => c.intitule === "Compétences spécifiques")
      ?.categories || [];

  const handleRadioChange = (catIndex, compIndex, value) => {
    categoriesData[catIndex].evaluations[compIndex].valeur = value;
    updateData();
  };

  const handleNoteChange = (catIndex, value) => {
    categoriesData[catIndex].note = value;
    updateData();
  };

  const handleSpecificChange = (idx, key, value) => {
    competencesSpecifiques[idx][key] = value;
    updateData();
  };

  const addSpecific = () => {
    const updated = [...competencesSpecifiques, { intitule: "", valeur: "" }];
    const payload = buildPayload(categoriesData, updated);
    handleChange({ competences: payload });
  };

  const updateData = () => {
    const payload = buildPayload(categoriesData, competencesSpecifiques);
    handleChange({ competences: payload });
  };

  const buildPayload = (cats, specifics) => {
    const result = cats.map((cat) => ({
      intitule: cat.nom,
      note: parseInt(cat.note || "0", 10),
      categories: cat.evaluations,
    }));

    if (specifics.length > 0) {
      result.push({
        intitule: "Compétences spécifiques",
        note: 0,
        categories: specifics,
      });
    }

    return result;
  };

  return (
    <div className="max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        Évaluations des Compétences
      </h2>

      {categoriesData.map((cat, catIdx) => (
        <div key={catIdx} className="mb-8 border p-6 rounded-lg shadow-sm bg-gray-50">
          <h3 className="text-xl font-semibold mb-4 text-indigo-600">{cat.nom}</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-indigo-100">
                <tr>
                  <th className="border border-gray-300 p-2 text-left">Compétence</th>
                  {niveaux.map((niveau) => (
                    <th key={niveau} className="border border-gray-300 p-2 text-center">
                      {niveau}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cat.evaluations.map((evalItem, compIdx) => (
                  <tr key={compIdx} className="even:bg-gray-100">
                    <td className="border p-2">{evalItem.intitule}</td>
                    {niveaux.map((niveau) => (
                      <td key={niveau} className="border text-center">
                        <input
                          type="radio"
                          name={`cat${catIdx}_comp${compIdx}`}
                          value={niveau}
                          checked={evalItem.valeur === niveau}
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
              className="w-20 border p-2 rounded"
              value={cat.note}
              onChange={(e) => handleNoteChange(catIdx, e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="mt-8 p-6 border rounded-lg shadow-sm bg-gray-50">
        <h3 className="text-xl font-semibold mb-4 text-indigo-600">
          Compétences spécifiques métier
        </h3>
        {competencesSpecifiques.map((comp, idx) => (
          <div key={idx} className="flex items-center gap-4 mb-4">
            <input
              type="text"
              placeholder="Intitulé"
              className="flex-1 border p-2 rounded"
              value={comp.intitule}
              onChange={(e) => handleSpecificChange(idx, "intitule", e.target.value)}
            />
            <select
              className="border p-2 rounded"
              value={comp.valeur}
              onChange={(e) => handleSpecificChange(idx, "valeur", e.target.value)}
            >
              <option value="">-- Niveau --</option>
              {niveauxPossibles.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        ))}
        <button
          type="button"
          onClick={addSpecific}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Ajouter une compétence
        </button>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Précédent
        </button>
        <button
          type="button"
          onClick={nextStep}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default StepThree;
