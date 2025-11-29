import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // 1. Buscamos el token directamente en el almacenamiento
    const token = localStorage.getItem('token');

    // 2. Si NO hay token, pateamos al usuario al Login
    // 'replace' borra el historial para que no pueda volver atrás
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // 3. Si SÍ hay token, abrimos la puerta (mostramos el contenido)
    return <Outlet />;
};

export default ProtectedRoute;