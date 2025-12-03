// Archivo: src/modules/auth/components/ProductCard.jsx

import React, { useState, useEffect } from 'react';
import '../shared/ProductCard.css'; // Solo necesita sus estilos propios
import { useCart } from '../../../context/CartContext';

function ProductCard({ id, title, price, stock, isWide }) {

  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart(); 
  
  // 1. Estado para mostrar la notificación
  const [showToast, setShowToast] = useState(false);

  // 2. Efecto que oculta la notificación a los 3 segundos
  useEffect(() => {
    if (showToast) {
        const timer = setTimeout(() => setShowToast(false), 3000); 
        return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleDecrease = () => { 
    if (quantity > 1) setQuantity(quantity - 1); 
  };

  const handleIncrease = () => { 
    if (quantity < stock) setQuantity(quantity + 1); 
  };

  const handleAddToCart = () => {
    const productToAdd = {
        id: id,
        name: title,
        currentUnitPrice: parseFloat(price),
        stockQuantity: stock
    };
    
   addToCart(productToAdd, quantity);
    setShowToast(true);
  };

  const isOutOfStock = stock === 0;

  return (
    <>
        {/* Notificación Flotante (Solo se ve si showToast es true) */}
        {showToast && (
            <div className="simple-toast">
                ✅ ¡Agregado al carrito!
            </div>
        )}

        <div className={`product-card ${isWide ? 'card-wide' : ''}`} style={{ opacity: isOutOfStock ? 0.6 : 1 }}>
            
            <div className="card-image-placeholder">
                <span className="image-icon">📷</span> 
            </div>

            <div className="card-info">
                <h3 className="card-title">{title}</h3>
                
                {/* Stock */}
                <div style={{ fontSize: '0.85rem', marginBottom: '10px' }}>
                    {isOutOfStock ? (
                        <span style={{ color: '#ef4444', fontWeight: 'bold' }}>🚫 Agotado</span>
                    ) : (
                        <span style={{ color: stock < 5 ? '#eab308' : '#22c55e' }}>
                            {stock < 5 ? `¡Solo quedan ${stock}!` : `Stock disponible: ${stock}`}
                        </span>
                    )}
                </div>

                <div className="card-footer">
                    <span className="card-price">${price}</span>

                    {!isOutOfStock ? (
                        <div className="card-controls">
                            <div className="quantity-selector">
                                <button onClick={handleDecrease}>-</button>
                                <span>{quantity}</span>
                                <button onClick={handleIncrease} disabled={quantity >= stock}>+</button>
                            </div>
                            <button className="btn-add" onClick={handleAddToCart}>Agregar</button>
                        </div>
                    ) : (
                        <button disabled style={{ background: '#d1d5db', color: '#666', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'not-allowed', width: '100%' }}>
                            Sin Stock
                        </button>
                    )}
                </div>
            </div>
        </div>
    </>
  );
}

export default ProductCard;