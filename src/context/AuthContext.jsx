import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [token, setToken] = useState(Cookies.get('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = Cookies.get('token');
    if (storedToken) {
      axios.get('https://api.citratechsolar.com/validate-token', {
        headers: { Authorization: `Bearer ${storedToken}` }
      })
      .then(response => {
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log(response.data.user)
      })
      .catch(() => {
        Cookies.remove('token');
        localStorage.removeItem('user');
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = async (email, password) => {
    try {
      const response = await axios.post('https://api.citratechsolar.com/login', { email, password });
      const token = response.data.token;
      const userData = response.data.userData;

      setToken(token);
      setUser(userData);

      Cookies.set('token', token, { expires: 7 });
      localStorage.setItem('user', JSON.stringify(userData));
      console.log(userData)
      return response.data;
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await axios.post('https://api.citratechsolar.com/logout', null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setToken(null);
      setUser(null);

      Cookies.remove('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout failed:', error.message);
      throw error;
    }
  };

  const registerAdmin = async (email, password) => {
    try {
      const response = await axios.post('https://api.citratechsolar.com/register', { email, password });
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser, registerAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
