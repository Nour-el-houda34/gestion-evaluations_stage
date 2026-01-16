// StepFour.js
import React, { useState } from "react";

const niveaux = ["NA", "DEBUTANT", "AUTONOME", "AUTONOME +"];

const StepFour = ({ nextStep, prevStep, handleChange, data }) => {
  const [competences, setCompetences] = useState(data.competences || []);

  const handleCompetenceChange = (index, field, value) => {
    const newCompetences = [...competences];
    newCompetences[index][field] = value;
    setCompetences(newCompetences);
    handleChange({ competences: newCompetences });
  };

  const handleCategorieChange = (compIndex, catIndex, field, value) => {
    const newCompetences = [...competences];
    newCompetences[compIndex].categories[catIndex][field] = value;
    setCompetences(newCompetences);
    handleChange({ competences: newCompetences });
  };

  const ajouterCompetence = () => {
    setCompetences([
      ...competences,
      {
        intitule: "",
        note: "",
        categories: [
          {
            intitule: "",
            valeur: "NA",
          },
        ],
      },
    ]);
  };

  const ajouterCategorie = (index) => {
    const newCompetences = [...competences];
    newCompetences[index].categories.push({
      intitule: "",
      valeur: "NA",
    });
    setCompetences(newCompetences);
    handleChange({ competences: newCompetences });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Évaluations des Compétences</h2>

      {competences.map((comp, index) => (
        <div key={index} className="border p-4 rounded shadow-sm">
          <label className="block font-medium mb-1">Intitulé de la compétence :</label>
          <input
            type="text"
            value={comp.intitule}
            onChange={(e) =>
              handleCompetenceChange(index, "intitule", e.target.value)
            }
            className="w-full p-2 border rounded mb-2"
          />

          <label className="block font-medium mb-1">Note sur 20 :</label>
          <input
            type="number"
            min="0"
            max="20"
            value={comp.note}
            onChange={(e) =>
              handleCompetenceChange(index, "note", e.target.value)
            }
            className="w-32 p-2 border rounded mb-4"
          />

          <div className="space-y-2">
            {comp.categories.map((cat, catIndex) => (
              <div
                key={catIndex}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center"
              >
                <input
                  type="text"
                  placeholder="Catégorie"
                  value={cat.intitule}
                  onChange={(e) =>
                    handleCategorieChange(index, catIndex, "intitule", e.target.value)
                  }
                  className="p-2 border rounded"
                />
                <select
                  value={cat.valeur}
                  onChange={(e) =>
                    handleCategorieChange(index, catIndex, "valeur", e.target.value)
                  }
                  className="p-2 border rounded"
                >
                  {niveaux.map((niveau) => (
                    <option key={niveau} value={niveau}>
                      {niveau}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => ajouterCategorie(index)}
            className="mt-2 px-3 py-1 bg-blue-100 hover:bg-blue-200 rounded"
          >
            + Ajouter une catégorie
          </button>
        </div>
      ))}

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Précédent
        </button>
        <div className="space-x-2">
          <button
            type="button"
            onClick={ajouterCompetence}
            className="px-4 py-2 bg-green-200 hover:bg-green-300 rounded"
          >
            + Ajouter une compétence
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepFour;
