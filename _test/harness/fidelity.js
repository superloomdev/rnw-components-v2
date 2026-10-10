// Info: The fidelity comparison the census and the fidelity gate share. For
// one built row against one of its references, under one scheme: every
// sample state, and every enabled state again while hovered, keyboard
// focused and pressed, is measured on both pages with the extended reading
// (ink of text and paths with every opacity above them, box colors at their
// element opacity, the paint sampled from the pixels of each box part),
// compared with the gate's own comparison, and screenshotted for a
// perceptual ratio. A focus ring and an elevation are compared by their
// pixels, not by the CSS that draws them (one system draws a ring as an
// outline, another as a border with an inset shadow or a separate element):
// the paint just inside the anchor part's top edge, the paint to its left
// out to the widest ring (the side no cell caption sits on), and the paint
// below its bottom edge, near its trailing end, where a shadow falls. A part
// the second reference omits with `mask` (it never draws it, ours does by
// design) is left out of the pixels as it is out of the parts. Not product
// code.

import { PNG } from 'pngjs';

import { findDisagreements } from './compare.js';
import { enterInteraction, leaveInteraction, openReference, openShowcase, readParts, shootCell, shootPart } from './page.js';
import { perceptualRatio } from './perceptual.js';
import { decode } from './pixels.js';

export const INTERACTIONS = Object.freeze(['hover', 'focus', 'pressed']);
export const SCHEMES = Object.freeze(['light', 'dark']);
export const TEMPLATE = Object.freeze({ primary: 'carbon', second: 'material' });

// Pixels around each cell body in a screenshot: wide enough for the widest ring (a 44px circle around an 18px box)
const MARGIN = 20;
// Pixels sampled left of the anchor's leading edge, inside its top edge, and below its bottom edge
const LEFT = Object.freeze(Array.from({ length: 18 }, function (value, index) {
  return index + 1;
}));
const INSIDE = Object.freeze([1, 2, 3]);
const BELOW = Object.freeze([1, 2, 3, 4, 5, 6, 7, 8]);
// The part a focus ring is drawn around and a shadow falls from, per component,
// and the parts whose borders may draw a ring (their border CSS is left to the pixels while focused)
const ANCHOR = Object.freeze({ Button: 'root', IconButton: 'root', Checkbox: 'box', TextInput: 'frame', TextArea: 'frame', Select: 'frame' });
const RING_PARTS = Object.freeze({ Button: ['root'], IconButton: ['root'], Checkbox: ['box', 'outline', 'fill'], TextInput: ['frame', 'edge'], TextArea: ['frame', 'edge'], Select: ['frame', 'edge'] });
// How far outside the cell body a pixel is compared (the cell chrome lies beyond)
const OUTSIDE = 12;
// Properties the pixels answer instead of the CSS that draws them
const PIXEL_PROPERTIES = Object.freeze(['outline', 'boxShadow']);
const RING_BORDER = Object.freeze(['borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth', 'borderBottomColor']);


/********************************************************************
Sample the paint of every box part from a cell screenshot: the pixel a
little inside the part's top edge, at its horizontal center (below any
border, above any centered text).

@param {Object} state - part name -> measurement
@param {Buffer} shot  - The cell screenshot (body plus MARGIN)

@return {void}
*********************************************************************/
function samplePaint (state, shot) {

  if (!shot) {
    return;
  }
  const image = decode(shot);
  for (const name of Object.keys(state)) {
    const part = state[name];
    if (part === null || part.visible !== true || part.ink !== undefined || part._bodyX === undefined || part.width < 6 || part.height < 6) {
      continue;
    }
    const inset = Math.min(part.height / 2, Math.max(3, (parseFloat(part.borderTopWidth) || 0) + 2));
    const pixel = image.at(MARGIN + part._bodyX + part.width / 2, MARGIN + part._bodyY + inset);
    if (pixel !== null) {
      part.paint = 'rgb(' + pixel.r + ', ' + pixel.g + ', ' + pixel.b + ')';
    }
  }

}


