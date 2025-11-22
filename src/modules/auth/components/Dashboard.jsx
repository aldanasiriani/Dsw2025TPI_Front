import React, { useState } from 'react';
import '../shared/dashboard.css';
import { useForm } from 'react-hook-form'; 
import Input from './Input'; 
import Button from './Button';
import CreateProductForm from './CreateProductForm';

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
        return `sidebar-item ${activeSection === sectionName ? 'active' : ''}`;
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
            <button className="product-button"> {/* Botón de escritorio */}
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
                        <h3 className="card-title product"><strong>Producto</strong></h3>

                        
                            <input className='input-buscar'>
                            
                            </input>

                            <button  className="product-button">
                            Crear Producto </button>
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

                
                </>
                

               
            )}

            

            {activeSection === 'Ordenes' && (
                <div className="content-message">
                    No hay ordenes disponibles.
                </div>
            )}
        </main>
        </div>
    );
}
export default Dashboard;