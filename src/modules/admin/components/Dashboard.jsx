import React, { useState, useEffect } from 'react';
import '../../shared/dashboard.css';
import CreateProductForm from '../CreateProductForm'; 
import Pagination from './Pagination';
import { FaSearch, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; 
import ProductDetailModal from './ProductDetailModal';

function Dashboard() {

    // --- ESTADOS ---
    const [activeSection, setActiveSection] = useState('Principal'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    // Datos
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Filtros
    const [searchTerm, setSearchTerm] = useState(""); 
    const [statusFilter, setStatusFilter] = useState("");
    const [orderStatusFilter, setOrderStatusFilter] = useState("");

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); 
    const pageSize = 5; 

    // Estados de selección
    const [productToEdit, setProductToEdit] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null); // Sirve para ver detalle de prod u orden

    const navigate = useNavigate();

    // --- EFECTO DE CARGA ---
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // -------------------------
                // 1. LÓGICA DE PRODUCTOS
                // -------------------------
                if (activeSection === 'Productos' || activeSection === 'Principal') {
                    
                    let url = `/products?page=${currentPage}&limit=${pageSize}`;
                    
                    if (searchTerm) url += `&name=${searchTerm}`;
                    if (statusFilter !== "") url += `&isActive=${statusFilter}`;

                    const response = await api.get(url);

                    if (response.data && Array.isArray(response.data.items)) {
                        setProducts(response.data.items);
                        const count = response.data.totalCount;
                        const pages = Math.ceil(count / pageSize);
                        setTotalPages(pages > 0 ? pages : 1);
                    } 
                    else if (Array.isArray(response.data)) {
                        setProducts(response.data);
                        const count = response.data.length;
                        const pages = Math.ceil(count / pageSize);
                        setTotalPages(pages > 0 ? pages : 1);
                    } 
                    else {
                        setProducts([]);
                        setTotalPages(1);
                    }
                }
                
                // -------------------------
                // 2. LÓGICA DE ÓRDENES
                // -------------------------
                if (activeSection === 'Ordenes' || activeSection === 'Principal') {
                    try {
                        let url = `/orders?page=${currentPage}&limit=${pageSize}`;
                        
                        if (orderStatusFilter !== "") {
                            url += `&status=${orderStatusFilter}`;
                        }
                        
                        // Nota: Tu backend actual de ordenes no tiene filtro por nombre en el endpoint,
                        // pero dejamos el buscador visualmente. Si quisieras filtrar por ID, habría que hacerlo aquí.

                        const response = await api.get(url);
                        
                        if (response.data && Array.isArray(response.data.items)) {
                             setOrders(response.data.items);
                             const count = response.data.totalCount;
                             const pages = Math.ceil(count / pageSize);
                             setTotalPages(pages > 0 ? pages : 1);
                        } else if (Array.isArray(response.data)) {
                             setOrders(response.data);
                        } else {
                             setOrders([]);
                        }

                    } catch (e) {
                        console.warn("Error cargando ordenes", e);
                        setOrders([]); 
                    }
                }
            } catch (error) {
                console.error("Error general:", error);
                setProducts([]); 
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeSection, currentPage, statusFilter, orderStatusFilter, searchTerm]);


    // --- HANDLERS ---

    const handleEditClick = (product) => {
        setProductToEdit(product); 
        setActiveSection('CrearProducto'); 
    };

    const getSidebarItemClass = (sectionName) => {
        let isActive = activeSection === sectionName;
        if (sectionName === 'Productos' && activeSection === 'CrearProducto') isActive = true;
        return `sidebar-item ${isActive ? 'active' : ''}`;
    };

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleNavigationClick = (section) => {
        setActiveSection(section);
        // Reseteamos filtros al cambiar de sección
        if (section !== activeSection) {
            setSearchTerm("");
            setCurrentPage(1);
            setProductToEdit(null);
        }
        if (window.innerWidth <= 768) setIsSidebarOpen(false);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleLogout = () => {
        localStorage.removeItem('token'); 
        localStorage.removeItem('username'); 
        setProducts([]);
        setOrders([]);
        navigate('/', { replace: true });
    };

    const closeModal = () => setSelectedProduct(null);

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
                    <p className="card-text">Cantidad visualizada: 
                        <span className="card-value"> {products.length}</span>
                    </p>
                </div>

                <div className="content-message">
                    <h3 className="card-title"><strong>Ordenes</strong></h3>
                    <p className="card-text">Cantidad visualizada: 
                        <span className="card-value"> {orders.length}</span>
                    </p>
                </div>
                </>
            )}

            {/* --- SECCIÓN PRODUCTOS --- */}
            {activeSection === 'Productos' && (
                <>
                    <div className="content-message">
                        {/* 1. Header Productos: Título y Botón Crear */}
                        <div className="fila-superior">
                            <h3 className="card-title"><strong>Gestión de Productos</strong></h3>
                            <button 
                                className="boton-crear-responsivo" 
                                type="button" 
                                onClick={() => {
                                    setProductToEdit(null); 
                                    setActiveSection('CrearProducto');
                                }}
                            >
                                <span className="texto-pc">Crear Producto</span>
                                <span className="icono-mobile"><FaPlus /></span>
                            </button>
                        </div>

                        {/* 2. Filtros Productos: Buscador y Select */}
                        <div className="fila-inferior">
                            <div className="search-container">
                                <input 
                                    type="text" 
                                    placeholder="Buscar producto..." 
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <select 
                                className="estado-select"
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1); 
                                }}
                            >
                                <option value="">Todos</option>
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>
                    </div>

                    {loading && <p style={{textAlign: 'center', padding: '20px'}}>Cargando datos...</p>}

                    {/* Lista Productos */}
                    {!loading && Array.isArray(products) && products.length > 0 ? (
                        products.map((prod) => (
                            <div className="content-message" key={prod.id || Math.random()} 
                                 style={{borderLeft: '5px solid #646cff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                <div>
                                    <h3 className="card-title">
                                        <strong>{prod.sku || 'SIN SKU'} - {prod.name || 'Sin Nombre'}</strong>
                                    </h3>
                                    <p className="card-text">
                                        Precio: <strong>${prod.currentUnitPrice || 0}</strong> | 
                                        Stock: <strong>{prod.stockQuantity || 0}</strong> | 
                                        Estado: {prod.isActive ? "Activo" : "Inactivo"}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', gap: '10px' }}>
                                    {/* Botón Ver (Ojo) */}
                                    <button 
                                        onClick={() => setSelectedProduct(prod)}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#10b981', fontSize: '1.2rem', padding: '5px' }}
                                        title="Ver detalle"
                                    >
                                        <FaEye />
                                    </button>

                                    {/* Botón Editar (Lápiz) */}
                                    <button 
                                        onClick={() => handleEditClick(prod)}
                                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#646cff', fontSize: '1.2rem', padding: '5px' }}
                                        title="Editar producto"
                                    >
                                        <FaEdit />
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        !loading && <p style={{textAlign: 'center', padding: '20px'}}>No se encontraron productos.</p>
                    )}
                    
                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                    /> 
                </>
            )}

            {/* --- SECCIÓN ORDENES (AHORA IGUAL A PRODUCTOS) --- */}
            {activeSection === 'Ordenes' && (
                <>
                    <div className="content-message">
                        {/* 1. Header Órdenes: Título */}
                        <div className="fila-superior">
                            <h3 className="card-title"><strong>Gestión de Órdenes</strong></h3>
                        </div>
                        
                        {/* 2. Filtros Órdenes: Buscador y Select (Igual que productos) */}
                        <div className="fila-inferior">
                            {/* Buscador de Órdenes */}
                            <div className="search-container">
                                <input 
                                    type="text" 
                                    placeholder="Buscar orden (ID)..." 
                                    className="search-input"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Select de Estados */}
                             <select
                                className="estado-select"
                                value={orderStatusFilter}
                                onChange={(e) => {
                                    setOrderStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">Todas las Órdenes</option>
                                <option value="0">Pendiente</option>
                                <option value="1">Procesando</option>
                                <option value="2">Enviado</option>
                                <option value="3">Entregado</option>
                                <option value="4">Cancelado</option>
                            </select>
                        </div>
                    </div>



                    {!loading && Array.isArray(orders) && orders.length > 0 ? (
                        orders.map((order) => (
                            <div className="content-message" key={order.id || Math.random()}
                         style={{borderLeft: '5px solid #646cff', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                
                                
                                <div>
                                    <h3 className="card-title" style={{ margin: 0 }}>
                                        <strong>Orden #{order.id ? order.id.toString().substring(0, 8) : "N/A"}...</strong> 
                                        <span className="card-value" style={{fontSize: '0.8em', marginLeft: '10px'}}>
                                            ${order.totalAmount}
                                        </span>
                                    </h3>
                                    <p className="card-text">Estado: <strong>{order.status || "Pending"}</strong></p>
                                </div>


                                {/* Botón Ver Detalle (Mismo estilo que productos) */}
                                <button 
                                    onClick={() => setSelectedProduct(order)}
                                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#10b981', fontSize: '1.2rem', padding: '5px' }}
                                    title="Ver detalle"
                                >
                                    <FaEye />
                                </button>
                            </div>
                        ))
                    ) : (
                        !loading && <p style={{textAlign: 'center', padding: '20px'}}>No hay ordenes registradas.</p>
                    )}

                    <Pagination 
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={handlePageChange} 
                    /> 
                </>
            )}

            {/* --- SECCIÓN CREAR/EDITAR PRODUCTO --- */}
            {activeSection === 'CrearProducto' && (
                <div className="content-message">
                    <CreateProductForm 
                        productToEdit={productToEdit} 
                        onCancel={() => {
                            setProductToEdit(null); 
                            setActiveSection('Productos');
                        }}
                        onAfterCreate={() => {
                            setProductToEdit(null); 
                            setActiveSection('Productos'); 
                            setCurrentPage(1); 
                        }} 
                    />
                </div>
            )}

            {/* MODAL DETALLE (Sirve para productos y ordenes) */}
            {selectedProduct && (
                <ProductDetailModal 
                    item={selectedProduct} 
                    onClose={closeModal} 
                />
            )}
            
        </main>
        </div>
    );
}
export default Dashboard;