// src/modules/auth/pages/CustomerProductPage.jsx
// Archivo: src/modules/auth/pages/CustomerProductPage.jsx
import React from 'react';
import ProductCard from '../components/ProductCard'; // Importamos la tarjeta
import '../shared/dashboard.css'; // Reutilizamos estilos generales

function CustomerProductPage() {
  
  // Datos de ejemplo (luego vendrán de tu base de datos)
  const products = [
    { id: 1, title: "Camiseta Base", price: 20 },
    { id: 2, title: "Pantalón Jean", price: 45 },
    { id: 3, title: "Zapatillas", price: 80 },
    { id: 4, title: "Gorra", price: 15 },
    { id: 5, title: "Bufanda", price: 10 },
     { id: 5, title: "Bufandi", price: 10 },
  ];

  return (
    <div className="dashboard-grid-container" style={{ display: 'block' }}> 
      {/* Nota: Usamos display block temporalmente porque esta vista no tiene sidebar lateral fijo */}

      {/* --- HEADER (Barra de arriba) --- */}
      <header className="dashboard-header" style={{ position: 'sticky', top: 0, zIndex: 100 }}>
        <h1 className="header-title">Mi Tienda</h1>
        
        {/* Un buscador simple */}
        <input 
            type="text" 
            placeholder="Search..." 
            style={{ padding: '8px', borderRadius: '8px', border: '1px solid #ccc', width: '300px' }}
        />

        <div>
            <button className="product-button" style={{ marginRight: '10px' }}>Iniciar Sesión</button>
            <button className="product-button" style={{ background: '#ddd' }}>Registrarse</button>
        </div>
      </header>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="dashboard-main-content" style={{ marginTop: '0' }}>
        
        <h2 style={{ marginBottom: '20px', color: '#333' }}>Nuestros Productos</h2>

        {/* AQUÍ ESTÁ LA MAGIA: El contenedor de la grilla */}
        <div className="products-grid">
            
            {/* Dibujamos las tarjetas usando map */}
            {products.map(producto => (
                <ProductCard 
                    key={producto.id} 
                    title={producto.title} 
                    price={producto.price} 
                />
            ))}

            {/* Tarjetas extra anchas de ejemplo */}
            <ProductCard title="Oferta de Verano" price={120} isWide={true} />
            
        </div>

      </main>
    </div>
  );
}

export default CustomerProductPage;