import React, { useState } from "react";

const StepOne = ({ nextStep, handleChange, data }) => {
  const [localData, setLocalData] = useState({
    nomStagiaire: data.stagiaire.nom || "",
    prenomStagiaire: data.stagiaire.prenom || "",
    nomEntreprise: data.stage.entreprise || "",
    entrepriseTuteur:data.stage.entreprise || "", // Ajout de l'entreprise du tuteur
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
      prenom: localData.prenomTuteur,
      entreprise: localData.entrepriseTuteur // Ajout de l'entreprise du tuteur
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
    <div className="max-w-4xl mx-auto p-10 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-2xl">
      <h2 className="text-4xl font-extrabold text-center mb-10 text-blue-800">
        Appréciation du Tuteur de Stage
      </h2>

      {/* Display Tuteur Information */}
      <div className="mb-6 text-center">
        <p className="text-lg font-semibold text-gray-700">
          Tuteur: {localData.nomTuteur} {localData.prenomTuteur}, Entreprise:{" "}
          {localData.entrepriseTuteur}
        </p>
      </div>

      <div className="space-y-10">
        {/* Stagiaire and Tuteur Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stagiaire Information */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom du stagiaire
            </label>
            <input
              type="text"
              name="nomStagiaire"
              value={localData.nomStagiaire}
              onChange={handleInputChange}
              className="input w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prénom du stagiaire
            </label>
            <input
              type="text"
              name="prenomStagiaire"
              value={localData.prenomStagiaire}
              onChange={handleInputChange}
              className="input w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </div>

          {/* Tuteur Information */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom du tuteur
            </label>
            <input
              type="text"
              name="nomTuteur"
              value={localData.nomTuteur}
              onChange={handleInputChange}
              className="input w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Prénom du tuteur
            </label>
            <input
              type="text"
              name="prenomTuteur"
              value={localData.prenomTuteur}
              onChange={handleInputChange}
              className="input w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </div>
        </div>

        {/* Entreprise and Dates Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              name="nomEntreprise"
              value={localData.nomEntreprise}
              onChange={handleInputChange}
              className="input w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date de début
            </label>
            <input
              type="date"
              name="dateDebut"
              value={localData.dateDebut}
              onChange={handleInputChange}
              className="input w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Date de fin
            </label>
            <input
              type="date"
              name="dateFin"
              value={localData.dateFin}
              onChange={handleInputChange}
              className="input w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </div>
        </div>

        {/* Project Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thème du projet principal
            </label>
            <textarea
              name="description"
              value={localData.description}
              onChange={handleInputChange}
              className="textarea w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Objectifs assignés
            </label>
            <textarea
              name="objectif"
              value={localData.objectif}
              onChange={handleInputChange}
              className="textarea w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              rows="4"
            />
          </div>
        </div>
      </div>

      {/* Navigation Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          className="px-10 py-3 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};



export default StepOne;
