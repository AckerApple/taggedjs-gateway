import { tagElement } from "taggedjs";
import { parseElmProps } from "./parseProps.js";
import { watchElement } from "./tagGateway.utils.js";
export function checkElementGateway(tagId, element, component) {
    const gateway = element.gateway;
    if (gateway) {
        gateway.updateTag();
        return gateway;
    }
    const propMemory = parseElmProps(tagId, element);
    const props = propMemory.props;
    try {
        const { support } = tagElement(component, element, props[0]);
        propMemory.element = element;
        propMemory.tag = support;
        // watch element AND add to gateways[id].push()
        const gateway = watchElement(tagId, element, support, component);
        element.gateway = gateway;
        return gateway;
    }
    catch (err) {
        console.warn('Failed to render component to element', {
            component,
            element,
            props: props[0],
            err,
        });
        throw err;
    }
}
//# sourceMappingURL=checkElementGateway.function.js.map