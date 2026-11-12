// Info: EmptyState sample states for the showcase, the browser gates and
// the docs. Mirrors `recipes/probe/EmptyState.mount.js`: the same texts, the
// action and link only in `actions`, an 80 x 80 single-color image (the
// reference draws the same source, so both pages paint one image).
// The root is a block-level flex box that fills its container, the probe's 400
export const FRAME = Object.freeze({ width: 400 });
const ACTION = { kind: 'tertiary', onClick: function () {}, text: 'Create new' };
const LINK = { href: '#', text: 'View documentation' };
// The svg stays unencoded: react-native-web encodes an `svg+xml;utf8` data
// URI itself (`exports/Image/index.js:32,123`), and an encoded one drew
// nothing (U2 run 2)
const IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80"><rect width="80" height="80" fill="gray"/></svg>';
const BASE = { subtitle: 'Click Upload assets to upload your data', title: 'Start by adding data assets' };
export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze(Object.assign({ size: 'lg' }, BASE)) }),
  Object.freeze({ label: 'small', props: Object.freeze(Object.assign({ size: 'sm' }, BASE)) }),
  Object.freeze({ label: 'actions', props: Object.freeze(Object.assign({ action: ACTION, link: LINK, size: 'lg' }, BASE)) }),
  Object.freeze({ label: 'illustration', props: Object.freeze(Object.assign({ illustration: IMAGE, illustrationAlt: 'Illustration', size: 'lg' }, BASE)) }),
  Object.freeze({ label: 'illustrationSmall', props: Object.freeze(Object.assign({ illustration: IMAGE, illustrationAlt: 'Illustration', size: 'sm' }, BASE)) }),
  Object.freeze({ label: 'illustrationLeft', props: Object.freeze(Object.assign({ illustration: IMAGE, illustrationAlt: 'Illustration', illustrationPosition: 'left', size: 'lg' }, BASE)) })
]);
