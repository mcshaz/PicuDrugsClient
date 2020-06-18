module.exports = {
  publicPath: process.env.VUE_APP_BASE_ROUTE || '/',
  pwa: {
    name: 'Children\'s Drug Calculator',
  },
  configureWebpack: {
    devtool: 'source-map',
  },
  chainWebpack: config => {
    config.module.rule('pdf')
      .test(/\w\.pdf$/)
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/pdf/[name].[hash:8].[ext]',
      });
  },
  transpileDependencies: ['pdf-lib'],
  productionSourceMap: false,
};
// https://cli.vuejs.org/config/#publicpath
/*
process.env.VUE_APP_VERSION = require('./package.json').version;

const nodeExternals = require('webpack-node-externals')
module.exports = {
  // ...
  externals: [nodeExternals()]
}
  pages: process.env.NODE_ENV !== 'test' ? void 0 : {
    testPolyfills:'./tests/test_resources/testPolyfills.js'
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'test') {
      config.entry('app').add('./src/main.ts');
    }
  }
*/
