import { html, set, tag } from "taggedjs";
import { gatewayDebug } from "./gatewayDebug.component";
export const IsolatedApp = tag(() => {
    const stateTest = set('isolated-app-state');
    return html `<!--isolatedApp.js-->
    <h1 id="app">🌉 TaggedJs Gateway - isolated</h1>

    <div id="tagDebug-fx-wrap">
      <div style="display:flex;flex-wrap:wrap;gap:1em">
        <fieldset style="flex:2 2 20em">
          <legend>gatewayDebug</legend>
          ${gatewayDebug()}
        </fieldset>
      </div>
    </div>
  `;
});
//# sourceMappingURL=isolatedApp.js.map