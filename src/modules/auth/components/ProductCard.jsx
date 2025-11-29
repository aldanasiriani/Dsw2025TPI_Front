// Archivo: src/modules/auth/components/ProductCard.jsx
import React, { useState } from 'react';
import '../shared/ProductCard.css'; // Solo necesita sus estilos propios
import { useCart } from '../../../context/CartContext';


function ProductCard({id, title, price, isWide }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart(); //esto agregue camila
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => setQuantity(quantity + 1);

// de aca hasta el return agrege camila
  // 4. Función para el botón
  const handleAddToCart = () => {
    const productToAdd = {
        id: id,
        name: title,
        currentUnitPrice: price
    };
    addToCart(productToAdd, quantity);
    alert(`Se agregaron ${quantity} unidades de ${title} al carrito`);
  };


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
            <button className="btn-add" onClick={handleAddToCart}> 
              Agregar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;