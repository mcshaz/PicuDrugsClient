module.exports = {
  publicPath: process.env.NODE_ENV === 'staging'
    ? '/PicuDrugsClient/'
    : '/',
  pwa: {
    name: 'Children\'s Drug Calculator',
  },
  configureWebpack: {
    devtool: 'source-map',
  },
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
