import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useBrickifyStore } from '@/store/store';

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const VisualImageEditor: React.FC = () => {
  const image = useBrickifyStore((state) => state.image);
  const cropImage = useBrickifyStore((state) => state.cropImage);
  const resizeImage = useBrickifyStore((state) => state.resizeImage);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [outputWidth, setOutputWidth] = useState(48);
  const [outputHeight, setOutputHeight] = useState(48);
  const [showCropTool, setShowCropTool] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = useCallback(() => {
    if (croppedAreaPixels) {
      cropImage({
        x: Math.round(croppedAreaPixels.x),
        y: Math.round(croppedAreaPixels.y),
        width: Math.round(croppedAreaPixels.width),
        height: Math.round(croppedAreaPixels.height),
      });
      setShowCropTool(false);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  }, [croppedAreaPixels, cropImage]);

  const handleResize = useCallback(() => {
    resizeImage({ width: outputWidth, height: outputHeight });
  }, [outputWidth, outputHeight, resizeImage]);

  if (!image) return null;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button
          onClick={() => setShowCropTool(!showCropTool)}
          variant="outline"
        >
          {showCropTool ? 'Cancel Crop' : 'Crop Image'}
        </Button>
      </div>

      {showCropTool && (
        <div className="space-y-4">
          <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
            <Cropper
              image={image.src}
              crop={crop}
              zoom={zoom}
              aspect={undefined}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          <Button onClick={handleApplyCrop}>
            Apply Crop
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Resize Output</h3>
          <div className="flex gap-2 items-center">
            <label className="text-sm">Width:</label>
            <Input
              type="number"
              value={outputWidth}
              onChange={(e) => setOutputWidth(parseInt(e.target.value) || 1)}
              min={1}
              max={200}
              className="w-20"
            />
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm">Height:</label>
            <Input
              type="number"
              value={outputHeight}
              onChange={(e) => setOutputHeight(parseInt(e.target.value) || 1)}
              min={1}
              max={200}
              className="w-20"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-sm text-gray-600 mb-2">
            Current size: {image.width}×{image.height}px
          </p>
          <p className="text-sm text-gray-600 mb-2">
            Output: {outputWidth}×{outputHeight} bricks
          </p>
          <Button onClick={handleResize}>
            Resize to {outputWidth}×{outputHeight}
          </Button>
        </div>
      </div>
    </div>
  );
};
