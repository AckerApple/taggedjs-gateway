import { tagGateway } from "taggedjs-gateway"
import { GatewayTest } from "./GatewayTest.js"
import { renderCountDiv } from "./renderCount.component.js"
import { states, html, tag, state } from "taggedjs"

export const gatewayDebug = tag(() => {
  let renderCount: number = 0
  
  states(get => [renderCount] = get(renderCount))

  const gatewayData = state({
    test: 22,
    testString: 'see foam',
  })

  ++renderCount

  const gateway = tagGateway(GatewayTest)

  return html`
    hello world
    <!-- each prop as attr -->
    <div id="simple-prop-test-wrap">
      <div
        tag=${gateway.id}
        test:number=${gatewayData.test}
        test2=${gatewayData.test}
        string=${gatewayData.testString}
      ></div>
    </div>

    <hr />

    <!-- props as one attr -->
    <div id="props-test-wrap">
      <div
        tag=${gateway.id}
        props=${gateway.props('props-as-one-attr', gatewayData)}
      ></div>
    </div>

    <hr />

    <!-- web component -->
    <div id="props-web-component-wrap">
      <tag-element
        tag=${gateway.id}
        props=${gateway.props('inputMapsTagProps', gatewayData)}
      ></tag-element>
    </div>

    <hr />

    <!-- output events -->
    ${/*
    <div
      tag=${gateway.id}
      [attr.test]="gatewayData.test"
      events="formatChange"
      (formatChange)="formatChange.emit($event.detail.formatChange)"
    ></div>
    */false}

    <button id="increase-gateway-count"
      onclick=${() => ++gatewayData.test}
    >increase ${gatewayData.test}</button>
    
    <span id="display-gateway-count">${gatewayData.test}</span>
    |
    <span id="display-gateway-count-2">${gatewayData.test}</span>
    
    ${renderCountDiv({renderCount, name: 'gatewayDebug.component.ts'})}
  `
})
