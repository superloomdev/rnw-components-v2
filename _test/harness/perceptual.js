// Info: The perceptual comparison the browser gates share: two renders padded
// to one size, halved by averaging 2x2 blocks, and compared with pixelmatch.
// Not product code.

import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';


/********************************************************************
Pad an image to a size with its own backdrop (the color of its top-left
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


/********************************************************************
The smallest box holding every box with width and height > 0. Empty
boxes carry no pixels and do not move the union.

@param {Array} boxes - [{ x, y, width, height }]

@return {Object|null} - { x, y, width, height }, or null for no boxes
*********************************************************************/
export function unionBox (boxes) {

  let out = null;
  for (const b of boxes) {
    if (b === null || b === undefined || b.width <= 0 || b.height <= 0) {
      continue;
    }
    if (out === null) {
      out = { x: b.x, y: b.y, width: b.width, height: b.height };
      continue;
    }
    const x2 = Math.max(out.x + out.width, b.x + b.width);
    const y2 = Math.max(out.y + out.height, b.y + b.height);
    out.x = Math.min(out.x, b.x);
    out.y = Math.min(out.y, b.y);
    out.width = x2 - out.x;
    out.height = y2 - out.y;
  }
  return out;

}


/********************************************************************
Crop a PNG buffer to a rectangle in its own coordinates, clamped to the
image with a minimum of one pixel on each axis.

@param {Buffer} shot    - PNG
@param {Number} x       - Left edge in shot coordinates
@param {Number} y       - Top edge in shot coordinates
@param {Number} width   - Crop width
@param {Number} height  - Crop height

@return {Buffer} - PNG
*********************************************************************/
export function cropRect (shot, x, y, width, height) {

  const source = PNG.sync.read(shot);
  const cx = Math.round(x);
  const cy = Math.round(y);
  const cw = Math.max(1, Math.round(width));
  const ch = Math.max(1, Math.round(height));
  const out = new PNG({ width: cw, height: ch });
  // The requested rectangle is copied exactly: the part outside the
  // source stays transparent (a crop that starts left of or above the
  // picture pads instead of shifting the picture), and only the overlap
  // is copied
  const sx = Math.max(0, cx);
  const sy = Math.max(0, cy);
  const dx = Math.max(0, -cx);
  const dy = Math.max(0, -cy);
  const w = Math.min(source.width - sx, cw - dx);
  const h = Math.min(source.height - sy, ch - dy);
  if (w > 0 && h > 0) {
    PNG.bitblt(source, out, sx, sy, w, h, dx, dy);
  }

  return PNG.sync.write(out);

}


/********************************************************************
The common comparison window for one state (D39-3): each side's union
box expressed relative to its own sample root's top-left, then unioned.
Cropping each shot to `root + window` aligns both pictures at the
sample root and compares one window, never each side's own union.

@param {Object} oursRoot     - Our sample root's box ({ x, y })
@param {Object} oursUnion    - Our painted union box ({ x, y, width, height })
@param {Object} upstreamRoot - The reference's sample root
@param {Object} upstreamUnion - The reference's union box

@return {Object|null} - { x, y, width, height } relative to either root
*********************************************************************/
export function windowFor (oursRoot, oursUnion, upstreamRoot, upstreamUnion) {

  const relative = [
    { x: oursUnion.x - oursRoot.x, y: oursUnion.y - oursRoot.y, width: oursUnion.width, height: oursUnion.height },
    { x: upstreamUnion.x - upstreamRoot.x, y: upstreamUnion.y - upstreamRoot.y, width: upstreamUnion.width, height: upstreamUnion.height }
  ];
  return unionBox(relative);

}


/********************************************************************
The crop rectangles for one state (D39-3): the common window around
both sample roots (`windowFor` over each side's root and union),
clamped to the part of the window both bodies hold, returned in each
side's body coordinates.

@param {Object} ours     - readSampleBox result (union box, rootX/Y, bodyX/Y, bodyWidth/Height)
@param {Object} upstream - The same for the reference

@return {Object|null} - { ours: { x, y, width, height }, upstream: { ... } }, or null when nothing overlaps
*********************************************************************/
export function sampleWindow (ours, upstream) {

  const window = windowFor({ x: ours.rootX, y: ours.rootY }, ours, { x: upstream.rootX, y: upstream.rootY }, upstream);
  if (window === null) {
    return null;
  }
  let x1 = window.x;
  let y1 = window.y;
  let x2 = window.x + window.width;
  let y2 = window.y + window.height;
  for (const side of [ours, upstream]) {
    const fx = side.bodyX - side.rootX;
    const fy = side.bodyY - side.rootY;
    x1 = Math.max(x1, fx);
    y1 = Math.max(y1, fy);
    x2 = Math.min(x2, fx + side.bodyWidth);
    y2 = Math.min(y2, fy + side.bodyHeight);
  }
  if (x2 <= x1 || y2 <= y1) {
    return null;
  }
  const rect = function (side) {
    return { x: side.rootX + x1 - side.bodyX, y: side.rootY + y1 - side.bodyY, width: x2 - x1, height: y2 - y1 };
  };
  return { ours: rect(ours), upstream: rect(upstream) };

}
