import React, { useState, useEffect } from 'react';
import '../shared/dashboard.css';
import CreateProductForm from './CreateProductForm';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 

function Dashboard(){

    const [activeSection, setActiveSection] = useState('Principal'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Inicializamos como arrays vacíos
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5; 

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. PRODUCTOS
                if (activeSection === 'Productos' || activeSection === 'Principal') {
                    const response = await api.get('/products');
                    // Protección: Si no es array, forzamos []
                    setProducts(Array.isArray(response.data) ? response.data : []);
                }
                
                // 2. ORDENES
                if (activeSection === 'Ordenes' || activeSection === 'Principal') {
                    try {
                        const response = await api.get('/orders');
                        // Protección: Si no es array, forzamos []
                        setOrders(Array.isArray(response.data) ? response.data : []);
                    } catch (e) {
                        console.log("Error al traer ordenes (quizás no hay ninguna)");
                        setOrders([]); // En caso de error, aseguramos que sea array vacío
                    }
                }
            } catch (error) {
                console.error("Error general:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeSection]); 

    const getSidebarItemClass = (sectionName) => {
        let isActive = activeSection === sectionName;
        if (sectionName === 'Productos' && activeSection === 'CrearProducto') isActive = true;
        return `sidebar-item ${isActive ? 'active' : ''}`;
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleNavigationClick = (section) => {
        setActiveSection(section);
        if (window.innerWidth <= 768) setIsSidebarOpen(false);
    };

    const handlePageChange = (page) => setCurrentPage(page);

    const handleLogout = () => {
        // 1. Borramos la "llave" de seguridad
        localStorage.removeItem('token'); 
        localStorage.removeItem('username'); // Si guardaste el usuario también

        // 2. (Opcional) Limpiamos estados si es necesario
        setProducts([]);
        setOrders([]);

        // 3. Redirigimos a la página de Login (o al Home)
        navigate('/', { replace: true });
    };

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
            
            {/* SECCIÓN PRINCIPAL (Resumen) */}
            {activeSection === 'Principal' && (
                <>
                <div className="content-message">
                    <h3 className="card-title"><strong>Total Productos</strong></h3>
                    {/* USO DE ?. PARA EVITAR PANTALLA BLANCA */}
                    <p className="card-text"><span className="card-value">{products?.length || 0}</span></p>
                </div>

                <div className="content-message">
                    <h3 className="card-title"><strong>Total Ordenes</strong></h3>
                    {/* USO DE ?. PARA EVITAR PANTALLA BLANCA */}
                    <p className="card-text"><span className="card-value">{orders?.length || 0}</span></p>
                </div>
                </>
            )}

            {/* SECCIÓN PRODUCTOS */}
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

                    {loading && <p>Cargando...</p>}

                    {/* Validación robusta antes de mapear */}
                    {!loading && Array.isArray(products) && products.length > 0 ? (
                        products.map((prod) => (
                            <div className="content-message" key={prod.id || Math.random()} style={{borderLeft: '5px solid #646cff'}}>
                                <h3 className="card-title"><strong>{prod.sku} - {prod.name}</strong></h3>
                                <p className="card-text">
                                    Precio: <strong>${prod.currentUnitPrice}</strong> | 
                                    Stock: <strong>{prod.stockQuantity}</strong> | 
                                    Estado: {prod.isActive ? "Activo" : "Inactivo"}
                                </p>
                            </div>
                        ))
                    ) : (
                        !loading && <p>No hay productos registrados.</p>
                    )}
                    
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} /> 
                </>
            )}

            {/* SECCIÓN ORDENES */}
            {activeSection === 'Ordenes' && (
                <>
                    <div className="content-message">
                        <h3 className="card-title"><strong>Listado de Ordenes</strong></h3>
                    </div>

                    {/* Validación robusta antes de mapear */}
                    {Array.isArray(orders) && orders.length > 0 ? (
                        orders.map((order) => (
                            <div className="content-message" key={order.id || Math.random()}>
                                <h3 className="card-title">
                                    {/* Protegemos el ID por si es nulo */}
                                    <strong>Orden #{order.id ? order.id.toString().substring(0, 8) : "N/A"}...</strong> 
                                    <span className="card-value" style={{fontSize: '0.8em', marginLeft: '10px'}}>
                                        ${order.totalAmount}
                                    </span>
                                </h3>
                                <p className="card-text">Estado: <strong>{order.status || "Pending"}</strong></p>
                            </div>
                        ))
                    ) : (
                        <p>No hay ordenes registradas.</p>
                    )}
                </>
            )}

            {/* SECCIÓN CREAR PRODUCTO */}
            {activeSection === 'CrearProducto' && (
                <div className="content-message">
                    <CreateProductForm 
                        onCancel={() => setActiveSection('Productos')}
                        onAfterCreate={() => {
                            alert("Producto Creado");
                            setActiveSection('Productos'); 
                        }} 
                    />
                </div>
            )}
            
        </main>
        </div>
    );
}
export default Dashboard;