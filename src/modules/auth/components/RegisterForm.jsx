import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from './Input'; 
import Button from './Button'; 
import { registerUser } from '../services/register'; 
import '../shared/authentication.css'; // 💡 IMPORTAMOS EL CSS

function RegisterForm({ showRole = false }) { 
    
    const navigate = useNavigate();
    const [serverError, setServerError] = useState(null);
    
    const {
        register,
        handleSubmit,
        watch, 
        formState: { errors },
    } = useForm({
        defaultValues: {
            username: '', 
            password: '', 
            confirmPassword: '', 
            email: '', 
            role: showRole ? 'Admin' : 'Customer' 
        }
    });

    const onValid = async (formData) => {
        setServerError(null);
        
        const { data, error } = await registerUser(formData);

        if (error) {
            setServerError(error.message);
        } else {
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            navigate('/login');
        }
    };

    return (
        <div className="auth-card">
            
            <h2 className="auth-title">
                {showRole ? 'Registrar Usuario Interno' : 'Crear Cuenta'}
            </h2>

            {serverError && (
                <div className="auth-error-message">
                    {serverError}
                </div>
            )}
            
            <form onSubmit={handleSubmit(onValid)} className="auth-form">
                
                <Input 
                    label="Nombre de Usuario"
                    {...register('username', { required: 'El usuario es obligatorio' })}
                    error={errors.username?.message}
                />

                <Input 
                    label="Correo Electrónico"
                    type="email"
                    {...register('email', { required: 'El email es obligatorio' })}
                    error={errors.email?.message}
                />

                <Input 
                    label="Contraseña"
                    type="password"
                    {...register('password', { 
                        required: 'La contraseña es obligatoria', 
                        minLength: { value: 6, message: 'Mínimo 6 caracteres'} 
                    })}
                    error={errors.password?.message}
                />

                <Input 
                    label="Confirmar Contraseña"
                    type="password"
                    {...register('confirmPassword', { 
                        required: 'Debes confirmar tu contraseña', 
                        validate: (value) => {
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
                        <label style={{ fontWeight: 'bold', fontSize: '0.9rem', color:'#374151' }}>Rol</label>
                        <select 
                            {...register('role')}
                            className="auth-select"
                        >
                            <option value="Admin">Administrador</option>
                            <option value="User">Empleado / Usuario</option>
                        </select>
                    </div>
                )}

                <div className="auth-button-container">
                    <Button type="submit">Registrarse</Button>
                </div>

                {!showRole && (
                    <p className="auth-footer-text">
                        ¿Ya tienes cuenta? <span className="auth-link" onClick={() => navigate('/login')}>Inicia Sesión</span>
                    </p>
                )}
            </form>
        </div>
    );
}

export default RegisterForm;