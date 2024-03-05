import { TagComponent, TagComponentBase } from "taggedjs"
import { checkElement, getTagId } from "./tagGateway.utils.js"

const namedTimeouts: Record<string, any> = {}

export type TagGatewayComponent = TagComponent | TagComponentBase<[props: unknown]>

export const tagGateway = function tagGateway(
  component: TagGatewayComponent,
): {id: string} {
  const id = getTagId(component)

  if(namedTimeouts[id]) {
    return namedTimeouts[id]
  }

  let intervalId: NodeJS.Timeout
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

  const elementCounts = findElements()
  if(elementCounts) {
    return { id }
  }

  findElement()

  namedTimeouts[id] = { id }

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
