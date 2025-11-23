// Archivo: src/modules/auth/components/Catalog.jsx
import React from 'react';
import ProductCard from './ProductCard';
 // <--- Esta es la línea que daba el error rojo
import '../shared/ProductCard.css';
import '../shared/dashboard.css';

function Catalog() {
  const products = [
    { id: 1, title: "Camiseta Base", price: 20 },
    { id: 2, title: "Pantalón Jean", price: 45 },
    { id: 3, title: "Zapatillas", price: 80 },
    { id: 4, title: "Gorra", price: 15 },
  ];

  return (
    <div className="catalog-container">
      <h2 style={{ marginBottom: '20px' }}>Nuestros Productos</h2>
      
      <div className="products-grid">
        {products.map(prod => (
          <ProductCard key={prod.id} title={prod.title} price={prod.price} />
        ))}

        <ProductCard title="Pack Completo Verano" price={120} isWide={true} />
        <ProductCard title="Colección Invierno" price={150} isWide={true} />
      </div>
    </div>
  );
}

export default Catalog;