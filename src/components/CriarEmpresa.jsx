import React, { useState } from "react";
import axios from "axios";

const CriarEmpresa = ({ onEmpresaCriada, onCancelar }) => {
  const [formData, setFormData] = useState({
    nome: "",
    cnpj: "",
    email: "",
    plano: "BASIC",
    usuario: {
      nome: "",
      email: "",
      senha: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("usuario.")) {
      const usuarioField = name.split(".")[1];
      setFormData({
        ...formData,
        usuario: {
          ...formData.usuario,
          [usuarioField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const formatarCNPJ = (cnpj) => {
    // Remove tudo que não é número
    const numeros = cnpj.replace(/\D/g, "");

    // Formata como XX.XXX.XXX/XXXX-XX
    return numeros
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18);
  };

  const handleCNPJChange = (e) => {
    const cnpjFormatado = formatarCNPJ(e.target.value);
    setFormData({
      ...formData,
      cnpj: cnpjFormatado,
    });
  };

  const validarFormulario = () => {
    if (!formData.nome.trim()) {
      setErro("Nome da empresa é obrigatório");
      return false;
    }

    const cnpjLimpo = formData.cnpj.replace(/\D/g, "");
    if (cnpjLimpo.length !== 14) {
      setErro("CNPJ deve conter 14 dígitos");
      return false;
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      setErro("Email da empresa inválido");
      return false;
    }

    if (!formData.usuario.nome.trim()) {
      setErro("Nome do usuário administrador é obrigatório");
      return false;
    }

    if (
      !formData.usuario.email.trim() ||
      !formData.usuario.email.includes("@")
    ) {
      setErro("Email do usuário administrador inválido");
      return false;
    }

    if (formData.usuario.senha.length < 6) {
      setErro("A senha deve ter no mínimo 6 caracteres");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setSucesso(false);

    if (!validarFormulario()) {
      return;
    }

    setLoading(true);

    try {
      // Remove formatação do CNPJ para enviar apenas números
      const dadosEnvio = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ""),
      };

      const token = localStorage.getItem("token");
      const response = await axios.post(
        "/api/superadmin/empresas",
        dadosEnvio,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSucesso(true);

      // Limpa o formulário
      setFormData({
        nome: "",
        cnpj: "",
        email: "",
        plano: "BASIC",
        usuario: {
          nome: "",
          email: "",
          senha: "",
        },
      });

      // Notifica o componente pai
      if (onEmpresaCriada) {
        onEmpresaCriada(response.data.empresa);
      }

      // Fecha o modal após 2 segundos
      setTimeout(() => {
        if (onCancelar) {
          onCancelar();
        }
      }, 2000);
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
      setErro(
        error.response?.data?.error ||
          error.response?.data?.detalhes ||
          "Erro ao criar empresa. Tente novamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="criar-empresa-container">
      <h2>Criar Nova Empresa</h2>

      {erro && <div className="alert alert-error">{erro}</div>}

      {sucesso && (
        <div className="alert alert-success">Empresa criada com sucesso!</div>
      )}

      <form onSubmit={handleSubmit} className="criar-empresa-form">
        <div className="form-section">
          <h3>Dados da Empresa</h3>

          <div className="form-group">
            <label htmlFor="nome">Nome da Empresa *</label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: Toyland Brinquedos"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="cnpj">CNPJ *</label>
            <input
              type="text"
              id="cnpj"
              name="cnpj"
              value={formData.cnpj}
              onChange={handleCNPJChange}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email da Empresa *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contato@empresa.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="plano">Plano *</label>
            <select
              id="plano"
              name="plano"
              value={formData.plano}
              onChange={handleChange}
              required
            >
              <option value="BASIC">Básico</option>
              <option value="PRO">Profissional</option>
            </select>
          </div>
        </div>

        <div className="form-section">
          <h3>Usuário Administrador</h3>

          <div className="form-group">
            <label htmlFor="usuario.nome">Nome do Administrador *</label>
            <input
              type="text"
              id="usuario.nome"
              name="usuario.nome"
              value={formData.usuario.nome}
              onChange={handleChange}
              placeholder="Nome completo"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="usuario.email">Email do Administrador *</label>
            <input
              type="email"
              id="usuario.email"
              name="usuario.email"
              value={formData.usuario.email}
              onChange={handleChange}
              placeholder="admin@empresa.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="usuario.senha">Senha *</label>
            <input
              type="password"
              id="usuario.senha"
              name="usuario.senha"
              value={formData.usuario.senha}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={onCancelar}
            className="btn btn-secondary"
            disabled={loading}
          >
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Criando..." : "Criar Empresa"}
          </button>
        </div>
      </form>

      <style jsx>{`
        .criar-empresa-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        h2 {
          margin-bottom: 24px;
          color: #333;
        }

        h3 {
          margin-top: 24px;
          margin-bottom: 16px;
          color: #555;
          font-size: 18px;
          border-bottom: 2px solid #e0e0e0;
          padding-bottom: 8px;
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

        .alert-success {
          background-color: #efe;
          color: #3c3;
          border: 1px solid #cfc;
        }

        .criar-empresa-form {
          background: #fff;
        }

        .form-section {
          margin-bottom: 24px;
        }

        .form-section:first-of-type h3 {
          margin-top: 0;
        }

        .form-group {
          margin-bottom: 16px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #333;
        }

        input,
        select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          transition: border-color 0.2s;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #4caf50;
        }

        input::placeholder {
          color: #999;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #e0e0e0;
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

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background-color: #4caf50;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background-color: #45a049;
        }

        .btn-secondary {
          background-color: #f5f5f5;
          color: #333;
        }

        .btn-secondary:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
      `}</style>
    </div>
  );
};

export default CriarEmpresa;
