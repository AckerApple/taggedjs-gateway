import { renderSupport, setUseMemory } from "taggedjs";
import { checkElementGateway, getTagId } from "./tagGateway.utils.js";
import { parseElmProps } from "./parseProps.js";
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
        props: (key, props) => {
            const memory = gateway.propMemory[key] = gateway.propMemory[key] || {
                props: [props],
                callCount: 0,
            };
            memory.props = [props];
            ++memory.callCount;
            // new props given after init will be analyzed to trigger new render
            const { element, tag } = memory;
            if (element && tag) {
                gateway.updateTag(tag, element);
            }
            return key;
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
function checkTagElementsById(id, component) {
    const elements = document.querySelectorAll(`[tag="${id}"]`);
    return checkTagElements(id, elements, component);
}
function checkTagElements(id, elements, component) {
    elements.forEach(element => checkElementGateway(id, element, component));
    return elements;
}
function updateFromTag(id, targetNode, tag) {
    const latestTag = tag.subject.global.newest;
    const prevProps = latestTag.propsConfig?.latest;
    const propMemory = parseElmProps(id, targetNode);
    const newProps = propMemory.props;
    const isSameProps = JSON.stringify(prevProps) === JSON.stringify(newProps);
    if (isSameProps) {
        return; // no reason to update, same props
    }
    latestTag.templater.props = newProps;
    // after the next tag currently being rendered, then redraw me
    setUseMemory.tagClosed$.toCallback(() => {
        const latestTag = tag.subject.global.newest;
        const anySupport = latestTag;
        anySupport.templater.props = newProps;
        renderSupport(anySupport);
    });
}
//# sourceMappingURL=tagGateway.function.js.map