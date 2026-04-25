import React, { useState, useEffect, useCallback } from 'react';
import { SectionImage } from '@/services/imageApi';

interface AutoImageSliderProps {
  images: SectionImage[];
  autoplayDelay?: number;
  showDots?: boolean;
  showArrows?: boolean;
  className?: string;
}

const AutoImageSlider: React.FC<AutoImageSliderProps> = ({
  images,
  autoplayDelay = 4000,
  showDots = true,
  showArrows = true,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(goToNext, autoplayDelay);
    return () => clearInterval(timer);
  }, [images.length, autoplayDelay, goToNext]);

  if (images.length === 0) return null;

  const currentImage = images[currentIndex];

  if (images.length === 1) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${currentImage.imageUrl}`}
          alt={currentImage.title || 'Banner'}
          className="w-full h-auto object-cover"
        />
        {(currentImage.title || currentImage.subtitle || currentImage.btnText) && (
          <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center p-4">
            {currentImage.title && <h2 className="text-2xl md:text-4xl font-bold mb-2">{currentImage.title}</h2>}
            {currentImage.subtitle && <p className="text-sm md:text-lg mb-4">{currentImage.subtitle}</p>}
            {currentImage.btnText && (
              <a href={currentImage.btnLink || '#'} className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition">
                {currentImage.btnText}
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((img, idx) => (
          <div key={idx} className="relative flex-shrink-0 w-full">
            <img
              src={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${img.imageUrl}`}
              alt={img.title || `Slide ${idx + 1}`}
              className="w-full h-auto object-cover"
            />
            {(img.title || img.subtitle || img.btnText) && (
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-white text-center p-4">
                {img.title && <h2 className="text-2xl md:text-4xl font-bold mb-2">{img.title}</h2>}
                {img.subtitle && <p className="text-sm md:text-lg mb-4">{img.subtitle}</p>}
                {img.btnText && (
                  <a href={img.btnLink || '#'} className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition">
                    {img.btnText}
                  </a>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {showArrows && images.length > 1 && (
        <>
          <button onClick={goToPrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 z-10">◀</button>
          <button onClick={goToNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 z-10">▶</button>
        </>
      )}

      {showDots && images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-4' : 'bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AutoImageSlider;