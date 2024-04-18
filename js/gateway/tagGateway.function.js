import { checkElementGateway, getTagId } from "./tagGateway.utils.js";
export const tagGateways = {};
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
        id,
        propMemory: {},
        props: (key, getProps) => {
            gateway.propMemory[key] = getProps;
            return key;
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
function checkTagElementsById(id, component) {
    const elements = document.querySelectorAll(`[tag="${id}"]`);
    return checkTagElements(id, elements, component);
}
function checkTagElements(id, elements, component) {
    elements.forEach(element => checkElementGateway(id, element, component));
    return elements;
}
//# sourceMappingURL=tagGateway.function.js.map