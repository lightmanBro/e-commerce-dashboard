import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token,setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://127.0.0.1:4000/validate-token', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(response => {
        setUser(response.data.user);
      })
      .catch(() => {
        localStorage.removeItem('token');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:4000/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.userData);
      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await axios.post('http://127.0.0.1:4000/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error.message);
      throw error;
    }
  };

  const registerAdmin = async (email, password) => {
    try {
      const response = await axios.post('http://127.0.0.1:4000/register', { email, password });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.message);
      throw error;
    }
  };
  
  return (
    <AuthContext.Provider value={{ user,token, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
