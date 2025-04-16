import webpack from 'webpack'
import * as path from 'path'
import TerserPlugin from 'terser-webpack-plugin'
// import CompressionPlugin from 'compression-webpack-plugin'

import { fileURLToPath } from 'url'
import ResolveTsForJsPlugin from './ResolveTsForJsPlugin.class.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const out = path.resolve(__dirname, 'assets', 'dist')

export const webpackConfig = {
  mode: 'production', // development
  devtool: 'source-map',
  entry: './src/index.ts', // Entry point of your TypeScript application
  output: {
    filename: 'bundle.js',
    path: out,
    libraryTarget: 'module',
    chunkFormat: 'module',
  },
  experiments: {
    outputModule: true,
  },
  target: 'node',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      // taggedjs: path.resolve(__dirname, '../main/ts'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(js|ts)$/,  // Adjust the regex to match the files you're interested in
        // use: [path.resolve(__dirname, 'stringCastHtmlTaggedLoader', 'domCastHtmlTaggedLoader.ts')] // Use the path to your loader
        use: [path.resolve(__dirname, 'node_modules', 'taggedjs-cli', 'bin', 'stringCastHtmlTaggedLoader', 'domCastHtmlTaggedLoader.js')] // Use the path to your loader
      },
    ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    /*splitChunks: {
        chunks: 'all',
    },*/
  },
  plugins: [
    new ResolveTsForJsPlugin(),
    /*
    new CompressionPlugin({
        algorithm: 'gzip',
    }),
    */
  ]
} as any as webpack.Configuration


export default webpackConfig
