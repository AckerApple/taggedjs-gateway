import { html, tag, states, onInit } from "taggedjs"
import { runTests } from "./tests.js"
import { renderCountDiv } from "./renderCount.component.js"
import { gatewayDebug } from "./gatewayDebug.tag.js"

export const App = tag(() => {
  let _firstState = 'app first state'
  let toggleValue = false
  let appCounter = 0
  let renderCount = 0

  states(get => [{
    _firstState,toggleValue,appCounter, renderCount
  }] = get({
    _firstState,toggleValue,appCounter, renderCount
  }))

  const toggle = () => {
    toggleValue = !toggleValue
  }

  function runTesting(manual = true) {
    const waitFor = 1000
    setTimeout(async () => {
      console.debug('🏃 Running tests...')
      const result = await runTests()

      if(!manual) {
        return
      }

      if(result) {
        alert('✅ all tests passed')
        return
      }

      alert('❌ tests failed. See console for more details')

    }, waitFor) // cause delay to be separate from renders
  }

  ++renderCount

  onInit(() => {
    console.log('app init should only run once')
    
    // runTesting(false)
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

    <button type="button" onclick=${() => runTesting(true)}>run testing</button>
  `

  return content
})
