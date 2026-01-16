import React, { useState, useEffect } from "react";

const StepTwo = ({ nextStep, prevStep, handleChange, data }) => {
  const [implication, setImplication] = useState("");
  const [ouverture, setOuverture] = useState("");
  const [qualite, setQualite] = useState("");
  const [observations, setObservations] = useState("");

  // Initialisation des valeurs à partir de data.appreciation.evaluations
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
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Appréciations globales sur l'étudiant(e)</h2>

      {/* Implication */}
      <div>
        <label className="font-medium">Implication dans ses activités :</label>
        <div className="flex flex-col space-y-1">
          {["Paresseux", "Le juste nécessaire", "Bonne", "Très forte", "Dépasse ses objectifs"].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="implication"
                value={opt}
                checked={implication === opt}
                onChange={handleRadioChange(setImplication)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Ouverture */}
      <div>
        <label className="font-medium">Ouverture aux autres :</label>
        <div className="flex flex-col space-y-1">
          {["Isolé(e) ou en opposition", "Renfermé(e) ou obtus", "Bonne", "Très bonne", "Excellente"].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="ouverture"
                value={opt}
                checked={ouverture === opt}
                onChange={handleRadioChange(setOuverture)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Qualité des productions */}
      <div>
        <label className="font-medium">Qualité de ses productions :</label>
        <div className="flex flex-col space-y-1">
          {["Médiocre", "Acceptable", "Bonne", "Très bonne", "Très professionnelle"].map((opt) => (
            <label key={opt}>
              <input
                type="radio"
                name="qualite"
                value={opt}
                checked={qualite === opt}
                onChange={handleRadioChange(setQualite)}
                className="mr-2"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>

      {/* Observations */}
      <div>
        <label className="font-medium">Observations sur l'ensemble du travail accompli :</label>
        <textarea
          name="observations"
          value={observations}
          onChange={(e) => setObservations(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-4">
        <button onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded">Retour</button>
        <button onClick={handleNext} className="px-4 py-2 bg-blue-500 text-white rounded">Suivant</button>
      </div>
    </div>
  );
};

export default StepTwo;
