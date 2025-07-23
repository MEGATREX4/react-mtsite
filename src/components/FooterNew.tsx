import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from './AppProvider';

export const Footer: React.FC = () => {
  const { translations, language } = useAppContext();

  if (!translations) return null;

  const socialLinks = [
    { platform: 'youtube', url: 'https://youtube.com/@MEGATREX4', icon: 'fab fa-youtube', color: 'hover:text-red-500' },
    { platform: 'twitch', url: 'https://twitch.tv/megatrex4', icon: 'fab fa-twitch', color: 'hover:text-purple-500' },
    { platform: 'discord', url: 'https://discord.gg/Y9yfRxjAHB', icon: 'fab fa-discord', color: 'hover:text-indigo-500' },
    { platform: 'twitter', url: 'https://x.com/megatrex4', icon: 'fab fa-twitter', color: 'hover:text-gray-300' },
    { platform: 'telegram', url: 'https://t.me/megatrex4_news', icon: 'fab fa-telegram', color: 'hover:text-blue-400' },
    { platform: 'instagram', url: 'https://instagram.com/megatrex4', icon: 'fab fa-instagram', color: 'hover:text-pink-500' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary-400 rounded-full"
            style={{
              width: Math.random() * 40 + 20,
              height: Math.random() * 40 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-5, 5, -5],
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.img
                src="https://i.imgur.com/Cw1AbQd.png"
                alt="MEGATREX4 Logo"
                className="w-14 h-14 rounded-full border-2 border-primary-400"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              />
              <h3 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                MEGATREX4
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              {translations.home.description}
            </p>
            <div className="flex items-center space-x-3 text-gray-400 mb-6">
              <motion.i 
                className="fas fa-map-marker-alt text-primary-400" 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="font-medium">
                {language === 'uk' ? 'Україна 🇺🇦' : 'Ukraine 🇺🇦'}
              </span>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-gray-400 ${link.color} transition-colors duration-300 text-xl`}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  viewport={{ once: true }}
                >
                  <i className={link.icon} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Project Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-4 text-primary-300">
              {language === 'uk' ? 'Проєкти' : 'Projects'}
            </h4>
            <div className="space-y-3">
              <motion.a
                href="https://sumtranslate.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-300 hover:text-primary-300 transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <i className="fas fa-language text-primary-400" />
                <span>{translations.social.sumtrans}</span>
              </motion.a>
              <motion.a
                href="/portfolio"
                className="flex items-center space-x-2 text-gray-300 hover:text-primary-300 transition-colors duration-300"
                whileHover={{ x: 5 }}
              >
                <i className="fas fa-briefcase text-primary-400" />
                <span>{translations.common.portfolio}</span>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Support Section */}
        <motion.div
          className="border-t border-gray-700/50 pt-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4 text-primary-300">
              {language === 'uk' ? 'Підтримати проєкт' : 'Support the project'}
            </h4>
            <div className="flex justify-center space-x-4">
              <motion.a
                href="https://send.monobank.ua/jar/6WuAWRvdGN"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-lg transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-credit-card" />
                <span>{translations.social.mono}</span>
              </motion.a>
              <motion.a
                href="https://donatello.to/MEGATREX4"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-lg transition-all duration-300 flex items-center space-x-2"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="fas fa-heart" />
                <span>{translations.social.donatello}</span>
              </motion.a>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-700/50 pt-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} MEGATREX4. {translations.footer.copyright}
            </div>
            <div className="text-gray-400 text-sm flex items-center space-x-1">
              <span>{translations.footer.madeWith}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Netlify Status Badge */}
      <div className="bg-gray-800/50 py-2 text-center border-t border-gray-700/30">
        <img 
          src="https://api.netlify.com/api/v1/badges/7116163a-aa2c-42b3-90be-f9f820819bf2/deploy-status" 
          alt="Netlify Status"
          className="inline-block opacity-60 hover:opacity-100 transition-opacity duration-300"
        />
      </div>
    </footer>
  );
};
