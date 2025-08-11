import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAppContext } from '../components/AppProvider';

// Початкові дані про ПК
const pcSpecs = {
  cpu: 'AMD Ryzen 5 4500',
  gpu: 'AMD Radeon RX 6600',
  ram: '32GB DDR4-3200',
  motherboard: 'PRIME B450-PLUS',
  os: 'Windows 11 Pro',
  os2: 'Fedora 36',
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

// Оновлена структура даних для історії апгрейдів з іконками компонентів
const upgradeHistory = [
    {
        year: '2019',
        icon: 'fas fa-rocket',
        title: { uk: 'Початок: Збірка на Xeon', en: 'The Beginning: The Xeon Build' },
        description: { 
            uk: 'Все почалося з бюджетної збірки на китайській платформі: материнська плата MACHINIST LGA 2011 v3, процесор Intel Xeon E5-2650 v3 та відеокарта RX580 4GB. Периферія була простою: миша Gemix W-110 та клавіатура Real-El 8700, яку згодом замінила перша механіка. Тоді ж з\'явився планшет Huion H420 та мікрофон BM800.',
            en: 'It all started with a budget build on a Chinese platform: a MACHINIST LGA 2011 v3 motherboard, an Intel Xeon E5-2650 v3 processor, and an RX580 4GB graphics card. Peripherals were simple: a Gemix W-110 mouse and a Real-El 8700 keyboard, which was later replaced by my first mechanical keyboard. A Huion H420 tablet and a BM800 microphone also appeared around that time.'
        },
        components: [
            { icon: 'fas fa-microchip', name: 'Xeon E5-2650 v3' },
            { icon: 'fas fa-cubes', name: 'RX580 4GB' },
            { icon: 'fas fa-keyboard', name: 'First Mechanical Keyboard' },
            { icon: 'fas fa-tablet-alt', name: 'Huion H420' },
        ]
    },
    {
        year: '2020',
        icon: 'fas fa-cogs',
        title: { uk: 'Подвійний апгрейд та стрімінг', en: 'Double Upgrade & Streaming' },
        description: { 
            uk: 'Процесор оновлено до Intel Xeon E5-2650 v4 (12 ядер/24 потоки) на платі MACHINIST X99. Для стрімів придбано LogiTech Streamer Cam та HyperX Squardcast. Всього через 3 місяці відбувся ключовий апгрейд: материнська плата Asus X99-A II та перехід на 32GB DDR4 3200MHz пам\'яті, яка служить досі.',
            en: 'The processor was upgraded to an Intel Xeon E5-2650 v4 (12 cores/24 threads) on a MACHINIST X99 board. A LogiTech Streamer Cam and HyperX Squardcast were acquired for streaming. Just 3 months later, a key upgrade took place: an Asus X99-A II motherboard and a switch to 32GB of DDR4 3200MHz RAM, which is still in use today.'
        },
        components: [
            { icon: 'fas fa-microchip', name: 'Xeon E5-2650 v4' },
            { icon: 'fas fa-memory', name: '32GB DDR4' },
            { icon: 'fas fa-video', name: 'LogiTech Streamer Cam' },
            { icon: 'fas fa-microphone', name: 'HyperX Squardcast' },
        ]
    },
    {
        year: '2021',
        icon: 'fas fa-gamepad',
        title: { uk: 'Ера ігрової периферії', en: 'The Gaming Peripherals Era' },
        description: { 
            uk: 'Повне оновлення ігрових девайсів для максимального комфорту. З\'явився основний монітор VG270 V 120Hz, легендарна миша Logitech G502 HERO та механічна клавіатура LogiTech PRO з перемикачами Blue.',
            en: 'A complete overhaul of gaming devices for maximum comfort. The main 120Hz VG270 V monitor arrived, along with the legendary Logitech G502 HERO mouse and a LogiTech PRO mechanical keyboard with Blue switches.'
        },
        components: [
            { icon: 'fas fa-tv', name: 'VG270 V 120Hz' },
            { icon: 'fas fa-mouse', name: 'Logitech G502' },
            { icon: 'fas fa-keyboard', name: 'LogiTech PRO' },
        ]
    },
    {
        year: '2022',
        icon: 'fas fa-microchip',
        title: { uk: 'Перехід на платформу AMD', en: 'The Switch to AMD' },
        description: { 
            uk: 'Кардинальна зміна платформи з Intel Xeon на більш сучасну та енергоефективну від AMD. Було встановлено процесор Ryzen 5 4500 та материнську плату Asus Prime B450-PLUS, які є основою ПК і сьогодні.',
            en: 'A radical platform change from Intel Xeon to a more modern and energy-efficient one from AMD. A Ryzen 5 4500 processor and an Asus Prime B450-PLUS motherboard were installed, which form the core of the PC today.'
        },
        components: [
            { icon: 'fas fa-microchip', name: 'Ryzen 5 4500' },
            { icon: 'fas fa-cog', name: 'Asus Prime B450' },
        ]
    },
    {
        year: '2023',
        icon: 'fas fa-video',
        title: { uk: 'Професійний контент', en: 'Professional Content' },
        description: { 
            uk: 'Апгрейд обладнання для створення якісного контенту. Для відео було придбано бездзеркальну камеру Sony a5000, а для звуку — студійний конденсаторний мікрофон SAMSON C01UPRO.',
            en: 'An equipment upgrade for creating high-quality content. A Sony a5000 mirrorless camera was purchased for video, and a SAMSON C01UPRO studio condenser microphone for audio.'
        },
        components: [
            { icon: 'fas fa-camera', name: 'Sony a5000' },
            { icon: 'fas fa-microphone', name: 'SAMSON C01UPRO' },
        ]
    },
    {
        year: '2025',
        icon: 'fas fa-cubes',
        title: { uk: 'Графічна потужність', en: 'Graphics Power' },
        description: { 
            uk: 'Фінальний штрих поточної збірки — заміна ветерана RX580 4GB на значно продуктивнішу відеокарту RX 6600 8GB, що дозволило комфортно грати у всі сучасні ігри.',
            en: 'The final touch on the current build was replacing the veteran RX580 4GB with the much more powerful RX 6600 8GB graphics card, allowing for comfortable gameplay in all modern titles.'
        },
        components: [
            { icon: 'fas fa-cubes', name: 'Radeon RX 6600' },
        ]
    }
];


const PCComponent: React.FC = () => {
  const { language } = useAppContext();

  const backgroundParticles = useMemo(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: `bg-particle-${i}`,
      width: Math.random() * 60 + 20,
      height: Math.random() * 60 + 20,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 8 + 6,
    })),
    []
  );

  const backgroundAnimation = useMemo(() => (
    <div className="absolute inset-0 opacity-20 dark:opacity-30 overflow-hidden">
      {backgroundParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-primary-400/40 dark:bg-primary-500/50 rounded-full"
          style={{
            width: particle.width,
            height: particle.height,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{ y: [-10, 10, -10], x: [-8, 8, -8], scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  ), [backgroundParticles]);

  const mainComponents = [
    { icon: 'fas fa-microchip', label: language === 'uk' ? 'ЦПУ' : 'CPU', value: pcSpecs.cpu, color: 'bg-blue-500' },
    { icon: 'fas fa-cubes', label: 'GPU', value: pcSpecs.gpu, color: 'bg-green-500' },
    { icon: 'fas fa-memory', label: 'RAM', value: pcSpecs.ram, color: 'bg-purple-500' },
    { icon: 'fab fa-windows', label: language === 'uk' ? 'ОС' : 'OS', value: pcSpecs.os, color: 'bg-blue-400' },
    { icon: 'fab fa-fedora', label: language === 'uk' ? 'ОС 2' : 'OS 2', value: pcSpecs.os2, color: 'bg-blue-400' },
    { icon: 'fas fa-cog', label: language === 'uk' ? 'Плата' : 'Board', value: pcSpecs.motherboard, color: 'bg-red-400' }
  ];

  const peripheralDevices = [
    { icon: 'fas fa-mouse', label: language === 'uk' ? 'Миша' : 'Mouse', value: pcSpecs.mouse, color: 'bg-teal-500' },
    { icon: 'fas fa-keyboard', label: language === 'uk' ? 'Клавіатура' : 'Keyboard', value: pcSpecs.keyboard, color: 'bg-teal-500' },
    { icon: 'fas fa-tablet-alt', label: language === 'uk' ? 'Графічний Планшет' : 'Graphics Tablet', value: pcSpecs.tablet, color: 'bg-teal-500' }
  ];

  const audioDevices = [
    { icon: 'fas fa-headphones', label: language === 'uk' ? 'Навушники' : 'Headphones', value: pcSpecs.headphones, color: 'bg-pink-500' },
    { icon: 'fas fa-microphone', label: language === 'uk' ? 'Мікрофон' : 'Mic', value: pcSpecs.microphone, color: 'bg-gray-500' }
  ];

  const cameraDevice = {
    icon: 'fas fa-camera', label: language === 'uk' ? 'Камера' : 'Camera', value: pcSpecs.camera, color: 'bg-orange-500'
  };

  const storageDevices = [
    { icon: 'fas fa-hdd', label: 'SSD', value: pcSpecs.storage.ssd, color: 'bg-yellow-500' },
    { icon: 'fas fa-hdd', label: 'HDD', value: pcSpecs.storage.hdd, color: 'bg-yellow-500' }
  ];

  const Card = ({ item, index }: { item: { icon: string, label: string, value: string, color: string }, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={`${item.color} text-white group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl border border-white/20 transition-all duration-300 hover:-translate-y-2 w-40 h-40 flex flex-col items-center justify-center p-4 text-center backdrop-blur-md`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="relative z-10">
        <i className={`${item.icon} text-3xl mb-3`}></i>
        <span className="text-sm font-bold mb-2 block">{item.label}</span>
        <p className="text-xs opacity-90 leading-tight">{item.value}</p>
      </div>
    </motion.div>
  );

  const createSection = (titleKey: { uk: string, en: string }, items: any[], startIndex = 0) => (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">
        {language === 'uk' ? titleKey.uk : titleKey.en}
      </h2>
      <div className="flex flex-wrap justify-center gap-6">
        {items.map((item, i) => (
          <Card key={i} item={item} index={startIndex + i} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 relative overflow-hidden">
      {backgroundAnimation}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-7xl mx-auto">
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
              {language === 'uk' ? 'Детальний огляд мого робочого обладнання та технічних характеристик.' : 'A detailed overview of my work equipment and technical specifications.'}
            </p>
          </div>

          {createSection({ uk: 'Основне', en: 'Main' }, mainComponents, 0)}
          {createSection({ uk: 'Периферія', en: 'Peripherals' }, peripheralDevices, mainComponents.length)}
          {createSection({ uk: 'Накопичувачі', en: 'Storage' }, storageDevices, mainComponents.length + peripheralDevices.length)}
          
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

          {/* Секція Історії Апгрейдів з іконками компонентів */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-12 text-center text-gray-900 dark:text-white">
                {language === 'uk' ? 'Історія Апгрейдів' : 'Upgrade History'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upgradeHistory.map((item, index) => (
                    <div key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-full">
                        <div className="flex items-center mb-4">
                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-primary-500 text-white mr-4">
                                <i className={`${item.icon} text-xl`}></i>
                            </div>
                            <div>
                                <h3 className="font-bold text-xl text-primary-600 dark:text-primary-400">{item.year}</h3>
                                <p className="font-semibold text-gray-700 dark:text-gray-200">{language === 'uk' ? item.title.uk : item.title.en}</p>
                            </div>
                        </div>
                        <p className="text-base text-gray-600 dark:text-gray-300 flex-grow">
                            {language === 'uk' ? item.description.uk : item.description.en}
                        </p>
                        {/* Новий блок для іконок компонентів */}
                        {item.components && item.components.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">{language === 'uk' ? 'Ключові компоненти:' : 'Key Components:'}</h4>
                                <div className="flex flex-wrap gap-4">
                                    {item.components.map((comp, compIndex) => (
                                        <div key={compIndex} className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full px-3 py-1">
                                            <i className={`${comp.icon} text-primary-500 dark:text-primary-400 mr-2`}></i>
                                            <span className="text-xs font-medium text-gray-700 dark:text-gray-200">{comp.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PC = React.memo(PCComponent);
export default PC;
