// bundleScript.js
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');

// Create a compiler instance with the configuration
const compiler = webpack(webpackConfig);

module.exports.run = () => {
  return new Promise((res, rej) => {
    compiler.run((err, stats) => {
      if (err) {
        return rej(err)
      }

      const outFilePath = path.resolve(__dirname,'hmr.bundle.js')

      const fileString = fs.readFileSync(outFilePath).toString()
      const newFileString = fileString.replace(/var .{1,2}=new Error\("Cannot find module '"\+(.+)\+"'"\);/g, 'return import($1);')
      fs.writeFileSync(outFilePath, newFileString)
      
      console.log('replaced')

      res(stats)
    })
  })
}
