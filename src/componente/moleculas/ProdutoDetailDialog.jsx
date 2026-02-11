import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Chip,
  Divider,
  Grid,
  Paper,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Close as CloseIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  Tag as TagIcon,
} from "@mui/icons-material";

/**
 * Mapeia categorias para labels legíveis
 */
const getCategoriaLabel = (categoria) => {
  const map = {
    PIZZA: "Pizza",
    PORCAO: "Porção",
    SOBREMESA: "Sobremesa",
    PIZZA_DOCE: "Pizza Doce",
    ESFIHA: "Esfiha",
    ESFIHA_DOCE: "Esfiha Doce",
    BEBIDAS: "Bebidas",
  };
  return map[categoria] || categoria;
};

/**
 * Formata preço para formato brasileiro
 */
const formatarPreco = (preco) => {
  // Validar se o preço é um número válido
  const precoNumerico = parseFloat(preco);
  
  if (isNaN(precoNumerico) || precoNumerico === null || precoNumerico === undefined) {
    return "R$ 0,00";
  }
  
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(precoNumerico);
};

/**
 * Item de informação com ícone
 */
const InfoItem = ({ icon, label, value, color = "primary" }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "flex-start",
      gap: 2,
      p: 2,
      borderRadius: 2,
      bgcolor: "background.default",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: "8px",
        bgcolor: `${color}.lighter`,
        color: `${color}.main`,
      }}
    >
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 500, mt: 0.5 }}>
        {value}
      </Typography>
    </Box>
  </Box>
);

/**
 * Dialog para visualizar detalhes completos de um produto
 */
const ProdutoDetailDialog = ({ open, onClose, produto, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  
  // Determinar cor do chip de estoque
  const getEstoqueColor = (quantidade) => {
    if (quantidade === 0) return "error";
    if (quantidade < 10) return "warning";
    return "success";
  };

  const getEstoqueLabel = (quantidade) => {
    if (quantidade === 0) return "Esgotado";
    if (quantidade < 10) return "Estoque Baixo";
    return "Disponível";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            Detalhes do Produto
          </Typography>
          {!loading && produto && (
            <Chip
              label={getEstoqueLabel(produto.quantidadeEstoque)}
              color={getEstoqueColor(produto.quantidadeEstoque)}
              size="small"
              sx={{ fontWeight: 500 }}
            />
          )}
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ pt: 3 }}>
        {loading ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Skeleton variant="rectangular" height={60} />
            <Skeleton variant="rectangular" height={60} />
            <Skeleton variant="rectangular" height={60} />
            <Skeleton variant="rectangular" height={100} />
          </Box>
        ) : produto ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {/* Header com ID e Nome */}
            <Paper
              elevation={0}
              sx={{
                p: 3,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: 2,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <TagIcon fontSize="small" />
                <Typography variant="caption">ID #{produto.id}</Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {produto.nome}
              </Typography>
            </Paper>

            {/* Grid com informações */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon={<MoneyIcon />}
                  label="Preço"
                  value={formatarPreco(produto.preco)}
                  color="success"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <InfoItem
                  icon={<InventoryIcon />}
                  label="Quantidade em Estoque"
                  value={`${produto.quantidadeEstoque} unidades`}
                  color="primary"
                />
              </Grid>
              <Grid item xs={12}>
                <InfoItem
                  icon={<CategoryIcon />}
                  label="Categoria"
                  value={getCategoriaLabel(produto.categoriaProduto)}
                  color="secondary"
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 1 }} />

            {/* Ingredientes */}
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <DescriptionIcon color="action" />
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Ingredientes / Descrição
                </Typography>
              </Box>
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  bgcolor: "background.default",
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    lineHeight: 1.7,
                    color: "text.secondary",
                  }}
                >
                  {produto.ingredientes}
                </Typography>
              </Paper>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 200,
            }}
          >
            <Typography color="text.secondary">
              Nenhum produto selecionado
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{ minWidth: 100 }}
        >
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProdutoDetailDialog;
