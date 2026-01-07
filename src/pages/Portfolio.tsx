import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useAppContext } from '../components/AppProvider';
import { FeaturedProjects } from '../components/ProjectBanner';
import {PricingSection} from '../components/PricingSection';
import { loadGalleryImages, getCategoryDisplayName } from '../utils/api';
import type { GalleryImage } from '../types';
import type { ProjectBannerProps } from '../components/ProjectBanner';

// Custom CSS for subgrid support
const subgridStyles = `
  img{
    image-rendering: pixelated;
    }

  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    grid-auto-rows: max-content;
  }
  
  .portfolio-card {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 4;
    align-items: stretch;
  }
  
  .portfolio-card-content {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 4;
    gap: 0.75rem;
  }
  
  @supports not (grid-template-rows: subgrid) {
    .portfolio-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .portfolio-card-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 0.75rem;
    }
    .portfolio-card-footer {
      margin-top: auto;
    }
  }
  
  @media (min-width: 640px) {
    .portfolio-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 768px) {
    .portfolio-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .portfolio-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (min-width: 1280px) {
    .portfolio-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }
`;

// Category ordering for portfolio (used in sorting + UI)
const CATEGORY_PRIORITY: Record<string, number> = {
  // Put what you want to show first here:
  'art': 1,
  '3dmodels': 2,

  // Then the rest:
  'thumbnail': 3,
  'website': 4,
  'webapp': 5,
  'projects': 6,
  'mods': 7,
  'resourcepack': 8,
  'modpack': 9,
  'article': 10,
  'other': 11,
};

const sortCategories = (rawCategories: string[]): string[] => {
  const unique = Array.from(new Set(rawCategories.filter(Boolean)));

  const known: string[] = [];
  const unknown: string[] = [];

  for (const cat of unique) {
    const key = cat.toLowerCase().trim();
    if (CATEGORY_PRIORITY[key] != null) known.push(cat);
    else unknown.push(cat);
  }

  known.sort(
    (a, b) =>
      (CATEGORY_PRIORITY[a.toLowerCase().trim()] ?? 999) -
      (CATEGORY_PRIORITY[b.toLowerCase().trim()] ?? 999)
  );

  unknown.sort((a, b) => a.localeCompare(b));

  return [...known, ...unknown];
};

const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase().trim()) {
    case 'art': return 'fa-pen-nib';
    case '3dmodels': return 'fa-cube';
    case 'thumbnail': return 'fa-image';
    case 'website': return 'fa-globe';
    case 'webapp': return 'fa-laptop-code';
    case 'projects': return 'fa-project-diagram';
    case 'mods': return 'fa-puzzle-piece';
    case 'resourcepack': return 'fa-layer-group';
    case 'modpack': return 'fa-boxes';
    case 'article': return 'fa-file-alt';
    case 'other': return 'fa-folder-open';
    case 'all': return 'fa-th-large';
    default: return 'fa-folder';
  }
};


