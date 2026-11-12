// Info: TreeView molecule. A hierarchical list of nodes that expand,
// collapse and select, walked by the keyboard: roving tab index over the
// visible enabled nodes, Up/Down/Home/End walk, Left/Right collapse,
// expand or move parent/child, Enter/Space select (Enter toggles a
// parent). Nodes read depth and selection from the family context.
//
// Behavior: `useControllableState` for `selected` and `active`; the tree
// keeps its visible-node order from its own data.
//
// Accessibility: `tree` role (with the visible label or
// `accessibilityLabel` when `hideLabel`), nodes are `treeitem`s with
// `aria-selected`/`aria-expanded`/`aria-disabled`/`aria-current`.
import SPEC from './spec.tree-view.js';
import createTreeContext from './tree-context.js';

export default function TreeView (ctx) {
  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { focusNode, useControllableState, useRovingTabIndex } = ctx.behaviors;
  const TreeContext = createTreeContext(ctx);

  function TreeViewComponent (props) {
    const nodes = Utils.isArray(props.nodes) ? props.nodes : [];
    const size = props.size === 'xs' ? 'xs' : 'sm';
    const selPair = useControllableState({ defaultValue: Utils.isArray(props.defaultSelected) ? props.defaultSelected : [], onChange: function (v) {
      if (typeof props.onSelect === 'function') {
        props.onSelect(v);
      }
    }, value: props.selected });
    const selected = selPair[0];
    const setSelected = selPair[1];
    const actPair = useControllableState({ defaultValue: props.defaultActive, onChange: undefined, value: props.active });
    const active = actPair[0];
    const setActive = actPair[1];
    // Expanded ids: internal state seeded from each node's `expanded`
    const [expandedIds, setExpandedIds] = React.useState(function () {
      const seeds = {};
      const walk = function (list) {
        list.forEach(function (n) {
          if (n.expanded === true) {
            seeds[n.id] = true;
          } if (Utils.isArray(n.children)) {
            walk(n.children);
          }
        });
      };
      walk(nodes);
      return seeds;
    });
    // Flatten the visible nodes (parents expanded) keeping depth and meta
    const flat = [];
    const walkNodes = function (list, depth, parentId) {
      list.forEach(function (n) {
        const kids = Utils.isArray(n.children) ? n.children : null;
        const isParent = Utils.isArray(kids) && !Utils.isEmptyArray(kids);
        flat.push({ node: n, depth: depth, parentId: parentId, isParent: isParent, index: flat.length, disabled: n.disabled === true, expanded: expandedIds[n.id] === true });
        if (isParent && expandedIds[n.id] === true) {
          walkNodes(kids, depth + 1, n.id);
        }
      });
    };
    walkNodes(nodes, 0, null);
    const enabledIndexes = flat.map(function (f, i) {
      return f.disabled ? -1 : i;
    }).filter(function (i) {
      return i >= 0;
    });
    const [focusIndex, setFocusIndex] = React.useState(0);
    const focusEnabled = enabledIndexes.indexOf(focusIndex) >= 0 ? focusIndex : (enabledIndexes[0] === undefined ? -1 : enabledIndexes[0]);
    // One ref object per flat index so the roving move can focus the row
    const refs = React.useRef(new Map()).current;
    const refFor = function (i) {
      if (!refs.has(i)) {
        refs.set(i, React.createRef());
      }
      return refs.get(i);
    };
    const enabledPos = enabledIndexes.indexOf(focusEnabled);
    const roving = useRovingTabIndex({
      activeIndex: enabledPos < 0 ? 0 : enabledPos,
      count: enabledIndexes.length,
      onActiveIndexChange: function (next) {
        const idx = enabledIndexes[next];
        if (idx === undefined) {
          return;
        }
        setFocusIndex(idx);
        const ref = refs.get(idx);
        if (ref && ref.current) {
          focusNode(ref.current);
        }
      },
      orientation: 'vertical'
    });
    const toggle = function (f) {
      if (!f.isParent) {
        return;
      }
      const next = Object.assign({}, expandedIds);
      next[f.node.id] = !next[f.node.id];
      setExpandedIds(next);
      if (typeof props.onToggle === 'function') {
        props.onToggle(f.node, next[f.node.id]);
      }
    };
    const select = function (f) {
      if (f.disabled) {
        return;
      }
      if (f.isParent) {
        toggle(f);
      } else {
        setSelected(props.multiselect === true ? (selected.includes(f.node.id) ? selected.filter(function (id) {
          return id !== f.node.id;
        }) : selected.concat(f.node.id)) : [f.node.id]);
      }
    };
    // Roving keyboard
    const stepFocus = function (dir) {
      if (Utils.isEmptyArray(enabledIndexes)) {
        return;
      }
      const pos = enabledIndexes.indexOf(focusEnabled);
      const next = enabledIndexes[(pos + dir + enabledIndexes.length) % enabledIndexes.length];
      setFocusIndex(next);

    };
    const context = { active: active, focusEnabled: focusEnabled, registerFocusable: function (i, fn) {
      flat[i].focus = fn;
    }, selected: selected, setActive: setActive, setFocusIndex: setFocusIndex, size: size, toggle: toggle, select: select };
    const onKeyDown = function (e) {
      const key = e.nativeEvent && e.nativeEvent.key ? e.nativeEvent.key : (e.key || '');
      const f = flat[focusEnabled];
      if (!f) {
        return;
      }
      if (key === 'ArrowDown') {
        e.preventDefault && e.preventDefault(); stepFocus(1);
      } else if (key === 'ArrowUp') {
        e.preventDefault && e.preventDefault(); stepFocus(-1);
      } else if (key === 'Home') {
        e.preventDefault && e.preventDefault(); setFocusIndex(enabledIndexes[0]);
      } else if (key === 'End') {
        e.preventDefault && e.preventDefault(); const li = enabledIndexes[enabledIndexes.length - 1]; setFocusIndex(li);
      } else if (key === 'ArrowRight') {
        e.preventDefault && e.preventDefault();
        if (f.isParent && f.expanded !== true) {
          toggle(f);
        } else if (f.isParent && f.expanded === true) {
          const childIndex = flat.findIndex(function (x) {
            return x.parentId === f.node.id;
          });
          if (childIndex >= 0 && !flat[childIndex].disabled) {
            setFocusIndex(childIndex);
          }
        }
      } else if (key === 'ArrowLeft') {
        e.preventDefault && e.preventDefault();
        if (f.isParent && f.expanded === true) {
          toggle(f);
        } else if (f.parentId !== null) {
          const parentIndex = flat.findIndex(function (x) {
            return x.node.id === f.parentId;
          });
          if (parentIndex >= 0) {
            setFocusIndex(parentIndex);
          }
        }
      } else if (key === 'Enter' || key === ' ') {
        e.preventDefault && e.preventDefault(); select(f);
      }
    };
    const labelNode = props.hideLabel === true
      ? null
      // The `cds--label` gap under the label (`form/_form.scss` margin-block-end
      // `$spacing-03`; probe: label 16 tall, tree 24 below its top)
      : React.createElement(Text, { style: [{ alignSelf: 'flex-start', color: ctx.color('field_label'), marginBottom: ctx.metric('TreeView', 'labelGap'), paddingEnd: ctx.metric('TreeView', 'labelPaddingEnd') }, ctx.typeStyle('field_label')] }, Utils.isString(props.label) ? props.label : null);
    const items = flat.map(function (f, i) {
      return React.createElement(ctx.Registry.TreeNode, {
        key: i, depth: f.depth, disabled: f.disabled, expanded: f.expanded, isParent: f.isParent,
        nodeId: f.node.id, label: f.node.label, icon: f.node.icon, href: f.node.href,
        index: i, onPress: function () {
          setFocusIndex(i); select(f);
        }, onFocus: function () {
          setFocusIndex(i);
        }, rootRef: refFor(i)
      });
    });
    return React.createElement(TreeContext.Provider, { value: context },
      React.createElement(View, {
        accessibilityRole: 'tree',
        accessibilityLabel: props.hideLabel === true ? (Utils.isString(props.accessibilityLabel) ? props.accessibilityLabel : props.label) : undefined,
        ariaLabelledBy: props.hideLabel === true ? undefined : 'tree-label',
        onKeyDown: function (e) {
          if (roving.containerProps && roving.containerProps.onKeyDown) {
            roving.containerProps.onKeyDown(e);
          }
          onKeyDown(e);
        },
        style: { position: 'relative' },
        testID: props.testID
      },
      labelNode,
      // `.cds--tree` paints nothing; each node paints its own container
      // (probe: the tree transparent, the nodes the container cell)
      React.createElement(View, { accessibilityRole: 'group', dataSet: { part: 'tree' }, role: 'group' }, items)));
  }

  TreeViewComponent.displayName = 'TreeView';
  return TreeViewComponent;
}
TreeView.spec = SPEC;
