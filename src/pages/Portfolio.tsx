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
      {/* Header Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-primary-700 to-gray-900 dark:from-gray-100 dark:via-primary-400 dark:to-gray-100 bg-clip-text text-transparent">
            {translations.portfolio?.title || (language === 'uk' ? 'Портфоліо' : 'Portfolio')}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {translations.portfolio?.description || (language === 'uk' ? 'Колекція моїх робіт та проектів' : 'A collection of my work and projects')}
          </p>
        </div>
      </section>

      {/* Search and Sort Section */}
      <section className="py-6 bg-white/90 dark:bg-dark-900/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-dark-700/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder={language === 'uk' ? 'Пошук проектів...' : 'Search projects...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <i className="fas fa-times" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                {language === 'uk' ? 'Сортувати:' : 'Sort by:'}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'category')}
                className="px-4 py-2 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              >
                <option value="date">{language === 'uk' ? 'Дата' : 'Date'}</option>
                <option value="title">{language === 'uk' ? 'Назва' : 'Title'}</option>
                <option value="category">{language === 'uk' ? 'Категорія' : 'Category'}</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="mt-4 text-sm text-gray-600 dark:text-gray-400 text-center">
            {searchQuery ? (
              <span>
                {language === 'uk' 
                  ? `Знайдено ${filteredImages.length} результатів для "${searchQuery}"`
                  : `Found ${filteredImages.length} results for "${searchQuery}"`
                }
              </span>
            ) : (
              <span>
                {language === 'uk' 
                  ? `Показано ${filteredImages.length} проектів`
                  : `Showing ${filteredImages.length} projects`
                }
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white/80 dark:bg-dark-900/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-dark-700/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/25'
                    : 'bg-gray-100/80 dark:bg-dark-700/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600 hover:shadow-md'
                }`}
              >
                {category === 'all' 
                  ? (language === 'uk' ? 'Всі' : 'All')
                  : getCategoryDisplayName(category, language)
                }
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 bg-gray-50 dark:bg-dark-800">
        <div className="container mx-auto px-4">
          {/* Gallery Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              {language === 'uk' ? 'Галерея Робіт' : 'Work Gallery'}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {language === 'uk' ? 'Колекція моїх проектів та творчих робіт' : 'A collection of my projects and creative work'}
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <motion.div
              className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 p-2"
              layout
            >
              <AnimatePresence>
                {filteredImages.map((image) => (
                  <motion.div
                    key={image.id}
                    className="group cursor-pointer portfolio-card gallery-item no-layout-shift"
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => openModal(image)}
                  >
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-200 dark:bg-dark-700 shadow-lg hover:shadow-xl transition-shadow duration-300 will-change-transform">
                      <LazyLoadImage
                        src={image.url || 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22400%22%3E%3Crect width=%22400%22 height=%22400%22 fill=%22%23f0f0f0%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22%3ENo Image%3C/text%3E%3C/svg%3E'}
                        alt={image.title || 'No Image Available'}
                        className="portfolio-image transition-transform duration-700 ease-out group-hover:scale-105"
                        effect="opacity"
                        placeholderSrc="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect width='400' height='400' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999'%3ELoading...%3C/text%3E%3C/svg%3E"
                        wrapperClassName="w-full h-full"
                      />
                      
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500 ease-out flex items-center justify-center rounded-2xl">
                        <div className="transform scale-0 group-hover:scale-100 transition-transform duration-500 ease-out opacity-0 group-hover:opacity-100">
                          <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <i className="fas fa-expand text-white text-lg" />
                          </div>
                        </div>
                      </div>
                      
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 opacity-90">
                        <span className="px-3 py-1 text-xs font-medium bg-black/70 backdrop-blur-sm text-white rounded-full">
                          {getCategoryDisplayName(image.category, language)}
                        </span>
                      </div>

                      {/* Title Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent rounded-b-2xl transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                        <h3 className="font-semibold text-white text-sm truncate">
                          {image.title || (language === 'uk' ? 'Без назви' : 'Untitled')}
                        </h3>
                        {image.description && (
                          <p className="text-white/90 text-xs mt-1 line-clamp-2">
                            {language === 'uk' ? image.description : (image.descriptionEn || image.description)}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}

          {filteredImages.length === 0 && !isLoading && (
            <div className="text-center py-20">
              <i className="fas fa-images text-6xl text-gray-400 mb-4" />
              <p className="text-xl text-gray-600 dark:text-gray-400">
                {language === 'uk' 
                  ? 'Зображення не знайдено в цій категорії'
                  : 'No images found in this category'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Projects Section */}
      <FeaturedProjects projects={featuredProjects} language={language} />

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
