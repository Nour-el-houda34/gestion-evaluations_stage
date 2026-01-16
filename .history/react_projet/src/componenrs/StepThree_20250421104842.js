import React, { useState, useEffect } from "react";

// Fonction pour construire le payload des compétences
const buildCompetencePayload = (categories, competencesSpecifiques) => {
  const competences = categories.map((category) => ({
    intitule: category.nom,
    note: category.note,
    categories: category.competences.map((comp, idx) => ({
      intitule: comp,
      valeur: category.evaluations[idx],
    })),
  }));

  // Ajouter les compétences spécifiques
  competences.push({
    intitule: "Compétences spécifiques",
    categories: competencesSpecifiques.map((spec) => ({
      intitule: spec.intitule,
      valeur: spec.valeur,
    })),
  });

  return competences;
};

const StepThree = ({ data, handleStepDataChange }) => {
  const [categories, setCategories] = useState([]);
  const [competencesSpecifiques, setCompetencesSpecifiques] = useState([]);

  useEffect(() => {
    if (categories.length === 0) {
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
  }, [data]);

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
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Compétences et évaluations</h2>

      {/* Affichage des catégories et des compétences */}
      <div className="space-y-6">
        {categories.map((category, catIdx) => (
          <div key={category.nom} className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-medium text-gray-700">{category.nom}</h3>
            <label className="block text-lg font-medium text-gray-700">Note :</label>
            <input
              type="number"
              value={category.note}
              onChange={(e) => handleNoteChange(catIdx, e.target.value)}
              className="w-full p-2 mt-2 border-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="mt-4">
              <h4 className="text-lg font-medium text-gray-700">Évaluations :</h4>
              {category.competences.map((comp, compIdx) => (
                <div key={comp} className="flex items-center space-x-4">
                  <span>{comp}</span>
                  <div className="flex space-x-4">
                    {["NA", "DÉBUTANT", "AUTONOME", "AUTONOME+"].map((level) => (
                      <label key={level} className="inline-flex items-center space-x-2">
                        <input
                          type="radio"
                          name={`eval-${catIdx}-${compIdx}`}
                          value={level}
                          checked={category.evaluations[compIdx] === level}
                          onChange={() => handleRadioChange(catIdx, compIdx, level)}
                          className="form-radio h-4 w-4 text-indigo-500"
                        />
                        <span className="text-gray-600">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Affichage des compétences spécifiques */}
        {competencesSpecifiques.map((specific, idx) => (
          <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
            <label className="block text-lg font-medium text-gray-700">Compétence spécifique :</label>
            <input
              type="text"
              value={specific.intitule}
              onChange={(e) => handleSpecificChange(idx, "intitule", e.target.value)}
              className="w-full p-2 mt-2 border-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Intitulé"
            />
            <input
              type="text"
              value={specific.valeur}
              onChange={(e) => handleSpecificChange(idx, "valeur", e.target.value)}
              className="w-full p-2 mt-2 border-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Valeur"
            />
          </div>
        ))}

        <button
          onClick={addSpecific}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          Ajouter une compétence spécifique
        </button>

        {/* Boutons de navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => handleStepDataChange({ appreciation: {} })}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
          >
            Retour
          </button>
          <button
            onClick={() => handleStepDataChange({ appreciation: {} })}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepThree;
