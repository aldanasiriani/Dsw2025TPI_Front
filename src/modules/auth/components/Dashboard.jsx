 import React, { useState, useEffect } from 'react';
import '../shared/dashboard.css';
// Asegúrate de que las rutas a tus componentes sean correctas
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

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const pageSize = 10; // Debe coincidir con lo que espera tu Backend

    const navigate = useNavigate();

    // --- EFECTO DE CARGA DE DATOS ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. LOGICA DE PRODUCTOS
                if (activeSection === 'Productos' || activeSection === 'Principal') {
                    // Llamada al backend con paginación
                    const response = await api.get(`/products?page=${currentPage}&limit=${pageSize}`);
                    
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
    }, [activeSection, currentPage]); // Se ejecuta al cambiar sección o página

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
                    <h3 className="card-title"><strong>Productos (Vista)</strong></h3>
                    <p className="card-text">
                        <span className="card-value">{products.length}</span> mostrados
                    </p>
                </div>

                <div className="content-message">
                    <h3 className="card-title"><strong>Total Ordenes</strong></h3>
                    <p className="card-text">
                        <span className="card-value">{orders.length}</span>
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
                    </div>

                    {loading && <p style={{textAlign: 'center', padding: '20px'}}>Cargando datos...</p>}

                    {/* RENDERIZADO SEGURO DE LA LISTA */}
                    {!loading && Array.isArray(products) && products.length > 0 ? (
                        products.map((prod) => (
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
                        !loading && <p style={{textAlign: 'center', padding: '20px'}}>No hay productos registrados.</p>
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
                    <div className="content-message">
                        <h3 className="card-title"><strong>Listado de Ordenes</strong></h3>
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