// Info: The harness update-loop tripwire (D43): a component whose effect
// calls setState unconditionally must fail render() with 'update loop', not
// churn until the process dies. The runaway's state saturates at 10000 so
// the loop still ends by itself when the ceiling is planted away (the fire
// row sets LIMIT = Infinity): the test then fails by assertion, never by
// hanging.
//
// Run: node --import ./harness/register.js --test update-loop-harness.test.js

import assert from 'node:assert';
import { afterEach, test } from 'node:test';

import { React, cleanup, commitCount, render } from './harness/render.js';


/********************************************************************
Component whose effect schedules a state update on every render. The
updater saturates at 10000 so a disabled ceiling leaves a finite run:
React bails on identical state and the loop dies on its own.
*********************************************************************/
function Runaway () {

  const [n, setN] = React.useState(0);
  React.useEffect(function () {
    setN(function (value) {
      return Math.min(value + 1, 10000);
    });
  });
  return React.createElement('div', null, String(n));

}


function Calm () {

  return React.createElement('div', null, 'calm');

}


afterEach(async function () {
  await cleanup();
});


test('an unconditional setState-in-effect loop fails render() as an update loop', async function () {

  await assert.rejects(
    render(React.createElement(Runaway)),
    /update loop/
  );

});

test('a normal component renders inside the commit budget', async function () {

  const container = await render(React.createElement(Calm));
  assert(container.textContent.includes('calm'));
  assert(commitCount() < 10, 'expected fewer than 10 commits, got ' + commitCount());

});
