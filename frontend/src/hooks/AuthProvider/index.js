/* eslint-disable react/prop-types */
import { createContext, useState, useContext, useCallback } from 'react';
import { getTTK, storeToken, storeUser, getStoredUser } from 'utils/helper';

const AuthContext = createContext(null);

function getUser() {
  const storedUser = getStoredUser();
  if (!storedUser) return null;
  const isValid = new Date().getTime() < storedUser.ttk;
  return isValid ? storedUser : null;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());

  const login = useCallback(({ user, token }) => {
    const ttk = getTTK();
    const userWithTtk = { ...user, ttk };
    storeToken(token);
    storeUser(userWithTtk);
    setUser(userWithTtk);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const validateUser = useCallback(() => {
    if (!user) return false;
    return new Date().getTime() < user.ttk;
    // TODO: add server-side token validation
  }, [user]);

  const contextValue = {
    user,
    validateUser,
    login,
    logout,
    isLoggedIn: !!user
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
