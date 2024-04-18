import { tagGateway } from "taggedjs-gateway"
import { GatewayTest } from "./GatewayTest.js"
import { renderCountDiv } from "./renderCount.component.js"
import { letState, html, tag, state } from "taggedjs"

export const gatewayDebug = tag(() => {
  let renderCount: number = letState(0)(x => [renderCount, renderCount = x])

  const gatewayData = state({
    test: 22,
    testString: 'see foam',
  })

  ++renderCount

  const gateway = tagGateway(GatewayTest)

  console.log('gatewayData', gatewayData)

  return html`
    hello world
    <!-- each prop as attr -->
    <div
      tag=${gateway.id}
      test:number=${gatewayData.test}
      test2=${gatewayData.test}
      string=${gatewayData.testString}
    ></div>

    <!-- props as one attr -->
    ${/*
    <div
      tag=${gateway.id}
      props=${gateway.props('props-as-one-attr', gatewayData)}
    ></div>
    */false}

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
    <span id="display-gateway-count-2">${gatewayData.test}</span>
    
    ${renderCountDiv({renderCount, name: 'gatewayDebug.component.ts'})}
  `
})
