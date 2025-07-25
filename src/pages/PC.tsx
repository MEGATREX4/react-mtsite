import React from 'react';
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

  const Card = ({ item }: { item: { icon: string, label: string, value: string, color: string, textColor: string } }) => (
    <div className={`${item.color} ${item.textColor} w-36 h-36 rounded-2xl shadow-lg transform transition-transform duration-200 hover:-translate-y-1 flex flex-col items-center justify-center p-2 text-center`}>
      <i className={`${item.icon} text-3xl`}></i>
      <span className="text-sm font-bold mt-2">{item.label}</span>
      <p className="text-xs mt-1 opacity-90 leading-tight">{item.value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-primary-50/30 to-primary-100/50 dark:from-gray-900 dark:via-gray-800 dark:to-primary-900/20 relative overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-10 text-primary-600 dark:text-primary-400 text-center">
          {language === 'uk' ? 'Мій ПК та Обладнання' : 'My PC & Gear'}
        </h1>

        {/* Main Group */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-4 text-center">{language === 'uk' ? 'Основне' : 'Main'}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {mainComponents.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
        </div>

        {/* Peripherals Group */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">{language === 'uk' ? 'Периферія' : 'Peripherals'}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {peripheralDevices.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
        </div>

       {/* Storage Devices Group */}
       <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">{language === 'uk' ? 'Накопичувачі' : 'Storage'}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {storageDevices.map((item, i) => (
              <Card key={i} item={item} />
            ))}
          </div>
        </div>

        {/* Audio Devices & Camera Group */}
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">{language === 'uk' ? 'Аудіо та Камера' : 'Audio & Camera'}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {audioDevices.map((item, i) => (
              <Card key={i} item={item} />
            ))}
            <Card item={cameraDevice} />
          </div>
        </div>

        {/* Displays Section */}
       <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4 text-center">{language === 'uk' ? 'Дисплеї' : 'Displays'}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {pcSpecs.displays.map((display, index) => (
              <div key={index} className="bg-indigo-500 text-white w-48 h-32 rounded-2xl shadow-lg transform transition-transform duration-200 hover:-translate-y-1 flex flex-col items-center justify-center p-2 text-center">
                <i className="fas fa-tv text-3xl"></i>
                <span className="text-sm font-bold mt-2">{display.name}</span>
                <p className="text-xs mt-1 opacity-90 leading-tight">
                  {display.size}, {display.fps}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PC;