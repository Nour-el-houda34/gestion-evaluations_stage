import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import axios from "axios";
import { FaUserTie, FaRegSmile, FaTasks } from "react-icons/fa";

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

  // Import icons from react-icons

  const stepIcons = {
    1: <FaUserTie size={28} />,
    2: <FaRegSmile size={28} />,
    3: <FaTasks size={28} />
  };

  return (
    <div className="max-w-4xl w-full mx-auto p-8 mt-8 bg-white rounded-xl shadow-2xl">
      <nav className="mb-4">
        <a
          href="/dashboard"
          className="inline-flex items-center text-blue-700 font-semibold hover:underline transition-colors"
        >
          <span className="mr-2 text-xl">
            {/* Utilisation d'une icône de retour */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </span>
          Retour au dashboard
        </a>
      </nav>
      <div className="mb-3 flex items-center justify-center">
        <ol className="flex space-x-12">
          {[1, 2, 3].map((s) => (
            <li key={s} className="flex flex-col items-center">
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-full text-2xl font-bold border-2 transition-all duration-200 shadow-md ${
                  step === s
                    ? "bg-blue-600 text-white border-blue-400 scale-110 shadow-lg"
                    : "bg-gray-100 text-gray-600 border-gray-300"
                }`}
              >
                {stepIcons[s]}
              </div>
              <span className={`mt-3 text-sm font-medium text-center max-w-[250px] ${
                step === s ? "text-blue-700" : "text-gray-500"
              }`}>
                {s === 1 && (
                  <>
                     Appréciation du Tuteur de Stage
                  </>
                )}
                {s === 2 && (
                  <>
                     Appréciations globales sur l'étudiant(e)
                  </>
                )}
                {s === 3 && (
                  <>
                     Évaluations des Compétences
                  </>
                )}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <section className=" min-h-[350px]">
        {steps[step]}
      </section>
    </div>
  );
};

export default FormulaireApreciation;
