import { tagGateway } from "taggedjs-gateway"
import { GatewayTest } from "./GatewayTest.js"
import { renderCountDiv } from "./renderCount.component.js"
import { setLet, html, tag, set } from "taggedjs"

export const gatewayDebug = tag(() => {
  let renderCount: number = setLet(0)(x => [renderCount, renderCount = x])

  const gatewayData = set({test: 22})

  ++renderCount

  return html`
    <div id=${tagGateway(GatewayTest).id} props=${JSON.stringify(gatewayData)}></div>
    <button id="increase-gateway-count" onclick=${() => ++gatewayData.test}>increase ${gatewayData.test}</button>
    <span id="display-gateway-count">${gatewayData.test}</span>
    ${renderCountDiv({renderCount, name: 'gatewayDebug.component.ts'})}
  `
})
