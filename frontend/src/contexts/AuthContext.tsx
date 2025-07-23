'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { LoginRequest, RegisterRequest } from '@/lib/api';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on app start
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        // If user data is corrupted, clear storage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      const response = await api.login(credentials);
      
      // Backend response: {status, message, token, username, role}
      if (response.status === 'success' && response.token) {
        const userData: User = {
          id: 0, // Will be updated when fetching profile
          username: response.username,
          fullName: response.username, // Will be updated when fetching profile
          email: '',
          role: response.role
        };

        // Store token and user data
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);

        // Fetch full profile after login
        try {
          const profileResponse = await api.getProfile();
          if (profileResponse.status === 'success' && profileResponse.profile) {
            const fullUserData: User = {
              id: profileResponse.profile.id,
              username: profileResponse.profile.username,
              fullName: profileResponse.profile.fullName,
              email: profileResponse.profile.email || '',
              role: profileResponse.profile.role,
              phone: profileResponse.profile.phone,
              address: profileResponse.profile.address
            };
            
            localStorage.setItem('user_data', JSON.stringify(fullUserData));
            setUser(fullUserData);
          }
        } catch (profileError) {
          console.warn('Could not fetch profile:', profileError);
          // Continue with basic user data
        }

        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Đăng nhập thất bại' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || 'Lỗi kết nối đến server';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      const response = await api.register(data);
      
      // Backend response: {status, message, token, username, role}
      if (response.status === 'success' && response.token) {
        const userData: User = {
          id: 0,
          username: response.username,
          fullName: data.fullName,
          email: '',
          role: response.role
        };

        // Store token and user data
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_data', JSON.stringify(userData));
        setUser(userData);

        return { success: true, message: response.message };
      } else {
        return { success: false, message: response.message || 'Đăng ký thất bại' };
      }
    } catch (error: any) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || 'Lỗi kết nối đến server';
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
    
    // Call backend logout (optional, for token blacklisting)
    api.logout().catch(console.error);
  };

  const refreshUserData = async () => {
    try {
      const profileResponse = await api.getProfile();
      if (profileResponse.status === 'success' && profileResponse.profile) {
        const fullUserData: User = {
          id: profileResponse.profile.id,
          username: profileResponse.profile.username,
          fullName: profileResponse.profile.fullName,
          email: profileResponse.profile.email || '',
          role: profileResponse.profile.role,
          phone: profileResponse.profile.phone,
          address: profileResponse.profile.address
        };
        
        localStorage.setItem('user_data', JSON.stringify(fullUserData));
        setUser(fullUserData);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'ADMIN';

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isAdmin,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}; 