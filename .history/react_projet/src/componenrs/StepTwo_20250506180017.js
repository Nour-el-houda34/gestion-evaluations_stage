import React, { useState } from "react";

const StepTwo = ({ onNext }) => {
  const [implication, setImplication] = useState("");
  const [ouverture, setOuverture] = useState("");
  const [qualite, setQualite] = useState("");
  const [observation, setObservation] = useState("");

  const handleRadioChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const evaluationData = {
      implication,
      ouverture,
      qualite,
      observation,
    };

    console.log("Évaluation soumise :", evaluationData);

    // Envoie des données au parent ou backend ici
    onNext(evaluationData);
  };

  const implicationOptions = [
    { label: "Paresseux", value: "PARESSEUX" },
    { label: "Le juste nécessaire", value: "LE_JUSTE_NECESSAIRE" },
    { label: "Bonne", value: "BONNE" },
    { label: "Très forte", value: "TRES_FORTE" },
    { label: "Dépasse ses objectifs", value: "DEPASSE_SES_OBJECTIFS" },
  ];

  const ouvertureOptions = [
    { label: "Isolé en opposition", value: "ISOLE_EN_OPPOSITION" },
    { label: "Renfermé ou obtus", value: "RENFERME_OU_OBTUS" },
    { label: "Bonne", value: "BONNE" },
    { label: "Très bonne", value: "TRES_BONNE" },
    { label: "Excellente", value: "EXCELLENTE" },
  ];

  const qualiteOptions = [
    { label: "Médiocre", value: "MEDIOCRE" },
    { label: "Acceptable", value: "ACCEPTABLE" },
    { label: "Bonne", value: "BONNE" },
    { label: "Très bonne", value: "TRES_BONNE" },
    { label: "Très professionnelle", value: "TRES_PROFESSIONNELLE" },
  ];

  const renderRadioGroup = (title, name, selectedValue, setSelected, options) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="flex flex-col space-y-2">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center space-x-2">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={handleRadioChange(setSelected)}
              className="form-radio h-4 w-4 text-blue-500"
            />
            <span className="text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Évaluation de l'étudiant</h2>

      {renderRadioGroup("Implication", "implication", implication, setImplication, implicationOptions)}
      {renderRadioGroup("Ouverture", "ouverture", ouverture, setOuverture, ouvertureOptions)}
      {renderRadioGroup("Qualité du travail", "qualite", qualite, setQualite, qualiteOptions)}

      <div className="mb-6">
        <label htmlFor="observation" className="block text-sm font-medium text-gray-700">
          Observation
        </label>
        <textarea
          id="observation"
          name="observation"
          rows="4"
          value={observation}
          onChange={(e) => setObservation(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        Suivant
      </button>
    </form>
  );
};

export default StepTwo;
