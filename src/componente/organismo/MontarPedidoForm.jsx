import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Paper,
  List,
  Divider,
  IconButton,
  Alert,
  Zoom,
  CircularProgress,
  Chip,
  ButtonGroup,
  TextField,
  InputAdornment
} from "@mui/material";
import {
  LocalPizza,
  LocalDrink,
  Add,
  ShoppingCart,
  Close,
  Info,
  AttachMoney,
  Restaurant,
  Fastfood,
  CheckCircle,
  ArrowForward,
  Search,
  Clear
} from "@mui/icons-material";
import { pedidoService } from "../../services/pedidoService";

// Importar componentes modulares
import PizzaItemCard from "../moleculas/PizzaItemCard";
import BebidaItemCard from "../moleculas/BebidaItemCard";
import PedidoCard from "../moleculas/PedidoCard";
import ProdutoListItem from "../moleculas/ProdutoListItem";

const MontarPedidoForm = ({ onContinue, onRetirarNaLoja }) => {
  const [tamanho, setTamanho] = useState("");
  const [borda, setBorda] = useState("");
  const [openPizzaDialog, setOpenPizzaDialog] = useState(false);
  const [openBebidaDialog, setOpenBebidaDialog] = useState(false);
  const [tempSelectedPizzas, setTempSelectedPizzas] = useState([]);
  const [tempSelectedBebidas, setTempSelectedBebidas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [currentPizzaSelection, setCurrentPizzaSelection] =
    useState("primeira");
  const [loading, setLoading] = useState(true);
  const [loadingPedido, setLoadingPedido] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Novo estado para armazenar o payload no formato correto
  const [pedidoPayload, setPedidoPayload] = useState({
    clienteId: null, // Será preenchido em outra tela
    itens: [],
  });

  const isSelectionEnabled = tamanho !== "" && borda !== "";
  const canAddPedido = isSelectionEnabled && tempSelectedPizzas.length > 0;
  const canContinue = pedidos.length > 0;

  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setApiError(null);
      try {
        const produtosData = await pedidoService.getProdutos();
        // Garantir que produtos seja sempre um array
        setProdutos(Array.isArray(produtosData) ? produtosData : []);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setApiError(error.message || "Erro ao carregar produtos. Tente novamente.");
        setProdutos([]); // Garantir que produtos seja um array vazio em caso de erro
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtrar produtos por categoria
  const pizzas = produtos.filter(
    (p) => p.categoriaProduto === "PIZZA" || p.categoriaProduto === "PIZZA_DOCE"
  );
  const bebidas = produtos.filter((p) => p.categoriaProduto === "BEBIDAS");

  // Filtrar pizzas com base no termo de pesquisa
  const filterPizzas = (pizzaList) => {
    if (!searchTerm.trim()) return pizzaList;

    const term = searchTerm.toLowerCase().trim();
    return pizzaList.filter(
      (pizza) =>
        pizza.nome.toLowerCase().includes(term) ||
        (pizza.ingredientes && pizza.ingredientes.toLowerCase().includes(term))
    );
  };

  // Pizzas filtradas por categoria e termo de busca
  const pizzasSalgadas = filterPizzas(
    pizzas.filter((pizza) => pizza.categoriaProduto === "PIZZA")
  );

  const pizzasDoces = filterPizzas(
    pizzas.filter((pizza) => pizza.categoriaProduto === "PIZZA_DOCE")
  );

  const handlePizzaSelect = (pizza) => {
    if (currentPizzaSelection === "primeira") {
      setTempSelectedPizzas([pizza]);
    } else {
      setTempSelectedPizzas([...tempSelectedPizzas, pizza]);
    }
    setOpenPizzaDialog(false);
  };

  const handleRetirarNaLoja = () => {
    // Passar os pedidos e o payload para o componente pai
    onRetirarNaLoja(pedidos, pedidoPayload);
  };

  const handleRemovePedido = (index) => {
    // Remover o pedido da UI
    const newPedidos = [...pedidos];
    newPedidos.splice(index, 1);
    setPedidos(newPedidos);

    // Remover o item correspondente do payload
    const newItens = [...pedidoPayload.itens];
    newItens.splice(index, 1);
    setPedidoPayload({
      ...pedidoPayload,
      itens: newItens,
    });

    // Mostrar mensagem de sucesso
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
  };

  const handleContinue = () => {
    // Passar os pedidos e o payload para o componente pai
    onContinue(pedidos, pedidoPayload);
  };

  const handleBebidaSelect = (bebida) => {
    setTempSelectedBebidas([...tempSelectedBebidas, bebida]);
    setOpenBebidaDialog(false);
  };

  const handleRemoveBebida = (index) => {
    const newBebidas = [...tempSelectedBebidas];
    newBebidas.splice(index, 1);
    setTempSelectedBebidas(newBebidas);
  };

  const handleRemovePizza = (index) => {
    // Se estamos removendo a primeira pizza e temos duas, a segunda se torna a primeira
    if (index === 0 && tempSelectedPizzas.length === 2) {
      setTempSelectedPizzas([tempSelectedPizzas[1]]);
    }
    // Se estamos removendo a segunda pizza ou só temos uma pizza
    else {
      const newPizzas = [...tempSelectedPizzas];
      newPizzas.splice(index, 1);
      setTempSelectedPizzas(newPizzas);
    }
  };

  const handleAddPedido = () => {
    setLoadingPedido(true);

    // Simular um atraso para mostrar o loading
    setTimeout(() => {
      // Extrair os IDs das pizzas selecionadas para o payload
      const pizzaIds = tempSelectedPizzas.map((pizza) => pizza.id);

      // Criar o item no formato esperado pelo backend
      const novoItem = {
        produto: pizzaIds,
        quantidade: 1,
        tamanhoPizza: tamanho,
        bordaRecheada: borda,
      };

      // Criar o pedido para exibição na UI
      const novoPedido = {
        id: Date.now(),
        tamanho,
        borda,
        pizzas: tempSelectedPizzas,
        bebidas: tempSelectedBebidas,
        total: calcularTotal(),
      };

      // Atualizar o estado dos pedidos para a UI
      setPedidos([...pedidos, novoPedido]);

      // Atualizar o payload para o backend
      setPedidoPayload({
        ...pedidoPayload,
        itens: [...pedidoPayload.itens, novoItem],
      });

      // Limpar seleções temporárias
      setTempSelectedPizzas([]);
      setTempSelectedBebidas([]);
      setTamanho("");
      setBorda("");
      setLoadingPedido(false);

      // Mostrar mensagem de sucesso
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    }, 800);
  };

  const calcularTotal = () => {
    const pizzasTotal = tempSelectedPizzas.reduce(
      (acc, pizza) => acc + parseFloat(pizza.preco),
      0
    );
    const bebidasTotal = tempSelectedBebidas.reduce(
      (acc, bebida) => acc + parseFloat(bebida.preco),
      0
    );
    return (pizzasTotal + bebidasTotal).toFixed(2);
  };

  const calcularTotalPedidos = () => {
    return pedidos
      .reduce((acc, pedido) => acc + parseFloat(pedido.total), 0)
      .toFixed(2);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
        }}
      >
        <CircularProgress />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Carregando cardápio...
        </Typography>
      </Box>
    );
  }

  if (apiError) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          p: 3,
        }}
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          {apiError}
        </Alert>
        <Button
          variant="contained"
          onClick={() => {
            setLoading(true);
            setApiError(null);
            pedidoService
              .getProdutos()
              .then((data) => {
                setProdutos(Array.isArray(data) ? data : []);
              })
              .catch((error) => {
                setApiError(error.message || "Erro ao carregar produtos. Tente novamente.");
                setProdutos([]);
              })
              .finally(() => setLoading(false));
          }}
        >
          Tentar Novamente
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        gap: 4,
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {successMessage && (
        <Zoom in={successMessage}>
          <Alert
            severity="success"
            sx={{
              position: "absolute",
              top: -60,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 1000,
              boxShadow: 4,
              width: "80%",
            }}
            onClose={() => setSuccessMessage(false)}
          >
            Pedido adicionado com sucesso!
          </Alert>
        </Zoom>
      )}

      <Box sx={{ width: "50%" }}>
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", mb: 3 }}
          >
            <LocalPizza sx={{ mr: 1 }} /> Montar Pizza
          </Typography>

          <Stack spacing={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Tamanho</InputLabel>
              <Select
                value={tamanho}
                onChange={(e) => setTamanho(e.target.value)}
                label="Tamanho"
                startAdornment={
                  tamanho && <Restaurant sx={{ mr: 1, ml: -0.5 }} />
                }
              >
                {pedidoService.getTamanhos().map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth variant="outlined">
              <InputLabel>Borda</InputLabel>
              <Select
                value={borda}
                onChange={(e) => setBorda(e.target.value)}
                label="Borda"
                startAdornment={borda && <Fastfood sx={{ mr: 1, ml: -0.5 }} />}
              >
                {pedidoService.getBordas().map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Divider sx={{ my: 1 }} />

            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                disabled={!isSelectionEnabled}
                onClick={() => {
                  setCurrentPizzaSelection("primeira");
                  setOpenPizzaDialog(true);
                }}
                startIcon={<LocalPizza />}
                sx={{ py: 1.2 }}
              >
                Selecionar Primeira Metade
              </Button>

              <Button
                variant="contained"
                fullWidth
                disabled={!isSelectionEnabled}
                onClick={() => {
                  setCurrentPizzaSelection("segunda");
                  setOpenPizzaDialog(true);
                }}
                startIcon={<LocalPizza />}
                sx={{ py: 1.2 }}
              >
                Selecionar Segunda Metade
              </Button>

              <Button
                variant="contained"
                fullWidth
                disabled={!isSelectionEnabled}
                onClick={() => setOpenBebidaDialog(true)}
                startIcon={<LocalDrink />}
                color="secondary"
                sx={{ py: 1.2 }}
              >
                Adicionar Bebidas
              </Button>
            </Stack>

            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                gutterBottom
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ShoppingCart sx={{ mr: 1 }} /> Itens Selecionados
              </Typography>

              {tempSelectedPizzas.length === 0 &&
              tempSelectedBebidas.length === 0 ? (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Nenhum item selecionado ainda
                </Alert>
              ) : (
                <Stack spacing={1}>
                  {tempSelectedPizzas.map((pizza, index) => (
                    <PizzaItemCard
                      key={index}
                      pizza={pizza}
                      index={index}
                      onRemove={handleRemovePizza}
                    />
                  ))}

                  {tempSelectedBebidas.map((bebida, index) => (
                    <BebidaItemCard
                      key={index}
                      bebida={bebida}
                      index={index}
                      onRemove={handleRemoveBebida}
                    />
                  ))}

                  {(tempSelectedPizzas.length > 0 ||
                    tempSelectedBebidas.length > 0) && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 1,
                      }}
                    >
                      <Chip
                        icon={<AttachMoney />}
                        label={`Total: R$ ${calcularTotal()}`}
                        color="success"
                        sx={{ fontWeight: "bold" }}
                      />
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          </Stack>
        </Paper>
      </Box>

      <Paper
        elevation={4}
        sx={{
          width: "50%",
          p: 3,
          maxHeight: "100vh",
          overflow: "auto",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ display: "flex", alignItems: "center", mb: 3 }}
          >
            <ShoppingCart sx={{ mr: 1 }} /> Pedidos
          </Typography>

          {pedidos.length === 0 ? (
            <Alert severity="info" icon={<Info />}>
              Nenhum pedido adicionado ainda. Monte sua pizza e adicione ao
              pedido.
            </Alert>
          ) : (
            <Stack spacing={3}>
              {pedidos.map((pedido, index) => (
                <PedidoCard
                  key={pedido.id}
                  pedido={pedido}
                  index={index}
                  onRemove={handleRemovePedido}
                />
              ))}
            </Stack>
          )}
        </Box>

        <Box sx={{ mt: 4 }}>
          {pedidos.length > 0 && (
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}
            >
              <Typography variant="h6">Total do Pedido:</Typography>
              <Chip
                icon={<AttachMoney />}
                label={`R$ ${calcularTotalPedidos()}`}
                color="success"
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.1rem",
                  height: "auto",
                  padding: "4px 0",
                }}
              />
            </Box>
          )}

          <ButtonGroup fullWidth variant="contained">
            <Button
              color="success"
              size="large"
              disabled={!canAddPedido || loadingPedido}
              onClick={handleAddPedido}
              startIcon={
                loadingPedido ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <Add />
                )
              }
              sx={{ py: 1.5 }}
            >
              {loadingPedido ? "Adicionando..." : "Adicionar Pedido"}
            </Button>

            <Button
              color="primary"
              size="large"
              disabled={!canContinue}
              onClick={handleContinue}
              endIcon={<ArrowForward />}
              sx={{ py: 1.5 }}
            >
              Continuar
            </Button>
          </ButtonGroup>
        </Box>
      </Paper>

      {/* Dialog para seleção de pizzas */}
      <Dialog
        open={openPizzaDialog}
        onClose={() => setOpenPizzaDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <LocalPizza sx={{ mr: 1 }} />
          Selecione a{" "}
          {currentPizzaSelection === "primeira" ? "primeira" : "segunda"} metade
          <IconButton
            aria-label="close"
            onClick={() => setOpenPizzaDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>

        {/* Campo de pesquisa */}
        <Box sx={{ px: 3, pt: 1, pb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Buscar por sabor ou ingredientes"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchTerm("")}>
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <DialogContent dividers>
          {/* Pizzas Salgadas */}
          <Typography
            variant="h6"
            sx={{
              mb: 2,
              mt: 1,
              fontWeight: "bold",
              color: "primary.main",
              display: "flex",
              alignItems: "center",
            }}
          >
            <LocalPizza sx={{ mr: 1 }} /> Pizzas Salgadas
          </Typography>

          {pizzasSalgadas.length > 0 ? (
            <List sx={{ width: "100%" }}>
              {pizzasSalgadas.map((pizza, index, filteredArray) => (
                <React.Fragment key={pizza.id}>
                  <ProdutoListItem
                    produto={pizza}
                    icon={<LocalPizza />}
                    onClick={handlePizzaSelect}
                    color="primary"
                  />
                  {index < filteredArray.length - 1 && (
                    <Divider variant="inset" component="li" />
                  )}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Alert severity="info" sx={{ mb: 2 }}>
              Nenhuma pizza salgada encontrada com os termos de busca.
            </Alert>
          )}

          {/* Pizzas Doces */}
          {pizzas.some((pizza) => pizza.categoriaProduto === "PIZZA_DOCE") && (
            <>
              <Typography
                variant="h6"
                sx={{
                  mb: 2,
                  mt: 3,
                  fontWeight: "bold",
                  color: "secondary.main",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocalPizza sx={{ mr: 1 }} /> Pizzas Doces
              </Typography>

              {pizzasDoces.length > 0 ? (
                <List sx={{ width: "100%" }}>
                  {pizzasDoces.map((pizza, index, filteredArray) => (
                    <React.Fragment key={pizza.id}>
                      <ProdutoListItem
                        produto={pizza}
                        icon={<LocalPizza />}
                        onClick={handlePizzaSelect}
                        color="secondary"
                      />
                      {index < filteredArray.length - 1 && (
                        <Divider variant="inset" component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Alert severity="info">
                  Nenhuma pizza doce encontrada com os termos de busca.
                </Alert>
              )}
            </>
          )}

          {pizzasSalgadas.length === 0 && pizzasDoces.length === 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                Nenhuma pizza encontrada. Tente outros termos de busca.
              </Typography>
            </Box>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog para seleção de bebidas */}
      <Dialog
        open={openBebidaDialog}
        onClose={() => setOpenBebidaDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center" }}>
          <LocalDrink sx={{ mr: 1 }} />
          Selecione as bebidas
          <IconButton
            aria-label="close"
            onClick={() => setOpenBebidaDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <List sx={{ width: "100%" }}>
            {bebidas.map((bebida, index) => (
              <React.Fragment key={bebida.id}>
                <ProdutoListItem
                  produto={bebida}
                  icon={<LocalDrink />}
                  onClick={handleBebidaSelect}
                  color="secondary"
                />
                {index < bebidas.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenBebidaDialog(false)}
            variant="contained"
            color="primary"
            startIcon={<CheckCircle />}
          >
            Concluir Seleção
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MontarPedidoForm;

