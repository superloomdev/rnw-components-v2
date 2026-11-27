// Info: Shared notification parts for the family's owners (toast, inline,
// actionable, callout). One renderer draws the wrapping row: the
// container with its `notification_marker_<kind>` start border (`support_<kind>`
// under `lowContrast`, as the glyph reads; the 1 px
// `notification_outline_<kind>` on the top, end and bottom under
// `lowContrast`, over `notification_background_<kind>`), the details -
// the kind's 20 px status glyph (the warning glyph's inner mark in
// `color.notification_warning_icon_inner`) beside the title and subtitle
// text block - then any inline action and the close seat in flow at the
// end. The insets come from the `notification` cells; the owner's spec
// sheet names the cell a seat reads (toast's own `toast` suffixed cells).
// Below `breakpoint.md` an inline band follows the reference's narrow
// rules with its spacing steps: the band is its 288 floor wide, the
// details keep `spacing_09` at their end, take their content's width and
// grow along their line, so the action stands beside a short text at the
// band's end and wraps under a longer one, and the close sits over that
// end inset. The content's width is the text block's: below md its basis
// is its content and it does not grow, the details hold the glyph and the
// text on one line (`display: flex`, no wrap), and they grow without
// shrinking under a cap of the line's width (see `details`)
// (`_inline-notification.scss:26-55,272-319,400-413`,
// `_actionable-notification.scss:44-58,327-337,605-627`; plan 0162 E13).
//
// Private to the family; nothing here is a registry row or a public
// export.


// The fluid band's full width, built from its number so no unit literal
// appears
const PCT = '%';


// The color cells each kind reads: the square and alt glyphs share their
// parent kind's cells
const CELL_KINDS = Object.freeze({
  'info-square': 'info',
  'warning-alt': 'warning'
});


// The status glyph each kind draws
const GLYPHS = Object.freeze({
  error: 'error_filled',
  'info-square': 'information_square_filled',
  info: 'information_filled',
  success: 'success',
  'warning-alt': 'warning_alt_filled',
  warning: 'warning_filled'
});


