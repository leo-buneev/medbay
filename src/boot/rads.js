import { installGlobalComponents, installGlobalMixins } from 'rads'

const translateFn = str => str
if (window && !window.loc) {
  window.String.prototype.loc = function() {
    return translateFn(this)
  }
  window.loc = function(strings, ...keys) {
    let string = strings.join('{var}')
    string = translateFn(string)
    for (let i = 0; i < keys.length; i++) {
      string = string.replace('{var}', keys[i])
    }
    return string
  }
}

export default ({ app, router, store, Vue }) => {
  installGlobalMixins()
  installGlobalComponents()
}
