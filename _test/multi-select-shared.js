// Info: Shared test helpers for the multiple-choice field owners: render
// one field and return its named parts, drive text input and keydown the
// way a user does, and build a registry per template.

import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/select/sample.multi-select.js';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, render } from './harness/render.js';

export { React, act };
export const TEMPLATE_NAMES = Object.keys(TEMPLATES);
export { SAMPLE };
// The default size is the control role; the other sizes follow the shared size scale
export const HEIGHTS = { sm: 'size.size_small', md: 'control.field_height', lg: 'size.size_large' };
export const ITEMS = SAMPLE[0].props.items;
export const OWNERS = [
  { name: 'MultiSelect', prefix: 'multi-select' },
  { name: 'FilterableMultiSelect', prefix: 'filterable-multi-select' }
];


/********************************************************************
Build a registry for a template.

@param {String} template  - Template name
@param {Object} overrides - Token name -> value

@return {Object} - Registry
*********************************************************************/
export function registryFor (template, overrides) {

  const built = buildNative(template);
  const tokens = Object.assign({}, built.tokens, overrides || {});

  return buildSystem(template, factories, { built: Object.assign({}, built, { tokens: tokens }) });

}


/********************************************************************
Render one multiple-choice field and return its parts.

@param {Object} Registry - Registry
@param {String} owner    - 'MultiSelect' | 'FilterableMultiSelect'
@param {Object} props    - Props

@return {Promise<Object>} - The named parts
*********************************************************************/
export async function renderField (Registry, owner, props) {

  const prefix = owner === 'FilterableMultiSelect' ? 'filterable-multi-select' : 'multi-select';
  const container = await render(React.createElement(Registry[owner], props));
  const root = container.firstElementChild;
  const at = function (name) {
    return root.querySelector('[data-testid="' + prefix + '-' + name + '"]');
  };

  // Parts that mount or unmount with state are lazy lookups, not a snapshot
  return {
    container: container,
    root: root,
    get label() {
      return at('label');
    },
    get frame() {
      return at('frame');
    },
    get trigger() {
      return at('trigger');
    },
    get value() {
      return at('value');
    },
    get caret() {
      return at('caret');
    },
    get invalidIcon() {
      return at('invalid');
    },
    get count() {
      return at('count');
    },
    get message() {
      return at('message');
    },
    get live() {
      return root.querySelector('[aria-live="polite"]');
    },
    list: function () {
      return at('list');
    },
    scroll: function () {
      return at('scroll');
    },
    options: function () {
      return Array.from(root.querySelectorAll('[role="option"]'));
    }
  };

}


/********************************************************************
Type a value into an input the way a user does.

@param {HTMLInputElement} input - The input
@param {String}           text  - The text
*********************************************************************/
export async function type (input, text) {

  await act(async function () {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(input, text);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  });

}


/********************************************************************
Dispatch one keydown on an element inside act.

@param {HTMLElement} element - Target
@param {String}      key     - Key name
*********************************************************************/
export async function press (element, key) {

  await act(async function () {
    element.dispatchEvent(new KeyboardEvent('keydown', { key: key, bubbles: true, cancelable: true }));
  });

}
