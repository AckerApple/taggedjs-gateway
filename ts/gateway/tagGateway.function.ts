import { TagComponent, AnySupport, TaggedFunction, ToTag, Wrapper } from "taggedjs"
import { Gateway, getTagId } from "./tagGateway.utils.js"
import { updateFromTag } from "./updateFromTag.function.js"
import { tagGateways } from "./globals.js"
import { checkElementGateway } from "./checkElementGateway.function.js"

export type TagGatewayComponent = TagComponent | TaggedFunction<ToTag> // TagComponentBase<[props: unknown]>

/** key must be unique across entire app */
type SetProps = <T extends string>(
  key: T, // must be unique across entire app
  props: any,
) => T

export type TagGateway = {
  component: TagGatewayComponent
  id: string
  
  /** TODO: do we really need this */
  gates: Gateway[]

  props: SetProps

  updateTag: (tag: AnySupport, element: Element) => any

  propMemory: {
    [key: string]: PropMemory
  }
}

export type PropMemory = {
  callCount: number
  
  // props: unknown[]
  props: GatewayProps // one item in array

  element?: Element
  tag?: AnySupport
}

export const tagGateway = function tagGateway(
  component: TagGatewayComponent,
): TagGateway {
  const id = getTagId(component as unknown as Wrapper)

  if(tagGateways[id]) {
    return tagGateways[id]
  }

  let intervalId: any // NodeJS.Timeout
  let hitCount = 0
  const interval = 5

  function findElements() {
    const elements = checkTagElementsById(id, component)

    if(!elements.length) {
      return elements.length
    }

    // Element has been found, load
    if(intervalId) {
      clearInterval(intervalId)
    }
    delete tagGateways[id]

    return elements.length
  }

  function findElement() {
    intervalId = setInterval(() => {
      hitCount = hitCount + interval

      if(hitCount >= 2000) {
        clearInterval(intervalId)
        throw new Error(`TaggedJs Element ${id} not found`)    
      }
      
      findElements()
    }, interval)
  }

  const gateway: TagGateway = {
    id, component,
    
    gates: [],
    propMemory: {},
    
    props: (
      key,
      props,
    ) => {
      return updateTagProps(gateway, key, [props])
    },
    updateTag: (tag: AnySupport, element: Element) => {
      updateFromTag(
        id,
        element,
        tag,    
      )  
    }
  }

  const elementCounts = findElements()
  if(elementCounts) {
    return gateway
  }

  findElement()

  tagGateways[id] = gateway

  return tagGateways[id]
}

export function updateTagProps<T extends string>(
  gateway: TagGateway,
  key: T,
  props: GatewayProps,
): T {
  const propMem = gateway.propMemory
  const memory = propMem[key] = propMem[key] || {
    props,
    callCount: 0,
  }

  memory.props = props
  ++memory.callCount

  // new props given after init will be analyzed to trigger new render (set by checkElementGateway)
  const { element, tag } = memory
  if (element && tag) {
    gateway.updateTag(tag, element)
  }

  return key
}

function checkTagElementsById(
  id: string,
  component: TagGatewayComponent,
) {
  const elements = document.querySelectorAll(`[tag="${id}"]`)
  return checkTagElements(id, elements, component)
}

function checkTagElements(
  id: string,
  elements: NodeListOf<Element>,
  component: TagGatewayComponent,
) {
  elements.forEach(element => checkElementGateway(id, element, component))

  return elements
}

export type GatewayProps = [Record<string, unknown>]