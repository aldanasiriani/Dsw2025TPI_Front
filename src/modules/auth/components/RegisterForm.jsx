import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from './Input'; 
import Button from './Button'; 
import { registerUser } from '../services/register'; // Asegúrate de que este import sea el correcto

function RegisterForm({ showRole = false }) { 
    
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    
    const {
        register,
        handleSubmit,
        watch, // <--- 1. Importamos 'watch' para mirar la contraseña original
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: '', 
            password: '', 
            confirmPassword: '', // <--- 2. Agregamos el campo al estado inicial
            email: '', 
            role: showRole ? 'Admin' : 'Customer' 
        }
    });

    const onValid = async (formData) => {
        setServerError(null);
        console.log("Enviando registro:", formData);
        
        const { data, error } = await registerUser(formData);

        if (error) {
            setServerError(error.message);
        } else {
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            navigate('/login');
        }
    };

    return (
        <div className="card-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            
            <h2 className="card-title" style={{ textAlign: 'center', marginBottom: '20px' }}>
                {showRole ? 'Registrar Usuario Interno' : 'Crear Cuenta'}
            </h2>

            {serverError && (
                <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '5px', marginBottom: '15px', fontSize: '0.9em', textAlign: 'center'}}>
                    {serverError}
                </div>
            )}
            
            <form onSubmit={handleSubmit(onValid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                {/* Nombre de Usuario */}
                <Input 
                    label="Nombre de Usuario"
                    {...register('username', { required: 'El usuario es obligatorio' })}
                    error={errors.username?.message}
                />

                {/* Email */}
                <Input 
                    label="Correo Electrónico"
                    type="email"
                    {...register('email', { required: 'El email es obligatorio' })}
                    error={errors.email?.message}
                />

                {/* Contraseña */}
                <Input 
                    label="Contraseña"
                    type="password"
                    {...register('password', { 
                        required: 'La contraseña es obligatoria', 
                        minLength: { value: 6, message: 'Mínimo 6 caracteres'} 
                    })}
                    error={errors.password?.message}
                />

                {/* --- NUEVO CAMPO: CONFIRMAR CONTRASEÑA --- */}
                <Input 
                    label="Confirmar Contraseña"
                    type="password"
                    {...register('confirmPassword', { 
                        required: 'Debes confirmar tu contraseña', 
                        validate: (value) => {
                            // Aquí comparamos con el valor del campo 'password'
                            if (value !== watch('password')) {
                                return "Las contraseñas no coinciden";
                            }
                        }
                    })}
                    error={errors.confirmPassword?.message}
                />

                {/* ROL (Solo Admin) */}
                {showRole && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>Rol</label>
                        <select 
                            {...register('role')}
                            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                        >
                            <option value="Admin">Administrador</option>
                            <option value="User">Empleado / Usuario</option>
                        </select>
                    </div>
                )}

                <div style={{ marginTop: '10px' }}>
                    <Button type="submit">Registrarse</Button>
                </div>

                {!showRole && (
                    <p style={{ textAlign: 'center', fontSize: '0.9em', marginTop: '10px' }}>
                        ¿Ya tienes cuenta? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/login')}>Inicia Sesión</span>
                    </p>
                )}
            </form>
        </div>
    );
}

export default RegisterForm;