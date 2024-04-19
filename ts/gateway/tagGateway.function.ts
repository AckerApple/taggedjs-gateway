import { Tag, TagComponent, TagComponentBase, renderTagSupport } from "taggedjs"
import { checkElementGateway, getTagId } from "./tagGateway.utils.js"
import { tagClosed$ } from "taggedjs/js/tagRunner.js"
import { parseElmProps } from "./parseProps.js"

export const tagGateways: Record<string, TagGateway> = {}

export type TagGatewayComponent = TagComponent | TagComponentBase<[props: unknown]>

type SetProps = <T extends string>(
  key: T, // must be unique across entire app
  props: any,
) => T

export type TagGateway = {
  id: string

  props: SetProps

  updateTag: (tag: Tag, element: Element) => any

  propMemory: {
    [key: string]: PropMemory
  }
}

export type PropMemory = {
  callCount: number
  props: any

  element?: Element
  tag?: Tag
}

export const tagGateway = function tagGateway(
  component: TagGatewayComponent,
): TagGateway {
  const id = getTagId(component)

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
    id,
    propMemory: {},
    props: (
      key,
      props,
    ) => {
      const memory = gateway.propMemory[key] = gateway.propMemory[key] || {
        props,
        callCount: 0,
      }

      memory.props = props
      ++memory.callCount

      // new props given after init will be analyzed to trigger new render
      const {element, tag} = memory
      if(element && tag) {
        gateway.updateTag(tag, element)
      }

      return key
    },
    updateTag: (tag: Tag, element: Element) => {
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

function updateFromTag(
  id: string,
  targetNode: Element,
  tag: Tag
) {
  const templater = tag.tagSupport.templater
  const latestTag = templater.global.newest as Tag
  // const prevProps = latestTag.tagSupport.templater.props
  const prevProps = latestTag.tagSupport.propsConfig.latestCloned
  const propMemory = parseElmProps(id, targetNode)
  const newProps = propMemory.props

  const isSameProps = JSON.stringify(prevProps) === JSON.stringify(newProps)
  // const isSameProps = deepEqual(oldProps, newProps) // dont have access to this
  
  if(isSameProps) {
    return // no reason to update, same props
  }
  
  // propsConfig.latest = newProps
  latestTag.tagSupport.templater.props = newProps

  // after the next tag currently being rendered, then redraw me
  tagClosed$.toCallback(() => {
    const latestTag = templater.global.newest as Tag
    const tagSupport = latestTag.tagSupport
    
    // tagSupport.propsConfig.latestCloned = newProps
    // tagSupport.propsConfig.latest = newProps
    tagSupport.templater.props = newProps
    
    renderTagSupport(tagSupport, false)  
  })
}
