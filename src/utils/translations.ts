import type { Translations, Language } from '../types';

export const loadTranslations = async (language: Language): Promise<Translations> => {
  try {
    // For development, we'll create mock translations since XML loading might not work in dev
    if (language === 'uk') {
      return {
        common: {
          home: 'Головна',
          portfolio: 'Портфоліо',
          completedGames: 'Пройдені ігри',
          about: 'Про мене',
          contact: 'Контакти',
          language: 'Мова',
          theme: 'Тема',
          loading: 'Завантаження...',
          error: 'Помилка',
          close: 'Закрити',
        },
        home: {
          title: 'MEGATREX4 - Стрімер і контент-мейкер',
          description: 'Засновник аматорської перекладацької спільноти "СУМ Майнкрафт", роблю розважальний контент на YouTube та Twitch',
          aboutText: {
            p: ['Засновник аматорської перекладацької спільноти', ', роблю розважальний контент на ', ' та '],
            span: ['"СУМ Майнкрафт"', 'YouTube', 'Twitch']
          },
          latestVideo: 'Останнє відео',
          watchLive: 'Дивитися наживо',
          roles: {
            streamer: 'Стрімер',
            translator: 'Перекладач',
            blogger: 'Блогер',
            artist: '3D Художник',
            modder: 'Моддер'
          }
        },
        about: {
          title: 'Про мене',
          description: 'Тут буде інформація про автора.'
        },
        portfolio: {
          title: 'Портфоліо MEGATREX4',
          description: 'Мої роботи та проєкти',
          categories: {
            threeModels: '3D Моделі',
            twoart: '2D Арт/Спрайти',
            mods: 'Моди',
            projects: 'Проєкти',
            resourcepack: 'Ресурс паки',
            modpack: 'Збірки модів',
            article: 'Статті',
            thumbnail: 'Обкладинки',
          },
          viewProject: 'Переглянути проєкт',
          download: 'Завантажити',
        },
        social: {
          youtube: 'YouTube',
          twitch: 'Twitch',
          discord: 'Discord',
          twitter: 'Twitter',
          tiktok: 'TikTok',
          mastodon: 'Mastodon',
          instagram: 'Instagram',
          bluesky: 'BlueSky',
          spotify: 'Spotify',
          mono: 'Monobank',
          donatello: 'Donatello',
          sumtrans: 'СУМ Переклад',
        },
        footer: {
          copyright: '© 2024 MEGATREX4. Всі права захищені.',
          madeWith: 'Зроблено з ❤️ в Україні',
        },
      };
    } else {
      return {
        common: {
          home: 'Home',
          portfolio: 'Portfolio',
          completedGames: 'Completed Games',
          about: 'About',
          contact: 'Contact',
          language: 'Language',
          theme: 'Theme',
          loading: 'Loading...',
          error: 'Error',
          close: 'Close',
        },
        home: {
          title: 'MEGATREX4 - Streamer & Content Creator',
          description: 'Founder of the amateur translation community "СУМ Майнкрафт", creating entertaining content on YouTube and Twitch',
          aboutText: {
            p: ['Founder of the amateur translation community', ', creating entertaining content on ', ' and '],
            span: ['"СУМ Майнкрафт"', 'YouTube', 'Twitch']
          },
          latestVideo: 'Latest Video',
          watchLive: 'Watch Live',
          roles: {
            streamer: 'Streamer',
            translator: 'Translator',
            blogger: 'Blogger',
            artist: '3D Artist',
            modder: 'Modder'
          }
        },
        about: {
          title: 'About',
          description: 'This will contain information about the author.'
        },
        portfolio: {
          title: 'MEGATREX4 Portfolio',
          description: 'My works and projects',
          categories: {
            threeModels: '3D Models',
            twoart: '2D Art/Sprites',
            mods: 'Mods',
            projects: 'Projects',
            resourcepack: 'Resource Packs',
            modpack: 'Modpacks',
            article: 'Articles',
            thumbnail: 'Thumbnails',
          },
          viewProject: 'View Project',
          download: 'Download',
        },
        social: {
          youtube: 'YouTube',
          twitch: 'Twitch',
          discord: 'Discord',
          twitter: 'Twitter',
          tiktok: 'TikTok',
          mastodon: 'Mastodon',
          instagram: 'Instagram',
          bluesky: 'BlueSky',
          spotify: 'Spotify',
          mono: 'Monobank',
          donatello: 'Donatello',
          sumtrans: 'СУМ Translation',
        },
        footer: {
          copyright: '© 2024 MEGATREX4. All rights reserved.',
          madeWith: 'Made with ❤️ in Ukraine',
        },
      };
    }
  } catch (error) {
    console.error('Error loading translations:', error);
    throw error;
  }
};

export const getStoredLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('language') as Language;
    if (stored && ['uk', 'en'].includes(stored)) {
      return stored;
    }
  }
  return 'uk'; // default to Ukrainian
};

export const getStoredTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('theme');
    if (stored && ['light', 'dark'].includes(stored)) {
      return stored as 'light' | 'dark';
    }
    // Check system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};
