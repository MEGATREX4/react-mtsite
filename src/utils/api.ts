// Type for completed games
export interface CompletedGame {
  name: string;
  steamId?: number;
  rating?: number | null;
  gameUrl?: string;
  youtubeUrl?: string;
  coverUrl?: string;
  tags?: string[];
  isCurrentlyPlaying?: boolean;
}

export const loadCompletedGames = async (): Promise<CompletedGame[]> => {
  try {
    const response = await fetch('/completedGames.json');
    const data = await response.json();
    // Validate and map to CompletedGame type
    return Array.isArray(data)
      ? data.map((game) => ({
          name: game.name || '',
          steamId: game.steamId,
          rating: game.rating,
          gameUrl: game.gameUrl,
          youtubeUrl: game.youtubeUrl,
          coverUrl: game.coverUrl,
          tags: game.tags || [],
          isCurrentlyPlaying: game.isCurrentlyPlaying || false,
        }))
      : [];
  } catch (error) {
    console.error('Error loading completed games:', error);
    return [];
  }
};
import type { GalleryImage, YouTubeVideo } from '../types';

// YouTube API configuration
const YOUTUBE_API_KEY = '#';
const YOUTUBE_CHANNEL_ID = '#';
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

export const fetchLatestVideo = async (): Promise<YouTubeVideo | null> => {
  try {
    // Check cache first
    const cachedData = localStorage.getItem('youtubeCachedData');
    if (cachedData) {
      const { video, timestamp } = JSON.parse(cachedData);
      if (Date.now() - timestamp < CACHE_DURATION) {
        return video;
      }
    }

    // Fetch from API
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=1&type=video`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch YouTube data');
    }

    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      const video: YouTubeVideo = {
        id: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high.url,
        publishedAt: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      };

      // Cache the result
      localStorage.setItem('youtubeCachedData', JSON.stringify({
        video,
        timestamp: Date.now()
      }));

      return video;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching YouTube video:', error);
    return null;
  }
};

export const loadGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const response = await fetch('/images.json');
    const data = await response.json();
    
    const mappedImages = data.galeryimages.map((img: any, index: number) => ({
      id: img.id || index.toString(),
      url: img.url || '',
      title: img.title || '',
      description: img.description || '',
      descriptionEn: img.descriptionEn,
      category: img.category || 'uncategorized',
      tags: img.tags || [],
      downloadUrl: img.downloadUrl,
      projectUrl: img.projectUrl,
      featured: img.featured || false,
      variants: img.variants || undefined, // Include variants array from JSON
    }));
    
    // Debug: Log items with variants
    const itemsWithVariants = mappedImages.filter((img: GalleryImage) => img.variants && img.variants.length > 0);
    if (itemsWithVariants.length > 0) {
      console.log('Items with variants found:', itemsWithVariants.map((img: GalleryImage) => ({ id: img.id, title: img.title, variants: img.variants })));
    }
    
    return mappedImages;
  } catch (error) {
    console.error('Error loading gallery images:', error);
    return [];
  }
};

export const getCategoryDisplayName = (category: string, language: string): string => {
  const categoryNames: Record<string, Record<string, string>> = {
    uk: {
      'art': '2D Арт/Спрайти',
      '3dmodels': '3D Моделі',
      'mods': 'Моди',
      'projects': 'Проєкти',
      'resourcepack': 'Ресурс паки',
      'modpack': 'Збірки модів',
      'article': 'Статті',
      'thumbnail': 'Обкладинки',
      'website': 'Вебсайти',
      'webapp': 'Веб додатки',
      'other': 'Інші'
    },
    en: {
      'art': '2D Art/Sprites',
      '3dmodels': '3D Models',
      'mods': 'Mods',
      'projects': 'Projects',
      'resourcepack': 'Resource Packs',
      'modpack': 'Modpacks',
      'article': 'Articles',
      'thumbnail': 'Thumbnails',
      'website': 'Websites',
      'webapp': 'Web Apps',
      'other': 'Other',
    }
  };

  return categoryNames[language]?.[category] || category;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};
