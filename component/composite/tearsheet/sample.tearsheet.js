// Info: Tearsheet sample states for the showcase, the browser gates and
// the docs. Each entry renders the tearsheet open inside its cell: the
// scrim, the container, the header, the body and the action row are all
// measured. The cell is a stage for the layer: the body frames it and
// becomes the scrim's containing block.

export const FRAME = Object.freeze({ width: 1280, height: 720, stage: true });

const TWO = Object.freeze([
  Object.freeze({ label: 'Cancel', kind: 'secondary', onPress: function () {} }),
  Object.freeze({ label: 'Create', kind: 'primary', onPress: function () {} })
]);
const THREE = Object.freeze([
  Object.freeze({ label: 'Back', kind: 'ghost', onPress: function () {} }),
  Object.freeze({ label: 'Cancel', kind: 'secondary', onPress: function () {} }),
  Object.freeze({ label: 'Create', kind: 'primary', onPress: function () {} })
]);
const BASE = Object.freeze({ actions: TWO, children: 'Main content', description: 'Description used to describe the flow if need be.', label: 'Optional label', open: true, title: 'Title of the tearsheet' });

export default Object.freeze([
  Object.freeze({ label: 'default', props: BASE }),
  Object.freeze({ label: 'title', props: Object.freeze({ actions: TWO, children: 'Main content', open: true, title: 'Title of the tearsheet' }) }),
  Object.freeze({ label: 'passive', props: Object.freeze({ children: 'Main content', closeIconDescription: 'Close', description: 'Description used to describe the flow if need be.', label: 'Optional label', open: true, title: 'Title of the tearsheet' }) }),
  Object.freeze({ label: 'influencer', props: Object.assign({}, BASE, { influencer: 'Influencer' }) }),
  Object.freeze({ label: 'influencerWide', props: Object.assign({}, BASE, { influencer: 'Influencer', influencerWidth: 'wide' }) }),
  Object.freeze({ label: 'influencerRight', props: Object.assign({}, BASE, { influencer: 'Influencer', influencerPosition: 'right' }) }),
  Object.freeze({ label: 'navigation', props: Object.assign({}, BASE, { navigation: 'Navigation' }) }),
  Object.freeze({ label: 'threeActions', props: Object.assign({}, BASE, { actions: THREE }) }),
  Object.freeze({ label: 'lower', props: Object.assign({}, BASE, { verticalPosition: 'lower' }) })
]);
