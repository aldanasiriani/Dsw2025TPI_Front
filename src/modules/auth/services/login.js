import axios from "axios";

// IMPORTANTE: Usamos el puerto HTTPS (7138) que ya sabemos que funciona
const API_URL = "https://localhost:7138/api/auth/login";

export async function login(credentials) {
  // credentials trae { username, password } desde el formulario
  try {
    const response = await axios.post(API_URL, credentials);
    
    // Devolvemos la data limpia
    return { data: response.data, error: null };

  } catch (err) {
    console.error("🔥 Error en Login:", err);
    
    // Devolvemos el error formateado
    return {
      data: null,
      error: {
        status: err.response?.status,
        message: err.response?.data || "Error al conectar con el servidor"
      }
    };
  }
}