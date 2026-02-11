import { useState, useEffect, useCallback } from "react";
import { produtoService } from "../services/produtoService";

/**
 * Hook customizado para gerenciar estado e operações de produtos
 * Encapsula toda a lógica de fetch, paginação, ordenação e CRUD
 */
export const useProdutos = () => {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado de paginação
  const [paginacao, setPaginacao] = useState({
    page: 0,
    size: 10,
    sort: "id,DESC",
    totalPages: 0,
    totalElements: 0,
  });

  // Métricas do dashboard
  const [metricas, setMetricas] = useState({
    total: 0,
    baixoEstoque: 0,
    categorias: {},
  });

  /**
   * Carrega produtos da API com paginação e ordenação
   */
  const carregarProdutos = useCallback(async (page, size, sort) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await produtoService.listarProdutos(
        page ?? paginacao.page,
        size ?? paginacao.size,
        sort ?? paginacao.sort
      );

      setProdutos(response.content || []);
      setPaginacao({
        page: response.number,
        size: response.size,
        sort: sort ?? paginacao.sort,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      });

      // Calcular métricas
      const metrics = produtoService.calcularMetricas(response.content || []);
      setMetricas(metrics);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      setError(err.response?.data?.erro || "Erro ao carregar produtos");
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }, [paginacao.page, paginacao.size, paginacao.sort]);

  /**
   * Busca detalhes de um produto específico
   */
  const buscarProduto = useCallback(async (id) => {
    try {
      const produto = await produtoService.buscarPorId(id);
      return produto;
    } catch (err) {
      console.error(`Erro ao buscar produto ${id}:`, err);
      throw err;
    }
  }, []);

  /**
   * Cadastra um novo produto
   */
  const cadastrarProduto = useCallback(async (dadosProduto) => {
    try {
      const response = await produtoService.cadastrar(dadosProduto);
      // Recarregar lista após cadastro
      await carregarProdutos(0, paginacao.size, paginacao.sort);
      return response;
    } catch (err) {
      console.error("Erro ao cadastrar produto:", err);
      throw err;
    }
  }, [carregarProdutos, paginacao.size, paginacao.sort]);

  /**
   * Deleta um produto
   */
  const deletarProduto = useCallback(async (id) => {
    try {
      const response = await produtoService.deletar(id);
      // Recarregar lista após deleção
      await carregarProdutos(paginacao.page, paginacao.size, paginacao.sort);
      return response;
    } catch (err) {
      console.error(`Erro ao deletar produto ${id}:`, err);
      throw err;
    }
  }, [carregarProdutos, paginacao.page, paginacao.size, paginacao.sort]);

  /**
   * Muda a página
   */
  const mudarPagina = useCallback((novaPagina) => {
    carregarProdutos(novaPagina, paginacao.size, paginacao.sort);
  }, [carregarProdutos, paginacao.size, paginacao.sort]);

  /**
   * Muda o tamanho da página
   */
  const mudarTamanhoPagina = useCallback((novoTamanho) => {
    carregarProdutos(0, novoTamanho, paginacao.sort);
  }, [carregarProdutos, paginacao.sort]);

  /**
   * Muda a ordenação
   */
  const mudarOrdenacao = useCallback((novaOrdenacao) => {
    carregarProdutos(paginacao.page, paginacao.size, novaOrdenacao);
  }, [carregarProdutos, paginacao.page, paginacao.size]);

  /**
   * Recarrega os dados
   */
  const recarregar = useCallback(() => {
    carregarProdutos(paginacao.page, paginacao.size, paginacao.sort);
  }, [carregarProdutos, paginacao.page, paginacao.size, paginacao.sort]);

  // Carregar produtos ao montar o componente
  useEffect(() => {
    carregarProdutos(0, 10, "id,DESC");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    // Estado
    produtos,
    loading,
    error,
    paginacao,
    metricas,
    
    // Ações
    carregarProdutos,
    buscarProduto,
    cadastrarProduto,
    deletarProduto,
    mudarPagina,
    mudarTamanhoPagina,
    mudarOrdenacao,
    recarregar,
  };
};
