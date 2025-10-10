import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from './ui/button';
import { Select } from './ui/select';
import { useBrickifyStore } from '@/store/store';

const PLATE_SIZES = [16, 32, 48, 64];

interface Area {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const VisualImageEditor: React.FC = () => {
  const originalImage = useBrickifyStore((state) => state.originalImage);
  const image = useBrickifyStore((state) => state.image);
  const cropImage = useBrickifyStore((state) => state.cropImage);
  const resizeImage = useBrickifyStore((state) => state.resizeImage);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [outputWidth, setOutputWidth] = useState(32);
  const [outputHeight, setOutputHeight] = useState(32);
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

  // Calculate aspect ratio from output dimensions
  const aspectRatio = outputWidth / outputHeight;

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

      {showCropTool && originalImage && (
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">
              Cropping from original image ({originalImage.width}×{originalImage.height}px)
            </p>
            <p className="text-sm font-medium text-blue-600">
              Aspect ratio locked to {outputWidth}×{outputHeight} ({aspectRatio === 1 ? 'square' : aspectRatio > 1 ? 'landscape' : 'portrait'})
            </p>
          </div>
          <div className="relative h-96 bg-gray-900 rounded-lg overflow-hidden">
            <Cropper
              image={originalImage.src}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
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
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Output Size (16×16 plates)</h3>
          <p className="text-sm text-gray-600">
            Resize current image to LEGO plate dimensions
          </p>
          <p className="text-xs text-gray-500">
            Based on 16×16 LEGO dot plates
          </p>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium min-w-[60px]">Width:</label>
            <Select
              value={outputWidth.toString()}
              onChange={(e) => setOutputWidth(parseInt(e.target.value))}
            >
              {PLATE_SIZES.map(size => (
                <option key={size} value={size}>
                  {size} ({size / 16} plate{size > 16 ? 's' : ''})
                </option>
              ))}
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium min-w-[60px]">Height:</label>
            <Select
              value={outputHeight.toString()}
              onChange={(e) => setOutputHeight(parseInt(e.target.value))}
            >
              {PLATE_SIZES.map(size => (
                <option key={size} value={size}>
                  {size} ({size / 16} plate{size > 16 ? 's' : ''})
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-3">
          <p className="text-sm text-gray-600">
            Current: {image.width}×{image.height}px
          </p>
          <p className="text-sm font-medium">
            Output: {outputWidth}×{outputHeight} dots
          </p>
          <p className="text-sm text-gray-500">
            {(outputWidth / 16)}×{(outputHeight / 16)} plates
          </p>
          <Button onClick={handleResize} size="lg">
            Resize to {outputWidth}×{outputHeight}
          </Button>
        </div>
      </div>
    </div>
  );
};
