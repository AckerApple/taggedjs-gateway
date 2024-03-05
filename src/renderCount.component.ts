import { tag, html } from "taggedjs"

export const renderCountDiv = tag((
  {renderCount, name}: {
    renderCount: number
    name: string
  }
) => html`<div><small>(${name} render count ${renderCount})</small></div>`)
