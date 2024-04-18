import { renderCountDiv } from "./renderCount.component.js";
import { letState, tag, html } from "taggedjs";
export const GatewayTest = tag((props) => {
    let renderCount = letState(0)(x => [renderCount, renderCount = x]);
    ++renderCount;
    console.log('GatewayTest.ts - props', { props, renderCount });
    return html `
    I was loaded by a gateway - props:${typeof props}:${JSON.stringify(props)}
    <div>
      <div>test value</div>
      <span id="gateway-test-prop-display">${props.test}</span>
    </div>
    ${renderCountDiv({ renderCount, name: 'GatewayTest.ts' })}
  `;
});
//# sourceMappingURL=GatewayTest.js.map