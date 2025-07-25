import React from 'react';
import { motion } from 'framer-motion';

interface ProjectBannerProps {
  title: string;
  description: string;
  image: string;
  url: string;
  tags: string[];
  type: 'website' | 'webapp' | 'mobile' | 'design' | 'other';
  featured?: boolean;
  className?: string;
  language?: string;
}

export const ProjectBanner: React.FC<ProjectBannerProps> = ({
  title,
  description,
  image,
  url,
  tags,
  type,
  featured = false,
  className = '',
  language = 'en'
}) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'website': return 'fas fa-globe';
      case 'webapp': return 'fas fa-laptop-code';
      case 'mobile': return 'fas fa-mobile-alt';
      case 'design': return 'fas fa-paint-brush';
      default: return 'fas fa-project-diagram';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'website': return 'bg-blue-500';
      case 'webapp': return 'bg-green-500';
      case 'mobile': return 'bg-purple-500';
      case 'design': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <motion.div
      className={`group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-800 shadow-lg hover:shadow-2xl transition-all duration-500 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ y: -5 }}
    >
      {featured && ( /* Featured Badge */
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">
            {language === 'uk' ? 'Рекомендовано' : 'Featured'}
          </span>
        </div>
      )}      {/* Project Type Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`w-8 h-8 ${getTypeColor(type)} rounded-full flex items-center justify-center`}>
          <i className={`${getTypeIcon(type)} text-white text-sm`} />
        </div>
      </div>

      {/* Image Section */}
      <div className={`relative ${featured ? 'h-64 md:h-72 lg:h-80' : 'h-48'} overflow-hidden bg-gray-100 dark:bg-dark-700`}>
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* View Project Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-white/90 backdrop-blur-sm text-gray-900 font-semibold rounded-lg hover:bg-white transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <i className="fas fa-external-link-alt mr-2" />
            {language === 'uk' ? 'Переглянути Проект' : 'View Project'}
          </motion.a>
        </div>
      </div>

      {/* Content Section */}
      <div className={`p-6 ${featured ? 'space-y-4' : 'space-y-3'}`}>
        <div>
          <h3 className={`font-bold text-gray-900 dark:text-gray-100 ${
            featured ? 'text-xl md:text-2xl' : 'text-lg'
          }`}>
            {title}
          </h3>
          <p className={`text-gray-600 dark:text-gray-300 mt-2 ${
            featured ? 'text-base leading-relaxed' : 'text-sm'
          }`}>
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-600">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium text-sm transition-colors duration-200"
          >
            {language === 'uk' ? 'Відвідати Проект' : 'Visit Project'} →
          </a>
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <i className="fas fa-eye text-xs" />
            <span className="text-xs">{language === 'uk' ? 'Онлайн' : 'Live'}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Featured Projects Grid Component
export const FeaturedProjects: React.FC<{ projects: ProjectBannerProps[]; language?: string }> = ({ projects, language = 'en' }) => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-dark-800">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {language === 'uk' ? 'Рекомендовані Проекти' : 'Featured Projects'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === 'uk' 
              ? 'Демонстрація моїх найбільш значущих робіт та досягнень'
              : 'A showcase of my most significant work and achievements'
            }
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projects.map((project, index) => (
            <ProjectBanner
              key={index}
              {...project}
              language={language}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
