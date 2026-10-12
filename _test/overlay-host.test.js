// Info: OverlayHost provider and the hosted-overlay contract. The host
// mounts once, wraps the app and owns the layer stack: an open overlay
// inside it registers a layer that paints inside the layer root in
// registration order, and unregisters when it closes. A hosted layer
// mounts `absolute` inside the host's own space on every platform - the
// host's coordinate space, not the window's; an open overlay outside a
// host warns once per component name through the injected Debug on a
// native platform. On the web an unhosted layer still escapes its cell -
// it mounts `fixed` - so no warning is owed.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { Lib, buildSystem } from './harness/system.js';
import { React, cleanup, render } from './harness/render.js';

afterEach(cleanup);


/********************************************************************
Build a registry for the default template, optionally on a Lib override.

@param {Object} [lib] - The injected Lib

@return {Object} - Registry
*********************************************************************/
function registryFor (lib) {

  return buildSystem('default', factories, lib === undefined ? {} : { lib: lib });

}


/********************************************************************
A Lib whose platform answer is android and whose Debug records warns.

@param {Array} warnings - Receives every Debug.warn message

@return {Object} - Lib
*********************************************************************/
function nativeLib (warnings) {

  return Object.assign({}, Lib, {
    Debug: Object.assign({}, Lib.Debug, {
      warn: function (message) {
        warnings.push(message);
      }
    }),
    ReactNative: Object.assign({}, Lib.ReactNative, { Platform: { OS: 'android' } })
  });

}


/********************************************************************
The host's layer root inside a rendered container.

@param {HTMLElement} container - The rendered container

@return {HTMLElement|null} - The layer root
*********************************************************************/
function layerRoot (container) {

  return container.querySelector('[data-testid="overlay-host-layers"]');

}


describe('OverlayHost: membership, order and unregistration', function () {

  test('the host renders its children and an empty layer root', async function () {
    const Registry = registryFor();
    const container = await render(React.createElement(Registry.OverlayHost, { testID: 'overlay-host-layers' }, 'The app'));
    assert.match(container.textContent, /The app/);
    const root = layerRoot(container);
    assert.notEqual(root, null);
    assert.equal(root.style.position, 'absolute');
    assert.equal(root.childElementCount, 0);
  });

  test('a bare string child renders through the registry Text', async function () {
    const Registry = registryFor();
    const container = await render(React.createElement(Registry.OverlayHost, { testID: 'overlay-host-layers' }, 'Wrapped content'));
    // The string lands inside a Text element, not a raw sibling of the
    // layer root - a raw string beside a View crashes a native render
    const text = container.querySelector('[dir="auto"]');
    assert.notEqual(text, null);
    assert.match(text.textContent, /Wrapped content/);
  });

  test('an open overlay inside the host paints its layer in the layer root, not inline', async function () {
    const Registry = registryFor();
    const container = await render(React.createElement(Registry.OverlayHost, { testID: 'overlay-host-layers' },
      React.createElement(Registry.Modal, { open: true, title: 'First' })));
    const root = layerRoot(container);
    const dialogs = root.querySelectorAll('[role="dialog"]');
    assert.equal(dialogs.length, 1);
    assert.match(dialogs[0].textContent, /First/);
    // The hosted layer covers the host's space, not the viewport: the
    // scrim mounts `absolute` inside the layer root on the web too
    const scrim = root.querySelector('[data-testid="modal-scrim"]');
    assert.notEqual(scrim, null);
    assert.equal(scrim.style.position, 'absolute');
    // The Modal's own mount point renders nothing while hosted: the one
    // dialog in the container is the layer root's
    assert.equal(container.querySelectorAll('[role="dialog"]').length, 1);
  });

  test('layers paint in registration order and a close unregisters', async function () {
    const Registry = registryFor();
    let update;
    function Harness () {
      const [second, setSecond] = React.useState(true);
      update = setSecond;
      return React.createElement(Registry.OverlayHost, { testID: 'overlay-host-layers' },
        React.createElement(Registry.Modal, { open: true, title: 'First' }),
        React.createElement(Registry.Modal, { open: second, title: 'Second' }));
    }
    const container = await render(React.createElement(Harness));
    const root = layerRoot(container);
    const dialogs = root.querySelectorAll('[role="dialog"]');
    assert.equal(dialogs.length, 2);
    assert.match(dialogs[0].textContent, /First/);
    assert.match(dialogs[1].textContent, /Second/);

    await act(async function () {
      update(false);
    });
    const after = root.querySelectorAll('[role="dialog"]');
    assert.equal(after.length, 1);
    assert.match(after[0].textContent, /First/);
  });

  test('an overlay outside a host renders in place on the web', async function () {
    const Registry = registryFor();
    const container = await render(React.createElement(Registry.Modal, { open: true, title: 'Solo' }));
    const scrim = container.querySelector('[data-testid="modal-scrim"]');
    assert.notEqual(scrim, null);
    assert.equal(scrim.style.position, 'fixed');
  });

});


