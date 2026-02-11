import React from "react";
import { Navigate } from "react-router-dom";

/**
 * HOC para proteger rotas que requerem autenticação
 * Redireciona para login se não houver token válido
 */
const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  if (!token) {
    console.warn("⚠️ Acesso negado: Token não encontrado. Redirecionando para login...");
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
