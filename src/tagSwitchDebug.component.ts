import { html, tag, setLet, InputElementTargetEvent, Tag } from "taggedjs"
import { renderCountDiv } from "./renderCount.component"

type SelectedTag = null | string | undefined

export const tagSwitchDebug = tag(() => {
  let selectedTag = setLet(null as SelectedTag)(x => [selectedTag, selectedTag = x])
  let renderCount = setLet(0)(x => [renderCount, renderCount = x])
  
  function changeSelectedTag(event: InputElementTargetEvent) {
    selectedTag = event.target.value

    if(selectedTag === 'undefined') {
      selectedTag = undefined
    }
  }

  let tagOutput: string | Tag = 'select tag below'

  switch (selectedTag) {
    case '1': tagOutput = tag1({title:'value switch'})
    break;
    case '2': tagOutput = tag2({title:'value switch'})
    break;
    case '3': tagOutput = tag3({title:'value switch'})
    break;
  }

  let tagOutput2 = html`<div id="select-tag-above">select tag above</div>`
  switch (selectedTag) {
    case '1': tagOutput2 = tag1({title:'tag switch'})
    break;
    case '2': tagOutput2 = tag2({title:'tag switch'})
    break;
    case '3': tagOutput2 = tag3({title:'tag switch'})
    break;
  }

  ++renderCount

  return html`
    <div>
      selectedTag: ${selectedTag}
    </div>
    
    <select id="tag-switch-dropdown" onchange=${changeSelectedTag}>
	    <option></option>
      <!-- TODO: implement selected attribute --->
	    <option value="undefined" ${ selectedTag === undefined ? {selected: true} : {} }>undefined</option>
	    <option value="1" ${ selectedTag === '1' ? {selected: true} : {} }>tag 1</option>
	    <option value="2" ${ selectedTag === '2' ? {selected: true} : {} }>tag 2</option>
	    <option value="3" ${ selectedTag === '3' ? {selected: true} : {} }>tag 3</option>
    </select>

    <div style="display:flex;gap:1em;">
      <div style="border:1px solid blue;flex-grow:1">
        <h3>Test 1 - string | Tag</h3>
        <div>${tagOutput}</div>
      </div>
      
      <div style="border:1px solid blue;flex-grow:1">
        <h3>Test 2 - Tag</h3>
        <div>${tagOutput2}</div>
      </div>
      
      <div style="border:1px solid blue;flex-grow:1">
        <h3>Test 3 - ternary (only 1 or 3 shows)</h3>
        <div>${selectedTag === '3' ? tag3({title: 'ternary simple'}) : tag1({title: 'ternary simple'})}</div>
      </div>
      
      <div style="border:1px solid blue;flex-grow:1">
        <h3>Test 3.2 - ternary via prop (only 1 or 3 shows)</h3>
        <div>${ternaryPropTest({selectedTag})}</div>
      </div>
      
      <div style="border:1px solid red;flex-grow:1">
        <h3>Test 4 - arraySwitching</h3>
        <div>${arraySwitching({selectedTag})}</div>
      </div>
    </div>
    ${/*renderCountDiv({renderCount, name:'tagSwitchDebug'})*/false}
  `
})

export const ternaryPropTest = tag((
  {selectedTag}: {selectedTag: string | undefined | null}
) => {
  return html`
  <div>${selectedTag === '3' ? tag3({title: 'ternaryPropTest'}) : tag1({title: 'ternaryPropTest'})}</div>
  `
})

export const tag1 = tag(({title}: {title: string}) => {
  let counter = setLet(0)(x => [counter, counter = x])
  let renderCount = setLet(0)(x => [renderCount, renderCount = x])
  ++renderCount
  return html`
    <div style="border:1px solid orange;">
      <div id="tagSwitch-1-hello">Hello 1 ${title} World</div>
      <button onclick=${() => ++counter}>increase ${counter}</button>
      ${renderCountDiv({renderCount, name:'tag1'})}
    </div>
  `
})

export const tag2 = tag(({title}: {title: string}) => {
  let counter = setLet(0)(x => [counter, counter = x])
  let renderCount = setLet(0)(x => [renderCount, renderCount = x])
  ++renderCount
  return html`
    <div style="border:1px solid orange;">
      <div id="tagSwitch-2-hello">Hello 2 ${title} World</div>
      <button onclick=${() => ++counter}>increase ${counter}</button>
      ${renderCountDiv({renderCount, name:'tag1'})}
    </div>
  `
})

export const tag3 = tag(({title}: {title: string}) => {
  let counter = setLet(0)(x => [counter, counter = x])
  let renderCount = setLet(0)(x => [renderCount, renderCount = x])
  ++renderCount
  return html`
    <div style="border:1px solid orange;">
      <div id="tagSwitch-3-hello">Hello 3 ${title} World</div>
      <button onclick=${() => ++counter}>increase ${counter}</button>
      ${renderCountDiv({renderCount, name:'tag1'})}
    </div>
  `
})

export const arraySwitching = tag((
  {selectedTag}: {selectedTag: SelectedTag}
) => {
  switch (selectedTag) {
    case undefined:
      return html`its an undefined value`

      case '1':
      return html`${['a'].map(x => html`${tag1({title: `array ${selectedTag} ${x}`})}`.key(x))}`

    case '2':
      return html`${['b','c'].map(x => html`${tag2({title: `array ${selectedTag} ${x}`})}`.key(x))}`

    case '3':
      return html`${['d','e','f'].map(x => html`${tag3({title: `array ${selectedTag} ${x}`})}`.key(x))}`
  }

  return html`nothing to show for in arrays`
})
