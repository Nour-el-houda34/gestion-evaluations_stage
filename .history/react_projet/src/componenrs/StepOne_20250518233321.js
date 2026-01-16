import React, { useState } from "react";

const StepOne = ({ nextStep, handleChange, data }) => {
  const [localData, setLocalData] = useState({
    nomStagiaire: data.stagiaire.nom || "",
    prenomStagiaire: data.stagiaire.prenom || "",
    nomEntreprise: data.stage.entreprise || "",
    entrepriseTuteur:data.stage.entreprise || "",
    nomTuteur: data.tuteur.nom || "",
    emailStagiaire: data.stagiaire.email || "",
    prenomTuteur: data.tuteur.prenom || "",
    emailTuteur: data.tuteur.email || "",
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
      prenom: localData.prenomStagiaire,
      email: localData.emailStagiaire
    });
    handleChange("tuteur", {
      nom: localData.nomTuteur,
      prenom: localData.prenomTuteur,
      email: localData.emailTuteur,
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
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-800">
        Appréciation du Tuteur de Stage
      </h2>
  
      <div className="space-y-6">
      
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du stagiaire</label>
            <input
              type="text"
              name="nomStagiaire"
              value={localData.nomStagiaire}
              onChange={handleInputChange}
              className="input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom du stagiaire</label>
            <input
              type="text"
              name="prenomStagiaire"
              value={localData.prenomStagiaire}
              onChange={handleInputChange}
              className="input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email du stagiaire</label>
            <input
              type="text"
              name="emailStagiaire"
              value={localData.emailStagiaire}
              onChange={handleInputChange}
              className="input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
            />
          </div>
          </div>
        
          <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom du tuteur</label>
              <input
                type="text"
                name="nomTuteur"
                value={localData.nomTuteur}
                onChange={handleInputChange}
                className="input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom du tuteur</label>
              <input
                type="text"
                name="prenomTuteur"
                value={localData.prenomTuteur}
                onChange={handleInputChange}
                className="input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
              />
            </div>
            <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email du Tuteur</label>
            <input
              type="text"
              name="emailTuteur"
              value={localData.emailTuteur}
              onChange={handleInputChange}
              className="input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
            />
          </div>
            
          </div>
        </div>
  
     
        <div className="col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nom de l'entreprise</label>
              <input
                type="text"
                name="nomEntreprise"
                value={localData.nomEntreprise}
                onChange={handleInputChange}
                className="input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
              />
            </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date de début</label>
            <input
              type="date"
              name="dateDebut"
              value={localData.dateDebut}
              onChange={handleInputChange}
              className="input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Date de fin</label>
            <input
              type="date"
              name="dateFin"
              value={localData.dateFin}
              onChange={handleInputChange}
              className="input w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
            />
          </div>
        </div>
  
     
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Thème du projet principal</label>
            <textarea
              name="description"
              value={localData.description}
              onChange={handleInputChange}
              className="textarea w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
              rows="4"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Objectifs assignés</label>
            <textarea
              name="objectif"
              value={localData.objectif}
              onChange={handleInputChange}
              className="textarea w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-md"
              rows="4"
            />
          </div>
        </div>
      </div>
  

      <div className="flex justify-end mt-6">
        <button
          onClick={handleNext}
          className="px-8 py-3 rounded-lg text-white font-bold bg-blue-600 hover:bg-blue-700 transition-all duration-300 shadow-lg"
        >
          Suivant
        </button>
      </div>
    </div>
  );
  
  
  };



export default StepOne;
