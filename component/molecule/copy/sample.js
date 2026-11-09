// Info: CopyButton's showcase samples. `feedback` drives the press on
// mount (the showcase's `autopilot`), so the bubble reads the feedback
// text while it stays open.

export default Object.freeze([
  { label: 'default', props: { iconDescription: 'Copy to clipboard', onClick: function () {} } },
  { label: 'feedback', props: { iconDescription: 'Copy to clipboard', feedback: 'Copied!', feedbackTimeout: 60000, onClick: function () {} }, autopilot: 'press' },
  { label: 'small', props: { iconDescription: 'Copy to clipboard', size: 'sm', onClick: function () {} } },
  { label: 'large', props: { iconDescription: 'Copy to clipboard', size: 'lg', onClick: function () {} } }
]);
