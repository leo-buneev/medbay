import { installGlobalComponents, installGlobalMixins } from 'rads'

export default ({ app, router, store, Vue }) => {
  installGlobalMixins()
  installGlobalComponents()
}
