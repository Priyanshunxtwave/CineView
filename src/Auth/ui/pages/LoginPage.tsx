import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoginForm } from '../components/LoginForm';
import { sessionService } from '../../data/sessionService';
import { CredentialsSchema, CredentialsFormData } from '../../core/authSchemas';

export const LoginPage = () => {
  const { t } = useTranslation('auth');
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

    const validation = CredentialsSchema.safeParse(data);

    if (!validation.success) {
      const errors: Record<string, string> = {};

      validation.error.issues.forEach((err) => {
        const field = err.path[0]?.toString();
        if (!field) return;

        if (field === 'username' && err.code === 'too_small') {
          errors.username = t('emailRequired');
        } else if (field === 'username' && err.code === 'invalid_format') {
          errors.username = t('emailInvalid');
        } else if (field === 'password' && err.code === 'too_small') {
          errors.password = t('passwordMin');
        }
      });

      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const success = await sessionService.login(validation.data);

      if (success) {
        const searchParams = new URLSearchParams(location.search);
        const redirectPath = searchParams.get('redirect') || '/';
        navigate(redirectPath, { replace: true });
      } else {
        setServerError(t('invalidCredentials'));
      }
    } catch {
      setServerError(t('unexpectedError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-gray-900 dark:text-white flex items-center justify-center p-4">
      <LoginForm
        onSubmit={handleLogin}
        isLoading={isLoading}
        serverError={serverError}
        fieldErrors={fieldErrors}
      />
    </div>
  );
};