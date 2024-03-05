import { renderCountDiv } from "./renderCount.component.js"
import { setLet, tag, html } from "taggedjs"

export const GatewayTest = tag((
  props: any, // : {test:number}
) => {
  let renderCount: number = setLet(0)(x => [renderCount, renderCount=x])

  ++renderCount
  
  return html`
    I was loaded by a gateway - props:${typeof props}:${JSON.stringify(props)}
    ${renderCountDiv({renderCount, name: 'GatewayTest.ts'})}
  `
})