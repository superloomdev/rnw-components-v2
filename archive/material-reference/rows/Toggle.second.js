// Info: component/molecule/switch/reference.js `second` block, verbatim from 7f2bd93 (Material retired, D41).

export default Object.freeze({
    origin: 'track',
    mount: function (React, upstream, props) {
      if (props.size === 'sm') {
        return null;
      }
      return React.createElement('md-switch', {
        selected: props.checked === true,
        disabled: props.disabled === true
      });
    },
    target: Object.freeze({ upstream: 'md-switch', ours: '[role="switch"]', upstreamFocus: 'md-switch >>> input' }),
    parts: Object.freeze({
      // The second reference paints its track and handle on `::before` skins whose
      // sizes are percentages, so the track compares as a pseudo by color and the
      // handle as its element by geometry; the pixels compare each handle fill
      track: Object.freeze({ upstream: 'md-switch >>> .track', pseudo: '::before', ours: 'div:has(> [role="switch"]) > div:nth-child(2) > div:nth-child(1)', measure: 'box', compare: ['x', 'y', 'borderTopWidth', 'backgroundColor', 'borderBottomColor'] }),
      handle: Object.freeze({ upstream: 'md-switch >>> .handle', ours: 'div:has(> [role="switch"]) > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)', measure: 'box', compare: ['x', 'y', 'width', 'height'] }),
      layer: Object.freeze({ upstream: 'md-switch >>> md-ripple', ours: 'div:has(> [role="switch"]) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)', measure: 'box', compare: ['x', 'y', 'width', 'height'] })
    }),
    omit: Object.freeze({
      root: Object.freeze({ reason: 'the second reference draws no field around the switch', upstream: '*:has(> md-switch)' }),
      label: Object.freeze({ reason: 'the second reference draws no label', upstream: 'md-switch ~ *, md-switch >>> label' }),
      ring: Object.freeze({ reason: 'the second reference draws its focus ring inside shadow, compared by the track state colors', upstream: 'md-switch >>> md-focus-ring' }),
      mark: Object.freeze({ reason: 'the mark is a small-variant drawing the second reference does not sample', upstream: 'md-switch >>> svg' }),
      stateText: Object.freeze({ reason: 'the second reference draws no on/off text', upstream: 'md-switch ~ *, md-switch >>> .on-off' })
    })
  });
