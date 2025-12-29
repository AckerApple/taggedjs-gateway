import { tag, states, h1, div, button, legend, fieldset } from "taggedjs"
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

  console.info('app init should only run once')

  const content = div(
    h1({id:"h1-app"}, '🌉 TaggedJs Gateway'),

    button({id:"toggle-test", onClick: toggle},
      _=> 'toggle test ${toggleValue}'
    ),
    button({onClick: _=> runTesting}, 'run test'),

    _=> renderCountDiv({name:'app', renderCount}),

    div({id:"tagDebug-fx-wrap"},
      fieldset({id:"content-debug", style:"flex:2 2 20em"},
        legend('#tagGateway'),
        gatewayDebug(),
      )
    ),

    button({
      type:"button",
      onClick: () => runTesting(true)
    }, 'run testing')
  )

  return content
})
