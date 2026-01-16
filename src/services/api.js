import axios from "axios";

// Cria uma instância do axios com configuração base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://toylandbackend.onrender.com/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para adicionar o token JWT em todas as requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor para tratamento de erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se receber 401 (Não autorizado), limpa o token e redireciona para login
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("usuario");
      window.location.href = "/login";
    }

    // Se receber 403 (Proibido), pode mostrar uma mensagem
    if (error.response?.status === 403) {
      console.error("Acesso negado");
    }

    return Promise.reject(error);
  },
);

export default api;
