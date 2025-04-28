import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'mati' | 'sofi';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as Theme) || 'sofi';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    // Apply theme to document body
    document.body.className = theme === 'mati' 
      ? 'bg-mati-50 text-mati-700'
      : 'bg-purple-50 text-slate-800';
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === 'mati' ? 'sofi' : 'mati'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};