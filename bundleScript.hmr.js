// bundleScript.js
const webpack = require('webpack');
const webpackConfig = require('./webpack.hmr.config.js');

// Create a compiler instance with the configuration
const compiler = webpack(webpackConfig);

module.exports.run = () => {
  return new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if (err) {
        return rej(err)
      }

      res(stats)
    })
  })
}
