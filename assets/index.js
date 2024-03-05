console.log('loading...')
// export * from "./js/index.js"

import { tagElement } from "taggedjs"
import { App } from './js/app.component'

export { IsolatedApp } from './js/app.component'
export { hmr } from 'taggedjs'

const element = document.getElementsByTagName('app')[0]

if(element) {
  tagElement(App, element, {})
} else {
  console.warn('Could not find <app> tag element')
}
