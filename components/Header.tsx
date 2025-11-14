
import React from 'react';
import { PlantIcon } from './icons/PlantIcon';
import { ChatIcon } from './icons/ChatIcon';

interface HeaderProps {
  activeView: 'plant' | 'chat';
  setActiveView: (view: 'plant' | 'chat') => void;
}

const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const getButtonClasses = (view: 'plant' | 'chat') => {
    const baseClasses = "flex-1 flex items-center justify-center gap-2 p-4 text-sm font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500";
    if (activeView === view) {
      return `${baseClasses} bg-green-600 text-white`;
    }
    return `${baseClasses} bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700`;
  };

  return (
    <nav className="flex bg-gray-100 border-b-4 border-green-200">
      <button onClick={() => setActiveView('plant')} className={getButtonClasses('plant')}>
        <PlantIcon className="w-5 h-5" />
        <span>Plant Identifier</span>
      </button>
      <button onClick={() => setActiveView('chat')} className={getButtonClasses('chat')}>
        <ChatIcon className="w-5 h-5" />
        <span>Gardening Chat</span>
      </button>
    </nav>
  );
};

export default Header;
