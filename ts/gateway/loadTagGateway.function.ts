import { Tag, TagChildrenInput, TagComponent } from "taggedjs"
import { initWebComponents } from "./gateway.web.component.js"
import { gateways, getTagId } from "./tagGateway.utils.js"

let hasInitWebComponents = false

export function loadTagGateway(
  component: TagComponent | ((props?: any, children?: TagChildrenInput) => Tag)
) {
  if(!hasInitWebComponents) {
    try {
      initWebComponents()
    } catch(err) {
      throw err
    }
    
    hasInitWebComponents = true
  }

  const id = getTagId(component)
  gateways[id] = gateways[id] || {
    gates: [],
    tagComponent: component
  }

  gateways[id].tagComponent = component
  
  return id
}
