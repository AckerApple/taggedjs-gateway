import { AnySupport } from "taggedjs"
import { initWebComponents } from "./gateway.web.component.js"
import { TagGateway, TagGatewayComponent, updateTagProps } from "./tagGateway.function.js"
import { updateFromTag } from "./updateFromTag.function.js"
import { gateways, tagGateways } from "./globals.js"

let hasInitWebComponents = false

/** Create the ability to put taggedjs content on document
 * - You will need to use <tag-element> or tagGateway()
 */
export function loadTagGateway(
  component: TagGatewayComponent, // TagComponent | ((props?: any, children?: TagChildrenInput) => Tag)
  id: string,
): TagGateway {
  if(!hasInitWebComponents) {
    try {
      initWebComponents()
    } catch(err) {
      throw err
    }
    
    hasInitWebComponents = true
  }

  if( tagGateways[id] ) {
    return tagGateways[id]
  }

  // maybe old deprecated memory?
  gateways[id] = gateways[id] || {
    gates: [],
    tagComponent: component
  }

  const tagGateway: TagGateway = {
    id, component,
    propMemory: {},

    // TODO: do we really need this?
    gates: [],
    
    props: (
      id: string,
      props: Record<string, unknown>
    ) => updateTagProps(tagGateway, id as any, [props]),
    
    updateTag: (tag: AnySupport, element: Element) => {
      return updateFromTag(
        id,
        element,
        tag,    
      )  
    },
  }

  gateways[id].tagComponent = component
  tagGateways[id] = tagGateway
  
  return tagGateway
}
