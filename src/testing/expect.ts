type Test = () => unknown
const onlyTests: Test[] = []
let tests: Test[] = []
let tab = 0

export function describe(label: string, run: () => any) {
  tests.push(async function itTest() {
    const oldTests = tests
    tests = []
    
    try {
      console.debug('  '.repeat(tab) + '↘ ' + label)
      
      ++tab
      await run()
      await runTests(tests)
      
      --tab
    } catch (error) {
      --tab
      // console.debug(' '.repeat(tab) + '❌ ' + label)
      throw error
    } finally {
      tests = oldTests
    }
  })
}

describe.skip = function skip(label: string, run: () => any) {
  console.debug('⏭️ Skipped ' + label)
}

describe.only = function only(label: string, run: () => any) {
  onlyTests.push(async () => {
    const oldTests = tests
    tests = []
    
    try {
      console.debug('  '.repeat(tab) + '↘ ' + label)
      
      ++tab
      
      await run()
      await runTests(tests)
      
      --tab
    } catch (error) {
      --tab
      // console.debug(' '.repeat(tab) + '❌ ' + label)
      throw error
    } finally {
      tests = oldTests
    }
  })
}

export function it(label: string, run: () => any) {
  tests.push(async function pushIt() {
    try {
      const start = Date.now()
      await run()
      const time = Date.now() - start
      console.debug(' '.repeat(tab) + `✅ ${label} - ${time}ms`)
    } catch (error) {
      console.debug(' '.repeat(tab) + '❌ ' + label)
      throw error
    }
  })
}

it.only = (label: string, run: () => any) => {
  onlyTests.push(async function pushOnlyTest() {
    try {
      const start = Date.now()
      await run()
      const time = Date.now() - start
      console.debug(`✅ ${label} - ${time}ms`)
    } catch (error) {
      console.debug('❌ ' + label)
      throw error
    }
  })
}

it.skip = function skip(label: string, run: () => any) {
  console.debug('⏭️ Skipped ' + label)
}

function clearTests() {
  onlyTests.length = 0
  tests.length = 0
}

export async function execute() {
  if(onlyTests.length) {
    console.log('🏃 Running only mode...')
    return runTests(onlyTests)
  }
  
  return runTests(tests)
}

async function runTests(tests: Test[]) {
  for (const test of tests) {
    try {
      await test()
    } catch (err) {
      console.error(`Error testing ${test.name}`)
      clearTests()
      throw err
    }
  }
  clearTests()
}

export function expect(expected: unknown) {
  return {
    toBeDefined: function toBeDefined(customMessage?: string | Function) {
      if(expected !== undefined && expected !== null) {
        return
      }

      if(customMessage instanceof Function) {
        customMessage = customMessage()
      }

      const message = customMessage || `Expected ${JSON.stringify(expected)} to be defined`
      console.error(message, {expected})
      throw new Error(message as string)
    },
    toBe: function toBe(received: unknown, customMessage?: string | Function) {
      if(expected === received) {
        return
      }

      if(customMessage instanceof Function) {
        customMessage = customMessage()
      }

      const message = customMessage || `Expected ${typeof(expected)} ${JSON.stringify(expected)} to be ${typeof(received)} ${JSON.stringify(received)}`
      console.error(message, {toBe: received, expected})
      throw new Error(message as string)
    },
    toBeGreaterThan: function toBeGreaterThan(amount: number, customMessage?: string) {
      const expectNum = expected as number
      if(!isNaN(expectNum) && expectNum > amount) {
        return
      }

      const message = customMessage || `Expected ${typeof(expected)} ${JSON.stringify(expected)} to be greater than amount`
      console.error(message, {amount, expected})
      throw new Error(message)
    },
    toBeLessThan: function toBeLessThan(amount: number, customMessage?: string) {
      const expectNum = expected as number
      if(!isNaN(expectNum) && expectNum < amount) {
        return
      }

      const message = customMessage || `Expected ${typeof(expected)} ${JSON.stringify(expected)} to be less than amount`
      console.error(message, {amount, expected})
      throw new Error(message)
    }
  }
}
