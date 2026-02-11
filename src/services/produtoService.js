import httpClient from "./httpClient";

/**
 * Service para gerenciamento de produtos (Controle de Estoque)
 * Todos os endpoints requerem autenticação via JWT
 */
export const produtoService = {
  /**
   * Lista produtos com paginação e ordenação
   * @param {number} page - Número da página (começa em 0)
   * @param {number} size - Quantidade de itens por página
   * @param {string} sort - Campo e direção (ex: "nome,ASC" ou "preco,DESC")
   * @returns {Promise} Resposta paginada com produtos
   */
  listarProdutos: async (page = 0, size = 10, sort = "id,DESC") => {
    try {
      const response = await httpClient.get("/api/produtos", {
        params: { page, size, sort },
      });
      return response.data;
    } catch (error) {
      console.error("Erro ao listar produtos:", error);
      throw error;
    }
  },

  /**
   * Busca detalhes de um produto específico
   * @param {number} id - ID do produto
   * @returns {Promise} Objeto com dados do produto
   */
  buscarPorId: async (id) => {
    try {
      const response = await httpClient.get(`/api/produtos/${id}`);
      return response.data.produto;
    } catch (error) {
      console.error(`Erro ao buscar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Cadastra um novo produto
   * @param {Object} produto - Dados do produto
   * @param {string} produto.nome - Nome do produto
   * @param {number} produto.preco - Preço do produto
   * @param {number} produto.quantidade - Quantidade em estoque
   * @param {string} produto.ingredientes - Ingredientes/descrição
   * @param {string} produto.categoriaProduto - Categoria (PIZZA, BEBIDAS, etc)
   * @returns {Promise} Dados do produto criado
   */
  cadastrar: async (produto) => {
    try {
      const response = await httpClient.post("/api/produtos", produto);
      return response.data;
    } catch (error) {
      console.error("Erro ao cadastrar produto:", error);
      throw error;
    }
  },

  /**
   * Deleta um produto do sistema
   * @param {number} id - ID do produto a ser deletado
   * @returns {Promise} Mensagem de confirmação
   */
  deletar: async (id) => {
    try {
      const response = await httpClient.delete(`/api/produtos/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao deletar produto ${id}:`, error);
      throw error;
    }
  },

  /**
   * Calcula métricas do estoque
   * @param {Array} produtos - Lista de produtos
   * @returns {Object} Métricas calculadas
   */
  calcularMetricas: (produtos) => {
    const total = produtos.length;
    const baixoEstoque = produtos.filter((p) => p.quantidadeEstoque < 10).length;
    
    const categorias = produtos.reduce((acc, produto) => {
      const cat = produto.categoriaProduto;
      acc[cat] = (acc[cat] || 0) + 1;
      return acc;
    }, {});

    return {
      total,
      baixoEstoque,
      categorias,
    };
  },
};
