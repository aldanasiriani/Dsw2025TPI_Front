// src/modules/auth/services/orderService.js

const API_URL = 'https://localhost:7138/api/orders'; 

// Función auxiliar para decodificar el token y sacar el ID
const getUserIdFromToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(jsonPayload);
        
        // En .NET, el ID suele estar en "nameid" o "sub"
        // Buscamos las claims estándar de Microsoft o las genéricas
        return decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || 
               decoded["nameid"] || 
               decoded["sub"];
    } catch (e) {
        return null;
    }
};

export const createOrder = async (cartItems, shippingAddress, billingAddress) => {
    const token = localStorage.getItem('token');
    
    if (!token) throw new Error("No hay sesión iniciada.");

    // 1. Obtener el CustomerId desde el token
    const customerId = getUserIdFromToken(token);

    if (!customerId) {
        throw new Error("No se pudo identificar al usuario desde el token. Por favor inicia sesión nuevamente.");
    }

    // 2. Mapear los items (Igual que antes)
    const orderItems = cartItems.map(item => ({
        ProductId: item.id,
        Quantity: parseInt(item.quantity)
    }));

    // 3. Armar el DTO exacto que pide C#
    const payload = {
        CustomerId: customerId,        // Guid extraído del token
        ShippingAddress: shippingAddress, // String
        BillingAddress: billingAddress,   // String
        OrderItems: orderItems            // List<OrderItemResponseDto>
    };

    console.log("Enviando orden al Backend:", payload);

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        // Intentamos leer el error detallado del backend
        const errorText = await response.text();
        
        // A veces viene como JSON con campo "errors"
        try {
            const errorJson = JSON.parse(errorText);
            if(errorJson.errors) {
                // Unimos todos los errores en un texto
                const messages = Object.values(errorJson.errors).flat().join(", ");
                throw new Error(messages);
            }
        } catch(e) {
            // Si no es JSON, lanzamos el texto plano
            throw new Error(errorText || "Error al crear la orden");
        }
        throw new Error(errorText);
    }

    return await response.json();
};