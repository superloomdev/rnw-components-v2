// Info: Shared helpers of the Header family's tests (Plan 0162 U5): the
// templates, a registry per template, an event fired inside `act`, a
// window of a given width for the rules read from it, and a sample state
// mounted with its wrappers.

import { act } from 'react';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, render } from './harness/render.js';
import { createSampleElement } from './harness/sample.js';

export const TEMPLATE_NAMES = Object.keys(TEMPLATES).concat('shapes');

// The banner landmark react-native-web draws for `role: 'banner'`
export const BAR = 'header, [role="banner"]';


/********************************************************************
A selector inside the banner, for either element the landmark is.

@param {String} selector - Selector relative to the banner

@return {String} - The selector under both forms
*********************************************************************/
export function inBar (selector) {

  return 'header ' + selector + ', [role="banner"] ' + selector;

}


/********************************************************************
The registry of one template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
export function registryFor (template) {

  return buildSystem(template, factories);

}


/********************************************************************
Dispatch an event inside `act`.

@param {Object} element - DOM element
@param {Object} event   - The event

@return {Promise}
*********************************************************************/
export async function fire (element, event) {

  await act(async function () {
    element.dispatchEvent(event);
  });

}


/********************************************************************
Run a body with the window this wide, then restore it.

@param {Number}   width - The window width
@param {Function} body  - Async body

@return {Promise}
*********************************************************************/
export async function atWindow (width, body) {

  const before = window.innerWidth;
  Object.defineProperty(window, 'innerWidth', { configurable: true, value: width, writable: true });
  try {
    await body();
  } finally {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: before, writable: true });
  }

}


/********************************************************************
The window widths either side of a breakpoint, from the built theme.

@param {String} breakpoint - `md` or `lg`

@return {Object} - { below, above }
*********************************************************************/
export function sides (breakpoint) {

  const t = buildNative('carbon').tokens;
  return { below: t['breakpoint.' + breakpoint] - 1, above: t['breakpoint.' + breakpoint] + 224 };

}


/********************************************************************
Render a sample state of a component with its wrappers.

@param {Object} Registry - The registry
@param {String} name     - Component name
@param {Object} state    - Sample state

@return {Promise<Object>} - The container
*********************************************************************/
export async function renderSample (Registry, name, state) {

  return render(createSampleElement(React, Registry, name, state));

}
