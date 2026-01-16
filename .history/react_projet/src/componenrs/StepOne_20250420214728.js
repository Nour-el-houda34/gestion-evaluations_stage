import React, { useState } from "react";

const StepOne = ({ nextStep, handleChange, data }) => {
  const [localData, setLocalData] = useState({
    nomStagiaire: data.stagiaire.nom || "",
    prenomStagiaire: data.stagiaire.prenom || "",
    nomEntreprise: data.stage.entreprise || "",
    nomTuteur: data.tuteur.nom || "",
    prenomTuteur: data.tuteur.prenom || "",
    dateDebut: data.periode.dateDebut || "",
    dateFin: data.periode.dateFin || "",
    description: data.stage.description || "",
    objectif: data.stage.objectif || ""
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalData({ ...localData, [name]: value });
  };

  const handleNext = () => {
    handleChange("stagiaire", {
      nom: localData.nomStagiaire,
      prenom: localData.prenomStagiaire
    });
    handleChange("tuteur", {
      nom: localData.nomTuteur,
      prenom: localData.prenomTuteur
    });
    handleChange("stage", {
      entreprise: localData.nomEntreprise,
      description: localData.description,
      objectif: localData.objectif
    });
    handleChange("periode", {
      dateDebut: localData.dateDebut,
      dateFin: localData.dateFin
    });
    nextStep();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-primary">Informations générales</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Nom du stagiaire</label>
            <input
              type="text"
              name="nomStagiaire"
              value={localData.nomStagiaire}
              onChange={handleInputChange}
              className="input input-bordered w-full p-3 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Prénom du stagiaire</label>
            <input
              type="text"
              name="prenomStagiaire"
              value={localData.prenomStagiaire}
              onChange={handleInputChange}
              className="input input-bordered w-full p-3 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Nom de l'entreprise</label>
            <input
              type="text"
              name="nomEntreprise"
              value={localData.nomEntreprise}
              onChange={handleInputChange}
              className="input input-bordered w-full p-3 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Nom du tuteur</label>
            <input
              type="text"
              name="nomTuteur"
              value={localData.nomTuteur}
              onChange={handleInputChange}
              className="input input-bordered w-full p-3 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Prénom du tuteur</label>
            <input
              type="text"
              name="prenomTuteur"
              value={localData.prenomTuteur}
              onChange={handleInputChange}
              className="input input-bordered w-full p-3 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={localData.dateDebut}
              onChange={handleInputChange}
              className="input input-bordered w-full p-3 rounded-lg shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Date de fin</label>
            <input
              type="date"
              name="dateFin"
              value={localData.dateFin}
              onChange={handleInputChange}
              className="input input-bordered w-full p-3 rounded-lg shadow-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Thème du projet principal</label>
          <textarea
            name="description"
            value={localData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full p-3 rounded-lg shadow-sm"
            rows="4"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Objectifs assignés</label>
          <textarea
            name="objectif"
            value={localData.objectif}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full p-3 rounded-lg shadow-sm"
            rows="4"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          className="btn btn-primary px-6 py-3 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default StepOne;
