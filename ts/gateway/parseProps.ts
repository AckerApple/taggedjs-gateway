import { tagGateways } from "./globals.js"
import { GatewayProps, PropMemory } from "./tagGateway.function.js"
import { EventData } from "./tagGateway.utils.js"

export function parseElmProps(
  id: string, // element.id
  element: Element,
  // gateway: Gateway,
): PropMemory {
  const propsId = element.getAttribute('props')
  if( propsId ) {
    // const elmGateway = (element as any).gateway as Gateway
    const tagGateway = tagGateways[ id ] // || gateway.tagGateway
    const propMemory = tagGateway.propMemory[ propsId ]
    parseElmOutputs(element, propMemory.props)
    return propMemory
  }

  const propsJsonString = element.getAttribute('propsJson')
  if( propsJsonString ) {
    const propsJson = JSON.parse( propsJsonString )
    parseElmOutputs(element, propsJson)
    return {props: propsJson, callCount: 0}
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

  parseElmOutputs(element, [props])
  return {
    props: [props], callCount: 0,
  }
}

function parseElmOutputs(
  element: Element,
  props: GatewayProps,
) {
  // attribute eventProps as output bindings
  const eventPropsString = element.getAttribute('events')
  if(eventPropsString) {
    eventPropsString.split(',').map(x => x.trim()).map((name: string) => {
      props[0][name] = (value: unknown) => dispatchEvent(name, {detail:{[name]: value}})
    })
  }
  
  const dispatchEvent = function(name: string, eventData: EventData) {
    const event = new CustomEvent(name, eventData)
    element.dispatchEvent(event)
  }

  return props
}
