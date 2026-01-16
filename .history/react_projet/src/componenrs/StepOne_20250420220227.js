import React, { useState } from "react";

const StepOne = ({ nextStep, handleChange, data }) => {
  const [localData, setLocalData] = useState({
    nomStagiaire: data.stagiaire.nom || "",
    prenomStagiaire: data.stagiaire.prenom || "",
    nomEntreprise: data.stage.entreprise || "",
    entrepriseTuteur: data.tuteur.entreprise || "", // Ajout de l'entreprise du tuteur
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
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 rounded-lg shadow-2xl">
      <h2 className="text-3xl font-semibold text-center mb-8 text-gray-700">Informations Générales</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Nom du stagiaire</label>
            <input
              type="text"
              name="nomStagiaire"
              value={localData.nomStagiaire}
              onChange={handleInputChange}
              className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Prénom du stagiaire</label>
            <input
              type="text"
              name="prenomStagiaire"
              value={localData.prenomStagiaire}
              onChange={handleInputChange}
              className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Nom de l'entreprise</label>
            <input
              type="text"
              name="nomEntreprise"
              value={localData.nomEntreprise}
              onChange={handleInputChange}
              className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Nom du tuteur</label>
            <input
              type="text"
              name="nomTuteur"
              value={localData.nomTuteur}
              onChange={handleInputChange}
              className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Prénom du tuteur</label>
            <input
              type="text"
              name="prenomTuteur"
              value={localData.prenomTuteur}
              onChange={handleInputChange}
              className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Entreprise du tuteur</label>
            <input
              type="text"
              name="entrepriseTuteur"
              value={localData.entrepriseTuteur}
              onChange={handleInputChange}
              className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={localData.dateDebut}
              onChange={handleInputChange}
              className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Date de fin</label>
            <input
              type="date"
              name="dateFin"
              value={localData.dateFin}
              onChange={handleInputChange}
              className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        <div>
          <label className=" text-sm font-medium text-gray-600 mb-4">Thème du projet principal</label>
          <textarea
            name="description"
            value={localData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            rows="4"
          />
          <label className=" text-sm font-medium text-gray-600 mb-4">Objectifs assignés</label>
          <textarea
            name="objectif"
            value={localData.objectif}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            rows="4"
          />
        </div>

        <div>
          <label className=" text-sm font-medium text-gray-600 mb-4">Objectifs assignés</label>
          <textarea
            name="objectif"
            value={localData.objectif}
            onChange={handleInputChange}
            className="textarea textarea-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            rows="4"
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleNext}
          className="btn btn-primary px-6 py-3 rounded-xl text-white font-semibold bg-indigo-600 hover:bg-indigo-700 transition-colors duration-300 shadow-md"
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default StepOne;
