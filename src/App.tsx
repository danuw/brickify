import React, { useState } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ImageEditor, CropDimensions, ResizeDimensions } from './components/ImageEditor';
import { ColorPalette, Color } from './components/ColorPalette';
import { Canvas } from './components/Canvas';
import { Button } from './components/ui/button';

const defaultPalette: Color[] = [
  { name: "Dark Blue", color: [13, 43, 69] },
  { name: "Medium Blue", color: [32, 60, 86] },
  { name: "Dark Purple", color: [84, 78, 104] },
  { name: "Medium Purple", color: [141, 105, 122] },
  { name: "Dark Orange", color: [208, 129, 89] },
  { name: "Orange", color: [255, 170, 94] },
  { name: "Light Orange", color: [255, 212, 163] },
  { name: "Very Light Orange", color: [255, 236, 214] }
];

function App() {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [showPixelView, setShowPixelView] = useState(false);
  const [palette, setPalette] = useState<Color[]>(defaultPalette);

  const handleCrop = (dimensions: CropDimensions) => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.drawImage(
      image,
      dimensions.x,
      dimensions.y,
      dimensions.width,
      dimensions.height,
      0,
      0,
      dimensions.width,
      dimensions.height
    );

    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    newImage.onload = () => setImage(newImage);
  };

  const handleResize = (dimensions: ResizeDimensions) => {
    if (!image) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    ctx.drawImage(image, 0, 0, dimensions.width, dimensions.height);

    const newImage = new Image();
    newImage.src = canvas.toDataURL();
    newImage.onload = () => setImage(newImage);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Brickify</h1>
        <p className="text-gray-600 mb-8">Image Resizer and Cropper to create Lego brick frame templates</p>

        <div className="space-y-8">
          <ImageUploader onImageUpload={setImage} />

          {image && (
            <>
              <ImageEditor
                image={image}
                onCrop={handleCrop}
                onResize={handleResize}
              />

              <div className="flex gap-4">
                <Button
                  onClick={() => setShowPixelView(!showPixelView)}
                  variant="outline"
                >
                  {showPixelView ? 'Hide' : 'Show'} Pixel View
                </Button>
              </div>

              <ColorPalette
                colors={palette}
                onPaletteChange={setPalette}
              />

              <Canvas
                image={image}
                showPixelView={showPixelView}
                palette={palette}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;