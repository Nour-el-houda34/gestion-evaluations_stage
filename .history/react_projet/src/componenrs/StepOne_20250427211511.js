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

      <div className="space-y-10">
        {/* Stagiaire Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField
            label="Nom du stagiaire"
            name="nomStagiaire"
            value={localData.nomStagiaire}
            onChange={handleInputChange}
          />
          <InputField
            label="Prénom du stagiaire"
            name="prenomStagiaire"
            value={localData.prenomStagiaire}
            onChange={handleInputChange}
          />
          <InputField
            label="Nom de l'entreprise"
            name="nomEntreprise"
            value={localData.nomEntreprise}
            onChange={handleInputChange}
          />
        </div>

        {/* Tuteur Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InputField
            label="Nom du tuteur"
            name="nomTuteur"
            value={localData.nomTuteur}
            onChange={handleInputChange}
          />
          <InputField
            label="Prénom du tuteur"
            name="prenomTuteur"
            value={localData.prenomTuteur}
            onChange={handleInputChange}
          />
          <InputField
            label="Date de début"
            name="dateDebut"
            type="date"
            value={localData.dateDebut}
            onChange={handleInputChange}
          />
          <InputField
            label="Date de fin"
            name="dateFin"
            type="date"
            value={localData.dateFin}
            onChange={handleInputChange}
          />
        </div>

        {/* Project Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TextAreaField
            label="Thème du projet principal"
            name="description"
            value={localData.description}
            onChange={handleInputChange}
          />
          <TextAreaField
            label="Objectifs assignés"
            name="objectif"
            value={localData.objectif}
            onChange={handleInputChange}
          />
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
