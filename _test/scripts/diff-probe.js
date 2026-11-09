// Info: The pixel-first probe (D51c). Reads a FIDELITY_DIFF_DUMP directory
// (`harness/fidelity.js` dumps the compared pair, their full-resolution
// pixelmatch diff and the frame per component/scheme/state) and, for every
// state over the roster's diff_budget, reports the three largest connected
// components of the diff mask (8-neighbour, components under 4 px dropped),
// the three most frequent exact rgba under each in ours.png and upstream.png,
// and the reference parts whose box holds the component's centre on each
// side (mapped through the same _bodyX/_bodyY fields cropTo reads).
//
// Usage: node ../scripts/guard.js --seconds 300 -- node scripts/diff-probe.js <dump-dir> [out.md]
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { PNG } from 'pngjs';

import { getRoster } from '../../scripts/lib/components.js';

const MARGIN = 20;
const dir = process.argv[2];
const out = process.argv[3] || join('test-results', 'diff-probe-s6.md');
if (dir === undefined) {
  process.stderr.write('usage: node scripts/diff-probe.js <dump-dir> [out.md]\n');
  process.exit(2);
}

const BUDGET = Object.fromEntries(getRoster().rows.map(function (row) {
  return [row.name, row.diff_budget];
}));

const readPng = function (path) {
  return PNG.sync.read(readFileSync(path));
};
const rgba = function (png, x, y) {
  if (x < 0 || y < 0 || x >= png.width || y >= png.height) {
    return 'outside';
  }
  const i = (Math.floor(y) * png.width + Math.floor(x)) * 4;
  return 'rgba(' + png.data[i] + ',' + png.data[i + 1] + ',' + png.data[i + 2] + ',' + (png.data[i + 3] / 255).toFixed(2) + ')';
};

// pixelmatch draws matched pixels gray and mismatches red (anti-aliased
// yellow): the mask is every pixel whose channels are not all equal
const maskOf = function (diff) {
  const mask = new Uint8Array(diff.width * diff.height);
  for (let i = 0; i < diff.width * diff.height; i++) {
    const r = diff.data[i * 4];
    const g = diff.data[i * 4 + 1];
    const b = diff.data[i * 4 + 2];
    if (!(r === g && g === b)) {
      mask[i] = 1;
    }
  }
  return mask;
};

const components = function (diff) {
  const mask = maskOf(diff);
  const seen = new Uint8Array(mask.length);
  const out = [];
  for (let start = 0; start < mask.length; start++) {
    if (mask[start] === 0 || seen[start] === 1) {
      continue;
    }
    let minX = diff.width;
    let minY = diff.height;
    let maxX = -1;
    let maxY = -1;
    let count = 0;
    const stack = [start];
    seen[start] = 1;
    const pixels = [];
    while (stack.length > 0) {
      const p = stack.pop();
      const x = p % diff.width;
      const y = Math.floor(p / diff.width);
      pixels.push(p);
      count += 1;
      minX = Math.min(minX, x);
      minY = Math.min(minY, y);
      maxX = Math.max(maxX, x);
      maxY = Math.max(maxY, y);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        const np = ny * diff.width + nx;
        if (nx >= 0 && ny >= 0 && nx < diff.width && ny < diff.height && mask[np] === 1 && seen[np] === 0) {
          seen[np] = 1;
          stack.push(np);
        }
      }
    }
    if (count >= 4) {
      out.push({ x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1, count: count, pixels: pixels });
    }
  }
  return out.sort(function (a, b) { return b.count - a.count; }).slice(0, 3);
};

