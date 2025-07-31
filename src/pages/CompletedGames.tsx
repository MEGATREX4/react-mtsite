
import React, { useEffect, useState } from 'react';
import { useAppContext } from '../components/AppProvider';

interface Game {
  name: string;
  steamId?: number;
  rating?: number;
  gameUrl?: string;
  youtubeUrl?: string;
  coverUrl?: string;
}


export const CompletedGames: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('completedGamesViewMode') as 'grid' | 'list') || 'grid';
    }
    return 'grid';
  });
  const { translations, language } = useAppContext();

  useEffect(() => {
    fetch('/src/assets/completedGames.json')
      .then((res) => res.json())
      .then((data) => {
        setGames(data);
        setLoading(false);
      });
  }, []);

  // Save viewMode to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('completedGamesViewMode', viewMode);
    }
  }, [viewMode]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-10 text-primary-600 dark:text-primary-400 text-center flex items-center justify-center gap-3">
        <i className="fas fa-gamepad" />
        {translations?.common?.completedGames || (language === 'uk' ? 'Пройдені ігри' : 'Completed Games')}
      </h1>
      <div className="flex justify-end mb-6">
        <button
          className={`px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 mr-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200'}`}
          onClick={() => setViewMode('grid')}
        >
          <i className="fas fa-th-large mr-2" />
          {language === 'uk' ? 'Сітка' : 'Grid'}
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-gray-200 dark:bg-dark-700 text-gray-800 dark:text-gray-200'}`}
          onClick={() => setViewMode('list')}
        >
          <i className="fas fa-list mr-2" />
          {language === 'uk' ? 'Список' : 'List'}
        </button>
      </div>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {games.map((game) => (
            <div
              key={game.name}
              className="bg-white dark:bg-dark-800 rounded-2xl shadow-lg transform transition-transform duration-200 hover:-translate-y-1 grid grid-rows-[auto,auto,auto,1fr] gap-2 items-center p-4 h-full max-h-[520px]"
              style={{ minHeight: 0, display: 'flex', flexDirection: 'column' }}
            >
              {/* Picture */}
              <div className="row-span-1 w-full flex items-center justify-center aspect-[2/3] overflow-hidden rounded-xl">
                {game.coverUrl ? (
                  <img src={game.coverUrl} alt={game.name} className="w-full h-full object-cover" style={{ aspectRatio: '2/3' }} />
                ) : (
                  <div className="w-full h-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center" style={{ aspectRatio: '2/3' }}>
                    <span className="text-gray-500">No Cover</span>
                  </div>
                )}
              </div>
              {/* Name */}
              <h2 className="row-span-1 text-xl font-bold text-center mt-2 mb-1">{game.name}</h2>
              {/* Star rating */}
              {game.rating ? (
                <div className="row-span-1 flex flex-col items-center mb-1">
                  <div className="flex items-center justify-center mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={`fas fa-star ${i < Math.round((game.rating ?? 0) / 2) ? 'text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  {/* Numerical rating */}
                  <span className="text-yellow-500 font-semibold">{game.rating}/10</span>
                </div>
              ) : (
                <div className="row-span-1" />
              )}
              {/* Buttons */}
              <div className="row-span-1 flex flex-col items-center gap-2 mt-4 mb-4 px-2 justify-center">
                {game.gameUrl && (
                  <a
                    href={game.gameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 w-full rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                  >
                    <i className="fas fa-link" />
                    {language === 'uk' ? 'Гра' : 'Game'}
                  </a>
                )}
                {game.youtubeUrl && (
                  <a
                    href={game.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 w-full rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                  >
                    <i className="fab fa-youtube" />
                    {translations?.social?.youtube || (language === 'uk' ? 'YouTube' : 'YouTube')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {games.map((game) => (
            <div
              key={game.name}
              className="flex items-center justify-between p-4 bg-white dark:bg-dark-800 rounded-2xl shadow-lg transform transition-transform duration-200 hover:-translate-y-1 max-h-[520px]"
              style={{ minHeight: 0 }}
            >
              {/* Left side: image, name, stars, rating */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex items-center justify-center w-24 aspect-[2/3] overflow-hidden rounded-xl">
                  {game.coverUrl ? (
                    <img src={game.coverUrl} alt={game.name} className="w-full h-full object-cover" style={{ aspectRatio: '2/3' }} />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center" style={{ aspectRatio: '2/3' }}>
                      <span className="text-gray-500">No Cover</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <h2 className="text-xl font-bold truncate">{game.name}</h2>
                  {game.rating ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star ${i < Math.round((game.rating ?? 0) / 2) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-yellow-500 font-semibold">{game.rating}/10</span>
                    </div>
                  ) : null}
                </div>
              </div>
              {/* Right side: buttons */}
              <div className="flex flex-col gap-2 items-end ml-4">
                {game.gameUrl && (
                  <a
                    href={game.gameUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                  >
                    <i className="fas fa-link" />
                    {language === 'uk' ? 'Гра' : 'Game'}
                  </a>
                )}
                {game.youtubeUrl && (
                  <a
                    href={game.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                  >
                    <i className="fab fa-youtube" />
                    {translations?.social?.youtube || (language === 'uk' ? 'YouTube' : 'YouTube')}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedGames;
