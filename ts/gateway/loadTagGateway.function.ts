import { Wrapper, Tag, TagChildrenInput, TagComponent } from "taggedjs"
import { initWebComponents } from "./gateway.web.component.js"
import { gateways, getTagId } from "./tagGateway.utils.js"
import { TagGatewayComponent } from "./tagGateway.function.js"

let hasInitWebComponents = false

export function loadTagGateway(
  component: TagGatewayComponent, // TagComponent | ((props?: any, children?: TagChildrenInput) => Tag)
) {
  if(!hasInitWebComponents) {
    try {
      initWebComponents()
    } catch(err) {
      throw err
    }
    
    hasInitWebComponents = true
  }

  const id = getTagId(component as unknown as Wrapper)
  gateways[id] = gateways[id] || {
    gates: [],
    tagComponent: component
  }

  gateways[id].tagComponent = component
  
  return id
}
