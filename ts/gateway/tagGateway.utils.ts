import { TagComponent, tagElement, Tag, TagSupport } from "taggedjs"
import { loadTagGateway } from "./loadTagGateway.function.js"
import { PropMemory, TagGateway, TagGatewayComponent, tagGateways } from "./tagGateway.function.js"
import { parseElmProps } from "./parseProps.js"
import { Wrapper } from "taggedjs/js/TemplaterResult.class.js"

export const gateways: {
  [id: string]: {
    gates: Gateway[],
    tagComponent: TagComponent
  }
} = {}


export function checkAllGateways() {
  Object.entries(gateways).forEach(([id, gateways]) => checkGateways(gateways.gates))
}

export function checkGateways(gateways: Gateway[]) {
  gateways.forEach(gateway => checkGateway(gateway))
}

function checkGateway(gateway: Gateway) {
  const { element } = gateway

  if(document.body.contains(element)) {
    return true // its still good, do not continue to destroy
  }

  destroyGateway(gateway)
  
  return false
}

export function destroyGateway(gateway: Gateway) {
  const {id, observer, tag} = gateway
  observer.disconnect()
  tag.destroy()
  delete gateways[id]
}

export function getTagId(
  component: Wrapper
) {
  const fun = component.original || component
  const componentString = functionToHtmlId(fun)
  return '__tagTemplate_' + componentString
}

/** adds to gateways[id].push */
function watchElement(
  id: string, // tag id
  targetNode: HTMLElement,
  tag: TagSupport,
  component: TagGatewayComponent,
): Gateway {
  const tagGateway = tagGateways[id]

  const observer = new MutationObserver(mutationsList => {
    if(!checkGateway(gateway)) {
      return
    }

    for (const mutation of mutationsList) {
      if (mutation.type === 'attributes') {
        updateTag()
      }
    }
  })

  function updateTag() {
    tagGateway.updateTag(tag, targetNode)
  }
  
  loadTagGateway(component)
  
  const gateway: Gateway = {
    id, tag,
    observer,
    component,
    element: targetNode,
    updateTag,
    tagGateway,
  }
  gateways[id] = gateways[id] || []
  gateways[id].gates.push(gateway)
  
  // store on element object, our connection to gateway
  ;(targetNode as any).gateway = gateway
  
  // Configure the observer to watch for changes in child nodes and attributes
  const config = { attributes: true }
  
  // Start observing the target node for specified changes
  observer.observe(targetNode, config)

  return gateway
}

function functionToHtmlId(func: any) {
  // Convert function to string
  let funcString = func.toString();

  // Remove spaces and replace special characters with underscores
  let cleanedString = funcString.replace(/\s+/g, '_')
                               .replace(/[^\w\d]/g, '_');

  // Ensure the ID starts with a letter
  if (!/^[a-zA-Z]/.test(cleanedString)) {
      cleanedString = 'fn_' + cleanedString;
  }

  return cleanedString;
}

export type EventData = {
  detail: Record<string, any>
}
export type Gateway = {
  id:string
  tag:TagSupport
  observer: MutationObserver
  element: HTMLElement
  component: TagGatewayComponent // TagComponent
  updateTag: () => unknown
  tagGateway: TagGateway
}

export function checkByElement(
  element: HTMLElement | Element
){
  const gateway = (element as any).gateway as Gateway | undefined
  let tagName = gateway?.id || element.getAttribute('tag')

  if(!tagName) {
    const message = 'Tagged gateway element must have a "tag" attribute which describes which tag to use'
    console.warn(message, {element})
    throw new Error(message)
  }

  if(!tagName) {
    const message = 'Cannot check a tag on element with no id attribute'
    console.warn(message, {tagName, element})
    throw new Error(message)
  }

  const component = gateways[tagName].tagComponent
  if(!component) {
    const message = `Cannot find a tag registered by id of ${tagName}`
    console.warn(message, {tagName, element})
    throw new Error(message)
  }

  return checkElementGateway(tagName, element, component)
}

export function checkElementGateway(
  id: string,
  element: Element,
  component: TagGatewayComponent,
): Gateway {
  const gateway = (element as any).gateway as Gateway
  
  if(gateway) {
    gateway.updateTag()
    return gateway
  }
  
  const propMemory = parseElmProps(id, element)
  const props = propMemory.props

  try {
    const { tagSupport } = tagElement(
      component as TagComponent,
      element,
      props
    )

    propMemory.element = element
    propMemory.tag = tagSupport
    
    // watch element AND add to gateways[id].push()
    return watchElement(id, element as HTMLElement, tagSupport, component)
  } catch (err) {
    console.warn('Failed to render component to element', {
      component,
      element,
      props,
      err,
    })
    throw err
  }
}
