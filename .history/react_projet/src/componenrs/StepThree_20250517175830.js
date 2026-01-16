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
  

  // Ajout de l'état pour la navigation entre les catégories
  const [currentCategory, setCurrentCategory] = useState(0);

  // Fonction pour aller à la catégorie suivante
  const handleNextCategory = () => {
    if (currentCategory < categories.length - 1) {
      setCurrentCategory(currentCategory + 1);
    }
  };

  // Fonction pour aller à la catégorie précédente
  const handlePrevCategory = () => {
    if (currentCategory > 0) {
      setCurrentCategory(currentCategory - 1);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-2xl">
      <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-800">
        Évaluations des Compétences
      </h2>

      {/* Description des niveaux */}
      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <h4 className="font-semibold text-blue-700 mb-2">Description des niveaux :</h4>
        <ul className="list-disc pl-6 text-gray-700 text-sm space-y-1">
          <li>
            <span className="font-bold">NA</span> : Non applicable - Compétence non appliquée, ou trop peu
          </li>
          <li>
            <span className="font-bold">DÉBUTANT</span> : Applique, avec aide, les savoirs
          </li>
          <li>
            <span className="font-bold">AUTONOME</span> : Applique les pratiques de façon autonome
          </li>
          <li>
            <span className="font-bold">AUTONOME +</span> : Résout des problèmes selon la situation de travail - A un jugement critique pour anticiper 
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
        {/* ...modal code inchangé... */}
        {/* Gardez le code du Modal tel qu'il est dans votre sélection */}
        {/* ... */}
      </Modal>

      <div className="space-y-6">
        {/* Affichage d'une seule catégorie à la fois */}
        {categories.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">{categories[currentCategory].nom}</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border p-2 text-left">Compétence</th>
                    {niveaux.map((niveau) => (
                      <th key={niveau} className="border p-1 text-center">{niveau}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {categories[currentCategory].competences.map((comp, compIdx) => (
                    <tr key={compIdx} className="even:bg-gray-100">
                      <td className="border p-2">{comp}</td>
                      {niveaux.map((niveau) => (
                        <td key={niveau} className="border text-center">
                          <input
                            type="radio"
                            name={`cat${currentCategory}_comp${compIdx}`}
                            value={niveau}
                            checked={categories[currentCategory].evaluations[compIdx] === niveau}
                            onChange={() => handleRadioChange(currentCategory, compIdx, niveau)}
                            className="form-radio h-4 w-4 text-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex items-center">
              <label className="font-medium mr-4 text-gray-700">Note sur 20 :</label>
              <input
                type="number"
                min="0"
                max="20"
                className="w-20 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={categories[currentCategory].note}
                onChange={(e) => handleNoteChange(currentCategory, e.target.value)}
              />
            </div>
            {/* Navigation entre les catégories */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handlePrevCategory}
                disabled={currentCategory === 0}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentCategory === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Précédent
              </button>
              <span className="text-gray-600">
                {currentCategory + 1} / {categories.length}
              </span>
              <button
                onClick={handleNextCategory}
                disabled={currentCategory === categories.length - 1}
                className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  currentCategory === categories.length - 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Suivant
              </button>
            </div>
          </div>
        )}

        {/* Affichage des compétences spécifiques seulement à la fin */}
        {currentCategory === categories.length - 1 && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Compétences spécifiques métier</h3>
            {competencesSpecifiques.map((comp, idx) => (
              <div key={idx} className="flex items-center gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Intitulé"
                  className="flex-1 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={comp.intitule}
                  onChange={(e) => handleSpecificChange(idx, "intitule", e.target.value)}
                />
                <select
                  className="w-32 border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Ajouter une compétence spécifique
            </button>
          </div>
        )}

        {/* Boutons de navigation globale */}
        <div className="flex justify-between mt-8">
          <button
            className="px-6 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300 shadow-md"
            onClick={handlePrev}
          >
            Retour
          </button>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
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