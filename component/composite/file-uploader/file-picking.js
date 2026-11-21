// Info: How the FileUploader family picks files, shared by the button, the
// drop container and the uploader. The host's `adapters.FilePicker`, a
// function (`FilePicker({ accept, multiple })` -> a promise of
// `{ name, size, type }` entries), wins; without it a document's hidden file input stands in;
// without either, picking is unavailable: the picking rows draw disabled
// and report `adapter_missing`. Validation marks an entry
// `invalidFileType` when it is larger than `maxFileSize` or, where an
// accept list is given, its type and extension are both outside it.
// Module-level helpers, no component.


/********************************************************************
Build the picking helpers for one component system.

@param {Object} ctx - Component context

@return {Object} - { available, pick, report, validate }
*********************************************************************/
export default function createFilePicking (ctx) {

  const Utils = ctx.Utils;
  const { canPickFiles, pickFiles } = ctx.behaviors;
  const Adapter = ctx.adapters.FilePicker;
  const hosted = Utils.isFunction(Adapter);


  /********************************************************************
  Whether this host can pick files.

  @return {Boolean} - True with the adapter or a document
  *********************************************************************/
  function available () {
    return hosted || canPickFiles();
  }


  /********************************************************************
  Open the host's chooser.

  @param {Object} options - { accept, multiple }

  @return {Promise<Array|null>} - The chosen entries
  *********************************************************************/
  function pick (options) {
    return hosted ? Adapter(options) : pickFiles(options);
  }


  /********************************************************************
  Report a host that cannot pick, once per call site's render.

  @param {String} component - The reporting component's name

  @return {void}
  *********************************************************************/
  function report (component) {
    if (!available()) {
      ctx.diagnostic({ code: 'adapter_missing', adapter: 'FilePicker', component: component });
    }
  }


  /********************************************************************
  Mark the entries a picker or a drop added that break its rules.

  @param {Array}  entries          - [{ name, size, type }]
  @param {Object} rules            - { accept, maxFileSize, pattern }
  @param {Array}  [rules.accept]   - Types and extensions; empty accepts all
  @param {Number} [rules.maxFileSize] - Largest size in bytes
  @param {String} [rules.pattern]  - The extension's expression

  @return {Array} - The entries, each with `invalidFileType` when it breaks a rule
  *********************************************************************/
  function validate (entries, rules) {
    const accept = Array.isArray(rules.accept) ? rules.accept : [];
    const pattern = new RegExp(Utils.isString(rules.pattern) ? rules.pattern : '\\.[0-9a-z]+$', 'i');
    return (Array.isArray(entries) ? entries : []).map(function (entry) {
      const tooLarge = Utils.isNumber(rules.maxFileSize) && entry.size > rules.maxFileSize;
      const match = pattern.exec(entry.name || '');
      const extension = match === null ? null : match[0].toLowerCase();
      const refused = !Utils.isEmptyArray(accept) && !Utils.inArray(accept, entry.type) && (extension === null || !Utils.inArray(accept, extension));
      return tooLarge || refused ? Object.assign({}, entry, { invalidFileType: true }) : entry;
    });
  }


  return {
    available: available,
    pick: pick,
    report: report,
    validate: validate
  };

}
