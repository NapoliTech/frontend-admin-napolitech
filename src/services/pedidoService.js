import httpClient from "./httpClient";

export const pedidoService = {
  getProdutos: async () => {
    try {
      const response = await httpClient.get("/api/produtos");
      // Verificar se temos content e se é um array
      const produtos = response.data?.content;
      if (!Array.isArray(produtos)) {
        console.error("API retornou dados em formato inválido:", response.data);
        return []; // Retorna array vazio se dados não forem array
      }
      return produtos;
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      throw new Error(
        `Falha ao carregar produtos: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  getTamanhos: () => [
    { value: "GRANDE", label: "Grande" },
    { value: "MEIO_A_MEIO", label: "Meio a Meio" },
  ],

  getBordas: () => [
    { value: "CATUPIRY", label: "Catupiry" },
    { value: "NENHUM", label: "Sem Borda" },
  ],

  gerarPedido: async (payload) => {
    try {
      const response = await httpClient.post("/api/pedidos", payload);
      // Retorna o conteúdo se existir, ou o data completo se não tiver content
      return response.data?.content || response.data;
    } catch (error) {
      console.error("Erro ao gerar pedido:", error);
      throw new Error(
        `Falha ao gerar pedido: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  },

  atualizarStatus: async (pedidoId, novoStatus) => {
    try {
      const response = await httpClient.put(`/api/pedidos/${pedidoId}/status`, {
        status: novoStatus,
      });
      // Retorna o conteúdo se existir, ou o data completo se não tiver content
      return response.data?.content || response.data;
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      throw error;
    }
  },
};
