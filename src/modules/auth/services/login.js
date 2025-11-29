import { frontendErrorMessage } from '../helpers/backendError';
// 1. Importamos tu instancia segura que ya apunta a https://localhost:7138/api
import api from './api'; 

export const login = async (username, password) => {
  try {
    // 2. Usamos api.post en lugar de fetch.
    // Esto asegura que la petición viaje encriptada por HTTPS al puerto correcto.
    const response = await api.post('/auth/login', { 
      username, 
      password 
    });

    // 3. Extraemos el token de la respuesta
    const tokenData = response.data; // Axios ya nos da el JSON en .data

    // 4. IMPORTANTE PARA SEGURIDAD: Guardamos el token
    // El PDF pide gestión de sesiones[cite: 113]. Guardarlo aquí permite
    // que el 'interceptor' de api.js lo use para autenticar las siguientes peticiones.
    if (tokenData && tokenData.token) {
        localStorage.setItem('token', tokenData.token);
    }

    return { data: tokenData, error: null };

  } catch (error) {
    console.error("Error en login:", error);
    
    // Manejo de errores seguro
    const errorData = error.response?.data || {};
    return {
      data: null,
      error: {
        ...errorData,
        frontendErrorMessage: frontendErrorMessage[errorData.code] || 'Error de conexión con el servidor',
      },
    };
  }
};