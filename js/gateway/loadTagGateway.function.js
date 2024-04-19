import { initWebComponents } from "./gateway.web.component.js";
import { gateways, getTagId } from "./tagGateway.utils.js";
let hasInitWebComponents = false;
export function loadTagGateway(component) {
    if (!hasInitWebComponents) {
        try {
            initWebComponents();
        }
        catch (err) {
            throw err;
        }
        hasInitWebComponents = true;
    }
    const id = getTagId(component);
    gateways[id] = gateways[id] || {
        gates: [],
        tagComponent: component
    };
    gateways[id].tagComponent = component;
    return id;
}
//# sourceMappingURL=loadTagGateway.function.js.map