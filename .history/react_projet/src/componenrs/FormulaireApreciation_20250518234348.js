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
    <div className="max-w-4xl w-full mx-auto p-8 mt-4">
      <nav className="mb-3">
        <a
          href="/dashboard"
          className="inline-flex items-center text-blue-700 font-semibold hover:underline transition-colors"
        >
          <span className="mr-2 text-xl">&larr;</span> Retour au dashboard
        </a>
      </nav>
      <div className="mb-10 flex items-center justify-center">
        <ol className="flex space-x-8">
          {[1, 2, 3].map((s) => (
            <li key={s} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full text-lg font-bold transition-all duration-200 ${
                  step === s
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
                style={{ border: "none", boxShadow: "none" }}
              >
                {s}
              </div>
              <span className={`mt-2 text-xs font-medium ${
                step === s ? "text-blue-700" : "text-gray-500"
              }`}>
                {s === 1 && "Appréciation du Tuteur de Stage"}
                {s === 2 && "Appréciations globales sur l'étudiant(e)"}
                {s === 3 && "Évaluations des Compétences"}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <section className="p-6 min-h-[350px]">
        {steps[step]}
      </section>
    </div>
  );
};

export default FormulaireApreciation;
