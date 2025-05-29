import React from 'react';

export interface Color {
  name: string;
  color: [number, number, number];
}

interface ColorPaletteProps {
  colors: Color[];
  onPaletteChange: (palette: Color[]) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ colors, onPaletteChange }) => {
  return (
    <div className="grid grid-cols-4 gap-2 p-4">
      {colors.map((color, index) => (
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