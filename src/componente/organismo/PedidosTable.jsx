import React, { useEffect, useState, useCallback } from "react";
import { Paper, Typography, Box, Alert, Pagination, Stack, Grid } from "@mui/material";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import PedidoCardTelaAtivos from "../moleculas/PedidoCardTelaAtivos";
import SearchField from "../moleculas/SearchField";

const ITEMS_PER_PAGE = 8;

/**
 * Tabela/Grid de pedidos com paginação e busca
 * 
 * Responsivo:
 * - Mobile (xs): 1 coluna
 * - Tablet (sm): 2 colunas
 * - Desktop (md+): 2-3 colunas
 */
const PedidosTable = ({ pedidos = [], onSearch, onStatusChange }) => {
  const [page, setPage] = useState(1);
  const [currentPedidos, setCurrentPedidos] = useState([]);
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    setCurrentPedidos(pedidos.slice(start, start + ITEMS_PER_PAGE));
  }, [pedidos, page]);

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(pedidos.length / ITEMS_PER_PAGE));
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [pedidos, page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearch = useCallback(
    (query) => {
      setPage(1);
      if (onSearch) onSearch(query);
    },
    [onSearch]
  );

  const totalPages = Math.max(1, Math.ceil(pedidos.length / ITEMS_PER_PAGE));

  return (
    <Paper sx={{ width: "100%", p: { xs: 2, sm: 2, md: 3 } }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Pedidos Ativos
      </Typography>

      <SearchField
        onSearch={handleSearch}
        placeholder="Buscar por código ou nome do cliente..."
      />

      {pedidos.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          Nenhum pedido encontrado com os critérios de busca atuais.
        </Alert>
      ) : (
        <>
          <Grid container spacing={{ xs: 2, sm: 2, md: 3 }} sx={{ mt: 1 }}>
            {currentPedidos.map((pedido) => (
              <Grid item xs={12} sm={6} md={6} lg={4} key={pedido.id}>
                <PedidoCardTelaAtivos
                  pedido={pedido}
                  onStatusChange={onStatusChange}
                />
              </Grid>
            ))}
          </Grid>

          {totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 3 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
              />
            </Stack>
          )}
        </>
      )}
    </Paper>
  );
};

export default PedidosTable;
