import React, { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { AppContextType } from '../types';
import { useTheme, useTranslations } from '../hooks';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const { language, translations, isLoading, changeLanguage, error } = useTranslations();

  const value: AppContextType = {
    theme,
    language,
    translations,
    toggleTheme,
    changeLanguage,
    isLoading,
    error,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
