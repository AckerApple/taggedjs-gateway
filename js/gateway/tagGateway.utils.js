import { tagElement, renderTagSupport } from "taggedjs";
import { loadTagGateway } from "./loadTagGateway.function.js";
import { tagGateways } from "./tagGateway.function.js";
import { tagClosed$ } from "taggedjs/js/tagRunner.js";
const gateways = {};
export const gatewayTagIds = {};
export function checkAllGateways() {
    Object.entries(gateways).forEach(([id, gateways]) => checkGateways(gateways));
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
    const componentString = functionToHtmlId(component);
    return '__tagTemplate_' + componentString;
}
function parseElmProps(id, // element.id
element) {
    const propsId = element.getAttribute('props');
    if (propsId) {
        const props = tagGateways[id].propMemory[propsId];
        parseElmOutputs(element, props);
        return props;
    }
    const attrNames = element.getAttributeNames();
    const props = attrNames.reduce((all, attrName) => {
        const nameSplit = attrName.split(':');
        let value = element.getAttribute(attrName);
        if (nameSplit.length > 1) {
            switch (nameSplit[1]) {
                case 'number':
                    value = Number(value);
                    break;
            }
            attrName = nameSplit[0];
        }
        all[attrName] = value;
        return all;
    }, {});
    delete props.tag;
    parseElmOutputs(element, props);
    return props;
}
function parseElmOutputs(element, props) {
    // attribute eventProps as output bindings
    const eventPropsString = element.getAttribute('events');
    if (eventPropsString) {
        eventPropsString.split(',').map(x => x.trim()).map((name) => {
            props[name] = (value) => dispatchEvent(name, { detail: { [name]: value } });
        });
    }
    const dispatchEvent = function (name, eventData) {
        const event = new CustomEvent(name, eventData);
        element.dispatchEvent(event);
    };
    return props;
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
        const templater = tag.tagSupport.templater;
        // const propsConfig = templater.tagSupport.propsConfig
        const latestTag = templater.global.newest;
        const prevProps = latestTag.tagSupport.templater.props;
        const newProps = parseElmProps(id, targetNode);
        const isSameProps = JSON.stringify(prevProps) === JSON.stringify(newProps);
        // const isSameProps = deepEqual(oldProps, newProps) // dont have access to this
        if (isSameProps) {
            return; // no reason to update, same props
        }
        // propsConfig.latest = newProps
        latestTag.tagSupport.templater.props = newProps;
        // after the next tag currently being rendered, then redraw me
        tagClosed$.toCallback(() => {
            const latestTag = templater.global.newest;
            const tagSupport = latestTag.tagSupport;
            // tagSupport.propsConfig.latestCloned = newProps
            // tagSupport.propsConfig.latest = newProps
            tagSupport.templater.props = newProps;
            renderTagSupport(tagSupport, false);
        });
    }
    loadTagGateway(component);
    const gateway = {
        id, tag, observer, component,
        element: targetNode,
        updateTag,
        tagGateway,
    };
    gateways[id] = gateways[id] || [];
    gateways[id].push(gateway);
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
    const id = gateway.id || element.getAttribute('tag');
    if (!id) {
        const message = 'Cannot check a tag on element with no id attribute';
        console.warn(message, { id, element });
        throw new Error(message);
    }
    const component = gatewayTagIds[id];
    if (!component) {
        const message = `Cannot find a tag registered by id of ${id}`;
        console.warn(message, { id, element });
        throw new Error(message);
    }
    return checkElementGateway(id, element, component);
}
export function checkElementGateway(id, element, component) {
    const gateway = element.gateway;
    if (gateway) {
        gateway.updateTag();
        return gateway;
    }
    const props = parseElmProps(id, element);
    try {
        const { tag } = tagElement(component, element, props);
        // watch element AND add to gateways[id].push()
        return watchElement(id, element, tag, component);
    }
    catch (err) {
        console.warn('Failed to render component to element', { component, element, props });
        throw err;
    }
}
//# sourceMappingURL=tagGateway.utils.js.map