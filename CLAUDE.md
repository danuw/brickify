# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Brickify is a React + TypeScript tool for creating custom LEGO frames using dot-type bricks from photos. Users can upload images, crop and resize them, then see a pixelated preview with color-matched LEGO bricks and generate an inventory of required colors.

Published to: https://danuw.github.io/brickify/

## Development Commands

**Start dev server:**
```bash
npm run dev
```

**Build for production:**
```bash
npm run build
```
Note: Build runs TypeScript compiler first, then Vite build. Output goes to `dist/`.

**Lint code:**
```bash
npm run lint
```

**Preview production build:**
```bash
npm run preview
```

## Architecture

### State Management & Data Flow

The app uses React state management centered in `App.tsx` with props passed down to child components:

1. **Image Processing Pipeline**: User uploads image → ImageUploader → App state → ImageEditor (crop/resize) → Canvas processing
2. **Color Matching**: Canvas component reads pixel data, applies `colorCorrection()` from `utils.ts`, then matches to closest palette color using Euclidean distance in RGB space
3. **Pixel View Rendering**: Each pixel becomes a circle (5px diameter) filled with the closest palette color

### Key Components

**App.tsx** (src/App.tsx)
- Root component managing image state, pixel view toggle, and color palette
- Handles crop/resize operations by creating temporary canvas elements and converting to data URLs
- Default palette: 8-color gradient (dark blue → light orange) defined in `defaultPalette`

**Canvas.tsx** (src/components/Canvas.tsx)
- Renders both original image and "pixel view" (LEGO brick simulation)
- `findClosestColor()`: Matches RGB values to palette using Euclidean distance
- `renderPixelView()`: Processes each pixel, applies color correction, matches to palette, draws as circle

**ImageEditor.tsx** (src/components/ImageEditor.tsx)
- Provides UI for setting crop coordinates (x, y, width, height) and resize dimensions
- Updates dimensions in local state before user commits via button click

**ColorPalette.tsx** (src/components/ColorPalette.tsx)
- Displays current palette colors
- Currently read-only (onPaletteChange prop exists for future editing)

### Utilities

**utils.ts** (src/lib/utils.ts)
- `colorCorrection(r, g, b)`: Brightens colors by 20% factor before palette matching (helps with darker images)
- `cn()`: Tailwind class merging utility

### Path Aliases

The project uses `@/*` path aliases mapped to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

## Deployment

GitHub Actions workflow deploys to GitHub Pages on push to `main` branch. Build artifacts from `dist/` are deployed automatically.

## Known Roadmap Items

- Numbers on grid as build instructions (partially implemented)
- Selectable/custom palettes
- Lock aspect ratio for output
- 16x16 plate format presets
