import React, { useState } from "react";

const options = ["PARESSEUX", "LE_JUSTE_NECESSAIRE", "BONNE", "TRES_FORTE", "DEPASSE_OBJECTIFS"];
const ouvertureOptions = ["ISOLE", "FERME", "BONNE", "TRES_BONNE", "EXCELLENTE"];
const productionOptions = ["MEDIOCRE", "ACCEPTABLE", "BONNE", "TRES_BONNE", "TRES_PRO"];

const StepThree = ({ nextStep, prevStep, handleChange, data }) => {
  const [localData, setLocalData] = useState({
    implication: "",
    ouverture: "",
    production: "",
    observations: "",
  });

  const handleRadioChange = (field, value) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
    handleChange({ [field]: value });
  };

  const handleTextChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({ ...prev, [name]: value }));
    handleChange({ [name]: value });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Appréciation Globale</h2>

      {/* Implication */}
      <div className="mb-4">
        <p><strong>Implication dans ses activités :</strong></p>
        {options.map((opt) => (
          <label key={opt} className="block">
            <input
              type="radio"
              name="implication"
              checked={localData.implication === opt}
              onChange={() => handleRadioChange("implication", opt)}
            />
            {opt.replaceAll("_", " ")}
          </label>
        ))}
      </div>

      {/* Ouverture */}
      <div className="mb-4">
        <p><strong>Ouverture aux autres :</strong></p>
        {ouvertureOptions.map((opt) => (
          <label key={opt} className="block">
            <input
              type="radio"
              name="ouverture"
              checked={localData.ouverture === opt}
              onChange={() => handleRadioChange("ouverture", opt)}
            />
            {opt.replaceAll("_", " ")}
          </label>
        ))}
      </div>

      {/* Production */}
      <div className="mb-4">
        <p><strong>Qualité des productions :</strong></p>
        {productionOptions.map((opt) => (
          <label key={opt} className="block">
            <input
              type="radio"
              name="production"
              checked={localData.production === opt}
              onChange={() => handleRadioChange("production", opt)}
            />
            {opt.replaceAll("_", " ")}
          </label>
        ))}
      </div>

      {/* Observations */}
      <div className="mb-4">
        <label><strong>Observations sur l'ensemble du travail accompli :</strong></label>
        <textarea
          name="observations"
          className="input"
          value={localData.observations}
          onChange={handleTextChange}
        />
      </div>

      <div className="flex justify-between mt-4">
        <button className="btn" onClick={prevStep}>Retour</button>
        <button className="btn" onClick={nextStep}>Suivant</button>
      </div>
    </div>
  );
};

export default StepThree;
