import React, {
  createContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Stored user parse failed:', error);
        }
      }

      try {
        const currentUser = await authService.getCurrentUser();

        setUser(currentUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(currentUser));
      } catch (error) {
        console.error('Auth restore failed:', error);

        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('currentOrganization');

          setUser(null);
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (userData) => {
    try {
      setLoading(true);

      const response = await authService.register(userData);

      if (response.user && response.token) {
        setUser(response.user);
        setIsAuthenticated(true);
        toast.success('Registration successful! Welcome to Sprintly.');

        return {
          success: true,
          user: response.user
        };
      }

      setUser(null);
      setIsAuthenticated(false);

      if (response.requiresEmailVerification) {
        toast.success(
          response.message || 'Registration successful. Please verify your email.'
        );
      } else {
        toast.success(response.message || 'Registration successful.');
      }

      return {
        success: true,
        requiresEmailVerification: response.requiresEmailVerification,
        email: response.email
      };
    } catch (error) {
      const payload = error.response?.data || {};
      const message = payload.message || 'Registration failed';

      toast.error(message);

      return {
        success: false,
        error: message,
        requiresEmailVerification: payload.requiresEmailVerification,
        email: payload.email
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);

      const response = await authService.login(credentials);

      setUser(response.user);
      setIsAuthenticated(true);

      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      toast.success('Welcome back!');

      return {
        success: true,
        user: response.user
      };
    } catch (error) {
      const payload = error.response?.data || {};
      const message = payload.message || 'Login failed';

      toast.error(message);

      return {
        success: false,
        error: message,
        requiresEmailVerification: payload.requiresEmailVerification,
        email: payload.email
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(async (showToast = true) => {
    await authService.logout();

    setUser(null);
    setIsAuthenticated(false);

    if (showToast) {
      toast.info('You have been logged out');
    }
  }, []);

  const updateProfile = async (userData) => {
    try {
      setLoading(true);

      const response = await authService.updateProfile(userData);
      const updatedUser = response.data;

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success('Profile updated successfully');

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';

      toast.error(message);

      return {
        success: false,
        error: message
      };
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (file) => {
    try {
      setLoading(true);

      const response = await authService.uploadProfileImage(file);
      const updatedUser = response.data?.user;

      if (updatedUser) {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      toast.success(response.message || 'Profile image uploaded successfully');

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to upload image';

      toast.error(message);

      return {
        success: false,
        error: message
      };
    } finally {
      setLoading(false);
    }
  };

  const removeProfileImage = async () => {
    try {
      setLoading(true);

      const response = await authService.removeProfileImage();
      const updatedUser = response.data;

      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      toast.success(response.message || 'Profile image removed successfully');

      return {
        success: true,
        user: updatedUser
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove image';

      toast.error(message);

      return {
        success: false,
        error: message
      };
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async (passwords) => {
    try {
      setLoading(true);

      const response = await authService.updatePassword(passwords);

      if (response.user) {
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
      }

      toast.success('Password updated successfully');

      return {
        success: true
      };
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed';

      toast.error(message);

      return {
        success: false,
        error: message
      };
    } finally {
      setLoading(false);
    }
  };

  const authContextValue = {
    user,
    setUser,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    updateProfile,
    uploadProfileImage,
    removeProfileImage,
    updatePassword
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};