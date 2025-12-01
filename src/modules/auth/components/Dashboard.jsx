 import React, { useState, useEffect } from 'react';
import '../shared/dashboard.css';
import CreateProductForm from './CreateProductForm'; 
import Pagination from './Pagination';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 


function Dashboard() {

    // --- ESTADOS ---
    const [activeSection, setActiveSection] = useState('Principal'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Inicializamos SIEMPRE como arrays vacíos para evitar crash
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState(""); 
    const [statusFilter, setStatusFilter] = useState("");
    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const pageSize = 5; // Debe coincidir con lo que espera tu Backend

    const navigate = useNavigate();

    // --- EFECTO DE CARGA DE DATOS ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. LOGICA DE PRODUCTOS
                if (activeSection === 'Productos' || activeSection === 'Principal') {
                    // Llamada al backend con paginación
                    
                    
                    // --- CAMBIO AQUÍ: URL DINÁMICA ---
                let url = `/products?page=${currentPage}&limit=${pageSize}`;
                
                if (searchTerm) {
                    url += `&name=${searchTerm}`;
                }
                
                if (statusFilter !== "") {
                    url += `&isActive=${statusFilter}`;
                }

                const response = await api.get(url);

                let items = [];
                let count = 0;

                // CASO A: Respuesta paginada estándar (.NET)
                if (response.data && Array.isArray(response.data.items)) {
                    items = response.data.items;
                    count = response.data.totalCount;
                } 
                // CASO B: Respuesta de array directo
                else if (Array.isArray(response.data)) {
                    items = response.data;
                    count = response.data.length; // Usamos el largo del array
                }

                setProducts(items);

                // Cálculo seguro de páginas
                const pages = Math.ceil(count / pageSize);
                setTotalPages(pages > 0 ? pages : 1);

                    console.log("Respuesta Backend Productos:", response.data);

                    // VERIFICACIÓN DE SEGURIDAD (Evita Pantalla Blanca)
                    if (response.data && Array.isArray(response.data.items)) {
                        // CASO A: El backend devolvió el formato nuevo { items: [], totalCount: 50 }
                        setProducts(response.data.items);
                        const calculated = Math.ceil(response.data.totalCount / pageSize);
                        setTotalPages(calculated > 0 ? calculated : 1);
                    } 
                    else if (Array.isArray(response.data)) {
                        // CASO B: El backend devolvió el formato antiguo (Array simple)
                        console.warn("Backend devolvió array simple. La paginación podría no ser exacta.");
                        setProducts(response.data);
                        setTotalPages(1);
                    } 
                    else {
                        // CASO C: Respuesta vacía o error
                        setProducts([]);
                        setTotalPages(1);
                    }
                }
                
                // 2. LOGICA DE ORDENES
                if (activeSection === 'Ordenes' || activeSection === 'Principal') {
                    try {
                        const response = await api.get('/orders');
                        // Verificación segura
                        setOrders(Array.isArray(response.data) ? response.data : []);
                    } catch (e) {
                        console.warn("No se pudieron cargar las ordenes", e);
                        setOrders([]); 
                    }
                }
                
            } catch (error) {
                console.error("Error crítico cargando datos:", error);
                // En caso de error, aseguramos que sigan siendo arrays para que el .map no explote
                setProducts([]); 
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeSection, currentPage, statusFilter]); // Se ejecuta al cambiar sección o página

    // --- HANDLERS ---
    const getSidebarItemClass = (sectionName) => {
        let isActive = activeSection === sectionName;
        if (sectionName === 'Productos' && activeSection === 'CrearProducto') isActive = true;
        return `sidebar-item ${isActive ? 'active' : ''}`;
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleNavigationClick = (section) => {
        setActiveSection(section);
        if(section === 'Productos') setCurrentPage(1); // Reset a pág 1
        if (window.innerWidth <= 768) setIsSidebarOpen(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Opcional: Scroll al top de la tabla
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('username'); 
        setProducts([]);
        setOrders([]);
        navigate('/', { replace: true });
    };

     // --- FILTRADO ---
  // ... dentro del componente Dashboard

// 1. Crear la lista filtrada
const filteredProducts = products.filter(prod => {
    if (!searchTerm) return true; // Si no hay búsqueda, mostrar todo
    const term = searchTerm.toLowerCase();
    return (
        prod.name?.toLowerCase().includes(term) || 
        prod.sku?.toLowerCase().includes(term)
    );
});





    // --- RENDERIZADO ---
    return(
        <div className="dashboard-grid-container">
        
        {/* HEADER */}
        <header className="dashboard-header">
            <button className="menu-toggle-button" onClick={toggleSidebar}>☰</button>
            <h1 className="header-title">Panel Admin</h1>
            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
        </header>
        
        {/* SIDEBAR */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-nav-group">
                <button onClick={() => handleNavigationClick('Principal')} className={getSidebarItemClass('Principal')}>Principal</button>
                <button onClick={() => handleNavigationClick('Productos')} className={getSidebarItemClass('Productos')}>Productos</button>
                <button onClick={() => handleNavigationClick('Ordenes')} className={getSidebarItemClass('Ordenes')}>Ordenes</button>
            </div>
            <hr className="sidebar-divider" />
            <button className="product-button-sidebar" onClick={() => navigate('/')}>Salir</button>
        </aside>

        {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        
        {/* MAIN CONTENT */}
        <main className="dashboard-main-content">
            
            {/* --- SECCIÓN PRINCIPAL --- */}
            {activeSection === 'Principal' && (
                <>
                <div className="content-message">
                    <h3 className="card-title"><strong>Productos</strong></h3>
                    <p className="card-text">Cantidad de Productos: 
                        <span className="card-value"> {products.length}</span>
                    </p>
                </div>

                <div className="content-message">
                    <h3 className="card-title"><strong>Ordenes</strong></h3>
                    <p className="card-text">Cantidad de Ordenes: 
                        <span className="card-value"> {orders.length}</span>
                    </p>
                </div>
                </>
            )}

            {/* --- SECCIÓN PRODUCTOS --- */}
            {activeSection === 'Productos' && (
                <>
                    <div className="content-message">
                        <div className="fila-superior">
                            <h3 className="card-title"><strong>Gestión de Productos</strong></h3>
                            <button className="boton-crear-responsivo" type="button" onClick={() => setActiveSection('CrearProducto')}>
                                <span className="texto-pc">Crear Producto</span>
                                <span className="icono-mobile"><FaPlus /></span>
                            </button>
                        </div>
                        <div className="fila-inferior">
    
    {/* 1. CONTENEDOR DE BÚSQUEDA (Input + Botón) */}
    <div className="search-container">
        <input 
            type="text" 
            placeholder="Buscar producto..." 
            className="search-input" // 💡 Usamos la clase nueva
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Opcional: Permitir buscar al dar Enter
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    // Aquí podrías llamar a una función de búsqueda si no fuera automática
                    console.log("Buscar: ", searchTerm);
                }
            }}
        />
        
        
    </div>

    {/* 2. SELECT (Estado) */}
    {/* Asegúrate de que este select tenga sus clases o estilos también */}
    <select 
    className="estado-select"
    value={statusFilter}
    onChange={(e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Importante: Volver a pág 1 al filtrar
    }}
>
    <option value="">Todos</option>
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
</select>

</div>
                    </div>



                    {loading && <p style={{textAlign: 'center', padding: '20px'}}>Cargando datos...</p>}
                    
                    
                             {/* RENDERIZADO SEGURO DE LA LISTA */}
                                {!loading && Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
                                      filteredProducts.map((prod) => (
                             <div className="content-message" key={prod.id || Math.random()} style={{borderLeft: '5px solid #646cff'}}>
                                <h3 className="card-title">
                                    <strong>{prod.sku || 'SIN SKU'} - {prod.name || 'Sin Nombre'}</strong>
                                </h3>
                                <p className="card-text">
                                    Precio: <strong>${prod.currentUnitPrice || 0}</strong> | 
                                    Stock: <strong>{prod.stockQuantity || 0}</strong> | 
                                    Estado: {prod.isActive ? "Activo" : "Inactivo"}
                                </p>
                            </div>
    ))
) : (
    !loading && <p>No se encontraron productos.</p>
)}


                    {/* Componente Paginación */}
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                    /> 
                </>
            )}

            {/* --- SECCIÓN ORDENES --- */}
            {activeSection === 'Ordenes' && (
                <>
                   <div className='content-message'>

                  
                   <div className="fila-superior">
                            <h3 className="card-title"><strong>Gestión de Ordenes</strong></h3>
                            
                        </div>
                        <div className="fila-inferior">
    
    {/* 1. CONTENEDOR DE BÚSQUEDA (Input + Botón) */}
    <div className="search-container">
        <input 
            type="text" 
            placeholder="Buscar orden..." 
            className="search-input" // 💡 Usamos la clase nueva
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            // Opcional: Permitir buscar al dar Enter
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    // Aquí podrías llamar a una función de búsqueda si no fuera automática
                    console.log("Buscar: ", searchTerm);
                }
            }}
        />
        
        
    </div>

    {/* 2. SELECT (Estado) */}
    {/* Asegúrate de que este select tenga sus clases o estilos también */}
    <select 
    className="estado-select"
    value={statusFilter}
    onChange={(e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Importante: Volver a pág 1 al filtrar
    }}
