// Info: View sample states for the showcase, the browser gates and the docs.
// Each entry is one rendered instance: a label and the props it takes. A
// box has no intrinsic size, so every state pads itself to a visible one.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ padding: 'spacing_07', background: 'layer_01' }) }),
  Object.freeze({ label: 'bordered', props: Object.freeze({ padding: 'spacing_07', borderWidth: 'width_01', borderColor: 'border_strong_01' }) }),
  Object.freeze({ label: 'rounded', props: Object.freeze({ padding: 'spacing_07', background: 'layer_accent_01', radius: 'radius_08' }) }),
  Object.freeze({ label: 'layer 02', props: Object.freeze({ padding: 'spacing_07', background: 'layer_02' }) }),
  Object.freeze({ label: 'inverse', props: Object.freeze({ padding: 'spacing_07', background: 'background_inverse' }) }),
  Object.freeze({ label: 'pill', props: Object.freeze({ padding: 'spacing_05', background: 'layer_accent_01', radius: 'radius_max' }) })
]);