/********************************************************************
The paint around the anchor: inside its top edge at its center, left of
its leading edge at its vertical center, and below its bottom edge four
pixels before its trailing end, one color per pixel.

@param {Object} part - The anchor part's measurement
@param {Buffer} shot - The cell screenshot

@return {Object|null} - { inside, left, below }: arrays of [r, g, b] or null
*********************************************************************/
function profileOf (part, shot) {

  if (!shot || !part || part.visible !== true || part._bodyX === undefined) {
    return null;
  }
  const image = decode(shot);
  const sample = function (x, y) {
    const pixel = image.at(x, y);
    return pixel === null ? null : [pixel.r, pixel.g, pixel.b];
  };
  const centerX = MARGIN + part._bodyX + part.width / 2;
  const centerY = MARGIN + part._bodyY + part.height / 2;

  return {
    inside: INSIDE.map(function (offset) {
      return sample(centerX, MARGIN + part._bodyY + offset);
    }),
    left: LEFT.map(function (offset) {
      return part._bodyX - offset < -OUTSIDE ? null : sample(MARGIN + part._bodyX - offset, centerY);
    }),
    below: BELOW.map(function (offset) {
      // The first row strictly below the box; a fractional box would otherwise
      // let the band read the part's own bottom edge as "below"
      return sample(MARGIN + part._bodyX + part.width - 4, MARGIN + part._bodyY + Math.ceil(part.height) - 1 + offset);
    })
  };

}


/********************************************************************
Compare two profiles pixel by pixel, eight levels per channel
(antialiased ring and shadow edges); a pixel agrees with its counterpart
or one of its two neighbors, so a part drawn half a pixel apart (within
the geometry tolerance) is not a difference.

@param {Object} ours     - Our profile
@param {Object} upstream - The upstream profile

@return {Array} - Descriptions of the first difference in each band
*********************************************************************/
function compareProfiles (ours, upstream) {

  if (!ours || !upstream) {
    return [];
  }
  const out = [];
  const bands = { inside: INSIDE, left: LEFT, below: BELOW };
  for (const band of Object.keys(bands)) {
    for (let i = 0; i < bands[band].length; i++) {
      const a = ours[band][i];
      const b = upstream[band][i];
      if (a === null || b === null) {
        continue;
      }
      const near = function (pixel, row, j) {
        return row[j] !== null && row[j] !== undefined && pixel.every(function (value, index) {
          return Math.abs(value - row[j][index]) <= 8;
        });
      };
      const matched = function (pixel, row) {
        return near(pixel, row, i) || near(pixel, row, i - 1) || near(pixel, row, i + 1);
      };
      if (!matched(a, upstream[band]) || !matched(b, ours[band])) {
        out.push(band + ' ' + bands[band][i] + 'px: rgb(' + a.join(', ') + ') here, rgb(' + b.join(', ') + ') upstream');
        break;
      }
    }
  }

  return out;

}


/********************************************************************
Crop a cell screenshot to one part's box, for a reference whose component
is that part alone (its ring is compared by the profile).

@param {Buffer} shot - The cell screenshot
@param {Object} part - The part's measurement

@return {Buffer} - PNG
*********************************************************************/
function cropTo (shot, part) {

  const source = PNG.sync.read(shot);
  const x = Math.max(0, Math.round(MARGIN + part._bodyX));
  const y = Math.max(0, Math.round(MARGIN + part._bodyY));
  const width = Math.max(1, Math.min(source.width - x, Math.round(part.width)));
  const height = Math.max(1, Math.min(source.height - y, Math.round(part.height)));
  const out = new PNG({ width: width, height: height });
  PNG.bitblt(source, out, x, y, width, height, 0, 0);

  return PNG.sync.write(out);

}


