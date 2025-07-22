import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../components/AppProvider';

export const NotFound: React.FC = () => {
  const { translations, language } = useAppContext();

  if (!translations) return null;

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-2xl mx-auto">
          {/* 404 Number */}
          <h1 className="text-9xl md:text-[12rem] font-bold text-primary-500 mb-4 leading-none">
            404
          </h1>

          {/* Error Message */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {language === 'uk' ? 'Сторінка не знайдена' : 'Page Not Found'}
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
            {language === 'uk' 
              ? 'Вибачте, але сторінка, яку ви шукаєте, не існує. Можливо, вона була переміщена або видалена.'
              : 'Sorry, but the page you are looking for does not exist. It may have been moved or deleted.'
            }
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
          </div>

          {/* Fun Element */}
          <div className="mt-12">
            <div className="text-6xl mb-4">🤔</div>
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'uk' 
                ? 'Схоже, ви заблукали у цифровому просторі!'
                : 'Looks like you got lost in the digital space!'
              }
            </p>
          </div>

          {/* Back Button Alternative */}
          <button
            onClick={() => window.history.back()}
            className="mt-8 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors duration-300"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            {language === 'uk' ? 'Повернутися назад' : 'Go Back'}
          </button>
        </div>
      </div>
    </div>
  );
};
