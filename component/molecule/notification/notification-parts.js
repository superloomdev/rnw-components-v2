// Info: Shared notification parts for the family's owners (toast, inline,
// actionable, callout). One renderer draws the wrapping row: the
// container with its `notification_marker_<kind>` start border (the 1 px
// `notification_outline_<kind>` on the top, end and bottom under
// `lowContrast`, over `notification_background_<kind>`), the details -
// the kind's 20 px status glyph (the warning glyph's inner mark in
// `color.notification_warning_icon_inner`) beside the title and subtitle
// text block - then any inline action and the close seat in flow at the
// end. The insets come from the `notification` cells, never the spacing
// scale; the owner's spec sheet names the cell a seat reads (toast's own
// `toast` suffixed cells).
//
// Private to the family; nothing here is a registry row or a public
// export.


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

@return {Object} - { frame, icon, textBlock, close }
*********************************************************************/
export default function createNotificationParts (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;


  /********************************************************************
  The container: the marker, the fill and (under lowContrast) the kind
  outline, in a wrapping row at the owner's width.

  @param {Object}   opts     - { role, testID, kind, lowContrast, width, minHeight, level, shadow }
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
        borderStartColor: ctx.color('notification_marker_' + cellKind),
        borderStartWidth: opts.marker === false ? 0 : ctx.metric(opts.owner, 'markerWidth'),
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: opts.fluid === true ? opts.width : undefined,
        minHeight: ctx.metric(opts.owner, 'minHeight'),
        // Inline bands are `inline-size: 100%` capped at the cell; toast
        // bands take the cell outright
        width: opts.fluid === true ? '100%' : opts.width
      }, opts.level !== undefined ? opts.level : null]
    }, children);

  }


  /********************************************************************
  The details part: the icon plus the text block, with the details
  insets.

  @param {Object}   opts     - { owner, kind, lowContrast, iconTop }
  @param {Array}    children - The text block

  @return {Object} - React element
  *********************************************************************/
  function details (opts, children) {

    return React.createElement(View, {
      key: 'details',
      style: {
        flexBasis: 0,
        flexDirection: 'row',
        flexGrow: 1,
        flexShrink: 0,
        flexWrap: 'wrap',
        marginStart: ctx.metric(opts.owner, 'detailsInset'),
        marginEnd: ctx.metric(opts.owner, 'detailsInsetEnd'),
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
  caption rows.

  @param {Object}   opts     - { owner, paddingBottom }
  @param {Array}    children - The rows

  @return {Object} - React element
  *********************************************************************/
  function textBlock (opts, children) {

    return React.createElement(View, {
      key: 'textBlock',
      style: {
        flexBasis: 0,
        flexGrow: 1,
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

  @param {Object}   opts - { owner, kind, lowContrast, title, subtitle, caption }

  @return {Object} - React element
  *********************************************************************/
  function text (opts) {

    const textLeaf = opts.lowContrast === true ? 'text_primary' : 'notification_text';
    const rows = [];
    if (Utils.isString(opts.title)) {
      rows.push(React.createElement(Text, {
        key: 'title',
        style: [ctx.typeStyle('notification_title'), { color: ctx.color(textLeaf), marginEnd: ctx.metric(opts.owner, 'titleGap') }]
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
        style: [ctx.typeStyle('notification_body'), { color: ctx.color(textLeaf) }]
      }, opts.caption));
    }
    return React.createElement(View, {
      key: 'text',
      style: { flexDirection: 'row', flexWrap: 'wrap' }
    }, rows);

  }


  /********************************************************************
  The close seat: a ghost `close` IconButton at the row's end, its glyph
  `notification_close_icon` (primary ink under lowContrast), calling the
  owner's close request.

  @param {Object} opts - { owner, lowContrast, label, onPress }

  @return {Object} - React element
  *********************************************************************/
  function close (opts) {

    return React.createElement(ctx.Registry.IconButton, {
      fillActiveLeaf: null,
      fillHoverLeaf: null,
      icon: 'close',
      iconColor: opts.lowContrast === true ? 'icon_primary' : 'notification_close_icon',
      iconSize: ctx.metric(opts.owner, 'closeIconSize'),
      kind: 'ghost',
      label: Utils.isString(opts.label) ? opts.label : 'Close',
      onPress: opts.onPress,
      testID: 'notification-close'
    });

  }


  return { close: close, details: details, frame: frame, icon: icon, text: text, textBlock: textBlock };

}
