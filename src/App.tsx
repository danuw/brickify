import { ImageUploader } from './components/ImageUploader';
import { VisualImageEditor } from './components/VisualImageEditor';
import { ColorPalette } from './components/ColorPalette';
import { Canvas } from './components/Canvas';
import { PrintableView } from './components/PrintableView';
import { History } from './components/History';
import { Button } from './components/ui/button';
import { useBrickifyStore } from './store/store';

function App() {
  const image = useBrickifyStore((state) => state.image);
  const showPixelView = useBrickifyStore((state) => state.showPixelView);
  const togglePixelView = useBrickifyStore((state) => state.togglePixelView);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Brickify</h1>
        <p className="text-gray-600 mb-8">Image Resizer and Cropper to create Lego brick frame templates</p>

        <div className="space-y-8">
          <History />

          <ImageUploader />

          {image && (
            <>
              <VisualImageEditor />

              <div className="flex gap-4">
                <Button
                  onClick={togglePixelView}
                  variant="outline"
                >
                  {showPixelView ? 'Hide' : 'Show'} Pixel View
                </Button>
              </div>

              <ColorPalette />

              <Canvas />

              <PrintableView />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
