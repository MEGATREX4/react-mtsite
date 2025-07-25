import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AVAILABLE_TAGS } from '../constants/tags';
import { NotFound } from './NotFound';
import { motion } from 'framer-motion';

const TagPage: React.FC = () => {
  const { tag } = useParams<{ tag: string }>();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const tagData = AVAILABLE_TAGS.find(t => t.name === tag);

  useEffect(() => {
    if (tagData) {
      setIsRedirecting(true);
      setTimeout(() => window.location.href = tagData.url, 2000);
    } else if (tag) {
      navigate('/404', { replace: true }); // Redirect to NotFound page immediately
    }
  }, [tag, tagData, navigate]);

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 relative overflow-hidden flex items-center justify-center">
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

        <div className="relative z-10 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
            Зачекайте, відбувається перенаправлення...
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-md mx-auto">
            Ви будете перенаправлені на відповідну сторінку за кілька секунд.
          </p>
        </div>
      </div>
    );
  }

  return <NotFound />; // Render NotFound page if tag is invalid
};

export default TagPage;
