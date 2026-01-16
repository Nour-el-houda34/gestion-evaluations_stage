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
    // Enregistrer les informations dans le state parent
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

    // Passer à l'étape suivante
    nextStep();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Informations générales</h2>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block">Nom du stagiaire</label>
          <input
            type="text"
            name="nomStagiaire"
            value={localData.nomStagiaire}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block">Prénom du stagiaire</label>
          <input
            type="text"
            name="prenomStagiaire"
            value={localData.prenomStagiaire}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block">Nom de l'entreprise</label>
          <input
            type="text"
            name="nomEntreprise"
            value={localData.nomEntreprise}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block">Nom du tuteur</label>
          <input
            type="text"
            name="nomTuteur"
            value={localData.nomTuteur}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block">Prénom du tuteur</label>
          <input
            type="text"
            name="prenomTuteur"
            value={localData.prenomTuteur}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block">Date de début</label>
          <input
            type="date"
            name="dateDebut"
            value={localData.dateDebut}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label className="block">Date de fin</label>
          <input
            type="date"
            name="dateFin"
            value={localData.dateFin}
            onChange={handleInputChange}
            className="input input-bordered w-full"
          />
        </div>
      </div>

      <div>
        <label className="block">Thème du projet principal</label>
        <textarea
          name="description"
          value={localData.description}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full"
        />
      </div>

      <div>
        <label className="block">Objectifs assignés</label>
        <textarea
          name="objectif"
          value={localData.objectif}
          onChange={handleInputChange}
          className="textarea textarea-bordered w-full"
        />
      </div>

      <div className="flex justify-end mt-4">
        <button onClick={handleNext} className="btn btn-primary">
          Suivant
        </button>
      </div>
    </div>
  );
};

export default StepOne;
