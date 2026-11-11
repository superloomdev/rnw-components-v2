// Info: ESLint flat config for rnw-components. Delegates to the shared
// @superloomdev/js-helper-eslint-config package via the `app` preset (JSX
// parsing, browser and Node globals). No per-module rule overrides are
// permitted - if the module cannot pass the shared config, the finding goes
// to the shared config, not to a local override. The preset already ignores
// `_test/**`, which is this repository's only test directory.
import { app } from '@superloomdev/js-helper-eslint-config';

export default app;
