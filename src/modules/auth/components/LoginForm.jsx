import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import { login } from '../services/login'; 

function LoginForm() {
    const navigate = useNavigate();
    const location = useLocation();
    const [loginError, setLoginError] = useState(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // --- FUNCIÓN MÁGICA PARA LEER EL TOKEN ---
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
        
        // 1. Conectamos al Backend
        const { data, error } = await login(formData);

        if (error) {
            setLoginError("Credenciales inválidas o error en el servidor.");
        } else {
            console.log("Respuesta del login:", data); // Para depurar

            // 2. Guardamos el token
            // A veces viene como data.token, a veces directo en data
            const token = data.token || data; 
            localStorage.setItem('token', token);
            
            // 3. PRIORIDAD: ¿Venimos del Carrito?
            if (location.state?.from) {
                // Si venía del carrito, lo devolvemos ahí sin importar si es admin o cliente
                navigate(location.state.from); 
                return;
            }

            // 4. Decodificamos el token para buscar el ROL
            const decodedToken = parseJwt(token);
            console.log("Token decodificado:", decodedToken);

            // En .NET, el rol suele venir con este nombre largo raro:
            // "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            // O a veces simplemente "role"
            const roleClaim = 
                decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
                decodedToken["role"] || 
                "";

            // 5. Redirección según ROL
            if (roleClaim === 'Admin') {
                navigate('/admin'); // Panel de Administración
            } else {
                navigate('/products'); // Tienda (Cliente)
            }
        }
    };

    return (
        <div className="card-container" style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2 className="card-title" style={{ textAlign: 'center', marginBottom: '20px' }}>Iniciar Sesión</h2>
            
            {loginError && (
                 <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center'}}>
                    {loginError}
                 </div>
            )}

            <form onSubmit={handleSubmit(onValid)} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
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

                <div style={{ marginTop: '10px' }}>
                    <Button type="submit">Ingresar</Button>
                </div>

                <p style={{ textAlign: 'center', fontSize: '0.9em', marginTop: '10px' }}>
                    ¿No tienes cuenta? <span style={{ color: 'blue', cursor: 'pointer' }} onClick={() => navigate('/register')}>Regístrate aquí</span>
                </p>
            </form>
        </div>
    );
}

export default LoginForm;