import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';
import '../shared/Footer.css'; // Importamos los estilos

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        
        {/* COLUMNA 1: SOBRE NOSOTROS */}
        <div className="footer-section">
          <h3>Mi Tienda Real</h3>
          <p>
            Ofrecemos los mejores productos con la mejor calidad del mercado. 
            Comprometidos con la satisfacción de nuestros clientes desde 2025.
          </p>
        </div>

        {/* COLUMNA 2: CONTACTO */}
        <div className="footer-section">
          <h3>Contáctanos</h3>
          <ul className="footer-links">
            <li>
                <FaMapMarkerAlt style={{ marginRight: '8px' }} /> 
                Av. Siempreviva 742, Tucumán
            </li>
            <li>
                <FaPhone style={{ marginRight: '8px' }} /> 
                +54 9 381 123 4567
            </li>
            <li>
                <FaEnvelope style={{ marginRight: '8px' }} /> 
                contacto@mitiendareal.com
            </li>
          </ul>
        </div>

        {/* COLUMNA 3: REDES SOCIALES */}
        <div className="footer-section">
          <h3>Síguenos</h3>
          <p>Entérate de las últimas ofertas y novedades.</p>
          <div className="social-icons">
            <a href="#" className="social-icon"><FaFacebook /></a>
            <a href="#" className="social-icon"><FaInstagram /></a>
            <a href="#" className="social-icon"><FaTwitter /></a>
            <a href="#" className="social-icon"><FaWhatsapp /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Mi Tienda Real. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;