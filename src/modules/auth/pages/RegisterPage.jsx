import React from 'react';

import RegisterForm from "../components/RegisterForm"



// TÚ DIJISTE: RegisterPage.jsx ES ADMIN
export default function RegisterPage() {
  return (
    <div className='flex flex-col justify-center h-[100dvh] bg-neutral-100 sm:items-center'>
      
      {/* Admin ve el selector de roles */}
      <RegisterForm showRole={true} />

    </div>
  );
}
