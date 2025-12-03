import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../shared/dashboard.css'; // Asegúrate de importar donde pusiste el header
import '../shared/home.css';      // 💡 Importamos los estilos nuevos
import { createOrder } from '../services/orderService'; 
import { FaShoppingCart, FaTrash } from 'react-icons/fa'; 

const CartPage = () => {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false); 
  const [stockErrors, setStockErrors] = useState({}); 
  const [shippingAddress, setShippingAddress] = useState("");
  const [billingAddress, setBillingAddress] = useState("");

  const calculateTotal = () => {
    const total = cart.reduce((acc, item) => {
        const precio = parseFloat(item.currentUnitPrice) || 0;
        const cantidad = parseInt(item.quantity) || 1;
        return acc + (precio * cantidad);
    }, 0);
    return total.toFixed(2); 
  };

  const handleIncrease = (item) => {
     if (item.stockQuantity && item.quantity >= item.stockQuantity) {
          alert(`¡Ups! Solo hay ${item.stockQuantity} unidades disponibles.`);
          return; // Detenemos la función aquí
      }
      updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = (item) => {
      if (item.quantity > 1) {
          updateQuantity(item.id, item.quantity - 1);
      }
  };

  const handleFinalizePurchase = async () => {
      const token = localStorage.getItem('token');
      setStockErrors({}); 

      if (!token) {
          if(window.confirm("Necesitas iniciar sesión para finalizar. ¿Ir al login?")) navigate('/login');
          return;
      }
      if (!shippingAddress.trim()) { alert("Falta la dirección de envío"); return; }

      try {
        setIsProcessing(true); 
        await createOrder(cart, shippingAddress, billingAddress);
        alert("¡Compra realizada con éxito!");
        clearCart(); 
        navigate('/products'); 
      } catch (error) {
         console.error(error);
         alert("Error: " + error.message);
      } finally {
        setIsProcessing(false); 
      }
  };

  return (
    <div className="customer-page-container">
      
      {/* HEADER (Usa estilos de site-header en home.css) */}
      <header className="site-header">
       <div className="header-brand" onClick={() => navigate('/products')}>
            <FaShoppingCart className="header-logo-icon" />
            <h1 className="header-title">Mi Carrito</h1>
        </div>
        <div className="header-actions">
            <button className="header-btn btn-seguir" onClick={() => navigate('/products')}>
                Seguir Comprando
            </button>
        </div>
      </header>

      <main className="dashboard-main-content">
      
        {cart.length === 0 ? (
          <div className="cart-empty-state">
            <h3>Tu carrito está vacío 🛒</h3>
            <p>¡Agrega algunos productos para empezar!</p>
          </div>
        ) : (
          <div className="cart-layout-grid">
            
            {/* --- LISTA DE ITEMS --- */}
            <div className="cart-list-section">
              {cart.map((item) => {
                const unitPrice = parseFloat(item.currentUnitPrice) || 0;
                const qty = item.quantity || 1;
                const subtotal = (unitPrice * qty).toFixed(2);
                const errorMessage = stockErrors[item.id]; 

                return (
                    <div key={item.id} className={`cart-item-card ${errorMessage ? 'has-error' : ''}`}>
                    
                        {/* Info Izquierda */}
                        <div className="cart-info-container">
                            <h3 className="cart-product-title">{item.name}</h3>
                            <p className="cart-product-price">Precio unitario: ${unitPrice}</p>
                            {errorMessage && <p className="cart-error-msg">⚠️ {errorMessage}</p>}
                        </div>

                        {/* Botones Cantidad */}
                        <div className="cart-qty-selector">
                            <button className="cart-qty-btn" onClick={() => handleDecrease(item)}>−</button>
                            <span className="cart-qty-value">{qty}</span>
                            <button className="cart-qty-btn" onClick={() => handleIncrease(item)}>+</button>
                        </div>

                        {/* Info Derecha (Subtotal + Borrar) */}
                        <div className="cart-actions-container">
                            <p className="cart-item-subtotal">${subtotal}</p>
                            <button className="cart-btn-delete" onClick={() => removeFromCart(item.id)}>
                                <FaTrash /> Eliminar
                            </button>
                        </div>
                    </div>
                );
              })}
              
              <div className="cart-footer-actions">
                  <button className="cart-btn-clear" onClick={clearCart}>
                    Vaciar Carrito Completamente
                  </button>
              </div>
            </div>

            {/* --- RESUMEN DE COMPRA --- */}
            <div className="cart-summary-section">
              <div className="cart-summary-card">
                <h3 className="cart-summary-title">Resumen del Pedido</h3>
                <hr className="cart-divider" />
                
                <div className="cart-input-group">
                    <label className="cart-input-label">Dirección de Envío:</label>
                    <input 
                        type="text" 
                        className="cart-input-field"
                        placeholder="Calle 123, Ciudad"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                    />
                </div>

                <div className="cart-input-group">
                    <label className="cart-input-label">Dirección de Cobro:</label>
                    <input 
                        type="text" 
                        className="cart-input-field"
                        placeholder="Igual a envío..."
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                    />
                </div>

                <div className="cart-total-row">
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
                
                <button 
                  className="cart-btn-checkout" 
                  onClick={handleFinalizePurchase} 
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar Compra'}
                </button>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
};

export default CartPage;