>
    <option value="">Todos</option>
    <option value="true">Activo</option>
    <option value="false">Inactivo</option>
</select>

</div>
 </div>

                    {!loading && Array.isArray(orders) && orders.length > 0 ? (
                        orders.map((order) => (
                            <div className="content-message" key={order.id || Math.random()}>
                                <h3 className="card-title">
                                    <strong>Orden #{order.id ? order.id.toString().substring(0, 8) : "N/A"}...</strong> 
                                    <span className="card-value" style={{fontSize: '0.8em', marginLeft: '10px'}}>
                                        ${order.totalAmount}
                                    </span>
                                </h3>
                                <p className="card-text">Estado: <strong>{order.status || "Pending"}</strong></p>
                            </div>
                        ))
                    ) : (
                        !loading && <p>No hay ordenes registradas.</p>
                    )}

                      {/* Componente Paginación */}
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                    /> 
                </>
            )}

            {/* --- SECCIÓN CREAR PRODUCTO --- */}
            {activeSection === 'CrearProducto' && (
                <div className="content-message">
                    <CreateProductForm 
                        onCancel={() => setActiveSection('Productos')}
                        onAfterCreate={() => {
                            alert("Producto Creado");
                            setActiveSection('Productos'); 
                            setCurrentPage(1); // Volver a la primera página para ver el nuevo
                        }} 
                    />
                </div>
            )}
            
        </main>
        </div>
    );
}
export default Dashboard;