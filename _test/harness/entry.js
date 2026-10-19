// Info: Browser showcase entry, bundled by esbuild for the Playwright gates.
// Builds one component system per template with the real frameworks (React,
// react-native-web, react-native-svg) exactly as a web host would, and
// renders every component's sample states in a labelled grid. The URL picks
// the template and its scheme: /?template=default|carbon|material and
// &scheme=light|dark (each template's own light and dark scheme; a dark page
// is painted in the scheme's background). Nothing here is product code; it is
// the page the browser gates measure.

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
import { frames, references, rows, samples } from './manifest.js';
import { createSampleElement } from './sample.js';

// Template -> scheme name -> scheme
const TEMPLATES = {
  default: { light: defaultProfile.schemes.light, dark: defaultProfile.schemes.dark },
  carbon: { light: carbonProfile.schemes.white, dark: carbonProfile.schemes.g100 },
  material: { light: materialProfile.schemes.light, dark: materialProfile.schemes.dark }
};

const params = new URLSearchParams(window.location.search);
const templateName = params.get('template') || 'default';
const schemeName = params.get('scheme') === 'dark' ? 'dark' : 'light';
const only = params.get('component');
// Measurement mode lays each cell body out as the reference page does
const measuring = params.get('measure') === '1';
// Sheet mode keeps the measurement layout but lets a row grow to its cell,
// so a tall cell's content never draws into the next cell's slot
const sheeting = params.get('sheet') === '1';
// A measurement page renders unhosted, as the upstream it is compared
// with does: its layer is viewport-relative, not confined to a stage
const hosting = params.get('hosted') !== '0';

const Utils = utils({});
const Debug = debug({ Utils: Utils }, { LOG_LEVEL: 'error' });
const Themer = themer({ Utils: Utils, Debug: Debug });
const Lib = { React: React, ReactNative: ReactNative, Svg: Svg, Utils: Utils, Debug: Debug, Themer: Themer };

const status = { template: templateName, scheme: schemeName, ready: false, errors: [], cells: 0, components: Object.keys(factories) };
window.__showcase = status;

window.addEventListener('error', function (event) {
  status.errors.push(String(event.message));
});

let Registry;
try {
  const built = Themer.buildTheme(TEMPLATES[templateName][schemeName], [], 'native');
  // The page paints the scheme's background behind every cell, as the
  // reference page does for a system whose surface is not white
  document.body.style.background = built.tokens['color.background'];
  if (schemeName === 'dark') {
    // The page declares its scheme so platform chrome (focus rings, scrollbars)
    // resolves the same dark user-agent colors the upstream's does
    document.documentElement.style.colorScheme = 'dark';
  }
  // The built tokens the page draws with, for a gate that samples pixels against them
  status.theme = built.tokens;
  Registry = createSystem(Lib, {}, built, 'md', factories);
} catch (error) {
  status.errors.push('createSystem: ' + error.message);
}

/********************************************************************
The cell body style: in measurement mode a component whose reference
fills its container gets a block body of the reference's width on both
pages; otherwise a component whose sample names a frame is laid out in
it, as every host's showcase does; every other body keeps the
shrink-to-fit layout. A frame with `stage` also makes the body the
containing block of a fixed layer, so an overlay component paints its
layer inside the cell it was mounted in.

@param {Object} frame - { width, height?, stage? }

@return {Object} - Inline style
*********************************************************************/
function frameStyle (frame) {

  const style = { display: 'block', width: frame.width + 'px' };
  if (typeof frame.height === 'number') {
    style.height = frame.height + 'px';
  }
  if (frame.stage === true) {
    style.transform = 'translateZ(0)';
  }
  return style;

}

function bodyStyle (name) {

  const reference = references[name];
  if (measuring && reference && reference.body) {
    return frameStyle(reference.body);
  }
  if (frames[name]) {
    return frameStyle(frames[name]);
  }

  return undefined;

}

function Cell (props) {

  // A state's `wrappers` mount around the component, first entry
  // outermost; a staged cell then renders that inside the overlay host,
  // as every host's showcase does: the body is the stage (its frame's
  // width and height) and the layer covers it. A measurement page opens
  // unhosted
  const frame = frames[props.name];
  const content = hosting && frame !== null && frame !== undefined && frame.stage === true
    ? React.createElement(Registry.OverlayHost, null, createSampleElement(React, Registry, props.name, props.state))
    : createSampleElement(React, Registry, props.name, props.state);

  return React.createElement('div', {
    className: 'cell',
    'data-component': props.name,
    'data-family': rows[props.name].family,
    'data-state': props.state.label,
    'data-template': templateName
  },
  React.createElement('div', { className: 'cell-label' }, props.name + ' / ' + props.state.label),
  React.createElement('div', { className: 'cell-body', 'data-part': 'body', style: bodyStyle(props.name) },
    content));

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

  return React.createElement('div', { id: 'showcase', className: measuring ? (sheeting ? 'measure sheet' : 'measure') : undefined, 'data-template': templateName },
    Object.keys(families).sort().map(function (family) {
      return React.createElement('section', { key: family, className: 'family', 'data-family': family },
        React.createElement('h2', null, family),
        React.createElement('div', { className: 'grid' },
          families[family].flatMap(function (name) {
            return (samples[name] || []).filter(function (state) {
              return state.cell !== false;
            }).map(function (state) {
              return React.createElement(Cell, { key: name + '/' + state.label, name: name, state: state });
            });
          })));
    }));

}

if (Registry) {
  const root = createRoot(document.getElementById('root'));
  const content = React.createElement(Showcase);
  // Match the consumer's RootHost when reviewing layers across adjacent cells.
  root.render(params.get('rootHost') === '1'
    ? React.createElement(Registry.OverlayHost, null, content)
    : content);
  // Ready once rendered and every font the rendered text asked for has loaded
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      document.fonts.ready.then(function () {
        const cells = document.querySelectorAll('.cell');
        status.cells = cells.length;
        status.fonts = Array.from(document.fonts).filter(function (face) {
          return face.status === 'loaded';
        }).map(function (face) {
          return face.family.replace(/"/g, '') + ' ' + face.weight;
        });
        // A sheet row grows to its cell; topping the cell up to a whole
        // pixel keeps every following row's start on the pixel grid
        if (sheeting) {
          for (const cell of cells) {
            cell.style.minHeight = Math.ceil(cell.getBoundingClientRect().height) + 'px';
          }
        }
        // An indeterminate animation pauses at its first frame, so the
        // measured and screenshotted frame is the same every time
        document.documentElement.getAnimations({ subtree: true }).forEach(function (animation) {
          if (animation.effect.getComputedTiming().iterations === Infinity) {
            animation.currentTime = 0;
            animation.pause();
          }
        });
        status.ready = true;
      });
    });
  });
} else {
  status.ready = true;
}
