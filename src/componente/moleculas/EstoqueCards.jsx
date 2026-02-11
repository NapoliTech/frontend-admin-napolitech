import React from "react";
import { Grid, Paper, Typography, Box, Skeleton } from "@mui/material";
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  Category as CategoryIcon,
} from "@mui/icons-material";

/**
 * Card individual de métrica
 */
const MetricCard = ({ title, value, icon, color, loading = false }) => {
  const getIcon = () => {
    switch (icon) {
      case "inventory":
        return <InventoryIcon sx={{ fontSize: 40, color }} />;
      case "warning":
        return <WarningIcon sx={{ fontSize: 40, color }} />;
      case "trending":
        return <TrendingUpIcon sx={{ fontSize: 40, color }} />;
      case "category":
        return <CategoryIcon sx={{ fontSize: 40, color }} />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 120,
        width: "100%",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <Box>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          sx={{ mb: 1, fontWeight: 500, fontSize: "0.875rem" }}
        >
          {title}
        </Typography>
        {loading ? (
          <Skeleton width={60} height={40} />
        ) : (
          <Typography
            variant="h3"
            component="div"
            sx={{
              fontWeight: 700,
              fontSize: "2.5rem",
              color: "text.primary",
            }}
          >
            {value}
          </Typography>
        )}
      </Box>
      <Box
        sx={{
          backgroundColor: `${color}15`,
          borderRadius: "12px",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {getIcon()}
      </Box>
    </Paper>
  );
};

/**
 * Dashboard com cards de métricas do estoque
 * Exibe: Total de produtos, Produtos com estoque baixo, e principais categorias
 */
const EstoqueCards = ({ metricas = {}, loading = false }) => {
  const { total = 0, baixoEstoque = 0, categorias = {} } = metricas;

  // Obter a categoria com mais produtos
  const categoriaPrincipal = Object.entries(categorias).reduce(
    (acc, [nome, qtd]) => {
      if (qtd > acc.quantidade) {
        return { nome, quantidade: qtd };
      }
      return acc;
    },
    { nome: "N/A", quantidade: 0 }
  );

  const cards = [
    {
      title: "Total de Produtos",
      value: total,
      icon: "inventory",
      color: "#1976d2",
    },
    {
      title: "Estoque Baixo",
      value: baixoEstoque,
      icon: "warning",
      color: "#ed6c02",
    },
    {
      title: "Categoria Principal",
      value: categoriaPrincipal.quantidade,
      icon: "category",
      color: "#2e7d32",
    },
    {
      title: "Categorias Ativas",
      value: Object.keys(categorias).length,
      icon: "trending",
      color: "#9c27b0",
    },
  ];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: "text.primary",
        }}
      >
        Visão Geral do Estoque
      </Typography>
      <Grid container spacing={3}>
        {cards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <MetricCard
              title={card.title}
              value={card.value}
              icon={card.icon}
              color={card.color}
              loading={loading}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EstoqueCards;
