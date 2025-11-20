import React from 'react';
import { Download, Maximize2 } from 'lucide-react';
import { Button } from './Button';

interface ImageDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
  placeholderText?: string;
  title: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, isLoading, placeholderText = "Result will appear here", title }) => {
  const handleDownload = () => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `nano-banana-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden flex flex-col h-full min-h-[400px]">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
        <h3 className="font-semibold text-slate-200">{title}</h3>
        {imageUrl && (
          <Button variant="outline" onClick={handleDownload} className="text-xs py-1 px-3 h-8">
             <Download className="w-3 h-3 mr-1" /> Download
          </Button>
        )}
      </div>
      
      <div className="flex-1 flex items-center justify-center bg-slate-900/50 relative p-4">
        {isLoading ? (
          <div className="text-center p-8">
            <div className="w-16 h-16 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 animate-pulse">Creating magic...</p>
          </div>
        ) : imageUrl ? (
          <div className="relative group w-full h-full flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt="Generated content" 
              className="max-w-full max-h-[600px] rounded-lg shadow-2xl object-contain"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg pointer-events-none" />
          </div>
        ) : (
          <div className="text-center text-slate-500 p-8 border-2 border-dashed border-slate-700 rounded-xl">
            <Maximize2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>{placeholderText}</p>
          </div>
        )}
      </div>
    </div>
  );
};