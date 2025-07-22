import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../components/AppProvider';
import { SocialButtons } from '../components/SocialButtons';
import { fetchLatestVideo } from '../utils/api';
import type { YouTubeVideo } from '../types';

export const Home: React.FC = () => {
  const { translations, language } = useAppContext();
  const [latestVideo, setLatestVideo] = useState<YouTubeVideo | null>(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const video = await fetchLatestVideo();
        setLatestVideo(video);
      } catch (error) {
        console.error('Error loading video:', error);
      }
    };

    loadVideo();
  }, []);

  if (!translations) {
    return null;
  }

  const socialLinks = [
    { 
      platform: 'youtube', 
      url: 'https://youtube.com/@MEGATREX4', 
      icon: 'fab fa-youtube', 
      color: 'bg-red-600 hover:bg-red-700',
      label: translations.social?.youtube || 'YouTube',
      isPrimary: true
    },
    { 
      platform: 'twitch', 
      url: 'https://twitch.tv/megatrex4', 
      icon: 'fab fa-twitch', 
      color: 'bg-purple-600 hover:bg-purple-700',
      label: translations.social?.twitch || 'Twitch',
      isPrimary: true
    },
    { 
      platform: 'discord', 
      url: 'https://discord.gg/summinecraft', 
      icon: 'fab fa-discord', 
      color: 'bg-indigo-600 hover:bg-indigo-700',
      label: translations.social?.discord || 'Discord',
      isPrimary: true
    },
    { 
      platform: 'portfolio', 
      url: '/portfolio', 
      icon: 'fas fa-briefcase', 
      color: 'bg-primary-600 hover:bg-primary-700',
      label: translations.common?.portfolio || (language === 'uk' ? 'Портфоліо' : 'Portfolio'),
      isPrimary: true
    },
    { 
      platform: 'twitter', 
      url: 'https://x.com/megatrex4', 
      icon: 'fab fa-x-twitter', 
      color: 'bg-gray-800 hover:bg-gray-900',
      label: translations.social?.twitter || 'Twitter'
    },
    { 
      platform: 'telegram', 
      url: 'https://t.me/modcheck', 
      icon: 'fab fa-telegram', 
      color: 'bg-blue-500 hover:bg-blue-600',
      label: translations.social?.telegram || 'Telegram'
    },
    { 
      platform: 'instagram', 
      url: 'https://instagram.com/megatrex4', 
      icon: 'fab fa-instagram', 
      color: 'bg-pink-600 hover:bg-pink-700',
      label: translations.social?.instagram || 'Instagram'
    },
    { 
      platform: 'tiktok', 
      url: 'https://tiktok.com/@megatrex4', 
      icon: 'fab fa-tiktok', 
      color: 'bg-black hover:bg-gray-800',
      label: translations.social?.tiktok || 'TikTok'
    },
    { 
      platform: 'mastodon', 
      url: 'https://mastodon.social/@megatrex4', 
      icon: 'fab fa-mastodon', 
      color: 'bg-blue-600 hover:bg-blue-700',
      label: translations.social?.mastodon || 'Mastodon'
    },
    { 
      platform: 'bluesky', 
      url: 'https://bsky.app/profile/megatrex4.bsky.social', 
      icon: 'fas fa-cloud', 
      color: 'bg-blue-400 hover:bg-blue-500',
      label: translations.social?.bluesky || 'BlueSky'
    },
  ];

  const supportLinks = [
    {
      platform: 'mono',
      url: 'https://send.monobank.ua/jar/2jMrnMPWGS',
      icon: 'fas fa-credit-card',
      color: 'bg-black hover:bg-gray-800',
      label: translations.social.mono,
      isPrimary: true
    },
    {
      platform: 'donatello',
      url: 'https://donatello.to/megatrex4',
      icon: 'fas fa-heart',
      color: 'bg-red-500 hover:bg-red-600',
      label: translations.social.donatello,
      isPrimary: true
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 relative overflow-hidden">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary-400/40 dark:bg-primary-500/50 rounded-full"
            style={{
              width: Math.random() * 80 + 30,
              height: Math.random() * 80 + 30,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-15, 15, -15],
              x: [-10, 10, -10],
              scale: [1, 1.3, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-lg mx-auto">
          {/* Enhanced Profile Section */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Avatar with glow effect */}
            <motion.div
              className="mb-6 relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-xl opacity-40 dark:opacity-60 scale-110"></div>
              <img
                src="https://i.imgur.com/Cw1AbQd.png"
                alt="MEGATREX4 Avatar"
                className="w-32 h-32 rounded-full mx-auto shadow-2xl border-4 border-white dark:border-gray-700 relative z-10"
                loading="eager"
              />
              <div className="absolute -top-1 -right-1 w-8 h-8 bg-green-500 border-4 border-white dark:border-gray-700 rounded-full z-20 animate-pulse"></div>
            </motion.div>

            {/* Enhanced Title */}
            <motion.h1
              className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              MEGATREX4
            </motion.h1>

            {/* Multi-role subtitle with better contrast */}
            <motion.div
              className="mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {[
                  { text: translations.home.roles?.streamer || (language === 'uk' ? 'Стрімер' : 'Streamer'), icon: 'fas fa-video', color: 'bg-red-100 text-red-800 dark:bg-red-900/70 dark:text-red-200 border-red-200 dark:border-red-700' },
                  { text: translations.home.roles?.translator || (language === 'uk' ? 'Перекладач' : 'Translator'), icon: 'fas fa-language', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/70 dark:text-blue-200 border-blue-200 dark:border-blue-700' },
                  { text: translations.home.roles?.blogger || (language === 'uk' ? 'Блогер' : 'Blogger'), icon: 'fas fa-pen-fancy', color: 'bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-200 border-green-200 dark:border-green-700' },
                  { text: translations.home.roles?.artist || (language === 'uk' ? '3D Художник' : '3D Artist'), icon: 'fas fa-cube', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/70 dark:text-purple-200 border-purple-200 dark:border-purple-700' },
                  { text: translations.home.roles?.modder || (language === 'uk' ? 'Моддер' : 'Modder'), icon: 'fas fa-hammer', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/70 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700' }
                ].map((role, index) => (
                  <motion.span
                    key={role.text}
                    className={`${role.color} px-3 py-1.5 rounded-full text-sm font-semibold flex items-center space-x-1.5 border shadow-sm`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.08 }}
                  >
                    <i className={`${role.icon} text-xs`} />
                    <span>{role.text}</span>
                  </motion.span>
                ))}
              </div>
            </motion.div>

            <motion.p
              className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto mb-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              {translations.home.description}
            </motion.p>
          </motion.div>

          {/* Enhanced Media Players Section */}
          <motion.div
            className="grid grid-cols-2 gap-4 mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {/* YouTube Player */}
            <motion.div
              className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              {latestVideo ? (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${latestVideo.id}?autoplay=0&mute=1`}
                    title={latestVideo.title}
                    className="w-full h-full rounded-2xl"
                    frameBorder="0"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <a
                  href="https://youtube.com/@MEGATREX4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block relative aspect-video bg-gradient-to-br from-red-500 to-red-600 text-white p-6 text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-red-400 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10 flex flex-col items-center justify-center h-full">
                    <i className="fab fa-youtube text-4xl mb-2" />
                    <p className="text-sm font-medium">{translations.home.latestVideo}</p>
                  </div>
                </a>
              )}
            </motion.div>

            {/* Twitch Player */}
            <motion.div
              className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg hover:shadow-2xl transition-all duration-300"
              whileHover={{ scale: 1.02, y: -2 }}
            >
              <a
                href="https://twitch.tv/megatrex4"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative aspect-video bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex flex-col items-center justify-center h-full">
                  <i className="fab fa-twitch text-4xl mb-2" />
                  <p className="text-sm font-medium">{translations.home.watchLive}</p>
                </div>
              </a>
            </motion.div>
          </motion.div>

          {/* Primary Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <SocialButtons links={socialLinks} variant="horizontal" className="mb-6" />
          </motion.div>

          {/* Secondary Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mb-6"
          >
            <SocialButtons links={socialLinks} variant="square" />
          </motion.div>

          {/* Support Section */}
          <motion.div
            className="mt-8 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-4">
              {language === 'uk' ? 'Підтримати проєкт' : 'Support the project'}
            </h3>
            <SocialButtons links={supportLinks} variant="horizontal" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
