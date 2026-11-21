// Info: The DatePicker's private calendar: the month header (the previous
// and next arrows around the month name and the year), the weekday row
// and the six-week day grid. It draws what its owner hands it - the shown
// month, the selection, the range, the bounds and today - and reports
// presses; it owns only which day holds keyboard focus. Not a registered
// component: the DatePicker's drawn half composes it.
//
// Behavior: one day is the tab stop (the selected day, else today, else
// the first of the month); arrows move it by a day or a week, PageUp and
// PageDown by a month, Home and End to the week's ends, Enter and Space
// select it, Escape asks the owner to close. A move off the shown month
// turns the month first.

// The names the calendar draws when the owner passes no locale: the
// months and the narrow weekday labels, Sunday first
const DEFAULT_LOCALE = Object.freeze({
  months: Object.freeze(['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']),
  weekdays: Object.freeze(['S', 'M', 'T', 'W', 'Th', 'F', 'S']),
  firstDayOfWeek: 0
});

// Six weeks of seven days: every month fits with its neighbours' days
const WEEKS = 6;
const DAYS_PER_WEEK = 7;


/********************************************************************
Build a calendar date from a year, a zero-based month and a day; the
day may run past either end of the month.

@param {Number} year  - Full year
@param {Number} month - Zero-based month
@param {Number} day   - Day, any integer

@return {Object} - { year, month, day } normalized
*********************************************************************/
export function makeDate (year, month, day) {

  const date = new Date(year, month, day);
  return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };

}


/********************************************************************
Order two calendar dates.

@param {Object} a - { year, month, day }
@param {Object} b - { year, month, day }

@return {Number} - Negative, zero or positive
*********************************************************************/
export function compareDates (a, b) {

  return (a.year - b.year) || (a.month - b.month) || (a.day - b.day);

}


