import { div, fieldset, h1, html, legend, state, tag } from "taggedjs"
import { gatewayDebug } from "./gatewayDebug.tag"

export const IsolatedApp = tag(() => {
  return div(
    h1({id:"app"}, '🌉 TaggedJs Gateway - isolated'),

    div({id:"tagDebug-fx-wrap"},
      div({style:"display:flex;flex-wrap:wrap;gap:1em"},
        fieldset({style:"flex:2 2 20em"},
          legend('gatewayDebug'),
          _=> gatewayDebug()
        )
      )
    )
  )
})
