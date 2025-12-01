import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import { login } from '../services/login'; 
import '../shared/authentication.css'; // 💡 IMPORTAMOS EL CSS

function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginError, setLoginError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // Función para decodificar JWT
    const parseJwt = (token) => {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            return null;
        }
    };

    const onValid = async (formData) => {
        setLoginError(null);
        
        const { data, error } = await login(formData);

        if (error) {
            setLoginError("Credenciales inválidas o error en el servidor.");
        } else {
            const token = data.token || data; 
            localStorage.setItem('token', token);
            
            if (location.state?.from) {
                navigate(location.state.from); 
                return;
            }

            const decodedToken = parseJwt(token);
            const roleClaim = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decodedToken["role"] || "";

            if (roleClaim === 'Admin') {
                navigate('/admin'); 
            } else {
                navigate('/products'); 
            }
        }
    };

    return (
        <div className="auth-card">
            <h2 className="auth-title">Iniciar Sesión</h2>
            
            {loginError && (
                 <div className="auth-error-message">
                    {loginError}
                 </div>
            )}

            <form onSubmit={handleSubmit(onValid)} className="auth-form">
                <Input 
                    label="Usuario o Email"
                    {...register('username', { required: 'Este campo es obligatorio' })}
                    error={errors.username?.message}
                />
                
                <Input 
                    label="Contraseña"
                    type="password"
                    {...register('password', { required: 'La contraseña es obligatoria' })}
                    error={errors.password?.message}
                />

                <div className="auth-button-container">
                    <Button type="submit">Ingresar</Button>
                </div>

                <p className="auth-footer-text">
                    ¿No tienes cuenta? <span className="auth-link" onClick={() => navigate('/register')}>Regístrate aquí</span>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;