/********************************************************************
Build the part renderers for one owner. Called once inside the owning
factory, never during render.

@param {Object} ctx - Component context

@return {Object} - { close, details, frame, icon, text, textBlock, useNarrow }
*********************************************************************/
export default function createNotificationParts (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  Whether the window is below md, where an inline band follows its narrow
  rules; an unknown window is not narrow. A hook: call it in render.

  @return {Boolean} - True below md
  *********************************************************************/
  function useNarrow () {

    const width = ctx.behaviors.useViewportSize().width;
    return width > 0 && width < ctx.token('breakpoint.md');

  }


  /********************************************************************
  The container: the marker, the fill and (under lowContrast) the kind
  outline, in a wrapping row at the owner's width.

  @param {Object}   opts     - { role, testID, kind, lowContrast, width, minHeight, level, shadow, narrow }
  @param {Array}    children - [details, action?, close?]

  @return {Object} - React element
  *********************************************************************/
  function frame (opts, children) {

    const kind = opts.kind;
    const cellKind = Utils.isString(CELL_KINDS[kind]) ? CELL_KINDS[kind] : kind;
    const lowContrast = opts.lowContrast === true;
    const containerLeaf = lowContrast ? 'notification_background_' + cellKind : 'notification_container';
    const outlineLeaf = 'notification_outline_' + cellKind;
    return React.createElement(View, {
      key: 'frame',
      role: Utils.isString(opts.role) ? opts.role : undefined,
      testID: opts.testID,
      style: [{
        alignItems: 'stretch',
        backgroundColor: ctx.color(containerLeaf),
        borderRadius: ctx.metric(opts.owner, 'radius'),
        boxShadow: lowContrast ? 'inset 0px 0px 0px ' + ctx.metric(opts.owner, 'outlineWidth') + 'px ' + ctx.color(outlineLeaf) : undefined,
        borderStartColor: ctx.color(lowContrast ? 'support_' + cellKind : 'notification_marker_' + cellKind),
        borderStartWidth: opts.marker === false ? 0 : ctx.metric(opts.owner, 'markerWidth'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: opts.fluid === true ? (opts.narrow === true ? ctx.metric(opts.owner, 'minWidth') : opts.width) : undefined,
        minWidth: opts.fluid === true ? ctx.metric(opts.owner, 'minWidth') : undefined,
        minHeight: ctx.metric(opts.owner, 'minHeight'),
        // Inline bands are `inline-size: 100%` held between upstream's 288
        // floor (`minWidth`) and the cell's cap (`width`); toast bands take
        // the cell outright
        width: opts.fluid === true ? 100 + PCT : opts.width
      }, opts.level !== undefined ? opts.level : null]
    }, children);

  }


  /********************************************************************
  The details part: the icon plus the text block, with the details
  insets. They grow (`_actionable-notification.scss:324-328`). Below md
  their basis is their content: a text that fits beside the action shares
  its line and the action ends at the band's end, a longer text takes the
  line and the action wraps under it. They never shrink: a native layout
  gives the one item of a row that both grows and shrinks a zero basis,
  so the row never breaks after it. The browser shrinks an item to its
  line; here a cap of the line's width does that - the band's floor less
  the marker and the details' two insets. A content-sized text block
  (`contentSized`) keeps the icon's row from wrapping in every band, as
  upstream's flex details (`_inline-notification.scss:277-280`), so a long
  text shrinks beside the icon rather than dropping under it.

  @param {Object}   opts     - { owner, kind, lowContrast, iconTop, narrow, contentSized }
  @param {Array}    children - The text block

  @return {Object} - React element
  *********************************************************************/
  function details (opts, children) {

    // The line the details may fill below md
    const line = opts.narrow === true
      ? ctx.metric(opts.owner, 'minWidth') - ctx.metric(opts.owner, 'markerWidth') - ctx.metric(opts.owner, 'detailsInset') - ctx.token('spacing.spacing_09')
      : undefined;
    return React.createElement(View, {
      key: 'details',
      style: {
        flexBasis: opts.narrow === true ? 'auto' : 0,
        flexDirection: 'row',
        flexGrow: 1,
        flexShrink: 0,
        flexWrap: opts.narrow === true || opts.contentSized === true ? 'nowrap' : 'wrap',
        marginStart: ctx.metric(opts.owner, 'detailsInset'),
        marginEnd: opts.narrow === true ? ctx.token('spacing.spacing_09') : ctx.metric(opts.owner, 'detailsInsetEnd'),
        maxWidth: line,
        minWidth: 0
      }
    }, children);

  }


  /********************************************************************
  The kind's status glyph at the icon size; the warning glyph's inner
  mark takes its own cell.

  @param {Object}   opts - { owner, kind, iconTop }

  @return {Object} - React element
  *********************************************************************/
  function icon (opts) {

    const kind = opts.kind;
    const cellKind = Utils.isString(CELL_KINDS[kind]) ? CELL_KINDS[kind] : kind;
    return React.createElement(View, {
      key: 'icon',
      style: {
        marginEnd: ctx.metric(opts.owner, 'iconGap'),
        marginTop: Utils.isNumber(opts.iconTop) ? opts.iconTop : ctx.metric(opts.owner, 'iconTop')
      }
    },
    React.createElement(ctx.Registry.Icon, {
      color: opts.lowContrast === true ? 'support_' + cellKind : 'notification_marker_' + cellKind,
      name: GLYPHS[kind],
      size: ctx.metric(opts.owner, 'iconSize')
    }));

  }


  /********************************************************************
  The text block: the padded column holding the title, subtitle and
  caption rows. Below md its basis is its content and it does not grow,
  as the upstream text wrapper is a content-sized item of the details
  (`_actionable-notification.scss:351-355`): a native layout measures a
  growing block at the whole line and a zero-basis block as empty, and
  either hides the text's width from the details. From md a content-sized
  block (`contentSized`: the inline, actionable and callout bands) keeps
  that basis too, as upstream's text wrapper does not grow
  (`_inline-notification.scss:293-297`); the toast's grows, its details
  being a block (`_toast-notification.scss:237-240`).

  @param {Object}   opts     - { owner, paddingTop, paddingBottom, narrow, contentSized }
  @param {Array}    children - The rows

  @return {Object} - React element
  *********************************************************************/
  function textBlock (opts, children) {

    return React.createElement(View, {
      key: 'textBlock',
      style: {
        flexBasis: opts.narrow === true || opts.contentSized === true ? 'auto' : 0,
        flexGrow: opts.narrow === true || opts.contentSized === true ? 0 : 1,
        flexShrink: 1,
        minWidth: 0,
        paddingTop: Utils.isNumber(opts.paddingTop) ? opts.paddingTop : ctx.metric(opts.owner, 'textPaddingBlock'),
        paddingBottom: Utils.isNumber(opts.paddingBottom) ? opts.paddingBottom : ctx.metric(opts.owner, 'textPaddingBlock')
      }
    }, children);

  }


  /********************************************************************
  The title line: `type.notification_title` `notification_text` (primary
  text under lowContrast) with the title gap, and the subtitle in
  `type.notification_body` beside it on the same line box.

  @param {Object}   opts - { owner, kind, lowContrast, title, subtitle, caption, stacked }

  @return {Object} - React element
  *********************************************************************/
  function text (opts) {

    const textLeaf = opts.lowContrast === true ? 'text_primary' : 'notification_text';
    const stacked = opts.stacked === true;
    const rows = [];
    if (Utils.isString(opts.title)) {
      rows.push(React.createElement(Text, {
        key: 'title',
        style: [ctx.typeStyle('notification_title'), { color: ctx.color(textLeaf), marginEnd: stacked ? 0 : ctx.metric(opts.owner, 'titleGap') }]
      }, opts.title));
    }
    if (Utils.isString(opts.subtitle)) {
      rows.push(React.createElement(Text, {
        key: 'subtitle',
        style: [ctx.typeStyle('notification_body'), { color: ctx.color(textLeaf) }]
      }, opts.subtitle));
    }
    if (Utils.isString(opts.caption)) {
      rows.push(React.createElement(Text, {
        key: 'caption',
        style: [ctx.typeStyle('notification_body'), { color: ctx.color(textLeaf), paddingTop: ctx.token('spacing.spacing_06') }]
      }, opts.caption));
    }
    return React.createElement(View, {
      key: 'text',
      style: { flexDirection: stacked ? 'column' : 'row', flexWrap: stacked ? 'nowrap' : 'wrap' }
    }, rows);

  }


  /********************************************************************
  The close seat: a ghost `close` IconButton at the row's end, its glyph
  `notification_close_icon` (primary ink under lowContrast), calling the
  owner's close request.

  @param {Object} opts - { owner, lowContrast, label, onPress, narrow }

  @return {Object} - React element
  *********************************************************************/
  function close (opts) {

    const button = React.createElement(ctx.Registry.IconButton, {
      key: 'close',
      fillActiveLeaf: null,
      fillHoverLeaf: null,
      focusRingLeaf: opts.lowContrast === true ? 'focus' : 'focus_ring_inverse',
      icon: 'close',
      iconColor: opts.lowContrast === true ? 'icon_primary' : 'notification_close_icon',
      iconSize: ctx.metric(opts.owner, 'closeIconSize'),
      kind: 'ghost',
      label: Utils.isString(opts.label) ? opts.label : 'Close',
      onPress: opts.onPress,
      testID: 'notification-close'
    });
    // Below md the close sits at the band's top end over the details' end
    // inset (`_inline-notification.scss:400-413` static only from md)
    return opts.narrow === true ? React.createElement(View, { key: 'close', style: { end: 0, position: 'absolute', top: 0 } }, button) : button;

  }


  return { close: close, details: details, frame: frame, icon: icon, text: text, textBlock: textBlock, useNarrow: useNarrow };

}
