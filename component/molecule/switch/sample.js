// Info: Toggle showcase states. Each state names the props one reference
// page cell renders with. The label and the on/off text are supplied, the
// small variant is sampled both ways because only it draws the mark.


/********************************************************************
Showcase states.

@type {Array}
*********************************************************************/
export default [

  { label: 'default', props: { label: 'Toggle element label', offText: 'Off', onText: 'On' } },
  { label: 'checked', props: { label: 'Toggle element label', checked: true, offText: 'Off', onText: 'On' } },
  { label: 'small', props: { label: 'Toggle element label', size: 'sm', offText: 'Off', onText: 'On' } },
  { label: 'small checked', props: { label: 'Toggle element label', size: 'sm', checked: true, offText: 'Off', onText: 'On' } },
  { label: 'disabled', props: { label: 'Toggle element label', disabled: true, offText: 'Off', onText: 'On' } },
  { label: 'disabled checked', props: { label: 'Toggle element label', checked: true, disabled: true, offText: 'Off', onText: 'On' } }

];
