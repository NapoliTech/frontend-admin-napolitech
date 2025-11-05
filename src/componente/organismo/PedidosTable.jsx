import React, { useEffect, useState, useCallback } from "react";
import { Paper, Typography, Box, Alert, Pagination, Stack } from "@mui/material";
import PedidoCardTelaAtivos from "../moleculas/PedidoCardTelaAtivos";
import SearchField from "../moleculas/SearchField";

const ITEMS_PER_PAGE = 8;

const PedidosTable = ({ pedidos = [], onSearch, onStatusChange }) => {
  const [page, setPage] = useState(1);
  const [currentPedidos, setCurrentPedidos] = useState([]);

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
    <Paper sx={{ width: "100%", p: 2 }}>
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
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {currentPedidos.map((pedido) => (
              <PedidoCardTelaAtivos
                key={pedido.id}
                pedido={pedido}
                onStatusChange={onStatusChange}
              />
            ))}
          </Box>

          {totalPages > 1 && (
            <Stack alignItems="center" sx={{ mt: 2 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Stack>
          )}
        </>
      )}
    </Paper>
  );
};

export default PedidosTable;
