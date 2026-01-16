import React, { useState, useRef, useEffect } from "react";

const planos = ["BÁSICO", "PRO", "ENTERPRISE"];

const EmpresaDetailsModal = ({ empresa, onClose }) => {
  // --- Estados ---
  const [plano, setPlano] = useState(empresa.plano);
  const [ativo, setAtivo] = useState(empresa.ativo);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  // Estados para listas
  const [lojas, setLojas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loadingLojas, setLoadingLojas] = useState(true);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);

  const closeBtnRef = useRef();

  // Helper para classes do badge
  const badgeClass = (colorClass) => `inline-block px-2 py-1 rounded text-xs font-semibold ml-2 ${colorClass}`;

  // --- Efeitos ---
  
  // Foco acessível ao abrir
  useEffect(() => {
    closeBtnRef.current?.focus();
  }, []);

  // Carregar dados (Lojas e Usuários)
  useEffect(() => {
    setLoadingLojas(true);
    fetch(`/api/lojas?empresaId=${empresa.id}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setLojas)
      .finally(() => setLoadingLojas(false));

    setLoadingUsuarios(true);
    fetch(`/api/usuarios?empresaId=${empresa.id}`)
      .then((r) => r.ok ? r.json() : [])
      .then(setUsuarios)
      .finally(() => setLoadingUsuarios(false));
  }, [empresa.id]);

  // --- Funções de Ação ---

  async function handlePlanoChange(e) {
    const novoPlano = e.target.value;
    setPlano(novoPlano);
    setLoading(true);
    setMsg(null);
    try {
      const resp = await fetch(`/api/superadmin/empresas/${empresa.id}/plano`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plano: novoPlano }),
      });
      if (!resp.ok) throw new Error("Erro ao alterar plano");
      setMsg("Plano alterado com sucesso!");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAtivarDesativar() {
    setLoading(true);
    setMsg(null);
    try {
      const resp = await fetch(`/api/superadmin/empresas/${empresa.id}/ativo`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: !ativo }),
      });
      if (!resp.ok) throw new Error("Erro ao atualizar status");
      setAtivo((a) => !a);
      setMsg("Status atualizado!");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  // --- Renderização (Tailwind CSS) ---
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" 
      tabIndex={-1} 
      aria-modal="true" 
      role="dialog"
    >
      <div className="bg-white p-6 rounded-lg shadow-2xl min-w-[350px] max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Detalhes da Empresa</h2>
        
        <div className="mb-2"><b>Nome:</b> {empresa.nome}</div>
        <div className="mb-2"><b>CNPJ:</b> {empresa.cnpj}</div>
        
        <div className="mb-2 flex items-center">
          <b>Plano:</b>
          <span className={badgeClass('bg-blue-100 text-blue-700')}>{plano}</span>
          <select 
            value={plano} 
            onChange={handlePlanoChange} 
            disabled={loading} 
            className="ml-2 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {planos.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {loading && <span className="ml-2 text-blue-600 text-sm">Salvando...</span>}
        </div>

        <div className="mb-2 flex items-center">
          <b>Status:</b>
          <span className={badgeClass(ativo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
            {ativo ? 'Ativa' : 'Inativa'}
          </span>
          <button 
            onClick={handleAtivarDesativar} 
            disabled={loading} 
            className="ml-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold transition disabled:opacity-50"
          >
            {ativo ? "Desativar" : "Ativar"}
          </button>
        </div>

        <div className="mb-2"><b>Data Criação:</b> {empresa.dataCriacao}</div>
        <div className="mb-2"><b>Data Atualização:</b> {empresa.dataAtualizacao}</div>

        {msg && (
          <div className={`mb-4 font-semibold ${msg.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
            {msg}
          </div>
        )}

        <div className="mt-4 border-t pt-4">
          <b className="block mb-2">Lojas da empresa:</b>
          {loadingLojas ? (
            <div className="text-gray-500 italic">Carregando lojas...</div>
          ) : (
            <ul className="max-h-32 overflow-y-auto pl-5 list-disc text-sm">
              {lojas.length === 0 && <li className="text-gray-500 list-none">Nenhuma loja cadastrada.</li>}
              {lojas.map((l) => (
                <li key={l.id}>{l.nome}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-4">
          <b className="block mb-2">Usuários da empresa:</b>
          {loadingUsuarios ? (
            <div className="text-gray-500 italic">Carregando usuários...</div>
          ) : (
            <ul className="max-h-32 overflow-y-auto pl-5 list-disc text-sm">
              {usuarios.length === 0 && <li className="text-gray-500 list-none">Nenhum usuário cadastrado.</li>}
              {usuarios.map((u) => (
                <li key={u.id}>
                  {u.nome} <span className={badgeClass('bg-gray-100 text-gray-600 border border-gray-200')}>{u.email}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full px-6 py-2 font-semibold bg-blue-600 text-white rounded hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          ref={closeBtnRef}
          disabled={loading}
        >
          Fechar
        </button>
      </div>
    </div>
  );
};

export default EmpresaDetailsModal;