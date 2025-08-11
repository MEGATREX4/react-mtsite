import React, { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../components/AppProvider';
import { loadCompletedGames } from '../utils/api';
import type { CompletedGame } from '../utils/api';

// Custom CSS for subgrid support
const subgridStyles = `
  .completed-games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
    grid-auto-rows: max-content;
  }
  
  .completed-game-card {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 6;
    align-items: stretch;
  }
  
  .completed-game-content {
    display: grid;
    grid-template-rows: subgrid;
    grid-row: span 6;
    gap: 0.75rem;
  }
  
  @supports not (grid-template-rows: subgrid) {
    .completed-game-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .completed-game-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 0.75rem;
    }
    .completed-game-footer {
      margin-top: auto;
    }
  }
  
  @media (min-width: 640px) {
    .completed-games-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 768px) {
    .completed-games-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .completed-games-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  @media (min-width: 1280px) {
    .completed-games-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }
`;

const CompletedGamesComponent: React.FC = () => {
  const [games, setGames] = useState<CompletedGame[]>([]);
  const [filteredGames, setFilteredGames] = useState<CompletedGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // New status filter
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('completedGamesViewMode') as 'grid' | 'list') || 'grid';
    }
    return 'grid';
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Show 12 games per page
  const { translations, language } = useAppContext();

  // Memoize background particles to prevent re-calculation on re-renders
  const [backgroundParticles] = useState(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: `bg-particle-${i}`,
      width: Math.random() * 60 + 20,
      height: Math.random() * 60 + 20,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 8 + 6,
    }))
  );

  // Memoized background animation to prevent re-renders
  const backgroundAnimation = useMemo(() => (
    <div className="absolute inset-0 opacity-20 dark:opacity-30">
      {backgroundParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary-400/40 dark:bg-primary-500/50 rounded-full"
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
          }}
        />
      ))}
    </div>
  ), [backgroundParticles]);

  // Helper function to render rating stars
  const renderRating = (rating: number | null | undefined, isCurrentlyPlaying: boolean = false) => {
    if (isCurrentlyPlaying || rating === null || rating === undefined) {
      // Show crossed-out stars for currently playing/unrated games
      return (
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative">
              <i className="fas fa-star text-gray-400 dark:text-gray-500 text-sm" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-red-500 transform rotate-12"></div>
              </div>
            </div>
          ))}
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            {isCurrentlyPlaying 
              ? (language === 'uk' ? 'Зараз граю' : 'Currently playing')
              : (language === 'uk' ? 'Не оцінено' : 'Not rated')
            }
          </span>
        </div>
      );
    }

    // Convert 10-point rating to 5-star system (rating / 2)
    const starRating = rating / 2;
    const fullStars = Math.floor(starRating);
    const hasHalfStar = starRating % 1 >= 0.5;
    
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: fullStars }).map((_, i) => (
          <i key={i} className="fas fa-star text-yellow-400 text-sm" />
        ))}
        {hasHalfStar && <i className="fas fa-star-half-alt text-yellow-400 text-sm" />}
        {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
          <i key={i + fullStars + (hasHalfStar ? 1 : 0)} className="far fa-star text-gray-300 dark:text-gray-600 text-sm" />
        ))}
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 ml-1">
          {rating}/10
        </span>
      </div>
    );
  };

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      setError(null);
      try {
        const loadedGames = await loadCompletedGames();
        setGames(loadedGames);
        setFilteredGames(loadedGames);
      } catch (err) {
        setError('Failed to load completed games');
      } finally {
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  // Filter games based on search term, tag, rating, and status
  useEffect(() => {
    let filtered = games;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(game =>
        game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (game.tags && game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }

    // Tag filter
    if (selectedTag) {
      filtered = filtered.filter(game =>
        game.tags && game.tags.includes(selectedTag)
      );
    }

    // Rating filter
    if (ratingFilter) {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(game =>
        game.rating && game.rating >= minRating
      );
    }

    // Status filter
    if (statusFilter) {
      if (statusFilter === 'completed') {
        filtered = filtered.filter(game => !game.isCurrentlyPlaying);
      } else if (statusFilter === 'playing') {
        filtered = filtered.filter(game => game.isCurrentlyPlaying);
      } else if (statusFilter === 'rated') {
        filtered = filtered.filter(game => game.rating !== null && game.rating !== undefined);
      } else if (statusFilter === 'unrated') {
        filtered = filtered.filter(game => game.rating === null || game.rating === undefined);
      }
    }

    setFilteredGames(filtered);
  }, [games, searchTerm, selectedTag, ratingFilter, statusFilter]);

  // Add this effect after other useEffects
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, selectedTag, ratingFilter, statusFilter]);

  // Get all unique tags from games
  const allTags = Array.from(new Set(games.flatMap(game => game.tags || []))).sort();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedGamesViewMode', viewMode);
    }
  }, [viewMode]);

  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentGames = filteredGames.slice(startIndex, endIndex);

  // Add this after other functions
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of grid
    const gridElement = document.getElementById('completed-games-grid');
    if (gridElement) {
      gridElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <div className="text-xl text-primary-600 dark:text-primary-400">Loading...</div>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 flex items-center justify-center">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
          <div className="text-xl text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 relative overflow-hidden">
      {/* Enhanced Background Animation */}
      {backgroundAnimation}
      
      {/* Inject custom CSS for subgrid */}
      <style dangerouslySetInnerHTML={{ __html: subgridStyles }} />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-xl opacity-40 dark:opacity-60 scale-110 w-20 h-20 mx-auto"></div>
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto shadow-2xl border-4 border-white dark:border-gray-700 relative z-10 flex items-center justify-center">
                <i className="fas fa-gamepad text-2xl text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
              {translations?.common?.completedGames || (language === 'uk' ? 'Пройдені ігри' : 'Completed Games')}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
              {language === 'uk' 
                ? 'Колекція ігор, які я пройшов і оцінив. Кожна гра супроводжується моєю особистою оцінкою та посиланнями.' 
                : 'A collection of games I\'ve completed and rated. Each game comes with my personal rating and relevant links.'}
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-6">
            {/* Search Bar with View Toggle */}
            <div className="flex justify-center">
              <div className="flex items-center gap-4 max-w-2xl w-full">
                {/* Search Input */}
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-search text-gray-400 dark:text-gray-500"></i>
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 rounded-2xl shadow-md focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder={language === 'uk' ? 'Пошук ігор...' : 'Search games...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      <i className="fas fa-times text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"></i>
                    </button>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex-shrink-0">
                  <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-2 shadow-md border border-primary-200/50 dark:border-primary-700/50 flex">
                    <button
                      className={`px-3 py-2 rounded-xl font-medium shadow-sm transition-all duration-300 flex items-center gap-2 ${
                        viewMode === 'grid' 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                          : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                      }`}
                      onClick={() => setViewMode('grid')}
                      title={language === 'uk' ? 'Сітка' : 'Grid'}
                    >
                      <i className="fas fa-th-large text-sm" />
                    </button>
                    <button
                      className={`px-3 py-2 rounded-xl font-medium shadow-sm transition-all duration-300 flex items-center gap-2 ${
                        viewMode === 'list' 
                          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg' 
                          : 'bg-transparent text-gray-700 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20'
                      }`}
                      onClick={() => setViewMode('list')}
                      title={language === 'uk' ? 'Список' : 'List'}
                    >
                      <i className="fas fa-list text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap justify-center gap-4">
              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <i className="fas fa-gamepad mr-1"></i>
                  {language === 'uk' ? 'Статус:' : 'Status:'}
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">{language === 'uk' ? 'Всі ігри' : 'All games'}</option>
                  <option value="completed">{language === 'uk' ? 'Пройдені' : 'Completed'}</option>
                  <option value="playing">{language === 'uk' ? 'Зараз граю' : 'Currently Playing'}</option>
                  <option value="rated">{language === 'uk' ? 'Оцінені' : 'Rated'}</option>
                  <option value="unrated">{language === 'uk' ? 'Не оцінені' : 'Not Rated'}</option>
                </select>
              </div>

              {/* Tag Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <i className="fas fa-tag mr-1"></i>
                  {language === 'uk' ? 'Тег:' : 'Tag:'}
                </label>
                <select
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  className="px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">{language === 'uk' ? 'Всі теги' : 'All tags'}</option>
                  {allTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  <i className="fas fa-star mr-1"></i>
                  {language === 'uk' ? 'Рейтинг:' : 'Rating:'}
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                  className="px-3 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 rounded-xl shadow-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200 text-gray-900 dark:text-white text-sm"
                >
                  <option value="">{language === 'uk' ? 'Всі рейтинги' : 'All ratings'}</option>
                  <option value="10">{language === 'uk' ? '5 зірок (10 балів)' : '5 stars (10 points)'}</option>
                  <option value="8">{language === 'uk' ? '4+ зірки (8+ балів)' : '4+ stars (8+ points)'}</option>
                  <option value="6">{language === 'uk' ? '3+ зірки (6+ балів)' : '3+ stars (6+ points)'}</option>
                  <option value="4">{language === 'uk' ? '2+ зірки (4+ бали)' : '2+ stars (4+ points)'}</option>
                  <option value="2">{language === 'uk' ? '1+ зірка (2+ бали)' : '1+ star (2+ points)'}</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(searchTerm || selectedTag || ratingFilter || statusFilter) && (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedTag('');
                    setRatingFilter('');
                    setStatusFilter('');
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
                {language === 'uk' 
                  ? `Показано ${filteredGames.length} з ${games.length} ігор`
                  : `Showing ${filteredGames.length} of ${games.length} games`}
              </span>
            </div>
          </div>
          
          {/* Enhanced Games Grid */}
          {filteredGames.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-full mx-auto shadow-lg border-4 border-white dark:border-gray-600 relative z-10 flex items-center justify-center mb-6">
                <i className="fas fa-search text-2xl text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === 'uk' ? 'Ігор не знайдено' : 'No games found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {language === 'uk' 
                  ? 'Спробуйте змінити критерії пошуку або фільтри'
                  : 'Try adjusting your search criteria or filters'}
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTag('');
                  setRatingFilter('');
                  setStatusFilter('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 mx-auto"
              >
                <i className="fas fa-refresh text-sm"></i>
                <span>{language === 'uk' ? 'Показати всі ігри' : 'Show all games'}</span>
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div id="completed-games-grid" className="completed-games-grid">
              {currentGames.map((game, index) => (
                <motion.div
                  key={game.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="completed-game-card group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-2xl border border-primary-200/50 dark:border-primary-700/50 transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400/10 to-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="completed-game-content relative z-10 p-4">
                    {/* Game Cover - Row 1 */}
                    <div className="w-full aspect-[2/3] overflow-hidden rounded-xl relative">
                      {game.coverUrl ? (
                        <img 
                          src={game.coverUrl} 
                          alt={game.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center rounded-xl">
                          <div className="text-center">
                            <i className="fas fa-gamepad text-3xl text-gray-400 dark:text-gray-500 mb-2"></i>
                            <span className="text-sm text-gray-500 dark:text-gray-400">No Cover</span>
                          </div>
                        </div>
                      )}
                      
                      {/* Status and Rating Badge */}
                      {game.isCurrentlyPlaying ? (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                          <i className="fas fa-play mr-1"></i>
                          {language === 'uk' ? 'Граю' : 'Playing'}
                        </div>
                      ) : game.rating ? (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          {game.rating}/10
                        </div>
                      ) : (
                        <div className="absolute top-2 right-2 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                          <i className="fas fa-question mr-1"></i>
                          {language === 'uk' ? 'Без оцінки' : 'Not rated'}
                        </div>
                      )}
                    </div>

                    {/* Game Title - Row 2 */}
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center line-clamp-2">
                      {game.name}
                    </h3>

                    {/* Tags - Row 3 */}
                    <div className="flex flex-wrap justify-center gap-1 min-h-[3.5rem] items-start content-start">
                      {game.tags && game.tags.length > 0 ? (
                        <>
                          {game.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full border border-primary-200 dark:border-primary-700/50"
                            >
                              {tag}
                            </span>
                          ))}
                          {game.tags.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-700">
                              +{game.tags.length - 3}
                            </span>
                          )}
                        </>
                      ) : null}
                    </div>

                    {/* Star Rating - Row 4 */}
                    <div className="flex items-center justify-center">
                      {renderRating(game.rating, game.isCurrentlyPlaying)}
                    </div>

                    {/* Spacer - Row 5 */}
                    <div className="flex-1"></div>

                    {/* Action Buttons - Row 6 */}
                    <div className="completed-game-footer space-y-2">
                      {game.gameUrl && (
                        <a
                          href={game.gameUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                        >
                          <i className="fas fa-external-link-alt text-xs" />
                          <span>{language === 'uk' ? 'Гра' : 'Game'}</span>
                        </a>
                      )}
                      {game.youtubeUrl && game.youtubeUrl !== '#' && (
                        <a
                          href={game.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-2 px-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 text-sm"
                        >
                          <i className="fab fa-youtube text-xs" />
                          <span>{translations?.social?.youtube || 'YouTube'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            // Enhanced List View
            <div className="space-y-4">
              {currentGames.map((game, index) => (
                <motion.div
                  key={game.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-lg hover:shadow-2xl border border-primary-200/50 dark:border-primary-700/50 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-400/10 to-primary-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative z-10 p-6 flex items-center gap-6">
                    {/* Game Cover */}
                    <div className="flex-shrink-0 w-20 aspect-[2/3] overflow-hidden rounded-xl relative">
                      {game.coverUrl ? (
                        <img 
                          src={game.coverUrl} 
                          alt={game.name} 
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" 
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center rounded-xl">
                          <i className="fas fa-gamepad text-lg text-gray-400 dark:text-gray-500"></i>
                        </div>
                      )}
                      
                      {/* Status and Rating Badge */}
                      {game.isCurrentlyPlaying ? (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-green-400 to-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg animate-pulse">
                          <i className="fas fa-play text-xs"></i>
                        </div>
                      ) : game.rating ? (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                          {game.rating}
                        </div>
                      ) : (
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                          <i className="fas fa-question text-xs"></i>
                        </div>
                      )}
                    </div>

                    {/* Game Info */}
                    <div className="flex-grow min-w-0">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate">
                        {game.name}
                      </h3>
                      
                      {/* Rating Stars */}
                      <div className="flex items-center gap-3 mb-2">
                        {renderRating(game.rating, game.isCurrentlyPlaying)}
                      </div>

                      {/* Tags */}
                      {game.tags && game.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {game.tags.slice(0, 4).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs rounded-full border border-primary-200 dark:border-primary-700/50"
                            >
                              {tag}
                            </span>
                          ))}
                          {game.tags.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full border border-gray-200 dark:border-gray-700">
                              +{game.tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex-shrink-0 flex flex-col gap-2">
                      {game.gameUrl && (
                        <a
                          href={game.gameUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm whitespace-nowrap"
                        >
                          <i className="fas fa-external-link-alt text-xs" />
                          <span>{language === 'uk' ? 'Гра' : 'Game'}</span>
                        </a>
                      )}
                      {game.youtubeUrl && game.youtubeUrl !== '#' && (
                        <a
                          href={game.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 text-sm whitespace-nowrap"
                        >
                          <i className="fab fa-youtube text-xs" />
                          <span>{translations?.social?.youtube || 'YouTube'}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                  ? `Сторінка ${currentPage} з ${totalPages} • Показано ${currentGames.length} з ${filteredGames.length} ігор`
                  : `Page ${currentPage} of ${totalPages} • Showing ${currentGames.length} of ${filteredGames.length} games`
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
    </div>
  );
};

const CompletedGames = React.memo(CompletedGamesComponent);

export default CompletedGames;
