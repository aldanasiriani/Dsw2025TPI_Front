import React, { useState } from 'react';
import '../shared/dashboard.css';
import { useForm } from 'react-hook-form'; 
import Input from './Input'; 
import Button from './Button';

function CreateProductForm(){

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


    return(
      <>
       

                <div className="content-card">
                    {/* 💡 CORREGIR: Usar handleSubmit y onValid definidos arriba */}
                    <form 
                        className='
        flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:w-xl-40px
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
      </>
        
            

            
    );
}
export default CreateProductForm;