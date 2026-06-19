import { Jimp } from 'jimp';

async function clearBorders() {
  try {
    console.log('Loading image...');
    const image = await Jimp.read('public/images/microbes_spritesheet.png');
    const width = image.width;
    const height = image.height;
    const data = image.bitmap.data;
    
    const cellW = width / 5; // 204.8
    const cellH = height / 5; // 204.8
    const borderThreshold = 16; // Clear 16px from each cell edge
    
    console.log(`Clearing ${borderThreshold}px borders from cell edges...`);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Find position relative to the cell
        const relX = x % cellW;
        const relY = y % cellH;
        
        // Distance from the 4 cell edges
        const distX = Math.min(relX, cellW - relX);
        const distY = Math.min(relY, cellH - relY);
        
        if (distX < borderThreshold || distY < borderThreshold) {
          const idx = (y * width + x) * 4;
          data[idx + 3] = 0; // Set Alpha to 0 (make transparent)
        }
      }
    }
    
    console.log('Saving processed image...');
    await image.write('public/images/microbes_spritesheet.png');
    console.log('Borders removed successfully!');
  } catch (error) {
    console.error('Error removing borders:', error);
  }
}

clearBorders();
