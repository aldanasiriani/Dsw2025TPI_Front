import RegisterForm from '../components/RegisterForm';
import { useNavigate } from 'react-router-dom';


function RegisterPage() {
    const navigate = useNavigate();
  return (
    <div className='
      flex
      flex-col
      justify-center
      h-[100dvh]
      bg-neutral-100
      sm:items-center
    '>
      <RegisterForm />

       <button
          type="button"
          onClick={() => navigate('/login')}
          className="ml-1 text-blue-600 hover:underline"
        >
          Iniciar sesión
        </button>
    </div>
  );
}

export default RegisterPage;
