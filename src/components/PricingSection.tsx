import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from './AppProvider';

interface ServiceCard {
  id: string;
  title: string;
  titleEn: string;
  price: string;
  priceEn: string;
  description: string;
  descriptionEn: string;
  features: string[];
  featuresEn: string[];
  icon: string;
  color: string;
  examples?: string[];
  popular?: boolean;
  contactRequired?: boolean;
}

export const PricingSection: React.FC = () => {
  const { language } = useAppContext();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [currentExampleIndex, setCurrentExampleIndex] = useState<{ [key: string]: number }>({});
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const touchStartX = useRef<number>(0);

  const services: ServiceCard[] = [
    {
      id: 'simple-mod',
      title: 'Простий Мод',
      titleEn: 'Simple Mod',
      price: 'від $20',
      priceEn: 'from $20',
      description: 'Розробка простих Fabric модів для Minecraft з базовим функціоналом',
      descriptionEn: 'Development of simple Minecraft Fabric mods with basic functionality',
      features: [
        'Базовий функціонал',
        'Безкоштовні правки (до 3)',
        'Вихідний код',
        'Підтримка',
        'Документація'
      ],
      featuresEn: [
        'Basic functionality',
        'Free revisions (up to 3)',
        'Source code',
        'Support',
        'Documentation'
      ],
      icon: 'fas fa-cube',
      color: 'from-green-500 to-green-600',
      examples: [
        'https://cdn.modrinth.com/data/XvdDyGln/images/27292b07b519e48699396747283b1626c1eab0c6.jpeg',
        'https://cdn.modrinth.com/data/59Xtpez1/images/03ce295e730cc2d1e33be89b90151dee6cd0bb07.png'
      ]
    },
    {
      id: 'complex-mod',
      title: 'Складний Мод',
      titleEn: 'Complex Mod',
      price: 'Індивідуально',
      priceEn: 'Custom Quote',
      description: 'Комплексні Fabric моди з унікальними механіками та системами',
      descriptionEn: 'Complex Fabric mods with unique mechanics and systems',
      features: [
        'Складні механіки',
        'Інтеграція з іншими модами',
        'Кастомні GUI',
        'Тимчасовий програмерський арт (безкоштовно)',
        'Документація',
        'Розширена підтримка'
      ],
      featuresEn: [
        'Complex mechanics',
        'Integration with other mods',
        'Custom GUI',
        'Temporary programmer art (free)',
        'Documentation',
        'Extended support'
      ],
      icon: 'fas fa-cogs',
      color: 'from-purple-500 to-purple-600',
      popular: true,
      contactRequired: false
    },
    {
      id: '3d-models',
      title: '3D Моделі та Текстури',
      titleEn: '3D Models & Textures',
      price: 'від $5',
      priceEn: 'from $5',
      description: 'Створення 3D моделей, текстур та скінів у стилі Minecraft',
      descriptionEn: 'Creation of 3D models, textures and skins in Minecraft style',
      features: [
        'Блоки та предмети',
        'Скіни для гравців',
        'Інструменти та зброя',
        '3D рендер в Blender',
        'Вихідні файли',
        'Інструкція з використання'
      ],
      featuresEn: [
        'Blocks and items',
        'Player skins',
        'Tools and weapons',
        '3D render in Blender',
        'Source files',
        'Usage instructions'
      ],
      icon: 'fas fa-paint-brush',
      color: 'from-blue-500 to-blue-600',
      examples: [
        'https://i.imgur.com/sXzYHXE.png',
        'https://i.imgur.com/aKnJdVR.png',
        'https://i.imgur.com/r91lLUJ.png'
      ]
    },
    {
      id: 'server-hosting',
      title: 'Хостинг Серверів',
      titleEn: 'Server Hosting',
      price: 'Запитайте ціну',
      priceEn: 'Request Pricing',
      description: 'Налаштування, хостинг та підтримка серверів Minecraft',
      descriptionEn: 'Setup, hosting and maintenance of Minecraft servers',
      features: [
        'Налаштування сервера',
        'Встановлення модів/плагінів',
        'Оптимізація продуктивності',
        'Технічна підтримка 24/7',
        'Щомісячне обслуговування'
      ],
      featuresEn: [
        'Server setup',
        'Mods/plugins installation',
        'Performance optimization',
        '24/7 technical support',
        'Monthly maintenance'
      ],
      icon: 'fas fa-server',
      color: 'from-orange-500 to-orange-600',
      contactRequired: false
    }
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Trigger visibility animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  

  const handleContact = () => {
    window.open('https://discord.gg/Y9yfRxjAHB', '_blank');
  };

  // Handle touch events for swipe on examples
  const handleTouchStart = (e: React.TouchEvent, serviceId: string) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent, service: ServiceCard) => {
    if (!service.examples || service.examples.length <= 1) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        // Swipe left - next image
        setCurrentExampleIndex(prev => ({
          ...prev,
          [service.id]: ((prev[service.id] || 0) + 1) % service.examples!.length
        }));
      } else {
        // Swipe right - previous image
        setCurrentExampleIndex(prev => ({
          ...prev,
          [service.id]: prev[service.id] > 0 
            ? prev[service.id] - 1 
            : service.examples!.length - 1
        }));
      }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        @keyframes slideArrow {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(10px); }
        }
        
        @keyframes rotateIcon {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.2) rotate(10deg); }
          75% { transform: scale(1.2) rotate(-10deg); }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0;
            transform: translateX(-50px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0;
            transform: translateX(50px);
          }
          to { 
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes popIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes backgroundFloat {
          0%, 100% { 
            transform: translate(0, 0);
          }
          25% { 
            transform: translate(30px, -30px);
          }
          50% { 
            transform: translate(0, 0);
          }
          75% { 
            transform: translate(-30px, 30px);
          }
        }
        
        .pricing-bg-blob-1 {
          animation: backgroundFloat 20s ease-in-out infinite;
        }
        
        .pricing-bg-blob-2 {
          animation: backgroundFloat 20s ease-in-out infinite;
          animation-delay: 5s;
        }
        
        .pricing-card {
          transition: all 0.3s ease;
        }
        
        .pricing-card:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        .pricing-icon-animate {
          animation: rotateIcon 2s ease-in-out infinite;
        }
        
        .pricing-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .pricing-arrow {
          animation: slideArrow 2s ease-in-out infinite;
        }
        
        .pricing-modal-backdrop {
          animation: fadeIn 0.3s ease-out;
        }
        
        .pricing-modal-content {
          animation: modalSlideIn 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}} />
      
      <div className="py-8 sm:py-12 md:py-16 px-4 relative overflow-hidden min-h-screen">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20 pointer-events-none">
          <div className="pricing-bg-blob-1 absolute top-0 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full blur-3xl" />
          <div className="pricing-bg-blob-2 absolute bottom-0 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header Section */}
          <div 
            className={`text-center mb-8 sm:mb-10 md:mb-12 transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="inline-block mb-4 transform transition-transform duration-300 hover:scale-105">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-primary-600 via-primary-500 to-purple-500 bg-clip-text text-transparent">
                {language === 'uk' ? 'Послуги та Ціни' : 'Services & Pricing'}
              </h2>
            </div>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              {language === 'uk' 
                ? 'Перетворюю ваші ідеї в реальність - від простих модів до складних проєктів'
                : 'Turning your ideas into reality - from simple mods to complex projects'}
            </p>
          </div>

          {/* Idea to Reality Visual */}
          <div className={`mb-8 sm:mb-10 md:mb-12 relative px-4 sm:px-8 transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Desktop Version */}
            <div className="hidden sm:block">
              <div className="relative h-32 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full h-1 bg-gradient-to-r from-transparent via-primary-400 to-transparent" />
                </div>
                
                <div className="relative flex items-center justify-between w-full max-w-4xl">
                  {/* Idea */}
                  <div className="flex flex-col items-center pricing-float">
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-3 transition-transform">
                      <i className="fas fa-lightbulb text-xl sm:text-2xl text-yellow-500" />
                    </div>
                    <span className="mt-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                      {language === 'uk' ? 'Ідея' : 'Idea'}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex-1 flex items-center justify-center">
                    <i className="fas fa-arrow-right text-lg sm:text-2xl text-primary-500 pricing-arrow" />
                  </div>

                  {/* Blueprint */}
                  <div className="flex flex-col items-center pricing-float" style={{ animationDelay: '0.5s' }}>
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:-rotate-3 transition-transform">
                      <i className="fas fa-drafting-compass text-xl sm:text-2xl text-blue-600 dark:text-blue-300" />
                    </div>
                    <span className="mt-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                      {language === 'uk' ? 'План' : 'Blueprint'}
                    </span>
                  </div>

                  {/* Arrow */}
                  <div className="flex-1 flex items-center justify-center">
                    <i className="fas fa-arrow-right text-lg sm:text-2xl text-primary-500 pricing-arrow" style={{ animationDelay: '0.5s' }} />
                  </div>

                  {/* Reality */}
                  <div className="flex flex-col items-center pricing-float" style={{ animationDelay: '1s' }}>
                    <div className="w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-800 dark:to-green-900 rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-3 transition-transform">
                      <i className="fas fa-cube text-xl sm:text-2xl text-green-600 dark:text-green-300" />
                    </div>
                    <span className="mt-2 text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400">
                      {language === 'uk' ? 'Реальність' : 'Reality'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Version - Vertical Layout */}
            <div className="sm:hidden">
              <div className="flex flex-col items-center space-y-4">
                <div 
                  className="flex items-center gap-4 w-full max-w-xs"
                  style={{ animation: isVisible ? 'slideInLeft 0.5s ease-out' : 'none' }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-lightbulb text-lg text-yellow-500" />
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-primary-400 dark:from-gray-600 dark:to-primary-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {language === 'uk' ? 'Ідея' : 'Idea'}
                  </span>
                </div>

                <div 
                  className="flex items-center gap-4 w-full max-w-xs"
                  style={{ animation: isVisible ? 'slideInRight 0.5s ease-out 0.3s both' : 'none' }}
                >
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {language === 'uk' ? 'План' : 'Blueprint'}
                  </span>
                  <div className="flex-1 h-0.5 bg-gradient-to-l from-gray-300 to-blue-400 dark:from-gray-600 dark:to-blue-500" />
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-800 dark:to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-drafting-compass text-lg text-blue-600 dark:text-blue-300" />
                  </div>
                </div>

                <div 
                  className="flex items-center gap-4 w-full max-w-xs"
                  style={{ animation: isVisible ? 'slideInLeft 0.5s ease-out 0.5s both' : 'none' }}
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-800 dark:to-green-900 rounded-xl flex items-center justify-center shadow-lg">
                    <i className="fas fa-cube text-lg text-green-600 dark:text-green-300" />
                  </div>
                  <div className="flex-1 h-0.5 bg-gradient-to-r from-gray-300 to-green-400 dark:from-gray-600 dark:to-green-500" />
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {language === 'uk' ? 'Реальність' : 'Reality'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 md:gap-6 px-2 sm:px-0">
            {services.map((service, index) => (
              <div
                key={service.id}
                className="relative"
                style={{ 
                  animation: isVisible ? `fadeInUp 0.5s ease-out ${index * 0.1}s both` : 'none'
                }}
                onMouseEnter={() => !isMobile && setHoveredCard(service.id)}
                onMouseLeave={() => !isMobile && setHoveredCard(null)}
              >
                {service.popular && (
                  <div 
                    className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20"
                    style={{ 
                      animation: isVisible ? `popIn 0.5s ease-out ${0.5 + index * 0.1}s both` : 'none'
                    }}
                  >
                    <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                      <i className="fas fa-star text-xs" />
                      {language === 'uk' ? 'ПОПУЛЯРНО' : 'POPULAR'}
                    </span>
                  </div>
                )}

                <div
                  className={`pricing-card relative h-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group ${
                    isMobile ? '' : 'hover:shadow-2xl'
                  }`}
                  style={{
                    clipPath: 'polygon(0px calc(100% - 8px), 4px calc(100% - 8px), 4px calc(100% - 4px), 8px calc(100% - 4px), 8px 100%, calc(100% - 8px) 100%, calc(100% - 8px) calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) calc(100% - 8px), 100% calc(100% - 8px), 100% 8px, calc(100% - 4px) 8px, calc(100% - 4px) 4px, calc(100% - 8px) 4px, calc(100% - 8px) 0px, 8px 0px, 8px 4px, 4px 4px, 4px 8px, 0px 8px)',
                  }}
                >
                  {/* Card Header with Example Images */}
                  <div 
                    className={`h-28 sm:h-32 bg-gradient-to-br ${service.color} relative overflow-hidden touch-none`}
                    onTouchStart={(e) => handleTouchStart(e, service.id)}
                    onTouchEnd={(e) => handleTouchEnd(e, service)}
                  >
                    {service.examples && service.examples.length > 0 && (
                      <div 
                        className="absolute inset-0 opacity-30 transition-opacity duration-500"
                      >
                        <img 
                          src={service.examples[currentExampleIndex[service.id] || 0]}
                          alt=""
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="relative z-10 h-full flex items-center justify-center">
                      <div className={hoveredCard === service.id || isMobile ? 'pricing-icon-animate' : ''}>
                        <i className={`${service.icon} text-3xl sm:text-4xl text-white drop-shadow-lg`} />
                      </div>
                    </div>
                    
                    {/* Example indicators */}
                    {service.examples && service.examples.length > 1 && (
                      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
                        {service.examples.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              idx === (currentExampleIndex[service.id] || 0)
                                ? 'bg-white scale-125'
                                : 'bg-white/50'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Touch hint for mobile */}
                    {isMobile && service.examples && service.examples.length > 1 && (
                      <div className="absolute top-2 right-2 text-white/70">
                        <i className="fas fa-hand-pointer text-xs" />
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-white">
                      {language === 'uk' ? service.title : service.titleEn}
                    </h3>
                    
                    <div className="mb-3 sm:mb-4">
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                        {language === 'uk' ? service.price : service.priceEn}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">
                      {language === 'uk' ? service.description : service.descriptionEn}
                    </p>

                    {/* Features List */}
                    <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6">
                      {(language === 'uk' ? service.features : service.featuresEn).slice(0, isMobile ? 3 : 4).map((feature, idx) => (
                        <li 
                          key={idx} 
                          className="flex items-start gap-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300"
                          style={{
                            animation: isVisible ? `fadeInUp 0.3s ease-out ${0.5 + index * 0.1 + idx * 0.05}s both` : 'none'
                          }}
                        >
                          <i className="fas fa-check text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-2">{feature}</span>
                        </li>
                      ))}
                      {(language === 'uk' ? service.features : service.featuresEn).length > (isMobile ? 3 : 4) && (
                        <li className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 italic pl-6">
                          +{(language === 'uk' ? service.features : service.featuresEn).length - (isMobile ? 3 : 4)} {language === 'uk' ? 'більше...' : 'more...'}
                        </li>
                      )}
                    </ul>

                    {/* CTA Button */}
                    <button
                      onClick={() => service.contactRequired ? handleContact() : setSelectedService(service.id)}
                      className={`w-full py-2.5 sm:py-3 px-4 bg-gradient-to-r ${service.color} text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base transform hover:scale-105 active:scale-95`}
                    >
                      {service.contactRequired 
                        ? (
                          <>
                            <i className="fas fa-comments mr-2" />
                            {language === 'uk' ? 'Зв\'язатися' : 'Contact Me'}
                          </>
                        )
                        : (
                          <>
                            <i className="fas fa-shopping-cart mr-2" />
                            {language === 'uk' ? 'Зв\'язатися' : 'Contact Me'}
                          </>
                        )
                      }
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div 
            className="mt-8 sm:mt-10 md:mt-12 p-4 sm:p-6 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg"
            style={{
              animation: isVisible ? 'fadeInUp 0.5s ease-out 0.8s both' : 'none'
            }}
          >
            <div className="text-center">
              <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white">
                {language === 'uk' ? 'Чому обирають мене' : 'Why Choose Me'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                {[
                  {
                    icon: 'fas fa-shield-alt',
                    title: language === 'uk' ? 'Гарантія якості' : 'Quality Guarantee',
                    description: language === 'uk' 
                      ? 'Всі роботи виконуються з увагою до деталей'
                      : 'All work is done with attention to detail'
                  },
                  {
                    icon: 'fas fa-clock',
                    title: language === 'uk' ? 'Вчасна доставка' : 'Timely Delivery',
                    description: language === 'uk' 
                      ? 'Дотримуюся узгоджених термінів'
                      : 'I stick to agreed deadlines'
                  },
                  {
                    icon: 'fas fa-comments',
                    title: language === 'uk' ? 'Підтримка' : 'Support',
                    description: language === 'uk' 
                      ? 'Допомога після завершення проєкту'
                      : 'Help after project completion'
                  }
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex flex-col items-center p-3 sm:p-4 rounded-xl bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm transform transition-transform duration-300 hover:scale-105"
                    style={{
                      animation: isVisible ? `fadeInUp 0.5s ease-out ${0.9 + index * 0.1}s both` : 'none'
                    }}
                  >
                    <i className={`${item.icon} text-xl sm:text-2xl text-primary-500 mb-2`} />
                    <span className="font-semibold mb-1">
                      {item.title}
                    </span>
                    <span className="text-center">
                      {item.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Order Modal */}
        {selectedService && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedService(null)}
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm pricing-modal-backdrop" />
            <div
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto pricing-modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 hover:scale-110"
              >
                <i className="fas fa-times text-gray-600 dark:text-gray-300" />
              </button>

              <div className="text-center mb-6">
                <div
                  className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ animation: 'popIn 0.5s ease-out' }}
                >
                  <i className="fas fa-envelope text-2xl text-white" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                  {language === 'uk' ? 'Оформити замовлення' : 'Place Order'}
                </h3>

                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
                  {language === 'uk' 
                    ? 'Для замовлення зв\'яжіться зі мною через Discord або інші соціальні мережі'
                    : 'To place an order, contact me via Discord or other social networks'}
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href="https://discord.gg/Y9yfRxjAHB"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  <i className="fab fa-discord text-lg" />
                  <span>Discord</span>
                </a>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  {language === 'uk' 
                    ? 'Відповідаю протягом 24 годин'
                    : 'I respond within 24 hours'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};