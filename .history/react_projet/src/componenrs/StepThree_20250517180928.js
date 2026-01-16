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
      <div
        className={`bg-white rounded-lg shadow-lg p-6 max-w-md w-full ${
          modalType === "error" ? "border-red-500" : "border-green-500"
        } border-t-4`}
      >
        <h2
          className={`text-lg font-bold mb-4 ${
            modalType === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {modalType === "error" ? "Erreur" : "Succès"}
        </h2>
        <p className="text-gray-700 mb-6">{modalMessage}</p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setIsModalOpen(false)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-all duration-300"
          >
            Fermer
          </button>
        </div>
      </div>
    </Modal>

    <div className="space-y-6">
      {categories.map((cat, catIdx) => (
        <div key={catIdx} className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">{cat.nom}</h3>
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
                {cat.competences.map((comp, compIdx) => (
                  <tr key={compIdx} className="even:bg-gray-100">
                    <td className="border p-2">{comp}</td>
                    {niveaux.map((niveau) => (
                      <td key={niveau} className="border text-center">
                        <input
                          type="radio"
                          name={`cat${catIdx}_comp${compIdx}`}
                          value={niveau}
                          checked={cat.evaluations[compIdx] === niveau}
                          onChange={() => handleRadioChange(catIdx, compIdx, niveau)}
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
              value={cat.note}
              onChange={(e) => handleNoteChange(catIdx, e.target.value)}
            />
          </div>
        </div>
      ))}

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
