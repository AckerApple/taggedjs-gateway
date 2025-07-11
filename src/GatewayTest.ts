import { renderCountDiv } from "./renderCount.component.js"
import { states, tag, html } from "taggedjs"

export const GatewayTest = tag((
  props: {test: string, testString: string}, // : {test:number}
) => {
  let renderCount: number = 0
  
  states(get => [renderCount] = get(renderCount))

  ++renderCount
  
  return html`
    I was loaded by a gateway - props:${typeof props}:${JSON.stringify(props)}
    <div>
      <div>test value</div>
      <span id="gateway-test-prop-display">${props.test}</span>
    </div>
    ${renderCountDiv({renderCount, name: 'GatewayTest.ts'})}
  `
})