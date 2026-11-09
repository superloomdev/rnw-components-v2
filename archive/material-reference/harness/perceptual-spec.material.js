// Source: _test/perceptual.spec.js (Material parts, verbatim from 7f2bd93)

// --- _test/perceptual.spec.js:35-35 ---
// primary pixel comparison is skipped (a second twin is measured inside

// --- _test/perceptual.spec.js:166-173 ---
    found.push(...await chrome('ours'));
    expect(await page.locator('.cell').count()).toBeGreaterThanOrEqual(1);
    for (const set of ['primary', 'second']) {
      const reference = await openReference(page, 'TextArea', set, 'dark');
      expect(reference.cells, 'TextArea: the ' + set + ' reference page drew no state').toBeGreaterThanOrEqual(1);
      found.push(...await chrome(set));
    }
    expect(found, 'measurement cells painting their own chrome').toEqual([]);
