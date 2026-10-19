// Info: PasswordInput sample states for the showcase, the browser gates
// and the docs: the states the references draw.

// A field fills the width its container gives it, so the showcase, the
// walker and the browser gates lay its states out in a frame of this width
export const FRAME = Object.freeze({ width: 320 });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ label: 'Password', placeholder: 'Enter password' }) }),
  Object.freeze({ label: 'filled', props: Object.freeze({ label: 'Password', value: 'secret' }) }),
  Object.freeze({ label: 'visible', props: Object.freeze({ label: 'Password', value: 'secret', visible: true }) }),
  Object.freeze({ label: 'helper', props: Object.freeze({ label: 'Password', placeholder: 'Enter password', helperText: 'Use at least 8 characters' }) }),
  Object.freeze({ label: 'invalid', props: Object.freeze({ label: 'Password', value: 'secret', invalid: true, invalidText: 'Passwords do not match' }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ label: 'Password', value: 'secret', disabled: true }) }),
  Object.freeze({ label: 'small', props: Object.freeze({ label: 'Password', value: 'secret', size: 'sm' }) }),
  Object.freeze({ label: 'large', props: Object.freeze({ label: 'Password', value: 'secret', size: 'lg' }) })
]);
