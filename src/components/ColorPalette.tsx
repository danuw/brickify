import React from 'react';
import { useBrickifyStore } from '@/store/store';

export const ColorPalette: React.FC = () => {
  const palette = useBrickifyStore((state) => state.palette);

  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {palette.map((color, index) => (
        <div
          key={index}
          className="flex flex-col items-center"
        >
          <div
            className="w-8 h-8 rounded-full border border-gray-200"
            style={{
              backgroundColor: `rgb(${color.color.join(',')})`
            }}
          />
          <span className="text-xs mt-1">{color.name}</span>
        </div>
      ))}
    </div>
  );
};
