import { setLet, html, tag, onInit, getCallback, onDestroy } from "taggedjs"

const test0interval = 3000
const test1interval = 6000

export const intervalTester0 = tag(() => {
  let intervalCount: number = setLet(0)(x => [intervalCount, intervalCount = x])
  let intervalId: any = setLet(undefined)(x => [intervalId, intervalId = x])
  let intervalId2: any = setLet(undefined)(x => [intervalId2, intervalId2 = x])
  let renderCounter: number = setLet(0)(x => [renderCounter, renderCounter = x])
  let currentTime: number = setLet(0)(x => [currentTime, currentTime = x])
  const callback = getCallback()

  const increase = () => ++intervalCount

  console.log('intervalId', intervalId)

  const startInterval = () => {
    console.info('interval test 0 started...')
    trackTime()

    intervalId = setInterval(callback(() => {
      increase()
    }),test0interval)
  }

  const stopInterval = () => {
    clearInterval(intervalId)
    clearInterval(intervalId2)
    intervalId = undefined
    intervalId2 = undefined
    console.info('🛑 interval test 0 stopped')
  }

  function trackTime() {
    currentTime = 0
    
    intervalId2 = setInterval(callback(() => {
      currentTime = currentTime + 500

      if(currentTime >= test0interval) {
        currentTime = 0
        console.log('interval tick')
      }      
    }), 500)

    console.log('▶️ interval started')
  }

  const toggle = () => {
    if(intervalId || intervalId2) {
      stopInterval()
      return
    }

    startInterval()
  }

  const delayIncrease = () => setTimeout(callback(() => {
    currentTime = currentTime + 200
  }), 1000);

  onInit(startInterval)
  onDestroy(stopInterval)

  ++renderCounter

  return html`<!--intervalDebug.js-->
    <div>interval type 1 at ${test0interval}ms</div>
    intervalId: ${intervalId}
    <button type="button" onclick=${increase}>${intervalCount}:${renderCounter}</button>
    <input type="range" min="0" max=${test0interval} step="1" value=${currentTime} />
    <div>
      --${currentTime}--
    </div>
    <button type="button" onclick=${toggle}
      style.background-color=${intervalId || intervalId2 ? 'red' : 'green'}
    >start/stop</button>
    <button type="button" onclick=${delayIncrease}>delay increase currentTime</button>
  `
})

export const intervalTester1 = tag(() => {  
  let intervalCount: number = setLet(0)(x => [intervalCount, intervalCount = x])
  let intervalId: any = setLet(undefined)(x => [intervalId, intervalId = x])
  let intervalId2: any = setLet(undefined)(x => [intervalId2, intervalId2 = x])
  let renderCounter: number = setLet(0)(x => [renderCounter, renderCounter = x])
  let currentTime: number = setLet(0)(x => [currentTime, currentTime = x])
  
  const callback = getCallback()
  const increase = () => ++intervalCount

  function trackTime() {
    currentTime = 0
    
    intervalId2 = setInterval(callback(() => {
      currentTime = currentTime + 500

      if(currentTime >= test1interval) {
        currentTime = 0
      }
    }), 500)
  }

  const destroy = () => {
    clearInterval(intervalId)
    clearInterval(intervalId2)
    intervalId = undefined
    intervalId2 = undefined
    console.info('interval 1 stopped')
  }

  function toggleInterval() {
    if(intervalId) {
      return destroy()
    }

    console.info('interval test 1 started...')
    trackTime()
    intervalId = setInterval(callback(() => {
      increase()
      console.info('slow interval ran')
    }),test1interval)
  }

  onInit(toggleInterval)
  onDestroy(toggleInterval)

  ++renderCounter

  return html`
    <div>interval type 2 with ${test1interval}ms</div>
    intervalId: ${intervalId}
    <button type="button" onclick=${increase}>${intervalCount}:${renderCounter}</button>
    <input type="range" min="0" max=${test1interval} step="1" value=${currentTime} />
    <div>
      --${currentTime}--
    </div>
    <button type="button" onclick=${toggleInterval}
      style.background-color=${intervalId ? 'red' : 'green'}
    >start/stop</button>
  `
})
