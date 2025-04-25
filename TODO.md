### TODO NOW: Before Mega-aide

- Prevent attribute parsing failure on (click)=""

- HTML Tables
- routing
- Upgrade state to support both named and array state memory
  - helps with HMR
  - Can fix `state mismatch` error
- Test tag switch ${ trueFalse ? tagOne() : tagTwo() }
- All logging must go through subscriptions
- Production mode
  - Remove guards like state checks

### Small TODO
- How to have subscription display logic
  - ${subscribe => x}
  - html`...${subscribe(directory$, directory => {})}`
  - html`...${async(directoryPromise, directory => {})}`

### Extra testing
- Test switching a components return string
  - return x ? html`.0.` : html`.1.`

### Before wider audience
- remove console.errors
  - maybe have a subject that emits logs?
- Hot reloading
- How to load styles other than just inline & non-dynamic style tag that effects entire page
- Ability to produce one time HTML files
  - Then rehydrate with actual JavaScript
- SSR - server side rendering
  - we will need `<template start>` present
  - We may need to render attributes and then make a marker attribute
    - title="real title here" tag:title="__tagvar2_"


## Documentations

### TaggedJs differences from React
- Use ``` html`` ``` instead of `()` to define HTML content
  - `() => (<div></div>)` - React (19 chars)
  - ```() => html`<div></div>` ``` - TaggedJs (23 chars)
- Components render as `${component()}` instead of `<component />`
  - `() => (<div><component /></div>)` - ReactJs (32 chars)
  - ```() => html`<div>${component()}</div>` ``` - TaggedJs (37 chars)
- The boolean `true` will render to screen
- Render template syntax is `${}` instead of `{}`
  - `<div onclick={handler}></div>` - ReactJs (29 chars)
  - `<div onclick=${handler}></div>` - TaggedJs (30 chars)
- `className` is just `class`
  - `<div className={'flex'}></div>` - React (30 chars)
  - `<div class=${'flex'}></div>` - TaggedJs (27 chars)
- innerHTML can be the 1st or 2nd argument
  - `<div>${component(html`<small>hello world</small>`)}</div>`
  - `<div>${component({ x: y }, html`<small>hello world</small>`)}</div>`
  - The component always has fixed arguments for this of `component = (props, {children})`

### Benefits to TaggedJs over React

- You can have multiple root elements in TaggedJs
  - You don't need `<></>`
  - In React this will fail `() => (<div>Hello</div><div>World</div>)
  - In TaggedJs this will work `() => html`<div>Hello</div><div>World</div>`
- You can have components with single argument inputs:
  - instead of  `Hello <something x=3> World`
  - you can now `Hello ${something(3)} World`
  - The component for this is very small `export const something = tag(x => html`${x}rd`)`
- Concept of providers
- Provided hooks
  - state hook
  - subscribe hook - coming soon
  - render hook - move
  - init hook - move
  - async hook - move

### Angular similarities
- Support for bracket element definitions
  - `<div style.background-color]="red"></div>`
  - NOT [style.background-color]="'red'"
  - NOT [style.backgroundColor]="'red'" NOR [style.backgroundColor]="red"