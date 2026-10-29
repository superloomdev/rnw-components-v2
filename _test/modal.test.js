// Info: Modal composite. Every sample state renders under all three
// templates with the scrim, container, header, body and actions read from
// the `dialog` cells; the close seat shows only where
// `anatomy.dialog_close` says `shown` and the actions row stretches or
// trails by `anatomy.dialog_actions`; Escape and outside press call
// `onClose`.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import SAMPLE from '../component/composite/modal/sample.js';
import { TEMPLATES, buildNative, buildSystem, LESSONS_LAYER } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


/********************************************************************
Build a registry for a template.

@param {String} template - Template name

@return {Object} - Registry
*********************************************************************/
function registryFor (template) {

  return buildSystem(template, factories);

}


/********************************************************************
Render one Modal and return its parts.

@param {Object} Registry - Registry
@param {Object} props    - Modal props

@return {Promise<Object>} - { container, dialog, header, body, close, actions }
*********************************************************************/
async function renderModal (Registry, props) {

  const rendered = await render(React.createElement(Registry.Modal, props));
  const dialog = rendered.querySelector('[role="dialog"], [role="alertdialog"]');

  return {
    scrim: rendered.querySelector('[data-testid="modal-scrim"]'),
    dialog: dialog,
    header: function () {
      return dialog === null ? null : dialog.children[0];
    },
    close: function () {
      return dialog === null ? null : dialog.children[1];
    },
    body: function () {
      return dialog === null ? null : dialog.children[2];
    },
    actionsRow: function () {
      return dialog === null ? null : dialog.children[3] || null;
    }
  };

}


describe('Modal: every sample state under every template', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const state of SAMPLE) {
      test(template + ' / ' + state.label + ': the dialog comes from the theme', async function () {
        const t = buildNative(template).tokens;
        const props = state.props;
        const parts = await renderModal(registryFor(template), props);

        // The scrim fills with the scrim cell at the overlay stacking
        assert.notEqual(parts.scrim, null);
        assert.equal(parts.scrim.style.backgroundColor, cssValue('backgroundColor', t['color.dialog_scrim']));
        assert.equal(parts.scrim.style.zIndex, String(t['stacking.overlay']));

        // The container's surface cells and a11y
        const dialog = parts.dialog;
        assert.notEqual(dialog, null);
        assert.equal(dialog.getAttribute('aria-modal'), 'true');
        assert.equal(dialog.style.backgroundColor, cssValue('backgroundColor', t['color.dialog_container']));
        assert.equal(dialog.style.borderTopLeftRadius, t['control.dialog_radius'] + 'px');
        assert.equal(dialog.style.borderTopWidth, t['control.dialog_border_width'] + 'px');
        if (t['control.dialog_min_width'] > 0 || t['control.dialog_max_width'] > 0) {
          assert.equal(dialog.style.minWidth, t['control.dialog_min_width'] + 'px');
          assert.equal(dialog.style.maxWidth, t['control.dialog_max_width'] + 'px');
          assert.equal(dialog.style.minHeight, t['control.dialog_min_height'] + 'px');
          assert.equal(dialog.style.width, '');
        } else {
          // Unhosted, so the layer space is the jsdom window: the width
          // is the size's ratio of it
          const suffix = { xs: '_xs', sm: '_sm', md: '', lg: '_lg' }[props.size || 'md'];
          assert.equal(dialog.style.width, (window.innerWidth * t['control.dialog_width_ratio' + suffix]) + 'px');
          assert.equal(dialog.style.maxHeight, (window.innerHeight * t['control.dialog_height_ratio' + suffix]) + 'px');
        }

        // The header: label when given, heading always, close seat gated by the anatomy
        const header = parts.header();
        assert.equal(header.style.paddingTop, t['control.dialog_padding_top'] + 'px');
        assert.equal(header.style.marginBottom, t['control.dialog_header_space'] + 'px');
        const heading = header.children[props.label === undefined ? 0 : 1];
        assert.equal(heading.textContent, props.title);
        assert.equal(heading.style.fontSize, t['type.dialog_heading'].fontSize + 'px');
        assert.equal(heading.style.color, cssValue('color', t['color.dialog_heading']));
        if (props.label !== undefined) {
          const eyebrow = header.children[0];
          assert.equal(eyebrow.textContent, props.label);
          assert.equal(eyebrow.style.fontSize, t['type.label01'].fontSize + 'px');
          assert.equal(eyebrow.style.color, cssValue('color', t['color.text_secondary']));
          assert.equal(eyebrow.style.display, t['anatomy.dialog_label'] === 'shown' ? '' : 'none');
        }
        const close = parts.close();
        assert.equal(close.style.display, t['anatomy.dialog_close'] === 'shown' ? 'flex' : 'none');
        const closeSvg = close.querySelector('svg');
        assert.equal(closeSvg.getAttribute('width'), String(t['control.dialog_close_icon_size']));

        // The body's padding cells
        const body = parts.body();
        assert.equal(body.style.paddingTop, t['control.dialog_body_padding_top'] + 'px');
        const actions = Array.isArray(props.actions) && props.passive !== true ? props.actions : [];
        assert.equal(body.style.paddingBottom, t['control.dialog_body_padding_bottom'] + 'px');
        const bodyText = body.querySelector('[dir="auto"]');
        assert.equal(bodyText.style.fontSize, t['type.dialog_body'].fontSize + 'px');
        assert.equal(bodyText.style.color, cssValue('color', t['color.dialog_body']));

        // The actions row: stretched fills the height, trailing rows right
        const row = parts.actionsRow();
        if (actions.length === 0) {
          assert.equal(row, null);
          return;
        }
        assert.notEqual(row, null);
        const stretched = t['anatomy.dialog_actions'] === 'stretched';
        assert.equal(row.style.height, t['control.dialog_actions_height'] > 0 ? t['control.dialog_actions_height'] + 'px' : '');
        if (stretched) {
          assert.equal(row.style.justifyContent, 'flex-end');
        } else {
          assert.equal(row.style.justifyContent, 'flex-end');
          assert.equal(row.style.paddingTop, t['spacing.spacing_05'] + 'px');
          assert.equal(row.style.paddingBottom, t['control.dialog_actions_padding'] + 'px');
        }
        const buttons = Array.from(row.querySelectorAll('[role="button"]'));
        assert.equal(buttons.length, actions.length);
      });
    }
  }

});


