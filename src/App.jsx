// Archivo: src/App.jsx

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './modules/auth/pages/LoginPage';
import RegisterPage from './modules/auth/pages/RegisterPage';
import Dashboard from './modules/auth/components/Dashboard';
// import ProtectedRoute from './components/ProtectedRoute'; // 💡 Ya no lo necesitamos por ahora

function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false); // Ya no es necesario

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        
        {/* 💡 RUTA DESPROTEGIDA TEMPORALMENTE */}
        <Route path="/admin" element={<Dashboard/>}/>
        
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
