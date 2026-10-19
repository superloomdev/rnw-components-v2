// Info: Single value collection reused by static, browser and native hosts.
export const FRAME = Object.freeze({ width: 320 });
const ITEMS = Object.freeze([
  Object.freeze({ value: 'alpha', label: 'Alpha' }),
  Object.freeze({ value: 'beta', label: 'Beta' }),
  Object.freeze({ value: 'gamma', label: 'Gamma' }),
  Object.freeze({ value: 'delta', label: 'Delta', disabled: true })
]);
const LONG_ITEMS = Object.freeze(Array.from({ length: 12 }, function (_, index) {
  return Object.freeze({ value: 'item-' + (index + 1), label: 'Item ' + (index + 1) });
}));
export default Object.freeze([
  Object.freeze({ label: 'default', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS } }),
  Object.freeze({ label: 'selected', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS, value: ['beta'] } }),
  Object.freeze({ label: 'uncontrolled selected', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS, defaultValue: ['beta'] } }),
  Object.freeze({ label: 'two selected', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS, value: ['alpha', 'beta'] } }),
  Object.freeze({ label: 'helper', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS, helperText: 'Choose any items' } }),
  Object.freeze({ label: 'invalid', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS, value: ['beta'], invalid: true, invalidText: 'Invalid value' } }),
  Object.freeze({ label: 'disabled', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS, value: ['alpha', 'beta'], disabled: true } }),
  Object.freeze({ label: 'small', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS, value: ['beta'], size: 'sm' } }),
  Object.freeze({ label: 'large', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS, value: ['beta'], size: 'lg' } }),
  Object.freeze({ label: 'unlabelled', props: { accessibilityLabel: 'Choice', placeholder: 'Choose', items: ITEMS, value: ['beta'] } }),
  Object.freeze({ label: 'long list', props: { label: 'Choice', placeholder: 'Choose', items: LONG_ITEMS } }),
  Object.freeze({ label: 'open', props: { label: 'Choice', placeholder: 'Choose', items: ITEMS, value: ['beta'], open: true }, cell: false })
]);
