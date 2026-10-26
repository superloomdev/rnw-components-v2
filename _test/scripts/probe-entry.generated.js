import React from 'react';
import { createRoot } from 'react-dom/client';
import * as WebUpstream from '@carbon/react';
import * as UpstreamIcons from '@carbon/icons-react';
import { bodyCompact01, bodyCompact02, fontFamilies } from '@carbon/type';
import ICONS from "/Users/sj/Projects/project-superloom/codebase-rnw-components-v2/data/icons.json";
import CopyButtonMount from "/Users/sj/Projects/project-superloom/__dev__/evidence/0160/recipes/probe/CopyButton.mount.js";
const MOUNTS = {
  CopyButton: CopyButtonMount
};
function icon (name) {
  const upstreamName = ICONS.icons[name].carbon.split('-').filter(Boolean).map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join('');
  return UpstreamIcons[upstreamName];
}
const FIXTURE_TYPES = { bodyCompact01: bodyCompact01, bodyCompact02: bodyCompact02 };
function fixtureTextStyle (name) {
  const set = FIXTURE_TYPES[name];
  return {
    fontFamily: fontFamilies.sans,
    fontSize: set.fontSize,
    fontWeight: set.fontWeight,
    letterSpacing: set.letterSpacing,
    lineHeight: set.lineHeight
  };
}
const upstream = Object.assign({}, WebUpstream, { icon: icon, fixtureTextStyle: fixtureTextStyle });
const root = document.getElementById('root');
document.body.classList.add('measure');
const grid = document.createElement('div');
grid.className = 'grid';
const cells = [];
Object.keys(MOUNTS).forEach(function (row) {
  const mount = MOUNTS[row];
  Object.keys(mount.states).forEach(function (state) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.component = row;
    cell.dataset.state = state;
    const label = document.createElement('div');
    label.className = 'cell-label';
    label.textContent = state;
    const body = document.createElement('div');
    body.className = 'cell-body';
    body.dataset.part = 'body';
    body.style.width = (mount.bodyWidth || 320) + 'px';
    const element = mount.mount(React, upstream, mount.states[state]);
    cell.appendChild(label);
    cell.appendChild(body);
    grid.appendChild(cell);
    cells.push(createRoot(body).render(element));
  });
});
root.appendChild(grid);
document.fonts.ready.then(function () {
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      window.__probe = { ready: true };
    });
  });
});
