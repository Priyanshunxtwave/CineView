import { Credentials } from '../core/authTypes';
import { AUTH_CONSTANTS } from '../core/authConstants';

export const sessionService = {
  login: async (credentials: Credentials): Promise<boolean> => {
    // Simulate a brief network delay for realism
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (
      credentials.username === AUTH_CONSTANTS.VALID_USERNAME &&
      credentials.password === AUTH_CONSTANTS.VALID_PASSWORD
    ) {
      // Generate a dummy token to represent an active session
      const mockToken = crypto.randomUUID ? crypto.randomUUID() : 'session-token-999';
      sessionStorage.setItem(AUTH_CONSTANTS.SESSION_KEY, mockToken);
      return true;
    }
    
    return false;
  },

  logout: (): void => {
    sessionStorage.removeItem(AUTH_CONSTANTS.SESSION_KEY);
  },

  isAuthenticated: (): boolean => {
    return sessionStorage.getItem(AUTH_CONSTANTS.SESSION_KEY) !== null;
  },
};