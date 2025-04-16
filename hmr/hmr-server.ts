import { run } from "taggedjs-cli/bin/hmr-server/hmr-server"
import webpackConfig from '../webpack.config.js'

run( webpackConfig as any )
