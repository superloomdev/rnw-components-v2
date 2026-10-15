// Info: FormGroup sample states for the showcase, the browser gates and
// the docs: the labelled group, the disabled group and the group showing
// its message.

export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ legendText: 'Delivery address', children: Object.freeze(['Street', 'City']) }) }),
  Object.freeze({ label: 'disabled', props: Object.freeze({ legendText: 'Delivery address', disabled: true, children: Object.freeze(['Street', 'City']) }) }),
  Object.freeze({ label: 'message', props: Object.freeze({ legendText: 'Delivery address', message: true, messageText: 'Check the address for typos.', children: Object.freeze(['Street', 'City']) }) })
]);
