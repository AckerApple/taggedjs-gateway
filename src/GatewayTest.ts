import { renderCountDiv } from "./renderCount.component.js"
import { div, span, tag } from "taggedjs"

export const GatewayTest = tag((
  props: {
    test: string, testString: string, label: string
  }, // : {test:number}
) => {
  let renderCount: number = 0

  ++renderCount

  GatewayTest.updates(x => {
    props = x[0]
  })
  
  return div(
    `I was loaded by ${props.label} - props:`,
    _=> typeof props,
    ':',
    _=> JSON.stringify(props),
    div(
      div('test value'),
      span({
        id:"gateway-test-prop-display",
        style: 'border:1px solid blue',
      }, _=> props.test)
    ),
    _=> renderCountDiv({renderCount, name: 'GatewayTest.ts'})
  )
})