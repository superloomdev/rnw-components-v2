// Info: Shared fixtures for the system-level tests: the injected Lib (React,
// react-native-web as ReactNative, the svg stub as Svg, the helpers, the
// engine), the three published templates built for the native projection,
// and a helper that builds a system from a factories map.

import React from 'react';
import * as ReactNative from 'react-native-web';
import * as Svg from './svg-stub.js';
import utils from 'helper-utils';
import debug from 'helper-debug';
import themer from 'helper-themer';
import defaultProfile from 'helper-themer-template-default';
import carbonProfile from 'helper-themer-template-carbon';
import materialProfile from 'helper-themer-template-material';

import { createSystem } from 'rnw-components';

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
  carbon: carbonProfile.schemes.white,
  material: materialProfile.schemes.light
});

const builtCache = {};


/********************************************************************
Build (and cache) the native projection of one template.

@param {String} name   - 'default' | 'carbon' | 'material'
@param {Array}  layers - Brand layers, default none

@return {Object} - The built theme
*********************************************************************/
export function buildNative (name, layers) {

  const key = name + ':' + JSON.stringify(layers || []);
  if (builtCache[key] === undefined) {
    builtCache[key] = Themer.buildTheme(TEMPLATES[name], layers || [], 'native');
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
