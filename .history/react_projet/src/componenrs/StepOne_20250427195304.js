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
    <div className="max-w-4xl mx-auto p-10 bg-gradient-to-r from-blue-50 to-indigo-100 rounded-3xl shadow-2xl border border-gray-300">
      <h2 className="text-5xl font-extrabold text-center mb-12 text-indigo-800">Informations Générales</h2>

      <div className="space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Nom du stagiaire</label>
            <input
              type="text"
              name="nomStagiaire"
              value={localData.nomStagiaire}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Prénom du stagiaire</label>
            <input
              type="text"
              name="prenomStagiaire"
              value={localData.prenomStagiaire}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Nom de l'entreprise</label>
            <input
              type="text"
              name="nomEntreprise"
              value={localData.nomEntreprise}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Nom du tuteur</label>
            <input
              type="text"
              name="nomTuteur"
              value={localData.nomTuteur}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Prénom du tuteur</label>
            <input
              type="text"
              name="prenomTuteur"
              value={localData.prenomTuteur}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Entreprise du tuteur</label>
            <input
              type="text"
              name="entrepriseTuteur"
              value={localData.entrepriseTuteur}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={localData.dateDebut}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Date de fin</label>
            <input
              type="date"
              name="dateFin"
              value={localData.dateFin}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Thème du projet principal</label>
            <textarea
              name="description"
              value={localData.description}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
              rows="5"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-gray-800 mb-3">Objectifs assignés</label>
            <textarea
              name="objectif"
              value={localData.objectif}
              onChange={handleInputChange}
              className="w-full p-4 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-400 focus:outline-none shadow-sm"
              rows="5"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-12">
        <button
          onClick={handleNext}
          className="px-10 py-4 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 focus:ring-4 focus:ring-indigo-300 transition-all shadow-lg transform hover:scale-105"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default StepOne;
