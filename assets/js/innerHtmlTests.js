import { html, setLet, tag, isSubjectInstance, isTagArray } from "taggedjs";
import { renderCountDiv } from "./renderCount.component";
export const innerHtmlTest = tag((_props, children) => {
    let renderCount = setLet(0)(x => [renderCount, renderCount = x]);
    let counter = setLet(0)(x => [counter, counter = x]);
    ++renderCount;
    return html `<!--innerHtmlTests.js-->
    <fieldset id="innerHtmlTests-1">
      <legend>no props test</legend>
      <div>${children}</div>
      <div>isSubjectInstance:${isSubjectInstance(children)}</div>
      <div>isSubjectTagArray:${isTagArray(children.value)}</div>
      <button id="innerHtmlTest-counter-button"
      onclick=${() => ++counter}>increase innerHtmlTest ${counter}</button>
      <span id="innerHtmlTest-counter-display">${counter}</span>
      ${renderCountDiv({ renderCount, name: 'innerHtmlTest' })}
    </fieldset>
  `;
});
export const innerHtmlPropsTest = tag((x, children) => {
    let renderCount = setLet(0)(x => [renderCount, renderCount = x]);
    let counter = setLet(0)(x => [counter, counter = x]);
    ++renderCount;
    return html `<!--innerHtmlTests.js-->
    <fieldset id="innerHtmlTests-2">
      <legend>innerHTML Props: ${x}</legend>
      ${children}
      <button id="innerHtmlPropsTest-button" onclick=${() => ++counter}
      >increase innerHtmlPropsTest ${counter}</button>
      <span id="innerHtmlPropsTest-display">${counter}</span>
      ${ /*renderCountDiv(renderCount)*/false}
    </fieldset>
  `;
});
//# sourceMappingURL=innerHtmlTests.js.map