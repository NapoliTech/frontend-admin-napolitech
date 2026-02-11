import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      // authService.login já salva o token no sessionStorage
      const token = await authService.login(credentials);

      setLoading(false);
      return token;
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login");
      setLoading(false);
      throw err;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Limpar sessionStorage (padronizado)
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userData");
      navigate("/");
    }
  };

  const isAuthenticated = () => {
    return !!sessionStorage.getItem("token");
  };

  return {
    login,
    logout,
    loading,
    error,
    isAuthenticated,
  };
};
