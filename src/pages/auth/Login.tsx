import { FormProvider, useForm } from 'react-hook-form';
import { Form } from '../../components/form/Form';
import './auth.css';
import { loginUser, registerUser, setAccessToken } from '../../api/helpers';
import { useContext, useState } from 'react';
import { ChatContext } from '../../context';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../api/authService';
import { Toast } from '../../components/toast/Toast';

interface FormValues {
  login: string;
  password: string;
  passwordConfirm: string;
}

export const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const context = useContext(ChatContext);
  const navigate = useNavigate();

  const fields = [
    {
      name: 'login',
      type: 'login',
      placeholder: 'Login',
      required: true,
      errorText: 'Please enter a valid Login',
      errorRegex: /^[a-zA-Z0-9]{6,}$/,
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      required: true,
      errorText: 'Please enter a valid password',
      errorRegex: /^[a-zA-Z0-9]{6,}$/,
    },
  ];

  const defaultValues = {
    login: '',
    password: '',
  };

  const methods = useForm<FormValues>({
    defaultValues,
  });

  const login = async ({ login, password }: FormValues) => {
    setLoading(true);
    try {
      const user = await loginUser({ login, password });
      if (user) {
        context?.setUser(user);
        setAccessToken(user.accessToken);
        AuthService.saveTokens(user.accessToken, user.refreshToken);
        navigate('/chat');
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="registration-wrapper">
      <div className={`${loading ? 'loader' : ''}`}></div>

      <FormProvider {...methods}>
        <Form fields={fields} title="Login" />
      </FormProvider>
      <button className="auth-btn" onClick={methods.handleSubmit(login)}>
        Sign in
      </button>
      
      <Link className="auth-link" to={'/registration'}>
        I don't have an account
      </Link>
      {error && (
        <Toast message={error} type="error" onClose={() => setError('')} />
      )}
    </div>
  );
};
