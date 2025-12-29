import { tagGateway } from "taggedjs-gateway"
import { GatewayTest } from "./GatewayTest.js"
import { renderCountDiv } from "./renderCount.component.js"
import { button, div, hr, htmlTag, span, tag } from "taggedjs"

export const gatewayDebug = tag(() => {
  let renderCount: number = 0

  const gatewayData = {
    test: 22,
    testString: 'see foam',
    label: 'gatewayData',
  }

  ++renderCount

  const gateway = tagGateway(GatewayTest as any)

  return div(
    'hello world',
    
    /* each prop as attr */
    div({id:"simple-prop-test-wrap",
      style:'border:1px solid purple'
    },
      _=> div({
        tag: _ => gateway.id,
        label: 'each-prop-as-attr',
        test: _=> gatewayData.test,
        test2: _=> gatewayData.test,
        string: _=> gatewayData.testString,
      })
    ),

    hr,

    /* props as one attr */
    div({id:"props-test-wrap"},
      div({
        tag: _=> gateway.id,
        props: _=> gateway.props('props-as-one-attr', gatewayData),
      }),
    ),

    hr,

    /* web component */
    div({id:"props-web-component-wrap"},
      htmlTag('tag-element')({
        tag: () => gateway.id,
        props: ()=> gateway.props('inputMapsTagProps', gatewayData),
      })
    ),

    hr,

    /* output events */
    /*
    <div
      tag=${gateway.id}
      [attr.test]="gatewayData.test"
      events="formatChange"
      (formatChange)="formatChange.emit($event.detail.formatChange)"
    ></div>
    */

    button({
      id: "increase-gateway-count",
      onClick: () => ++gatewayData.test,
    }, _=> `increase ${gatewayData.test}`,),
    
    span({
      id:"display-gateway-count",
      style: 'border:1px solid green',
    }, _=> gatewayData.test),
    '|',
    span({id:"display-gateway-count-2"}, _=> gatewayData.test),
    
    _=> renderCountDiv({renderCount, name: 'gatewayDebug.component.ts'}),
  )
})
