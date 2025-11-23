// Archivo: src/modules/auth/components/ProductCard.jsx
import React, { useState } from 'react';
import '../shared/ProductCard.css'; // Solo necesita sus estilos propios

function ProductCard({ title, price, isWide }) {
  const [quantity, setQuantity] = useState(0);

  const handleDecrease = () => {
    if (quantity > 0) setQuantity(quantity - 1);
  };

  const handleIncrease = () => setQuantity(quantity + 1);

  return (
    <div className={`product-card ${isWide ? 'card-wide' : ''}`}>
      
      {/* Imagen Gris */}
      <div className="card-image-placeholder">
        <span className="image-icon">📷</span> 
      </div>

      {/* Información */}
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        
        <div className="card-footer">
          <span className="card-price">${price}</span>

          <div className="card-controls">
            <div className="quantity-selector">
              <button onClick={handleDecrease}>-</button>
              <span>{quantity}</span>
              <button onClick={handleIncrease}>+</button>
            </div>
            <button className="btn-add">Agregar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;