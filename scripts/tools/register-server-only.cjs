/**
 * Allow tsx CLI scripts to import modules that use `import 'server-only'`.
 * Usage: tsx --require ./scripts/tools/register-server-only.cjs ...
 */
const Module = require('module')
const originalLoad = Module._load

Module._load = function (request, parent, isMain) {
  if (request === 'server-only') {
    return {}
  }
  return originalLoad.apply(this, arguments)
}
