import glob from 'glob'
import path from 'path'

function getDirectoryModules() {
  try {
    // Webpack
    const requireContext = require.context('./', true, /\.[^/.]+$/)
    return requireContext.keys().reduce((acc, v) => {
      const match = /.*?([^/.]+)\.([^/]+)$/gi.exec(v)
      const filenameWithoutExtension = match[1]
      if (filenameWithoutExtension === 'entities') return acc
      const m = requireContext(v)
      acc[filenameWithoutExtension] = m.default || m
      return acc
    }, {})
  } catch (e) {
    if (!e.message.includes('require.context')) throw e
    // Node.js
    return glob.sync(path.resolve(__dirname, '**/*.*')).reduce((acc, v) => {
      const match = /([^/.]+)\.([^/]+)$/gi.exec(v)
      const filenameWithoutExtension = match[1]
      if (filenameWithoutExtension === 'entities') return acc
      // Need eval here to trick Webpack to not be scared by this require call
      // This code is executed only in Node.js (i.e. no-webpack) environment anyway
      // eslint-disable-next-line no-eval
      const m = eval('require')(v)
      acc[filenameWithoutExtension] = m.default || m
      return acc
    }, {})
  }
}

export default getDirectoryModules()
