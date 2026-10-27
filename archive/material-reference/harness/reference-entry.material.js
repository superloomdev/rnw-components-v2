// Source: _test/harness/reference-entry.js (Material parts, verbatim from 7f2bd93)

// --- _test/harness/reference-entry.js:6-11 ---
// objects are what the page draws. With `?set=second` the page mounts the
// second reference instead (`reference.second.mount`): the Material web
// components, themed with the system colors of the material template's
// scheme (the scheme its role cells were read from), so a color comparison
// tests the cells and not two palettes. `&scheme=dark` mounts the dark scheme of each reference: the
// primary inside its own darkest zone, the second themed from the material

// --- _test/harness/reference-entry.js:26-62 ---
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/fab/fab.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/iconbutton/filled-icon-button.js';
import '@material/web/iconbutton/filled-tonal-icon-button.js';
import '@material/web/iconbutton/outlined-icon-button.js';
import '@material/web/tabs/tabs.js';
import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/secondary-tab.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/chips/assist-chip.js';
import '@material/web/chips/input-chip.js';
import '@material/web/chips/filter-chip.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import '@material/web/progress/linear-progress.js';
import '@material/web/progress/circular-progress.js';
import '@material/web/radio/radio.js';
import '@material/web/switch/switch.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/divider/divider.js';
import '@material/web/dialog/dialog.js';
import '@material/web/slider/slider.js';
import utils from 'helper-utils';
import debug from 'helper-debug';
import themer from 'helper-themer';
import carbonProfile from 'helper-themer-template-carbon';
import materialProfile from 'helper-themer-template-material';

// --- _test/harness/reference-entry.js:119-119 ---
const set = params.get('set') === 'second' ? 'second' : 'primary';

// --- _test/harness/reference-entry.js:130-164 ---


/********************************************************************
The custom properties that theme the Material web components from the
material template: every Material system color of the scheme
(`system_colors`), so the reference draws with exactly the scheme the
template's role cells were read from.

@return {Object} - Style object of custom properties
*********************************************************************/
function buildMaterialTheme () {

  const Lib = {};
  Lib.Utils = utils(Lib, {});
  Lib.Debug = debug(Lib, {});
  const Themer = themer(Lib, {});
  const tokens = Themer.buildTheme(materialProfile.schemes[schemeName], [], 'native').tokens;
  MATERIAL_TOKENS.tokens = tokens;
  // Every Material system color of the scheme the template's cells were read from
  const style = {};
  const system = materialProfile.schemes[schemeName].system_colors;
  for (const role of Object.keys(system)) {
    style['--md-sys-color-' + role] = system[role];
  }

  return style;

}

// The second mount receives the material template's built tokens, for the values the reference does not set itself
const MATERIAL_TOKENS = { tokens: {} };
const MATERIAL_THEME = set === 'second' ? buildMaterialTheme() : {};
if (set === 'second') {
  // The page paints the material scheme's background behind every cell, as the showcase does
  document.body.style.background = MATERIAL_TOKENS.tokens['color.background'];

// --- _test/harness/reference-entry.js:194-203 ---
  const reference = set === 'second' ? references[props.name].second : references[props.name];
  // `referenceProps` are fixture metadata for this adapter alone - the
  // upstream prop names where ours differ (labelText versus label). Real
  // consumers keep `props`; nothing here is a component prop
  const mountProps = props.state.referenceProps === undefined
    ? props.state.props
    : Object.assign({}, props.state.props, props.state.referenceProps);
  let element = set === 'second'
    ? reference.mount(React, MATERIAL_TOKENS, mountProps)
    : reference.mount(React, UPSTREAM[reference.kind], mountProps);

// --- _test/harness/reference-entry.js:259-264 ---
    return (!only || name === only) && (set === 'primary' || references[name].second !== undefined);
  });

  const zone = set === 'primary' && schemeName === 'dark' ? PRIMARY_DARK_ZONE : '';
  return React.createElement('div', { id: 'reference', className: ('measure ' + zone).trim(), 'data-set': set, 'data-scheme': schemeName, style: MATERIAL_THEME }, names.map(function (name) {
    return React.createElement('section', { key: name, className: 'family', 'data-family': rows[name].family },

// --- _test/harness/reference-entry.js:296-300 ---
          // An indeterminate animation pauses at its first frame, so the
          // measured and screenshotted frame is the same every time; the
          // subtree option does not enter shadow roots, so the second
          // system's arcs (animated inside one) are collected by hand
          const animations = Array.from(document.documentElement.getAnimations({ subtree: true }));
