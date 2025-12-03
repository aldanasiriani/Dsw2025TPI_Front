import React from 'react';

import RegisterForm from "../components/RegisterForm"

// TÚ DIJISTE: RegisterPageCustomer.jsx ES CLIENTE
export default function RegisterPageCustomer() {
  return (
    <div className='flex flex-col justify-center h-[100dvh] bg-neutral-100 sm:items-center'>
      
      {/* Cliente NO ve el selector (automático) */}
      <RegisterForm showRole={false} />

    </div>
  );
}