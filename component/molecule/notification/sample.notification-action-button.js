// Info: NotificationActionButton sample states for the showcase, the
// browser gates and the docs. Each entry is one rendered instance.
// The inline action is drawn inside a high-contrast notification (_actionable-notification.scss:394-399 applies link-inverse there only); the band is its fill

const BAND = Object.freeze({ component: 'View', props: Object.freeze({ background: 'background_inverse', padding: 'spacing_05' }) });

export default Object.freeze([
  Object.freeze({ label: 'default', wrappers: Object.freeze([BAND]), props: Object.freeze({ label: 'Retry', variant: 'inline' }) })
]);