/********************************************************************
Leave the masked omissions out of our screenshot: inside the box of each
part the reference omits with `mask` (a part its omission probe proves it
never draws, and ours draws by design), our pixels are replaced by the
reference's, one pixel wider on each side for the antialiased edge. A mask
whose box contains the anchor part would hide the component itself, so it
is reported instead of applied.

@param {Buffer} ours     - Our screenshot (the cell's, or the origin element's)
@param {Buffer} upstream - The reference screenshot of the same kind
@param {Object} state    - Our part name -> measurement
@param {Array}  masked   - The masked part names
@param {String} anchor   - The anchor part name
@param {Object} [origin] - Our origin part's measurement: the shots are framed
                           on it, so body coordinates shift by its box
@param {Number} [margin] - The margin the shots carry around their frame

@return {Object} - { shot: PNG, lines: descriptions of rejected masks }
*********************************************************************/
function maskOmitted (ours, upstream, state, masked, anchor, origin, margin) {

  const lines = [];
  const boxes = masked.filter(function (name) {
    return state[name] && state[name].visible === true && state[name]._bodyX !== undefined;
  });
  if (boxes.length === 0) {
    return { shot: ours, lines: lines };
  }
  const target = PNG.sync.read(ours);
  const source = PNG.sync.read(upstream);
  const core = anchor ? state[anchor] : null;
  const dx = origin && origin._bodyX !== undefined ? -origin._bodyX : 0;
  const dy = origin && origin._bodyY !== undefined ? -origin._bodyY : 0;
  const edge = margin === undefined ? MARGIN : margin;
  for (const name of boxes) {
    const part = state[name];

    // A mask may never cover the part the component is compared around
    if (core && core.visible === true && part._bodyX <= core._bodyX && part._bodyY <= core._bodyY &&
      part._bodyX + part.width >= core._bodyX + core.width && part._bodyY + part.height >= core._bodyY + core.height) {
      lines.push('mask ' + name + ' covers the anchor ' + anchor);
      continue;
    }

    const x = Math.max(0, Math.floor(edge + dx + part._bodyX) - 1);
    const y = Math.max(0, Math.floor(edge + dy + part._bodyY) - 1);
    const width = Math.min(target.width, source.width, Math.ceil(edge + dx + part._bodyX + part.width) + 1) - x;
    const height = Math.min(target.height, source.height, Math.ceil(edge + dy + part._bodyY + part.height) + 1) - y;
    if (width > 0 && height > 0) {
      PNG.bitblt(source, target, x, y, width, height, x, y);
    }
  }

  return { shot: PNG.sync.write(target), lines: lines };

}


/********************************************************************
Measure one page: every rest state, then every enabled state in each
interaction.

@param {Object} page      - Playwright page
@param {Object} component - Discovered component
@param {Object} reference - The reference block (primary or second)
@param {String} side      - 'upstream' | 'ours'
@param {Object} [masks]   - Masked omitted parts, measured on our side only

@return {Promise<Object>} - { states: label -> parts, shots: label -> PNG }
*********************************************************************/
async function collect (page, component, reference, side, masks) {

  const parts = side === 'ours' ? Object.assign({}, reference.parts, masks) : reference.parts;
  const origin = reference.origin;
  const originSelector = origin && parts[origin] ? parts[origin][side] : null;
  const rest = await readParts(page, component.name, parts, side, origin, { extended: true });
  const states = {};
  const shots = {};
  const originShots = {};
  const shoot = async function (label, key) {
    shots[key] = await shootCell(page, component.name, label, MARGIN);
    samplePaint(states[key], shots[key]);
    if (originSelector !== null && states[key] && states[key][origin] && states[key][origin].visible === true) {
      // No margin: the part's own pixels are compared, without the backdrop
      // that differs under it (a fixed layer's, a top-layered element's)
      originShots[key] = await shootPart(page, component.name, label, originSelector, 0);
    }
  };
  for (const label of Object.keys(rest)) {
    states[label] = rest[label];
    await shoot(label, label);
  }
  const target = reference.target;
  if (!target) {
    return { states: states, shots: shots, originShots: originShots };
  }
  const enabled = component.sample.filter(function (entry) {
    return !(entry.props && entry.props.disabled === true) && rest[entry.label] !== undefined;
  });
  // A reference may declare its own interaction list (an `open` pass clicks
  // the target and measures the opened popup)
  const interactions = Array.isArray(reference.interactions) ? reference.interactions : INTERACTIONS;
  for (const entry of enabled) {
    for (const interaction of interactions) {
      const selector = interaction === 'focus' && target[side + 'Focus'] ? target[side + 'Focus'] : target[side];
      if (!await enterInteraction(page, component.name, entry.label, selector, interaction)) {
        continue;
      }
      const key = entry.label + ' @' + interaction;
      const read = await readParts(page, component.name, parts, side, origin, { extended: true, only: entry.label });
      states[key] = read[entry.label];
      await shoot(entry.label, key);
      await leaveInteraction(page);
    }
  }

  return { states: states, shots: shots, originShots: originShots };

}


