// Info: InlineLoading molecule. A status mark beside a status text: while
// `active`, the small Loading turning in place; while `finished`, the
// checkmark in `inline_loading_success`; while `error`, the error mark in
// `inline_loading_error`; while `inactive`, no mark at all - as upstream
// mounts its `__animation` block only when a status draws one. A finished
// status calls `onSuccess` once, `successDelay` after it arrives.
//
// Behavior: none of its own - the row takes no input.
//
// Accessibility: a live region (`aria-live` off while inactive, assertive
// otherwise, as upstream); the mark is named by `iconDescription`, the
// status word by default ("loading" while `active`).

import SPEC from './spec.inline-loading.js';

// The four statuses
const STATUSES = Object.freeze(['inactive', 'active', 'finished', 'error']);
const PCT = '%';


/********************************************************************
InlineLoading factory.

@param {Object} ctx - Component context

@return {Function} - The InlineLoading component
*********************************************************************/
export default function InlineLoading (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  InlineLoading component.

  @param {Object} props - See `api.js`

  @return {Object} - React element
  *********************************************************************/
  function InlineLoadingComponent (props) {

    // Init the status, the text and the mark's name
    const status = Utils.inArray(STATUSES, props.status) ? props.status : 'active';
    const description = Utils.isString(props.description) && !Utils.isEmptyString(props.description) ? props.description : null;
    const iconLabel = Utils.isString(props.iconDescription) && !Utils.isEmptyString(props.iconDescription)
      ? props.iconDescription
      : status === 'active' ? 'loading' : status;

    // A finished status reports success once, after the delay
    const onSuccess = typeof props.onSuccess === 'function' ? props.onSuccess : null;
    const delay = Utils.isNumber(props.successDelay) ? props.successDelay : ctx.metric('InlineLoading', 'successDelay');
    React.useEffect(function () {
      if (status === 'finished' && onSuccess !== null) {
        const timer = setTimeout(onSuccess, delay);
        return function () {
          clearTimeout(timer);
        };
      }
      return undefined;
    }, [status, onSuccess, delay]);

    // The mark: the small Loading while active, the status icons for
    // finished and error, nothing while inactive - the seat mounts only
    // when a status draws a mark, as upstream's animation block does
    const mark = status === 'active'
      ? React.createElement(ctx.Registry.Loading, {
        active: true,
        description: iconLabel,
        small: true,
        withOverlay: false
      })
      : status === 'finished' || status === 'error'
        ? React.createElement(ctx.Registry.Icon, {
          accessibilityLabel: iconLabel,
          color: 'inline_loading_' + (status === 'finished' ? 'success' : 'error'),
          name: status === 'finished' ? 'checkmark_filled' : 'error_filled',
          size: ctx.metric('InlineLoading', 'iconSize')
        })
        : null;

    // Render the row: the mark seat, then the status text
    return React.createElement(View, {
      'aria-live': status === 'inactive' ? 'off' : 'assertive',
      testID: props.testID,
      style: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flexDirection: 'row',
        minHeight: ctx.metric('InlineLoading', 'minHeight'),
        width: 100 + PCT
      }
    },
    mark === null ? null : React.createElement(View, {
      testID: 'inline-loading-mark',
      style: { alignItems: 'center', justifyContent: 'center', marginEnd: ctx.metric('InlineLoading', 'gap') }
    }, mark),
    description === null ? null : React.createElement(Text, {
      style: [ctx.typeStyle('inline_loading_label'), { color: ctx.color('inline_loading_label') }]
    }, description));

  }

  InlineLoadingComponent.displayName = 'InlineLoading';

  return InlineLoadingComponent;

}

InlineLoading.spec = SPEC;
