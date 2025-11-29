import axios from "axios";

// Ajustamos el puerto a 7138 (HTTPS)
const API_URL = "https://localhost:7138/api/auth/register";

export async function registerUser(userData) {
  try {
    // userData trae: { username, email, password, role }
    // El backend suele pedir confirmPassword, así que lo duplicamos aquí si no viene
    const payload = {
        ...userData,
        confirmPassword: userData.password // Truco: enviamos la misma pass para que el backend no se queje
    };

    const response = await axios.post(API_URL, payload);

    return { data: response.data, error: null };

  } catch (err) {
    console.log("🔥 AXIOS ERROR:", err);
    return {
      data: null,
      error: {
        status: err.response?.status,
        message: err.response?.data?.message || "Error en el registro"
      }
    };
  }
}