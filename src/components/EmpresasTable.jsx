import React, { useState } from "react";

const EmpresasTable = ({ empresas, onSelectEmpresa }) => {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const itensPorPagina = 10;

  const empresasFiltradas = empresas.filter(
    (e) =>
      e.nome?.toLowerCase().includes(busca.toLowerCase()) ||
      e.cnpj?.replace(/\D/g, "").includes(busca.replace(/\D/g, ""))
  );
  const totalPaginas = Math.ceil(empresasFiltradas.length / itensPorPagina);
  const empresasPagina = empresasFiltradas.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Empresas</h2>
      <input
        type="text"
        placeholder="Buscar por nome ou CNPJ"
        value={busca}
        onChange={(e) => {
          setBusca(e.target.value);
          setPagina(1);
        }}
        className="mb-4 px-3 py-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Nome</th>
              <th className="px-3 py-2 text-left">CNPJ</th>
              <th className="px-3 py-2 text-left">Plano</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Data Criação</th>
              <th className="px-3 py-2 text-left">Data Atualização</th>
              <th className="px-3 py-2 text-left">Ações</th>
            </tr>
          </thead>
          <tbody>
            {empresasPagina.map((empresa) => (
              <tr
                key={empresa.id}
                className="even:bg-gray-50 hover:bg-blue-50 transition"
              >
                <td className="px-3 py-2">{empresa.nome}</td>
                <td className="px-3 py-2">{empresa.cnpj}</td>
                <td className="px-3 py-2">
                  <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                    {empresa.plano}
                  </span>
                </td>
                <td className="px-3 py-2">
                  <span
                    className={
                      empresa.ativo
                        ? "text-green-700 bg-green-100 px-2 py-1 rounded text-xs font-semibold"
                        : "text-red-700 bg-red-100 px-2 py-1 rounded text-xs font-semibold"
                    }
                  >
                    {empresa.ativo ? "Ativa" : "Inativa"}
                  </span>
                </td>
                <td className="px-3 py-2">{empresa.dataCriacao}</td>
                <td className="px-3 py-2">{empresa.dataAtualizacao}</td>
                <td className="px-3 py-2">
                  <button
                    onClick={() => onSelectEmpresa(empresa)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition text-xs"
                  >
                    Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <span className="text-sm">
          Página: {pagina} de {totalPaginas || 1}
        </span>
        <button
          onClick={() => setPagina((p) => Math.max(1, p - 1))}
          disabled={pagina === 1}
          className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Anterior
        </button>
        <button
          onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
          disabled={pagina === totalPaginas || totalPaginas === 0}
          className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
};

export default EmpresasTable;
