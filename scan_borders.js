import { Jimp } from 'jimp';

async function scanBorders() {
  try {
    const image = await Jimp.read('public/images/microbes_spritesheet.png');
    const width = image.width;
    const height = image.height;
    const data = image.bitmap.data;
    
    const cellW = width / 5; // 204.8
    const cellH = height / 5; // 204.8
    
    console.log(`Cell size: ${cellW} x ${cellH}`);
    
    // Let's sample a few rows/cols and see where there are high-density colored pixels near cell boundaries.
    // For cell (0, 0), the boundary is x=0 to 204.8, y=0 to 204.8.
    // Let's check where the pixels are colored near the boundary.
    let edgePixelCounts = new Array(Math.ceil(cellW)).fill(0);
    
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        const startX = Math.round(c * cellW);
        const endX = Math.round((c + 1) * cellW);
        const startY = Math.round(r * cellH);
        const endY = Math.round((r + 1) * cellH);
        
        // Scan within this cell, relative to the cell start
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const idx = (y * width + x) * 4;
            const alpha = data[idx + 3];
            if (alpha > 0) {
              const relX = x - startX;
              const relY = y - startY;
              
              // If it's close to any of the 4 edges of the cell
              const distFromEdge = Math.min(relX, cellW - relX, relY, cellH - relY);
              if (distFromEdge < 30) {
                // Let's record the distance
                const d = Math.round(distFromEdge);
                if (d < edgePixelCounts.length) {
                  edgePixelCounts[d]++;
                }
              }
            }
          }
        }
      }
    }
    
    console.log('Colored pixel counts by distance from cell edge:');
    for (let d = 0; d < 30; d++) {
      if (edgePixelCounts[d] > 0) {
        console.log(`Dist ${d}px: ${edgePixelCounts[d]} pixels`);
      }
    }
    
  } catch (err) {
    console.error(err);
  }
}

scanBorders();
