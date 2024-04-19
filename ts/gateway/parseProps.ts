import { PropMemory, tagGateways } from "./tagGateway.function.js"
import { EventData, Gateway } from "./tagGateway.utils.js"

export function parseElmProps(
  id: string, // element.id
  element: Element,
): PropMemory {
  const propsId = element.getAttribute('props')
  if( propsId ) {
    const elmGateway = (element as any).gateway as Gateway
    const gateway = tagGateways[ id ] || elmGateway.tagGateway
    const propMemory = gateway.propMemory[ propsId ]
    parseElmOutputs(element, propMemory.props)
    return propMemory
  }

  const attrNames = element.getAttributeNames()
  const props = attrNames.reduce((all, attrName) => {
    const nameSplit = attrName.split(':')
    let value: any = element.getAttribute(attrName)
    
    if(nameSplit.length > 1) {
      switch (nameSplit[1]) {
        case 'number':
          value = Number(value)
          break;
      
      }

      attrName = nameSplit[0]
    }
	  
    all[attrName] = value
    
    return all
  }, {} as Record<string, any>)

  delete props.tag

  parseElmOutputs(element, props)
  return {
    props, callCount: 0,
  }
}

function parseElmOutputs(
  element: Element,
  props: Record<string, any>,
) {
  // attribute eventProps as output bindings
  const eventPropsString = element.getAttribute('events')
  if(eventPropsString) {
    eventPropsString.split(',').map(x => x.trim()).map((name: string) => {
      props[name] = (value: unknown) => dispatchEvent(name, {detail:{[name]: value}})
    })
  }
  
  const dispatchEvent = function(name: string, eventData: EventData) {
    const event = new CustomEvent(name, eventData)
    element.dispatchEvent(event)
  }

  return props
}
