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
    <!-- simple variable props only -->
    <div [attr.tag:id]="yourTag.id"
      [attr.someNumber]="value"
      [attr.another]="variable"
    ></div>
    
    <!-- OR -->

    <!-- complex variable props -->
    <div [attr.tag]="yourTag.id"
      [attr.props]="yourTag.props({ someNumber:value, another:variable })"
    ></div>
  `,
}) export class DumpComponent {
  yourTagId = loadTagGateway( yourTagComponent )
  
  // props
  value = 22
  variable = 'another'
}
```