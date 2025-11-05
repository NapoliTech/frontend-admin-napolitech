import httpClient from "./httpClient";

export const pedidosAtivos = {
  /**
   * Lista todos os pedidos ativos
   * @returns {Promise} Promise com os dados dos pedidos
   */
  listarPedidosAtivos: async () => {
    try {
      const response = await httpClient.get("/api/pedidos");
      console.log("Resposta completa:", response.data);
      // Retorna o array de pedidos do content
      return response.data.content || [];
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      throw new Error(
        `Falha ao carregar pedidos: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  /**
   * Busca um pedido específico pelo ID
   * @param {number} id - ID do pedido
   * @returns {Promise} Promise com os dados do pedido
   */
  buscarPedidoPorId: async (id) => {
    try {
      const response = await httpClient.get(`/api/pedidos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar pedido ${id}:`, error);
      throw new Error(
        `Falha ao buscar pedido: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  /**
   * Atualiza o status de um pedido
   * @param {number} id - ID do pedido
   * @param {string} novoStatus - Novo status do pedido
   * @returns {Promise} Promise com os dados do pedido atualizado
   */
  // atualizarStatusPedido: async (id, novoStatus) => {
  //   try {
  //     const response = await httpClient.patch(`/api/pedidos/${id}/status`, {
  //       status: novoStatus,
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Erro ao atualizar status do pedido ${id}:`, error);
  //     throw new Error(
  //       `Falha ao atualizar status: ${
  //         error.response?.data?.message || error.message
  //       }`
  //     );
  //   }
  // },

  /**
   * Cancela um pedido
   * @param {number} id - ID do pedido
   * @param {string} motivoCancelamento - Motivo do cancelamento
   * @returns {Promise} Promise com os dados do pedido cancelado
   */
  cancelarPedido: async (id, motivoCancelamento) => {
    try {
      const response = await httpClient.delete(`/api/pedidos/${id}`, {
        data: { motivoCancelamento },
      });
      return response.data;
    } catch (error) {
      console.error(`Erro ao cancelar pedido ${id}:`, error);
      throw new Error(
        `Falha ao cancelar pedido: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  atualizarStatusPedido: async (pedidoId, novoStatus) => {
    // Simulação do comportamento do backend
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: "Status atualizado com sucesso",
          data: {
            id: pedidoId,
            status: novoStatus,
          },
        });
      }, 500); // Simula delay da rede
    });

    // Código pronto para quando houver backend
    /* 
    try {
      const response = await httpClient.put(`/api/pedidos/${pedidoId}/status`, {
        status: novoStatus
      });
      return response.data;
    } catch (error) {
      throw new Error(`Falha ao atualizar status: ${error.response?.data?.message || error.message}`);
    }
    */
  },
};
