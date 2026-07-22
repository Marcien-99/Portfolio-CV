'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface ProjectGalleryProps {
  gallery: any[];
  lang: string;
}

export function ProjectGallery({ gallery, lang }: ProjectGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  if (!gallery || gallery.length === 0) return null;

  const currentImage = selectedImage !== null ? gallery[selectedImage] : null;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        {gallery.map((img: any, index: number) => {
          const caption = lang === 'en' && img.caption_en ? img.caption_en : img.caption_fr;
          return (
            <div key={index} className="space-y-3 group cursor-pointer" onClick={() => setSelectedImage(index)}>
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 group-hover:border-primary/50 transition-colors shadow-lg">
                <img 
                  src={img.url} 
                  alt={caption || `Image ${index + 1}`} 
                  className="absolute inset-0 w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" 
                />
              </div>
              {caption && (
                <p className="text-sm text-gray-400 text-center italic">
                  {caption}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && currentImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            className="absolute top-4 right-4 sm:top-8 sm:right-8 text-white/70 hover:text-white bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(null);
            }}
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking the image
          >
            <img 
              src={currentImage.url} 
              alt="Fullscreen view" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            {((lang === 'en' && currentImage.caption_en) || currentImage.caption_fr) && (
              <p className="mt-6 text-white/90 text-center text-lg max-w-3xl">
                {lang === 'en' && currentImage.caption_en ? currentImage.caption_en : currentImage.caption_fr}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
