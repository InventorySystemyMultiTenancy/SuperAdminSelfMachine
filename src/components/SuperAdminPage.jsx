import React, { useEffect, useState } from "react";
import EmpresasTable from "./EmpresasTable";
import LojasTable from "./LojasTable";
import UsuariosTable from "./UsuariosTable";
import FormLoja from "./FormLoja";
import FormUsuario from "./FormUsuario";

function SuperAdminPage() {
  const [empresas, setEmpresas] = useState([]);
  const [lojas, setLojas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [empresaSelecionada, setEmpresaSelecionada] = useState(null);
  const [filtroEmpresaLojas, setFiltroEmpresaLojas] = useState(null);
  const [filtroEmpresaUsuarios, setFiltroEmpresaUsuarios] = useState(null);
  const [formLoja, setFormLoja] = useState(null); // {loja: {}, modo: 'edit'|'create'}
  const [formUsuario, setFormUsuario] = useState(null); // {usuario: {}, modo: 'edit'|'create'}

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/superadmin/empresas").then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar empresas");
        return res.json();
      }),
      fetch("/api/lojas").then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar lojas");
        return res.json();
      }),
      fetch("/api/usuarios").then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar usuários");
        return res.json();
      }),
    ])
      .then(([empresas, lojas, usuarios]) => {
        setEmpresas(empresas);
        setLojas(lojas);
        setUsuarios(usuarios);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // CRUD Lojas
  async function handleSaveLoja(loja) {
    setLoading(true);
    const [formEmpresa, setFormEmpresa] = useState(null); // {empresa: {}, modo: 'edit'|'create'}
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch(
        loja.id ? `/api/lojas/${loja.id}` : "/api/lojas",
        {
          method: loja.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loja),
        }
      );
      if (!resp.ok) throw new Error("Erro ao salvar loja");
      setFormLoja(null);
      setSuccess("Loja salva com sucesso!");
      // Atualizar lista
      const lojasAtualizadas = await fetch("/api/lojas").then((r) => r.json());
      setLojas(lojasAtualizadas);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteLoja(loja) {
    if (!window.confirm("Excluir loja?")) return;
    setLoading(true);
    setError(null);
    async function handleSaveEmpresa(empresa) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const resp = await fetch(
          empresa.id
            ? `/api/superadmin/empresas/${empresa.id}`
            : "/api/superadmin/empresas",
          {
            method: empresa.id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(empresa),
          }
        );
        if (!resp.ok) throw new Error("Erro ao salvar empresa");
        setFormEmpresa(null);
        setSuccess("Empresa salva com sucesso!");
        setEmpresas(
          await fetch("/api/superadmin/empresas").then((r) => r.json())
        );
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    async function handleDeleteEmpresa(empresa) {
      if (!window.confirm("Excluir empresa?")) return;
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const resp = await fetch(`/api/superadmin/empresas/${empresa.id}`, {
          method: "DELETE",
        });
        if (!resp.ok) throw new Error("Erro ao excluir empresa");
        setSuccess("Empresa excluída!");
        setEmpresas(
          await fetch("/api/superadmin/empresas").then((r) => r.json())
        );
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    setSuccess(null);
    try {
      const resp = await fetch(`/api/lojas/${loja.id}`, { method: "DELETE" });
      if (!resp.ok) throw new Error("Erro ao excluir loja");
      setSuccess("Loja excluída!");
      setLojas(await fetch("/api/lojas").then((r) => r.json()));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  // CRUD Usuários
  async function handleSaveUsuario(usuario) {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch(
        usuario.id ? `/api/usuarios/${usuario.id}` : "/api/usuarios",
        {
          method: usuario.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(usuario),
        }
      );
      if (!resp.ok) throw new Error("Erro ao salvar usuário");
      setFormUsuario(null);
      setSuccess("Usuário salvo com sucesso!");
      setUsuarios(await fetch("/api/usuarios").then((r) => r.json()));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  async function handleDeleteUsuario(usuario) {
    if (!window.confirm("Excluir usuário?")) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const resp = await fetch(`/api/usuarios/${usuario.id}`, {
        method: "DELETE",
      });
      if (!resp.ok) throw new Error("Erro ao excluir usuário");
      setSuccess("Usuário excluído!");
      setUsuarios(await fetch("/api/usuarios").then((r) => r.json()));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Painel de Administração SaaS{" "}
        <span className="text-blue-600">(SUPER_ADMIN)</span>
      </h1>
      {loading && (
        <p className="text-blue-600 font-medium">Carregando dados...</p>
      )}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <p className="text-green-600 font-medium">{success}</p>}
      <div className="mb-8">
        <EmpresasTable
          empresas={empresas}
          onSelectEmpresa={setEmpresaSelecionada}
        />
      </div>
      {empresaSelecionada && (
        <EmpresaDetailsModal
          empresa={empresaSelecionada}
          onClose={() => setEmpresaSelecionada(null)}
        />
      )}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFormLoja({ loja: null, modo: "create" })}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Nova Loja
        </button>
        <button
          onClick={() => setFormUsuario({ usuario: null, modo: "create" })}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Novo Usuário
        </button>
      </div>
      {formLoja && (
        <div className="bg-white border border-gray-200 rounded shadow p-4 mb-6">
          <FormLoja
            loja={formLoja.loja}
            empresas={empresas}
            onSubmit={handleSaveLoja}
            onCancel={() => setFormLoja(null)}
          />
        </div>
      )}
      {formUsuario && (
        <div className="bg-white border border-gray-200 rounded shadow p-4 mb-6">
          <FormUsuario
            usuario={formUsuario.usuario}
            empresas={empresas}
            onSubmit={handleSaveUsuario}
            onCancel={() => setFormUsuario(null)}
          />
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <LojasTable
          lojas={lojas}
          empresas={empresas}
          filtroEmpresaId={filtroEmpresaLojas}
          setFiltroEmpresaId={setFiltroEmpresaLojas}
          onEdit={(loja) => setFormLoja({ loja, modo: "edit" })}
          onDelete={handleDeleteLoja}
        />
        <UsuariosTable
          usuarios={usuarios}
          empresas={empresas}
          filtroEmpresaId={filtroEmpresaUsuarios}
          setFiltroEmpresaId={setFiltroEmpresaUsuarios}
          onEdit={(usuario) => setFormUsuario({ usuario, modo: "edit" })}
          onDelete={handleDeleteUsuario}
        />
      </div>
    </div>
  );
}

export default SuperAdminPage;
