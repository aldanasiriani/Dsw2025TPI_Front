import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import '../shared/ProductCard.css';
import '../shared/dashboard.css';
import api from '../services/api'; 

function Catalog() {
  // 1. Estados
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // NUEVO: Estado del buscador

  // 2. Carga de datos
  useEffect(() => {
    api.get('/products')
      .then(response => {
        console.log("¡Datos recibidos!", response.data);
        // Protección: Si viene paginado (.items) o si viene lista directa
        if (response.data && response.data.items) {
             setProducts(response.data.items);
        } else if (Array.isArray(response.data)) {
             setProducts(response.data);
        } else {
             setProducts([]);
        }
      })
      .catch(err => {
        console.error("Error conectando:", err);
        setError("No se pudieron cargar los productos.");
      });
  }, []);

  // 3. LÓGICA DE FILTRADO (Aquí ocurre la magia)
  const filteredProducts = products.filter((prod) => {
      // Si no hay busqueda, devuelve todo. Si hay, filtra por nombre.
      if (!searchTerm) return true;
      const nombreProducto = (prod.name || "").toLowerCase();
      const terminoBusqueda = searchTerm.toLowerCase();
      return nombreProducto.includes(terminoBusqueda);
  });

  return (
    <div className="catalog-container">
      
      {/* CABECERA CON BUSCADOR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
          <h2>Nuestros Productos</h2>
          
          {/* INPUT DEL BUSCADOR */}
          <input 
            type="text"
            placeholder="🔍 Buscar producto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
                padding: '10px',
                width: '100%',
                maxWidth: '300px',
                borderRadius: '8px',
                border: '1px solid #ccc',
                fontSize: '1rem'
            }}
          />
      </div>
      
      {/* MENSAJES DE ERROR O CARGA */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {products.length === 0 && !error && <p>Cargando catálogo...</p>}

      <div className="products-grid">
        {/* 4. RENDERIZADO: Usamos filteredProducts en vez de products */}
        {filteredProducts.length > 0 ? (
            filteredProducts.map(prod => (
            <ProductCard 
                key={prod.id} 
                id={prod.id}
                title={prod.name}            
                price={prod.currentUnitPrice} 
                stock={prod.stockQuantity}
            />
            ))
        ) : (
            // Mensaje si la búsqueda no encuentra nada
            !error && products.length > 0 && (
                <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '20px' }}>
                    No se encontraron productos con ese nombre.
                </p>
            )
        )}
      </div>
    </div>
  );
}

export default Catalog;