import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; 
import Button from "../../auth/components/Button";
import Input from "../../auth/components/Input";

import { createProduct, updateProduct} from "../../products/services/product";


function CreateProductForm({ onAfterCreate, onCancel, productToEdit = null }) {

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
        setValue, 
        setError, // <--- 1. IMPORTANTE: Necesitamos esto para marcar errores del back
        reset
    } = useForm({
        defaultValues: { sku: '', codigoUnico: '', nombre: '', descripcion: '', precio: 0, stock: 0 }
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (productToEdit) {
            setValue('sku', productToEdit.sku);
            setValue('codigoUnico', productToEdit.internalCode || ''); 
            setValue('nombre', productToEdit.name);
            setValue('descripcion', productToEdit.description || '');
            setValue('precio', productToEdit.currentUnitPrice);
            setValue('stock', productToEdit.stockQuantity);
        } else {
            reset(); 
        }
    }, [productToEdit, setValue, reset]);

   const onValid = async (formData) => {
        setIsSubmitting(true);
        try {
            // 1. Preparamos el objeto para el Backend
            const productPayload = {
                Id: productToEdit ? productToEdit.id : undefined, 
                Sku: formData.sku,
                InternalCode: formData.codigoUnico,
                Name: formData.nombre,
                Description: formData.descripcion,
                CurrentUnitPrice: parseFloat(formData.precio),
                StockQuantity: parseInt(formData.stock, 10),
                IsActive: true 
            };

            // 2. Enviamos al backend
            if (productToEdit) {
                await updateProduct(productToEdit.id, productPayload);
                alert("¡Producto actualizado con éxito!");
            } else {
                await createProduct(productPayload);
                alert("¡Producto creado con éxito!");
            }

            if (onAfterCreate) onAfterCreate();

        } catch (error) {
            console.error("Error del back:", error);
            
            // --- CORRECCIÓN AQUÍ: Leemos el mensaje directo, sin usar 'parseError' ---
            const errorText = error.message || "Error desconocido";

            // 3. DETECCIÓN DE SKU DUPLICADO
            // Buscamos palabras clave en el mensaje de error del backend
            if (errorText.toLowerCase().includes("sku") && errorText.toLowerCase().includes("existe")) {
                setError('sku', { 
                    type: 'manual', 
                    message: '⛔ Este SKU ya está en uso. Intenta con otro.' 
                });
            } 
            // 4. DETECCIÓN DE CÓDIGO INTERNO DUPLICADO
            else if (errorText.toLowerCase().includes("código") || errorText.toLowerCase().includes("internalcode")) {
                setError('codigoUnico', { 
                    type: 'manual', 
                    message: '⛔ Este código interno ya existe.' 
                });
            }
            // 5. CUALQUIER OTRO ERROR (Lo mostramos en alerta)
            else {
                alert("Ocurrió un error al guardar: " + errorText);
            }

        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full"> 
            <h2 className="card-title" style={{ marginBottom: '20px' }}>
                <strong>{productToEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}</strong>
            </h2>
            
            <form onSubmit={handleSubmit(onValid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* 1. SKU */}
                <Input 
                    label='SKU' 
                    { ...formRegister('sku', { required: 'El SKU es obligatorio' }) }
                    error={errors.sku?.message} 
                />

                {/* 2. CÓDIGO ÚNICO - CORREGIDO: Agregada validación required */}
                <Input 
                    label='Código Único' 
                    { ...formRegister('codigoUnico', { 
                        required: 'El código único es obligatorio',
                        minLength: { value: 3, message: 'Mínimo 3 caracteres' }
                    }) } 
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
                        <Input 
                            label='Precio' 
                            type="number" 
                            step="0.01" 
                            { ...formRegister('precio', { 
                                required: 'El precio es obligatorio',
                                min: { value: 0.01, message: 'Mayor a 0' }
                            }) } 
                            error={errors.precio?.message} 
                        />
                    </div>
                    <div style={{ flex: 1 }}>
                        <Input 
                            label='Stock' 
                            type="number" 
                            { ...formRegister('stock', { 
                                required: 'El stock es obligatorio',
                                min: { value: 0, message: 'No negativo' }
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
                        disabled={isSubmitting}
                        style={{ background: 'white', border: '1px solid #ccc', color: '#333' }}
                    >
                        Cancelar
                    </button>
                    <Button type='submit' disabled={isSubmitting}>
                        {isSubmitting ? 'Guardando...' : (productToEdit ? 'Actualizar' : 'Guardar')}
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default CreateProductForm;