import { Wrapper, TagComponent, tagElement, AnySupport, TagWrapper, destroySupport } from "taggedjs"
import { loadTagGateway } from "./loadTagGateway.function.js"
import { TagGateway, TagGatewayComponent } from "./tagGateway.function.js"
import { parseElmProps } from "./parseProps.js"
import { gateways, tagGateways } from "./globals.js"
import { checkElementGateway } from "./checkElementGateway.function.js"

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
  destroySupport(tag, tag.subject.global)
  delete gateways[id]
}

export function getTagId(
  component: Wrapper | TagGatewayComponent
) {
  const tag = component as any as TagWrapper<any>
  const original = tag.original // || component.parentWrap?.original
  const fun = original || component
  const componentString = functionToHtmlId(fun)
  return '__tagTemplate_' + componentString
}

/** adds to gateways[id].push */
export function watchElement(
  id: string, // tag id
  targetNode: HTMLElement,
  tag: AnySupport,
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
  
  loadTagGateway(component, getTagId(component))
  
  const gateway: Gateway = {
    id, tag,
    observer,
    component,
    element: targetNode,
    updateTag,
    tagGateway,
  }

  tagGateway.gates.push(gateway)
  /*
  gateways[id] = gateways[id] || []
  gateways[id].gates.push(gateway)
  */
  
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
  id: string
  tag: AnySupport
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

  const component = tagGateways[tagName]?.component || gateways[tagName]?.tagComponent
  if(!component) {
    const message = `Cannot find a tag registered by id of ${tagName}`
    console.warn(message, {tagName, element})
    throw new Error(message)
  }

  return checkElementGateway(tagName, element, component)
}
