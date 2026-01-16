import React, { useState, useEffect } from "react";

const StepTwo = ({ nextStep, prevStep, handleChange, data }) => {
  const [implication, setImplication] = useState("");
  const [ouverture, setOuverture] = useState("");
  const [qualite, setQualite] = useState("");
  const [observations, setObservations] = useState("");

  useEffect(() => {
    if (data.appreciation && data.appreciation.evaluations) {
      data.appreciation.evaluations.forEach((evalItem) => {
        switch (evalItem.categorie) {
          case "Implication dans ses activités":
            setImplication(evalItem.valeur);
            break;
          case "Ouverture aux autres":
            setOuverture(evalItem.valeur);
            break;
          case "Qualité des productions":
            setQualite(evalItem.valeur);
            break;
          case "Observations sur l'ensemble du travail accompli":
            setObservations(evalItem.valeur);
            break;
          default:
            break;
        }
      });
    }
  }, [data]);

  const handleRadioChange = (setter) => (e) => setter(e.target.value);

  const handleNext = () => {
    const updatedEvaluations = [
      { categorie: "Implication dans ses activités", valeur: implication },
      { categorie: "Ouverture aux autres", valeur: ouverture },
      { categorie: "Qualité des productions", valeur: qualite },
      { categorie: "Observations sur l'ensemble du travail accompli", valeur: observations },
    ];

    handleChange("appreciation", {
      ...data.appreciation,
      evaluations: updatedEvaluations,
    });

    nextStep();
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6 text-gray-700">Appréciations globales sur l'étudiant(e)</h2>

      <div className="space-y-6">
        {/* Implication */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-lg font-medium text-gray-700">Implication dans ses activités :</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {["Paresseux", "Le juste nécessaire", "Bonne", "Très forte", "Dépasse ses objectifs"].map((opt) => (
              <label key={opt} className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="implication"
                  value={opt}
                  checked={implication === opt}
                  onChange={handleRadioChange(setImplication)}
                  className="form-radio h-4 w-4 text-indigo-500"
                />
                <span className="text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Ouverture */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-lg font-medium text-gray-700">Ouverture aux autres :</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {["Isolé(e) ou en opposition", "Renfermé(e) ou obtus", "Bonne", "Très bonne", "Excellente"].map((opt) => (
              <label key={opt} className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="ouverture"
                  value={opt}
                  checked={ouverture === opt}
                  onChange={handleRadioChange(setOuverture)}
                  className="form-radio h-4 w-4 text-indigo-500"
                />
                <span className="text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Qualité des productions */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-lg font-medium text-gray-700">Qualité de ses productions :</label>
          <div className="flex flex-wrap gap-4 mt-2">
            {["Médiocre", "Acceptable", "Bonne", "Très bonne", "Très professionnelle"].map((opt) => (
              <label key={opt} className="inline-flex items-center space-x-2">
                <input
                  type="radio"
                  name="qualite"
                  value={opt}
                  checked={qualite === opt}
                  onChange={handleRadioChange(setQualite)}
                  className="form-radio h-4 w-4 text-indigo-500"
                />
                <span className="text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Observations */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <label className="block text-lg font-medium text-gray-700">Observations sur l'ensemble du travail accompli :</label>
          <textarea
            name="observations"
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
            className="w-full p-4 mt-2 border-2 rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors duration-300"
          >
            Retour
          </button>
          <button
            onClick={handleNext}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepTwo;
