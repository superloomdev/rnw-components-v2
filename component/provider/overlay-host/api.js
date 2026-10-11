// Info: OverlayHost public API, as data. The docs generator and the
// accessibility tests read this; the component implements exactly this and
// nothing more.

export default Object.freeze({
  name: 'OverlayHost',
  props: Object.freeze({
    children: { type: 'node', required: false, description: 'The app the host wraps; overlay components inside it render their layers through the host. A bare string renders through the registry Text, as a raw string beside the View layer root crashes a native render.' },
    testID: { type: 'string', required: false, description: 'Test identifier forwarded to the layer root.' }
  }),
  kinds: Object.freeze([]),
  variants: Object.freeze([]),
  tokens: Object.freeze([]),
  colors: Object.freeze([])
});
