import React from 'react';
import { Input } from './ui/input';
import { useBrickifyStore } from '@/store/store';

export const ImageUploader: React.FC = () => {
  const setImage = useBrickifyStore((state) => state.setImage);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = new Image();
        image.src = e.target?.result as string;
        image.onload = () => setImage(image);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Input
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="mb-4"
    />
  );
};
