// Core types for the application
export interface YouTubeVideo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  url: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  url: string;
  thumbnail?: string;
  category: string;
  description: string;
  descriptionEn?: string;
  tags?: string[];
  downloadUrl?: string;
  projectUrl?: string;
  featured?: boolean;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
  label: string;
}

export interface SupportLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
  label: string;
}


export type Theme = 'light' | 'dark';
export type Language = 'uk' | 'en';

export type AppContextType = {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  changeLanguage: (lang: Language) => void;
  translations: Translations | null;
  isLoading: boolean;
  error: string | null;
};

export interface Translations {
  common: {
    home: string;
    about: string;
    portfolio: string;
    contact: string;
    language: string;
    theme: string;
    loading?: string;
    error?: string;
    close?: string;
  };
  home: {
    title?: string;
    description: string;
    latestVideo: string;
    watchLive: string;
    aboutText?: {
      p: string[];
      span: string[];
    };
    roles?: {
      streamer: string;
      translator: string;
      blogger: string;
      artist: string;
      modder: string;
    };
  };
  about: {
    title: string;
    description: string;
  };
  portfolio: {
    title: string;
    description: string;
    categories?: Record<string, string>;
    viewProject?: string;
    download?: string;
  };
  social: Record<string, string>;
  footer: {
    copyright: string;
    madeWith: string;
  };
  contact?: {
    title: string;
    description: string;
  };
}