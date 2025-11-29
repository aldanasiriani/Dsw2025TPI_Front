import React, { createContext, useState, useEffect, useContext } from 'react';

// 1. Crear el contexto
const CartContext = createContext();

// 2. Crear el Provider
export const CartProvider = ({ children }) => {
  // Inicializar estado leyendo de localStorage (Requisito PDF )
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
      // Verificar si ya existe para sumar cantidad
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      } else {
        // Agregar nuevo ítem con los campos necesarios para la Orden (PDF [cite: 279])
        return [...prevCart, { 
            productId: product.id, // O product.productId según tu backend
            name: product.name,
            unitPrice: product.currentUnitPrice,
            quantity: quantity 
        }];
      }
    });
  };

  const removeFromCart = (productId) => {
      setCart(prevCart => prevCart.filter(item => item.productId !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para usarlo rápido
export const useCart = () => useContext(CartContext);