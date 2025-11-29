import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../shared/ProductCard.css';
import '../shared/dashboard.css';
import api from '../services/api'; // Importamos la conexión al backend

function Catalog() {
  // 1. Empezamos con la lista vacía
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  // 2. Cuando carga la página, pedimos los datos al Backend
  useEffect(() => {
    api.get('/products')
      .then(response => {
        console.log("¡Datos recibidos del Backend!", response.data);
        setProducts(response.data); // Guardamos los datos reales (Zapatillas, Mate...)
      })
      .catch(err => {
        console.error("Error conectando:", err);
        setError("No se pudieron cargar los productos. Revisa que el backend esté corriendo.");
      });
  }, []);

  return (
    <div className="catalog-container">
      <h2 style={{ marginBottom: '20px' }}>Nuestros Productos</h2>
      
      {/* Mensaje de error si falla */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="products-grid">
        {/* Si la lista está vacía y no hay error, mostramos 'Cargando...' */}
        {products.length === 0 && !error && <p>Cargando catálogo...</p>}

        {/* Mapeamos los productos REALES */}
        {products.map(prod => (
          <ProductCard 
            key={prod.id} 
            id={prod.id}
            title={prod.name}             // En tu DB se llama 'name'
            price={prod.currentUnitPrice} // En tu DB se llama 'currentUnitPrice'
            // Puedes pasar el stock si quieres mostrarlo
            stock={prod.stockQuantity}
          />
        ))}
      </div>
    </div>
  );
}

export default Catalog;