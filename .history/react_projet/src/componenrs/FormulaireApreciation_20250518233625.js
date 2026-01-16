import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import axios from "axios";

const FormulaireApreciation = () => {
  const navigate = useNavigate();

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

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleChange = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const handleSubmit = async () => {
    try {
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

  const steps = {
    1: (
      <StepOne nextStep={nextStep} handleChange={handleChange} data={formData} />
    ),
    2: (
      <StepTwo
        nextStep={nextStep}
        prevStep={prevStep}
        handleChange={handleChange}
        data={formData}
      />
    ),
    3: (
      <StepThree prevStep={prevStep} data={formData} handleChange={handleChange} submit={handleSubmit} />
    )
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <a
        href="/dashboard"
        className="inline-block mb-6 text-blue-700 font-semibold hover:underline transition-colors"
      >
        &larr; Retour au dashboard
      </a>
      <div className="mb-8 flex items-center justify-center">
        <div className="flex space-x-4">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                step === s
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-200 text-gray-600 border-gray-300"
              } font-bold transition-all`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-gray-50 rounded-lg">{steps[step]}</div>
    </div>
  );
};

export default FormulaireApreciation;
