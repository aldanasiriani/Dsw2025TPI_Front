
import LoginForm from "../components/LoginForm";

//import { useNavigate } from 'react-router-dom';

function LoginPage({onLoginSuccess}) {
  //const navigate = useNavigate();
  return (
    <div className='
      flex
      flex-col
      justify-center
      h-[100dvh]
      bg-neutral-100
      sm:items-center
    '>
      <LoginForm onLoginSuccess={onLoginSuccess}/>
     
    </div>

    
  );
}

export default LoginPage;