/********************************************************************
Calendar factory.

@param {Object} ctx - Component context

@return {Function} - The Calendar component
*********************************************************************/
export default function createDatePickerCalendar (ctx) {

  const React = ctx.React;
  const Utils = ctx.Utils;
  const { Pressable, Text, View } = ctx.ReactNative;
  const { focusNode } = ctx.behaviors;

  const KEY_STEPS = Object.freeze({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -DAYS_PER_WEEK, ArrowDown: DAYS_PER_WEEK });


  /********************************************************************
  The key a date carries in the grid and the focus map.

  @param {Object} date - { year, month, day }

  @return {String} - `year-month-day`
  *********************************************************************/
  function keyOf (date) {
    return date.year + '-' + date.month + '-' + date.day;
  }


  /********************************************************************
  Whether a date lies outside the owner's bounds.

  @param {Object} date - { year, month, day }
  @param {Object} [min] - Earliest selectable date
  @param {Object} [max] - Latest selectable date

  @return {Boolean} - True when the date cannot be selected
  *********************************************************************/
  function outOfBounds (date, min, max) {
    return (Utils.isObject(min) && compareDates(date, min) < 0) || (Utils.isObject(max) && compareDates(date, max) > 0);
  }


  /********************************************************************
  Calendar component.

  @param {Object}   props
  @param {Object}   props.view        - { year, month } shown
  @param {Array}    props.selection   - [start, end] dates or nulls
  @param {Boolean}  [props.range]     - Draws the days between start and end
  @param {Object}   [props.minDate]   - Earliest selectable date
  @param {Object}   [props.maxDate]   - Latest selectable date
  @param {Object}   props.today       - Today's date
  @param {Object}   [props.locale]    - { months, weekdays, firstDayOfWeek }
  @param {Function} props.onPrevious  - Shows the previous month
  @param {Function} props.onNext      - Shows the next month
  @param {Function} props.onSelect    - Called with the pressed date
  @param {Function} [props.onEscape]  - Called on Escape inside the calendar

  @return {Object} - React element
  *********************************************************************/
  function Calendar (props) {

    const locale = Object.assign({}, DEFAULT_LOCALE, Utils.isObject(props.locale) ? props.locale : {});
    const view = props.view;
    const selection = props.selection;
    const start = selection[0] || null;
    const end = selection[1] || null;
    const today = props.today;

    // The tab stop: the selected day when it is shown, else today, else the first
    const shown = function (date) {
      return date !== null && date.year === view.year && date.month === view.month;
    };
    const initial = shown(start) ? start : shown(today) ? today : makeDate(view.year, view.month, 1);
    const [active, setActive] = React.useState(initial);
    const activeDate = shown(active) ? active : initial;
    const nodes = React.useRef({});
    const moved = React.useRef(false);

    // Focus follows a keyboard move once the new day is drawn
    React.useEffect(function () {
      if (moved.current === true) {
        moved.current = false;
        focusNode(nodes.current[keyOf(activeDate)]);
      }
    });

    // Move the tab stop, turning the month when the day leaves it
    const moveTo = function (date) {
      if (date.year * 12 + date.month < view.year * 12 + view.month) {
        props.onPrevious();
      } else if (date.year * 12 + date.month > view.year * 12 + view.month) {
        props.onNext();
      }
      moved.current = true;
      setActive(date);
    };

    const onKeyDown = function (event) {
      const key = event.key !== undefined ? event.key : (event.nativeEvent || {}).key;
      let next = null;
      if (KEY_STEPS[key] !== undefined) {
        next = makeDate(activeDate.year, activeDate.month, activeDate.day + KEY_STEPS[key]);
      } else if (key === 'PageUp' || key === 'PageDown') {
        const step = key === 'PageUp' ? -1 : 1;
        const last = new Date(activeDate.year, activeDate.month + step + 1, 0).getDate();
        next = makeDate(activeDate.year, activeDate.month + step, Math.min(activeDate.day, last));
      } else if (key === 'Home' || key === 'End') {
        const weekday = (new Date(activeDate.year, activeDate.month, activeDate.day).getDay() - locale.firstDayOfWeek + DAYS_PER_WEEK) % DAYS_PER_WEEK;
        next = makeDate(activeDate.year, activeDate.month, activeDate.day + (key === 'Home' ? -weekday : DAYS_PER_WEEK - 1 - weekday));
      } else if (key === 'Escape' && Utils.isFunction(props.onEscape)) {
        props.onEscape();
      }
      if (next !== null) {
        if (typeof event.preventDefault === 'function') {
          event.preventDefault();
        }
        moveTo(next);
      }
    };

    // The 42 days from the week holding the first of the month
    const lead = (new Date(view.year, view.month, 1).getDay() - locale.firstDayOfWeek + DAYS_PER_WEEK) % DAYS_PER_WEEK;
    const weeks = [];
    for (let w = 0; w < WEEKS; w = w + 1) {
      const days = [];
      for (let d = 0; d < DAYS_PER_WEEK; d = d + 1) {
        days.push(makeDate(view.year, view.month, 1 - lead + w * DAYS_PER_WEEK + d));
      }
      weeks.push(days);
    }

    const daySize = ctx.metric('DatePicker', 'daySize');
    const navSize = ctx.metric('DatePicker', 'navSize');
    const iconSize = ctx.metric('DatePicker', 'navIconSize');

    // One day cell: its part name says its state, as the reference's classes do
    const renderDay = function (date) {
      const outside = !shown(date);
      const disabled = outOfBounds(date, props.minDate, props.maxDate);
      const isStart = start !== null && compareDates(date, start) === 0;
      const isEnd = end !== null && compareDates(date, end) === 0;
      const selected = isStart || isEnd;
      const inRange = props.range === true && start !== null && end !== null && compareDates(date, start) > 0 && compareDates(date, end) < 0;
      const isToday = compareDates(date, today) === 0;
      const isActive = compareDates(date, activeDate) === 0;
      const part = selected ? 'selected' : inRange ? 'inRange' : outside ? 'outside' : isToday ? 'today' : 'day';
      const label = disabled ? 'date_picker_day_label_disabled'
        : selected ? 'date_picker_day_label_selected'
          : isToday ? 'date_picker_day_label_today'
            : outside ? 'date_picker_day_label_outside' : 'date_picker_label';
      return React.createElement(Pressable, {
        'aria-disabled': disabled ? true : undefined,
        'aria-label': locale.months[date.month] + ' ' + date.day + ', ' + date.year,
        'aria-selected': selected,
        dataSet: { part: part },
        disabled: disabled,
        key: keyOf(date),
        onFocus: function () {
          if (!isActive) {
            setActive(date);
          }
        },
        onPress: function () {
          props.onSelect(date);
        },
        ref: function (node) {
          nodes.current[keyOf(date)] = node;
        },
        role: 'gridcell',
        style: function (state) {
          const focus = selected
            ? ctx.focusRing('field', state, 0, { ringLeaf: 'date_picker_day_focus_selected', width: ctx.metric('DatePicker', 'dayFocusWidthSelected'), offset: -ctx.metric('DatePicker', 'dayFocusInsetSelected') })
            : ctx.focusRing('field', state, 0, { ringLeaf: 'date_picker_day_focus' });
          return [{
            alignItems: 'center',
            backgroundColor: selected ? ctx.color('date_picker_day_container_selected')
              : inRange ? ctx.color('date_picker_day_container_range')
                : state.hovered === true && !disabled ? ctx.color('date_picker_container_hover') : 'transparent',
            height: daySize,
            justifyContent: 'center',
            width: daySize
          }, focus];
        },
        tabIndex: isActive ? 0 : -1
      },
      React.createElement(Text, {
        style: [ctx.typeStyle(isToday && !selected ? 'date_picker_day_today' : 'date_picker_day'), { color: ctx.color(label) }]
      }, String(date.day)),
      // Today's mark sits under the number while today is not selected
      isToday && !selected ? React.createElement(View, {
        'aria-hidden': true,
        dataSet: { part: 'todayMark' },
        style: {
          alignSelf: 'center',
          backgroundColor: ctx.color('date_picker_day_label_today'),
          bottom: ctx.metric('DatePicker', 'todayMarkOffset'),
          height: ctx.metric('DatePicker', 'todayMarkSize'),
          position: 'absolute',
          width: ctx.metric('DatePicker', 'todayMarkSize')
        }
      }) : null);
    };

    // A month arrow: the press target, the hover fill and the glyph
    const renderNav = function (part, icon, onPress, label) {
      return React.createElement(Pressable, {
        'aria-label': label,
        dataSet: { part: part },
        key: part,
        onPress: onPress,
        role: 'button',
        style: function (state) {
          return [{
            alignItems: 'center',
            backgroundColor: state.hovered === true ? ctx.color('date_picker_container_hover') : 'transparent',
            height: navSize,
            justifyContent: 'center',
            width: navSize
          }, ctx.focusRing('field', state, 0, { ringLeaf: 'date_picker_day_focus' })];
        }
      }, React.createElement(ctx.Registry.Icon, { color: 'date_picker_nav_icon', name: icon, size: iconSize }));
    };

    const headerType = ctx.typeStyle('date_picker_month');

    // The calendar stacks its rows and centers them in its fixed box, as
    // the reference's column does: rows taller than the box overflow it
    // evenly at both ends
    return React.createElement(View, {
      dataSet: { part: 'calendar' },
      onKeyDown: onKeyDown,
      style: Object.assign({
        alignItems: 'center',
        backgroundColor: ctx.color('date_picker_calendar_container'),
        height: ctx.metric('DatePicker', 'calendarHeight'),
        justifyContent: 'center',
        overflow: 'hidden',
        paddingBottom: ctx.metric('DatePicker', 'calendarPaddingBottom'),
        paddingHorizontal: ctx.metric('DatePicker', 'calendarPaddingInline'),
        paddingTop: ctx.metric('DatePicker', 'calendarPaddingTop'),
        width: ctx.metric('DatePicker', 'calendarWidth')
      }, ctx.token('shadow.date_picker_calendar'))
    },
    React.createElement(View, { dataSet: { part: 'months' }, style: { alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between' } },
      renderNav('prevNav', 'chevron_left', props.onPrevious, 'Previous month'),
      React.createElement(View, {
        dataSet: { part: 'month' },
        style: { alignItems: 'center', flexDirection: 'row', height: ctx.metric('DatePicker', 'headerHeight') }
      },
      React.createElement(Text, {
        dataSet: { part: 'monthLabel' },
        style: [headerType, { color: ctx.color('date_picker_label'), marginHorizontal: ctx.metric('DatePicker', 'monthGap') }]
      }, locale.months[view.month]),
      React.createElement(View, {
        dataSet: { part: 'year' },
        style: { minWidth: ctx.metric('DatePicker', 'yearWidth'), padding: ctx.metric('DatePicker', 'yearPadding') }
      }, React.createElement(Text, { style: [headerType, { color: ctx.color('date_picker_label') }] }, String(view.year)))),
      renderNav('nextNav', 'chevron_right', props.onNext, 'Next month')),
    React.createElement(View, {
      dataSet: { part: 'weekdays' },
      style: { alignItems: 'center', alignSelf: 'stretch', flexDirection: 'row', height: ctx.metric('DatePicker', 'weekdayHeight') }
    }, locale.weekdays.map(function (name, index) {
      return React.createElement(Text, {
        dataSet: { part: 'weekday' },
        key: index,
        style: [ctx.typeStyle('date_picker_day'), { color: ctx.color('date_picker_label'), flexBasis: 0, flexGrow: 1, textAlign: 'center' }]
      }, locale.weekdays[(index + locale.firstDayOfWeek) % DAYS_PER_WEEK]);
    })),
    // Six rows share the grid's height, each laid out from its top, as
    // the reference's wrapping lines stretch over its fixed block size
    React.createElement(View, {
      dataSet: { part: 'days' },
      role: 'grid',
      style: { alignSelf: 'stretch', height: ctx.metric('DatePicker', 'daysHeight') }
    }, weeks.map(function (days, index) {
      return React.createElement(View, {
        key: index,
        role: 'row',
        style: { alignItems: 'flex-start', flexBasis: 0, flexDirection: 'row', flexGrow: 1, justifyContent: 'space-around' }
      }, days.map(renderDay));
    })));

  }

  return Calendar;

}
