import { TagComponent, tagElement, AnySupport } from "taggedjs"
import { TagGatewayComponent } from "./tagGateway.function.js"
import { parseElmProps } from "./parseProps.js"
import { Gateway, watchElement } from "./tagGateway.utils.js"

export function checkElementGateway(
  tagId: string,
  element: Element,
  component: TagGatewayComponent,
): Gateway {
  const gateway = (element as any).gateway as Gateway
  
  if(gateway) {
    gateway.updateTag()
    return gateway
  }

  const propMemory = parseElmProps(tagId, element)
  const props = propMemory.props

  try {
    const { support } = tagElement(
      component as TagComponent,
      element,
      props[0]
    )

    propMemory.element = element
    propMemory.tag = support as AnySupport
    
    // watch element AND add to gateways[id].push()
    const gateway = watchElement(
      tagId,
      element as HTMLElement,
      support as AnySupport,
      component,
    )

    ;(element as any).gateway = gateway

    return gateway
  } catch (err) {
    console.warn('Failed to render component to element', {
      component,
      element,
      props: props[0],
      err,
    })
    throw err
  }
}
