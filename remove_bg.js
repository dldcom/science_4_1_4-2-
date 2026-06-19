import { Jimp } from 'jimp';

async function removeBackground() {
  try {
    console.log('Loading image...');
    const image = await Jimp.read('public/images/microbes_spritesheet.png');
    
    console.log('Processing pixel buffer...');
    const data = image.bitmap.data;
    const length = data.length;
    
    for (let i = 0; i < length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      
      // If the pixel is very dark (black background), make it transparent
      if (r < 35 && g < 35 && b < 35) {
        data[i + 3] = 0; // Set Alpha to 0
      }
    }
    
    console.log('Saving processed image...');
    await image.write('public/images/microbes_spritesheet.png');
    console.log('Background removed successfully!');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

removeBackground();
