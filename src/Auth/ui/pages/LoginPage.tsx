import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { sessionService } from '../../data/sessionService';
import { CredentialsSchema, CredentialsFormData } from '../../core/authSchemas';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (sessionService.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (data: CredentialsFormData) => {
    setIsLoading(true);
    setServerError(null);
    setFieldErrors({});

    // 1. Zod Safe Validation (No try/catch needed)
    const validation = CredentialsSchema.safeParse(data);
    
    if (!validation.success) {
      // TypeScript knows exactly what validation.error is here
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) errors[err.path[0].toString()] = err.message;
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return; // Stop execution if validation fails
    }

    // 2. Data Layer Authentication
    try {
      const success = await sessionService.login(validation.data);
      
      if (success) {
        const searchParams = new URLSearchParams(location.search);
        const redirectPath = searchParams.get('redirect') || '/';
        navigate(redirectPath, { replace: true });
      } else {
        setServerError('Invalid email or password.');
      }
    } catch {
        setServerError('An unexpected error occurred. Please try again.');
      } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <LoginForm 
        onSubmit={handleLogin} 
        isLoading={isLoading} 
        serverError={serverError}
        fieldErrors={fieldErrors}
      />
    </div>
  );
};