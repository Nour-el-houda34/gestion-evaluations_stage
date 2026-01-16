import React from "react";

const StepOne = ({ nextStep, handleChange, data }) => {
  const handleInput = (section, field, value) => {
    handleChange(section, { [field]: value });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Informations Générales</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Stagiaire */}
        <div>
          <h3 className="font-semibold">Stagiaire</h3>
          <input
            type="text"
            placeholder="Nom"
            onChange={(e) => handleInput("stagiaire", "nom", e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Prénom"
            onChange={(e) => handleInput("stagiaire", "prenom", e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Institution"
            onChange={(e) => handleInput("stagiaire", "institution", e.target.value)}
            className="input"
          />
        </div>

        {/* Tuteur */}
        <div>
          <h3 className="font-semibold">Tuteur</h3>
          <input
            type="text"
            placeholder="Nom"
            onChange={(e) => handleInput("tuteur", "nom", e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Prénom"
            onChange={(e) => handleInput("tuteur", "prenom", e.target.value)}
            className="input"
          />
          <input
            type="text"
            placeholder="Entreprise"
            onChange={(e) => handleInput("tuteur", "entreprise", e.target.value)}
            className="input"
          />
        </div>

        {/* Stage */}
        <div>
          <h3 className="font-semibold">Stage</h3>
          <input
            type="text"
            placeholder="Entreprise"
            onChange={(e) => handleInput("stage", "entreprise", e.target.value)}
            className="input"
          />
          <textarea
            placeholder="Description"
            onChange={(e) => handleInput("stage", "description", e.target.value)}
            className="input"
          />
          <textarea
            placeholder="Objectif"
            onChange={(e) => handleInput("stage", "objectif", e.target.value)}
            className="input"
          />
        </div>
      </div>

      <div className="flex justify-end mt-4">
        <button className="btn" onClick={nextStep}>Suivant</button>
      </div>
    </div>
  );
};

export default StepOne;
