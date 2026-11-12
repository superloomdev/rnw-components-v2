// Info: Card sample states for the showcase, the browser gates and the
// docs. Mirrors `recipes/probe/Card.mount.js`.
const ICONS = [{ icon: 'edit', label: 'Edit', onPress: function () {} }, { icon: 'trash', label: 'Delete', onPress: function () {} }];
const OVERFLOW = [{ label: 'Edit', onPress: function () {} }, { label: 'Delete', onPress: function () {} }];
export default Object.freeze([
  Object.freeze({ label: 'default', props: Object.freeze({ actionIcons: ICONS, children: 'Body content', description: 'Description', label: 'Label', primaryButtonText: 'Ghost button', title: 'Title' }) }),
  Object.freeze({ label: 'top', props: Object.freeze({ actionIcons: ICONS, actionsPlacement: 'top', children: 'Body content', description: 'Description', label: 'Label', title: 'Title' }) }),
  Object.freeze({ label: 'clickable', props: Object.freeze({ children: 'Body content', clickZone: 'one', description: 'Description', label: 'Label', onClick: function () {}, title: 'Title' }) }),
  Object.freeze({ label: 'titleLarge', props: Object.freeze({ actionIcons: ICONS, children: 'Body content', description: 'Description', label: 'Label', title: 'Title', titleSize: 'large' }) }),
  Object.freeze({ label: 'overflow', props: Object.freeze({ actionIcons: ICONS, actionsPlacement: 'top', children: 'Body content', description: 'Description', label: 'Label', overflowActions: OVERFLOW, title: 'Title' }) }),
  Object.freeze({ label: 'plain', props: Object.freeze({ children: 'Body content', description: 'Description', label: 'Label', title: 'Title' }) })
]);
