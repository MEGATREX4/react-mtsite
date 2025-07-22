import React from 'react';
import { motion } from 'framer-motion';

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  color: string;
  label: string;
  isPrimary?: boolean;
}

interface SocialButtonsProps {
  links: SocialLink[];
  variant: 'horizontal' | 'square';
  className?: string;
}

export const SocialButtons: React.FC<SocialButtonsProps> = ({ links, variant, className = '' }) => {
  if (variant === 'horizontal') {
    return (
      <div className={`space-y-3 ${className}`}>
        {links.filter(link => link.isPrimary).map((link, index) => (
          <motion.a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.color} text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-200 flex items-center justify-center space-x-3 w-full`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <i className={`${link.icon} text-xl`} />
            <span>{link.label}</span>
          </motion.a>
        ))}
      </div>
    );
  }

  // Square variant for less important social links
  return (
    <div className={`flex flex-wrap justify-center gap-3 ${className}`}>
      {links.filter(link => !link.isPrimary).map((link, index) => (
        <motion.a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-600 dark:text-gray-300 rounded-xl flex items-center justify-center transition-colors duration-200 flex-shrink-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title={link.label}
        >
          <i className={`${link.icon} text-lg`} />
        </motion.a>
      ))}
    </div>
  );
};

export const MediaPlayer: React.FC<{ type: 'youtube' | 'twitch'; embedUrl: string; title: string }> = ({ type, embedUrl, title }) => {
  return (
    <motion.div
      className="bg-white dark:bg-dark-800 rounded-xl shadow-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="aspect-video">
        <iframe
          src={embedUrl}
          title={title}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="p-4 flex items-center space-x-2">
        <i className={type === 'youtube' ? 'fab fa-youtube text-red-600' : 'fab fa-twitch text-purple-600'} />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
      </div>
    </motion.div>
  );
};
