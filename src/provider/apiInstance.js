import axios from "axios";

export  const api = axios.create({
  baseURL:import.meta.env.VITE_ENDERECO_API,
})

api.interceptors.request.use(
  (config) => {
      // Padronizado para usar sessionStorage (mesmo do authService)
      const token = sessionStorage.getItem('token'); 
      if (token) {
          config.headers.Authorization = `Bearer ${token}`; 
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);

// Interceptar respostas para tratar erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.error(`Erro ${error.response.status}: ${error.response.data?.message || 'Acesso negado'}`);
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('userData');
      // Redirecionar para a rota correta de login ("/")
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);