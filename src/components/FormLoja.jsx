import React from "react";

const FormLoja = ({ loja, onSubmit, empresas, onCancel }) => {
  const [nome, setNome] = React.useState(loja?.nome || "");
  const [empresaId, setEmpresaId] = React.useState(loja?.empresaId || "");

  function handleSubmit(e) {
    e.preventDefault();
    if (!nome || !empresaId) return;
    onSubmit({ ...loja, nome, empresaId });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block font-medium mb-1">Nome da Loja:</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Empresa:</label>
        <select
          value={empresaId}
          onChange={(e) => setEmpresaId(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Selecione a empresa</option>
          {empresas.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.nome}
            </option>
          ))}
        </select>
      </div>
      <div className="flex gap-4 mt-2">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Salvar
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default FormLoja;
