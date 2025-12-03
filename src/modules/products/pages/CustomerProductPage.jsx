import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard'; 
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../../context/CartContext'; 
import api from '../../auth/services/api'; 
import '../../shared/dashboard.css'; 
import '../../shared/home.css'; // 💡 Aquí están los estilos del sidebar móvil

import { 
    FaStore, FaShoppingCart, FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes,
    FaMapMarkerAlt, FaEnvelope, FaPhone 
} from 'react-icons/fa'; 

const CustomerProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const { cart } = useCart(); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); 
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

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
    <div className="customer-page-container">
      
      {/* --- HEADER --- */}
      <header className="site-header">
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* 💡 CORRECCIÓN: Usamos la clase 'customer-menu-btn' del home.css */}
            <button className="customer-menu-btn" onClick={toggleSidebar}>
                <FaBars />
            </button>

            <div className="header-brand" onClick={() => { setSearchTerm(""); navigate('/'); }} >
                <FaStore className="header-logo-icon"  />
                <h1 className="header-title">Mi Tienda Real</h1>
            </div>
        </div>

        <div className="header-search-container">
            <input 
                type="text" 
                className="header-search-input"
                placeholder="🔍 Buscar productos..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

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

     {/* --- SIDEBAR MÓVIL --- */}
      <aside className={`customer-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
              {/* 💡 CAMBIO AQUÍ: Quitamos el style={{...}} inline */}
              <h2 className="sidebar-title">Menú</h2>
              
              <button className="btn-close-sidebar" onClick={toggleSidebar}>
                  <FaTimes />
              </button>
          </div>

          <nav className="sidebar-nav">
              {/* ... el resto de los botones sigue igual ... */}
              <button onClick={() => { navigate('/'); toggleSidebar(); }} className="sidebar-link active">
                  <FaStore /> Inicio
              </button>
              
              <button onClick={() => { navigate('/cart'); toggleSidebar(); }} className="sidebar-link">
                  <FaShoppingCart /> Ver Carrito <span style={{fontWeight:'bold', marginLeft:'auto'}}>({cart.length})</span>
              </button>

              <div className="sidebar-divider"></div>
              {/* ... resto del código ... */}

              <div className="sidebar-divider"></div>

              {isLoggedIn ? (
                  <button onClick={handleLogout} className="sidebar-link logout">
                      <FaSignOutAlt /> Cerrar Sesión
                  </button>
              ) : (
                  <>
                      <button onClick={() => { navigate('/login'); toggleSidebar(); }} className="sidebar-link">
                          <FaSignInAlt /> Iniciar Sesión
                      </button>
                      <button onClick={() => { navigate('/register'); toggleSidebar(); }} className="sidebar-link">
                          <FaUserPlus /> Registrarse
                      </button>
                  </>
              )}
          </nav>
      </aside>

      {/* OVERLAY */}
      {isSidebarOpen && <div className="customer-overlay" onClick={toggleSidebar}></div>}


      {/* --- MAIN CONTENT --- */}
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

      {/* --- FOOTER INTEGRADO --- */}
      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Mi Tienda Real</h3>
            <p>
              Ofrecemos los mejores productos con la mejor calidad del mercado. 
              Comprometidos con la satisfacción de nuestros clientes desde 2025.
            </p>
          </div>
          <div className="footer-section">
            <h3>Contáctanos</h3>
            <ul className="footer-links">
              <li><FaMapMarkerAlt style={{ marginRight: '8px' }} /> Rivadavia 1050, Tucumán</li>
              <li><FaPhone style={{ marginRight: '8px' }} /> +54 9 381 123 4567</li>
              <li><FaEnvelope style={{ marginRight: '8px' }} /> contacto@mitiendareal.com</li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; {new Date().getFullYear()} Mi Tienda Real. Todos los derechos reservados.
        </div>
      </footer>
      
    </div>
  );
};

export default CustomerProductPage;