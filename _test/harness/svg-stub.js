// Info: Minimal stand-in for react-native-svg in the Node tests. Renders
// DOM `svg`, `g` and `path` elements with the props the library passes, so a
// rendered icon can be inspected for its viewBox, fill and path data in
// jsdom. Only the surface the library uses exists here; anything else the
// library reaches for fails loudly, which is the point.

import React from 'react';

// React Native accessibility props -> DOM attributes
function toDomProps (props) {

  const out = {};
  for (const key of Object.keys(props)) {
    if (key === 'children') {
      continue;
    }
    if (key === 'accessibilityRole') {
      out.role = props[key] === 'image' ? 'img' : props[key];
    } else if (key === 'accessibilityLabel') {
      out['aria-label'] = props[key];
    } else if (key === 'testID') {
      out['data-testid'] = props[key];
    } else if (key === 'style') {
      // style objects pass through; jsdom accepts React style objects
      out.style = props[key];
    } else {
      out[key] = props[key];
    }
  }

  return out;

}

function element (tag) {
  const Element = function (props) {
    return React.createElement(tag, toDomProps(props), props.children);
  };
  Element.displayName = tag;
  return Element;
}

export const Svg = element('svg');
export const G = element('g');
export const Path = element('path');
export default Svg;
