// Info: The comparison both the measurement gate and the fidelity census use:
// one measured value against the upstream's (numbers and pixel lengths
// within half a pixel, colours, families and keywords exactly), and every
// disagreement between two measured states. Not product code.

const TOLERANCE = 0.5;


/********************************************************************
Compare one measured value.

@param {String} property - Style property or geometry key
@param {*}      ours     - Our value
@param {*}      upstream - The upstream value
@param {Number} slack    - Extra tolerance for this comparison (default 0)

@return {Boolean} - True when they agree
*********************************************************************/
export function agrees (property, ours, upstream, slack) {

  // Letter spacing 'normal' is zero tracking
  const normal = function (value) {
    return property === 'letterSpacing' && value === 'normal' ? '0px' : value;
  };
  const a = normal(ours);
  const b = normal(upstream);

  // A sampled paint agrees within three levels per channel (antialiasing and colour rounding)
  if (property === 'paint') {
    const channels = function (value) {
      return String(value).match(/[0-9.]+/g).map(Number);
    };
    return channels(a).slice(0, 3).every(function (value, index) {
      return Math.abs(value - channels(b)[index]) <= 3;
    });
  }

  // Numbers and pixel lengths agree within the tolerance
  const isLength = function (value) {
    return typeof value === 'number' || /^-?[0-9.]+(px)?$/.test(String(value));
  };
  if (isLength(a) && isLength(b)) {
    return Math.abs(parseFloat(a) - parseFloat(b)) <= TOLERANCE + (slack || 0);
  }

  // Colors, families and keywords agree exactly
  return String(a) === String(b);

}


/********************************************************************
Every disagreement between our measurements and the upstream's.

@param {Object} ours     - state -> part -> measurement
@param {Object} upstream - state -> part -> measurement
@param {Object} parts    - The part definitions (for `compare` subsets)
@param {Array}  [extra]  - Properties compared on every part where both sides read them,
                           beyond its `compare` subset (the census adds paint, ink, shadow)

@return {Array} - One line per disagreement
*********************************************************************/
export function findDisagreements (ours, upstream, parts, extra) {

  const lines = [];
  for (const state of Object.keys(upstream)) {
    if (ours[state] === undefined) {
      lines.push(state + ': rendered upstream but not here');
      continue;
    }
    for (const part of Object.keys(upstream[state])) {
      const u = upstream[state][part];
      const o = ours[state][part];
      const uDrawn = u !== null && u.visible === true;
      const oDrawn = o !== null && o !== undefined && o.visible === true;
      if (!uDrawn && !oDrawn) {
        continue;
      }
      // An `optional` part is one the upstream draws only in some states on an element of its
      // own, while ours is always one element: it is compared where the upstream draws it
      if (!uDrawn && parts[part].optional === true) {
        continue;
      }
      if (uDrawn !== oDrawn) {
        lines.push(state + ' / ' + part + ': ' + (oDrawn ? 'drawn here, not upstream' : 'drawn upstream, not here'));
        continue;
      }
      const added = (extra || []).filter(function (property) {
        return u[property] !== undefined && o[property] !== undefined && !(parts[part].compare || []).includes(property);
      });
      const compared = (parts[part].compare ? parts[part].compare.concat(added) : Object.keys(u)).filter(function (property) {
        return property !== 'visible' && property !== 'characters' && property.charAt(0) !== '_';
      });
      // A text's width is compared net of a tracking difference, which is reported on its own:
      // a reference that draws no tracking still has to place and size the text where we do.
      // A box that grows with a text part (`grows`) takes that text's slack
      const trackingOf = function (textPart) {
        const ot = ours[state][textPart];
        const ut = upstream[state][textPart];
        return ot && ut && ut.characters !== undefined
          ? Math.abs(parseFloat(ot.letterSpacing === 'normal' ? 0 : ot.letterSpacing) - parseFloat(ut.letterSpacing === 'normal' ? 0 : ut.letterSpacing)) * ut.characters
          : 0;
      };
      const tracking = u.characters !== undefined ? trackingOf(part) : parts[part].grows ? trackingOf(parts[part].grows) : 0;
      for (const property of compared) {
        // A border color is compared only where a border is drawn
        const undrawn = property === 'borderBottomColor' && parseFloat(o.borderBottomWidth) === 0 && parseFloat(u.borderBottomWidth) === 0;
        const slack = property === 'width' && tracking > 0 ? tracking : 0;
        if (!undrawn && !agrees(property, o[property], u[property], slack)) {
          lines.push(state + ' / ' + part + ' / ' + property + ': ' + o[property] + ' here, ' + u[property] + ' upstream');
        }
      }
    }
  }

  return lines;

}
