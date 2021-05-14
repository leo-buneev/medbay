/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://v1.quasar.dev/quasar-cli/quasar-conf-js
/* eslint-env node */
const webpack = require('webpack')
const { startDevServerExpress } = require('rads-server/dev')

module.exports = function(/* ctx */) {
  return {
    // https://v1.quasar.dev/quasar-cli/supporting-ts
    supportTS: false,

    // https://v1.quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://v1.quasar.dev/quasar-cli/boot-files
    boot: ['rads'],

    // https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: ['app.scss'],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'hash', // available values: 'hash', 'history'

      // transpile: true,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      transpileDependencies: ['rads'],

      // rtl: false, // https://v1.quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://v1.quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      chainWebpack(chain) {},
      extendWebpack(cfg) {
        cfg.devtool = 'source-map'
        cfg.plugins.push(
          new webpack.ProvidePlugin({
            $: 'jquery',
            _: 'lodash',
            gql: 'graphql-tag',
            createGuid: ['uuid', 'v4'],
            tc: ['rads', 'tools'],
          }),
        )
        addSourceMaps(cfg)
      },
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 1487,
      open: true, // opens browser window automatically
      before: function(app, server, compiler) {
        startDevServerExpress({ app, server, compiler })
      },
    },

    // https://v1.quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      iconSet: 'material-icons', // Quasar icon set
      lang: 'en-us', // Quasar language pack
      config: {},

      // Possible values for "importStrategy":
      // * 'auto' - (DEFAULT) Auto-import needed Quasar components & directives
      // * 'all'  - Manually specify what to import
      importStrategy: 'auto',
      autoImportComponentCase: 'pascal',

      // For special cases outside of where "auto" importStrategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: [],
    },

    // animations: 'all', // --- includes all animations
    // https://v1.quasar.dev/options/animations
    animations: [],

    // https://v1.quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false,
    },

    // https://v1.quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: `Medbay`,
        short_name: `Medbay`,
        description: `Your one-stop shop for all medical needs`,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true,
    },

    // Full list of options: https://v1.quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options
        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',
        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: 'medbay',
      },

      // More info: https://v1.quasar.dev/quasar-cli/developing-electron-apps/node-integration
      nodeIntegration: true,

      extendWebpack(/* cfg */) {
        // do something with Electron main process Webpack cfg
        // chainWebpack also available besides this extendWebpack
      },
    },
  }
}

function addSourceMaps(config) {
  // eval-source-map is slightly worse but speeds up hot reload
  config.devtool = process.env.NODE_ENV === 'production' ? 'source-map' : 'eval-source-map'
  if (config.devtool === 'eval-source-map') {
    const CustomModuleIdsPlugin = require('custom-module-ids-webpack-plugin')
    config.plugins.push(
      new CustomModuleIdsPlugin({
        idFunction: function(libIdent, module) {
          if (libIdent.includes('!')) {
            // because of loader syntax full path looks like "../node_modules/loader.js!./src/Page.vue"
            // Presense of "node_modules" makes vscode-chrome-debugger think that its a part of node_modules.
            // We fix it by replacing all instances of "node_modules" in the path with different string.
            libIdent = libIdent.replace(/node_modules/gi, 'node-modules')
          }
          // Converts paths of type "file.vue?param=value" to "file.vue_param=value"
          // It is needed because when we have both "file.vue" and "file.vue?param=value",
          // vscode-chrome-debugger considers them the same file and gets very confused.
          return libIdent.replace(/[?&]/gi, '_')
        },
      }),
    )
  }
  config.output = config.output || {}
  config.output.devtoolModuleFilenameTemplate = info => {
    // Vue compilation process generates very chaotic file paths, so we attempt normalize them

    const normalizedResourcePath = info.resourcePath
      .replace(/^\//, '') // /some/path => some/path
      .replace(/^\.\//, '') // ./some/path => some/path
      .replace(/.*node_modules/, '../../node_modules') // /long/path/to/node_modules/pkg1 => ../../node_modules/pkg1

    if (
      normalizedResourcePath.includes('(webpack)') ||
      ['webpack/bootstrap', 'util', 'util (ignored)'].includes(normalizedResourcePath)
    ) {
      // Internal webpack dev server code
      return 'webpack-utils:///' + normalizedResourcePath
    }
    if (normalizedResourcePath.match(/\.vue$/) && info.allLoaders) {
      // Vue single file components compilation artifacts
      return 'webpack-generated:///' + normalizedResourcePath + '?' + info.hash
    }
    // Finally real source files that we need
    return 'sources:///' + normalizedResourcePath
  }
  config.output.devtoolFallbackModuleFilenameTemplate = 'webpack-generated-fallback:///[resource-path]?[hash]'
}
