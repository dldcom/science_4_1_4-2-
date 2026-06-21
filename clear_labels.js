import { Jimp } from 'jimp';

async function clearLabels() {
  try {
    console.log('Loading image...');
    const image = await Jimp.read('public/images/microbes_spritesheet.png');
    const width = image.width;
    const height = image.height;
    const data = image.bitmap.data;
    
    const cellW = width / 5; // 204.8
    const cellH = height / 5; // 204.8
    const bottomThreshold = 20; // Clear the bottom 20px of each cell (text box area)
    
    console.log(`Clearing bottom ${bottomThreshold}px of each cell to remove text labels and their backgrounds...`);
    
    let clearedCount = 0;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const relY = y % cellH;
        
        // If inside the bottom threshold of the cell, make it transparent
        if (relY >= cellH - bottomThreshold) {
          const idx = (y * width + x) * 4;
          data[idx + 3] = 0; // Alpha = 0
          clearedCount++;
        }
      }
    }
    
    console.log('Saving processed image...');
    await image.write('public/images/microbes_spritesheet.png');
    console.log(`Successfully cleared ${clearedCount} pixels. Labels removed!`);
  } catch (error) {
    console.error('Error removing labels:', error);
  }
}

clearLabels();
