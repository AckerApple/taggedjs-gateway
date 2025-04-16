import { tag, html } from "taggedjs";
export const renderCountDiv = tag(({ renderCount, name }) => html `<div><small>(${name} render count ${renderCount})</small></div>`);
