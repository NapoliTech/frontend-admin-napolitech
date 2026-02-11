import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close as CloseIcon,
  Save as SaveIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";

/**
 * Categorias disponíveis conforme documentação da API
 */
const CATEGORIAS = [
  { value: "PIZZA", label: "Pizza" },
  { value: "PORCAO", label: "Porção" },
  { value: "SOBREMESA", label: "Sobremesa" },
  { value: "PIZZA_DOCE", label: "Pizza Doce" },
  { value: "ESFIHA", label: "Esfiha" },
  { value: "ESFIHA_DOCE", label: "Esfiha Doce" },
  { value: "BEBIDAS", label: "Bebidas" },
];

/**
 * Dialog para cadastrar novo produto
 * Validação em tempo real e feedback visual
 */
const ProdutoFormDialog = ({ open, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    nome: "",
    preco: "",
    quantidade: "",
    ingredientes: "",
    categoriaProduto: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Limpar formulário ao fechar
  useEffect(() => {
    if (!open) {
      setFormData({
        nome: "",
        preco: "",
        quantidade: "",
        ingredientes: "",
        categoriaProduto: "",
      });
      setErrors({});
      setTouched({});
    }
  }, [open]);

  /**
   * Valida um campo específico
   */
  const validateField = (name, value) => {
    switch (name) {
      case "nome":
        if (!value.trim()) return "Nome é obrigatório";
        if (value.length < 3) return "Nome deve ter no mínimo 3 caracteres";
        return "";

      case "preco":
        if (!value) return "Preço é obrigatório";
        if (isNaN(value) || parseFloat(value) <= 0)
          return "Preço deve ser maior que zero";
        return "";

      case "quantidade":
        if (!value) return "Quantidade é obrigatória";
        if (isNaN(value) || parseInt(value) < 0)
          return "Quantidade deve ser um número positivo";
        return "";

      case "ingredientes":
        if (!value.trim()) return "Ingredientes são obrigatórios";
        if (value.length < 5)
          return "Ingredientes devem ter no mínimo 5 caracteres";
        return "";

      case "categoriaProduto":
        if (!value) return "Categoria é obrigatória";
        return "";

      default:
        return "";
    }
  };

  /**
   * Valida todo o formulário
   */
  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handler de mudança de campo
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validar em tempo real se o campo já foi tocado
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  /**
   * Handler de blur (campo tocado)
   */
  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, formData[name]);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  /**
   * Handler de submit
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    // Marcar todos os campos como tocados
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (!validateForm()) {
      return;
    }

    // Formatar dados conforme API
    const payload = {
      nome: formData.nome.trim(),
      preco: parseFloat(formData.preco),
      quantidade: parseInt(formData.quantidade),
      ingredientes: formData.ingredientes.trim(),
      categoriaProduto: formData.categoriaProduto,
    };

    onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
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
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Cadastrar Novo Produto
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: "text.secondary" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent dividers sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Nome */}
            <TextField
              label="Nome do Produto"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.nome && Boolean(errors.nome)}
              helperText={touched.nome && errors.nome}
              fullWidth
              required
              autoFocus
              placeholder="Ex: Pizza de Calabresa"
            />

            {/* Preço */}
            <TextField
              label="Preço"
              name="preco"
              type="number"
              value={formData.preco}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.preco && Boolean(errors.preco)}
              helperText={touched.preco && errors.preco}
              fullWidth
              required
              inputProps={{
                step: "0.01",
                min: "0",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder="0.00"
            />

            {/* Quantidade */}
            <TextField
              label="Quantidade em Estoque"
              name="quantidade"
              type="number"
              value={formData.quantidade}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.quantidade && Boolean(errors.quantidade)}
              helperText={touched.quantidade && errors.quantidade}
              fullWidth
              required
              inputProps={{
                min: "0",
                step: "1",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InventoryIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              placeholder="0"
            />

            {/* Categoria */}
            <TextField
              select
              label="Categoria"
              name="categoriaProduto"
              value={formData.categoriaProduto}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.categoriaProduto && Boolean(errors.categoriaProduto)}
              helperText={touched.categoriaProduto && errors.categoriaProduto}
              fullWidth
              required
            >
              {CATEGORIAS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Ingredientes */}
            <TextField
              label="Ingredientes / Descrição"
              name="ingredientes"
              value={formData.ingredientes}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.ingredientes && Boolean(errors.ingredientes)}
              helperText={touched.ingredientes && errors.ingredientes}
              fullWidth
              required
              multiline
              rows={3}
              placeholder="Ex: Calabresa, queijo, molho de tomate, orégano"
            />

            {/* Informação adicional */}
            <Alert severity="info" sx={{ mt: 1 }}>
              Todos os campos são obrigatórios. Preencha com atenção.
            </Alert>
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
            sx={{ minWidth: 100 }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
            sx={{ minWidth: 120 }}
          >
            {loading ? "Salvando..." : "Cadastrar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ProdutoFormDialog;
