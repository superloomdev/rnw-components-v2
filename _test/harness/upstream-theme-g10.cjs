// Info: The mobile upstream imports its light theme from a source path the
// hoisted theme package no longer ships; this maps that path to the same
// theme's published token object. Not product code; a bundling shim.
module.exports = require('@carbon/themes').g10;
