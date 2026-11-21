// Info: FileUploader family node gates. The item draws at the size's
// height on the item fill with the name 16 in; an invalid item draws the
// 2 inset outline, its padding and the message under its rule in the
// helper type; Filename is the 12-inset seat holding the close button
// (with the error glyph flush before it), the checkmark or the spinner; a
// close press deletes by uuid in `edit` only; the button picks through
// the host adapter and names the chosen files; the uploader lists valid
// picks by name and reports oversize ones; the drop area takes a drop,
// marking refused files, and ignores it while disabled; the skeleton
// draws its two bars at the width cells.

import { afterEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { act } from 'react';

import * as factories from 'rnw-components/all';
import { Lib, buildNative, buildSystem } from './harness/system.js';
import { React, cleanup, cssValue, render } from './harness/render.js';

afterEach(cleanup);

const T = buildNative('carbon').tokens;
const ITEM = Object.freeze({ name: 'report.pdf', status: 'edit', iconDescription: 'Delete file' });


/********************************************************************
A registry whose host picks the given entries.

@param {Array} entries - What the stub chooser returns

@return {Object} - Registry
*********************************************************************/
function pickingRegistry (entries) {

  return buildSystem('carbon', factories, {
    lib: Object.assign({}, Lib, {
      adapters: {
        FilePicker: function () {
          return Promise.resolve(entries);
        }
      }
    })
  });

}


/********************************************************************
Click an element and let the pick's promise settle inside act.

@param {HTMLElement} element - Target
*********************************************************************/
async function clickAndSettle (element) {

  await act(async function () {
    element.click();
  });
  await act(async function () {
    await Promise.resolve();
  });

}


describe('FileUploaderItem and Filename: geometry', function () {

  test('the item draws at the size\'s height on the item fill with the name 16 in', async function () {
    const Registry = buildSystem('carbon', factories);
    for (const [size, cell] of [[undefined, 'size.size_large'], ['md', 'control.field_height'], ['sm', 'size.size_small']]) {
      const c = await render(React.createElement(Registry.FileUploaderItem, Object.assign({ size: size }, ITEM)));
      const item = c.querySelector('[data-part="item"]');
      assert.equal(item.style.minHeight, T[cell] + 'px', String(size));
      assert.equal(item.style.backgroundColor, cssValue('backgroundColor', T['color.file_uploader_item_container']));
      assert.equal(item.style.maxWidth, T['control.file_uploader_item_max_width'] + 'px');
      assert.equal(c.querySelector('[data-part="name"]').style.marginLeft, T['control.file_uploader_item_padding_start'] + 'px');
      await cleanup();
    }
  });

  test('an invalid item draws the inset outline, its padding and the message under its rule', async function () {
    const Registry = buildSystem('carbon', factories);
    const c = await render(React.createElement(Registry.FileUploaderItem, Object.assign({ invalid: true, errorSubject: 'Too large', errorBody: 'Pick a smaller file.' }, ITEM)));
    const item = c.querySelector('[data-part="item"]');
    assert.equal(item.style.outlineWidth, '2px');
    assert.equal(item.style.outlineWidth, T['control.file_uploader_item_outline_width'] + 'px');
    assert.equal(item.style.outlineOffset, -T['control.file_uploader_item_outline_width'] + 'px');
    assert.equal(item.style.outlineColor, cssValue('outlineColor', T['color.file_uploader_item_outline_invalid']));
    assert.equal(item.style.paddingTop, T['control.file_uploader_item_padding_invalid'] + 'px');
    const message = c.querySelector('[data-part="message"]');
    assert.equal(message.style.borderTopColor, cssValue('borderTopColor', T['color.file_uploader_error_rule']));
    assert.equal(message.style.paddingTop, T['control.file_uploader_error_padding_top'] + 'px');
    assert.equal(message.style.marginTop, T['control.file_uploader_item_row_gap'] + 'px');
    const title = c.querySelector('[data-part="errorTitle"]');
    assert.equal(title.style.color, cssValue('color', T['color.file_uploader_error_title']));
    assert.equal(title.style.fontSize, T['type.file_uploader_error_title'].fontSize + 'px');
    assert.equal(title.style.paddingLeft, T['control.file_uploader_error_padding_inline'] + 'px');
    // The medium row scales its padding and the message's inset
    await cleanup();
    const md = await render(React.createElement(Registry.FileUploaderItem, Object.assign({ size: 'md', invalid: true, errorSubject: 'Too large' }, ITEM)));
    assert.equal(md.querySelector('[data-part="item"]').style.paddingTop, T['control.file_uploader_item_padding_invalid_medium'] + 'px');
    assert.equal(md.querySelector('[data-part="message"]').style.paddingTop, T['control.file_uploader_error_padding_top_medium'] + 'px');
  });

  test('Filename is the inset seat: the close button, the flush error glyph, the checkmark', async function () {
    const Registry = buildSystem('carbon', factories);
    const c = await render(React.createElement(Registry.Filename, Object.assign({ invalid: true }, ITEM)));
    const seat = c.querySelector('[data-part="state"]');
    assert.equal(seat.style.paddingRight, T['control.file_uploader_state_padding_end'] + 'px');
    const close = c.querySelector('[data-part="close"]');
    assert.equal(close.getAttribute('aria-label'), 'Delete file - report.pdf');
    assert.equal(close.style.width, T['control.file_uploader_close_size'] + 'px');
    assert.equal(c.querySelector('[data-part="invalidIcon"]').style.marginRight, T['control.file_uploader_invalid_icon_gap'] + 'px');
    assert.equal(c.querySelector('[data-part="invalidIcon"]').style.marginRight, '0px');
    const done = await render(React.createElement(Registry.Filename, Object.assign({}, ITEM, { status: 'complete' })));
    assert.equal(done.querySelector('[data-part="complete"]').getAttribute('role'), 'img');
    assert.equal(done.querySelector('[data-part="close"]') === null, true);
  });

});


describe('FileUploader family: picking, listing and dropping', function () {

  test('a close press deletes by uuid in the edit status only', async function () {
    const Registry = buildSystem('carbon', factories);
    const calls = [];
    const c = await render(React.createElement(Registry.FileUploaderItem, Object.assign({ uuid: 'u1', onDelete: function (event, data) {
      calls.push(data);
    } }, ITEM)));
    await act(async function () {
      c.querySelector('[data-part="close"]').click();
    });
    assert.deepEqual(calls, [{ uuid: 'u1' }]);
  });

  test('the button picks through the host adapter and names the chosen files', async function () {
    const calls = [];
    const one = await render(React.createElement(pickingRegistry([{ name: 'a.jpg', size: 10, type: 'image/jpeg' }]).FileUploaderButton, { onChange: function (files) {
      calls.push(files.length);
    } }));
    const button = one.querySelector('[role="button"]');
    assert.equal(button.textContent, 'Add file');
    await clickAndSettle(button);
    assert.deepEqual(calls, [1]);
    assert.equal(one.querySelector('[role="button"]').textContent, 'a.jpg');
    await cleanup();
    const two = await render(React.createElement(pickingRegistry([{ name: 'a.jpg', size: 1 }, { name: 'b.jpg', size: 1 }]).FileUploaderButton, { multiple: true }));
    await clickAndSettle(two.querySelector('[role="button"]'));
    assert.equal(two.querySelector('[role="button"]').textContent, '2 files');
  });

  test('the uploader lists valid picks by name, reports oversize ones and deletes', async function () {
    const added = [];
    const Registry = pickingRegistry([{ name: 'a.jpg', size: 10 }, { name: 'big.jpg', size: 900 }]);
    const c = await render(React.createElement(Registry.FileUploader, {
      buttonLabel: 'Add file',
      filenameStatus: 'edit',
      iconDescription: 'Delete file',
      labelDescription: 'Max 500 bytes.',
      labelTitle: 'Upload',
      maxFileSize: 500,
      multiple: true,
      onAddFiles: function (data) {
        added.push(data.addedFiles.map(function (entry) {
          return entry.name + (entry.invalidFileType === true ? '!' : '');
        }));
      }
    }));
    assert.equal(c.querySelector('[data-part="description"]').style.marginBottom, T['control.file_uploader_description_gap'] + 'px');
    assert.equal(c.querySelector('[data-part="container"]').style.marginTop, T['control.file_uploader_list_gap'] + 'px');
    const button = c.querySelector('[role="button"]');
    await clickAndSettle(button);
    assert.deepEqual(added, [['a.jpg', 'big.jpg!']]);
    const names = function () {
      return Array.from(c.querySelectorAll('[data-part="name"]')).map(function (node) {
        return node.textContent;
      });
    };
    assert.deepEqual(names(), ['a.jpg']);
    // A second pick of the same name adds nothing
    await clickAndSettle(button);
    assert.deepEqual(names(), ['a.jpg']);
    await act(async function () {
      c.querySelector('[data-part="close"]').click();
    });
    assert.deepEqual(names(), []);
  });

  test('the drop area takes a drop, marks refused files, and ignores drops while disabled', async function () {
    const t = T;
    const Registry = buildSystem('carbon', factories);
    const added = [];
    const onAddFiles = function (event, data) {
      added.push(data.addedFiles.map(function (entry) {
        return entry.name + (entry.invalidFileType === true ? '!' : '');
      }));
    };
    const drop = async function (node) {
      const event = new Event('drop', { bubbles: true, cancelable: true });
      Object.defineProperty(event, 'dataTransfer', { value: { files: [{ name: 'a.jpg', size: 1, type: 'image/jpeg' }, { name: 'b.png', size: 1, type: 'image/png' }] } });
      await act(async function () {
        node.dispatchEvent(event);
      });
    };
    const c = await render(React.createElement(Registry.FileUploaderDropContainer, { accept: ['.jpg'], multiple: true, onAddFiles: onAddFiles }));
    const area = c.querySelector('[data-part="drop"]');
    assert.equal(area.style.minHeight, t['control.file_uploader_drop_height'] + 'px');
    assert.equal(area.style.paddingTop, t['control.file_uploader_drop_padding'] + 'px');
    assert.equal(area.style.borderTopStyle, 'dashed');
    assert.equal(area.style.borderTopColor, cssValue('borderTopColor', t['color.file_uploader_drop_outline']));
    await drop(area);
    assert.deepEqual(added, [['a.jpg', 'b.png!']]);
    await cleanup();
    const off = await render(React.createElement(Registry.FileUploaderDropContainer, { disabled: true, onAddFiles: onAddFiles }));
    await drop(off.querySelector('[data-part="drop"]'));
    assert.equal(added.length, 1);
  });

  test('the skeleton draws its two bars at the width cells, hidden from assistive tech', async function () {
    const Registry = buildSystem('carbon', factories);
    const c = await render(React.createElement(Registry.FileUploaderSkeleton, {}));
    const root = c.querySelector('[data-part="root"]');
    assert.equal(root.getAttribute('aria-hidden'), 'true');
    assert.equal(c.querySelector('[data-part="title"] > div > div > div').style.width, T['control.file_uploader_skeleton_title_width'] + 'px');
    assert.equal(c.querySelector('[data-part="description"] > div > div > div').style.width, T['control.file_uploader_skeleton_description_width'] + 'px');
  });

});
