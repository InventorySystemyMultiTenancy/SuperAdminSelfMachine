import React, { useState } from "react";

const LojasTable = ({
  lojas,
  empresas,
  filtroEmpresaId,
  setFiltroEmpresaId,
  onEdit,
  onDelete,
}) => {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;

  // Lógica de Filtro
  const lojasFiltradas = lojas.filter(
    (l) =>
      (!filtroEmpresaId || l.empresaId === filtroEmpresaId) &&
      (l.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        l.id?.toString().includes(busca))
  );

  // Lógica de Paginação
  const totalPaginas = Math.ceil(lojasFiltradas.length / itensPorPagina);
  const lojasPagina = lojasFiltradas.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Lojas</h2>
      
      {/* Controles de Filtro e Busca */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={filtroEmpresaId || ""}
          onChange={(e) => {
            setFiltroEmpresaId(e.target.value || null);
            setPagina(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Todas as empresas</option>
          {empresas.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.nome}
            </option>
          ))}
        </select>
        
        <input
          type="text"
          placeholder="Buscar loja (Nome ou ID)"
          value={busca}
          onChange={(e) => {
            setBusca(e.target.value);
            setPagina(1);
          }}
          className="px-3 py-2 border border-gray-300 rounded w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Nome</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">ID</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Empresa</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {lojasPagina.length === 0 && (
              <tr>
                <td colSpan="4" className="px-3 py-4 text-center text-gray-500">
                  Nenhuma loja encontrada.
                </td>
              </tr>
            )}
            {lojasPagina.map((loja) => (
              <tr key={loja.id} className="even:bg-gray-50 hover:bg-blue-50 transition border-b last:border-0">
                <td className="px-3 py-2">{loja.nome}</td>
                <td className="px-3 py-2 text-gray-500">{loja.id}</td>
                <td className="px-3 py-2">
                  {empresas.find((e) => e.id === loja.empresaId)?.nome || (
                    <span className="text-gray-400 text-xs">ID: {loja.empresaId}</span>
                  )}
                </td>
                <td className="px-3 py-2 flex gap-2">
                  <button
                    onClick={() => onEdit(loja)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(loja)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition text-xs font-semibold"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex items-center justify-between gap-4 mt-4 border-t pt-4">
        <span className="text-sm text-gray-600">
          Página <b>{pagina}</b> de <b>{totalPaginas || 1}</b>
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setPagina((p) => Math.max(1, p - 1))}
            disabled={pagina === 1}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
          >
            Anterior
          </button>
          <button
            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
            disabled={pagina === totalPaginas || totalPaginas === 0}
            className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition text-sm"
          >
            Próxima
          </button>
        </div>
      </div>
    </div>
  );
};

export default LojasTable;