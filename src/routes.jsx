
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./componente/pages/Login";
import Atendimento from "./componente/pages/Atendimento";
import ControleEstoque from "./componente/pages/ControleEstoque";
import ErrorBoundary from "./componente/ErrorBoundary";
import ProtectedRoute from "./componente/ProtectedRoute";


export const routes = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/Atendimento",
    element: (
      <ProtectedRoute>
        <Atendimento />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/estoque",
    element: (
      <ProtectedRoute>
        <ControleEstoque />
      </ProtectedRoute>
    ),
    errorElement: <ErrorBoundary />,
  },
  {
    path: "*",
    errorElement: <ErrorBoundary />,
  },
]);