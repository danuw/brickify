import React from 'react';
import { useBrickifyStore } from '@/store/store';
import { PALETTE_PRESETS } from '@/store/paletteSlice';
import { Button } from './ui/button';

export const ColorPalette: React.FC = () => {
  const palette = useBrickifyStore((state) => state.palette);
  const currentPresetIndex = useBrickifyStore((state) => state.currentPresetIndex);
  const selectPreset = useBrickifyStore((state) => state.selectPreset);

  return (
    <div className="space-y-4 border border-gray-200 rounded-lg p-4">
      <div>
        <h3 className="text-lg font-semibold mb-3">Color Palette</h3>

        <div className="flex gap-2 flex-wrap mb-4">
          {PALETTE_PRESETS.map((preset, index) => (
            <Button
              key={preset.name}
              onClick={() => selectPreset(index)}
              variant={currentPresetIndex === index ? 'default' : 'outline'}
              size="sm"
            >
              {preset.name}
            </Button>
          ))}
        </div>

        <p className="text-sm text-gray-600 mb-3">
          {PALETTE_PRESETS[currentPresetIndex].description}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {palette.map((color, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
          >
            <div
              className="w-10 h-10 rounded-full border border-gray-300 shadow-sm"
              style={{
                backgroundColor: `rgb(${color.color.join(',')})`
              }}
            />
            <span className="text-xs mt-1 text-center">{color.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
