import React from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../../shared/dashboard.css'; // Asegúrate de importar tus estilos
import '../../shared/pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {

  // Lógica para generar los números de página (Para PC)
  const getPageNumbers = () => {
    const pages = [];
    
    // Si hay pocas páginas (menos de 7), mostrar todas
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Siempre mostrar la primera
      pages.push(1);

      // Puntos suspensivos inicio
      if (currentPage > 3) {
        pages.push('...');
      }

      // Rango alrededor de la página actual
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Ajustes si estamos muy cerca del principio o final
      if (currentPage <= 3) { end = 4; }
      if (currentPage >= totalPages - 2) { start = totalPages - 3; }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Puntos suspensivos final
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Siempre mostrar la última
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handlePrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  // Si solo hay 1 página, no mostramos nada
  if (totalPages <= 1) return null;

  return (
    <div className="pagination-wrapper">
      
      {/* --- VERSIÓN MOBILE (Solo flechas y texto) --- */}
      <div className="pagination-mobile">
        <button 
          className="page-btn-text" 
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <FaArrowLeft className="icon-sm" /> Previous
        </button>

        <span className="page-info-mobile">
            {currentPage} / {totalPages}
        </span>

        <button 
          className="page-btn-text" 
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next <FaArrowRight className="icon-sm" />
        </button>
      </div>


      {/* --- VERSIÓN PC (Números completos) --- */}
      <div className="pagination-pc">
        
        {/* Botón Previous */}
        <button 
          className="page-btn-text" 
          onClick={handlePrevious}
          disabled={currentPage === 1}
        >
          <FaArrowLeft className="icon-sm" /> Previous
        </button>

        {/* Lista de Números */}
        <div className="page-numbers-container">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? onPageChange(page) : null}
              className={`page-number ${page === currentPage ? 'active' : ''} ${page === '...' ? 'dots' : ''}`}
              disabled={page === '...'}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Botón Next */}
        <button 
          className="page-btn-text" 
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next <FaArrowRight className="icon-sm" />
        </button>
      </div>

    </div>
  );
};

export default Pagination;