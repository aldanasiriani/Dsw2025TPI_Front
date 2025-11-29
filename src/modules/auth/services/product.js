// services/productService.js
// Asegúrate de usar el puerto HTTPS correcto (7138 según vimos antes)
const API_URL = 'https://localhost:7138/api/products'; 

// --- FUNCIÓN 1: OBTENER PRODUCTOS (Paginación) ---
// Esta la usa el Dashboard
export const getProducts = async (page = 1, limit = 10) => {
    const token = localStorage.getItem('token');
    
    // Construimos la URL con los parámetros ?page=1&limit=10
    const url = `${API_URL}?page=${page}&limit=${limit}`;

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error('Error al cargar productos');
    }

    return await response.json(); 
};

// --- FUNCIÓN 2: CREAR PRODUCTO ---
// Esta la usa el CreateProductForm (¡Esta es la que te faltaba!)
export const createProduct = async (productData) => {
    const token = localStorage.getItem('token'); 

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(productData)
    });

    if (!response.ok) {
        if (response.status === 401) throw new Error("No autorizado.");
        
        const errorData = await response.text();
        throw new Error(errorData || 'Error al crear el producto');
    }

    return await response.json();
};