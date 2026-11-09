// Info: ModalFooter member. The dialog's actions row: under
// `anatomy.dialog_actions` `stretched` the buttons run edge to edge at the
// actions height, each `control.dialog_action_ratio` of the width (`_three`
// for the three-button layout, the row pushed to the end), padded
// `control.dialog_action_padding_top` / `_bottom`, the label at the top;
// `trailing` keeps the anchor's right-aligned gap row. Secondaries are
// `secondary` kind, the primary `primary` (`danger` under `danger`), and a
// loadingStatus other than `inactive` shows an InlineLoading in the
// primary. It must be composed inside ComposedModal.

import SPEC from './spec.modal-footer.js';

// The purity scan blocks a literal percent; the ratio floor spells it
// through a constant
const PCT = '%';


/********************************************************************
ModalFooter factory.

@param {Object} ctx - Component context

@return {Function} - The ModalFooter component
*********************************************************************/
export default function ModalFooter (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { View } = ctx.ReactNative;


  /********************************************************************
  ModalFooter component.

  @param {Object} props - See `api.modal-footer.js`

  @return {Object} - React element
  *********************************************************************/
  function ModalFooterComponent (props) {

    // Init the metrics and normalize the actions: secondary entries first,
    // then the primary last
    const metrics = {
      actionsGap: ctx.metric('ModalFooter', 'actionsGap'),
      actionsPadding: ctx.metric('ModalFooter', 'actionsPadding'),
      actionsTopSpace: ctx.metric('ModalFooter', 'actionsTopSpace'),
      height: ctx.metric('ModalFooter', 'height'),
      paddingBottom: ctx.metric('ModalFooter', 'paddingBottom'),
      paddingTop: ctx.metric('ModalFooter', 'paddingTop'),
      separatorWidth: ctx.token('border.width_01')
    };
    const focusedIndex = React.useState(null);
    const stretched = ctx.enum('anatomy.dialog_actions') === 'stretched';
    const actions = Utils.isArray(props.actions) ? props.actions : [];
    const secondaries = [];
    if (Utils.isArray(props.secondaryButtons)) {
      for (const entry of props.secondaryButtons) {
        secondaries.push({ disabled: entry.disabled === true, label: entry.buttonText, onPress: typeof entry.onClick === 'function' ? entry.onClick : props.onRequestClose });
      }
    } else if (Utils.isString(props.secondaryButtonText)) {
      secondaries.push({ label: props.secondaryButtonText, onPress: props.onRequestClose });
    }
    const loading = Utils.isString(props.loadingStatus) && props.loadingStatus !== 'inactive';
    const buttons = secondaries.map(function (entry) {
      return { disabled: entry.disabled, kind: 'secondary', label: entry.label, onPress: entry.onPress };
    });
    if (Utils.isString(props.primaryButtonText)) {
      buttons.push({ danger: props.danger === true, disabled: props.primaryButtonDisabled === true, kind: props.danger === true ? 'danger' : 'primary', label: props.primaryButtonText, loading: loading, onPress: props.onRequestSubmit });
    }
    actions.forEach(function (action, index) {
      buttons.push({ danger: props.danger === true, disabled: action.disabled === true, kind: Utils.isString(action.kind) ? action.kind : index === actions.length - 1 ? 'primary' : 'secondary', label: action.label, onPress: action.onPress });
    });
    if (Utils.isEmptyArray(buttons)) {
      return null;
    }
    const last = buttons.length - 1;
    const three = buttons.length === 3;
    const ratio = three ? ctx.token('control.dialog_action_ratio_three') : ctx.token('control.dialog_action_ratio');

    // Render the row: stretched splits the ratio, trailing rows the
    // anchor's ghost buttons to the end
    if (stretched) {
      return React.createElement(View, {
        dataSet: { part: 'modalFooter' },
        style: {
          alignItems: 'stretch',
          backgroundColor: ctx.color('dialog_container'),
          flexDirection: 'row',
          flexShrink: 0,
          height: metrics.height > 0 ? metrics.height : undefined,
          justifyContent: 'flex-end'
        }
      }, buttons.map(function (button, index) {
        // The button-set separator: `_button.scss:470-486` draws
        // `-1px 0 0 0 $button-separator` on every button but the first,
        // none beside a focused one, the disabled cell for a disabled
        // button - the same line ButtonSet draws
        const separator = focusedIndex[0] === index || focusedIndex[0] === index - 1 ? 'transparent'
          : button.disabled === true
            ? ctx.color('button_set_separator_disabled')
            : ctx.color('button_set_separator');
        const separatorStyle = { backgroundColor: separator, bottom: 0, position: 'absolute', start: -metrics.separatorWidth, top: 0, width: metrics.separatorWidth, zIndex: 1 };
        return React.createElement(View, {
          key: index,
          // A button is never narrower than its label: the ratio is a
          // floor, as upstream's flex basis under a min-content minimum
          style: { flexShrink: 0, minWidth: (ratio * 100) + PCT, position: 'relative' }
        },
        React.createElement(ctx.Registry.Button, {
          buttonRef: index === 0 ? props.secondaryRef : undefined,
          dangerDescription: button.danger === true ? props.dangerDescription : undefined,
          disabled: button.disabled,
          fill: true,
          kind: index === last ? button.kind : 'secondary',
          onBlur: function () {
            focusedIndex[1](function (previous) {
              return previous === index ? null : previous;
            });
          },
          onFocus: function () {
            focusedIndex[1](index);
          },
          onPress: button.onPress,
          paddingBottom: metrics.paddingBottom,
          paddingTop: metrics.paddingTop
        },
        button.loading === true ? React.createElement(ctx.Registry.InlineLoading, { description: props.loadingDescription }) : button.label),
        index === 0 ? null : React.createElement(View, { 'aria-hidden': true, style: separatorStyle }));
      }));
    }

    return React.createElement(View, {
      dataSet: { part: 'modalFooter' },
      style: {
        alignItems: 'center',
        backgroundColor: ctx.color('dialog_container'),
        flexDirection: 'row',
        gap: metrics.actionsGap,
        height: metrics.height > 0 ? metrics.height : undefined,
        justifyContent: 'flex-end',
        paddingBottom: metrics.actionsPadding,
        paddingInline: metrics.actionsPadding,
        paddingTop: metrics.actionsTopSpace
      }
    }, buttons.map(function (button, index) {
      return React.createElement(ctx.Registry.Button, {
        buttonRef: index === 0 ? props.secondaryRef : undefined,
        disabled: button.disabled,
        key: index,
        kind: index === last ? button.kind : 'ghost',
        onPress: button.onPress
      }, button.loading === true ? React.createElement(ctx.Registry.InlineLoading, { description: props.loadingDescription }) : button.label);
    }));

  }

  ModalFooterComponent.displayName = 'ModalFooter';

  return ModalFooterComponent;

}

ModalFooter.spec = SPEC;
