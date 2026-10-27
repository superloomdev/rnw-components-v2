import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
const serve = spawn('node', ['harness/serve.js'], { stdio: 'pipe' });
await new Promise(d => serve.stdout.on('data', x => String(x).includes('listening') && d()));
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('http://localhost:5299/reference?component=DefinitionTooltip&measure=1&set=primary');
await page.waitForFunction(() => window.__reference && window.__reference.ready === true, null, { timeout: 30000 });
await page.evaluate(() => Promise.all([...document.fonts].map(f => f.load())).then(() => document.fonts.ready));
console.log(JSON.stringify(await page.evaluate(() => {
  const el = document.querySelector('.cds--definition-term');
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return { boxHeight: r.height, lineHeight: cs.lineHeight, borderTop: cs.borderTopWidth, borderBottom: cs.borderBottomWidth,
    contentHeight: r.height - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth) };
})));
await browser.close(); serve.kill();
