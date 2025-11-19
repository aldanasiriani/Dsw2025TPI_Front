// Archivo: src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Componente que verifica el estado de autenticación.
 * Si no está autenticado, redirige al login.
 */
function ProtectedRoute({ isAuthenticated, redirectPath = '/login' }) {
    
    // NOTA: En una aplicación real, 'isAuthenticated' vendría de un AuthContext o Redux.

    if (!isAuthenticated) {
        // Si no está logueado, lo envía a /login
        return <Navigate to={redirectPath} replace />;
    }

    // Si está logueado, renderiza el componente anidado (<Dashboard />)
    return <Outlet />;
}

export default ProtectedRoute;