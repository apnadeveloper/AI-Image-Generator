import React, { useState, useRef } from 'react';
import { editImage } from '../services/geminiService';
import { ImageDisplay } from './ImageDisplay';
import { Button } from './Button';
import { Wand2, Upload, X, ImagePlus } from 'lucide-react';

export const ImageEditor: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<{ file: File, preview: string, base64Raw: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) {
        setError("File size too large. Please use an image under 4MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        // Extract raw base64 for API (remove data:image/xyz;base64, prefix)
        const base64Raw = result.split(',')[1];
        setSourceImage({ file, preview: result, base64Raw });
        setError(null);
        setResultUrl(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceImage || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setResultUrl(null);

    try {
      const result = await editImage(sourceImage.base64Raw, sourceImage.file.type, prompt);
      setResultUrl(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to edit image");
    } finally {
      setIsLoading(false);
    }
  };

  const clearSource = () => {
    setSourceImage(null);
    setResultUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
      {/* Input Panel */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-sm">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
            <ImagePlus className="w-5 h-5 mr-2 text-yellow-500" />
            Editor Settings
          </h2>
          
          <form onSubmit={handleEdit} className="flex flex-col gap-5">
            
            {/* File Upload Area */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Source Image
              </label>
              {!sourceImage ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-500 hover:bg-slate-700/30 transition-all group"
                >
                  <Upload className="w-8 h-8 mx-auto text-slate-400 group-hover:text-yellow-500 mb-2" />
                  <p className="text-sm text-slate-300 font-medium">Click to upload image</p>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG (Max 4MB)</p>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border border-slate-600 group">
                  <img src={sourceImage.preview} alt="Source" className="w-full h-48 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                  <button 
                    type="button"
                    onClick={clearSource}
                    className="absolute top-2 right-2 bg-black/50 hover:bg-red-500 text-white p-1.5 rounded-full transition-colors backdrop-blur-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-xs text-white truncate">
                    {sourceImage.file.name}
                  </div>
                </div>
              )}
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Edit Instructions
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g., "Add a retro filter", "Make the sky purple", "Add a cat in the corner"'
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:ring-2 focus:ring-yellow-500 focus:border-transparent min-h-[100px] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!sourceImage}
              />
            </div>

            <Button 
              type="submit" 
              isLoading={isLoading} 
              disabled={!sourceImage || !prompt.trim()}
              icon={<Wand2 className="w-4 h-4" />}
              className="w-full mt-2"
            >
              Apply Edits
            </Button>

            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>

         <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
           <h3 className="text-sm font-medium text-slate-400 mb-2">Powered by Nano Banana</h3>
           <p className="text-xs text-slate-500 leading-relaxed">
             Uses Gemini 2.5 Flash Image for high-speed, intelligent image manipulation. Simply describe the change you want to see!
           </p>
        </div>
      </div>

      {/* Result Panel */}
      <div className="lg:col-span-8">
        <ImageDisplay 
          imageUrl={resultUrl} 
          isLoading={isLoading} 
          title="Edited Result" 
          placeholderText={sourceImage ? "Describe your edit and click Apply" : "Upload an image to start editing"}
        />
      </div>
    </div>
  );
};