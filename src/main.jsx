import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './elements.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider> {/* envuelve la app para que se conecte a BD */}
      <App />
    </CartProvider>
  </StrictMode>,
);