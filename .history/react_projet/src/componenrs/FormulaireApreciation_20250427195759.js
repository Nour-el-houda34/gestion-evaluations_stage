import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import axios from "axios";
import Dashboard from "./Dashboard"; // Import du Dashboard

const FormulaireApreciation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stagiaire: {},
    stage: {},
    tuteur: {},
    periode: {},
    appreciation: {
      evaluations: [],
      competences: [],
    },
  });
  const [showDashboard, setShowDashboard] = useState(true); // Contrôler l'affichage du tableau de bord

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleChange = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const handleAppreciationChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      appreciation: { ...prev.appreciation, ...data },
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Données envoyées :", formData);
      const response = await axios.post(
        "http://localhost:8081/api/evaluation/submit",
        formData
      );
      alert("Formulaire envoyé avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue lors de l'envoi.");
    }
  };

  const goToForm = () => {
    setShowDashboard(false); // Masque le tableau de bord et affiche le formulaire
  };

  const steps = {
    1: <StepOne nextStep={nextStep} handleChange={handleChange} data={formData} />,
    2: <StepTwo nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} data={formData} />,
    3: <StepThree prevStep={prevStep} data={formData} handleChange={handleChange} />,
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        Évaluation Stage Étudiants
      </h1>
      {showDashboard ? (
        <Dashboard goToForm={goToForm} />
      ) : (
        steps[step]
      )}
    </div>
  );
};

export default FormulaireApreciation;
