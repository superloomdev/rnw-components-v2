// Info: Pixel sampling helpers for the browser gates.
//
// Anatomy is asserted as what a user can perceive, never as the mechanism that
// produces it. Two earlier drafts of the notch test named a mechanism - first
// the element names, then the element geometry - and each would have rejected a
// legitimate implementation. Sampling the rendered pixels accepts split
// elements, an opaque occluding label, or an SVG path, and still fails a notch
// that does not work.
//
// Not product code; a local test harness.

import { PNG } from 'pngjs';

/********************************************************************
Decode a PNG buffer into a pixel reader.

@param {Buffer} buffer - PNG bytes

@return {Object} - { width, height, at(x, y) -> { r, g, b, a } }
*********************************************************************/
export function decode (buffer) {

  const png = PNG.sync.read(buffer);

  return {
    width: png.width,
    height: png.height,
    at: function (x, y) {
      // floor, never round. A 1px border at integer y paints row y only, and
      // Math.round(y + 0.5) lands on y + 1 - the row BELOW the painted edge.
      // That off-by-one made the "unbroken at rest" assertion unsatisfiable for
      // a faithful 1px outline while passing for the 2px focused one, which is
      // exactly the kind of near-miss that reads as an implementation defect.
      const px = Math.floor(x);
      const py = Math.floor(y);
      if (px < 0 || py < 0 || px >= png.width || py >= png.height) {
        return null;
      }
      const i = (png.width * py + px) << 2;

      return { r: png.data[i], g: png.data[i + 1], b: png.data[i + 2], a: png.data[i + 3] };
    }
  };

}

/********************************************************************
Euclidean distance between two RGB colors.

@param {Object} a - { r, g, b }
@param {Object} b - { r, g, b }

@return {Number} - Distance, 0 for identical
*********************************************************************/
export function distance (a, b) {

  if (!a || !b) {
    return Infinity;
  }

  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);

}

/********************************************************************
Parse a CSS rgb/rgba string into a color object.

@param {String} css - e.g. "rgb(22, 22, 22)"

@return {Object|null} - { r, g, b } or null
*********************************************************************/
export function parseCss (css) {

  const m = String(css).match(/rgba?\(([^)]+)\)/);
  if (!m) {
    return null;
  }
  const parts = m[1].split(',').map(function (v) {
    return parseFloat(v);
  });

  return { r: parts[0], g: parts[1], b: parts[2] };

}

/********************************************************************
Decide whether a color appears along a horizontal run of pixels.

Samples 21 points and reports the match ratio. A ratio is only ever
compared against another ratio measured the same way, never against an
absolute threshold chosen by eye: a border is often a mid-grey, and
antialiased text on a light background passes through mid-grey at glyph
edges, so an absolute threshold cannot tell "border showing through"
apart from "a letter of the label".

@param {Object} img - Reader from decode()
@param {Number} y - Row to sample
@param {Number} x1 - Run start
@param {Number} x2 - Run end
@param {Object} color - Target { r, g, b }
@param {Number} tol - Distance tolerance

@return {Object} - { matched, sampled, ratio }
*********************************************************************/
export function runMatches (img, y, x1, x2, color, tol) {

  const samples = 21;
  const span = x2 - x1;
  let matched = 0;
  let sampled = 0;

  for (let i = 1; i <= samples; i++) {
    const x = x1 + (span * i) / (samples + 1);
    const px = img.at(x, y);
    if (!px) {
      continue;
    }
    sampled += 1;
    if (distance(px, color) <= tol) {
      matched += 1;
    }
  }

  return {
    matched: matched,
    sampled: sampled,
    ratio: sampled === 0 ? 0 : matched / sampled
  };

}
