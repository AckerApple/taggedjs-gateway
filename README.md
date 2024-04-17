# taggedjs-gateway
Creates the ability to use taggedjs within other frameworks such as React and Angular

## Install

```bash
npm install taggedjs taggedjs-gateway
```

## Use with Angular

```ts
import { Component } from "@angular/core"
import { loadTagGateway } from "taggedjs-gateway"
import { html } from "taggedjs"

const yourTagComponent = tag(({someNumber, another}) => {
  return html`<div>number:${someNumber} - another:${another}</div>`
})

@Component({
  selector: 'dump',
  template: `
    <div [id]="yourTagId"
      [attr.props]="({
        someNumber: value,
        another: variable,
      }) | json"
    </div>
  `,
}) export class DumpComponent {
  yourTagId = loadTagGateway( yourTagComponent )
  
  // props
  value = 22
  variable = 'another'
}
```