const topColors = function (png, pixels, width) {
  const counts = new Map();
  for (const p of pixels) {
    const key = rgba(png, p % width, Math.floor(p / width));
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Array.from(counts.entries()).sort(function (a, b) { return b[1] - a[1]; }).slice(0, 3)
    .map(function (entry) { return entry[0] + ' x' + entry[1]; }).join(', ');
};

// The frame a side's part boxes map through: a crop origin shifts body
// coordinates by its own box; no origin means the whole cell shot, whose
// margin shifts body coordinates by MARGIN
const offsetOf = function (origin) {
  if (origin !== null && origin !== undefined && typeof origin._bodyX === 'number' && typeof origin._bodyY === 'number') {
    return { dx: -origin._bodyX, dy: -origin._bodyY, frame: 'crop ' + Math.round(origin.width) + 'x' + Math.round(origin.height) + ' at body ' + Math.round(origin._bodyX) + ',' + Math.round(origin._bodyY) };
  }
  return { dx: MARGIN, dy: MARGIN, frame: 'cell shot (margin ' + MARGIN + ')' };
};

const boxOf = function (part, offset) {
  if (part === null || part === undefined || part.visible !== true || typeof part._bodyX !== 'number') {
    return null;
  }
  return { x: part._bodyX + offset.dx, y: part._bodyY + offset.dy, width: part.width, height: part.height };
};

const describe = function (part) {
  const out = [];
  for (const key of ['backgroundColor', 'color', 'borderBottomColor', 'borderTopWidth', 'borderBottomWidth', 'outline', 'ink', 'paint']) {
    if (part[key] !== undefined) {
      out.push(key + '=' + part[key]);
    }
  }
  return out.join(' ');
};

const sections = [];
for (const component of readdirSync(dir, { withFileTypes: true })) {
  if (!component.isDirectory()) {
    continue;
  }
  const budget = BUDGET[component.name];
  for (const scheme of readdirSync(join(dir, component.name), { withFileTypes: true })) {
    if (!scheme.isDirectory()) {
      continue;
    }
    for (const key of readdirSync(join(dir, component.name, scheme.name), { withFileTypes: true })) {
      const base = join(dir, component.name, scheme.name, key.name);
      let frame;
      try {
        frame = JSON.parse(readFileSync(join(base, 'frame.json'), 'utf8'));
      } catch (error) {
        continue;
      }
      if (!(budget !== undefined && frame.ratio > budget)) {
        continue;
      }
      const diff = readPng(join(base, 'diff.png'));
      const oursPng = readPng(join(base, 'ours.png'));
      const upstreamPng = readPng(join(base, 'upstream.png'));
      const oursOffset = offsetOf(frame.oursOrigin);
      const upstreamOffset = offsetOf(frame.upstreamOrigin);
      const bodyFramed = function (states) {
        return states !== null && Object.keys(states).some(function (name) {
          return states[name] !== null && typeof states[name]._bodyX === 'number';
        });
      };
      const lines = ['## ' + component.name + ' / ' + scheme.name + ' / ' + key.name, '',
        'ratio ' + frame.ratio + '% > ' + budget + '% | frame ' + diff.width + 'x' + diff.height,
        'ours parts: ' + (bodyFramed(frame.ours) ? oursOffset.frame : 'no _bodyX frame (origin-relative x,y only)') +
          ' | upstream parts: ' + (bodyFramed(frame.upstream) ? upstreamOffset.frame : 'no _bodyX frame (origin-relative x,y only)'),
        '', '| # | x | y | w | h | px | % |', '|---|---|---|---|---|---|---|'];
      for (const [index, comp] of components(diff).entries()) {
        lines.push('| ' + (index + 1) + ' | ' + comp.x + ' | ' + comp.y + ' | ' + comp.width + ' | ' + comp.height +
          ' | ' + comp.count + ' | ' + (Math.round(comp.count / (diff.width * diff.height) * 10000) / 100) + ' |');
      }
      lines.push('');
      for (const [index, comp] of components(diff).entries()) {
        const cx = comp.x + comp.width / 2;
        const cy = comp.y + comp.height / 2;
        lines.push('### component ' + (index + 1) + ' (' + comp.x + ',' + comp.y + ' ' + comp.width + 'x' + comp.height + ', centre ' + Math.round(cx) + ',' + Math.round(cy) + ')', '');
        lines.push('- ours top: ' + topColors(oursPng, comp.pixels, diff.width));
        lines.push('- upstream top: ' + topColors(upstreamPng, comp.pixels, diff.width));
        for (const side of ['ours', 'upstream']) {
          const offset = side === 'ours' ? oursOffset : upstreamOffset;
          const states = frame[side] || {};
          const containing = [];
          const intersecting = [];
          for (const name of Object.keys(states)) {
            const box = boxOf(states[name], offset);
            if (box === null) {
              continue;
            }
            const inside = cx >= box.x && cy >= box.y && cx <= box.x + box.width && cy <= box.y + box.height;
            if (inside) {
              containing.push(name + ' (' + describe(states[name]) + ')');
            }
            const hits = box.x < comp.x + comp.width && box.x + box.width > comp.x && box.y < comp.y + comp.height && box.y + box.height > comp.y;
            if (hits && !inside) {
              intersecting.push(name);
            }
          }
          lines.push('- ' + side + ' parts at centre: ' + (containing.length > 0 ? containing.join(' | ') : 'none'));
          lines.push('- ' + side + ' parts intersecting: ' + (intersecting.length > 0 ? intersecting.join(', ') : 'none'));
        }
        lines.push('');
      }
      sections.push(lines.join('\n'));
    }
  }
}

writeFileSync(out, '# diff-probe\n\n' + sections.join('\n') + '\n');
process.stdout.write('diff-probe: ' + sections.length + ' state(s) over budget -> ' + out + '\n');
