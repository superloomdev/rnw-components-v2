// Info: Reference page entry, bundled by esbuild for the measurement gates.
// Renders, for every component with a `reference.js`, each sample state
// through `reference.mount(React, upstream, props)`: `render-web` rows mount
// the upstream web component under its stylesheet; `parse-rn` rows mount the
// upstream React Native component through react-native-web, so its style
// objects are what the page draws. Cells mirror the showcase (`.cell`,
// `data-component`, `data-state`, `[data-part=body]`) so one reader measures
// both pages. A state whose `mount` returns null is marked unmeasured.
// Not product code; the page the measurement gates compare against.

import React from 'react';
import { createRoot } from 'react-dom/client';
import * as WebUpstream from '@carbon/react';
import * as UpstreamIcons from '@carbon/icons-react';
import { Text as NativeText } from '@carbon/react-native/lib/module/components/Text/index.js';
import { getColor } from '@carbon/react-native/lib/module/styles/colors.js';

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

  const reference = references[props.name];
  const element = reference.mount(React, UPSTREAM[reference.kind], props.state.props);
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
    return !only || name === only;
  });

  return React.createElement('div', { id: 'reference', className: 'measure' }, names.map(function (name) {
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
    document.fonts.ready.then(function () {
      status.cells = document.querySelectorAll('.cell').length;
      status.ready = true;
    });
  });
});
