import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; 
import api from '../services/api'; 
import '../shared/dashboard.css'; 


const CustomerProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const navigate = useNavigate();
  const { cart } = useCart(); 

  // --- 1. FUNCIÓN PARA CERRAR SESIÓN ---
  const handleLogout = () => {
    // Borramos el token
    localStorage.removeItem('token');
    // Opcional: Si quieres vaciar el carrito visualmente al salir
    // localStorage.removeItem('cart'); 
    
    // Recargamos la página para que actualice los botones (o redirigimos al login)
    window.location.reload(); 
  };

  // --- CARGAR PRODUCTOS ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products'); 
        
        if (response.data && response.data.items) {
             setProducts(response.data.items);
        } else if (Array.isArray(response.data)) {
             setProducts(response.data);
        } else {
             setProducts([]);
        }
      } catch (error) {
        console.error("Error cargando productos", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --- FILTRADO ---
  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const name = (product.name || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search);
  });

  // Verificamos si hay usuario logueado
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="customer-page-container" style={{ minHeight: '100vh', background: '#f9f9f9' }}>
      
      {/* --- HEADER --- */}
      <header style={{ 
          background: '#fff', 
          padding: '15px 30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
      }}>
        <h1 
            style={{ margin: 0, fontSize: '1.5rem', color: '#333', cursor: 'pointer' }}
            onClick={() => { setSearchTerm(""); navigate('/'); }} 
        >
            Mi Tienda Real
        </h1>

        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', margin: '0 20px' }}>
            <input 
                type="text" 
                placeholder="🔍 Buscar producto..." 
                style={{
                    padding: '10px 15px',
                    width: '100%',
                    maxWidth: '400px',
                    borderRadius: '20px',
                    border: '1px solid #ddd',
                    background: '#f5f5f5',
                    outline: 'none'
                }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* --- ZONA DE BOTONES --- */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button 
                className="product-button" 
                style={{ background: '#333', color: '#fff' }} 
                onClick={() => navigate('/cart')}
            >
                🛒 Ver Carrito ({cart.length})
            </button>
            
            {/* 2. CONDICIONAL: ¿Está logueado? */}
            {isLoggedIn ? (
                <button 
                    className="product-button" 
                    style={{ background: '#ef4444', color: '#fff', border: 'none' }} // Rojo para salir
                    onClick={handleLogout}
                >
                    Cerrar Sesión
                </button>
            ) : (
                <>
                    <button className="product-button" style={{background: 'transparent', color: '#333', border: '1px solid #333'}} onClick={() => navigate('/login')}>
                        Iniciar Sesión
                    </button>
                    <button className="product-button" style={{background: '#e5e7eb', color: '#333'}} onClick={() => navigate('/register')}>
                        Registrarse
                    </button>
                </>
            )}
        </div>
      </header>

      {/* --- MAIN --- */}
      <main style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ color: '#444', margin: 0 }}>Nuestros Productos</h2>
            {searchTerm && <p style={{color: '#666'}}>Encontrados: {filteredProducts.length}</p>}
        </div>

        {loading ? (
            <p style={{textAlign: 'center', marginTop: '50px'}}>Cargando catálogo...</p>
        ) : (
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                gap: '25px' 
            }}>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((prod) => (
                        <ProductCard 
                            key={prod.id} 
                            id={prod.id}
                            title={prod.name}
                            price={prod.currentUnitPrice}
                            stock={prod.stockQuantity}
                            isWide={false}
                        />
                    ))
                ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px' }}>
                        <h3>😕 No encontramos nada con "{searchTerm}"</h3>
                        <p>Intenta con otra palabra.</p>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
};

export default CustomerProductPage;