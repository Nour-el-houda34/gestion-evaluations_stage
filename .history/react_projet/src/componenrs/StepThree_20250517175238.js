import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import Modal from 'react-modal';

const niveaux = ["NA", "DEBUTANT", "AUTONOME", "AUTONOME +"];
Modal.setAppElement('#root');

const initCategories = [
  {
    nom: "Compétences liées à l’individu",
    competences: [
      "Être capable d'analyse et de synthèse",
      "Proposer des méthodes et des axes de travail",
      "Faire adhérer les acteurs",
      "S'intégrer dans un contexte international",
      "S'autoévaluer",
      "Identifier des problèmes complexes",
    ],
  },
  {
    nom: "Compétences liées à l’entreprise",
    competences: [
      "Analyser le fonctionnement de l’entreprise",
      "Identifier la réglementation et les normes",
      "Analyser la demande projet",
      "Comprendre la politique environnementale",
      "Rechercher et sélectionner l'information",
    ],
  },
  {
    nom: "Compétences scientifiques et techniques",
    competences: [
      "Assurer la conception préliminaire de produits / services / processus / usages",
    ],
  },
];

const StepThree = ({ nextStep, prevStep, handleChange, data }) => {
  const [categories, setCategories] = useState([]);
  const [competencesSpecifiques, setCompetencesSpecifiques] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState(''); // 'error' or 'success'

  useEffect(() => {
    if (categories.length === 0) {
      const restored = initCategories.map((cat) => {
        const saved = data.appreciation.competences.find((c) => c.intitule === cat.nom);
        return {
          nom: cat.nom,
          competences: cat.competences,
          note: saved?.note?.toString() || "",
          evaluations: cat.competences.map((comp) => {
            const item = saved?.categories?.find((sc) => sc.intitule === comp);
            return item?.valeur || "";
          }),
        };
      });

      setCategories(restored);

      const specific = data.appreciation.competences.find(
        (c) => c.intitule === "Compétences spécifiques"
      );
      setCompetencesSpecifiques(specific?.categories || []);
    }
  }, [data]);

  const handleRadioChange = (catIdx, compIdx, value) => {
    const updated = [...categories];
    updated[catIdx].evaluations[compIdx] = value;
    setCategories(updated);
  };

  const handleNoteChange = (catIdx, value) => {
    const updated = [...categories];
    updated[catIdx].note = value;
    setCategories(updated);
  };

  const handleSpecificChange = (idx, key, value) => {
    const updated = [...competencesSpecifiques];
    updated[idx][key] = value;
    setCompetencesSpecifiques(updated);
  };

  const addSpecific = () => {
    const updated = [...competencesSpecifiques, { intitule: "", valeur: "" }];
    setCompetencesSpecifiques(updated);
  };

  const buildCompetencePayload = (cats, specs) => {
    const payload = cats.map((cat) => ({
      intitule: cat.nom,
      note: parseInt(cat.note || 0, 10),
      categories: cat.competences.map((comp, i) => ({
        intitule: comp,
        valeur: cat.evaluations[i] || "",
      })),
    }));
    if (specs.length > 0) {
      payload.push({
        intitule: "Compétences spécifiques",
        note: 0,
        categories: specs,
      });
    }
    return payload;
  };

  const handlePrev = () => {
    const updatedCompetences = buildCompetencePayload(categories, competencesSpecifiques);

    if (JSON.stringify(updatedCompetences) !== JSON.stringify(data.appreciation.competences)) {
      handleChange("appreciation", {
        ...data.appreciation,
        competences: updatedCompetences,
      });
    }

    prevStep();
  };

  const handleSubmit = async () => {
    const { stagiaire, stage, tuteur, periode } = data;
    console.log("Soumission en cours...");
    if (
      !stagiaire?.nom ||
      !stagiaire?.email ||
      !stagiaire?.prenom ||
      !stage?.entreprise ||
      !stage?.description ||
      !stage?.objectif ||
      !tuteur?.nom ||
      !tuteur?.prenom ||
      !tuteur?.email ||
      !periode?.dateDebut ||
      !periode?.dateFin
    ) {
      setModalMessage("Veuillez remplir toutes les informations nécessaires concernant stagiaire et stage.");
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    const startDate = new Date(periode.dateDebut);
    const endDate = new Date(periode.dateFin);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      setModalMessage("Les dates de début et de fin doivent être valides.");
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    if (startDate > endDate) {
      setModalMessage("La date de début ne peut pas être postérieure à la date de fin.");
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    const hasEmptyCompetences = categories.some((cat) =>
      cat.evaluations.some((evaluation) => evaluation === "")
    );

    
    if (hasEmptyCompetences) {
      setModalMessage("Veuillez évaluer toutes les compétences.");
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    const hasEmptyNotes = categories.some((cat) => !cat.note || isNaN(cat.note) || cat.note < 0 || cat.note > 20);

    if (hasEmptyNotes) {
      setModalMessage("Veuillez attribuer une note valide (entre 0 et 20) à chaque catégorie.");
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    const hasEmptyEvaluations = data.appreciation.evaluations.some(
      (evaluation) => !evaluation.categorie || !evaluation.valeur
    );

    if (hasEmptyEvaluations) {
      setModalMessage("Veuillez remplir toutes les évaluations globales.");
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    const hasEmptySpecificCompetences = competencesSpecifiques.some(
      (comp) => !comp.intitule || !comp.valeur
    );

    if (hasEmptySpecificCompetences) {
      setModalMessage("Veuillez remplir toutes les compétences spécifiques.");
      setModalType('error');
      setIsModalOpen(true);
      return;
    }

    const updatedCompetences = buildCompetencePayload(categories, competencesSpecifiques);

    try {
      const payload = {
        stagiaire: {
          nom: stagiaire.nom || "",
          prenom: stagiaire.prenom || "",
          email: stagiaire.email || "",
        },
        stage: {
          entreprise: stage.entreprise || "",
          description: stage.description || "",
          objectif: stage.objectif || "",
        },
        tuteur: {
          nom: tuteur.nom || "",
          prenom: tuteur.prenom || "",
          entreprise: stage.entreprise || "",
          email: tuteur.email || "",
        },
        periode: {
          dateDebut: periode?.dateDebut || "",
          dateFin: periode?.dateFin || "",
        },
        appreciation: {
          evaluations: data.appreciation.evaluations,
          competences: updatedCompetences,
        },
      };

      console.log("Données envoyées :", payload);

      const response = await fetch("http://localhost:8081/api/evaluation/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setModalMessage("Les données ont été envoyées avec succès !");
        setModalType('success');
        setIsModalOpen(true);
        
       
      } else {
        setModalMessage("Une erreur est survenue lors de l'envoi des données.");
        setModalType('error');
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des données:", error);
      setModalMessage("Une erreur est survenue.");
      setModalType('error');
      setIsModalOpen(true);
    }
  };
  

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br from-blue-100 via-white to-blue-200 rounded-2xl shadow-2xl border border-blue-200">
      <h2 className="text-4xl font-extrabold text-center mb-8 text-blue-900 drop-shadow-lg tracking-wide">
        Évaluations des Compétences
      </h2>

      {/* Description des niveaux */}
      <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-400">
        <h4 className="font-semibold text-blue-700 mb-3 text-lg">Description des niveaux :</h4>
        <ul className="list-disc pl-8 text-gray-700 text-base space-y-2">
          <li>
            <span className="font-bold text-blue-700">NA</span> : Non applicable - Compétence non appliquée, ou trop peu
          </li>
          <li>
            <span className="font-bold text-blue-700">DÉBUTANT</span> : Applique, avec aide, les savoirs
          </li>
          <li>
            <span className="font-bold text-blue-700">AUTONOME</span> : Applique les pratiques de façon autonome
          </li>
          <li>
            <span className="font-bold text-blue-700">AUTONOME +</span> : Résout des problèmes selon la situation de travail - A un jugement critique pour anticiper 
          </li>
        </ul>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Message"
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div
          className={`bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full ${
            modalType === "error" ? "border-red-500" : "border-green-500"
          } border-t-8`}
        >
          <h2
            className={`text-2xl font-bold mb-4 ${
              modalType === "error" ? "text-red-500" : "text-green-600"
            }`}
          >
            {modalType === "error" ? "Erreur" : "Succès"}
          </h2>
          <p className="text-gray-700 mb-8 text-lg">{modalMessage}</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
            >
              Fermer
            </button>
            {modalType === "success" && (
              <button
                onClick={() => {
                  const updatedCompetences = buildCompetencePayload(categories, competencesSpecifiques);
                  const payload = {
                    stagiaire: {
                      nom: data.stagiaire.nom || "",
                      prenom: data.stagiaire.prenom || "",
                      email: data.stagiaire.email || "",
                      institution: data.stagiaire.institution || "",
                    },
                    stage: {
                      entreprise: data.stage.entreprise || "",
                      description: data.stage.description || "",
                      objectif: data.stage.objectif || "",
                    },
                    tuteur: {
                      nom: data.tuteur.nom || "",
                      email: data.tuteur.email || "",
                      prenom: data.tuteur.prenom || "",
                      entreprise: data.tuteur.entreprise || "",
                    },
                    periode: {
                      dateDebut: data.periode?.dateDebut || "",
                      dateFin: data.periode?.dateFin || "",
                    },
                    appreciation: {
                      evaluations: data.appreciation.evaluations,
                      competences: updatedCompetences,
                    },
                  };
                  function formatText(text, maxLineLength) {  
                    if (!text) return "";  
                    const lines = text.split('\n');  
                    const formattedLines = [];  
                    lines.forEach(line => {  
                      const splittedLine = doc.splitTextToSize(line, maxLineLength);  
                      formattedLines.push(...splittedLine);  
                    });  
                    return formattedLines.join("\n");  
                  }
                  const doc = new jsPDF();
                  // ... (PDF code unchanged)
                  doc.save(`evaluation_${payload.stagiaire.nom}_${payload.stagiaire.prenom}.pdf`);
                  setIsModalOpen(false);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
              >
                Télécharger Fiche d'évaluation
              </button>
            )}
          </div>
        </div>
      </Modal>

      <div className="space-y-8">
        {categories.map((cat, catIdx) => (
          <div key={catIdx} className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
            <h3 className="text-2xl font-semibold mb-5 text-blue-800">{cat.nom}</h3>
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full border-collapse border border-blue-200 shadow-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="border border-blue-200 p-3 text-left text-blue-800 font-semibold">Compétence</th>
                    {niveaux.map((niveau) => (
                      <th key={niveau} className="border border-blue-200 p-2 text-center text-blue-700 font-medium">{niveau}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {cat.competences.map((comp, compIdx) => (
                    <tr key={compIdx} className="even:bg-blue-50">
                      <td className="border border-blue-100 p-3">{comp}</td>
                      {niveaux.map((niveau) => (
                        <td key={niveau} className="border border-blue-100 text-center">
                          <input
                            type="radio"
                            name={`cat${catIdx}_comp${compIdx}`}
                            value={niveau}
                            checked={cat.evaluations[compIdx] === niveau}
                            onChange={() => handleRadioChange(catIdx, compIdx, niveau)}
                            className="form-radio h-5 w-5 text-blue-600 accent-blue-600"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex items-center">
              <label className="font-medium mr-4 text-gray-700 text-lg">Note sur 20 :</label>
              <input
                type="number"
                min="0"
                max="20"
                className="w-24 border border-blue-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg"
                value={cat.note}
                onChange={(e) => handleNoteChange(catIdx, e.target.value)}
              />
            </div>
          </div>
        ))}

        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="text-2xl font-semibold mb-5 text-blue-800">Compétences spécifiques métier</h3>
          {competencesSpecifiques.map((comp, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <input
                type="text"
                placeholder="Intitulé"
                className="flex-1 border border-blue-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                value={comp.intitule}
                onChange={(e) => handleSpecificChange(idx, "intitule", e.target.value)}
              />
              <select
                className="w-40 border border-blue-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                value={comp.valeur}
                onChange={(e) => handleSpecificChange(idx, "valeur", e.target.value)}
              >
                {niveaux.map((niveau) => (
                  <option key={niveau} value={niveau}>
                    {niveau === "NA" ? "Choisir" : niveau}
                  </option>
                ))}
              </select>
            </div>
          ))}
          <button
            onClick={addSpecific}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold"
          >
            Ajouter une compétence spécifique
          </button>
        </div>

        <div className="flex flex-col md:flex-row justify-between mt-10 gap-4">
          <button
            className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-all duration-300 shadow font-semibold"
            onClick={handlePrev}
          >
            Retour
          </button>
          <button
            className="px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-all duration-300 shadow font-semibold"
            onClick={handleSubmit}
          >
            Soumettre
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepThree;