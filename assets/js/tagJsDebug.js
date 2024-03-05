import { propsDebugMain } from "./PropsDebug.component.js";
import { animateDestroy, animateInit } from "./animations.js";
import { arrayTests } from "./arrayTests.js";
import { intervalTester0, intervalTester1 } from "./intervalDebug.js";
import { html, tag, providers, setLet } from "taggedjs";
import { gatewayDebug } from "./gatewayDebug.component.js";
import { renderCountDiv } from "./renderCount.component.js";
export function tagDebugProvider() {
    const upper = providers.create(upperTagDebugProvider);
    return {
        upper,
        test: 0
    };
}
export function upperTagDebugProvider() {
    return {
        name: 'upperTagDebugProvider',
        test: 0
    };
}
export const tagDebug = tag(() => {
    let _firstState = setLet('tagJsDebug.js')(x => [_firstState, _firstState = x]);
    let showIntervals = setLet(false)(x => [showIntervals, showIntervals = x]);
    let renderCount = setLet(0)(x => [renderCount, renderCount = x]);
    ++renderCount;
    return html `<!-- tagDebug.js -->
    <h3 id="debugging">Debugging</h3>
    ${renderCountDiv({ renderCount, name: 'tagJsDebug' })}

    <div style="display:flex;flex-wrap:wrap;gap:1em">
      <fieldset style="flex:2 2 20em">
        <legend>arrays</legend>
        ${arrayTests()}
      </fieldset>
    
      <fieldset id="debug-intervals" style="flex:2 2 20em">
        <legend>
          Interval Testing
        </legend>

        <button
          onclick=${() => showIntervals = !showIntervals}
        >hide/show</button>

        ${showIntervals && html `
          <div oninit=${animateInit} ondestroy=${animateDestroy}>
            <div>${intervalTester0()}</div>
            <hr />
            <div>${intervalTester1()}</div>
          </div>
        `}
      </fieldset>

      <fieldset id="props-debug" style="flex:2 2 20em">
        <legend>Props Debug</legend>
        ${propsDebugMain()}
      </fieldset>


      <fieldset id="content-debug" style="flex:2 2 20em">
        <legend>#tagGateway</legend>
        ${gatewayDebug()}
      </fieldset>
    </div>
  `;
});
//# sourceMappingURL=tagJsDebug.js.map