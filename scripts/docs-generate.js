// Info: Generates one documentation page per family under docs/components/
// from data the components already carry: props from api.js, metrics from
// spec.js, states from sample.js, platform and flags from the roster, and
// the author's notes.md merged in. Deterministic: the docs gate regenerates
// into a temp directory and diffs. Nobody edits a generated page.
//
// Usage: node scripts/docs-generate.js [outDir]   (default: docs/components)

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { REPO_ROOT, discoverComponents, getRoster } from './lib/components.js';

const OUT_DIR = process.argv[2] ? resolve(process.argv[2]) : join(REPO_ROOT, 'docs', 'components');

const FLAG_TEXT = {
  deferred_gap: 'a shape one reference system has is deferred; the row records the gap',
  no_reference: 'no upstream visual reference; gates are structural, accessibility and cross-template',
  web_only: 'renders on web only; the native half renders nothing',
  requires_parent: 'renders only inside its parent',
  superloom_decision: 'anatomy or a value decided here, not measured from a reference',
  not_applicable: 'not a rendered component'
};


/********************************************************************
Render one metric rule as text.

@param {*} entry - Spec entry

@return {String}
*********************************************************************/
function describeMetric (entry) {

  if (typeof entry === 'string') {
    return '`' + entry + '`';
  }
  if (entry.constant !== undefined) {
    return 'constant `' + entry.constant + '` (decision)';
  }

  return entry.operation + ' of ' + entry.tokens.map(function (token) {
    return '`' + token + '`';
  }).join(', ');

}


/********************************************************************
Render one component's section.

@param {Object} component - From discoverComponents
@param {Object} row       - Its roster row

@return {String} - Markdown
*********************************************************************/
function renderComponent (component, row) {

  const out = [];
  out.push('## ' + component.name);
  out.push('');
  out.push(row.description);
  out.push('');
  out.push('| | |');
  out.push('|---|---|');
  out.push('| Tier | `' + row.tier + '` |');
  out.push('| Platform | `' + row.platform.support + '`' + (row.platform.fallback !== 'none' ? ' - fallback: ' + row.platform.fallback : '') + ' |');
  out.push('| Reference | `' + row.reference.kind + '`' + (row.reference.package !== 'none' ? ' (`' + row.reference.package + '`)' : '') + ' |');
  out.push('| Enums | ' + (row.enums.length ? row.enums.map(function (token) {
    return '`' + token + '`';
  }).join(', ') : 'none') + ' |');
  out.push('| Behaviors | ' + (row.behaviors.length ? row.behaviors.map(function (name) {
    return '`' + name + '`';
  }).join(', ') : 'none') + ' |');
  out.push('| Flags | ' + (row.flags.length ? row.flags.map(function (flag) {
    return '`' + flag + '` - ' + FLAG_TEXT[flag];
  }).join('; ') : 'none') + ' |');
  out.push('');
  out.push('### Props');
  out.push('');
  out.push('| Prop | Type | Required | Description |');
  out.push('|---|---|---|---|');
  for (const name of Object.keys(component.api.props)) {
    const prop = component.api.props[name];
    out.push('| `' + name + '` | `' + prop.type + '` | ' + (prop.required ? 'yes' : 'no') + ' | ' + prop.description + ' |');
  }
  out.push('');
  out.push('### Metrics');
  out.push('');
  out.push('| Metric | Rule |');
  out.push('|---|---|');
  for (const metric of Object.keys(component.spec)) {
    out.push('| `' + metric + '` | ' + describeMetric(component.spec[metric]) + ' |');
  }
  if ((component.api.colors || []).length) {
    out.push('');
    out.push('Color leaves accepted: ' + component.api.colors.map(function (leaf) {
      return '`' + leaf + '`';
    }).join(', ') + '.');
  }
  out.push('');
  out.push('### States (sample.js)');
  out.push('');
  out.push('| State | Props |');
  out.push('|---|---|');
  for (const state of component.sample) {
    out.push('| ' + state.label + ' | `' + JSON.stringify(state.props) + '` |');
  }
  out.push('');

  return out.join('\n');

}


/********************************************************************
Generate every family page into the output directory.

@return {Array} - Written file names
*********************************************************************/
export async function generate () {

  const components = await discoverComponents();
  const roster = getRoster();
  const rows = {};
  for (const row of roster.rows) {
    rows[row.name] = row;
  }

  // Group by roster family, preserving roster order within a family
  const families = {};
  for (const component of components) {
    const family = rows[component.name].family;
    families[family] = families[family] || [];
    families[family].push(component);
  }

  if (existsSync(OUT_DIR)) {
    for (const file of readdirSync(OUT_DIR)) {
      rmSync(join(OUT_DIR, file));
    }
  }
  mkdirSync(OUT_DIR, { recursive: true });

  const written = [];
  for (const family of Object.keys(families).sort()) {
    const members = families[family];
    const out = ['<!-- Generated by scripts/docs-generate.js from api.js, spec.js, sample.js, data/roster.json and notes.md. Do not edit. -->', '', '# ' + family, ''];
    const notes = members.map(function (component) {
      return component.files.notes;
    }).filter(function (path, index, all) {
      return existsSync(path) && all.indexOf(path) === index;
    });
    for (const path of notes) {
      // Notes headings nest one level under the family heading
      out.push(readFileSync(path, 'utf8').trim().replace(/^(#+) /gm, '#$1 '));
      out.push('');
    }
    for (const component of members) {
      out.push(renderComponent(component, rows[component.name]));
    }
    const file = family + '.md';
    writeFileSync(join(OUT_DIR, file), out.join('\n').replace(/\n{3,}/g, '\n\n'));
    written.push(file);
  }

  return written;

}


const written = await generate();
process.stdout.write('docs: ' + written.length + ' family page(s) -> ' + OUT_DIR + '\n');
