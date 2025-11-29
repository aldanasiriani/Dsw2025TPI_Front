import React from 'react';
import Catalog from '../components/Catalog'; // <--- Importamos el componente que lee la API
import '../shared/dashboard.css';
import { useNavigate } from 'react-router-dom';

function CustomerProductPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-grid-container" style={{ display: 'block' }}> 
      
      {/* HEADER */}
      <header className="dashboard-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 className="header-title">Mi Tienda Real</h1>
        <button 
            className="product-button" 
                style={{ background: '#ddd' }}
            onClick={() => navigate('/cart')}
        >
    🛒 Ver Carrito
</button>
        
        <input 
            type="text" 
            placeholder="Buscar producto..." 
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', width: '300px' }}
        />

        <div>
            <button 
                className="product-button" 
                style={{ marginRight: '10px' }}
                onClick={() => navigate('/login')}
            >
                Iniciar Sesión
            </button>
            <button 
                className="product-button" 
                style={{ background: '#ddd' }}
                onClick={() => navigate('/register')}
            >
                Registrarse
            </button>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="dashboard-main-content" style={{ marginTop: '0' }}>
        
        {/* AQUÍ ESTÁ EL CAMBIO: Usamos <Catalog /> en lugar de la lista manual */}
        <Catalog />

      </main>
    </div>
  );
}

export default CustomerProductPage;