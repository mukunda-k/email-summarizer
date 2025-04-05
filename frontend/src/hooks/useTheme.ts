import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<string | null>(null);

  useEffect(() => {
    // Get theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    document.documentElement.classList.add(initialTheme);
    setTheme(initialTheme);

    return () => {
      document.documentElement.classList.remove('dark', 'light');
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove(theme!);
    document.documentElement.classList.add(newTheme);
    setTheme(newTheme);
  };

  return { theme, toggleTheme };
}; 