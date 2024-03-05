type Test = () => unknown
const onlyTests: Test[] = []
const tests: Test[] = []

export function it(label: string, run: () => any) {
  tests.push(() => {
    console.debug(label)
    run()
  })
}

it.only = (label: string, run: () => any) => {
  onlyTests.push(() => {
    console.debug(label)
    run()
  })
}

export function execute() {
  if(onlyTests.length) {
    return runTests(onlyTests)
  }
  
  return runTests(tests)
}

function runTests(tests: Test[]) {
  tests.forEach(test => test())
}

export function expect(expected: unknown) {
  return {
    toBeDefined: () => {
      if(expected !== undefined && expected !== null) {
        return
      }

      const message = `Expected ${JSON.stringify(expected)} to be defined`
      console.error(message, {expected})
      throw new Error(message)
    },
    toBe: (received: unknown, customMessage?: string) => {
      if(expected === received) {
        return
      }

      const message = customMessage || `Expected ${typeof(expected)} ${JSON.stringify(expected)} to be ${typeof(received)} ${JSON.stringify(received)}`
      console.error(message, {received, expected})
      throw new Error(message)
    }
  }
}