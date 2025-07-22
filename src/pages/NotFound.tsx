import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppContext } from '../components/AppProvider';

export const NotFound: React.FC = () => {
  const { translations, language } = useAppContext();

  if (!translations) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* 404 Number */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            className="text-9xl md:text-[12rem] font-bold text-primary-500 mb-4 leading-none"
          >
            404
          </motion.h1>

          {/* Error Message */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          >
            {language === 'uk' ? 'Сторінка не знайдена' : 'Page Not Found'}
          </motion.h2>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
          >
            {language === 'uk' 
              ? 'Вибачте, але сторінка, яку ви шукаєте, не існує. Можливо, вона була переміщена або видалена.'
              : 'Sorry, but the page you are looking for does not exist. It may have been moved or deleted.'
            }
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/"
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-primary-500/20"
            >
              <i className="fas fa-home mr-2"></i>
              {language === 'uk' ? 'На головну' : 'Go Home'}
            </Link>

            <Link
              to="/portfolio"
              className="bg-gray-100 hover:bg-gray-200 dark:bg-dark-800 dark:hover:bg-dark-700 text-gray-900 dark:text-gray-100 font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-gray-500/20"
            >
              <i className="fas fa-briefcase mr-2"></i>
              {language === 'uk' ? 'Портфоліо' : 'Portfolio'}
            </Link>
          </motion.div>

          {/* Fun Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-12"
          >
            <div className="text-6xl mb-4">🤔</div>
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'uk' 
                ? 'Схоже, ви заблукали у цифровому просторі!'
                : 'Looks like you got lost in the digital space!'
              }
            </p>
          </motion.div>

          {/* Back Button Alternative */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            onClick={() => window.history.back()}
            className="mt-8 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            {language === 'uk' ? 'Повернутися назад' : 'Go Back'}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};
