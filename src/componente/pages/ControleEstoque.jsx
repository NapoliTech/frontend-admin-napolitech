import React, { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Fab,
  Snackbar,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  CardActions,
  Grid,
  Stack,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  Add as AddIcon,
  Visibility as VisibilityIcon,
  Delete as DeleteIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import { useProdutos } from "../../hooks/useProdutos";
import useBreakpoint from "../../hooks/useBreakpoint";
import EstoqueCards from "../moleculas/EstoqueCards";
import ProdutoFormDialog from "../moleculas/ProdutoFormDialog";
import ProdutoDetailDialog from "../moleculas/ProdutoDetailDialog";
import ConfirmDeleteDialog from "../moleculas/ConfirmDeleteDialog";

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
 * Card de produto para visualização mobile
 */
const ProdutoCard = ({ produto, onView, onDelete }) => {
  const getEstoqueColor = (quantidade) => {
    if (quantidade === 0) return "error";
    if (quantidade < 10) return "warning";
    return "success";
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Header com ID e Categoria */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Chip
            label={`#${produto.id}`}
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            label={getCategoriaLabel(produto.categoriaProduto)}
            size="small"
            sx={{ fontWeight: 500 }}
          />
        </Box>

        {/* Nome do Produto */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 2,
            fontSize: { xs: "1rem", sm: "1.125rem" },
            lineHeight: 1.3,
          }}
        >
          {produto.nome}
        </Typography>

        <Divider sx={{ my: 1 }} />

        {/* Informações */}
        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <MoneyIcon fontSize="small" color="success" />
            <Typography variant="body2" color="text.secondary">
              Preço:
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, ml: "auto" }}>
              {formatarPreco(produto.preco)}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <InventoryIcon fontSize="small" color="primary" />
            <Typography variant="body2" color="text.secondary">
              Estoque:
            </Typography>
            <Chip
              label={produto.quantidadeEstoque}
              color={getEstoqueColor(produto.quantidadeEstoque)}
              size="small"
              sx={{ ml: "auto", fontWeight: 500 }}
            />
          </Box>
        </Stack>
      </CardContent>

      <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
        <Tooltip title="Visualizar">
          <IconButton
            size="small"
            color="primary"
            onClick={() => onView(produto)}
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Deletar">
          <IconButton
            size="small"
            color="error"
            onClick={() => onDelete(produto)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

/**
 * Tela principal de Controle de Estoque
 * Gerenciamento completo de produtos com CRUD
 */
const ControleEstoque = () => {
  // Hook customizado com toda a lógica
  const {
    produtos,
    loading,
    error,
    paginacao,
    metricas,
    buscarProduto,
    cadastrarProduto,
    deletarProduto,
    mudarPagina,
    mudarTamanhoPagina,
  } = useProdutos();

  // Hook de responsividade 
  const { isMobile, isTablet, getPagePadding, getTablePageSize } = useBreakpoint();

  // Estados dos dialogs
  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Estados auxiliares
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  /**
   * Abre dialog de cadastro
   */
  const handleOpenFormDialog = () => {
    setOpenFormDialog(true);
  };

  /**
   * Abre dialog de detalhes
   */
  const handleOpenDetailDialog = async (produto) => {
    setProdutoSelecionado(produto);
    setOpenDetailDialog(true);
    setLoadingDetail(true);

    try {
      const detalhes = await buscarProduto(produto.id);
      setProdutoSelecionado(detalhes);
    } catch (err) {
      showSnackbar("Erro ao carregar detalhes do produto", "error");
      setOpenDetailDialog(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  /**
   * Abre dialog de confirmação de exclusão
   */
  const handleOpenDeleteDialog = (produto) => {
    setProdutoSelecionado(produto);
    setOpenDeleteDialog(true);
  };

  /**
   * Handler de cadastro
   */
  const handleCadastrar = async (dadosProduto) => {
    setLoadingAction(true);
    try {
      await cadastrarProduto(dadosProduto);
      showSnackbar("Produto cadastrado com sucesso!", "success");
      setOpenFormDialog(false);
    } catch (err) {
      const errorMessage =
        err.response?.data?.erro ||
        err.response?.data?.message ||
        "Erro ao cadastrar produto";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoadingAction(false);
    }
  };

  /**
   * Handler de exclusão
   */
  const handleDeletar = async (id) => {
    setLoadingAction(true);
    try {
      await deletarProduto(id);
      showSnackbar("Produto deletado com sucesso!", "success");
      setOpenDeleteDialog(false);
      setProdutoSelecionado(null);
    } catch (err) {
      const errorMessage =
        err.response?.data?.erro ||
        err.response?.data?.message ||
        "Erro ao deletar produto";
      showSnackbar(errorMessage, "error");
    } finally {
      setLoadingAction(false);
    }
  };

  /**
   * Exibe snackbar
   */
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  /**
   * Fecha snackbar
   */
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  /**
   * Colunas do DataGrid
   */
  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "nome",
      headerName: "Nome",
      flex: 1,
      minWidth: 200,
    },
    {
      field: "preco",
      headerName: "Preço",
      width: 130,
      align: "right",
      headerAlign: "right",
      renderCell: (params) => formatarPreco(params.row.preco),
    },
    {
      field: "quantidadeEstoque",
      headerName: "Estoque",
      width: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const quantidade = params.value;
        let color = "success";
        let label = quantidade;

        if (quantidade === 0) {
          color = "error";
          label = "Esgotado";
        } else if (quantidade < 10) {
          color = "warning";
        }

        return (
          <Chip
            label={label}
            color={color}
            size="small"
            sx={{ fontWeight: 500, minWidth: 80 }}
          />
        );
      },
    },
    {
      field: "categoriaProduto",
      headerName: "Categoria",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => getCategoriaLabel(params.row.categoriaProduto),
    },
    {
      field: "acoes",
      headerName: "Ações",
      width: 120,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Visualizar">
            <IconButton
              size="small"
              color="primary"
              onClick={() => handleOpenDetailDialog(params.row)}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Deletar">
            <IconButton
              size="small"
              color="error"
              onClick={() => handleOpenDeleteDialog(params.row)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1920px",
        margin: "0 auto",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* Header */}
      <Box sx={{ mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: "text.primary",
            mb: 1,
            fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" },
          }}
        >
          Controle de Estoque
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
        >
          Gerencie os produtos da Napolitech
        </Typography>
      </Box>

      {/* Dashboard Cards */}
      <EstoqueCards metricas={metricas} loading={loading} />

      {/* Lista de Produtos - Adaptativa */}
      {isMobile || isTablet ? (
        // VISUALIZAÇÃO MOBILE/TABLET - CARDS
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Produtos ({paginacao.totalElements})
            </Typography>
          </Box>

          <Grid container spacing={2}>
            {produtos.map((produto) => (
              <Grid item xs={12} sm={6} key={produto.id}>
                <ProdutoCard
                  produto={produto}
                  onView={handleOpenDetailDialog}
                  onDelete={handleOpenDeleteDialog}
                />
              </Grid>
            ))}
          </Grid>

          {/* Paginação Manual para Cards */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              mt: 3,
            }}
          >
            <IconButton
              onClick={() => mudarPagina(paginacao.page - 1)}
              disabled={paginacao.page === 0}
              size="small"
            >
              ← Anterior
            </IconButton>
            <Typography variant="body2">
              Página {paginacao.page + 1} de {paginacao.totalPages}
            </Typography>
            <IconButton
              onClick={() => mudarPagina(paginacao.page + 1)}
              disabled={paginacao.page >= paginacao.totalPages - 1}
              size="small"
            >
              Próxima →
            </IconButton>
          </Box>
        </Box>
      ) : (
        // VISUALIZAÇÃO DESKTOP - TABELA
        <Paper
          elevation={3}
          sx={{
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Lista de Produtos
            </Typography>
          </Box>

          <DataGrid
            rows={produtos}
            columns={columns}
            loading={loading}
            paginationMode="server"
            rowCount={paginacao.totalElements}
            page={paginacao.page}
            pageSize={paginacao.size}
            onPageChange={mudarPagina}
            onPageSizeChange={mudarTamanhoPagina}
            rowsPerPageOptions={[5, 10, 20, 50]}
            disableSelectionOnClick
            autoHeight
            sx={{
              border: 0,
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderColor: "divider",
              },
              "& .MuiDataGrid-columnHeaders": {
                bgcolor: "background.default",
                borderBottom: "2px solid",
                borderColor: "divider",
              },
              "& .MuiDataGrid-row:hover": {
                bgcolor: "action.hover",
              },
            }}
            localeText={{
              noRowsLabel: "Nenhum produto encontrado",
              MuiTablePagination: {
                labelRowsPerPage: "Linhas por página:",
                labelDisplayedRows: ({ from, to, count }) =>
                  `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`,
              },
            }}
          />
        </Paper>
      )}

      {/* Floating Action Button - Responsivo */}
      <Tooltip title="Adicionar Produto" placement="left">
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenFormDialog}
          sx={{
            position: "fixed",
            bottom: { xs: 16, sm: 24, md: 32 },
            right: { xs: 16, sm: 24, md: 32 },
            zIndex: 1000,
          }}
          size={isMobile ? "medium" : "large"}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* Dialogs */}
      <ProdutoFormDialog
        open={openFormDialog}
        onClose={() => setOpenFormDialog(false)}
        onSubmit={handleCadastrar}
        loading={loadingAction}
      />

      <ProdutoDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        produto={produtoSelecionado}
        loading={loadingDetail}
      />

      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeletar}
        produto={produtoSelecionado}
        loading={loadingAction}
      />

      {/* Snackbar para feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ControleEstoque;
