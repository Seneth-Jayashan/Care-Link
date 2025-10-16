import { useForm } from 'react-hook-form';
import api from '../../api/api';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const onSubmit = async data => {
    try {
      const res = await api.post('/auth/login', data);
      if (res.data.twoFA) {
        localStorage.setItem('tempToken', res.data.tempToken);
        navigate('/2fa');
      } else {
        setUser(res.data.user);
        navigate('/dashboard');
        toast.success('Logged in!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input {...register('email')} type="email" placeholder="Email" className="input" />
      <input {...register('password')} type="password" placeholder="Password" className="input" />
      <button type="submit" className="btn btn-primary w-full">Login</button>
    </form>
  );
}
