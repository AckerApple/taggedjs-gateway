import { getTagId } from "./tagGateway.utils.js"
import { TagGatewayComponent } from "./tagGateway.function.js"
import { loadTagGateway } from "./loadTagGateway.function.js"

/** Typically used for Angular */
export function classGatewayTag(
  component: TagGatewayComponent, // TagComponent | ((props?: any, children?: TagChildrenInput) => Tag)
) {
  const id = getTagId(component) + '_' + performance.now()
  return loadTagGateway(component, id)
}
