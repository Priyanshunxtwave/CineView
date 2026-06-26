import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CredentialsFormData } from '../../core/authSchemas';

interface LoginFormProps {
  onSubmit: (credentials: CredentialsFormData) => void;
  isLoading: boolean;
  serverError: string | null;
  fieldErrors: Record<string, string>;
}

export const LoginForm = ({ onSubmit, isLoading, serverError, fieldErrors }: LoginFormProps) => {
  const { t } = useTranslation('auth');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  const inputBase =
    'p-2 rounded border outline-none transition-colors bg-white text-slate-900 dark:bg-gray-700 dark:text-white';
  const inputNormal =
    'border-slate-300 focus:border-blue-500 dark:border-gray-600 dark:focus:border-blue-500';
  const inputError = 'border-red-500 focus:border-red-500';

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-4 w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-slate-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 text-center">
        {t('signInTitle')}
      </h2>

      {serverError && (
        <div className="p-3 bg-red-100 border border-red-400 text-red-700 dark:bg-red-900/50 dark:border-red-500 dark:text-red-200 rounded text-sm">
          {serverError}
        </div>
      )}

      <div className="flex flex-col space-y-1">
        <label className="text-sm text-slate-600 dark:text-gray-300">{t('email')}</label>
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`${inputBase} ${fieldErrors.username ? inputError : inputNormal}`}
          placeholder={t('emailPlaceholder')}
        />
        {fieldErrors.username && (
          <span className="text-xs text-red-500 dark:text-red-400">{fieldErrors.username}</span>
        )}
      </div>

      <div className="flex flex-col space-y-1 relative">
        <label className="text-sm text-slate-600 dark:text-gray-300">{t('password')}</label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full ${inputBase} ${fieldErrors.password ? inputError : inputNormal}`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-sm text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white"
          >
            {showPassword ? t('hidePassword') : t('showPassword')}
          </button>
        </div>
        {fieldErrors.password && (
          <span className="text-xs text-red-500 dark:text-red-400">{fieldErrors.password}</span>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 p-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded transition disabled:opacity-50"
      >
        {isLoading ? t('signingIn') : t('signIn')}
      </button>
    </form>
  );
};