# taggedjs-gateway
Creates the ability to use taggedjs within other frameworks such as React and Angular

## Install

```bash
npm install taggedjs taggedjs-gateway
```

## Use with Angular

Multiple ways to approach this

Enable the ability to use the custom tag `<tag-element>`
```ts
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'
@NgModule({schemas: [CUSTOM_ELEMENTS_SCHEMA]})
```

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
    <!-- new -->
    <div [attr.tag]="yourTag.id"
      [attr.props]="yourTag.props('unique-id', {someNumber: value, another:variable})"
    ></div>

<!-- simple variable props only -->
    <div [attr.tag]="yourTag.id"
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
  yourTag = loadTagGateway( yourTagComponent )
  
  // props
  value = 22
  variable = 'another'
}
```