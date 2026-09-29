// Info: Browser showcase entry, bundled by esbuild for the Playwright gates.
// Builds one component system per template with the real frameworks (React,
// react-native-web, react-native-svg) exactly as a web host would, and
// renders every component's sample states in a labelled grid. The URL picks
// the template: /?template=default|carbon|material. Nothing here is product
// code; it is the page the browser gates measure.

import React from 'react';
import { createRoot } from 'react-dom/client';
import * as ReactNative from 'react-native';
import * as Svg from 'react-native-svg';
import utils from 'helper-utils';
import debug from 'helper-debug';
import themer from 'helper-themer';
import defaultProfile from 'helper-themer-template-default';
import carbonProfile from 'helper-themer-template-carbon';
import materialProfile from 'helper-themer-template-material';

import { createSystem } from 'rnw-components';
import * as factories from 'rnw-components/all';
import { rows, samples } from './manifest.js';

const TEMPLATES = {
  default: defaultProfile.schemes.light,
  carbon: carbonProfile.schemes.white,
  material: materialProfile.schemes.light
};

const params = new URLSearchParams(window.location.search);
const templateName = params.get('template') || 'default';
const only = params.get('component');

const Utils = utils({});
const Debug = debug({ Utils: Utils }, { LOG_LEVEL: 'error' });
const Themer = themer({ Utils: Utils, Debug: Debug });
const Lib = { React: React, ReactNative: ReactNative, Svg: Svg, Utils: Utils, Debug: Debug, Themer: Themer };

const status = { template: templateName, ready: false, errors: [], cells: 0, components: Object.keys(factories) };
window.__showcase = status;

window.addEventListener('error', function (event) {
  status.errors.push(String(event.message));
});

let Registry;
try {
  const built = Themer.buildTheme(TEMPLATES[templateName], [], 'native');
  Registry = createSystem(Lib, {}, built, 'md', factories);
} catch (error) {
  status.errors.push('createSystem: ' + error.message);
}

function Cell (props) {

  const Component = Registry[props.name];

  return React.createElement('div', {
    className: 'cell',
    'data-component': props.name,
    'data-family': rows[props.name].family,
    'data-state': props.state.label,
    'data-template': templateName
  },
  React.createElement('div', { className: 'cell-label' }, props.name + ' / ' + props.state.label),
  React.createElement('div', { className: 'cell-body', 'data-part': 'body' },
    React.createElement(Component, props.state.props)));

}

function Showcase () {

  const names = Object.keys(factories).filter(function (name) {
    return !only || name === only;
  });
  const families = {};
  for (const name of names) {
    const family = rows[name].family;
    families[family] = families[family] || [];
    families[family].push(name);
  }

  return React.createElement('div', { id: 'showcase', 'data-template': templateName },
    Object.keys(families).sort().map(function (family) {
      return React.createElement('section', { key: family, className: 'family', 'data-family': family },
        React.createElement('h2', null, family),
        React.createElement('div', { className: 'grid' },
          families[family].flatMap(function (name) {
            return (samples[name] || []).map(function (state) {
              return React.createElement(Cell, { key: name + '/' + state.label, name: name, state: state });
            });
          })));
    }));

}

if (Registry) {
  const root = createRoot(document.getElementById('root'));
  root.render(React.createElement(Showcase));
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      status.cells = document.querySelectorAll('.cell').length;
      status.ready = true;
    });
  });
} else {
  status.ready = true;
}
