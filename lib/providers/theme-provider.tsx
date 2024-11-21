import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext<{
  theme: string;
  toggleTheme: () => void;
}>({
  theme: 'light',
  toggleTheme: () => {}
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('light');

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  // Save theme to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Toggle between light and dark themes
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext); 