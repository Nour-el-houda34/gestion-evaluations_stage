import React, { useState } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StepThree from "./StepThree";
import axios from "axios";

const FormulaireApreciation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    stagiaire: {},
    stage: {},
    tuteur: {},
    periode: {},
    appreciation: {
      evaluations: [],
      competences: []
    }
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/'); // redirige vers la page d'authentification
      return;
    }

}, [navigate]);


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
      // Vérifie que formData est complet avant l'envoi
      console.log("Données envoyées :", formData);
      
      const response = await axios.post("http://localhost:8081/api/evaluation/submit", formData);
      alert("Formulaire envoyé avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      alert("Une erreur est survenue lors de l'envoi.");
    }
  };

  const steps = {
    1: <StepOne nextStep={nextStep} handleChange={handleChange} data={formData} />, // infos stagiaire, stage, tuteur
    2: <StepTwo nextStep={nextStep} prevStep={prevStep} handleChange={handleChange} data={formData} />, // période, projet
    3: <StepThree prevStep={prevStep} data={formData}  handleChange={handleChange}  />, // appréciations globales

    //4: <StepFour nextStep={nextStep} prevStep={prevStep} handleChange={handleAppreciationChange} data={formData.appreciation} />, // compétences (si nécessaire)
    //5: <Review prevStep={prevStep} submit={handleSubmit} data={formData} />, // récap et envoi
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      {steps[step]}
    </div>
  );
};

export default FormulaireApreciation;






















 