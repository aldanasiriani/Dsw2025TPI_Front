import React, { useState } from 'react';
import '../shared/dashboard.css';
import { useForm } from 'react-hook-form'; 
import Input from './Input'; 
import Button from './Button';
import CreateProductForm from './CreateProductForm';
import { FaSearch, FaPlus } from 'react-icons/fa';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom';

function Dashboard(){

    const [activeSection, setActiveSection] = useState('Principal'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 💡 NUEVO: Estado para abrir/cerrar sidebar

    const {
        register: formRegister, // Renombré 'register' a 'formRegister' para evitar conflicto
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        defaultValues: { sku: '', codigoUnico: '', nombre: '', descripcion: '', precio: 0, stock: 0 }
    });

    const onValid = (formData) => {
        console.log("Datos del Producto a Crear:", formData);
        // Aquí llamarías a tu service: createProduct(formData);
        alert("Producto creado (simulado)!");
        reset(); // Limpiar el formulario
    };
    const getSidebarItemClass = (sectionName) => {
    let isActive = activeSection === sectionName;

    if (sectionName === 'Productos' && activeSection === 'CrearProducto') {
        isActive = true;
    }

    // 💡 CORRECCIÓN AQUÍ: Agrega las comillas invertidas ` `
    return `sidebar-item ${isActive ? 'active' : ''}`;
};

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleNavigationClick = (section) => {
        setActiveSection(section);
        if (window.innerWidth <= 768) { // Cierra la sidebar automáticamente en móvil
            setIsSidebarOpen(false);
        }

        
    };

    // 💡 ESTADO PARA LA PAGINACIÓN (Simulación Frontend)
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 68; // Número fijo para probar el diseño de PC (como en la foto)

    // Función que pasa al componente hijo
    const handlePageChange = (page) => {
        setCurrentPage(page);
        console.log(`Cargando página: ${page}`); 
        // Aquí llamarás al backend después
    };

    const navigate = useNavigate();
    

    return(
        <div className="dashboard-grid-container">
        
        {/* -------------------- HEADER -------------------- */}
        <header className="dashboard-header">
            <button 
                className="menu-toggle-button" // 💡 Botón de hamburguesa (visible en móvil)
                onClick={toggleSidebar}
                aria-label="Toggle Navigation"
            >
                ☰
            </button>
            <h1 className="header-title">Tienda</h1>
            <button className="logout-button"> {/* Botón de escritorio */}
                Cerrar Sesión
            </button>
        </header>
        
        {/* -------------------- SIDEBAR -------------------- */}
        {/* 💡 Añadimos la clase 'open' para mostrar/ocultar en CSS */}
        <aside className={`dashboard-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            
            <div className="sidebar-nav-group">
                <button 
                    onClick={() => handleNavigationClick('Principal')}
                    className={getSidebarItemClass('Principal')}
                >
                    Principal
                </button>

                <button 
                    onClick={() => handleNavigationClick('Productos')}
                    className={getSidebarItemClass('Productos')}
                >
                    Productos
                </button>

                <button 
                    onClick={() => handleNavigationClick('Ordenes')}
                    className={getSidebarItemClass('Ordenes')}
                >
                    Ordenes
                </button>
            </div>
            
            <hr className="sidebar-divider" />

            {/* 💡 Botón de cerrar sesión dentro de la sidebar (visible en móvil) */}
            <button className="product-button-sidebar">
                Cerrar Sesión
            </button>
            
        </aside>

        {/* 💡 Overlay oscuro que cubre el contenido al abrir la sidebar en móvil */}
        {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        
        {/* -------------------- MAIN CONTENT -------------------- */}
        <main className="dashboard-main-content">
            
            {activeSection === 'Principal' && (
                <>
                <div className="content-message">
            <h3 className="card-title"><strong>Productos</strong></h3>
            <p className="card-text">Cantidad de Productos: <span className="card-value">#</span></p>
          </div>

          <div className="content-message">
            <h3 className="card-title"><strong>Ordenes</strong></h3>
            <p className="card-text">Cantidad de Ordenes: <span className="card-value">#</span></p>
          </div>


                </>

                
            )}

            {activeSection === 'Productos' && (
        <>
                
            <div className="content-message">

                {/* FILA 1: TÍTULO + BOTÓN */}
                <div className="fila-superior">
                    <h3 className="card-title"><strong>Productos</strong></h3>

                    {/* 2. BOTÓN RESPONSIVO: Tiene el texto Y el ícono dentro */}
          {/* 2. CAMBIO EN EL BOTÓN DE CREAR */}
                                <button 
                                    className="boton-crear-responsivo" 
                                    type="button" 
                                    onClick={() => setActiveSection('CrearProducto')} // <--- AQUÍ LA MAGIA
                                >
                                    <span className="texto-pc">Crear Producto</span>
                                    <span className="icono-mobile"><FaPlus /></span>
                                </button>

       
                </div>

                {/* FILA 2: BUSCADOR + ESTADO */}
                <div className="fila-inferior">
                    <input className="input-buscar" placeholder="Buscar"></input>
                    

                    <button className="product-button" aria-label="Buscar">
                    <FaSearch />
                    </button>

                    

                    <select className="estado-select" id="estados">
                    <option value="">Estado de Producto</option>
                    <option value="esuno">Estado 1</option>
                    <option value="esdos">Estado 2</option>
                    </select>
                </div>

                </div>

                

                 
                   
                    <div className="content-message">
                        <h3 className="card-title"><strong>SKU - Nombre de Producto</strong></h3>
            
                    </div>

                      <div className="content-message">
                       <h3 className="card-title"><strong>SKU - Nombre de Producto</strong></h3>
            
                    </div>

                      <div className="content-message">
                    <h3 className="card-title"><strong>SKU - Nombre de Producto</strong></h3>
            
                    </div>

                     {/* CONTENIDO DE TABLA O LISTA (Ejemplo) */}
                <div style={{ height: '300px', background: 'white', padding: '20px', borderRadius: '8px' }}>
                    <p>Contenido de la página {currentPage}</p>
                </div>

                {/* 💡 AQUÍ VA EL COMPONENTE DE PAGINACIÓN */}
                <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
                
                </>
                

               
            )}

            

            {activeSection === 'Ordenes' && (
                <div className="content-message">
                    No hay ordenes disponibles.
                </div>
            )}
            {/* 3. NUEVA SECCIÓN: CREAR PRODUCTO (Integrada) */}
                {activeSection === 'CrearProducto' && (
                    
                    /* AQUÍ ES DONDE USAMOS TU CLASE PARA MANTENER EL ESTILO */
                    <div className="content-message">
                        
                        {/* Renderizamos el componente limpio */}
                        <CreateProductForm 
                            onCancel={() => setActiveSection('Productos')}      // Si cancela, vuelve a la lista
                            onAfterCreate={() => setActiveSection('Productos')} // Si guarda, vuelve a la lista
                        />
                        
                    </div>
                )}

           
                
        </main>
        </div>
    );
}
export default Dashboard;