import React, { useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface ImageEditorProps {
  image: HTMLImageElement | null;
  onCrop: (dimensions: CropDimensions) => void;
  onResize: (dimensions: ResizeDimensions) => void;
}

export interface CropDimensions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResizeDimensions {
  width: number;
  height: number;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({ image, onCrop, onResize }) => {
  const [cropDimensions, setCropDimensions] = React.useState<CropDimensions>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });

  const [resizeDimensions, setResizeDimensions] = React.useState<ResizeDimensions>({
    width: 0,
    height: 0
  });

  useEffect(() => {
    if (image) {
      setCropDimensions({
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
      });
      setResizeDimensions({
        width: image.width,
        height: image.height
      });
    }
  }, [image]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Crop</h3>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={cropDimensions.x}
              onChange={(e) => setCropDimensions(prev => ({ ...prev, x: parseInt(e.target.value) }))}
              placeholder="X"
            />
            <Input
              type="number"
              value={cropDimensions.y}
              onChange={(e) => setCropDimensions(prev => ({ ...prev, y: parseInt(e.target.value) }))}
              placeholder="Y"
            />
            <Input
              type="number"
              value={cropDimensions.width}
              onChange={(e) => setCropDimensions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
              placeholder="Width"
            />
            <Input
              type="number"
              value={cropDimensions.height}
              onChange={(e) => setCropDimensions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
              placeholder="Height"
            />
          </div>
          <Button onClick={() => onCrop(cropDimensions)}>Crop</Button>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Resize</h3>
          <div className="grid grid-cols-2 gap-2">
            <Input
              type="number"
              value={resizeDimensions.width}
              onChange={(e) => setResizeDimensions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
              placeholder="Width"
            />
            <Input
              type="number"
              value={resizeDimensions.height}
              onChange={(e) => setResizeDimensions(prev => ({ ...prev, height: parseInt(e.target.value) }))}
              placeholder="Height"
            />
          </div>
          <Button onClick={() => onResize(resizeDimensions)}>Resize</Button>
        </div>
      </div>
    </div>
  );
};