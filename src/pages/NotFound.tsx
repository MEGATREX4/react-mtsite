import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../components/AppProvider';

const NotFoundComponent: React.FC = () => {
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

  if (!translations) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 relative overflow-hidden">
      {/* Enhanced Background Animation */}
      {backgroundAnimation}

      <div className="container mx-auto px-4 py-16 relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Enhanced Header */}
            <div className="mb-12 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-full blur-xl opacity-40 dark:opacity-60 scale-110 w-20 h-20 mx-auto"></div>
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full mx-auto shadow-2xl border-4 border-white dark:border-gray-700 relative z-10 flex items-center justify-center mb-6">
                <i className="fas fa-exclamation-triangle text-2xl text-white" />
              </div>

              {/* 404 Number */}
              <h1 className="text-8xl md:text-9xl font-bold mb-4 bg-gradient-to-r from-red-600 via-red-500 to-red-400 bg-clip-text text-transparent">
                404
              </h1>

              {/* Error Message */}
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {language === 'uk' ? 'Сторінка не знайдена' : 'Page Not Found'}
              </h2>

              {/* Description */}
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto mb-8">
                {language === 'uk' 
                  ? 'Вибачте, але сторінка, яку ви шукаєте, не існує. Можливо, вона була переміщена або видалена.'
                  : 'Sorry, but the page you are looking for does not exist. It may have been moved or deleted.'
                }
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/"
                className="px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
              >
                <i className="fas fa-home text-lg"></i>
                <span>{language === 'uk' ? 'На головну' : 'Go Home'}</span>
              </Link>

              <Link
                to="/portfolio"
                className="px-8 py-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-primary-200/50 dark:border-primary-700/50 text-gray-900 dark:text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3"
              >
                <i className="fas fa-briefcase text-lg"></i>
                <span>{language === 'uk' ? 'Портфоліо' : 'Portfolio'}</span>
              </Link>
            </div>

            {/* Fun Element */}
            <motion.div
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-primary-200/50 dark:border-primary-700/50"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="text-6xl mb-4">🤔</div>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {language === 'uk' 
                  ? 'Схоже, ви заблукали у цифровому просторі!'
                  : 'Looks like you got lost in the digital space!'
                }
              </p>

              {/* Back Button Alternative */}
              <button
                onClick={() => window.history.back()}
                className="mt-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-300 flex items-center gap-2 mx-auto"
              >
                <i className="fas fa-arrow-left"></i>
                <span>{language === 'uk' ? 'Повернутися назад' : 'Go Back'}</span>
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const NotFound = React.memo(NotFoundComponent);
