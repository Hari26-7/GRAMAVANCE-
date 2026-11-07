import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';
export type TextSize = 'normal' | 'large' | 'xl';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  textSize: TextSize;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  setTextSize: (size: TextSize) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem('gramavance_theme');
    if (saved === 'dark') return 'dark';
    return 'light'; // Always force Light Mode as the primary default!
  });

  const [textSize, setTextSizeState] = useState<TextSize>(() => {
    const saved = localStorage.getItem('gramavance_text_size') as TextSize;
    if (saved === 'normal' || saved === 'large' || saved === 'xl') return saved;
    return 'normal';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('gramavance_high_contrast') === 'true';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    localStorage.setItem('gramavance_theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('text-size-normal', 'text-size-large', 'text-size-xl');
    root.classList.add(`text-size-${textSize}`);
    localStorage.setItem('gramavance_text_size', textSize);
  }, [textSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('gramavance_high_contrast', String(highContrast));
  }, [highContrast]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const increaseTextSize = () => {
    if (textSize === 'normal') setTextSizeState('large');
    else if (textSize === 'large') setTextSizeState('xl');
  };

  const decreaseTextSize = () => {
    if (textSize === 'xl') setTextSizeState('large');
    else if (textSize === 'large') setTextSizeState('normal');
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
  };

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        textSize,
        increaseTextSize,
        decreaseTextSize,
        setTextSize,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
