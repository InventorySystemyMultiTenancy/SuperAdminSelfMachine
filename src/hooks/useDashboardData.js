import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

export function useDashboardData() {
  const [data, setData] = useState({
    empresas: [],
    lojas: [],
    usuarios: [],
  });
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false); // Para travar botões durante salvamento
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Busca inicial de dados
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Promise.all executa as 3 chamadas ao mesmo tempo
      const [empRes, lojRes, usuRes] = await Promise.all([
        api.get("/superadmin/empresas"),
        api.get("/lojas"),
        api.get("/usuarios"),
      ]);
      setData({
        empresas: empRes.data,
        lojas: lojRes.data,
        usuarios: usuRes.data,
      });
    } catch (err) {
      setError("Falha ao carregar dados iniciais.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Função genérica para evitar repetição de código
  const performOperation = async (apiCall, successMsg, refreshKey) => {
    setOperationLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiCall();
      setSuccess(successMsg);

      // Atualiza apenas a lista que foi modificada
      const urlRefresh =
        refreshKey === "empresas" ? "/superadmin/empresas" : `/${refreshKey}`;
      const refreshRes = await api.get(urlRefresh);

      setData((prev) => ({ ...prev, [refreshKey]: refreshRes.data }));
      return true; // Retorna true se deu certo
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Ocorreu um erro.",
      );
      return false;
    } finally {
      setOperationLoading(false);
    }
  };

  // --- Ações Públicas ---

  const saveEmpresa = (empresa) => {
    const request = empresa.id
      ? () => api.put(`/superadmin/empresas/${empresa.id}`, empresa)
      : () => api.post("/superadmin/empresas", empresa);
    return performOperation(request, "Empresa salva com sucesso!", "empresas");
  };

  const deleteEmpresa = (id) => {
    return performOperation(
      () => api.delete(`/superadmin/empresas/${id}`),
      "Empresa excluída!",
      "empresas",
    );
  };

  const saveLoja = (loja) => {
    const request = loja.id
      ? () => api.put(`/lojas/${loja.id}`, loja)
      : () => api.post("/lojas", loja);
    return performOperation(request, "Loja salva com sucesso!", "lojas");
  };

  const deleteLoja = (id) => {
    return performOperation(
      () => api.delete(`/lojas/${id}`),
      "Loja excluída!",
      "lojas",
    );
  };

  const saveUsuario = (usuario) => {
    const request = usuario.id
      ? () => api.put(`/usuarios/${usuario.id}`, usuario)
      : () => api.post("/usuarios", usuario);
    return performOperation(request, "Usuário salvo com sucesso!", "usuarios");
  };

  const deleteUsuario = (id) => {
    return performOperation(
      () => api.delete(`/usuarios/${id}`),
      "Usuário excluído!",
      "usuarios",
    );
  };

  return {
    ...data, // Espalha empresas, lojas, usuarios
    loading,
    operationLoading,
    error,
    success,
    actions: {
      saveEmpresa,
      deleteEmpresa,
      saveLoja,
      deleteLoja,
      saveUsuario,
      deleteUsuario,
      clearMessages: () => {
        setError(null);
        setSuccess(null);
      },
    },
  };
}
