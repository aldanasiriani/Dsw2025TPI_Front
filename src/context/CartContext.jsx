import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Crear el contexto
const CartContext = createContext();

// 2. Crear el Provider
export const CartProvider = ({ children }) => {
  
  // Inicializar estado leyendo de localStorage
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  // Guardar en localStorage cada vez que el carrito cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Función para agregar productos
  const addToCart = (product, quantity) => {
    setCart(prevCart => {
      // Usamos 'id' consistentemente para buscar
      const existingItem = prevCart.find(item => item.id === product.id);
      
    if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        return [...prevCart, { 
            id: product.id, 
            name: product.name,
            currentUnitPrice: parseFloat(product.currentUnitPrice),
            stockQuantity: product.stockQuantity, // <--- ¡AGREGAR ESTA LÍNEA!
            quantity: quantity
        }];
      }
    });
  };

  // CORRECCIÓN: Filtramos por 'id' para que el botón eliminar funcione
  const removeFromCart = (productId) => {
      setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => setCart([]);
// Función para actualizar cantidad directamente
const updateQuantity = (id, newQuantity) => {
    setCart((prevCart) => {
        return prevCart.map((item) => {
            if (item.id === id) {
                // Evitamos que baje de 1
                return { ...item, quantity: Math.max(1, newQuantity) }; 
            }
            return item;
        });
    });
};
  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity}}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado
export const useCart = () => useContext(CartContext);