describe('OverlayHost: hosted overlays on a native platform', function () {

  test('a hosted modal mounts its layer absolute inside the host on android', async function () {
    const Registry = registryFor(nativeLib([]));
    const container = await render(React.createElement(Registry.OverlayHost, { testID: 'overlay-host-layers' },
      React.createElement(Registry.Modal, { open: true, title: 'Native' })));
    const scrim = layerRoot(container).querySelector('[data-testid="modal-scrim"]');
    assert.notEqual(scrim, null);
    assert.equal(scrim.style.position, 'absolute');
  });

  test('a hosted menu mounts its surface absolute inside the host on android', async function () {
    const Registry = registryFor(nativeLib([]));
    const container = await render(React.createElement(Registry.OverlayHost, { testID: 'overlay-host-layers' },
      React.createElement(Registry.Menu, { items: [{ label: 'A' }], open: true })));
    const surface = layerRoot(container).querySelector('[role="menu"]');
    assert.notEqual(surface, null);
    assert.equal(surface.style.position, 'absolute');
  });

  test('a hosted tooltip mounts its popover absolute inside the host on android', async function () {
    const Registry = registryFor(nativeLib([]));
    const container = await render(React.createElement(Registry.OverlayHost, { testID: 'overlay-host-layers' },
      React.createElement(Registry.Tooltip, { defaultOpen: true, label: 'Tip' }, 'Anchor')));
    const popover = layerRoot(container).querySelector('[role="tooltip"]');
    assert.notEqual(popover, null);
    assert.equal(popover.style.position, 'absolute');
  });

});


describe('OverlayHost: the unhosted native warning', function () {

  // The warning sits in the overlay behavior; Menu and Tooltip cover the
  // component path here because an unhosted dialog also mounts the focus
  // trap, whose native handle call the web renderer cannot serve
  test('an open overlay outside a host warns once per component name on android', async function () {
    const warnings = [];
    const Registry = registryFor(nativeLib(warnings));
    await render(React.createElement(Registry.Menu, { items: [{ label: 'A' }], open: true }));
    assert.equal(warnings.length, 1);
    assert.match(warnings[0], /Menu.*OverlayHost/);
    // A second mount under the same name does not repeat the warning
    await render(React.createElement(Registry.Menu, { items: [{ label: 'B' }], open: true }));
    assert.equal(warnings.length, 1);
    // Another component's name warns in its own right
    await render(React.createElement(Registry.Tooltip, { defaultOpen: true, label: 'Tip' }, 'Anchor'));
    assert.equal(warnings.length, 2);
    assert.match(warnings[1], /Tooltip.*OverlayHost/);
  });

  test('no warning when closed, when hosted, or on the web', async function () {
    const warnings = [];
    const Registry = registryFor(nativeLib(warnings));
    // Closed under android
    await render(React.createElement(Registry.Menu, { items: [{ label: 'A' }], open: false }));
    // Hosted under android
    await render(React.createElement(Registry.OverlayHost, null,
      React.createElement(Registry.Menu, { items: [{ label: 'A' }], open: true })));
    // Open and unhosted on the web
    const web = registryFor();
    await render(React.createElement(web.Menu, { items: [{ label: 'A' }], open: true }));
    assert.deepEqual(warnings, []);
  });

});
