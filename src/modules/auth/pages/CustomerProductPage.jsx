import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; 
import api from '../services/api'; 
import '../shared/dashboard.css'; 
import Footer from '../components/Footer';
import { FaStore, FaShoppingCart, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa'; // Iconos para el header
import '../shared/Header.css'; // Importamos los estilos nuevos del Header


const CustomerProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  
  const navigate = useNavigate();
  const { cart } = useCart(); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); 
  };

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

  const filteredProducts = products.filter((product) => {
    if (!searchTerm) return true;
    const name = (product.name || "").toLowerCase();
    const search = searchTerm.toLowerCase();
    return name.includes(search);
  });

  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="customer-page-container" style={{ minHeight: '100vh', background: '#f3f4f6', display: 'flex', flexDirection: 'column' }}>
      
      {/* --- HEADER NUEVO Y PROFESIONAL --- */}
      <header className="site-header">
        
        {/* 1. LOGO Y MARCA (Izquierda) */}
        <div className="header-brand" onClick={() => { setSearchTerm(""); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            {/* Icono */}
            <FaStore className="header-logo-icon" style={{ fontSize: '2rem', color: '#646cff' }} />
            
            {/* Texto "Mi Tienda Real" CON ESTILOS PARA QUE SE VEA */}
            <h1 className="header-title" style={{ 
                margin: '0 0 0 10px', 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#e5e7eb',    // Color blanco/gris claro para que resalte en el fondo oscuro
                whiteSpace: 'nowrap' // Evita que el texto se baje de línea
            }}>
                Mi Tienda Real
            </h1>
        </div>



        {/* 2. BUSCADOR CENTRAL (Grande tipo MercadoLibre) */}
        <div className="header-search-container">
            <input 
                type="text" 
                className="header-search-input"
                placeholder="🔍 Buscar productos, marcas y más..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/* 3. ACCIONES (Derecha) */}
        <div className="header-actions">
            <button className="header-btn btn-cart" onClick={() => navigate('/cart')}>
                <FaShoppingCart /> Carrito ({cart.length})
            </button>
            
            {isLoggedIn ? (
                <button className="header-btn btn-logout" onClick={handleLogout}>
                    <FaSignOutAlt /> Salir
                </button>
            ) : (
                <>
                    <button className="header-btn btn-login" onClick={() => navigate('/login')}>
                        <FaSignInAlt /> Ingresar
                    </button>
                    <button className="header-btn btn-register" onClick={() => navigate('/register')}>
                        <FaUserPlus /> Registro
                    </button>
                </>
            )}
        </div>
      </header>
      {/* ---------------------------------- */}


      <main style={{ padding: '40px 30px', maxWidth: '1200px', margin: '0 auto', width: '100%', flex: '1' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h2 style={{ color: '#1f2937', margin: 0, fontSize: '1.8rem' }}>Nuestros Productos</h2>
            {searchTerm && <p style={{color: '#666'}}>Encontrados: {filteredProducts.length}</p>}
        </div>

        {loading ? (
            <div style={{textAlign: 'center', marginTop: '50px', fontSize: '1.2rem', color: '#666'}}>Cargando catálogo...</div>
        ) : (
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                gap: '30px' 
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
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '50px', background: '#fff', borderRadius: '10px' }}>
                        <h3>😕 No encontramos nada con "{searchTerm}"</h3>
                        <p>Intenta verificar la ortografía o usar términos más genéricos.</p>
                    </div>
                )}
            </div>
        )}
      </main>

      <Footer />
      
    </div>
  );
};

export default CustomerProductPage;