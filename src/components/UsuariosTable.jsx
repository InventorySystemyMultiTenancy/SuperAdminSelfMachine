import React, { useState } from "react";

const UsuariosTable = ({
  usuarios,
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
  const usuariosFiltrados = usuarios.filter(
    (u) =>
      (!filtroEmpresaId || u.empresaId === filtroEmpresaId) &&
      (u.nome?.toLowerCase().includes(busca.toLowerCase()) ||
        u.email?.toLowerCase().includes(busca.toLowerCase()))
  );

  // Lógica de Paginação
  const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
  const usuariosPagina = usuariosFiltrados.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Usuários</h2>
      
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
          placeholder="Buscar usuário (Nome ou Email)"
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
              <th className="px-3 py-2 text-left font-medium text-gray-700">Email</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Empresa</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Papel</th>
              <th className="px-3 py-2 text-left font-medium text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosPagina.length === 0 && (
              <tr>
                <td colSpan="5" className="px-3 py-4 text-center text-gray-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
            {usuariosPagina.map((usuario) => (
              <tr key={usuario.id} className="even:bg-gray-50 hover:bg-blue-50 transition border-b last:border-0">
                <td className="px-3 py-2">{usuario.nome}</td>
                <td className="px-3 py-2 text-gray-600">{usuario.email}</td>
                <td className="px-3 py-2">
                  {empresas.find((e) => e.id === usuario.empresaId)?.nome || (
                    <span className="text-gray-400 text-xs">ID: {usuario.empresaId}</span>
                  )}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      usuario.role === "ADMIN"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {usuario.role}
                  </span>
                </td>
                <td className="px-3 py-2 flex gap-2">
                  <button
                    onClick={() => onEdit(usuario)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-xs font-semibold"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(usuario)}
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

export default UsuariosTable;