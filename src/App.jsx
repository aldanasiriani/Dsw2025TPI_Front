import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';                 // ESTE ES EL ADMIN
import RegisterPageCustomer from './modules/auth/pages/RegisterPageCustomer'; // ESTE ES EL CLIENTE

import CustomerProductPage from './modules/auth/pages/CustomerProductPage';
import Dashboard from './modules/auth/components/Dashboard';
import CreateProductPage from './modules/auth/pages/CreateProductPage';
import ProtectedRoute from './modules/auth/components/ProtectedRoute';
import CartPage from './modules/auth/pages/CartPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Navigate to="/products" replace />} />
        <Route path="/login" element={<LoginPage />} /> 
        
        {/* CORRECCIÓN DE RUTAS: */}
        
        {/* 1. Ruta pública para clientes (/register) -> Carga RegisterPageCustomer */}
        <Route path="/register" element={<RegisterPageCustomer />} />
        
        {/* 2. Ruta para el carrito también usa el de cliente */}
        <Route path="/checkout-register" element={<RegisterPageCustomer />} />

        {/* 3. Ruta oculta para crear Admins -> Carga RegisterPage */}
        <Route path="/register-admin" element={<RegisterPage />} />


        <Route path="/products" element={<CustomerProductPage />}/>
        <Route path="/cart" element={<CartPage />} />
        
        {/* 🛡️ ZONA PROTEGIDA */}
        <Route element={<ProtectedRoute />}>
            <Route path="/admin" element={<Dashboard/>}/>
            <Route path="/admin/products/create" element={<CreateProductPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;