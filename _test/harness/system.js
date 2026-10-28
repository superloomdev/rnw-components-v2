// Info: Shared fixtures for the system-level tests: the injected Lib (React,
// react-native-web as ReactNative, the svg stub as Svg, the helpers, the
// engine), the two published templates built for the native projection,
// and a helper that builds a system from a factories map.

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import React from 'react';
import * as ReactNative from 'react-native-web';
import * as Svg from './svg-stub.js';
import utils from 'helper-utils';
import debug from 'helper-debug';
import themer from 'helper-themer';
import defaultProfile from 'helper-themer-template-default';
import carbonProfile from 'helper-themer-template-carbon';

import { createSystem } from 'rnw-components';

const HERE = dirname(fileURLToPath(import.meta.url));

const Utils = utils({});
const Debug = debug({ Utils: Utils }, { LOG_LEVEL: 'error' });
const Themer = themer({ Utils: Utils, Debug: Debug });

export const Lib = Object.freeze({
  React: React,
  ReactNative: ReactNative,
  Svg: Svg,
  Utils: Utils,
  Debug: Debug,
  Themer: Themer
});

// The first scheme of each template, keyed by the profile name the demo uses
export const TEMPLATES = Object.freeze({
  default: defaultProfile.schemes.light,
  carbon: carbonProfile.schemes.white
});

// A test-only third theme (plan 0160, batch 15 fire restore): `shapes` is
// `default` under one layer of the cells and enum values the archived
// material template pinned, verbatim from its data/light.js (the registry
// 1.0.0's source, commit 95cc029). It is never shipped, never a measurement
// reference and never a TEMPLATES entry, so the browser gates stay
// two-template; the node tests that need it iterate SHAPE_TEMPLATE_NAMES.
const SHAPE_LAYER = Object.freeze(JSON.parse(readFileSync(join(HERE, '..', 'fixtures', 'shape-layer.json'), 'utf8')));
const BASES = { shapes: { template: defaultProfile.schemes.light, layers: [SHAPE_LAYER] } };

export const SHAPE_TEMPLATE_NAMES = Object.freeze(Object.keys(TEMPLATES).concat('shapes'));

export { LESSONS_LAYER } from './lessons-layer.js';

const builtCache = {};


/********************************************************************
Build (and cache) the native projection of one template.

@param {String} name   - 'default' | 'carbon' | 'shapes'
@param {Array}  layers - Brand layers, default none

@return {Object} - The built theme
*********************************************************************/
export function buildNative (name, layers) {

  const key = name + ':' + JSON.stringify(layers || []);
  if (builtCache[key] === undefined) {
    const base = BASES[name] === undefined ? { template: TEMPLATES[name], layers: [] } : BASES[name];
    builtCache[key] = Themer.buildTheme(base.template, base.layers.concat(layers || []), 'native');
  }

  return builtCache[key];

}


/********************************************************************
Build a system for one template with the given factories.

@param {String} name      - Template name
@param {Object} factories - Component factories
@param {Object} [options] - { breakpoint, config, layers, lib }

@return {Object} - The registry
*********************************************************************/
export function buildSystem (name, factories, options) {

  const opts = options || {};

  return createSystem(
    opts.lib || Lib,
    opts.config || {},
    opts.built || buildNative(name, opts.layers),
    opts.breakpoint || 'md',
    factories
  );

}
