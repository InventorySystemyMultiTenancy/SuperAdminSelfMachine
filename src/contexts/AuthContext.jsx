import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useMemo,
} from "react";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isSuperAdmin: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserFromStorage = () => {
      const token = localStorage.getItem("token");
      const usuarioSalvo = localStorage.getItem("usuario");

      if (token && usuarioSalvo) {
        try {
          const usuario = JSON.parse(usuarioSalvo);
          setUser(usuario);
        } catch (error) {
          console.error("Erro ao processar dados do localStorage:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("usuario");
        }
      }
      setLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const login = (usuario, token) => {
    setUser(usuario);
    localStorage.setItem("usuario", JSON.stringify(usuario));
    localStorage.setItem("token", token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  // Performance: Memoize the value to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      logout,
      isAuthenticated: !!user,
      isSuperAdmin: user?.role === "SUPER_ADMIN",
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
