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
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-700 via-indigo-600 to-blue-500 text-white relative overflow-hidden">
      {/* Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-indigo-500 rounded-full opacity-40 animate-spin-slow"></div>
        <div className="absolute top-1/4 right-1/4 w-16 h-16 bg-pink-400 rounded-full opacity-50 animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/4 w-20 h-20 bg-yellow-300 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/5 w-12 h-12 bg-green-400 rounded-full opacity-40 animate-bounce"></div>
      </div>

      <div className="relative z-10 bg-white shadow-2xl p-10 rounded-3xl w-full max-w-4xl text-gray-900">
        <h2 className="text-4xl font-bold text-center mb-8 drop-shadow-lg">
          Informations Générales
        </h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du stagiaire
              </label>
              <input
                type="text"
                name="nomStagiaire"
                value={localData.nomStagiaire}
                onChange={handleInputChange}
                className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom du stagiaire
              </label>
              <input
                type="text"
                name="prenomStagiaire"
                value={localData.prenomStagiaire}
                onChange={handleInputChange}
                className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'entreprise
              </label>
              <input
                type="text"
                name="nomEntreprise"
                value={localData.nomEntreprise}
                onChange={handleInputChange}
                className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du tuteur
              </label>
              <input
                type="text"
                name="nomTuteur"
                value={localData.nomTuteur}
                onChange={handleInputChange}
                className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prénom du tuteur
              </label>
              <input
                type="text"
                name="prenomTuteur"
                value={localData.prenomTuteur}
                onChange={handleInputChange}
                className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Entreprise du tuteur
              </label>
              <input
                type="text"
                name="entrepriseTuteur"
                value={localData.entrepriseTuteur}
                onChange={handleInputChange}
                className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de début
              </label>
              <input
                type="date"
                name="dateDebut"
                value={localData.dateDebut}
                onChange={handleInputChange}
                className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date de fin
              </label>
              <input
                type="date"
                name="dateFin"
                value={localData.dateFin}
                onChange={handleInputChange}
                className="input input-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Thème du projet principal
              </label>
              <textarea
                name="description"
                value={localData.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                rows="4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Objectifs assignés
              </label>
              <textarea
                name="objectif"
                value={localData.objectif}
                onChange={handleInputChange}
                className="textarea textarea-bordered w-full p-4 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                rows="4"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <button
            onClick={handleNext}
            className="btn btn-primary px-6 py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 hover:shadow-xl transition-all duration-300"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepOne;
