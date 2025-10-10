import React from 'react';
import { useBrickifyStore } from '@/store/store';
import { Button } from './ui/button';
import { HistoryEntry } from '@/store/historySlice';

export const History: React.FC = () => {
  const history = useBrickifyStore((state) => state.history);
  const setImage = useBrickifyStore((state) => state.setImage);
  const setPalette = useBrickifyStore((state) => state.setPalette);
  const clearHistory = useBrickifyStore((state) => state.clearHistory);

  const loadEntry = (entry: HistoryEntry) => {
    const img = new Image();
    img.src = entry.imageDataUrl;
    img.onload = () => {
      setImage(img);
      setPalette(entry.palette);
    };
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Recent Brickifications</h3>
        <Button onClick={clearHistory} variant="outline" size="sm">
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {history.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-500 cursor-pointer transition-colors"
            onClick={() => loadEntry(entry)}
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center p-2">
              <img
                src={entry.imageDataUrl}
                alt={`Brickification ${entry.width}x${entry.height}`}
                className="max-w-full max-h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div className="p-2 bg-gray-50">
              <p className="text-xs font-medium">{entry.width}×{entry.height}px</p>
              <p className="text-xs text-gray-500">{formatDate(entry.timestamp)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
