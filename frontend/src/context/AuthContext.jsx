import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initUser = async () => {
      let storedUser = localStorage.getItem('dormis_user');
      let role = localStorage.getItem('dormis_role') || 'student';
      
      if (!storedUser) {
        // Create mock user
        storedUser = `student${Math.floor(Math.random() * 1000)}@poornima.edu.in`;
        localStorage.setItem('dormis_user', storedUser);
      }

      try {
        // Fetch or create user in DB
        const res = await axios.post('http://localhost:5000/api/users/login-mock', {
          userId: storedUser,
          name: storedUser.split('@')[0],
          email: storedUser,
          role: role
        });
        setUser({ ...res.data.data, role });
      } catch (err) {
        console.error("Failed to mock login", err);
      } finally {
        setLoading(false);
      }
    };
    initUser();
  }, []);

  const toggleRole = () => {
    const newRole = user?.role === 'admin' ? 'student' : 'admin';
    localStorage.setItem('dormis_role', newRole);
    setUser({ ...user, role: newRole });
    window.dispatchEvent(new Event('roleChange'));
  };

  return (
    <AuthContext.Provider value={{ user, loading, toggleRole }}>
      {children}
    </AuthContext.Provider>
  );
};
