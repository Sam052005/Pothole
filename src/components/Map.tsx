
import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Locate, MinusCircle, PlusCircle } from 'lucide-react';

interface MapProps {
  onLocationSelect?: (location: { lat: number; lng: number; address?: string }) => void;
  markers?: Array<{ lat: number; lng: number; id: string; title?: string }>;
  interactive?: boolean;
  selectedMarkerId?: string;
}

// Placeholder map implementation - in a real application, you would integrate
// with a mapping library like Mapbox, Google Maps, or Leaflet
const Map = ({ 
  onLocationSelect, 
  markers = [], 
  interactive = true,
  selectedMarkerId
}: MapProps) => {
  const [selectedLocation, setSelectedLocation] = useState<{ x: number; y: number } | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [startDragPos, setStartDragPos] = useState({ x: 0, y: 0 });
  
  const mapRef = useRef<HTMLDivElement>(null);

  const handleMapClick = (e: React.MouseEvent) => {
    if (!interactive || isDragging) return;
    
    const mapRect = mapRef.current?.getBoundingClientRect();
    if (!mapRect) return;
    
    // Calculate relative position within the map (0-1)
    const x = (e.clientX - mapRect.left) / mapRect.width;
    const y = (e.clientY - mapRect.top) / mapRect.height;
    
    setSelectedLocation({ x, y });
    
    // Convert to lat/lng (simplified for demo)
    // In a real app, this would use the mapping library's conversion
    const lat = 90 - y * 180;
    const lng = x * 360 - 180;
    
    if (onLocationSelect) {
      onLocationSelect({
        lat,
        lng,
        address: `Sample St, ${Math.floor(Math.random() * 100) + 1}, Cityville`
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setStartDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    const dx = (e.clientX - startDragPos.x) * 0.5;
    const dy = (e.clientY - startDragPos.y) * 0.5;
    setMapOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setStartDragPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mouseleave', handleMouseUp);
    
    return () => {
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Convert lat/lng to x,y (simplified for demo)
          const x = (lng + 180) / 360;
          const y = (90 - lat) / 180;
          
          setSelectedLocation({ x, y });
          
          if (onLocationSelect) {
            onLocationSelect({
              lat,
              lng,
              address: "Your Current Location"
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl border border-border">
      <motion.div
        ref={mapRef}
        className="absolute inset-0 bg-[#f8f9fa] dark:bg-[#1a1b1e] cursor-grab active:cursor-grabbing select-none"
        style={{
          backgroundImage: "url('/map-background.svg')",
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition: `${50 + mapOffset.x}% ${50 + mapOffset.y}%`,
        }}
        onClick={handleMapClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        animate={{ 
          backgroundSize: `${zoom * 100}%`,
          backgroundPosition: `${50 + mapOffset.x}% ${50 + mapOffset.y}%`
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDB2NDBIMHoiLz48cGF0aCBkPSJNMCAwaDJ2NDBoLTJ6TTIgMGgydjQwaC0yek00IDBoMnY0MEg0ek02IDBoMnY0MEg2ek04IDBoMnY0MEg4ek0xMCAwaDJ2NDBIMTB6TTEyIDBoMnY0MEgxMnpNMTQgMGgydjQwSDE0ek0xNiAwaDJ2NDBIMTZ6TTE4IDBoMnY0MEgxOHpNMjAgMGgydjQwSDIwek0yMiAwaDJ2NDBIMjJ6TTI0IDBoMnY0MEgyNHpNMjYgMGgydjQwSDI2ek0yOCAwaDJ2NDBIMjh6TTMwIDBoMnY0MEgzMHpNMzIgMGgydjQwSDMyeiBNMzQgMGgydjQwSDM0ek0zNiAwaDJ2NDBIMzZ6TTM4IDBoMnY0MEgzOHoiIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iLjAyIi8+PHBhdGggZD0iTTAgMHY0MGg0MFYwSDB6TTAgMGg0MHYySDB6TTAgMmg0MHYySDB6TTAgNGg0MHYySDB6TTAgNmg0MHYySDB6TTAgOGg0MHYySDB6TTAgMTBoNDB2Mkgwek0wIDEyaDQwdjJIMHpNMCAxNGg0MHYySDB6TTAgMTZoNDB2Mkgwek0wIDE4aDQwdjJIMHpNMCAyMGg0MHYySDB6TTAgMjJoNDB2Mkgwek0wIDI0aDQwdjJIMHpNMCAyNmg0MHYySDB6TTAgMjhoNDB2Mkgwek0wIDMwaDQwdjJIMHpNMCAzMmg0MHYySDB6TTAgMzRoNDB2Mkgwek0wIDM2aDQwdjJIMHpNMCAzOGg0MHYySDB6IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9Ii4wMiIvPjwvZz48L3N2Zz4=')] opacity-30" />
        
        {/* Map markers */}
        {markers.map((marker) => (
          <motion.div
            key={marker.id}
            className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-full ${
              marker.id === selectedMarkerId ? 'z-10' : 'z-5'
            }`}
            style={{
              left: `${((marker.lng + 180) / 360) * 100}%`,
              top: `${((90 - marker.lat) / 180) * 100}%`,
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            whileHover={{ scale: 1.2 }}
          >
            <div className="relative">
              <MapPin
                size={24}
                className={`${
                  marker.id === selectedMarkerId 
                    ? 'text-primary' 
                    : 'text-foreground/60'
                }`}
              />
              
              {marker.title && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-background/90 text-xs px-2 py-1 rounded shadow-sm backdrop-blur-sm border border-border">
                  {marker.title}
                </div>
              )}
              
              {marker.id === selectedMarkerId && (
                <motion.div
                  className="absolute -bottom-1 left-1/2 w-4 h-4 rounded-full bg-primary"
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>
          </motion.div>
        ))}

        {/* Selected location pin */}
        {selectedLocation && interactive && (
          <motion.div
            className="absolute w-8 h-8 transform -translate-x-1/2 -translate-y-full"
            style={{
              left: `${selectedLocation.x * 100}%`,
              top: `${selectedLocation.y * 100}%`,
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <MapPin size={32} className="text-primary" />
          </motion.div>
        )}

        {/* Map controls */}
        {interactive && (
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={zoomIn}
              className="bg-background/80 backdrop-blur-sm border border-border shadow-sm"
            >
              <PlusCircle size={18} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={zoomOut}
              className="bg-background/80 backdrop-blur-sm border border-border shadow-sm"
            >
              <MinusCircle size={18} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              onClick={getCurrentLocation}
              className="bg-background/80 backdrop-blur-sm border border-border shadow-sm"
            >
              <Locate size={18} />
            </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Map;
