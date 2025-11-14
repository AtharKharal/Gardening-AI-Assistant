
import React, { useState } from 'react';
import Header from './components/Header';
import PlantIdentifier from './components/PlantIdentifier';
import Chatbot from './components/Chatbot';

type View = 'plant' | 'chat';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('plant');

  return (
    <div className="min-h-screen bg-green-50 font-sans text-gray-800">
      <div className="container mx-auto p-4 max-w-4xl">
        <header className="text-center my-6">
          <h1 className="text-4xl md:text-5xl font-bold text-green-800">Gardening AI Assistant</h1>
          <p className="text-lg text-green-600 mt-2">Your personal guide to a greener thumb</p>
        </header>
        
        <main className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <Header activeView={activeView} setActiveView={setActiveView} />
          <div className="p-4 sm:p-6 md:p-8">
            {activeView === 'plant' ? <PlantIdentifier /> : <Chatbot />}
          </div>
        </main>

        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Powered by Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
