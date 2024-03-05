// webpack.config.js
const pack = require('./webpack.config');

module.exports = {
  ...pack,
  entry: './assets/js/index.watch.js', // Entry point of your application
}
