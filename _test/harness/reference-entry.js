// Info: Reference page entry, bundled by esbuild for the measurement gates.
// Renders, for every component with a `reference.js`, each sample state
// through `reference.mount(React, upstream, props)`: `render-web` rows mount
// the upstream web component under its stylesheet; `parse-rn` rows mount the
// upstream React Native component through react-native-web, so its style
// objects are what the page draws. With `?set=second` the page mounts the
// second reference instead (`reference.second.mount`): the Material web
// components, themed from the material template through the template's own
// mapping table, so a color comparison tests the mapping and not two
// palettes. `&scheme=dark` mounts the dark scheme of each reference: the
// primary inside its own darkest zone, the second themed from the material
// template's dark scheme, on a page painted in that scheme's background.
// Cells mirror the showcase (`.cell`, `data-component`,
// `data-state`, `[data-part=body]`) so one reader measures both pages. A
// state whose `mount` returns null is marked unmeasured.
// Not product code; the page the measurement gates compare against.

import React from 'react';
import { createRoot } from 'react-dom/client';
import * as WebUpstream from '@carbon/react';
import * as UpstreamIcons from '@carbon/icons-react';
import { Text as NativeText } from '@carbon/react-native/lib/module/components/Text/index.js';
import { getColor } from '@carbon/react-native/lib/module/styles/colors.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/checkbox/checkbox.js';
import '@material/web/textfield/outlined-text-field.js';
import '@material/web/select/outlined-select.js';
import '@material/web/select/select-option.js';
import utils from 'helper-utils';
import debug from 'helper-debug';
import themer from 'helper-themer';
import materialProfile from 'helper-themer-template-material';
// The template's own mapping table is not an export of the package; the page reads the file
import materialMapping from '../node_modules/helper-themer-template-material/data/mapping.js';

import { references, rows, samples } from './manifest.js';
import ICONS from '../../data/icons.json';

/********************************************************************
The upstream's icon component for a semantic icon name
(`warning_filled` -> `warning--filled` -> `WarningFilled`).

@param {String} name - Semantic icon name, a key of data/icons.json

@return {Function} - Icon component
*********************************************************************/
function icon (name) {

  const upstreamName = ICONS.icons[name].carbon.split('-').filter(Boolean).map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');

  return UpstreamIcons[upstreamName];

}

const UPSTREAM = {
  'render-web': Object.assign({}, WebUpstream, { icon: icon }),
  'parse-rn': { Text: NativeText, getColor: getColor }
};

const params = new URLSearchParams(window.location.search);
const only = params.get('component');
const set = params.get('set') === 'second' ? 'second' : 'primary';
const schemeName = params.get('scheme') === 'dark' ? 'dark' : 'light';
// The primary's darkest zone, and the mobile upstream's own dark theme
const PRIMARY_DARK_ZONE = 'cds--g100';
if (schemeName === 'dark') {
  UPSTREAM['parse-rn'] = Object.assign({}, UPSTREAM['parse-rn'], {
    getColor: function (token) {
      return getColor(token, 'dark');
    }
  });
}


/********************************************************************
The custom properties that theme the Material web components from the
material template: for every Material color the mapping table names, the
template's value of the first key it answers (`--md-sys-color-primary`
from `color.interactive`, and so on).

@return {Object} - Style object of custom properties
*********************************************************************/
function buildMaterialTheme () {

  const Lib = {};
  Lib.Utils = utils(Lib, {});
  Lib.Debug = debug(Lib, {});
  const Themer = themer(Lib, {});
  const tokens = Themer.buildTheme(materialProfile.schemes[schemeName], [], 'native').tokens;
  MATERIAL_TOKENS.tokens = tokens;
  const style = {};
  for (const materialName of Object.keys(materialMapping.color)) {
    const key = [].concat(materialMapping.color[materialName])[0];
    if (tokens[key] !== undefined) {
      style['--md-sys-color-' + materialName.replace(/_/g, '-')] = tokens[key];
    }
  }

  return style;

}

// The second mount receives the material template's built tokens, for the values the reference does not set itself
const MATERIAL_TOKENS = { tokens: {} };
const MATERIAL_THEME = set === 'second' ? buildMaterialTheme() : {};
if (schemeName === 'dark' && set === 'second') {
  document.body.style.background = MATERIAL_TOKENS.tokens['color.background'];
}

const status = { ready: false, errors: [], cells: 0, unmeasured: [] };
window.__reference = status;

window.addEventListener('error', function (event) {
  status.errors.push(String(event.message));
});


/********************************************************************
One reference cell.

@param {Object} props - { name, state }

@return {Object} - React element
*********************************************************************/
function Cell (props) {

  const reference = set === 'second' ? references[props.name].second : references[props.name];
  const element = set === 'second'
    ? reference.mount(React, MATERIAL_TOKENS, props.state.props)
    : reference.mount(React, UPSTREAM[reference.kind], props.state.props);
  if (element === null) {
    status.unmeasured.push(props.name + '/' + props.state.label);
    return null;
  }
  const body = reference.body ? { display: 'block', width: reference.body.width + 'px' } : undefined;

  return React.createElement('div', {
    className: 'cell',
    'data-component': props.name,
    'data-family': rows[props.name].family,
    'data-state': props.state.label
  },
  React.createElement('div', { className: 'cell-label' }, props.name + ' / ' + props.state.label),
  React.createElement('div', { className: 'cell-body', 'data-part': 'body', style: body }, element));

}


/********************************************************************
Every referenced component's states.

@return {Object} - React element
*********************************************************************/
function Reference () {

  const names = Object.keys(references).filter(function (name) {
    return (!only || name === only) && (set === 'primary' || references[name].second !== undefined);
  });

  const zone = set === 'primary' && schemeName === 'dark' ? PRIMARY_DARK_ZONE : '';
  return React.createElement('div', { id: 'reference', className: ('measure ' + zone).trim(), 'data-set': set, 'data-scheme': schemeName, style: MATERIAL_THEME }, names.map(function (name) {
    return React.createElement('section', { key: name, className: 'family', 'data-family': rows[name].family },
      React.createElement('h2', null, name),
      React.createElement('div', { className: 'grid' }, (samples[name] || []).map(function (state) {
        return React.createElement(Cell, { key: state.label, name: name, state: state });
      })));
  }));

}


createRoot(document.getElementById('root')).render(React.createElement(Reference));
requestAnimationFrame(function () {
  requestAnimationFrame(function () {
    // Ready once fonts are loaded and no animation (a floating label rising
    // after the value arrives) has run for two consecutive checks
    document.fonts.ready.then(function () {
      // Animations inside shadow roots are not all listed by the document, so a settle time precedes the checks
      return new Promise(function (resolve) {
        setTimeout(resolve, 600);
      });
    }).then(function () {
      let quiet = 0;
      const check = function () {
        const running = document.getAnimations().filter(function (animation) {
          return animation.playState === 'running';
        }).length;
        quiet = running === 0 ? quiet + 1 : 0;
        if (quiet >= 2) {
          // A dark primary paints the page in its zone's background
          if (set === 'primary' && schemeName === 'dark') {
            document.body.style.background = getComputedStyle(document.getElementById('reference')).backgroundColor;
          }
          status.cells = document.querySelectorAll('.cell').length;
          status.ready = true;
          return;
        }
        setTimeout(check, 50);
      };
      check();
    });
  });
});
