import { FormProvider, useForm } from 'react-hook-form';
import { Form } from '../../components/form/Form';
import './auth.css';
import { registerUser, setAccessToken } from '../../api/helpers';
import { useContext, useState } from 'react';
import { ChatContext } from '../../context';
import { useNavigate } from 'react-router-dom';
import { Toast } from '../../components/toast/Toast';
import AuthService from '../../api/authService';

interface FormValues {
  login: string;
  password: string;
  passwordConfirm: string;
}

export const RegistrationPage = () => {
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
    {
      name: 'passwordConfirm',
      type: 'password',
      placeholder: 'Confirm Password',
      required: true,
      errorText: 'Passwords do not match',
      errorRegex: /^[a-zA-Z0-9]{6,}$/,
    },
  ];

  const defaultValues = {
    login: '',
    password: '',
    passwordConfirm: '',
  };

  const methods = useForm<FormValues>({
    defaultValues,
  });

  const registration = async ({ login, password }: FormValues) => {
    setLoading(true);
    try {
      const user = await registerUser({ login, password });
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
        <Form fields={fields} title="Registration" />
      </FormProvider>
      <button className="auth-btn" onClick={methods.handleSubmit(registration)}>
        Sign up
      </button>
      {error && (
        <Toast message={error} type="error" onClose={() => setError('')} />
      )}
    </div>
  );
};
