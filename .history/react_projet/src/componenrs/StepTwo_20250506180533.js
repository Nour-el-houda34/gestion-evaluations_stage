import React, { useState } from "react";

const StepTwo = ({ onNext }) => {
  const [implication, setImplication] = useState("");
  const [ouverture, setOuverture] = useState("");
  const [qualite, setQualite] = useState("");
  const [observations, setObservations] = useState("");

  const valeurOptions = [
    { key: "PARESSEUX", label: "Paresseux" },
    { key: "JUSTE_NECESSAIRE", label: "Le juste nécessaire" },
    { key: "BONNE", label: "Bonne" },
    { key: "TRES_FORTE", label: "Très forte" },
    { key: "DEPASSE", label: "Dépasse ses objectifs" }
  ];

  const handleRadioChange = (setter) => (e) => {
    setter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const evaluationData = [
      {
        categorie: "IMPLICATION",
        valeur: implication
      },
      {
        categorie: "OUVERTURE",
        valeur: ouverture
      },
      {
        categorie: "QUALITE",
        valeur: qualite
      },
      {
        categorie: "OBSERVATIONS",
        valeur: observations
      }
    ];

    console.log("Evaluation envoyée au backend :", evaluationData);
    onNext(evaluationData);
  };

  const renderOptions = (value, setValue, name) =>
    valeurOptions.map((option) => (
      <label key={option.key} style={{ display: "block", marginBottom: "5px" }}>
        <input
          type="radio"
          name={name}
          value={option.key}
          checked={value === option.key}
          onChange={handleRadioChange(setValue)}
        />
        {option.label}
      </label>
    ));

  return (
    <form onSubmit={handleSubmit}>
      <h3>Implication dans ses activités</h3>
      {renderOptions(implication, setImplication, "implication")}

      <h3>Ouverture aux autres</h3>
      {renderOptions(ouverture, setOuverture, "ouverture")}

      <h3>Qualité des productions</h3>
      {renderOptions(qualite, setQualite, "qualite")}

      <h3>Observations sur l'ensemble du travail accompli</h3>
      {renderOptions(observations, setObservations, "observations")}

      <button type="submit" disabled={!implication || !ouverture || !qualite || !observations}>
        Suivant
      </button>
    </form>
  );
};

export default StepTwo;
