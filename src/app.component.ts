import { html, tag, setLet, onInit } from "taggedjs"
import { runTests } from "./tests.js"
import { renderCountDiv } from "./renderCount.component.js"
import { gatewayDebug } from "./gatewayDebug.component.js"

export const App = tag(() => {
  console.log('render app.js')
  let _firstState: string = setLet('app first state')(x => [_firstState, _firstState=x])
  let toggleValue: boolean = setLet(false)(x => [toggleValue, toggleValue=x])
  let renderCount: number = setLet(0)(x => [renderCount, renderCount=x])

  const toggle = () => {
    toggleValue = !toggleValue
  }

  function runTesting(manual = true) {
    setTimeout(() => {
      const result = runTests()

      if(!manual) {
        return
      }

      if(result) {
        alert('✅ all tests passed')
        return
      }

      alert('❌ tests failed. See console for more details')

    }, 3000) // cause delay to be separate from renders
  }

  ++renderCount

  onInit(() => {
    runTesting(false)
  })

  const content = html`<!--app.js-->
    <h1 id="h1-app">🌉 TaggedJs Gateway</h1>

    <button id="toggle-test" onclick=${toggle}>toggle test ${toggleValue}</button>
    <button onclick=${runTesting}>run test</button>

    ${renderCountDiv({name:'app', renderCount})}

    <div id="tagDebug-fx-wrap">
      <fieldset id="content-debug" style="flex:2 2 20em">
        <legend>#tagGateway</legend>
        ${gatewayDebug()}
      </fieldset>
    </div>
  `

  return content
})
