// Info: The structured list's table layout, the browser's automatic table
// width algorithm over measured cells (`structured-list/_structured-list.scss:31-38`
// `display: table`, `inline-size: 100%`; the probe's column widths,
// `recipes/probe/StructuredListWrapper.json`). Each cell hands in its
// min-content and max-content widths, padding included; a column is the
// widest of its cells. A marker column is fixed at its width. Then, for a
// table of width `W`:
// - at least the columns' max-content sum: every column takes its max, and
//   the room left goes to the automatic columns in proportion to their max
//   (default 163.469 / 126.031 / 510.5 = 1.2779 x 127.922 / 98.625 / 399.5);
// - between the fixed columns' sum and that: the automatic columns grow
//   from their min toward their max in proportion to max - min (`wraps`);
// - below it: the fixed columns give up their room down to their min;
// - below the min sum the columns stay at their min and overflow.
// A cell's `max-inline-size: 36rem` caps its max-content contribution, not
// its column (`twoColumns`: 145.375 = 127.922 x 800 / (127.922 + 576), the
// long column drawn 654.625); its cell is queued
// (`control.structured_list_cell_max_width`), so until it lands no cap is
// applied and `wrapsAll` and `twoColumns` are expected gaps. Words break
// at a space and after a hyphen; a `noWrap` cell's min is its max.


/********************************************************************
The words a text can break into: split at white space, a hyphen kept on
the end of the part before it.

@param {Object} Utils - The shared utilities
@param {String} text  - The cell's text

@return {Array} - The unbreakable runs
*********************************************************************/
export function breakRuns (Utils, text) {

  const runs = [];
  for (const word of String(text).split(/\s+/)) {
    let rest = word;
    while (!Utils.isEmptyString(rest)) {
      const at = rest.indexOf('-');
      if (at === -1 || at === rest.length - 1) {
        runs.push(rest);
        break;
      }
      runs.push(rest.slice(0, at + 1));
      rest = rest.slice(at + 1);
    }
  }
  return runs.filter(function (run) {
    return !Utils.isEmptyString(run);
  });

}


/********************************************************************
The column widths for a table width.

@param {Array}  columns - [{ min, max, fixed }]: `fixed` a width or null
@param {Number} width   - The table width

@return {Array} - One width per column
*********************************************************************/
export function distributeColumns (columns, width) {

  const sum = function (values) {
    return values.reduce(function (total, value) {
      return total + value;
    }, 0);
  };
  const mins = columns.map(function (column) {
    return column.min;
  });
  const specified = columns.map(function (column) {
    return column.fixed === null ? column.min : Math.max(column.fixed, column.min);
  });
  const maxes = columns.map(function (column, index) {
    return column.fixed === null ? Math.max(column.max, column.min) : specified[index];
  });
  const automatic = columns.map(function (column) {
    return column.fixed === null;
  });

  // Room for every column's max: the rest grows the automatic columns
  // in proportion to their max (the fixed ones when there is none)
  if (width >= sum(maxes)) {
    const growing = automatic.some(function (flag, index) {
      return flag && maxes[index] > 0;
    })
      ? automatic
      : columns.map(function () {
        return true;
      });
    const share = sum(maxes.filter(function (value, index) {
      return growing[index];
    }));
    return maxes.map(function (value, index) {
      return growing[index] && share > 0 ? value + (width - sum(maxes)) * value / share : value;
    });
  }

  // Room for the fixed columns: the automatic ones grow from min to max
  if (width >= sum(specified)) {
    const spread = sum(maxes.map(function (value, index) {
      return automatic[index] ? value - mins[index] : 0;
    }));
    return specified.map(function (value, index) {
      return automatic[index] && spread > 0 ? value + (width - sum(specified)) * (maxes[index] - mins[index]) / spread : value;
    });
  }

  // Room for the mins: the fixed columns grow from min toward their width
  if (width >= sum(mins)) {
    const spread = sum(specified.map(function (value, index) {
      return value - mins[index];
    }));
    return mins.map(function (value, index) {
      return spread > 0 ? value + (width - sum(mins)) * (specified[index] - value) / spread : value;
    });
  }
  return mins;

}
