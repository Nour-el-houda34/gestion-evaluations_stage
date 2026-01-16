import React from "react";

const niveaux = ["NA", "DEBUTANT", "AUTONOME", "AUTONOME +"];

const StepThree = ({ data, handleRadioChange, handleNoteChange }) => {
  const competence = data.appreciation?.competences?.[0];

  if (!competence) return <div className="text-red-500 font-semibold">Aucune compétence disponible</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Évaluation des compétences</h2>

      <div className="bg-gray-50 p-6 rounded-md shadow-sm">
        <h3 className="text-lg font-semibold text-indigo-600 mb-4">{competence.intitule}</h3>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300 rounded-md">
            <thead className="bg-indigo-100 text-gray-800">
              <tr>
                <th className="border border-gray-300 p-2 text-left">Compétence</th>
                {niveaux.map((niveau) => (
                  <th key={niveau} className="border border-gray-300 p-2 text-center">
                    {niveau}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {competence.categories.map((cat, idx) => (
                <tr key={cat.intitule} className={idx % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                  <td className="border border-gray-300 p-2">{cat.intitule}</td>
                  {niveaux.map((niveau) => (
                    <td key={niveau} className="border border-gray-300 p-2 text-center">
                      <input
                        type="radio"
                        name={`competence_0_cat_${idx}`}
                        value={niveau}
                        checked={cat.valeur === niveau}
                        onChange={() => handleRadioChange(0, idx, niveau)}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex items-center">
          <label className="text-gray-700 font-medium mr-3">
            Note sur 20 pour cette compétence :
          </label>
          <input
            type="number"
            min="0"
            max="20"
            className="border border-gray-300 rounded px-3 py-1 w-24 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={competence.note}
            onChange={(e) => handleNoteChange(0, e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default StepThree;
