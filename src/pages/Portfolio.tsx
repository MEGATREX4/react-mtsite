import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useAppContext } from '../components/AppProvider';
import { FeaturedProjects } from '../components/ProjectBanner';
import { loadGalleryImages, getCategoryDisplayName } from '../utils/api';
import type { GalleryImage } from '../types';
import type { ProjectBannerProps } from '../components/ProjectBanner';

export const Portfolio: React.FC = () => {
  const { translations, language } = useAppContext();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'category'>('date');

  // Move all useCallback hooks right after state declarations
  const openModal = useCallback((image: GalleryImage) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  }, []);

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (!selectedImage) return;
    
    const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
    let newIndex: number;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredImages.length - 1;
    } else {
      newIndex = currentIndex < filteredImages.length - 1 ? currentIndex + 1 : 0;
    }
    
    setSelectedImage(filteredImages[newIndex]);
  }, [selectedImage, filteredImages]);

  useEffect(() => {
    const loadImages = async () => {
      setIsLoading(true);
      try {
        const galleryImages = await loadGalleryImages();

        // Sort images immediately after loading
        galleryImages.sort((a, b) => {
          switch (sortBy) {
            case 'title':
              return (a.title || '').localeCompare(b.title || '');
            case 'category':
              return (a.category || '').localeCompare(b.category || '');
            case 'date':
            default:
              // Assuming newer images have higher IDs
              return parseInt(b.id || '0') - parseInt(a.id || '0');
          }
        });

        setImages(galleryImages);
        setFilteredImages(galleryImages);
      } catch (error) {
        console.error('Error loading gallery images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, [sortBy]);

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

    // Sort images
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        case 'date':
        default:
          // Assuming newer images have higher IDs
          return parseInt(b.id || '0') - parseInt(a.id || '0');
      }
    });

    setFilteredImages(filtered);
  }, [activeCategory, images, searchQuery, sortBy]);

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

  const categories = ['all', ...Array.from(new Set(images.map(img => img.category)))];

  // Featured projects data
  const featuredProjects: ProjectBannerProps[] = [
    {
      title: language === 'uk' ? 'Kork0za Merch Store' : 'Kork0za Merch Store',
      description: language === 'uk' 
        ? 'Повнофункціональний інтернет-магазин мерчу для українського YouTuber\'а з сучасним дизайном та зручною навігацією'
        : 'Full-featured merchandise store for Ukrainian YouTuber with modern design and user-friendly navigation',
      image: 'https://github.com/MEGATREX4/react-mtsite/blob/main/public/img/kork0za-merch.png?raw=true',
      url: 'https://deploy-preview-1--kork0za-merch.netlify.app/',
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
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary-400/40 dark:bg-primary-500/50 rounded-full"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-8, 8, -8],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
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

            {/* Filters Row */}
            <div className="flex flex-wrap justify-center gap-4">
              {/* Category Filter */}
              <div className="flex items-center gap-2">
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
          {filteredImages.length === 0 && !isLoading ? (
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
              className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              layout
            >
              <AnimatePresence>
                {filteredImages.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-xl border border-primary-200/50 dark:border-primary-700/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                    onClick={() => openModal(image)}
                  >
                    {/* Removed the flashing background overlay that was causing issues */}
                    
                    <div className="relative z-10 p-4 h-full flex flex-col">
                      {/* Project Cover */}
                      <div className="w-full aspect-square overflow-hidden rounded-xl mb-3 relative">
                        <LazyLoadImage
                          src={image.url || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'}
                          alt={image.title || 'No Image Available'}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          effect="opacity"
                          placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ELoading...%3C/text%3E%3C/svg%3E"
                          wrapperClassName="w-full h-full"
                        />
                        
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

                      {/* Project Title */}
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2 text-center line-clamp-2 flex-shrink-0">
                        {image.title || (language === 'uk' ? 'Без назви' : 'Untitled')}
                      </h3>

                      {/* Project Description */}
                      {image.description && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 text-center line-clamp-2 flex-shrink-0 mb-3">
                          {language === 'uk' ? image.description : (image.descriptionEn || image.description)}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="mt-auto space-y-2">
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
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
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
              {filteredImages.length > 1 && (
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
                    src={selectedImage.url}
                    alt={selectedImage.title}
                    className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
                    style={{ 
                      maxHeight: 'calc(100vh - 200px)',
                      maxWidth: 'calc(100vw - 100px)'
                    }}
                  />
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
