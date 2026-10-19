// Info: Form, FormItem, FormGroup and FormLabel. The form is a container
// that answers the `form` role only when named; the item stacks one
// field's parts in a column; the group is a labelled fieldset whose
// disabled state inherits into every control inside; the label is the
// field-label cells with no margin.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { act } from 'react';

import * as factories from 'rnw-components/all';
import { TEMPLATES, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

const TEMPLATE_NAMES = Object.keys(TEMPLATES);

afterEach(cleanup);


describe('Form: the role exists only with a name', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': a labelled Form carries the form role', async function () {
      const Registry = buildSystem(template, { Form: factories.Form, Text: factories.Text });
      const container = await render(React.createElement(Registry.Form, { accessibilityLabel: 'Checkout' },
        React.createElement(Registry.Text, { text: 'fields' })));
      const form = container.querySelector('[role="form"]');
      assert.notEqual(form, null);
      assert.equal(form.getAttribute('aria-label'), 'Checkout');
    });
  }

  test('an unlabelled Form is a plain container', async function () {
    const Registry = buildSystem('default', { Form: factories.Form, Text: factories.Text });
    const container = await render(React.createElement(Registry.Form, null, 'fields'));
    assert.equal(container.querySelector('[role="form"]'), null);
  });

  test('a string child renders through the registry Text in the compact type', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', { Form: factories.Form, Text: factories.Text });
    const container = await render(React.createElement(Registry.Form, null, 'fields'));
    const text = container.querySelector('[dir="auto"]');
    assert.equal(text.textContent, 'fields');
    assert.equal(text.style.fontSize, t['type.body_compact_01'].fontSize + 'px');
  });

  test('a numeric zero child renders through the registry Text', async function () {
    const Registry = buildSystem('default', { Form: factories.Form, Text: factories.Text });
    const container = await render(React.createElement(Registry.Form, null, 0));
    assert.equal(container.querySelector('[dir="auto"]').textContent, '0');
  });

});


describe('FormItem: a start-aligned column', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': children stack in a column aligned to the start edge', async function () {
      const Registry = buildSystem(template, { FormItem: factories.FormItem, Text: factories.Text });
      const container = await render(React.createElement(Registry.FormItem, null, 'one', 'two'));
      const item = container.firstElementChild;
      assert.equal(item.style.alignItems, 'flex-start');
      assert.equal(item.querySelectorAll('[dir="auto"]').length, 2);
    });
  }

  test('a string child renders in type.body_compact_01', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', { FormItem: factories.FormItem, Text: factories.Text });
    const container = await render(React.createElement(Registry.FormItem, null, 'one'));
    const text = container.querySelector('[dir="auto"]');
    assert.equal(text.style.fontSize, t['type.body_compact_01'].fontSize + 'px');
    assert.equal(text.style.letterSpacing, t['type.body_compact_01'].letterSpacing + 'px');
  });

  test('a numeric zero child renders through the registry Text', async function () {
    const Registry = buildSystem('default', { FormItem: factories.FormItem, Text: factories.Text });
    const container = await render(React.createElement(Registry.FormItem, null, 0));
    assert.equal(container.querySelector('[dir="auto"]').textContent, '0');
  });

});


describe('FormGroup: the labelled fieldset', function () {

  for (const template of TEMPLATE_NAMES) {
    test(template + ': legend paints the label cells a spacing step above the fields', async function () {
      const t = buildNative(template).tokens;
      const Registry = buildSystem(template, { FormGroup: factories.FormGroup, Text: factories.Text });
      const container = await render(React.createElement(Registry.FormGroup, { legendText: 'Legend' },
        React.createElement(Registry.Text, { text: 'field' })));
      const group = container.querySelector('[role="group"]');
      assert.notEqual(group, null);
      const legend = container.querySelector('[id]');
      assert.equal(legend.textContent, 'Legend');
      assert.equal(legend.style.fontSize, t['type.field_label'].fontSize + 'px');
      assert.equal(legend.style.color, cssValue('color', t['color.field_label']));
      assert.equal(legend.style.marginBottom, t['spacing.spacing_03'] + 'px');
      assert.equal(group.getAttribute('aria-labelledby'), legend.id);
    });
  }

  test('a disabled group draws the disabled label color', async function () {
    const t = buildNative('default').tokens;
    const Registry = buildSystem('default', { FormGroup: factories.FormGroup, Text: factories.Text });
    const container = await render(React.createElement(Registry.FormGroup, { legendText: 'Legend', disabled: true }));
    const legend = container.ownerDocument.getElementById(container.querySelector('[role="group"]').getAttribute('aria-labelledby'));
    assert.equal(legend.style.color, cssValue('color', t['color.field_label_disabled']));
  });

  test('a disabled group carries aria-disabled, removed when re-enabled', async function () {
    const Registry = buildSystem('default', { FormGroup: factories.FormGroup, Text: factories.Text });
    let setDisabled;
    function App () {
      const [disabled, setDisabledState] = React.useState(true);
      setDisabled = setDisabledState;
      return React.createElement(Registry.FormGroup, { legendText: 'Legend', disabled: disabled },
        React.createElement(Registry.Text, { text: 'field' }));
    }
    const container = await render(React.createElement(App));
    assert.equal(container.querySelector('[role="group"]').getAttribute('aria-disabled'), 'true');
    await act(async function () {
      setDisabled(false);
    });
    assert.equal(container.querySelector('[role="group"]').getAttribute('aria-disabled'), null);
  });

  test('a numeric zero child renders through the registry Text', async function () {
    const Registry = buildSystem('default', { FormGroup: factories.FormGroup, Text: factories.Text });
    const container = await render(React.createElement(Registry.FormGroup, { legendText: 'Legend' }, 0));
    const texts = Array.from(container.querySelectorAll('[dir="auto"]'));
    assert.equal(texts[texts.length - 1].textContent, '0');
  });

  test('a missing legendText still renders labelled by the legend id', async function () {
    const Registry = buildSystem('default', { FormGroup: factories.FormGroup, Text: factories.Text });
    const container = await render(React.createElement(Registry.FormGroup, { legendText: undefined }));
    const group = container.querySelector('[role="group"]');
    assert.notEqual(group.getAttribute('aria-labelledby'), null);
  });

});


describe('FormLabel: the label cells with no margin', function () {

  for (const template of TEMPLATE_NAMES) {
    for (const disabled of [false, true]) {
      test(template + (disabled ? ' / disabled' : '') + ': label type and color from the theme', async function () {
        const t = buildNative(template).tokens;
        const Registry = buildSystem(template, { FormLabel: factories.FormLabel, Text: factories.Text });
        const container = await render(React.createElement(Registry.FormLabel, { disabled: disabled, id: 'label-x' }, 'Street'));
        const label = container.querySelector('[dir="auto"]');
        assert.equal(label.textContent, 'Street');
        assert.equal(label.id, 'label-x');
        assert.equal(label.style.fontSize, t['type.field_label'].fontSize + 'px');
        assert.equal(label.style.color, cssValue('color', t['color.field_label' + (disabled ? '_disabled' : '')]));
        assert.equal(label.style.marginBottom, '');
      });
    }
  }

});
