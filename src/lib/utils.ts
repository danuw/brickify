import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function colorCorrection(r: number, g: number, b: number): [number, number, number] {
  const factor = 1.2;
  return [
    Math.min(255, r * factor),
    Math.min(255, g * factor),
    Math.min(255, b * factor)
  ];
}