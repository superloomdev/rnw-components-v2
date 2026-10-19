// Info: Slider sample states for the showcase, the browser gates and the
// docs. Each entry is one rendered instance: a label and the props it
// takes. Values are uncontrolled (`defaultValue`) so the showcase stays
// interactive; every state carries label 'Volume' and the 0..100 bounds
// unless the entry says otherwise.

// The row shrink-wraps at its min width plus bounds and the field, so the
// showcase, the walker and the browser gates lay its states out in a
// frame of this width
export const FRAME = Object.freeze({ width: 640 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Volume', defaultValue: 50 }) }),
  Object.freeze({ label: 'minimum', props: Object.freeze({ label: 'Volume', defaultValue: 0 }) }),
  Object.freeze({ label: 'quarter', props: Object.freeze({ label: 'Volume', defaultValue: 25 }) }),
  Object.freeze({ label: 'maximum', props: Object.freeze({ label: 'Volume', defaultValue: 100 }) }),
  Object.freeze({ label: 'hidden input', props: Object.freeze({ label: 'Volume', defaultValue: 50, hideTextInput: true }) }),
  Object.freeze({ label: 'hidden label', props: Object.freeze({ label: 'Volume', defaultValue: 50, hideLabel: true, accessibilityLabel: 'Volume' }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Volume', defaultValue: 50, invalid: true, invalidText: 'Invalid value' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Volume', defaultValue: 50, disabled: true }) }),
  Object.freeze({ label: 'fractional', props: Object.freeze({ label: 'Volume', min: -1, max: 1, step: 0.1, defaultValue: 0.2 }) })
]);