/********************************************************************
Build a registry and capture its context so a test can publish a host
space through the system's own OverlayContext.

@param {String} template - Template name

@return {Object} - { Registry, ctx }
*********************************************************************/
function systemFor (template) {

  let captured = null;
  const probe = function (ctx) {
    captured = ctx;
    return function () {
      return null;
    };
  };
  const Registry = buildSystem(template, Object.assign({}, factories, { ContextProbe: probe }));

  return { Registry: Registry, ctx: captured };

}


/********************************************************************
A staged host: publishes `hosted` with a fixed size through the system's
OverlayContext and paints every registered layer inline, the way
OverlayHost's layer root does.

@param {Object} props - { ctx, size, children }
*********************************************************************/
function StagedHost (props) {

  const nextIdRef = React.useRef(0);
  const [layers, setLayers] = React.useState([]);
  const register = React.useCallback(function (layer) {
    const id = nextIdRef.current;
    nextIdRef.current += 1;
    setLayers(function (current) {
      return current.concat(Object.assign({}, layer, { id: id }));
    });
    return id;
  }, []);
  const unregister = React.useCallback(function (id) {
    setLayers(function (current) {
      return current.filter(function (layer) {
        return layer.id !== id;
      });
    });
  }, []);
  const value = React.useMemo(function () {
    return {
      hosted: true,
      layers: layers,
      origin: { x: 0, y: 0 },
      size: props.size,
      register: register,
      unregister: unregister
    };
  }, [layers, register, unregister, props.size]);

  return React.createElement(props.ctx.behaviors.OverlayContext.Provider, { value: value },
    props.children,
    layers.map(function (layer) {
      return React.createElement('div', { key: layer.id }, layer.render());
    }));

}


describe('Modal: the dialog width follows the layer space ratio', function () {

  for (const row of [{ width: 320 }, { width: 800 }, { width: 1280 }, { width: 1400 }]) {
    test('carbon size md in a ' + row.width + '-wide host draws the width ratio of it', async function () {
      const system = systemFor('carbon');
      const t = buildNative('carbon').tokens;
      const container = await render(React.createElement(StagedHost, { ctx: system.ctx, size: { width: row.width, height: 400 } },
        React.createElement(system.Registry.Modal, { open: true, title: 'T', size: 'md', children: 'B' })));
      const dialog = container.querySelector('[role="dialog"], [role="alertdialog"]');
      assert.notEqual(dialog, null);
      assert.equal(dialog.style.width, (row.width * t['control.dialog_width_ratio']) + 'px');
      assert.equal(dialog.style.maxHeight, (400 * t['control.dialog_height_ratio']) + 'px');
      const scrim = container.querySelector('[data-testid="modal-scrim"]');
      assert.equal(scrim.style.justifyContent, 'center');
    });
  }

  test('carbon size xs in an 800-wide host draws the xs ratio of it', async function () {
    const system = systemFor('carbon');
    const t = buildNative('carbon').tokens;
    const container = await render(React.createElement(StagedHost, { ctx: system.ctx, size: { width: 800, height: 400 } },
      React.createElement(system.Registry.Modal, { open: true, title: 'T', size: 'xs', children: 'B' })));
    const dialog = container.querySelector('[role="dialog"], [role="alertdialog"]');
    assert.equal(dialog.style.width, (800 * t['control.dialog_width_ratio_xs']) + 'px');
  });


});


describe('Modal: behavior through the DOM', function () {

  test('closed renders nothing; Escape, the close button and outside press close', async function () {
    let closed = 0;
    const onClose = function () {
      closed = closed + 1;
    };
    const Registry = registryFor('carbon');
    const container = await render(React.createElement(Registry.Modal, { open: false, onClose: onClose, title: 'T' }));
    assert.equal(container.querySelector('[role="dialog"]'), null);

    const parts = await renderModal(Registry, { open: true, onClose: onClose, title: 'T', children: 'Body', actions: [{ label: 'OK' }] });
    await act(async function () {
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    });
    assert.equal(closed, 1);

    await act(async function () {
      parts.close().querySelector('[role="button"]').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(closed, 2);

    await act(async function () {
      parts.scrim.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(closed, 3);
  });

  test('outside press is ignored under preventCloseOnClickOutside', async function () {
    let closed = 0;
    const parts = await renderModal(registryFor('carbon'), {
      open: true,
      preventCloseOnClickOutside: true,
      onClose: function () {
        closed = closed + 1;
      },
      title: 'T'
    });
    await act(async function () {
      parts.scrim.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    assert.equal(closed, 0);
  });

});
