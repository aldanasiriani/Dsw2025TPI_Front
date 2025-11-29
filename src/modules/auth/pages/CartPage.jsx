
import React, { useState } from 'react';
import { useCart } from '../../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../shared/dashboard.css';
import { createOrder } from '../services/orderService'; 


const CartPage = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false); 
  
  // --- NUEVOS ESTADOS PARA DIRECCIONES ---
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

  const handleFinalizePurchase = async () => {
    const token = localStorage.getItem('token');

    // Validación 1: Login
    if (!token) {
        const confirmLogin = window.confirm("Necesitas iniciar sesión para finalizar tu compra. ¿Quieres ir al Login?");
        if (confirmLogin) {
            navigate('/login', { state: { from: '/cart', role: 'client' } }); 
        }
        return;
    }

    // Validación 2: Direcciones (Requeridas por el Backend)
    if (!shippingAddress.trim() || !billingAddress.trim()) {
        alert("Por favor, completa las direcciones de envío y facturación.");
        return;
    }

    try {
        setIsProcessing(true); 
        
        // Llamamos al servicio pasando los nuevos datos
        await createOrder(cart, shippingAddress, billingAddress);
        
        alert("¡Compra realizada con éxito! Muchas gracias.");
        clearCart(); 
        navigate('/products'); 

    } catch (error) {
        console.error(error);
        alert("Error al procesar la compra: \n" + error.message);
    } finally {
        setIsProcessing(false); 
    }
  };

  return (
    <div className="dashboard-grid-container" style={{ display: 'block', minHeight: '100vh' }}>
      
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
            
            {/* IZQUIERDA: LISTA DE ITEMS */}
            <div style={{ flex: 2, minWidth: '300px' }}>
              {cart.map((item) => {
                const unitPrice = parseFloat(item.currentUnitPrice) || 0;
                const qty = item.quantity || 1;
                const subtotal = (unitPrice * qty).toFixed(2);

                return (
                    <div key={item.id} className="content-message" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 className="card-title"><strong>{item.name}</strong></h3>
                        <p className="card-text">Precio unitario: ${unitPrice}</p>
                        <p className="card-text">Cantidad: {qty}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 'bold', fontSize: '1.2em' }}>${subtotal}</p>
                        <button 
                        onClick={() => removeFromCart(item.id)}
                        style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', marginTop: '5px' }}
                        >
                        Eliminar
                        </button>
                    </div>
                    </div>
                );
              })}
              
              <button onClick={clearCart} style={{ marginTop: '10px', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
                Vaciar Carrito
              </button>
            </div>

            {/* DERECHA: RESUMEN Y DATOS */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div className="content-message" style={{ borderLeft: '5px solid #10b981' }}>
                <h3 className="card-title"><strong>Resumen del Pedido</strong></h3>
                <hr style={{ margin: '10px 0', borderColor: '#eee' }} />
                
                {/* --- INPUTS DE DIRECCIÓN --- */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>Dirección de Envío:</label>
                    <input 
                        type="text" 
                        placeholder="Calle 123, Ciudad"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '20px' }}>
                    <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>Dirección de Cobro:</label>
                    <input 
                        type="text" 
                        placeholder="Igual a envío..."
                        value={billingAddress}
                        onChange={(e) => setBillingAddress(e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>
                {/* ------------------------- */}

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
                  style={{ width: '100%', marginTop: '20px', fontSize: '1.1em', justifyContent: 'center', opacity: isProcessing ? 0.7 : 1 }}
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