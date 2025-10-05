import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from './AppProvider';

interface MinecraftServerBlockProps {
  serverAddress?: string;
  className?: string;
}

export const MinecraftServerBlock: React.FC<MinecraftServerBlockProps> = ({ 
  serverAddress = 'm4sub.click',
  className = '' 
}) => {
  const { language } = useAppContext();
  const [online, setOnline] = useState<string>(language === 'uk' ? 'Завантаження...' : 'Loading...');
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    const fetchServerStatus = () => {
      fetch(`https://api.mcsrvstat.us/2/${serverAddress}`)
        .then(res => res.json())
        .then(data => {
          if (data.online) {
            setOnline(`${data.players.online}/${data.players.max}`);
            setIsOnline(true);
          } else {
            setOnline(language === 'uk' ? 'Сервер офлайн' : 'Server offline');
            setIsOnline(false);
          }
        })
        .catch(() => {
          setOnline(language === 'uk' ? 'Помилка' : 'Error');
          setIsOnline(false);
        });
    };

    fetchServerStatus();
    const interval = setInterval(fetchServerStatus, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [serverAddress, language]);

  return (
    <motion.div
      className={`relative group ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Border wrapper with darker colors */}
      <div 
        className="absolute inset-0 bg-gradient-to-b from-green-900 to-amber-950"
        style={{
          clipPath: 'polygon(0px calc(100% - 16px), 8px calc(100% - 16px), 8px calc(100% - 8px), 16px calc(100% - 8px), 16px 100%, calc(100% - 16px) 100%, calc(100% - 16px) calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) calc(100% - 16px), 100% calc(100% - 16px), 100% 16px, calc(100% - 8px) 16px, calc(100% - 8px) 8px, calc(100% - 16px) 8px, calc(100% - 16px) 0px, 16px 0px, 16px 8px, 8px 8px, 8px 16px, 0px 16px)',
        }}
      />

      {/* Main Block Container with corner cuts - slightly smaller for border effect */}
      <div 
        className="minecraft-block relative overflow-hidden rounded-sm shadow-2xl"
        style={{
          clipPath: 'polygon(0px calc(100% - 16px), 8px calc(100% - 16px), 8px calc(100% - 8px), 16px calc(100% - 8px), 16px 100%, calc(100% - 16px) 100%, calc(100% - 16px) calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) calc(100% - 16px), 100% calc(100% - 16px), 100% 16px, calc(100% - 8px) 16px, calc(100% - 8px) 8px, calc(100% - 16px) 8px, calc(100% - 16px) 0px, 16px 0px, 16px 8px, 8px 8px, 8px 16px, 0px 16px)',
          margin: '3px',
        }}
      >
        {/* Grass Top Layer */}
        <div className="h-24 relative bg-gradient-to-b from-green-500 via-green-600 to-green-700 border-b-4 border-green-900">
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)]" />
          
          {/* Pixelated grass texture effect */}
          <div className="absolute inset-0 opacity-30">
            <div className="grid grid-cols-8 grid-rows-3 h-full">
              {Array.from({ length: 24 }).map((_, i) => (
                <div
                  key={i}
                  className="border-[0.5px] border-green-900/40"
                  style={{
                    backgroundColor: i % 3 === 0 ? 'rgba(34, 197, 94, 0.3)' : 
                                   i % 3 === 1 ? 'rgba(22, 163, 74, 0.3)' : 
                                                'rgba(21, 128, 61, 0.3)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Dark edge lines for 3D effect */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-green-800 opacity-60" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-green-900 opacity-80" />
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-green-800 opacity-60" />
          <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-green-800 opacity-60" />

          {/* Server Title */}
          <div className="relative z-10 h-full flex items-center justify-between px-6">
            <div className="flex items-center space-x-3">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <i className="fas fa-cube text-3xl text-white drop-shadow-lg" />
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-xl drop-shadow-lg">
                  {language === 'uk' ? 'Minecraft Сервер' : 'Minecraft Server'}
                </h3>
                <p className="text-green-100 text-sm drop-shadow-md">
                  {serverAddress}
                </p>
              </div>
            </div>

            {/* Online Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-300' : 'bg-red-400'} animate-pulse shadow-lg`} />
              <span className="text-white font-semibold drop-shadow-lg">
                {online}
              </span>
            </div>
          </div>
        </div>

        {/* Dirt Layer */}
        <div className="h-32 relative bg-gradient-to-b from-amber-900 via-amber-800 to-amber-900">
          {/* Inner shadow for depth */}
          <div className="absolute inset-0 shadow-[inset_0_-2px_4px_rgba(0,0,0,0.4)]" />
          
          {/* Pixelated dirt texture effect */}
          <div className="absolute inset-0 opacity-40">
            <div className="grid grid-cols-8 grid-rows-4 h-full">
              {Array.from({ length: 32 }).map((_, i) => (
                <div
                  key={i}
                  className="border-[0.5px] border-amber-950/50"
                  style={{
                    backgroundColor: i % 4 === 0 ? 'rgba(120, 53, 15, 0.4)' : 
                                   i % 4 === 1 ? 'rgba(146, 64, 14, 0.4)' : 
                                   i % 4 === 2 ? 'rgba(180, 83, 9, 0.4)' :
                                                'rgba(92, 51, 23, 0.4)',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Dark edge lines for 3D effect */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-950 opacity-80" />
          <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-amber-950 opacity-60" />
          <div className="absolute top-0 bottom-0 right-0 w-[2px] bg-amber-950 opacity-60" />

          {/* Server Actions */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center space-y-4 px-6">
            {/* Visit Website Button */}
            <motion.a
              href={`http://${serverAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-3 bg-green-700/80 hover:bg-green-600/80 text-white font-bold backdrop-blur-sm transition-all duration-200 flex items-center justify-center space-x-2 border-2 border-green-900 shadow-lg"
              whileTap={{ scale: 0.95 }} 
            >
              <i className="fas fa-external-link-alt" />
              <span>{language === 'uk' ? 'Відвідати сайт' : 'Visit Website'}</span>
            </motion.a>
          </div>
        </div>

        {/* 3D Shadow Effect */}
        <div className="absolute -bottom-2 -right-2 w-full h-full bg-black/30 -z-10 blur-xl" 
             style={{
               clipPath: 'polygon(0px calc(100% - 16px), 8px calc(100% - 16px), 8px calc(100% - 8px), 16px calc(100% - 8px), 16px 100%, calc(100% - 16px) 100%, calc(100% - 16px) calc(100% - 8px), calc(100% - 8px) calc(100% - 8px), calc(100% - 8px) calc(100% - 16px), 100% calc(100% - 16px), 100% 16px, calc(100% - 8px) 16px, calc(100% - 8px) 8px, calc(100% - 16px) 8px, calc(100% - 16px) 0px, 16px 0px, 16px 8px, 8px 8px, 8px 16px, 0px 16px)',
             }}
        />
      </div>

      {/* Floating Particles Animation */}
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-green-400/60 rounded-sm shadow-md"
          style={{
            left: `${20 + i * 30}%`,
            top: '20%',
          }}
          animate={{
            y: [-10, -30, -10],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeOut"
          }}
        />
      ))}
    </motion.div>
  );
};