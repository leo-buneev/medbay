import { startDevServer } from 'rads-server/dev'

/* workaround for jest https://github.com/standard-things/esm/issues/855 with node v13+ */
import module from 'module'
import fs from 'fs'
module.Module._extensions['.js'] = function(module, filename) {
  if (filename.endsWith('.js')) {
    module._compile(fs.readFileSync(filename, 'utf8'), filename)
  }
}

/* end workaround */
startDevServer({ functionsPath: __dirname })
