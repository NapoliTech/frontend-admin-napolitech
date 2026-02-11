import React from "react";
import { useRouteError, useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stack,
} from "@mui/material";
import {
  Error as ErrorIcon,
  Home as HomeIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

/**
 * ErrorBoundary para capturar erros de roteamento
 * Exibe tela amigável com opções de navegação
 */
const ErrorBoundary = () => {
  const error = useRouteError();
  const navigate = useNavigate();

  console.error("Erro capturado pelo ErrorBoundary:", error);

  const handleGoHome = () => {
    // Verificar se há token válido antes de redirecionar
    const token = sessionStorage.getItem("token");
    if (token) {
      navigate("/Atendimento");
    } else {
      navigate("/");
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: "100%",
            textAlign: "center",
          }}
        >
          <ErrorIcon
            sx={{
              fontSize: 80,
              color: "error.main",
              mb: 2,
            }}
          />

          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Ops! Algo deu errado
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {error?.status === 404
              ? "Página não encontrada"
              : error?.statusText || error?.message || "Ocorreu um erro inesperado"}
          </Typography>

          {error?.status === 404 && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              A página que você está procurando não existe ou foi movida.
            </Typography>
          )}

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
              size="large"
            >
              Ir para Dashboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleReload}
              size="large"
            >
              Recarregar Página
            </Button>
          </Stack>

          {process.env.NODE_ENV === "development" && error?.stack && (
            <Box
              sx={{
                mt: 4,
                p: 2,
                bgcolor: "grey.100",
                borderRadius: 1,
                textAlign: "left",
                overflowX: "auto",
              }}
            >
              <Typography variant="caption" component="pre" sx={{ fontSize: 10 }}>
                {error.stack}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ErrorBoundary;
