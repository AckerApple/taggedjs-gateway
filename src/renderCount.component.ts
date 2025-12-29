import { tag, div, small } from "taggedjs"

export const renderCountDiv = tag((
  {renderCount, name}: {
    renderCount: number
    name: string
  }
) => div(
  small(`(${name} render count ${renderCount})`)
))
