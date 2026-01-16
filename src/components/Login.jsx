import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    senha: "",
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await axios.post("/api/auth/login", {
        ...formData,
        subdomain: "superadminpage", // Indica que é login do super admin
      });

      const { token, usuario } = response.data;

      // Verifica se o usuário é SUPER_ADMIN
      if (usuario.role !== "SUPER_ADMIN") {
        setErro("Acesso negado. Apenas SUPER_ADMIN pode acessar esta área.");
        setLoading(false);
        return;
      }

      // Salva o token e dados do usuário
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));

      // Notifica o componente pai sobre o login bem-sucedido
      if (onLoginSuccess) {
        onLoginSuccess(usuario);
      }

      // Redireciona para a página de super admin
      navigate("/superadmin");
    } catch (error) {
      console.error("Erro no login:", error);
      setErro(
        error.response?.data?.error ||
          "Erro ao realizar login. Verifique suas credenciais.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h1>Super Admin</h1>
          <p>Painel Administrativo</p>
        </div>

        {erro && <div className="alert alert-error">{erro}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="login-footer">
          <p className="login-info">
            <strong>Acesso restrito:</strong> Apenas usuários com permissão de
            SUPER_ADMIN
          </p>
        </div>
      </div>

      <style jsx>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }

        .login-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          padding: 48px;
          max-width: 420px;
          width: 100%;
        }

        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .login-header h1 {
          margin: 0 0 8px 0;
          color: #333;
          font-size: 32px;
          font-weight: 700;
        }

        .login-header p {
          margin: 0;
          color: #666;
          font-size: 16px;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 6px;
          margin-bottom: 24px;
          font-size: 14px;
        }

        .alert-error {
          background-color: #fee;
          color: #c33;
          border: 1px solid #fcc;
        }

        .login-form {
          margin-bottom: 24px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #333;
          font-size: 14px;
        }

        input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e0e0e0;
          border-radius: 6px;
          font-size: 15px;
          transition: all 0.3s;
          box-sizing: border-box;
        }

        input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        input::placeholder {
          color: #999;
        }

        .btn {
          padding: 12px 24px;
          border: none;
          border-radius: 6px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-block {
          width: 100%;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }

        .login-footer {
          padding-top: 24px;
          border-top: 1px solid #e0e0e0;
        }

        .login-info {
          margin: 0;
          font-size: 13px;
          color: #666;
          text-align: center;
          line-height: 1.6;
        }

        .login-info strong {
          color: #333;
          display: block;
          margin-bottom: 4px;
        }
      `}</style>
    </div>
  );
};

export default Login;
