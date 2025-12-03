// services/productService.js
// Asegúrate de usar el puerto HTTPS correcto (7138 según vimos antes)
// src/modules/auth/services/product.js

// Ajusta el puerto si es necesario (7138 HTTPS)
const API_URL = 'https://localhost:7138/api/products'; 

// --- FUNCIÓN 1: OBTENER PRODUCTOS (Paginación) ---
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

    // CORRECCIÓN: Leemos el error real en vez de llamar a parseError
    if (!response.ok) {
        const errorText = await response.text(); // Leemos el mensaje del backend
        throw new Error(errorText || 'Error al crear el producto');
    }

    return await response.json();
};

// --- FUNCIÓN 3: ACTUALIZAR PRODUCTO ---
export const updateProduct = async (id, productData) => {
    const token = localStorage.getItem('token'); 

    const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(productData)
    });

    // CORRECCIÓN: Leemos el error real en vez de llamar a parseError
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al actualizar el producto');
    }

    return await response.json();
};

// --- FUNCIÓN 4: CAMBIAR ESTADO (Activar/Desactivar) ---
// (Agrego esta porque la usas en el Dashboard para el botón Toggle)
export const toggleProductStatus = async (id, isActive) => {
    const token = localStorage.getItem('token'); 
    
    // Si está activo -> llamamos a 'disable'. Si no -> llamamos a 'enable'
    const action = isActive ? 'disable' : 'enable';

    const response = await fetch(`${API_URL}/${id}/${action}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        }
    });

    if (!response.ok) {
        throw new Error(`Error al cambiar el estado a ${action}`);
    }
    
    return true;
};