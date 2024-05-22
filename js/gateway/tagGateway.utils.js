import { tagElement } from "taggedjs";
import { loadTagGateway } from "./loadTagGateway.function.js";
import { tagGateways } from "./tagGateway.function.js";
import { parseElmProps } from "./parseProps.js";
export const gateways = {};
export function checkAllGateways() {
    Object.entries(gateways).forEach(([id, gateways]) => checkGateways(gateways.gates));
}
export function checkGateways(gateways) {
    gateways.forEach(gateway => checkGateway(gateway));
}
function checkGateway(gateway) {
    const { element } = gateway;
    if (document.body.contains(element)) {
        return true; // its still good, do not continue to destroy
    }
    destroyGateway(gateway);
    return false;
}
export function destroyGateway(gateway) {
    const { id, observer, tag } = gateway;
    observer.disconnect();
    tag.destroy();
    delete gateways[id];
}
export function getTagId(component) {
    const fun = component.parentWrap.original || component;
    const componentString = functionToHtmlId(fun);
    return '__tagTemplate_' + componentString;
}
/** adds to gateways[id].push */
function watchElement(id, // tag id
targetNode, tag, component) {
    const tagGateway = tagGateways[id];
    const observer = new MutationObserver(mutationsList => {
        if (!checkGateway(gateway)) {
            return;
        }
        for (const mutation of mutationsList) {
            if (mutation.type === 'attributes') {
                updateTag();
            }
        }
    });
    function updateTag() {
        tagGateway.updateTag(tag, targetNode);
    }
    loadTagGateway(component);
    const gateway = {
        id, tag,
        observer,
        component,
        element: targetNode,
        updateTag,
        tagGateway,
    };
    gateways[id] = gateways[id] || [];
    gateways[id].gates.push(gateway);
    targetNode.gateway = gateway;
    // Configure the observer to watch for changes in child nodes and attributes
    const config = { attributes: true };
    // Start observing the target node for specified changes
    observer.observe(targetNode, config);
    return gateway;
}
function functionToHtmlId(func) {
    // Convert function to string
    let funcString = func.toString();
    // Remove spaces and replace special characters with underscores
    let cleanedString = funcString.replace(/\s+/g, '_')
        .replace(/[^\w\d]/g, '_');
    // Ensure the ID starts with a letter
    if (!/^[a-zA-Z]/.test(cleanedString)) {
        cleanedString = 'fn_' + cleanedString;
    }
    return cleanedString;
}
export function checkByElement(element) {
    const gateway = element.gateway;
    let tagName = gateway?.id || element.getAttribute('tag');
    if (!tagName) {
        const message = 'Tagged gateway element must have a "tag" attribute which describes which tag to use';
        console.warn(message, { element });
        throw new Error(message);
    }
    if (!tagName) {
        const message = 'Cannot check a tag on element with no id attribute';
        console.warn(message, { tagName, element });
        throw new Error(message);
    }
    const component = gateways[tagName].tagComponent;
    if (!component) {
        const message = `Cannot find a tag registered by id of ${tagName}`;
        console.warn(message, { tagName, element });
        throw new Error(message);
    }
    return checkElementGateway(tagName, element, component);
}
export function checkElementGateway(id, element, component) {
    const gateway = element.gateway;
    if (gateway) {
        gateway.updateTag();
        return gateway;
    }
    const propMemory = parseElmProps(id, element);
    const props = propMemory.props;
    try {
        const { tagSupport } = tagElement(component, element, props);
        propMemory.element = element;
        propMemory.tag = tagSupport;
        // watch element AND add to gateways[id].push()
        return watchElement(id, element, tagSupport, component);
    }
    catch (err) {
        console.warn('Failed to render component to element', {
            component,
            element,
            props,
            err,
        });
        throw err;
    }
}
//# sourceMappingURL=tagGateway.utils.js.map