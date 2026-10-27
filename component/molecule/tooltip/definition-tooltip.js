// Info: DefinitionTooltip molecule. A dotted-underlined term that toggles a
// small inverse bubble with its definition: a Popover on the `tooltip` cells
// with the caret and no shadow. A press toggles; `openOnHover` also opens on
// the pointer and closes on leave; Escape and blur close. The trigger
// describes the bubble through `aria-describedby` and reports
// `aria-expanded`.

import SPEC from './spec.definition-tooltip.js';


/********************************************************************
DefinitionTooltip factory.

@param {Object} ctx - Component context

@return {Function} - The DefinitionTooltip component
*********************************************************************/
export default function DefinitionTooltip (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text } = ctx.ReactNative;
  const { useEscapeKey, useA11yId } = ctx.behaviors;


  /********************************************************************
  DefinitionTooltip component.

  @param {Object} props - See `api.definition-tooltip.js`

  @return {Object} - React element
  *********************************************************************/
  function DefinitionTooltipComponent (props) {

    const [open, setOpen] = React.useState(props.defaultOpen === true);
    const bubbleId = useA11yId('sl-definition-tooltip');
    const [hovered, setHovered] = React.useState(false);

    // Escape, blur and (in hover mode) the pointer leaving all close it
    const close = function () {
      setOpen(false);
    };
    useEscapeKey(close, open === true);

    // The term: the theme's body ink with the dotted underline that reads
    // the hover cell while hovered or focused
    const term = React.createElement(Pressable, {
      'aria-controls': bubbleId,
      'aria-describedby': bubbleId,
      'aria-expanded': open === true,
      onBlur: close,
      onFocus: function () {
        setHovered(true);
        setOpen(true);
      },
      onPointerEnter: function () {
        setHovered(true);
        if (props.openOnHover === true) {
          setOpen(true);
        }
      },
      onPointerLeave: function () {
        setHovered(false);
        if (props.openOnHover === true) {
          setOpen(false);
        }
      },
      onPress: function () {
        setOpen(open !== true);
      },
      style: {
        borderBottomColor: ctx.color(hovered === true ? 'definition_term_underline_hover' : 'definition_term_underline'),
        borderBottomStyle: 'dotted',
        borderBottomWidth: 1
      },
      testID: props.testID
    },
    // Upstream styles the term font-family: inherit / font-size: 100%,
    // which resolves to the ambient 16px body type - body02 in the
    // contract - so the term reads that cell
    React.createElement(Text, {
      style: [ctx.typeStyle('body02'), { color: ctx.color('text_primary') }]
    }, props.children));

    // The bubble: a Popover on the inverse cells carrying the definition,
    // padded by the definition cells; its id is what the trigger describes
    return React.createElement(ctx.Registry.Popover, {
      align: Utils.isString(props.align) ? props.align : 'bottom',
      autoAlign: props.autoAlign === true,
      caret: true,
      content: React.createElement(ctx.ReactNative.View, {
        nativeID: bubbleId,
        style: [ctx.typeStyle('body01'), {
          maxWidth: ctx.metric('DefinitionTooltip', 'maxWidth'),
          paddingBottom: ctx.metric('DefinitionTooltip', 'paddingBlock'),
          paddingInline: ctx.metric('DefinitionTooltip', 'paddingInline'),
          paddingTop: ctx.metric('DefinitionTooltip', 'paddingBlock')
        }]
      },
      React.createElement(Text, {
        style: [ctx.typeStyle('body01'), { color: ctx.color('tooltip_label') }]
      }, props.definition)),
      dropShadow: false,
      highContrast: true,
      onRequestClose: close,
      open: open === true
    },
    term);

  }

  DefinitionTooltipComponent.displayName = 'DefinitionTooltip';

  return DefinitionTooltipComponent;

}

DefinitionTooltip.spec = SPEC;
