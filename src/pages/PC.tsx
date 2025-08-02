import React from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../components/AppProvider';

const pcSpecs = {
  cpu: 'AMD Ryzen 5 4500',
  gpu: 'AMD Radeon RX 6600',
  ram: '32GB DDR4-3200',
  motherboard: 'PRIME B450-PLUS',
  os: 'Windows 11 Pro',
  storage: {
    ssd: 'LS 256GB N600',
    hdd: 'TOSHIBA HDWD110 1TB',
  },
  mouse: 'G502 HERO',
  keyboard: 'PRO Gaming Keyboard',
  tablet: 'Huion H420X',
  camera: 'Sony a5000',
  headphones: 'OneOdio Monitor 60',
  microphone: 'Samson c01UPRO',
  displays: [
    {
      name: 'VG270 V',
      size: '27"',
      fps: '120Hz',
    },
    {
        name: 'BenQ GW2280',
        size: '22"',
        fps: '60Hz',
    }
  ]
};

export const PC: React.FC = () => {
  const { language } = useAppContext();

  const mainComponents = [
    { icon: 'fas fa-microchip', label: language === 'uk' ? 'ЦПУ' : 'CPU', value: pcSpecs.cpu, color: 'bg-blue-500 hover:bg-blue-600', textColor: 'text-white' },
    { icon: 'fas fa-cubes', label: 'GPU', value: pcSpecs.gpu, color: 'bg-green-500 hover:bg-green-600', textColor: 'text-white' },
    { icon: 'fas fa-memory', label: 'RAM', value: pcSpecs.ram, color: 'bg-purple-500 hover:bg-purple-600', textColor: 'text-white' },
    { icon: 'fab fa-windows', label: language === 'uk' ? 'ОС' : 'OS', value: pcSpecs.os, color: 'bg-blue-400 hover:bg-blue-500', textColor: 'text-white' },
    { icon: 'fas fa-cog', label: language === 'uk' ? 'Плата' : 'Board', value: pcSpecs.motherboard, color: 'bg-red-400 hover:bg-red-500', textColor: 'text-white' }
  ];

  const peripheralDevices = [
    { icon: 'fas fa-mouse', label: language === 'uk' ? 'Миша' : 'Mouse', value: pcSpecs.mouse, color: 'bg-teal-500 hover:bg-teal-600', textColor: 'text-white' },
    { icon: 'fas fa-keyboard', label: language === 'uk' ? 'Клавіатура' : 'Keyboard', value: pcSpecs.keyboard, color: 'bg-teal-500 hover:bg-teal-600', textColor: 'text-white' },
    { icon: 'fas fa-tablet-alt', label: language === 'uk' ? 'Графічний Планшет' : 'Graphics Tablet', value: pcSpecs.tablet, color: 'bg-teal-500 hover:bg-teal-600', textColor: 'text-white' }
  ];

  const audioDevices = [
    { icon: 'fas fa-headphones', label: language === 'uk' ? 'Навушники' : 'Headphones', value: pcSpecs.headphones, color: 'bg-pink-500 hover:bg-pink-600', textColor: 'text-white' },
    { icon: 'fas fa-microphone', label: language === 'uk' ? 'Мікрофон' : 'Mic', value: pcSpecs.microphone, color: 'bg-gray-500 hover:bg-gray-600', textColor: 'text-white' }
  ];

  const cameraDevice = {
    icon: 'fas fa-camera', label: language === 'uk' ? 'Камера' : 'Camera', value: pcSpecs.camera, color: 'bg-orange-500 hover:bg-orange-600', textColor: 'text-white'
  };

  const storageDevices = [
    { icon: 'fas fa-hdd', label: 'SSD', value: pcSpecs.storage.ssd, color: 'bg-yellow-500 hover:bg-yellow-600', textColor: 'text-white' },
    { icon: 'fas fa-hdd', label: 'HDD', value: pcSpecs.storage.hdd, color: 'bg-yellow-500 hover:bg-yellow-600', textColor: 'text-white' }
  ];

  const Card = ({ item, index }: { item: { icon: string, label: string, value: string, color: string, textColor: string }, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`${item.color} ${item.textColor} group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2 w-40 h-40 flex flex-col items-center justify-center p-4 text-center backdrop-blur-md`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <i className={`${item.icon} text-3xl mb-3`}></i>
        <span className="text-sm font-bold mb-2 block">{item.label}</span>
        <p className="text-xs opacity-90 leading-tight">{item.value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 relative overflow-hidden">
      {/* Enhanced Background Animation */}
      <div className="absolute inset-0 opacity-20 dark:opacity-30">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-primary-400/40 dark:bg-primary-500/50 rounded-full"
            style={{
              width: Math.random() * 60 + 20,
              height: Math.random() * 60 + 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              x: [-8, 8, -8],
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: Math.random() * 8 + 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="mb-6 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-xl opacity-40 dark:opacity-60 scale-110 w-20 h-20 mx-auto"></div>
              <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full mx-auto shadow-2xl border-4 border-white dark:border-gray-700 relative z-10 flex items-center justify-center">
                <i className="fas fa-desktop text-2xl text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-primary-500 to-primary-400 bg-clip-text text-transparent">
              {language === 'uk' ? 'Мій ПК та Обладнання' : 'My PC & Gear'}
            </h1>
            
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto mb-8">
              {language === 'uk' 
                ? 'Детальний огляд мого робочого обладнання та технічних характеристик.' 
                : 'A detailed overview of my work equipment and technical specifications.'}
            </p>
          </div>

        {/* Main Group */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
            {language === 'uk' ? 'Основне' : 'Main'}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {mainComponents.map((item, i) => (
              <Card key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* Peripherals Group */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
            {language === 'uk' ? 'Периферія' : 'Peripherals'}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {peripheralDevices.map((item, i) => (
              <Card key={i} item={item} index={i + mainComponents.length} />
            ))}
          </div>
        </div>

       {/* Storage Devices Group */}
       <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
            {language === 'uk' ? 'Накопичувачі' : 'Storage'}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {storageDevices.map((item, i) => (
              <Card key={i} item={item} index={i + mainComponents.length + peripheralDevices.length} />
            ))}
          </div>
        </div>

        {/* Audio Devices & Camera Group */}
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
            {language === 'uk' ? 'Аудіо та Камера' : 'Audio & Camera'}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {audioDevices.map((item, i) => (
              <Card key={i} item={item} index={i + mainComponents.length + peripheralDevices.length + storageDevices.length} />
            ))}
            <Card item={cameraDevice} index={mainComponents.length + peripheralDevices.length + storageDevices.length + audioDevices.length} />
          </div>
        </div>

        {/* Displays Section */}
       <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
            {language === 'uk' ? 'Дисплеї' : 'Displays'}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {pcSpecs.displays.map((display, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: (index + mainComponents.length + peripheralDevices.length + storageDevices.length + audioDevices.length + 1) * 0.1 }}
                className="bg-indigo-500 text-white group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2 w-48 h-40 flex flex-col items-center justify-center p-4 text-center backdrop-blur-md"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10">
                  <i className="fas fa-tv text-3xl mb-3"></i>
                  <span className="text-sm font-bold mb-2 block">{display.name}</span>
                  <p className="text-xs opacity-90 leading-tight">
                    {display.size}, {display.fps}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        </div>
      </div>
    </div>
  );
};

export default PC;