// Info: The perceptual comparison the browser gates share: two renders padded
// to one size, halved by averaging 2x2 blocks, and compared with pixelmatch.
// Not product code.

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';


/********************************************************************
Pad an image to a size with its own backdrop (the colour of its top-left
pixel, the page behind the cell), from the top-left corner. White padding
would count every padded pixel on a dark page as a difference.

@param {Object} png    - Decoded PNG
@param {Number} width  - Target width
@param {Number} height - Target height

@return {Object} - Decoded PNG of the target size
*********************************************************************/
export function pad (png, width, height) {

  const out = new PNG({ width: width, height: height });
  for (let i = 0; i < out.data.length; i += 4) {
    out.data[i] = png.data[0];
    out.data[i + 1] = png.data[1];
    out.data[i + 2] = png.data[2];
    out.data[i + 3] = png.data[3];
  }
  PNG.bitblt(png, out, 0, 0, png.width, png.height, 0, 0);

  return out;

}


/********************************************************************
Downscale an image by half, averaging each 2x2 block.

@param {Object} png - Decoded PNG

@return {Object} - Decoded PNG at half size
*********************************************************************/
export function halve (png) {

  const width = Math.max(1, Math.floor(png.width / 2));
  const height = Math.max(1, Math.floor(png.height / 2));
  const out = new PNG({ width: width, height: height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let channel = 0; channel < 4; channel++) {
        let sum = 0;
        for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
          const sx = Math.min(png.width - 1, x * 2 + dx);
          const sy = Math.min(png.height - 1, y * 2 + dy);
          sum += png.data[(sy * png.width + sx) * 4 + channel];
        }
        out.data[(y * width + x) * 4 + channel] = Math.round(sum / 4);
      }
    }
  }

  return out;

}


/********************************************************************
Mismatch ratio between two PNG buffers of equal size.

@param {Buffer} a         - PNG
@param {Buffer} b         - PNG
@param {Number} threshold - pixelmatch threshold; 0 counts any difference

@return {Number} - Mismatched pixels / total
*********************************************************************/
export function ratio (a, b, threshold) {

  const pa = PNG.sync.read(a);
  const pb = PNG.sync.read(b);
  if (pa.width !== pb.width || pa.height !== pb.height) {
    throw new Error('ratio: images differ in size');
  }
  const mismatched = pixelmatch(pa.data, pb.data, null, pa.width, pa.height, { threshold: threshold });

  return mismatched / (pa.width * pa.height);

}


/********************************************************************
Perceptual mismatch between two renders of possibly different sizes:
padded to one size, halved, compared at threshold 0.2.

@param {Buffer} a - PNG
@param {Buffer} b - PNG

@return {Number} - Mismatched pixels / total
*********************************************************************/
export function perceptualRatio (a, b) {

  const pa = PNG.sync.read(a);
  const pb = PNG.sync.read(b);
  const width = Math.max(pa.width, pb.width);
  const height = Math.max(pa.height, pb.height);
  const ha = halve(pad(pa, width, height));
  const hb = halve(pad(pb, width, height));

  return ratio(PNG.sync.write(ha), PNG.sync.write(hb), 0.2);

}
