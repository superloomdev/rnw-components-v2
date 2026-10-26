// Info: SkipToContent sample state for the showcase, the browser gates
// and the docs. The link is `position: absolute` at the top start of its
// containing block, so the body stages that block.

export const FRAME = Object.freeze({ width: 320, height: 64, stage: true });

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ children: 'Skip to main content', href: '#main-content' }) })
]);
