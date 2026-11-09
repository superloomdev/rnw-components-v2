// Info: Compound multiple-choice behavior through the real web adapter.
import { expect, test } from '@playwright/test';

import reference from '../component/composite/select/reference.multi-select.js';
import { enterInteraction, leaveInteraction, openShowcase, shootCell } from './harness/page.js';

test('the root OverlayHost keeps an open menu above neighboring controls', async function ({ page }) {
  for (const template of ['default', 'carbon']) {
    await openShowcase(page, template, 'MultiSelect', { measure: true, rootHost: true });
    const cell = page.locator('.cell[data-state="default"]');
    await cell.getByRole('combobox').click();
    const id = await cell.getByRole('combobox').getAttribute('aria-controls');
    await expect(page.locator('[role="listbox"]')).toBeVisible();
    const result = await page.evaluate(function (id) {
      const menu = document.getElementById(id);
      const next = document.querySelector('.cell[data-state="selected"] [data-testid="multi-select-frame"]');
      const a = menu.getBoundingClientRect(), b = next.getBoundingClientRect();
      const top = Math.max(a.top, b.top), bottom = Math.min(a.bottom, b.bottom);
      if (bottom <= top) return { overlaps: false, menuOnTop: false };
      const hit = document.elementFromPoint(a.x + a.width / 2, (top + bottom) / 2);
      return { overlaps: true, menuOnTop: menu.contains(hit) };
    }, id);
    expect(result, template).toEqual({ overlaps: true, menuOnTop: true });
  }
});

test('capturing an open list preserves the measured interaction and viewport', async function ({ page }) {
  await openShowcase(page, 'carbon', 'FilterableMultiSelect', { measure: true, hosted: false });
  await enterInteraction(page, 'FilterableMultiSelect', 'long list', '[data-testid="filterable-multi-select-trigger"]', 'open');
  const read = async function () {
    return page.locator('.cell[data-state="long list"] input').evaluate(node => ({
      active: node.getAttribute('aria-activedescendant') || '',
      scrollY: window.scrollY
    }));
  };
  const before = await read();
  expect(before.active).toBe('');
  await shootCell(page, 'FilterableMultiSelect', 'long list', 20, false, true);
  expect(await read()).toEqual(before);
});

test('a painted caret hit-tests through its governing control', async function ({ page }) {
  await openShowcase(page, 'carbon', 'MultiSelect', { measure: true, hosted: false });
  const target = reference.additionalTargets.find(item => item.name === 'caret');
  const found = await enterInteraction(page, 'MultiSelect', 'default', target.ours, 'pressed', { point: target.point === true });
  expect(found).toBe(true);
  await expect(page.locator('.cell[data-state="default"]').getByRole('combobox')).toBeFocused();
  await leaveInteraction(page, { escape: false, clickOutside: true });
});

test('outside-click cleanup closes a menu without invoking its Escape action', async function ({ page }) {
  await page.setContent('<style>body{margin:0}#field{position:absolute;left:80px;top:80px}</style><button id="field">Choice</button><script>' +
    'window.opened=true;window.cleared=0;document.addEventListener("keydown",e=>{if(e.key==="Escape")window.cleared++});' +
    'document.addEventListener("pointerdown",e=>{if(!e.target.closest("#field"))window.opened=false});</script>');
  await page.locator('#field').focus();
  await leaveInteraction(page, { escape: false, clickOutside: true });
  expect(await page.evaluate(() => ({ opened: window.opened, cleared: window.cleared }))).toEqual({ opened: false, cleared: 0 });
});

test('multiple-choice keyboard navigation reveals the active option inside the real scroll viewport', async function ({ page }) {
  await openShowcase(page, 'carbon', 'MultiSelect', { measure: true, hosted: false });
  const cell = page.locator('.cell[data-component="MultiSelect"][data-state="long list"]');
  const trigger = cell.getByRole('combobox');
  await trigger.click();
  await trigger.press('End');
  const active = await trigger.getAttribute('aria-activedescendant');
  expect(active).toBeTruthy();
  await expect.poll(async function () {
    return cell.evaluate(function (node, id) {
      const option = document.getElementById(id);
      const viewport = node.querySelector('[data-testid="multi-select-scroll"]');
      if (!option || !viewport) return null;
      const a = option.getBoundingClientRect(), b = viewport.getBoundingClientRect();
      return { inside: a.top >= b.top - 0.5 && a.bottom <= b.bottom + 0.5, label: option.getAttribute('aria-label') };
    }, active);
  }).toEqual({ inside: true, label: 'Item 12' });
});

test('filterable multiple-choice edits its query without erasing the selected values', async function ({ page }) {
  await openShowcase(page, 'carbon', 'FilterableMultiSelect', { measure: true, hosted: false });
  const cell = page.locator('.cell[data-component="FilterableMultiSelect"][data-state="uncontrolled selected"]');
  const input = cell.getByRole('combobox');
  await input.fill('ga');
  await expect(cell.getByRole('option')).toHaveCount(1);
  await expect(cell.getByRole('option')).toHaveAttribute('aria-label', 'Gamma');
  await expect(cell.locator('[data-testid="filterable-multi-select-count"]')).toContainText('1');
  await expect(input).toHaveValue('ga');
});
