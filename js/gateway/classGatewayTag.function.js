import { getTagId } from "./tagGateway.utils.js";
import { loadTagGateway } from "./loadTagGateway.function.js";
/** Typically used for Angular */
export function classGatewayTag(component) {
    const id = getTagId(component) + '_' + performance.now();
    return loadTagGateway(component, id);
}
//# sourceMappingURL=classGatewayTag.function.js.map