
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Login from "./componente/pages/Login";
import Atendimento from "./componente/pages/Atendimento";
import ControleEstoque from "./componente/pages/ControleEstoque";


export const routes = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <h1> teste </h1>,
  // },
  { path: "/", element: <Login /> },
  { path: "/Atendimento", element: <Atendimento /> },
  { path: "/estoque", element: <ControleEstoque /> },
]);