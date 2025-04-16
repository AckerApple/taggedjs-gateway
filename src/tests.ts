import { html } from "./testing/elmSelectors"
import { execute, it } from "./testing/expect"
import { expectElmCount, expectHTML, expectMatchedHtml, testCounterElements } from "./testing/expect.html"

export async function runTests() {  
  const displayPropSelector = '#simple-prop-test-wrap #gateway-test-prop-display'

  it('elements exists', () => {
    expectElmCount(displayPropSelector, 1)
    const htmlDisplay = html(displayPropSelector)
    expectHTML(displayPropSelector, htmlDisplay)
    expectMatchedHtml(displayPropSelector, '#display-gateway-count')
  })

  it('counters increase', async () => {
    const htmlDisplay = html(displayPropSelector)
    testCounterElements('#increase-gateway-count', '#display-gateway-count')
    expectHTML('#display-gateway-count', (Number(htmlDisplay) + 2).toString())
    expectMatchedHtml('#display-gateway-count', '#display-gateway-count-2')
    await wait(0) // gateway props changes run on element attribute watching which has a short delay
    expectMatchedHtml('#display-gateway-count', displayPropSelector)
  })

  try {
    await execute()
    console.info('✅ all tests passed')
    return true
  } catch (error: unknown) {
    console.error('❌ tests failed: ' + (error as Error).message, error)
    return false
  }
}


function wait(time: number) {
  return new Promise((res) => {
    setTimeout(res, time)
  })
}
