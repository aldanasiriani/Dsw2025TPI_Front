import React from 'react';
// IMPORTANTE: Verifica que '../components/CreateProductForm' sea la ruta real

import CreateProductForm from "../../products/components/CreateProductForm"

function CreateProductPage() {
  return (
    <div className='min-h-screen bg-neutral-100 p-4'>
      <CreateProductForm />
    </div>
  );
}

export default CreateProductPage;