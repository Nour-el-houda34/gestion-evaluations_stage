import React, { useState, useEffect } from 'react';

const StepThree = ({ data, handleStepDataChange }) => {
  const [categories, setCategories] = useState([]);
  const [competencesSpecifiques, setCompetencesSpecifiques] = useState([]);

  // Initialisation des catégories et des compétences spécifiques à partir des données existantes
  useEffect(() => {
    if (data?.appreciation?.competences) {
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

  // Gestion du changement des boutons radio pour chaque évaluation
  const handleRadioChange = (catIdx, compIdx, value) => {
    const updated = [...categories];
    updated[catIdx].evaluations[compIdx] = value;
    setCategories(updated);
    handleStepDataChange({ appreciation: { competences: buildCompetencePayload(updated, competencesSpecifiques) } });
  };

  // Gestion du changement de la note pour chaque catégorie
  const handleNoteChange = (catIdx, value) => {
    const updated = [...categories];
    updated[catIdx].note = value;
    setCategories(updated);
    handleStepDataChange({ appreciation: { competences: buildCompetencePayload(updated, competencesSpecifiques) } });
  };

  // Gestion du changement des compétences spécifiques
  const handleSpecificChange = (idx, key, value) => {
    const updated = [...competencesSpecifiques];
    updated[idx][key] = value;
    setCompetencesSpecifiques(updated);
    handleStepDataChange({ appreciation: { competences: buildCompetencePayload(categories, updated) } });
  };

  // Ajouter une nouvelle compétence spécifique
  const addSpecific = () => {
    const updated = [...competencesSpecifiques, { intitule: "", valeur: "" }];
    setCompetencesSpecifiques(updated);
    handleStepDataChange({ appreciation: { competences: buildCompetencePayload(categories, updated) } });
  };

  return (
    <div>
      <h3>Évaluation des Compétences</h3>

      {/* Affichage des catégories et des évaluations */}
      {categories.map((category, catIdx) => (
        <div key={category.nom}>
          <h4>{category.nom}</h4>
          <div>
            <label>Note: </label>
            <input
              type="text"
              value={category.note}
              onChange={(e) => handleNoteChange(catIdx, e.target.value)}
            />
          </div>

          <table>
            <thead>
              <tr>
                <th>Compétence</th>
                <th>Évaluation</th>
              </tr>
            </thead>
            <tbody>
              {category.competences.map((competence, compIdx) => (
                <tr key={competence}>
                  <td>{competence}</td>
                  <td>
                    <input
                      type="radio"
                      name={`comp-${catIdx}-${compIdx}`}
                      value="NA"
                      checked={category.evaluations[compIdx] === "NA"}
                      onChange={() => handleRadioChange(catIdx, compIdx, "NA")}
                    /> Non évalué
                    <input
                      type="radio"
                      name={`comp-${catIdx}-${compIdx}`}
                      value="DÉBUTANT"
                      checked={category.evaluations[compIdx] === "DÉBUTANT"}
                      onChange={() => handleRadioChange(catIdx, compIdx, "DÉBUTANT")}
                    /> Débutant
                    <input
                      type="radio"
                      name={`comp-${catIdx}-${compIdx}`}
                      value="AUTONOME"
                      checked={category.evaluations[compIdx] === "AUTONOME"}
                      onChange={() => handleRadioChange(catIdx, compIdx, "AUTONOME")}
                    /> Autonome
                    <input
                      type="radio"
                      name={`comp-${catIdx}-${compIdx}`}
                      value="AUTONOME+"
                      checked={category.evaluations[compIdx] === "AUTONOME+"}
                      onChange={() => handleRadioChange(catIdx, compIdx, "AUTONOME+")}
                    /> Autonome+
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Affichage des compétences spécifiques */}
      <h4>Compétences spécifiques</h4>
      {competencesSpecifiques.map((specific, idx) => (
        <div key={idx}>
          <label>Intitulé: </label>
          <input
            type="text"
            value={specific.intitule}
            onChange={(e) => handleSpecificChange(idx, 'intitule', e.target.value)}
          />
          <label>Valeur: </label>
          <input
            type="text"
            value={specific.valeur}
            onChange={(e) => handleSpecificChange(idx, 'valeur', e.target.value)}
          />
        </div>
      ))}

      <button onClick={addSpecific}>Ajouter une compétence spécifique</button>
    </div>
  );
};

export default StepThree;
