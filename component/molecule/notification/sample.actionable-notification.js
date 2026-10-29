// Info: ActionableNotification sample states for the showcase, the
// browser gates and the docs. Each entry is one rendered instance.

export default Object.freeze([
  Object.freeze({ label: 'inline', props: Object.freeze({ actionButtonLabel: 'Retry', inline: true, kind: 'error', subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'inlineLow', props: Object.freeze({ actionButtonLabel: 'Retry', inline: true, kind: 'error', lowContrast: true, subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'toast', props: Object.freeze({ actionButtonLabel: 'Retry', caption: 'The caption text.', kind: 'error', subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'toastLow', props: Object.freeze({ actionButtonLabel: 'Retry', caption: 'The caption text.', kind: 'error', lowContrast: true, subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'noClose', props: Object.freeze({ actionButtonLabel: 'Retry', hideCloseButton: true, inline: true, kind: 'error', subtitle: 'The notification body.', title: 'Notification title.' }) }),
  Object.freeze({ label: 'toastNoClose', props: Object.freeze({ actionButtonLabel: 'Retry', caption: 'The caption text.', hideCloseButton: true, kind: 'error', subtitle: 'The notification body.', title: 'Notification title.' }) })
]);
