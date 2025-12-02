import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; 
import Input from './Input'; 
import Button from './Button'; 
import { createProduct, updateProduct} from "../services/product";


function CreateProductForm({ onAfterCreate, onCancel, productToEdit = null }) {

    const {
        register: formRegister,
        handleSubmit,
        formState: { errors },
        setValue, // Necesario para rellenar el formulario manualmente
        reset
    } = useForm({
        defaultValues: { sku: '', codigoUnico: '', nombre: '', descripcion: '', precio: 0, stock: 0 }
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- EFECTO: Si hay un producto para editar, rellenamos el formulario ---
    useEffect(() => {
        if (productToEdit) {
            // Mapeamos los datos que vienen del Backend a los campos del Formulario
            setValue('sku', productToEdit.sku);
            setValue('codigoUnico', productToEdit.internalCode || ''); // A veces el backend lo llama diferente
            setValue('nombre', productToEdit.name);
            setValue('descripcion', productToEdit.description || '');
            setValue('precio', productToEdit.currentUnitPrice);
            setValue('stock', productToEdit.stockQuantity);
        } else {
            reset(); // Si no hay producto, limpiamos
        }
    }, [productToEdit, setValue, reset]);

    const onValid = async (formData) => {
        setIsSubmitting(true);
        try {
            // 1. Preparamos el objeto para el Backend (DTO)
            const productPayload = {
                // Si editamos, necesitamos mandar el ID (aunque suele ir en la URL, el DTO a veces lo pide)
                Id: productToEdit ? productToEdit.id : undefined, 
                Sku: formData.sku,
                InternalCode: formData.codigoUnico,
                Name: formData.nombre,
                Description: formData.descripcion,
                CurrentUnitPrice: parseFloat(formData.precio),
                StockQuantity: parseInt(formData.stock, 10),
                IsActive: true // Por defecto activo
            };

            // 2. Decidimos si CREAR o ACTUALIZAR
            if (productToEdit) {
                // MODO EDICIÓN
                await updateProduct(productToEdit.id, productPayload);
                alert("¡Producto actualizado con éxito!");
            } else {
                // MODO CREACIÓN
                await createProduct(productPayload);
                alert("¡Producto creado con éxito!");
            }

            // 3. Avisamos al padre que terminamos
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
            {/* Título dinámico */}
            <h2 className="card-title" style={{ marginBottom: '20px' }}>
                <strong>{productToEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}</strong>
            </h2>
            
            <form onSubmit={handleSubmit(onValid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* 1. SKU (A veces no se permite editar el SKU, pero lo dejaremos habilitado por ahora) */}
                <Input 
                    label='SKU' 
                    { ...formRegister('sku', { required: 'El SKU es obligatorio' }) }
                    error={errors.sku?.message} 
                />

                {/* 2. CÓDIGO ÚNICO */}
                <Input 
                    label='Código Único' 
                    { ...formRegister('codigoUnico') } 
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
                            step="0.01" 
                            { ...formRegister('precio', { 
                                required: 'El precio es obligatorio',
                                min: { value: 0.01, message: 'El precio debe ser mayor a 0' }
                            }) } 
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