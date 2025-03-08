
import React, { useState, useRef } from 'react';
import { Camera, X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload = ({ onImagesChange, maxImages = 3 }: ImageUploadProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    handleFiles(files);
  };

  const handleFiles = (files: FileList) => {
    const newImages: string[] = [];
    
    Array.from(files).forEach((file) => {
      if (images.length + newImages.length >= maxImages) return;
      if (!file.type.startsWith('image/')) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const result = e.target.result as string;
          newImages.push(result);
          
          if (newImages.length === files.length || 
              images.length + newImages.length >= maxImages) {
            const updatedImages = [...images, ...newImages];
            setImages(updatedImages);
            onImagesChange(updatedImages);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages);
  };

  const handleCaptureClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div 
        className={`border-2 border-dashed rounded-xl p-6 transition-all ${
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input 
          type="file" 
          accept="image/*" 
          multiple 
          className="hidden" 
          onChange={handleFileChange} 
          ref={fileInputRef}
          capture="environment"
        />
        
        {images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Upload size={24} />
            </div>
            <h3 className="text-lg font-medium mb-2">Upload Images</h3>
            <p className="text-sm text-foreground/70 text-center mb-4">
              Drag and drop images here, or click to select files
            </p>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleCaptureClick}
                className="flex items-center"
              >
                <Camera size={16} className="mr-2" />
                Take Photo
              </Button>
              <Button 
                type="button" 
                onClick={() => fileInputRef.current?.click()}
              >
                Select Files
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <AnimatePresence>
                {images.map((src, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative aspect-square rounded-lg overflow-hidden border border-border"
                  >
                    <img 
                      src={src} 
                      alt={`Uploaded ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-2 right-2 bg-background/80 rounded-full p-1 backdrop-blur-sm text-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            
            {images.length < maxImages && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
              >
                <Upload size={16} className="mr-2" />
                Add More Photos ({images.length}/{maxImages})
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
