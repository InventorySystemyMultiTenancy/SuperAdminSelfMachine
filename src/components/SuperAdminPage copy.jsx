import React, { useState, useEffect } from "react";
import axios from "axios";
import CriarEmpresa from "./CriarEmpresa";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SuperAdminPage = () => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [erro, setErro] = useState("");
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    carregarEmpresas();
  }, []);

  const carregarEmpresas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/superadmin/empresas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmpresas(response.data);
      setErro("");
    } catch (error) {
      console.error("Erro ao carregar empresas:", error);
      setErro("Erro ao carregar lista de empresas");
    } finally {
      setLoading(false);
    }
  };

  const handleEmpresaCriada = (novaEmpresa) => {
    // Adiciona a nova empresa à lista
    setEmpresas([...empresas, novaEmpresa]);
    setMostrarModal(false);
  };

  const handleFecharModal = () => {
    setMostrarModal(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString("pt-BR");
  };

  const formatarCNPJ = (cnpj) => {
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5",
    );
  };

  return (
    <div className="superadmin-container">
      <div className="header">
        <div className="header-left">
          <h1>Painel Super Admin</h1>
          {user && <span className="user-badge">👤 {user.nome}</span>}
        </div>
        <div className="header-right">
          <button
            className="btn btn-primary"
            onClick={() => setMostrarModal(true)}
          >
            + Nova Empresa
          </button>
          <button className="btn btn-secondary" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>

      {erro && <div className="alert alert-error">{erro}</div>}

      {loading ? (
        <div className="loading">Carregando empresas...</div>
      ) : (
        <div className="empresas-grid">
          {empresas.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma empresa cadastrada ainda.</p>
              <button
                className="btn btn-primary"
                onClick={() => setMostrarModal(true)}
              >
                Criar primeira empresa
              </button>
            </div>
          ) : (
            <table className="empresas-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Subdomínio</th>
                  <th>Plano</th>
                  <th>Status</th>
                  <th>Criado em</th>
                </tr>
              </thead>
              <tbody>
                {empresas.map((empresa) => (
                  <tr key={empresa.id}>
                    <td>{empresa.nome}</td>
                    <td>{formatarCNPJ(empresa.cnpj)}</td>
                    <td>
                      <code>{empresa.subdomain}</code>
                    </td>
                    <td>
                      <span
                        className={`badge badge-${empresa.plano.toLowerCase()}`}
                      >
                        {empresa.plano}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`status ${empresa.ativo ? "ativo" : "inativo"}`}
                      >
                        {empresa.ativo ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td>{formatarData(empresa.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal para criar empresa */}
      {mostrarModal && (
        <div className="modal-overlay" onClick={handleFecharModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleFecharModal}>
              ×
            </button>
            <CriarEmpresa
              onEmpresaCriada={handleEmpresaCriada}
              onCancelar={handleFecharModal}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .superadmin-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          background: white;
          padding: 20px 24px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .header-right {
          display: flex;
          gap: 12px;
        }

        h1 {
          margin: 0;
          color: #333;
        }

        .user-badge {
          background: #e3f2fd;
          color: #1976d2;
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
        }

        .alert-error {
          background-color: #fee;
          color: #c33;
          border: 1px solid #fcc;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: #666;
        }

        .empty-state {
          text-align: center;
          padding: 64px 24px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .empty-state p {
          color: #666;
          margin-bottom: 24px;
          font-size: 16px;
        }

        .empresas-table {
          width: 100%;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-collapse: collapse;
          overflow: hidden;
        }

        .empresas-table thead {
          background-color: #f5f5f5;
        }

        .empresas-table th {
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
        }

        .empresas-table td {
          padding: 16px;
          border-bottom: 1px solid #e0e0e0;
        }

        .empresas-table tbody tr:hover {
          background-color: #f9f9f9;
        }

        code {
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: monospace;
          font-size: 13px;
        }

        .badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .badge-basic {
          background: #e3f2fd;
          color: #1976d2;
        }

        .badge-pro {
          background: #f3e5f5;
          color: #7b1fa2;
        }

        .status {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        .status.ativo {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status.inativo {
          background: #ffebee;
          color: #c62828;
        }

        .btn {
          padding: 10px 24px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-primary {
          background-color: #4caf50;
          color: white;
        }

        .btn-primary:hover {
          background-color: #45a049;
        }
        .btn-secondary {
          background-color: #f5f5f5;
          color: #333;
          border: 1px solid #ddd;
        }

        .btn-secondary:hover {
          background-color: #e0e0e0;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: white;
          border-radius: 8px;
          max-width: 900px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }

        .modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          font-size: 32px;
          color: #999;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
          transition: all 0.2s;
        }

        .modal-close:hover {
          background: #f0f0f0;
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default SuperAdminPage;