const PortfolioComponent: React.FC = () => {
  const { translations, language } = useAppContext();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<(GalleryImage & { variants?: string[] })[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [selectedImageVariants, setSelectedImageVariants] = useState<string[]>([]);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoverVariantIndex, setHoverVariantIndex] = useState<{ [key: string]: number }>({});
  const [mouseThrottle, setMouseThrottle] = useState<{ [key: string]: number }>({});

  // Memoize background particles to prevent re-calculation on re-renders
  const backgroundParticles = useState(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: `bg-particle-${i}`,
      width: Math.random() * 60 + 20,
      height: Math.random() * 60 + 20,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 8 + 6,
    }))
  )[0];

  // Memoized background animation to prevent re-renders
  const backgroundAnimation = useMemo(() => (
    <div className="fixed inset-0 opacity-20 dark:opacity-30 pointer-events-none z-0">
      {backgroundParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary-400/40 dark:bg-primary-500/50 rounded-full will-change-transform"
          style={{
            width: particle.width,
            height: particle.height,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            x: [-8, 8, -8],
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
      ))}
    </div>
  ), [backgroundParticles]);

  // Helper function to group similar items
  const groupSimilarItems = useCallback((items: GalleryImage[]) => {
    const groups: { [key: string]: GalleryImage[] } = {};
    const groupedItems: (GalleryImage & { variants?: string[] })[] = [];
    const processedIds = new Set<string>();
    
    items.forEach(item => {
      // Skip if already processed
      if (processedIds.has(item.id)) return;

      // Check if item already has variants array (pre-grouped in JSON)
      if (item.variants && Array.isArray(item.variants)) {
        // Item is already grouped, add it directly
        groupedItems.push(item);
        processedIds.add(item.id);
        return;
      }
      
      // Create a normalized key for grouping
      let normalizedTitle = item.title
        ?.toLowerCase()
        .replace(/\d+/g, '') // Remove numbers
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();
      
      // Special cases for better grouping
      if (normalizedTitle?.includes('holyday globe') || normalizedTitle?.includes('holiday globe')) {
        normalizedTitle = 'holyday globe';
      }
      if (normalizedTitle?.includes('mixer')) {
        normalizedTitle = 'mixer';
      }
      if (normalizedTitle?.includes('mt ') || normalizedTitle?.startsWith('mt-')) {
        // Group MT projects by removing the "MT" prefix and normalizing
        normalizedTitle = normalizedTitle.replace(/^mt[\s-]*/, '').trim();
      }
      
      if (normalizedTitle) {
        if (!groups[normalizedTitle]) {
          groups[normalizedTitle] = [];
        }
        groups[normalizedTitle].push(item);
        processedIds.add(item.id);
      }
    });
    
    // Convert groups to array format with main item and variants
    Object.values(groups).forEach(group => {
      if (group.length > 1) {
        // Sort by ID to get consistent main item (lowest ID first)
        group.sort((a, b) => parseInt(a.id || '0') - parseInt(b.id || '0'));
        const mainItem = { 
          ...group[0], 
          variants: group.map(item => item.url) // Convert to URL array
        };
        groupedItems.push(mainItem);
      } else {
        // Single item, no grouping needed
        groupedItems.push(group[0]);
      }
    });
    
    return groupedItems;
  }, []);

  // Helper function to get category priority for sorting
  const getCategoryPriority = useCallback((category: string | undefined) => {
    const key = (category || 'other').toLowerCase().trim();
    return CATEGORY_PRIORITY[key] ?? 999;
  }, []);


  // Helper function to sort images
  const sortImages = useCallback((imagesToSort: GalleryImage[]) => {
    return imagesToSort.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'category': {
          const aCatPriority = getCategoryPriority(a.category);
          const bCatPriority = getCategoryPriority(b.category);

          if (aCatPriority !== bCatPriority) return aCatPriority - bCatPriority;

          // Same category priority -> sort by title, then newest first
          const titleCmp = (a.title || '').localeCompare(b.title || '');
          if (titleCmp !== 0) return titleCmp;

          return parseInt(b.id || '0') - parseInt(a.id || '0');
        }
        case 'date':
        default:
          // First sort by category priority, then by date (newer first)
          const aPriority = getCategoryPriority(a.category);
          const bPriority = getCategoryPriority(b.category);
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority; // Lower priority number = higher priority
          }
          
          // If same priority, sort by date (newer images have higher IDs)
          return parseInt(b.id || '0') - parseInt(a.id || '0');
      }
    });
  }, [sortBy, getCategoryPriority]);

  // Move all useCallback hooks right after state declarations
  const openModal = useCallback((image: GalleryImage & { variants?: string[] }) => {
    setSelectedImage(image);
    if (image.variants && image.variants.length > 1) {
      setSelectedImageVariants(image.variants);
      setSelectedVariantIndex(0);
    } else {
      setSelectedImageVariants([]);
      setSelectedVariantIndex(0);
    }
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setSelectedImageVariants([]);
    setSelectedVariantIndex(0);
    document.body.style.overflow = 'auto';
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    // If we have variants for the current image, navigate through them first
    if (selectedImageVariants.length > 1) {
      let newVariantIndex: number;
      
      if (direction === 'prev') {
        newVariantIndex = selectedVariantIndex > 0 
          ? selectedVariantIndex - 1 
          : selectedImageVariants.length - 1;
      } else {
        newVariantIndex = selectedVariantIndex < selectedImageVariants.length - 1 
          ? selectedVariantIndex + 1 
          : 0;
      }
      
      // If we're cycling through variants and reach the end, move to next item
      if (direction === 'next' && selectedVariantIndex === selectedImageVariants.length - 1) {
        // Move to next item in the list
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const nextIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
        const newItem = filteredImages[nextIndex];
        
        setSelectedImage(newItem);
        if (newItem.variants && newItem.variants.length > 1) {
          setSelectedImageVariants(newItem.variants);
          setSelectedVariantIndex(0);
        } else {
          setSelectedImageVariants([]);
          setSelectedVariantIndex(0);
        }
        return;
      }
      
      // If we're cycling through variants and reach the beginning, move to previous item
      if (direction === 'prev' && selectedVariantIndex === 0) {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
        const newItem = filteredImages[prevIndex];
        
        setSelectedImage(newItem);
        if (newItem.variants && newItem.variants.length > 1) {
          setSelectedImageVariants(newItem.variants);
          setSelectedVariantIndex(newItem.variants.length - 1); // Start from last variant
        } else {
          setSelectedImageVariants([]);
          setSelectedVariantIndex(0);
        }
        return;
      }
      
      // Normal variant navigation - just update the index
      setSelectedVariantIndex(newVariantIndex);
      return;
    }
    
    // Navigate through different items
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex: number;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    const newItem = filteredImages[newIndex];
    setSelectedImage(newItem);
    if (newItem.variants && newItem.variants.length > 1) {
      setSelectedImageVariants(newItem.variants);
      setSelectedVariantIndex(0);
    } else {
      setSelectedImageVariants([]);
      setSelectedVariantIndex(0);
    }
  }, [selectedImage, filteredImages, selectedImageVariants, selectedVariantIndex]);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        const galleryImages = await loadGalleryImages();

        // Sort images immediately after loading with priority order
        const sortedImages = sortImages([...galleryImages]);
        
        // Group similar items
        const groupedImages = groupSimilarItems(sortedImages);

        setImages(galleryImages); // Keep original for categories
        setFilteredImages(groupedImages);
      } catch (error) {
        console.error('Error loading gallery images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [sortBy, sortImages, groupSimilarItems]);

  useEffect(() => {
    let filtered = images;

    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(img => img.category === activeCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(img => 
        img.title?.toLowerCase().includes(query) ||
        img.description?.toLowerCase().includes(query) ||
        img.descriptionEn?.toLowerCase().includes(query) ||
        img.category?.toLowerCase().includes(query)
      );
    }

    // Sort filtered images
    const sortedFiltered = sortImages([...filtered]);
    
    // Group similar items after filtering
    const groupedFiltered = groupSimilarItems(sortedFiltered);

    setFilteredImages(groupedFiltered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [activeCategory, images, searchQuery, sortBy, sortImages, groupSimilarItems]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentImages = filteredImages.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid
    const gridElement = document.getElementById('portfolio-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      
      switch (e.key) {
        case 'Escape':
          closeModal();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, closeModal, navigateImage]);

  if (!translations) return null;

  const categories = [
    'all',
    ...sortCategories(images.map(img => img.category || 'other')),
  ];

  const categoryCounts = images.reduce<Record<string, number>>((acc, img) => {
    const key = (img.category || 'other').toLowerCase().trim();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const totalCount = images.length;

  // Featured projects data
  const featuredProjects: ProjectBannerProps[] = [
    {
      title: language === 'uk' ? 'Kork0za Merch Store' : 'Kork0za Merch Store',
      description: language === 'uk' 
        ? 'Повнофункціональний інтернет-магазин мерчу для українського YouTuber\'а з сучасним дизайном та зручною навігацією'
        : 'Full-featured merchandise store for Ukrainian YouTuber with modern design and user-friendly navigation',
      image: 'https://github.com/MEGATREX4/react-mtsite/blob/main/public/img/kork0za-merch.png?raw=true',
      url: 'https://kork0za-merch.netlify.app/',
      tags: ['E-commerce', 'React', 'TypeScript', 'Tailwind CSS', 'Responsive'],
      type: 'website',
      featured: true
    },
    {
      title: language === 'uk' ? 'UkrPaste - Збірник Цитат' : 'UkrPaste - Quote Collection',
      description: language === 'uk'
        ? 'Веб-додаток для збереження та обміну смішними цитатами та "пастами" з інтуїтивним інтерфейсом'
        : 'Web application for saving and sharing funny quotes and "pastas" with intuitive interface',
      image: 'https://github.com/MEGATREX4/react-mtsite/blob/main/public/img/ukrpaste.png?raw=true',
      url: 'https://ukrpaste.netlify.app/',
      tags: ['Web App', 'JavaScript', 'CSS3', 'Local Storage', 'PWA'],
      type: 'webapp',
      featured: true
    },
    {
      title: language === 'uk' ? 'MT Ukrainian Delight' : 'MT Ukrainian Delight',
      description: language === 'uk'
        ? 'Додаток для Farmer\'s Delight з українською національною кухнею'
        : 'Addon for Farmer\'s Delight with Ukrainian national cuisine',
      image: 'https://cdn.modrinth.com/data/XvdDyGln/images/27292b07b519e48699396747283b1626c1eab0c6.jpeg',
      url: 'https://modrinth.com/mod/mt-ukrainian-delight',
      tags: ['Minecraft', 'Mod', 'Farmer\'s Delight', 'Ukrainian Cuisine'],
      type: 'webapp',
      featured: true
    },
    {
      title: language === 'uk' ? 'M4Sub - Українські Сервери' : 'M4Sub - Ukrainian Servers',
      description: language === 'uk'
        ? 'Проєкт українських серверів для спільноти з унікальними можливостями та підтримкою'
        : 'A project of Ukrainian servers for the community with unique features and support',
      image: 'https://cdn.modrinth.com/data/59Xtpez1/images/03ce295e730cc2d1e33be89b90151dee6cd0bb07.png',
      url: 'http://m4sub.click/',
      tags: ['Servers', 'Community', 'Support', 'Ukrainian'],
      type: 'other',
      featured: true
    },
    {
      title: language === 'uk' ? 'SumTranslate' : 'SumTranslate',
      description: language === 'uk'
        ? 'Спільнота перекладу модів Minecraft українською мовою'
        : 'Community for translating Minecraft mods into Ukrainian',
      image: 'https://cdn.modrinth.com/data/bbtIbKAp/images/518395cbe322a8bda059bf7ad13fdbe428359bec.png',
      url: 'https://sumtranslate.netlify.app',
      tags: ['Minecraft', 'Translation', 'Ukrainian', 'Community'],
      type: 'webapp',
      featured: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 relative overflow-hidden">
      {/* Enhanced Background Animation - Memoized and isolated from hover interactions */}
      {backgroundAnimation}
      
      {/* Inject custom CSS for subgrid */}
      <style dangerouslySetInnerHTML={{ __html: subgridStyles }} />

      <div className="container mx-auto px-4 py-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-xl opacity-40 dark:opacity-60 scale-110 w-20 h-20 mx-auto"></div>
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto shadow-2xl border-4 border-white dark:border-gray-700 relative z-10 flex items-center justify-center">
                <i className="fas fa-briefcase text-2xl text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
              {translations.portfolio?.title || (language === 'uk' ? 'Портфоліо' : 'Portfolio')}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
              {translations.portfolio?.description || (language === 'uk' ? 'Колекція моїх робіт та проектів, що демонструють мої навички та досвід.' : 'A collection of my work and projects that showcase my skills and experience.')}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-6">
            {/* Search Bar */}
            <div className="flex justify-center">
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400 dark:text-gray-500"></i>
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 rounded-2xl shadow-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder={language === 'uk' ? 'Пошук проектів...' : 'Search projects...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <i className="fas fa-times text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"></i>
                  </button>
                )}
              </div>
            </div>

            {/* Quick Category Tabs (desktop) */}
            <div className="hidden md:flex flex-wrap justify-center gap-2">
              {categories.map((category) => {
                const isActive = activeCategory === category;
                const label =
                  category === 'all'
                    ? (language === 'uk' ? 'Всі' : 'All')
                    : getCategoryDisplayName(category, language);

                const count =
                  category === 'all'
                    ? totalCount
                    : (categoryCounts[category.toLowerCase().trim()] || 0);

                return (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border ${
                      isActive
                        ? 'bg-primary-600 text-white border-primary-600 shadow-md'
                        : 'bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 border-primary-200/50 dark:border-primary-700/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-sm'
                    }`}
                  >
                    <i className={`fas ${getCategoryIcon(category)} text-xs`} />
                    <span>{label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-primary-100/70 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap justify-center gap-4">
              {/* Category Filter (mobile) */}
              <div className="flex items-center gap-2 md:hidden">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <i className="fas fa-folder mr-1"></i>
                  {language === 'uk' ? 'Категорія:' : 'Category:'}
                </label>
                <select
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white text-sm"
                >
                  <option value="all">{language === 'uk' ? 'Всі категорії' : 'All categories'}</option>
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>
                      {getCategoryDisplayName(category, language)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <i className="fas fa-sort mr-1"></i>
                  {language === 'uk' ? 'Сортування:' : 'Sort by:'}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'category')}
                  className="px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white text-sm"
                >
                  <option value="date">{language === 'uk' ? 'За датою' : 'By date'}</option>
                  <option value="title">{language === 'uk' ? 'За назвою' : 'By title'}</option>
                  <option value="category">{language === 'uk' ? 'За категорією' : 'By category'}</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || activeCategory !== 'all' || sortBy !== 'date') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSortBy('date');
                  }}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl shadow-sm transition-all duration-200 flex items-center gap-2 text-sm"
                >
                  <i className="fas fa-times text-xs"></i>
                  <span>{language === 'uk' ? 'Очистити' : 'Clear'}</span>
                </button>
              )}
            </div>

            {/* Results count */}
            <div className="text-center text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
              <i className="fas fa-info-circle"></i>
              <span>
                {searchQuery ? (
                  language === 'uk' 
                    ? `Знайдено ${filteredImages.length} з ${images.length} проектів`
                    : `Found ${filteredImages.length} of ${images.length} projects`
                ) : (
                  language === 'uk' 
                    ? `Показано ${filteredImages.length} проектів`
                    : `Showing ${filteredImages.length} projects`
                )}
              </span>
            </div>
          </div>
          
          {/* Enhanced Projects Grid */}

          {/* Enhanced Projects Grid */}
          {currentImages.length === 0 && !isLoading ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full mx-auto shadow-lg border-4 border-white dark:border-gray-600 relative z-10 flex items-center justify-center mb-6">
                <i className="fas fa-search text-2xl text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'uk' ? 'Проектів не знайдено' : 'No projects found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {language === 'uk' 
                  ? 'Спробуйте змінити критерії пошуку або фільтри'
                  : 'Try adjusting your search criteria or filters'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('all');
                  setSortBy('date');
                }}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <i className="fas fa-refresh text-sm"></i>
                <span>{language === 'uk' ? 'Показати всі проекти' : 'Show all projects'}</span>
              </button>
            </div>
          ) : isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <div className="text-xl text-primary-600 dark:text-primary-400">
                {language === 'uk' ? 'Завантаження...' : 'Loading...'}
              </div>
            </div>
          ) : (
            <motion.div
              id="portfolio-grid"
              className="portfolio-grid"
              layout
            >
              {currentImages.map((image) => {
                  const currentVariantIndex = hoverVariantIndex[image.id || ''] || 0;
                  const hasVariants = image.variants && image.variants.length > 1;
                  const displayImageUrl = hasVariants ? image.variants![currentVariantIndex] : image.url;
                  
                  return (
                    <motion.div
                      key={`${image.id}-page-${currentPage}`}
                      className="portfolio-card group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-2xl border border-primary-200/50 dark:border-primary-700/50 transition-all duration-300 hover:-translate-y-2 cursor-pointer isolate"
                      onClick={() => openModal(image)}
                      onMouseEnter={() => setHoveredItem(image.id || '')}
                      onMouseLeave={() => setHoveredItem(null)}
                      style={{ zIndex: 10 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="portfolio-card-content relative z-10 p-4">
                        {/* Project Cover with Hover Carousel - Row 1 */}
                        <div 
                          className="w-full aspect-square overflow-hidden rounded-xl relative"
                          onMouseMove={(e) => {
                            if (hasVariants) {
                              const now = Date.now();
                              const lastUpdate = mouseThrottle[image.id || ''] || 0;
                              
                              // Throttle mouse updates to prevent rapid changes (100ms delay)
                              if (now - lastUpdate < 100) {
                                return;
                              }
                              
                              const rect = e.currentTarget.getBoundingClientRect();
                              const x = e.clientX - rect.left;
                              const sectionWidth = rect.width / (image.variants?.length || 1);
                              const variantIndex = Math.floor(x / sectionWidth);
                              const clampedIndex = Math.max(0, Math.min(variantIndex, (image.variants?.length || 1) - 1));
                              
                              // Only update if the index actually changed
                              const currentIndex = hoverVariantIndex[image.id || ''] || 0;
                              if (clampedIndex !== currentIndex) {
                                setHoverVariantIndex(prev => ({
                                  ...prev,
                                  [image.id || '']: clampedIndex
                                }));
                                
                                setMouseThrottle(prev => ({
                                  ...prev,
                                  [image.id || '']: now
                                }));
                              }
                            }
                          }}
                        >
                          <LazyLoadImage
                            src={displayImageUrl || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'}
                            alt={image.title || 'No Image Available'}
                            className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                            effect="opacity"
                            placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ELoading...%3C/text%3E%3C/svg%3E"
                            wrapperClassName="w-full h-full"
                          />
                          
                          {/* Hover Indicators for Multiple Variants */}
                          {hasVariants && hoveredItem === image.id && (
                            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
                              {image.variants?.map((_, variantIdx) => (
                                <div
                                  key={variantIdx}
                                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                                    variantIdx === currentVariantIndex
                                      ? 'bg-white shadow-lg scale-110'
                                      : 'bg-white/50'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                          
                          {/* Variants Count Badge */}
                          {hasVariants && (
                            <div className="absolute top-2 right-2 opacity-90">
                              <span className="px-2 py-1 text-xs font-medium bg-purple-600/90 backdrop-blur-sm text-white rounded-full flex items-center gap-1">
                                <i className="fas fa-images text-xs" />
                                {image.variants?.length}
                              </span>
                            </div>
                          )}
                          
                          {/* Overlay - Made much more subtle */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500 ease-out flex items-center justify-center rounded-xl">
                            <div className="transform scale-0 group-hover:scale-100 transition-all duration-500 ease-out opacity-0 group-hover:opacity-100">
                              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                                <i className="fas fa-expand text-white text-sm" />
                              </div>
                            </div>
                          </div>
                          
                          {/* Category Badge */}
                          <div className="absolute top-2 left-2 opacity-90">
                            <span className="px-2 py-1 text-xs font-medium bg-primary-600/90 backdrop-blur-sm text-white rounded-full">
                              {getCategoryDisplayName(image.category || 'other', language)}
                            </span>
                          </div>
                        </div>

                        {/* Project Title - Row 2 */}
                        <div className="flex items-center justify-center min-h-[2.5rem]">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white text-center line-clamp-2">
                            {image.title || (language === 'uk' ? 'Без назви' : 'Untitled')}
                          </h3>
                        </div>

                        {/* Project Description - Row 3 */}
                        <div className="flex items-start justify-center min-h-[2.5rem]">
                          {image.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 text-center line-clamp-2">
                              {language === 'uk' ? image.description : (image.descriptionEn || image.description)}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons - Row 4 */}
                        <div className="portfolio-card-footer space-y-2">
                          {image.downloadUrl && image.downloadUrl !== '#' && image.projectUrl && image.projectUrl !== '#' && image.downloadUrl === image.projectUrl ? (
                            <a
                              href={image.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="w-full px-3 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md group/btn"
                            >
                              <i className="fas fa-link text-xs group-hover/btn:scale-110 transition-transform duration-200" />
                              <span>{language === 'uk' ? 'Переглянути' : 'View'}</span>
                            </a>
                          ) : (
                            <>
                              {image.downloadUrl && image.downloadUrl !== '#' && (
                                <a
                                  href={image.downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full px-3 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md group/btn"
                                >
                                  <i className="fas fa-download text-xs group-hover/btn:scale-110 transition-transform duration-200" />
                                  <span>{language === 'uk' ? 'Завантажити' : 'Download'}</span>
                                </a>
                              )}
                              {image.projectUrl && image.projectUrl !== '#' && (
                                <a
                                  href={image.projectUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full px-3 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-md group/btn"
                                >
                                  <i className="fas fa-external-link-alt text-xs group-hover/btn:scale-110 transition-transform duration-200" />
                                  <span>{language === 'uk' ? 'Переглянути Проект' : 'View Project'}</span>
                                </a>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </motion.div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div 
              className="flex flex-col items-center gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Page Info */}
              <div className="text-center text-gray-600 dark:text-gray-400 text-sm">
                {language === 'uk' 
                  ? `Сторінка ${currentPage} з ${totalPages} • Показано ${currentImages.length} з ${filteredImages.length} проектів`
                  : `Page ${currentPage} of ${totalPages} • Showing ${currentImages.length} of ${filteredImages.length} projects`
                }
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/50 rounded-lg text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80 dark:disabled:hover:bg-gray-800/80 shadow-sm hover:shadow-md"
                >
                  <span className="sr-only">
                    {language === 'uk' ? 'Попередня сторінка' : 'Previous page'}
                  </span>
                  <i className="fas fa-chevron-left text-sm" />
                </button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, current page and adjacent pages, last page
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    if (!showPage) {
                      // Show ellipsis
                      if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="px-2 py-2 text-gray-600 dark:text-gray-400">
                            ...
                          </span>
                        );
                      }
                      return null;
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md ${
                          currentPage === page
                            ? 'bg-primary-600/90 backdrop-blur-sm text-white border border-primary-400/50'
                            : 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/50 text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-primary-200/50 dark:border-primary-700/50 rounded-lg text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/80 dark:disabled:hover:bg-gray-800/80 shadow-sm hover:shadow-md"
                >
                  <span className="sr-only">
                    {language === 'uk' ? 'Наступна сторінка' : 'Next page'}
                  </span>
                  <i className="fas fa-chevron-right text-sm" />
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>


      {/* Services / About Section */}
      <div className="py-16 bg-gradient-to-br from-white via-primary-50/30 to-primary-100/40 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              className="relative overflow-hidden rounded-3xl bg-white/80 dark:bg-gray-800/70 backdrop-blur-md border border-primary-200/40 dark:border-primary-700/40 shadow-xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, margin: "-80px" }}
            >
              {/* subtle glow */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-400/20 blur-3xl rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-600/10 blur-3xl rounded-full" />

              <div className="relative p-6 sm:p-8 md:p-10">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
                    <i className="fas fa-handshake text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                      {language === 'uk' ? 'Невеликі замовлення та проєкти' : 'Small orders and projects'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
                      {language === 'uk'
                        ? 'Привіт! Я беру невеликі (і не тільки) замовлення на розробку та графіку.'
                        : 'Hi! I take small (and not only) orders for development and graphics.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* What I do */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <i className="fas fa-tools text-primary-600 dark:text-primary-400" />
                      <span>{language === 'uk' ? 'Що я роблю' : 'What I do'}</span>
                    </h3>

                    <ul className="space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed">
                      <li className="flex gap-3">
                        <i className="fas fa-cube mt-1 text-primary-600/90 dark:text-primary-400/90" />
                        <span>
                          {language === 'uk'
                            ? 'Minecraft Java: моди та плагіни під Spigot/Paper/Fabric (можемо робити окремо server-side або client-side, або одразу server+client)'
                            : 'Minecraft Java: mods and plugins for Spigot/Paper/Fabric (server-side, client-side, or both).'}
                        </span>
                      </li>

                      <li className="flex gap-3">
                        <i className="fas fa-server mt-1 text-primary-600/90 dark:text-primary-400/90" />
                        <span>
                          {language === 'uk'
                            ? 'Можемо домовитись про проєкт “під ключ” (сервер + налаштування + хостинг), але це завжди індивідуально — спершу обговоримо задачі, бюджет і терміни'
                            : 'We can also do a turnkey project (server + setup + hosting), but it is always individual: first we discuss tasks, budget, and timeline.'}
                        </span>
                      </li>

                      <li className="flex gap-3">
                        <i className="fas fa-shapes mt-1 text-primary-600/90 dark:text-primary-400/90" />
                        <span>
                          {language === 'uk'
                            ? '3D low-poly моделі під стиль Minecraft'
                            : '3D low-poly models in Minecraft style'}
                        </span>
                      </li>

                      <li className="flex gap-3">
                        <i className="fas fa-paint-brush mt-1 text-primary-600/90 dark:text-primary-400/90" />
                        <span>
                          {language === 'uk'
                            ? '2D спрайти 16×16'
                            : '2D sprites (16×16)'}
                        </span>
                      </li>

                      <li className="flex gap-3">
                        <i className="fas fa-code mt-1 text-primary-600/90 dark:text-primary-400/90" />
                        <span>
                          {language === 'uk'
                            ? 'Front-end: HTML / CSS / JS, React'
                            : 'Front-end: HTML / CSS / JS, React'}
                        </span>
                      </li>

                      <li className="flex gap-3">
                        <i className="fas fa-film mt-1 text-primary-600/90 dark:text-primary-400/90" />
                        <span>
                          {language === 'uk'
                            ? 'Монтаж відео та обкладинки'
                            : 'Video editing and thumbnails'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* Experience */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <i className="fas fa-award text-primary-600 dark:text-primary-400" />
                      <span>{language === 'uk' ? 'Досвід і додатково' : 'Experience & extra'}</span>
                    </h3>

                    <ul className="space-y-3 text-gray-700 dark:text-gray-200 leading-relaxed">
                      <li className="flex gap-3">
                        <i className="fas fa-language mt-1 text-primary-600/90 dark:text-primary-400/90" />
                        <span>
                          {language === 'uk'
                            ? 'Англійська — трохи вище середнього'
                            : 'English: slightly above intermediate'}
                        </span>
                      </li>

                      <li className="flex gap-3">
                        <i className="fas fa-scissors mt-1 text-primary-600/90 dark:text-primary-400/90" />
                        <span>
                          {language === 'uk'
                            ? 'Раніше робив нарізки стрімів: монтаж + оформлення каналу (обкладинки/візуал)'
                            : 'Previously made stream highlights: editing + channel visuals (covers/branding).'}
                        </span>
                      </li>

                      <li className="flex gap-3">
                        <i className="fas fa-network-wired mt-1 text-primary-600/90 dark:text-primary-400/90" />
                        <span>
                          {language === 'uk'
                            ? 'Маю проєкт серверів зі стабільним, хоч і невеликим онлайном; 5 років тримаю майнкрафт-сервери та роблю унікальний контент (приклад — мій проєкт M4SUB). За потреби можу підняти й налаштувати сервер під вас (хостинг, базові налаштування, контент — усе обговорюємо під задачу). Піратські сервери не роблю, бо з ними більше мороки, ніж здається.'
                            : 'I run a server project with stable (though small) online activity; I have been running Minecraft servers and making unique content for 5 years (example: my M4SUB project). If needed, I can deploy and configure a server for you (hosting, base setup, content — all discussed per task). I do not do pirated servers because they bring more hassle than it seems.'}
                        </span>
                      </li>
                    </ul>

                    <div className="mt-6 p-4 rounded-2xl bg-primary-50/70 dark:bg-gray-900/40 border border-primary-200/40 dark:border-primary-700/40">
                      <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
                        {language === 'uk'
                          ? 'Якщо хочеш — напиши коротко, що треба зробити, і я скажу приблизну оцінку по часу та вартості.'
                          : 'If you want, write a short brief of what you need and I will give an approximate time and price estimate.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-16 bg-gradient-to-br from-primary-50/50 via-white to-primary-100/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <PricingSection />
      </div>

      {/* Featured Projects Section */}
      <div className="py-16 bg-gradient-to-br from-primary-50/50 via-white to-primary-100/50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <FeaturedProjects projects={featuredProjects} language={language} />
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" />

            {/* Modal Content */}
            <motion.div
              className="relative w-full h-full flex items-center justify-center p-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 z-20 w-12 h-12 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-200 hover:scale-110"
                aria-label="Close"
              >
                <i className="fas fa-times text-lg" />
              </button>

              {/* Navigation Arrows */}
              {(filteredImages.length > 1 || selectedImageVariants.length > 1) && (
                <>
                  <button
                    onClick={() => navigateImage('prev')}
                    className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-200 hover:scale-110"
                    aria-label="Previous image"
                  >
                    <i className="fas fa-chevron-left text-lg" />
                  </button>
                  <button
                    onClick={() => navigateImage('next')}
                    className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 w-14 h-14 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-200 hover:scale-110"
                    aria-label="Next image"
                  >
                    <i className="fas fa-chevron-right text-lg" />
                  </button>
                </>
              )}

              {/* Main Image Container */}
              <div className="flex flex-col items-center justify-center w-full h-full max-w-7xl">
                {/* Image */}
                <div className="relative flex-1 flex items-center justify-center w-full mb-4">
                  <img
                    src={selectedImageVariants.length > 0 ? selectedImageVariants[selectedVariantIndex] : selectedImage.url}
                    alt={selectedImage.title}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    style={{ 
                      maxHeight: 'calc(100vh - 200px)',
                      maxWidth: 'calc(100vw - 100px)'
                    }}
                  />
                  
                  {/* Variant indicators */}
                  {selectedImageVariants.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                      {selectedImageVariants.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedVariantIndex(idx);
                          }}
                          className={`w-3 h-3 rounded-full transition-all duration-200 ${
                            idx === selectedVariantIndex
                              ? 'bg-white shadow-lg scale-125'
                              : 'bg-white/50 hover:bg-white/75'
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Info Panel */}
                {(selectedImage.title || selectedImage.description) && (
                  <motion.div
                    className="w-full max-w-4xl bg-black/80 backdrop-blur-md text-white p-6 rounded-2xl border border-white/10"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        {selectedImage.title && (
                          <h3 className="text-xl font-bold mb-2 text-white">
                            {selectedImage.title}
                            {selectedImageVariants.length > 1 && (
                              <span className="ml-2 text-sm text-gray-400">
                                ({selectedVariantIndex + 1}/{selectedImageVariants.length})
                              </span>
                            )}
                          </h3>
                        )}
                        {selectedImage.description && (
                          <p className="text-gray-300 text-sm leading-relaxed">
                            {language === 'uk' ? selectedImage.description : (selectedImage.descriptionEn || selectedImage.description)}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <span className="text-xs px-3 py-1 bg-primary-600/80 backdrop-blur-sm rounded-full whitespace-nowrap">
                          {getCategoryDisplayName(selectedImage.category || 'other', language)}
                        </span>
                        
                        <div className="flex gap-2">
                          {selectedImage.downloadUrl && selectedImage.downloadUrl !== '#' && (
                            <a
                              href={selectedImage.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-green-600/80 hover:bg-green-600 backdrop-blur-sm text-white text-sm rounded-lg transition-all duration-200 hover:scale-105"
                            >
                              <i className="fas fa-download" />
                              <span>{language === 'uk' ? 'Завантажити' : 'Download'}</span>
                            </a>
                          )}
                          {selectedImage.projectUrl && selectedImage.projectUrl !== '#' && (
                            <a
                              href={selectedImage.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-blue-600/80 hover:bg-blue-600 backdrop-blur-sm text-white text-sm rounded-lg transition-all duration-200 hover:scale-105"
                            >
                              <i className="fas fa-external-link-alt" />
                              <span>{language === 'uk' ? 'Переглянути' : 'View Project'}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Image Counter */}
                    {filteredImages.length > 1 && (
                      <div className="mt-4 pt-4 border-t border-white/20 text-center">
                        <span className="text-sm text-gray-400">
                          {filteredImages.findIndex(img => img.id === selectedImage.id) + 1} / {filteredImages.length}
                          {selectedImageVariants.length > 1 && (
                            <span className="ml-2 text-purple-400">
                              • Variant {selectedVariantIndex + 1}/{selectedImageVariants.length}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Portfolio = React.memo(PortfolioComponent);
