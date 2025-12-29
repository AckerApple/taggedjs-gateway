import { Gateway, checkByElement, destroyGateway } from "./tagGateway.utils.js"

/** <tag-element id="" props="json-string" />
 * For Angular @NgModule({schemas: [CUSTOM_ELEMENTS_SCHEMA]}) is required
 */
export class TagElement extends HTMLElement {
  gateway!: Gateway

  gatewayPromise = Promise.resolve()

  constructor() {
    super()

    this.gatewayPromise = this.gatewayPromise.then(() => {
      return new Promise<void>((resolve) => {
        // this.gateway = checkByElement(this)
        setTimeout(() => {
          this.gateway = checkByElement(this)
          resolve()
        }, 0)
      })
    })
  }

  disconnectedCallback() {
    this.gatewayPromise.then(() => {
      destroyGateway(this.gateway)
    })
  }
}

export const tagName = 'tag-element'

/** Call me one time */
export function initWebComponents() {
  customElements.define(tagName, TagElement)
}
