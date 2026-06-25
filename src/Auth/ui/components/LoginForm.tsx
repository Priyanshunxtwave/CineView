import { useState } from 'react';
import { CredentialsFormData } from '../../core/authSchemas';

interface LoginFormProps {
  onSubmit: (credentials: CredentialsFormData) => void;
  isLoading: boolean;
  serverError: string | null;
  fieldErrors: Record<string, string>;
}

export const LoginForm = ({ onSubmit, isLoading, serverError, fieldErrors }: LoginFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4 text-center">Sign In to CineView</h2>
      
      {serverError && (
        <div className="p-3 bg-red-900/50 border border-red-500 text-red-200 rounded text-sm">
          {serverError}
        </div>
      )}

      <div className="flex flex-col space-y-1">
        <label className="text-sm text-gray-300">Email</label>
        <input
          type="email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={`p-2 bg-gray-700 text-white rounded border ${fieldErrors.username ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'} outline-none`}
          placeholder="user@cineview.com"
        />
        {fieldErrors.username && <span className="text-xs text-red-400">{fieldErrors.username}</span>}
      </div>

      <div className="flex flex-col space-y-1 relative">
        <label className="text-sm text-gray-300">Password</label>
        <div className="relative flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`w-full p-2 bg-gray-700 text-white rounded border ${fieldErrors.password ? 'border-red-500' : 'border-gray-600 focus:border-blue-500'} outline-none`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-sm text-gray-400 hover:text-white"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        {fieldErrors.password && <span className="text-xs text-red-400">{fieldErrors.password}</span>}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-6 p-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded transition disabled:opacity-50"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
};