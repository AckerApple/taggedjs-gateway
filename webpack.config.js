// webpack.config.js
const path = require('path');

const out = path.resolve(__dirname, 'assets', 'dist')
console.log('building ./assets/index.js', out)

module.exports = {
  mode: 'production',
  entry: './assets/index.js', // Entry point of your application
  output: {
    filename: 'bundle.js',
    path: out,
    libraryTarget: 'module',
    chunkFormat: 'module', // Specify the chunkFormat
  },
  experiments: {
    outputModule: true, // Enable experiments.outputModule
  },
  target: 'node'
};

console.log('done?')