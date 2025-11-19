import React, { useState } from 'react';
import '../shared/dashboard.css';
import { useForm } from 'react-hook-form'; 
import Input from './Input'; 
import Button from './Button';

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
            <button className="logout-button-sidebar">
                Cerrar Sesión
            </button>
            
        </aside>

        {/* 💡 Overlay oscuro que cubre el contenido al abrir la sidebar en móvil */}
        {isSidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
        
        {/* -------------------- MAIN CONTENT -------------------- */}
        <main className="dashboard-main-content">
            
            {activeSection === 'Principal' && (
                <div className="content-message">
                    No hay productos ni ordenes disponibles.
                </div>
            )}

            {activeSection === 'Productos' && (
                <div className="content-card">
                    {/* 💡 CORREGIR: Usar handleSubmit y onValid definidos arriba */}
                    <form 
                        className='
        flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      ' // Reemplazo tus clases Tailwind genéricas
                        onSubmit={handleSubmit(onValid)}
                    >
                        {/* 💡 CORREGIR: Referencia a formRegister y errors */}
                        <Input
                            label='SKU'
                            { ...formRegister('sku', { required: 'SKU es obligatorio' }) }
                            error={errors.sku?.message}
                        />
                        {/* 2. Código Único */}
            <Input
                label='Codigo Unico'
                { ...formRegister('codigoUnico', {
                    required: 'Codigo Unico es obligatorio',
                }) }
                error={errors.codigoUnico?.message}
            />
            
            {/* 3. Nombre */}
            <Input
                label='Nombre'
                { ...formRegister('nombre', {
                    required: 'El nombre es obligatorio',
                }) }
                error={errors.nombre?.message}
            />
            
            {/* 4. Descripción */}
            <Input
                label='Descripcion'
                { ...formRegister('descripcion', {
                    required: 'La descripcion es obligatorio',
                }) }
                error={errors.descripcion?.message}
            />

            {/* 5. Precio */}
            <Input
                label='Precio'
                type='number' // Es importante que sea tipo number para precios
                { ...formRegister('precio', {
                    required: 'El precio es obligatorio',
                    min: { value: 0.01, message: 'El precio debe ser mayor a cero' }
                }) }
                error={errors.precio?.message}
            />
            
            {/* 6. Stock */}
            <Input
                label='Stock'
                type='number' // Es importante que sea tipo number para stock
                { ...formRegister('stock', {
                    required: 'El stock es obligatorio',
                    min: { value: 1, message: 'El stock debe ser al menos 1' }
                }) }
                error={errors.stock?.message}
            />
                        
                        <Button type='submit'>Crear Producto</Button>
                    </form>
                </div>
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