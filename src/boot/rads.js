import { installGlobalComponents, installGlobalMixins } from 'rads'

// eslint-disable-next-line
String.prototype.loc = str => str

export default ({ app, router, store, Vue }) => {
  installGlobalMixins()
  installGlobalComponents()
}
