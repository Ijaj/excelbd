/* eslint-disable react/prop-types */
import { useState, useEffect, createContext, useContext } from 'react';

const ThemeManagerContext = createContext();

/**
 * @typedef {'elegant' | 'pastel' | 'neon' | 'vibrant'} ThemeStyle
 */

/**
 * @typedef {'dark' | 'light'} ThemeMode
 */

/**
 * ThemeManagerProvider manages current theme and theme mode.
 */
export const ThemeManagerProvider = ({ children }) => {
  const [theme, setTheme] = useState('default');
  const [mode, setMode] = useState('light');

  useEffect(() => {
    const storedMode = localStorage.getItem('themeMode');
    if (storedMode) setMode(storedMode);
  }, []);

  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const value = {
    theme,
    setTheme,
    mode,
    setMode
  };

  return <ThemeManagerContext.Provider value={value}>{children}</ThemeManagerContext.Provider>;
};

/**
 * Custom hook to use ThemeManager
 */
export const useThemeManager = () => useContext(ThemeManagerContext);
