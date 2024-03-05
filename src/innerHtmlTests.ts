import { html, setLet, tag, Tag, ValueSubject, isSubjectInstance, isTagArray, TagChildren } from "taggedjs"
import { renderCountDiv } from "./renderCount.component"

export const innerHtmlTest = tag((
  _props: unknown,
  children: TagChildren,
) => {
  let renderCount = setLet(0)(x => [renderCount, renderCount = x])
  let counter = setLet(0)(x => [counter, counter = x])

  ++renderCount

  return html`<!--innerHtmlTests.js-->
    <fieldset id="innerHtmlTests-1">
      <legend>no props test</legend>
      <div>${children}</div>
      <div>isSubjectInstance:${isSubjectInstance(children)}</div>
      <div>isSubjectTagArray:${isTagArray(children.value)}</div>
      <button id="innerHtmlTest-counter-button"
      onclick=${() => ++counter}>increase innerHtmlTest ${counter}</button>
      <span id="innerHtmlTest-counter-display">${counter}</span>
      ${renderCountDiv({renderCount, name: 'innerHtmlTest'})}
    </fieldset>
  `
})

export const innerHtmlPropsTest = tag((
  x: number,
  children: ValueSubject<Tag[]>
) => {
  let renderCount = setLet(0)(x => [renderCount, renderCount = x])
  let counter = setLet(0)(x => [counter, counter = x])
  
  ++renderCount
  
  return html`<!--innerHtmlTests.js-->
    <fieldset id="innerHtmlTests-2">
      <legend>innerHTML Props: ${x}</legend>
      ${children}
      <button id="innerHtmlPropsTest-button" onclick=${() => ++counter}
      >increase innerHtmlPropsTest ${counter}</button>
      <span id="innerHtmlPropsTest-display">${counter}</span>
      ${/*renderCountDiv(renderCount)*/ false}
    </fieldset>
  `
})
