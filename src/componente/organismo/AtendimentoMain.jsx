import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import SideNav from "../moleculas/SideNav";
import DashboardCards from "../moleculas/DashboardCards";
import DashboardCharts from "./DashboardCharts";
import MontarPedido from "../pages/MontarPedido";
import Pedidos from "../pages/Pedidos";
import ControleEstoque from "../pages/ControleEstoque";
import { dashboardService } from "../../services/dashboardService";

const AtendimentoMain = () => {
  const [currentView, setCurrentView] = useState("dashboard");
  const [loading, setLoading] = useState(false);
  const [cardsData, setCardsData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);
  const [ultimosSeteDias, setUltimosSeteDias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await dashboardService.getKPIs();
      let resposta = response.kpis;
      const newCardsData = [
        {
          title: "Pedidos em Aberto",
          value: resposta.pedidosEmAberto,
          icon: "pending",
          color: "#ff9800",
        },
        {
          title: "Pedidos Totais",
          value: resposta.pedidosTotais,
          icon: "total",
          color: "#2196f3",
        },
        {
          title: "Faturamento Diário",
          value: `R$ ${resposta.faturamentoDiario.toFixed(2)}`,
          icon: "money",
          color: "#9c27b0",
        },
        {
          title: "Pedidos Finalizados",
          value: resposta.pedidosFinalizados,
          icon: "done",
          color: "#4caf50",
        },
      ];
      setCardsData(newCardsData);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchFaturamento = async () => {
      const anoAtual = new Date().getFullYear();
      const response = await dashboardService.getFaturamentoAnual(anoAtual);
      setWeeklyData(response.faturamentoAnual);
    };
    fetchFaturamento();
  }, []);

  useEffect(() => {
    const fetchDistribuicao = async () => {
      const dataAtual = new Date();
      const anoAtual = dataAtual.getFullYear();
      const mesAtual = dataAtual.getMonth() + 1;
      const response = await dashboardService.getDistribuicaoVendas(
        anoAtual,
        mesAtual
      );
      setDistributionData(response);
    };
    fetchDistribuicao();
  }, []);

  useEffect(() => {
    const fetchUltimosDias = async () => {
      const response = await dashboardService.getVendasUltimosDias();
      setUltimosSeteDias(response);
    };
    fetchUltimosDias();
  }, []);

  const handleMenuClick = (view) => {
    setCurrentView(view);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <SideNav onMenuClick={handleMenuClick} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          maxWidth: "1920px",
          margin: "0 auto",
          boxSizing: "border-box",
        }}
      >
        {currentView === "dashboard" && (
          <>
            <DashboardCards cardsData={cardsData} loading={loading} />
            <DashboardCharts
              weeklyData={weeklyData}
              distributionData={distributionData}
              ultimosSeteDias={ultimosSeteDias}
              loading={loading}
            />
          </>
        )}
        {currentView === "pedidos" && <Pedidos />}
        {currentView === "montarPedido" && (
          <MontarPedido onNavigate={handleMenuClick} />
        )}
        {currentView === "estoque" && <ControleEstoque />}
      </Box>
    </Box>
  );
};

export default AtendimentoMain;
