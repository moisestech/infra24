// Next 15's deprecated next lint adapter passes options incompatible with
// flat config. Run ESLint directly with the existing legacy rules and the
// same standard application directories (no rule suppression).
import { existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
const require = createRequire(import.meta.url)
const cli = join(dirname(require.resolve('eslint/package.json')), 'bin/eslint.js')
const dirs = ['app','pages','components','lib','src'].filter(existsSync)
if (!dirs.length) throw Error('No application directories to lint')
const result = spawnSync(process.execPath, [cli,'--ext','.js,.jsx,.ts,.tsx',...dirs], {
  stdio:'inherit',
  env:{...process.env,ESLINT_USE_FLAT_CONFIG:'false'}
})
if (result.error) throw result.error
process.exitCode = result.status ?? 1
