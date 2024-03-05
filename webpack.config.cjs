const path = require('path');

module.exports = {
  mode: 'production',
  entry: './js/index.js', // Your entry file
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'module',
    chunkFormat: 'module', // Specify the chunkFormat
  },
  experiments: {
    outputModule: true, // Enable experiments.outputModule
  },
  target: 'node'
}