/********************************************************************
Run one row against one reference under one scheme.

@param {Object} page      - Playwright page
@param {Object} component - Discovered component with a reference
@param {String} set       - 'primary' | 'second'
@param {String} scheme    - 'light' | 'dark'

@return {Promise<Object>} - { lines, perceptual, states, unmeasured, errors, upstream, ours }
*********************************************************************/
export async function runFidelity (page, component, set, scheme) {

  const reference = set === 'second' ? component.reference.second : component.reference;
  // The omissions masked out of the pixels, measured by the primary part's selector on our side
  const omit = set === 'second' ? (reference.omit || {}) : {};
  const masks = Object.fromEntries(Object.keys(omit).filter(function (name) {
    return omit[name].mask === true;
  }).map(function (name) {
    return [name, component.reference.parts[name]];
  }));
  const status = await openReference(page, component.name, set, scheme);
  const upstream = await collect(page, component, reference, 'upstream');
  const opened = await openShowcase(page, TEMPLATE[set], component.name, { measure: true, scheme: scheme });
  const ours = await collect(page, component, reference, 'ours', masks);
  const anchor = ANCHOR[component.name];

  // Properties: the CSS of a ring or a shadow is left to the pixels, and so are
  // the anchor's borders while a ring may be drawn with them
  // and a text color where both sides read its ink (the color with the opacity it is painted at)
  const ringParts = RING_PARTS[component.name] || [];
  const skip = function (state, part, property, o, u) {
    return PIXEL_PROPERTIES.includes(property) ||
      (state.includes(' @') && ringParts.includes(part) && RING_BORDER.includes(property)) ||
      (property === 'color' && o.ink !== undefined && u.ink !== undefined);
  };
  const lines = findDisagreements(ours.states, upstream.states, reference.parts, ['paint', 'ink'], skip);

  // Pixels: the ring and shadow profile at the anchor, and the perceptual ratio
  const perceptual = {};
  const shots = {};
  for (const key of Object.keys(upstream.shots)) {
    if (!(upstream.shots[key] && ours.shots[key])) {
      continue;
    }
    if (anchor && ours.states[key] && upstream.states[key]) {
      for (const line of compareProfiles(profileOf(ours.states[key][anchor], ours.shots[key]), profileOf(upstream.states[key][anchor], upstream.shots[key]))) {
        lines.push(key + ' / ' + anchor + ' pixels: ' + line);
      }
    }
    // A reference whose component is one part alone is compared within that part
    const masked = maskOmitted(ours.shots[key], upstream.shots[key], ours.states[key] || {}, Object.keys(masks), anchor);
    for (const line of masked.lines) {
      lines.push(key + ' / ' + line);
    }
    const crop = reference.origin && ours.states[key] && upstream.states[key] && ours.states[key][reference.origin] && upstream.states[key][reference.origin];
    // A part painted outside its cell - a fixed layer or a top-layered
    // upstream element - is out of the cell shot's reach; each side's own
    // element shot compares its pixels instead
    const escapes = function (shot, part) {
      if (!shot || !part || part._bodyX === undefined) {
        return false;
      }
      const image = shot instanceof PNG ? shot : PNG.sync.read(shot);
      return part._bodyX < -MARGIN || part._bodyY < -MARGIN ||
        MARGIN + part._bodyX + part.width > image.width || MARGIN + part._bodyY + part.height > image.height;
    };
    let a;
    let b;
    // A reference may ask for the origin's own shot outright (`originPixels`):
    // its cell region cannot hold the component's pixels by construction
    const elementCompare = reference.originPixels === true ||
      escapes(upstream.shots[key], upstream.states[key] && upstream.states[key][reference.origin]) ||
      escapes(masked.shot, ours.states[key] && ours.states[key][reference.origin]);
    if (crop && elementCompare && ours.originShots[key] && upstream.originShots[key]) {
      const maskedOurs = maskOmitted(ours.originShots[key], upstream.originShots[key], ours.states[key] || {}, Object.keys(masks), anchor, ours.states[key][reference.origin], 0);
      for (const line of maskedOurs.lines) {
        lines.push(key + ' / ' + line);
      }
      a = maskedOurs.shot;
      b = upstream.originShots[key];
    } else {
      a = crop ? cropTo(masked.shot, ours.states[key][reference.origin]) : masked.shot;
      b = crop ? cropTo(upstream.shots[key], upstream.states[key][reference.origin]) : upstream.shots[key];
    }
    perceptual[key] = Math.round(perceptualRatio(a, b) * 10000) / 100;
    shots[key] = { ours: a, upstream: b };
  }

  return {
    lines: lines,
    perceptual: perceptual,
    shots: shots,
    states: Object.keys(upstream.states).length,
    unmeasured: status.unmeasured,
    errors: status.errors.concat(opened.status.errors),
    upstream: upstream.states,
    ours: ours.states
  };

}
