import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

/**
 * Dialog de confirmação para exclusão de produto
 * Exibe alerta visual e requer confirmação explícita
 */
const ConfirmDeleteDialog = ({
  open,
  onClose,
  onConfirm,
  produto,
  loading = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  const handleConfirm = () => {
    if (produto) {
      onConfirm(produto.id);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: "50%",
              bgcolor: "error.lighter",
              color: "error.main",
            }}
          >
            <WarningIcon />
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Confirmar Exclusão
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="body1" color="text.primary">
            Você está prestes a deletar o seguinte produto:
          </Typography>

          {produto && (
            <Box
              sx={{
                p: 2,
                bgcolor: "background.default",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                Produto:
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {produto.nome}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                ID: #{produto.id}
              </Typography>
            </Box>
          )}

          <Alert severity="error" variant="outlined">
            <Typography variant="body2">
              <strong>Atenção:</strong> Esta ação é irreversível. O produto será
              permanentemente removido do sistema.
            </Typography>
          </Alert>

          <Typography variant="body2" color="text.secondary">
            Tem certeza que deseja continuar?
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={loading}
          sx={{ minWidth: 100 }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={
            loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />
          }
          sx={{ minWidth: 120 }}
        >
          {loading ? "Deletando..." : "Deletar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
