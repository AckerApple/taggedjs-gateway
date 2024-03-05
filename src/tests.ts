import { execute, expect, it } from "./expect"

export function runTests() {  
  it('counters increase', () => {
    testCounterElements('#increase-gateway-count', '#display-gateway-count')
  })

  try {
    execute()
    console.info('✅ all tests passed')
    return true
  } catch (error: unknown) {
    console.error('❌ tests failed: ' + (error as Error).message, error)
    return false
  }
}

function elementCount(selector: string) {
  return document.querySelectorAll(selector).length
}

function testDuelCounterElements(
  [button0, display0]: [string, string], // button, display
  [button1, display1]: [string, string], // button, display
) {
  const display0Element = document.querySelectorAll(display0)[0] as HTMLElement
  const ip0 = display0Element.innerText
  testCounterElements(button0, display0)
  
  let display1Element = document.querySelectorAll(display1)[0] as HTMLElement
  let ip1Check = display1Element.innerText
  const value = (Number(ip0) + 2).toString()
  expect(ip1Check).toBe(value, `Expected second increase provider to be increased to ${ip0} but got ${ip1Check}`)
 
  testCounterElements(button1, display1)
  
  display1Element = document.querySelectorAll(display1)[0] as HTMLElement
  ip1Check = display1Element.innerText
  expect(ip1Check).toBe((Number(ip0) + 4).toString(), `Expected ${display1} innerText to be ${Number(ip0) + 4} but instead it is ${ip1Check}`)
}

/** increases counter by two */
function testCounterElements(
  counterButtonId: string,
  counterDisplayId: string,
  {elementCountExpected} = {
    elementCountExpected: 1
  }
) {
  // const getByIndex = (selector: string, index: number) => document.querySelectorAll(selector)[index] as unknown as HTMLElement[]
  const increaseCounters = document.querySelectorAll(counterButtonId) as unknown as HTMLElement[]
  const counterDisplays = document.querySelectorAll(counterDisplayId) as unknown as HTMLElement[]

  expect(increaseCounters.length).toBe(elementCountExpected, `Expected ${counterButtonId} to be ${elementCountExpected} elements but is instead ${increaseCounters.length}`)
  expect(counterDisplays.length).toBe(elementCountExpected, `Expected ${counterDisplayId} to be ${elementCountExpected} elements but is instead ${counterDisplays.length}`)

  increaseCounters.forEach((increaseCounter, index) => {
    const counterDisplay = counterDisplays[index]
    // const counterDisplay = getByIndex(index)
    
    let counterValue = Number(counterDisplay?.innerText)
    increaseCounter?.click()

    let oldCounterValue = counterValue + 1
    counterValue = Number(counterDisplay?.innerText)
    expect(oldCounterValue).toBe(counterValue, `Expected element(s) ${counterDisplayId} to be value ${oldCounterValue} but is instead ${counterValue}`)
    increaseCounter?.click()

    counterValue = Number(counterDisplay?.innerText)
    ++oldCounterValue
    expect(oldCounterValue).toBe(counterValue, `Expected element(s) ${counterDisplayId} to increase value to ${oldCounterValue} but is instead ${counterValue}`)
  })
}

function expectElementCount(
  query: string,
  count: number,
  message?: string
) {
  const found = elementCount(query)

  message = message || `Expected ${count} elements to match query ${query} but found ${found}`

  expect(found).toBe(count, message)
}
