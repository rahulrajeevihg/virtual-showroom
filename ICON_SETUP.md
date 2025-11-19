# PWA Icon Setup

The app needs PNG icons for PWA installation. You have two options:

## Option 1: Online Conversion (Quickest)
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `public/icon-192.svg` and convert to PNG (192x192)
3. Upload `public/icon-512.svg` and convert to PNG (512x512)
4. Save both as:
   - `public/icon-192.png`
   - `public/icon-512.png`

## Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick first, then run:
magick icon-192.svg -resize 192x192 icon-192.png
magick icon-512.svg -resize 512x512 icon-512.png
```

## Option 3: Use Any Graphics Editor
- Open the SVG files in:
  - Adobe Illustrator
  - Inkscape (Free)
  - Figma (Free)
  - GIMP (Free)
- Export as PNG with the correct dimensions

## Temporary Placeholder
For now, you can use any square logo/image you have and resize it to:
- 192x192 pixels (icon-192.png)
- 512x512 pixels (icon-512.png)

The icons should have a black background to match your app theme.
