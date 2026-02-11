import React from "react";
import { Box, Paper, Stack } from "@mui/material";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import LineChart from "../moleculas/LineChart";
import BarChart from "../moleculas/BarChart";
import DistributionChart from "../moleculas/DistributionChart";

/**
 * Gráficos do dashboard empilhados verticalmente
 * Cada gráfico ocupa 100% da largura disponível
 */
const DashboardCharts = ({
  weeklyData,
  distributionData,
  ultimosSeteDias,
  loading,
}) => {
  const { isMobile } = useBreakpoint();
  
  // Padding e altura responsivos
  const paperPadding = isMobile ? 2 : 3;
  const chartHeight = isMobile ? 300 : 500;
  
  return (
    <Stack spacing={{ xs: 2, md: 3 }} sx={{ mt: { xs: 3, md: 4 }, width: "100%" }}>
      {/* Gráfico 1: Vendas por Categoria */}
      <Paper
        sx={{
          p: paperPadding,
          height: chartHeight,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <BarChart
          data={distributionData}
          loading={loading}
          title="Vendas por Categoria"
        />
      </Paper>

      {/* Gráfico 2: Vendas dos Últimos 7 Dias */}
      <Paper
        sx={{
          p: paperPadding,
          height: chartHeight,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <BarChart
          data={ultimosSeteDias}
          loading={loading}
          title="Vendas dos Últimos 7 Dias"
        />
      </Paper>

      {/* Gráfico 3: Faturamento Anual */}
      <Paper
        sx={{
          p: paperPadding,
          height: chartHeight,
          display: "flex",
          flexDirection: "column",
          width: "100%",
        }}
      >
        <LineChart
          data={weeklyData}
          loading={loading}
          title="Faturamento Anual"
        />
      </Paper>
    </Stack>
  );
};

export default DashboardCharts;
