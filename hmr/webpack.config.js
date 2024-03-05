// webpack.config.js
const path = require('path');

module.exports = {
  mode: 'production',
  entry: path.resolve(__dirname,'web/hmr.js'), // Entry point of your application
  output: {
    filename: 'hmr.bundle.js',
    path: path.resolve(__dirname),
    libraryTarget: 'module',
    chunkFormat: 'module', // Specify the chunkFormat
  },
  experiments: {
    outputModule: true, // Enable experiments.outputModule
  },
  target: 'node'
};
