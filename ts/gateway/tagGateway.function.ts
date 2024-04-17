import { TagComponent, TagComponentBase } from "taggedjs"
import { checkElement, getTagId } from "./tagGateway.utils.js"

const namedTimeouts: Record<string, Gateway> = {}

export type TagGatewayComponent = TagComponent | TagComponentBase<[props: unknown]>

type GetProps = () => unknown

type Gateway = {
  id: string

  props: <T extends string>(
    key: T, // must be unique across entire app
    getProps: GetProps,
  ) => T

  propMemory: {
    key: string, // must be unique across entire app
    getProps: GetProps,
  }[]
}

export const tagGateway = function tagGateway(
  component: TagGatewayComponent,
): Gateway {
  const id = getTagId(component)

  if(namedTimeouts[id]) {
    return namedTimeouts[id]
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
    delete namedTimeouts[id]

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

  const gateway: Gateway = {
    id,
    propMemory: [],
    props: (
      key,
      getProps,
    ) => {
      gateway.propMemory.push({key, getProps})
      return key
    }
  }

  const elementCounts = findElements()
  if(elementCounts) {
    return gateway
  }

  findElement()

  namedTimeouts[id] = gateway

  return namedTimeouts[id]
}

function checkTagElementsById(
  id: string,
  component: TagGatewayComponent,
) {
  const elements = document.querySelectorAll('#' + id)
  return checkTagElements(id, elements, component)
}

function checkTagElements(
  id: string,
  elements: NodeListOf<Element>,
  component: TagGatewayComponent,
) {
  elements.forEach(element => checkElement(id, element, component))

  return elements
}
