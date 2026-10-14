// Info: ProgressStep molecule. One step of a ProgressIndicator: a state
// glyph beside the step's text over a connector line. The glyph answers
// the state - a warning while `invalid`, the hollow circle while
// `current`, a checkmark while `complete`, the dashed circle otherwise -
// and the line fills with the complete color once the step is reached.
// The text underlines itself while a clickable step is hovered or pressed
// and draws the upstream's custom outline while focused - it is not the
// family's focus ring, so it is drawn by hand under the same trigger rule.
// A `secondaryLabel` mounts as a second line under the text.
//
// Behavior: `useButton` on the pressable - a step is clickable while it
// has an `onPress` and is not `current`, as upstream drops the handler
// for the current step; a disabled step draws the disabled cells and
// leaves the tab order.
//
// Accessibility: a list item inside the indicator's list, holding a
// button named by the label and the state sentence; the state glyph is
// named by `description`.

import SPEC from './spec.progress-step.js';

const PCT = '%';

// The state sentences upstream's translation table writes (the visible
// text is the label; the sentence only names the button)
const MESSAGES = Object.freeze({
  complete: 'Complete',
  current: 'Current',
  incomplete: 'Incomplete',
  invalid: 'Invalid'
});


/********************************************************************
ProgressStep factory.

@param {Object} ctx - Component context

@return {Function} - The ProgressStep component
*********************************************************************/
export default function ProgressStep (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { useButton } = ctx.behaviors;


  /********************************************************************
  ProgressStep component.

  @param {Object} props - See `api.progress-step.js`

  @return {Object} - React element
  *********************************************************************/
  function ProgressStepComponent (props) {

    // Init the state flags; `invalid` overrides the rest, as the
    // reference's glyph does
    const current = props.current === true;
    const complete = props.complete === true;
    const invalid = props.invalid === true;
    const disabled = props.disabled === true;
    const vertical = props.vertical === true;
    const spaceEqually = props.spaceEqually === true;

    // Init the behavior on the pressable; the step's onPress is the
    // button's press, dropped while current, as upstream
    const clickable = typeof props.onPress === 'function' && !current;
    const button = useButton(Object.assign({}, props, {
      onPress: clickable ? props.onPress : undefined
    }));
    const state = button.state;
    const live = !disabled;

    // The pressable's name: the label and the state sentence, the
    // reference's assistive text
    const stateName = invalid ? 'invalid' : complete ? 'complete' : current ? 'current' : 'incomplete';
    const stepName = Utils.isString(props.label) ? props.label + ' ' + MESSAGES[stateName] : MESSAGES[stateName];

    // The glyph and its fill
    const iconName = invalid ? 'warning' : current ? 'incomplete' : complete ? 'checkmark_outline' : 'circle_dash';
    const iconLeaf = disabled ? 'progress_step_icon_disabled'
      : invalid ? 'progress_step_icon_invalid'
        : complete || current ? 'progress_step_icon'
          : 'progress_step_icon_incomplete';

    // The label's color: the reference's specificity order - disabled,
    // then a clickable step's press in the resting color, then the focus
    // color while the trigger shows, then a clickable step's hover color,
    // else the rest
    const focused = state.focused === true && (ctx.enum('feedback.focus_trigger') !== 'keyboard' || state.focusVisible === true);
    const labelLeaf = disabled ? 'progress_step_label_disabled'
      : live && clickable && state.pressed === true ? 'progress_step_label'
        : focused ? 'progress_step_label_focus'
          : live && clickable && state.hovered === true ? 'progress_step_label_hover'
            : 'progress_step_label';

    // The label's underline while a clickable step is hovered or pressed:
    // the reference's box-shadow line, drawn in the same cell the text
    // reads (the hover cell on hover, the resting cell on press)
    const underline = live && clickable && state.pressed === true ? '0 1px 0 0 ' + ctx.color('progress_step_label')
      : live && clickable && state.hovered === true ? '0 1px ' + ctx.color('progress_step_label_hover')
        : undefined;

    // The label's type: the family's type set at the reference's own
    // line-height ratio, at the hundredth the ratio lands on
    const labelType = ctx.typeStyle('progress_step_label');
    const labelLineHeight = Math.round(labelType.fontSize * ctx.metric('ProgressStep', 'labelLineHeight') * 100) / 100;

    // The line's color: filled once the step is reached, resting otherwise
    const lineLeaf = complete || current ? 'progress_step_line_complete' : 'progress_step_line';

    // The line's thickness: the cell, or the pair of transparent borders
    // the reference's box-sizing folds into it, whichever is wider
    const lineHeight = Math.max(ctx.metric('ProgressStep', 'lineWidth'), 2 * ctx.metric('ProgressStep', 'lineBorder'));
    const verticalLineWidth = Math.max(ctx.metric('ProgressStep', 'verticalLineWidth'), 2 * ctx.metric('ProgressStep', 'lineBorder'));

    // Render the step: the pressable row (glyph then text column), the
    // connector line over its edge; a list item in the indicator's list
    return React.createElement(View, {
      accessibilityRole: 'listitem',
      style: vertical
        ? { alignSelf: 'stretch', minHeight: ctx.metric('ProgressStep', 'verticalMinHeight') }
        : Object.assign({
          alignSelf: 'flex-start',
          flexDirection: 'row',
          minWidth: ctx.metric('ProgressStep', spaceEqually ? 'width' : 'minWidth'),
          width: ctx.metric('ProgressStep', 'width')
        }, spaceEqually ? { flexGrow: 1 } : {})
    },
    React.createElement(Pressable, Object.assign({}, button.rootProps, {
      accessibilityLabel: stepName,
      style: Object.assign({ flexDirection: 'row', outlineStyle: 'none' },
        vertical ? { alignSelf: 'flex-start', minHeight: ctx.metric('ProgressStep', 'verticalMinHeight') } : { width: 100 + PCT }),
      testID: props.testID
    }),
    React.createElement(ctx.Registry.Icon, {
      accessibilityLabel: Utils.isString(props.description) ? props.description : undefined,
      color: iconLeaf,
      name: iconName,
      size: ctx.metric('ProgressStep', 'iconSize'),
      style: Object.assign({ borderRadius: ctx.metric('ProgressStep', 'iconRadius') }, vertical
        ? { marginEnd: ctx.metric('ProgressStep', 'iconGap'), marginStart: ctx.metric('ProgressStep', 'iconGap'), marginTop: ctx.metric('ProgressStep', 'verticalIconTop') }
        : { marginEnd: ctx.metric('ProgressStep', 'iconGap'), marginTop: ctx.metric('ProgressStep', 'iconTop') })
    }),
    React.createElement(View, {
      style: { flexDirection: 'column' }
    },
    React.createElement(Text, {
      numberOfLines: vertical ? undefined : 1,
      style: Object.assign({}, labelType, {
        boxShadow: underline,
        color: ctx.color(labelLeaf),
        lineHeight: labelLineHeight,
        marginEnd: spaceEqually ? ctx.metric('ProgressStep', 'labelEndInset') : undefined,
        marginTop: vertical ? 0 : ctx.metric('ProgressStep', 'labelGap'),
        maxWidth: spaceEqually ? undefined : ctx.metric('ProgressStep', vertical ? 'labelMaxWidthVertical' : 'labelMaxWidth'),
        outlineColor: focused ? ctx.color('progress_step_label_focus') : undefined,
        outlineOffset: 0,
        outlineStyle: focused ? 'solid' : undefined,
        outlineWidth: focused ? ctx.metric('ProgressStep', 'focusWidth') : undefined,
        textOverflow: vertical ? undefined : 'ellipsis',
        transitionDuration: ctx.metric('ProgressStep', 'labelDuration') + 'ms',
        transitionProperty: 'box-shadow, color',
        transitionTimingFunction: 'cubic-bezier(' + ctx.metric('ProgressStep', 'labelEasing').join(', ') + ')',
        whiteSpace: vertical ? undefined : 'nowrap'
      })
    }, Utils.isString(props.label) ? props.label : ''),
    vertical && Utils.isString(props.secondaryLabel) && !Utils.isEmptyString(props.secondaryLabel)
      ? React.createElement(Text, {
        testID: 'progress-step-secondary',
        style: Object.assign({}, ctx.typeStyle('progress_step_secondary_label'), {
          color: ctx.color('progress_step_secondary_label'),
          width: 100 + PCT
        })
      }, props.secondaryLabel)
      : null),
    !vertical && Utils.isString(props.secondaryLabel) && !Utils.isEmptyString(props.secondaryLabel)
      ? React.createElement(Text, {
        testID: 'progress-step-secondary',
        style: Object.assign({}, ctx.typeStyle('progress_step_secondary_label'), {
          color: ctx.color('progress_step_secondary_label'),
          left: ctx.metric('ProgressStep', 'secondaryStart'),
          position: 'absolute',
          top: ctx.metric('ProgressStep', 'secondaryTop')
        })
      }, props.secondaryLabel)
      : null,
    React.createElement(View, {
      style: vertical
        ? {
          backgroundColor: ctx.color(lineLeaf),
          borderColor: 'transparent',
          borderWidth: ctx.metric('ProgressStep', 'lineBorder'),
          bottom: 0,
          left: 0,
          position: 'absolute',
          top: 0,
          width: verticalLineWidth
        }
        : {
          backgroundColor: ctx.color(lineLeaf),
          borderColor: 'transparent',
          borderWidth: ctx.metric('ProgressStep', 'lineBorder'),
          height: lineHeight,
          left: 0,
          position: 'absolute',
          top: 0,
          width: spaceEqually ? 100 + PCT : ctx.metric('ProgressStep', 'width')
        }
    })));

  }

  ProgressStepComponent.displayName = 'ProgressStep';

  return ProgressStepComponent;

}

ProgressStep.spec = SPEC;
