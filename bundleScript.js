// bundleScript.js
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

// Create a compiler instance with the configuration
const compiler = webpack(webpackConfig);

module.exports.run = () => {
  return new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if (err) {
        console.error('build error', error)
        return rej(err)
      }

      const errors = stats.compilation.compiler._lastCompilation.errors
      if(errors && errors.length) {
        return rej(errors[0].message)
      }

      res(stats)
      // console.log('build done 22', )
      // console.log('build done', stats)
    })
  })
}
