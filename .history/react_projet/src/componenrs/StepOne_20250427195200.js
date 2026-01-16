import React, { useState } from "react";

const StepOne = ({ nextStep, handleChange, data }) => {
  const [localData, setLocalData] = useState({
    nomStagiaire: data.stagiaire.nom || "",
    prenomStagiaire: data.stagiaire.prenom || "",
    nomEntreprise: data.stage.entreprise || "",
    entrepriseTuteur: data.tuteur.entreprise || "",
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
      entreprise: localData.entrepriseTuteur
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
    <div className="max-w-4xl mx-auto p-10 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">Informations Générales</h2>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du stagiaire</label>
            <input
              type="text"
              name="nomStagiaire"
              value={localData.nomStagiaire}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom du stagiaire</label>
            <input
              type="text"
              name="prenomStagiaire"
              value={localData.prenomStagiaire}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'entreprise</label>
            <input
              type="text"
              name="nomEntreprise"
              value={localData.nomEntreprise}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du tuteur</label>
            <input
              type="text"
              name="nomTuteur"
              value={localData.nomTuteur}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom du tuteur</label>
            <input
              type="text"
              name="prenomTuteur"
              value={localData.prenomTuteur}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Entreprise du tuteur</label>
            <input
              type="text"
              name="entrepriseTuteur"
              value={localData.entrepriseTuteur}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={localData.dateDebut}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
            <input
              type="date"
              name="dateFin"
              value={localData.dateFin}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Thème du projet principal</label>
            <textarea
              name="description"
              value={localData.description}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Objectifs assignés</label>
            <textarea
              name="objectif"
              value={localData.objectif}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows="4"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-10">
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-lg text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-300 transition-all shadow-lg"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default StepOne;
