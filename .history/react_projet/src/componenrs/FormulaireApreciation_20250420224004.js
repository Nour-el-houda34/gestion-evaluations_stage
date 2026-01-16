import React, { useState } from "react";
import StepThree from "./StepThree";

const FormulaireEvaluation = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    appreciation: {
      competences: [], // Données pour les compétences, évaluations, etc.
    },
  });

  // Fonction pour avancer dans les étapes
  const nextStep = () => {
    setStep(step + 1);
  };

  // Fonction pour revenir en arrière
  const prevStep = () => {
    setStep(step - 1);
  };

  // Mettre à jour les données de l'évaluation
  const handleChange = (updatedData) => {
    setFormData((prevData) => ({
      ...prevData,
      appreciation: {
        ...prevData.appreciation,
        competences: updatedData,
      },
    }));
  };

  return (
    <div>
      {step === 1 && <div>Étape 1 : Informations de base</div>}
      {step === 2 && <div>Étape 2 : Autres informations</div>}
      {step === 3 && (
        <StepThree
          nextStep={nextStep}
          prevStep={prevStep}
          handleChange={handleChange}
          data={formData.appreciation} // Passer les données à StepThree
        />
      )}
    </div>
  );
};

export default FormulaireEvaluation;
