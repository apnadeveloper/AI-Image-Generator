import React, { useState } from 'react';
import { ImageGenerator } from './components/ImageGenerator';
import { ImageEditor } from './components/ImageEditor';
import { Palette, Image as ImageIcon, Zap } from 'lucide-react';

type Tab = 'generate' | 'edit';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('generate');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-yellow-500/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20">
                <Zap className="w-5 h-5 text-white fill-current" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white tracking-tight">Nano Banana Studio</h1>
                <p className="text-xs text-slate-400">Powered by Google Gemini</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 bg-slate-800/50 p-1 rounded-lg border border-slate-700/50">
              <button
                onClick={() => setActiveTab('generate')}
                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'generate'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Generate
              </button>
              <button
                onClick={() => setActiveTab('edit')}
                className={`flex items-center px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'edit'
                    ? 'bg-slate-700 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Palette className="w-4 h-4 mr-2" />
                Edit
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'generate' ? (
            <div className="space-y-2">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white">Text to Image</h2>
                <p className="text-slate-400 mt-1">Create stunning visuals from text prompts using Imagen 3.</p>
              </div>
              <ImageGenerator />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-white">AI Image Editor</h2>
                <p className="text-slate-400 mt-1">Transform existing images using natural language commands with Gemini Flash Image.</p>
              </div>
              <ImageEditor />
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
       <footer className="border-t border-slate-800 mt-12 py-8 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Nano Banana Studio. Built with Gemini 2.5 Flash Image & Imagen 3.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;