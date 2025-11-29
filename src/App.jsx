// Archivo: src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
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
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/products" element={<CustomerProductPage />}/>
        <Route path="/cart" element={<CartPage />} />
        
        {/* 🛡️ ZONA PROTEGIDA (El guardia envuelve estas rutas) */}
        <Route element={<ProtectedRoute />}>
            {/* Aquí adentro solo entras si tienes Token */}
            <Route path="/admin" element={<Dashboard/>}/>
            <Route path="/admin/products/create" element={<CreateProductPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;