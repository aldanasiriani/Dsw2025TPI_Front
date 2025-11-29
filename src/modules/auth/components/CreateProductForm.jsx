import React, { useState } from 'react';
import { useForm } from 'react-hook-form'; 
import Input from './Input'; 
import Button from './Button'; 
import { createProduct } from "../services/product";

function CreateProductForm({ onAfterCreate, onCancel }) {

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
        setError // Importamos setError por si el backend devuelve error de validación
    } = useForm({
        defaultValues: { sku: '', codigoUnico: '', nombre: '', descripcion: '', precio: 0, stock: 0 }
    });
    
    // Estado para feedback visual de carga
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onValid = async (formData) => {
        setIsSubmitting(true);
        try {
            // 2. MAPEO: Transformamos los datos de Español (Form) a Inglés (DTO Backend)
            // También aseguramos que los números sean números (Number/parseFloat)
            const productoParaBackend = {
                Sku: formData.sku,
                InternalCode: formData.codigoUnico,
                Name: formData.nombre,
                Description: formData.descripcion,
                CurrentUnitPrice: parseFloat(formData.precio), // Convertir a decimal
                StockQuantity: parseInt(formData.stock, 10)    // Convertir a entero
            };

            console.log("Enviando al backend:", productoParaBackend);

            // 3. LLAMADA AL SERVICIO
            await createProduct(productoParaBackend);
            
            alert("¡Producto creado con éxito!");

            // Limpiar o redirigir
            if (onAfterCreate) onAfterCreate();

        } catch (error) {
            console.error(error);
            alert("Error al guardar: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full"> 
            <h2 className="card-title" style={{ marginBottom: '20px' }}><strong>Crear Nuevo Producto</strong></h2>
            
            <form onSubmit={handleSubmit(onValid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* SKU */}
                <Input 
                    label='SKU' 
                    { ...formRegister('sku', { required: 'El SKU es obligatorio' }) }
                    error={errors.sku?.message} 
                />

                {/* CÓDIGO ÚNICO */}
                <Input 
                    label='Código Único' 
                    { ...formRegister('codigoUnico', { required: 'El código es obligatorio' }) } 
                    error={errors.codigoUnico?.message} 
                />

                {/* NOMBRE */}
                <Input 
                    label='Nombre' 
                    { ...formRegister('nombre', { required: 'El nombre es obligatorio' }) } 
                    error={errors.nombre?.message} 
                />

                {/* DESCRIPCIÓN */}
                <Input 
                    label='Descripción' 
                    { ...formRegister('descripcion', { required: 'La descripción es obligatoria' }) } 
                    error={errors.descripcion?.message} 
                />

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1 }}>
                        {/* PRECIO */}
                        <Input 
                            label='Precio' 
                            type="number" 
                            step="0.01" // Importante para permitir decimales en HTML
                            { ...formRegister('precio', { 
                                required: 'El precio es obligatorio',
                                min: { value: 0.01, message: 'El precio debe ser mayor a 0' }
                            }) } 
                            error={errors.precio?.message} 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        {/* STOCK */}
                        <Input 
                            label='Stock' 
                            type="number" 
                            { ...formRegister('stock', { 
                                required: 'El stock es obligatorio',
                                min: { value: 0, message: 'No puede ser negativo' }
                            }) } 
                            error={errors.stock?.message} 
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', justifyContent: 'flex-end' }}>
                    <button 
                        type="button" 
                        onClick={onCancel} 
                        className="product-button"
                        disabled={isSubmitting} // Deshabilitar si está cargando
                        style={{ background: 'white', border: '1px solid #ccc', color: '#333' }}
                    >
                        Cancelar
                    </button>
                    {/* Cambiar texto del botón si está cargando */}
                    <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateProductForm;