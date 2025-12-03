import React from 'react';
import '../../shared/dashboard.css'; // Importamos los estilos para que se vea bien

function ProductDetailModal({ item, onClose }) {
    if (!item) return null;

    // Detectamos si es Orden o Producto
    const isOrder = item.totalAmount !== undefined;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                <div className="modal-header">
                    <h3 style={{margin: 0}}>
                        {isOrder ? 'Detalle de Orden' : 'Detalle de Producto'}
                    </h3>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>

                <div className="modal-body">
                    
                    {/* CASO A: PRODUCTO */}
                    {!isOrder && (
                        <>
                            <div className="modal-image-placeholder">📷</div>
                            <div className="modal-details">
                                <h2 style={{color: '#6b21a8', marginBottom: '10px'}}>{item.name}</h2>
                                <p><strong>SKU:</strong> {item.sku}</p>
                                <p><strong>Precio:</strong> <span style={{fontSize: '1.2em', color: '#10b981'}}>${item.currentUnitPrice}</span></p>
                                <p><strong>Stock:</strong> {item.stockQuantity}</p>
                                <p><strong>Estado:</strong> {item.isActive ? '✅ Activo' : '❌ Inactivo'}</p>
                                <hr style={{margin: '10px 0', border: 0, borderTop: '1px solid #eee'}}/>
                                <p><strong>Descripción:</strong> {item.description || "Sin descripción."}</p>
                            </div>
                        </>
                    )}

                    {/* CASO B: ORDEN */}
                    {isOrder && (
                        <div className="modal-details">
                            <h2 style={{color: '#6b21a8', marginBottom: '10px'}}>
                                Orden #{item.id.toString().substring(0, 8)}...
                            </h2>
                            <p><strong>Cliente ID:</strong> {item.customerId}</p>
                            {/* Validamos si hay fecha antes de formatear */}
                            {item.date && (
                                <p><strong>Fecha:</strong> {new Date(item.date).toLocaleDateString()}</p>
                            )}
                            <p><strong>Estado:</strong> <span style={{fontWeight: 'bold', color: '#6366f1'}}>{item.status || "Pending"}</span></p>
                            <hr style={{margin: '10px 0', border: 0, borderTop: '1px solid #eee'}}/>
                            
                            <h4 style={{marginBottom: '5px'}}>Total a Pagar</h4>
                            <p style={{fontSize: '1.5em', fontWeight: 'bold', color: '#10b981'}}>
                                ${item.totalAmount}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}

export default ProductDetailModal;