import axios from "axios";

const backendUrl = import.meta.env.VITE_ENDERECO_API;

const httpClient = axios.create({
  baseURL: backendUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adicionar token de autenticação a todas as requisições
httpClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Interceptar respostas para tratar erros de autenticação (401) e autorização (403)
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Token expirado, inválido ou sem permissão
      console.error(`Erro ${error.response.status}: ${error.response.data?.message || 'Acesso negado'}`);
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("userData");
      // Redirecionar para a rota correta de login ("/")
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default httpClient;
