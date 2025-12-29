import { tagElement } from "taggedjs"
import { IsolatedApp } from "./isolatedApp.js"
import { App } from "./app.tag.js"

const app = () => {// app.ts
  console.info('⏳ attaching app to element...')
  const element = document.getElementsByTagName('app')[0]

  const locationSplit = window.location.pathname.split('/').filter(x => x)
  if(['isolated.html','index-static.html'].includes(locationSplit[0].toLowerCase())) {
      tagElement(IsolatedApp, element, {test:1})
      return
  }

  tagElement(App, element, {test:1})
}

app()

export default app