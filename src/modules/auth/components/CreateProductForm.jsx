import React, { useState } from 'react'; // Agregué useState por si lo necesitas luego
import { useForm } from 'react-hook-form'; 
import Input from './Input'; 
import Button from './Button'; 
// import { createProduct } from '../services/productService'; // Deberías importar tu servicio de productos aquí

function CreateProductForm({ onAfterCreate, onCancel }) {

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: { sku: '', codigoUnico: '', nombre: '', descripcion: '', precio: 0, stock: 0 }
    });

    const onValid = async (formData) => {
        // Aquí iría la lógica real de creación
        console.log("Datos válidos:", formData);
        alert("Validación exitosa. Intentando crear producto...");
        
        // Lógica simulada para evitar errores de 'login is not defined'
        if (onAfterCreate) onAfterCreate();
    };

    return (
        <div className="w-full"> 
            <h2 className="card-title" style={{ marginBottom: '20px' }}><strong>Crear Nuevo Producto</strong></h2>
            
            <form onSubmit={handleSubmit(onValid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* 1. SKU */}
                <Input 
                    label='SKU' 
                    { ...formRegister('sku', { required: 'El SKU es obligatorio' }) } // 💡 Corrección: Mensaje de texto
                    error={errors.sku?.message} 
                />

                {/* 2. CÓDIGO ÚNICO */}
                <Input 
                    label='Código Único' 
                    { ...formRegister('codigoUnico', { required: 'El código es obligatorio' }) } 
                    error={errors.codigoUnico?.message} 
                />

                {/* 3. NOMBRE */}
                <Input 
                    label='Nombre' 
                    { ...formRegister('nombre', { required: 'El nombre es obligatorio' }) } 
                    error={errors.nombre?.message} 
                />

                {/* 4. DESCRIPCIÓN */}
                <Input 
                    label='Descripción' 
                    { ...formRegister('descripcion', { required: 'La descripción es obligatoria' }) } 
                    error={errors.descripcion?.message} 
                />

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        {/* 5. PRECIO */}
                        <Input 
                            label='Precio' 
                            type="number" 
                            { ...formRegister('precio', { 
                                required: 'El precio es obligatorio',
                                min: { value: 0.01, message: 'El precio debe ser mayor a 0' }
                            }) } 
                            // 💡 Corrección: Apuntar a errors.precio, no a sku
                            error={errors.precio?.message} 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        {/* 6. STOCK */}
                        <Input 
                            label='Stock' 
                            type="number" 
                            { ...formRegister('stock', { 
                                required: 'El stock es obligatorio',
                                min: { value: 1, message: 'No puede ser negativo' }
                            }) } 
                            // 💡 Corrección: Faltaba pasar la prop error
                            error={errors.stock?.message} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="product-button"
                        style={{ background: 'white', border: '1px solid #ccc', color: '#333' }}
                    >
                        Cancelar
                    </button>
                    <Button type='submit'>Guardar</Button>
                </div>
            </form>
        </div>
    );
}

export default CreateProductForm;