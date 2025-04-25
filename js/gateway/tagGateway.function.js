import { getTagId } from "./tagGateway.utils.js";
import { updateFromTag } from "./updateFromTag.function.js";
import { tagGateways } from "./globals.js";
import { checkElementGateway } from "./checkElementGateway.function.js";
export const tagGateway = function tagGateway(component) {
    const id = getTagId(component);
    if (tagGateways[id]) {
        return tagGateways[id];
    }
    let intervalId; // NodeJS.Timeout
    let hitCount = 0;
    const interval = 5;
    function findElements() {
        const elements = checkTagElementsById(id, component);
        if (!elements.length) {
            return elements.length;
        }
        // Element has been found, load
        if (intervalId) {
            clearInterval(intervalId);
        }
        delete tagGateways[id];
        return elements.length;
    }
    function findElement() {
        intervalId = setInterval(() => {
            hitCount = hitCount + interval;
            if (hitCount >= 2000) {
                clearInterval(intervalId);
                throw new Error(`TaggedJs Element ${id} not found`);
            }
            findElements();
        }, interval);
    }
    const gateway = {
        id, component,
        gates: [],
        propMemory: {},
        props: (key, props) => {
            return updateTagProps(gateway, key, [props]);
        },
        updateTag: (tag, element) => {
            updateFromTag(id, element, tag);
        }
    };
    const elementCounts = findElements();
    if (elementCounts) {
        return gateway;
    }
    findElement();
    tagGateways[id] = gateway;
    return tagGateways[id];
};
export function updateTagProps(gateway, key, props) {
    const propMem = gateway.propMemory;
    const memory = propMem[key] = propMem[key] || {
        props,
        callCount: 0,
    };
    memory.props = props;
    ++memory.callCount;
    // new props given after init will be analyzed to trigger new render (set by checkElementGateway)
    const { element, tag } = memory;
    if (element && tag) {
        gateway.updateTag(tag, element);
    }
    return key;
}
function checkTagElementsById(id, component) {
    const elements = document.querySelectorAll(`[tag="${id}"]`);
    return checkTagElements(id, elements, component);
}
function checkTagElements(id, elements, component) {
    elements.forEach(element => checkElementGateway(id, element, component));
    return elements;
}
//# sourceMappingURL=tagGateway.function.js.map