import React, { useState, useCallback, useRef, useEffect } from 'react';
import { X, Upload, Camera, RefreshCw, Check, Move, ZoomIn, RotateCw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  metal: string;
}

interface JewelryTryOnProps {
  product: Product;
  onClose: () => void;
}

export const JewelryTryOn: React.FC<JewelryTryOnProps> = ({ product, onClose }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [jewelryPosition, setJewelryPosition] = useState({ x: 0, y: 0 });
  const [jewelrySize, setJewelrySize] = useState(100);
  const [isDragging, setIsDragging] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Category-based default positions
  const getDefaultPosition = useCallback(() => {
    switch (product.category) {
      case 'necklace':
        return { x: 50, y: 30 }; // Neck area
      case 'earrings':
        return { x: 50, y: 25 }; // Ear area
      case 'ring':
        return { x: 50, y: 60 }; // Finger area
      case 'bracelet':
        return { x: 50, y: 55 }; // Wrist area
      default:
        return { x: 50, y: 40 };
    }
  }, [product.category]);

  // Set default position when product changes
  useEffect(() => {
    setJewelryPosition(getDefaultPosition());
  }, [product, getDefaultPosition]);

  // Handle image upload
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUserImage(reader.result as string);
      setShowInstructions(false);
      
      // Reset position to default for new image
      setJewelryPosition(getDefaultPosition());
      setJewelrySize(100);
    };
    reader.readAsDataURL(file);
  }, [getDefaultPosition]);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current || !userImage) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = userImage;
    
    img.onload = () => {
      // Set canvas size to match container
      const container = containerRef.current;
      if (!container) return;

      const maxWidth = container.clientWidth;
      const maxHeight = 500;
      
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = (maxWidth / width) * height;
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = (maxHeight / height) * width;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      // Draw user image
      ctx.drawImage(img, 0, 0, width, height);

      // Draw jewelry overlay
      const jewelryImg = new Image();
      jewelryImg.src = product.images[0];
      jewelryImg.crossOrigin = "anonymous";
      
      jewelryImg.onload = () => {
        // Calculate jewelry size based on category
        let jewelryWidth = (width * jewelrySize) / 100;
        let jewelryHeight = (jewelryImg.height / jewelryImg.width) * jewelryWidth;

        // Calculate position
        const x = (jewelryPosition.x / 100) * width - jewelryWidth / 2;
        const y = (jewelryPosition.y / 100) * height - jewelryHeight / 2;

        // Draw jewelry with transparency
        ctx.save();
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetY = 2;
        ctx.drawImage(jewelryImg, x, y, jewelryWidth, jewelryHeight);
        ctx.restore();

        // Add a subtle glow for gold/diamond
        if (product.metal === 'gold' || product.metal === 'diamond') {
          ctx.save();
          ctx.shadowColor = product.metal === 'gold' ? '#FFD700' : '#FFF';
          ctx.shadowBlur = 15;
          ctx.drawImage(jewelryImg, x, y, jewelryWidth, jewelryHeight);
          ctx.restore();
        }
      };
    };
  }, [userImage, jewelryPosition, jewelrySize, product]);

  // Handle drag start
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!userImage) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [userImage]);

  // Handle drag move
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !userImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    const deltaX = (e.clientX - dragStartRef.current.x) / rect.width * 100;
    const deltaY = (e.clientY - dragStartRef.current.y) / rect.height * 100;

    setJewelryPosition(prev => ({
      x: Math.min(100, Math.max(0, prev.x + deltaX)),
      y: Math.min(100, Math.max(0, prev.y + deltaY))
    }));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  }, [isDragging, userImage]);

  // Handle drag end
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Handle size change
  const handleSizeChange = useCallback((delta: number) => {
    setJewelrySize(prev => Math.min(200, Math.max(50, prev + delta)));
  }, []);

  // Handle reset
  const handleReset = useCallback(() => {
    setJewelryPosition(getDefaultPosition());
    setJewelrySize(100);
  }, [getDefaultPosition]);

  // Take screenshot
  const handleScreenshot = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `${product.name}-tryon.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [product.name]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Camera className="w-6 h-6 text-white" />
            <h2 className="text-xl font-semibold text-white">
              Virtual Try-On: {product.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Side - Product Info */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-48 object-contain rounded-lg"
                />
                <div className="mt-4">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    ₹{product.price.toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                      {product.metal}
                    </span>
                    <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                      {product.category}
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {showInstructions && !userImage && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📸 How to try on:</h4>
                  <ul className="text-sm text-blue-700 space-y-2">
                    <li>1. Upload a clear photo of yourself</li>
                    <li>2. Face forward, good lighting</li>
                    <li>3. Shoulders visible for necklaces</li>
                    <li>4. Hands visible for rings/bracelets</li>
                  </ul>
                </div>
              )}

              {/* Upload Section */}
              {!userImage ? (
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="user-image-upload"
                    capture="user" // Opens front camera on mobile
                  />
                  <label
                    htmlFor="user-image-upload"
                    className="cursor-pointer block"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2 font-medium">
                      Upload your photo
                    </p>
                    <p className="text-sm text-gray-400">
                      Click to browse or take a photo
                    </p>
                  </label>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Adjust Jewelry:</h4>
                    <button
                      onClick={handleReset}
                      className="text-sm text-purple-600 hover:text-purple-700"
                    >
                      Reset Position
                    </button>
                  </div>
                  
                  {/* Controls */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-gray-600 block mb-1">
                        Size: {jewelrySize}%
                      </label>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSizeChange(-5)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <ZoomIn className="w-4 h-4 rotate-180" />
                        </button>
                        <input
                          type="range"
                          min="50"
                          max="200"
                          value={jewelrySize}
                          onChange={(e) => setJewelrySize(Number(e.target.value))}
                          className="flex-1"
                        />
                        <button
                          onClick={() => handleSizeChange(5)}
                          className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 flex items-center">
                      <Move className="w-3 h-3 mr-1" />
                      Drag on image to move jewelry
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <button
                      onClick={handleScreenshot}
                      className="flex-1 bg-purple-600 text-white py-2 rounded-lg text-sm hover:bg-purple-700"
                    >
                      Save Photo
                    </button>
                    <button
                      onClick={() => setUserImage(null)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
                    >
                      New Photo
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Try-On Area */}
            <div className="lg:col-span-2">
              <div
                ref={containerRef}
                className="relative bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center min-h-[500px]"
              >
                {userImage ? (
                  <div
                    className="relative"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  >
                    <canvas
                      ref={canvasRef}
                      className={`max-w-full max-h-[500px] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    />
                    
                    {/* Drag indicator */}
                    {isDragging && (
                      <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
                        Adjusting position...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-white p-8">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">Upload your photo to see how this jewelry looks on you</p>
                    <p className="text-sm opacity-50">You can adjust position and size after upload</p>
                  </div>
                )}
              </div>

              {/* Preview thumbnails for different angles */}
              {userImage && product.images.length > 1 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Try different angles:</p>
                  <div className="flex space-x-2">
                    {product.images.slice(0, 3).map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          // Swap the main jewelry image
                          const newImages = [...product.images];
                          const temp = newImages[0];
                          newImages[0] = img;
                          newImages[idx] = temp;
                          // Force re-render
                          setJewelrySize(prev => prev + 0.1);
                        }}
                        className="w-16 h-16 border-2 rounded-lg overflow-hidden hover:border-purple-500"
                      >
                        <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};