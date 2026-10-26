// Info: TagSet molecule. A row of tags that shows as many as fit and gathers
// the rest behind a `+n` overflow tag; the overflow tag opens an inverse
// popover listing them, and past ten a "view all" link opens a searchable
// dialog. `multiline` wraps every tag with no overflow. `maxVisible` caps the
// row. Fitting is measured with one `onLayout` pass over the container and
// each tag - no hidden sizing copies.

import SPEC from './spec.tag-set.js';


/********************************************************************
TagSet factory.

@param {Object} ctx - Component context

@return {Function} - The TagSet component
*********************************************************************/
export default function TagSet (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Text, View } = ctx.ReactNative;
  const { useEscapeKey } = ctx.behaviors;


  /********************************************************************
  One tag: a `DismissibleTag` when the entry names `onClose`, else a `Tag`
  of its type, carrying the set's gap as end and bottom margin.

  @param {Object}   tag      - { label, type?, onClose? }
  @param {Number}   index    - Position in the list
  @param {Number}   gap      - The `tag_set_gap` cell
  @param {Function} onLayout - The width recorder

  @return {Object} - React element
  *********************************************************************/
  function oneTag (tag, index, gap, onLayout) {

    const style = { marginBottom: gap, marginEnd: gap };
    const body = Utils.isFunction(tag.onClose)
      ? React.createElement(ctx.Registry.DismissibleTag, { onClose: tag.onClose, text: tag.label, type: tag.type })
      : React.createElement(ctx.Registry.Tag, { type: tag.type }, tag.label);
    return React.createElement(View, { key: index, onLayout: onLayout, style: style }, body);

  }


  /********************************************************************
  TagSet component.

  @param {Object} props - See `api.tag-set.js`

  @return {Object} - React element
  *********************************************************************/
  function TagSetComponent (props) {

    const tags = Utils.isArray(props.tags) ? props.tags : [];
    const gap = ctx.metric('TagSet', 'gap');
    const multiline = props.multiline === true;
    const cap = Utils.isNumber(props.maxVisible) ? props.maxVisible : tags.length;
    const align = Utils.isString(props.align) ? props.align : 'start';

    // Measured widths: the container and each tag. One layout pass; the
    // overflow tag's own seat is measured when it mounts
    const [containerWidth, setContainerWidth] = React.useState(-1);
    const widths = React.useRef({});
    const [overflowSeat, setOverflowSeat] = React.useState(-1);
    const [overflowOpen, setOverflowOpen] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);
    const [query, setQuery] = React.useState('');

    // The most tags that fit beside the overflow seat, capped by maxVisible;
    // every tag measured before a fit count is trusted
    const measured = !Utils.isEmptyArray(tags) && tags.every(function (tag, i) {
      return Utils.isNumber(widths.current[i]);
    });
    const measuredAll = measured === true && overflowSeat >= 0;
    let visible = tags.length;
    if (multiline !== true && measuredAll === true && containerWidth >= 0) {
      visible = 0;
      for (let k = 0; k <= Math.min(cap, tags.length); k++) {
        const hiding = tags.length - k;
        let width = 0;
        for (let i = 0; i < k; i++) {
          width += widths.current[i] + gap;
        }
        if (hiding > 0) {
          width += overflowSeat + gap;
        }
        if (width <= containerWidth) {
          visible = k;
        } else {
          break;
        }
      }
      if (Utils.isNumber(props.maxVisible)) {
        visible = Math.min(visible, cap);
      }
    }
    if (multiline === true) {
      visible = tags.length;
    }

    const shown = tags.slice(0, visible);
    const hidden = tags.slice(visible);
    const many = hidden.length > 10;
    const filtered = Utils.isEmptyString(query) ? tags : tags.filter(function (tag) {
      return tag.label.toLowerCase().indexOf(query.toLowerCase()) !== -1;
    });

    useEscapeKey(function () {
      setOverflowOpen(false);
    }, overflowOpen === true);

    // The overflow popover: the inverse cells, hidden tags as plain rows of
    // the compact body - or the tags themselves under overflowType `tag` -
    // and the view-all link past ten
    const overflowContent = React.createElement(View, { style: { padding: ctx.token('spacing.spacing_05') } },
      hidden.map(function (tag, i) {
        return props.overflowType === 'tag'
          ? React.createElement(View, { key: i, style: { marginBottom: gap, marginEnd: gap } },
            React.createElement(ctx.Registry.Tag, { type: 'high-contrast' }, tag.label))
          : React.createElement(Text, { key: i, style: [ctx.typeStyle('body_compact_01'), { color: ctx.color('tooltip_label') }] }, tag.label);
      }),
      many === true ? React.createElement(ctx.Registry.Link, {
        inverse: true,
        onPress: function () {
          setModalOpen(true);
          setOverflowOpen(false);
        },
        style: { marginTop: ctx.token('spacing.spacing_05') }
      }, Utils.isString(props.showAllTagsLabel) ? props.showAllTagsLabel : 'View all tags') : null);

    const overflowTag = !Utils.isEmptyArray(hidden) || measuredAll !== true
      ? React.createElement(View, {
        onLayout: function (e) {
          setOverflowSeat(e.nativeEvent.layout.width);
        },
        style: { marginBottom: gap, marginEnd: gap, opacity: !Utils.isEmptyArray(hidden) ? 1 : 0 }
      },
      React.createElement(ctx.Registry.OperationalTag, {
        onPress: function () {
          setOverflowOpen(overflowOpen !== true);
        },
        text: '+' + hidden.length
      }))
      : null;

    const justify = align === 'center' ? 'center' : align === 'end' ? 'flex-end' : 'flex-start';

    return React.createElement(View, {
      onLayout: function (e) {
        setContainerWidth(e.nativeEvent.layout.width);
      },
      style: { flexDirection: 'row', flexWrap: multiline === true ? 'wrap' : 'nowrap', justifyContent: justify, overflow: 'hidden' },
      testID: props.testID
    },
    shown.map(function (tag, i) {
      return oneTag(tag, i, gap, function (e) {
        widths.current[i] = e.nativeEvent.layout.width;
      });
    }),
    React.createElement(ctx.Registry.Popover, {
      caret: true,
      content: overflowContent,
      dropShadow: false,
      highContrast: true,
      onRequestClose: function () {
        setOverflowOpen(false);
      },
      open: overflowOpen === true
    },
    overflowTag),
    modalOpen === true ? React.createElement(ctx.Registry.Modal, {
      onClose: function () {
        setModalOpen(false);
      },
      open: true,
      passive: true,
      title: Utils.isString(props.allTagsModalTitle) ? props.allTagsModalTitle : 'All tags'
    },
    React.createElement(ctx.Registry.Search, {
      label: Utils.isString(props.allTagsModalSearchLabel) ? props.allTagsModalSearchLabel : 'Search all tags',
      onChangeText: setQuery
    }),
    React.createElement(View, { style: { flexDirection: 'row', flexWrap: 'wrap', marginTop: ctx.token('spacing.spacing_05') } },
      filtered.map(function (tag, i) {
        return oneTag(tag, i, gap);
      }))) : null);

  }

  TagSetComponent.displayName = 'TagSet';

  return TagSetComponent;

}

TagSet.spec = SPEC;
