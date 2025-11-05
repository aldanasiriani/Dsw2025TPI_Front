import { useForm } from 'react-hook-form';
import Input from './Input';
import Button from './Button';
import { useState } from 'react';
import { frontendErrorMessage } from '../helpers/backendError';
import { registerUser } from "../services/register";


function RegisterForm() {
  const [errorMessage, setErrorMessage] = useState('');
  const {
    register: formRegister,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues: { username: '',email: '',role:'', password: '', confirmPassword: '' } });

    const password = watch('password');
  const onValid = async (formData) => {
    try {
      const { data, error } = await registerUser(formData.username, formData.email, formData.role ,formData.password, formData.confirmPassword);

        if (error) {
         const message =
         frontendErrorMessage[error.code] || 'Error desconocido. Intente nuevamente.';
         setErrorMessage(message);
        return;
         }

      console.log('Registro exitoso:',data);

    } catch (error) {
      console.error(error);
      setErrorMessage('Llame a soporte');
    }
  };

  return (
    <form className='
        flex
        flex-col
        gap-20
        bg-white
        p-8
        sm:w-md
        sm:gap-4
        sm:rounded-lg
        sm:shadow-lg
      '
    onSubmit={handleSubmit(onValid)}
    >
      <Input
        label='Usuario'
        { ...formRegister('username', {
          required: 'Usuario es obligatorio',
        }) }
        error={errors.username?.message}
      />
        <Input
        label='Email'
        { ...formRegister('email', {
          required: 'Email es obligatorio',
        }) }
        error={errors.email?.message}
      />
       <label htmlFor="role">Role</label>
        <select id="role" {...formRegister('role', { required: 'Debe seleccionar un rol' })}>
         <option value="">Seleccione una opción</option>
         <option value="admin">Administrador</option>
         <option value="user">Usuario</option>
         </select>
  {errors.role && <p>{errors.role.message}</p>}

      <Input
        label='Contraseña'
        { ...formRegister('password', {
          required: 'Contraseña es obligatorio',
        }) }
        type='password'
        error={errors.password?.message}
      />
        <Input
        label='Confirmar contraseña'
        { ...formRegister('confirmPassword', {
          required: 'Confirmar contraseña es obligatorio',
              validate: (v) => v === password || 'Las contraseñas no coinciden',
        }) }
        type='password'
        error={errors.confirmPassword?.message}
      />

      <Button type='submit'>Registrar Usuario</Button>
      {errorMessage && <p className='text-red-500'>{errorMessage}</p>}
       <Button type="button" onClick={() => navigate('/login')}>
        Iniciar Sesión </Button>
    </form>
  );
};

export default RegisterForm;
