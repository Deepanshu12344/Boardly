import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password) => {
    try {
      const res = await axios.post('http://localhost:8000/api/register', {
        name,
        email,
        password,
      });

      const userData = res.data.user || res.data; // fallback for plain response

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      const message =
        error.response?.data?.message || 'Registration failed';
      throw new Error(message);
    }
  };

 const login = async (email, password) => {
  try {
    const res = await axios.post('http://localhost:8000/api/login', {
      email,
      password,
    });

    const { token, user } = res.data;

    // Store token and user in localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    setUser(user);
    return res.data; // return both token and user
  } catch (error) {
    const message =
      error.response?.data?.message || 'Login failed';
    throw new Error(message);
  }
};


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
