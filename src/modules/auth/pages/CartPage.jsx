import React from 'react';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../shared/dashboard.css';

const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  // Función corregida para calcular el total
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.currentUnitPrice * (item.quantity || 1)), 0);
  };

  return (
    <div className="dashboard-grid-container" style={{ display: 'block', minHeight: '100vh' }}>
      
      {/* HEADER */}
      <header className="dashboard-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 className="header-title" style={{cursor:'pointer'}} onClick={() => navigate('/')}>Mi Tienda</h1>
        <button className="product-button" onClick={() => navigate('/')}>Seguir Comprando</button>
      </header>

      <main className="dashboard-main-content" style={{ padding: '20px' }}>
        <h2 style={{ marginBottom: '20px' }}>Tu Carrito de Compras</h2>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h3>Tu carrito está vacío 🛒</h3>
            <p>¡Agrega algunos productos para empezar!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            
            {/* LISTA DE ITEMS */}
            <div style={{ flex: 2, minWidth: '300px' }}>
              {cart.map((item) => (
                <div key={item.id} className="content-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 className="card-title"><strong>{item.name}</strong></h3>
                    <p className="card-text">Precio unitario: ${item.currentUnitPrice}</p>
                    <p className="card-text">Cantidad: {item.quantity || 1}</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>
                      ${item.currentUnitPrice * (item.quantity || 1)}
                    </p>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={clearCart} 
                style={{ marginTop: '10px', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}
              >
                Vaciar Carrito
              </button>
            </div>

            {/* RESUMEN DE COMPRA (Checkout) */}
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div className="content-message" style={{ borderLeft: '5px solid #10b981' }}>
                <h3 className="card-title"><strong>Resumen del Pedido</strong></h3>
                <hr style={{ margin: '10px 0', borderColor: '#eee' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span>Productos:</span>
                  <span>{cart.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.5em', fontWeight: 'bold' }}>
                  <span>Total:</span>
                  <span>${calculateTotal()}</span>
                </div>
                
                <button 
                  className="product-button" 
                  style={{ width: '100%', marginTop: '20px', fontSize: '1.1em', justifyContent: 'center' }}
                  onClick={() => alert("¡Próximamente conexión con API de Órdenes!")}
                >
                  Finalizar Compra
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