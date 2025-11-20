import React, { useState } from 'react';
import { generateImage } from '../services/geminiService';
import { ImageDisplay } from './ImageDisplay';
import { Button } from './Button';
import { Sparkles, Image as ImageIcon } from 'lucide-react';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const result = await generateImage(prompt, aspectRatio);
      setImageUrl(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Input Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2 text-yellow-500" />
            Generation Settings
          </h2>
          
          <form onSubmit={handleGenerate} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Describe your image
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A futuristic city with flying cars, neon lights, cinematic lighting, 8k resolution..."
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-h-[120px] resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Aspect Ratio
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['1:1', '16:9', '3:4', '4:3', '9:16'].map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all ${
                      aspectRatio === ratio
                        ? 'bg-yellow-500 text-slate-900 shadow-lg shadow-yellow-500/20'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            <Button 
              type="submit" 
              isLoading={isLoading} 
              icon={<Sparkles className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Generate Image
            </Button>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>
        
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
           <h3 className="text-sm font-medium text-slate-400 mb-2">Tips for better prompts:</h3>
           <ul className="text-xs text-slate-500 space-y-1 list-disc pl-4">
             <li>Be specific about lighting (e.g., "sunset", "studio lighting").</li>
             <li>Mention art styles (e.g., "oil painting", "cyberpunk").</li>
             <li>Use descriptive adjectives for texture and mood.</li>
           </ul>
        </div>
      </div>

      {/* Result Panel */}
      <div className="lg:col-span-8">
        <ImageDisplay 
          imageUrl={imageUrl} 
          isLoading={isLoading} 
          title="Generated Result" 
          placeholderText="Enter a prompt and click Generate to see the magic of Imagen 3"
        />
      </div>
    </div>
  );
};