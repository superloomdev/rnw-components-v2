// Info: Callout sample states for the showcase, the
// browser gates and the docs. Each entry is one rendered instance.

export default Object.freeze([
  Object.freeze({ label: 'info', props: Object.freeze({ actionButtonLabel: 'Go to page', kind: 'info', subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'warning', props: Object.freeze({ actionButtonLabel: 'Go to page', kind: 'warning', subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'infoLow', props: Object.freeze({ actionButtonLabel: 'Go to page', kind: 'info', lowContrast: true, subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'warningLow', props: Object.freeze({ actionButtonLabel: 'Go to page', kind: 'warning', lowContrast: true, subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'noAction', props: Object.freeze({ kind: 'info', subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'errorMapped', props: Object.freeze({ actionButtonLabel: 'Go to page', kind: 'error', subtitle: 'The notification body.', title: 'Notification title.' }) }),
  // A text short enough to stand beside its action below md, where the
  // other states wrap the action under theirs
  Object.freeze({ label: 'short', props: Object.freeze({ actionButtonLabel: 'Undo', kind: 'info', title: 'Saved.' }) })
]);
