import { tagGateways } from "./globals.js";
export function parseElmProps(id, // element.id
element) {
    const propsId = element.getAttribute('props');
    if (propsId) {
        // const elmGateway = (element as any).gateway as Gateway
        const tagGateway = tagGateways[id]; // || gateway.tagGateway
        const propMemory = tagGateway.propMemory[propsId];
        parseElmOutputs(element, propMemory.props);
        return propMemory;
    }
    const propsJsonString = element.getAttribute('propsJson');
    if (propsJsonString) {
        const propsJson = JSON.parse(propsJsonString);
        parseElmOutputs(element, propsJson);
        return { props: propsJson, callCount: 0 };
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
    parseElmOutputs(element, [props]);
    return {
        props: [props], callCount: 0,
    };
}
function parseElmOutputs(element, props) {
    // attribute eventProps as output bindings
    const eventPropsString = element.getAttribute('events');
    if (eventPropsString) {
        eventPropsString.split(',').map(x => x.trim()).map((name) => {
            props[0][name] = (value) => dispatchEvent(name, { detail: { [name]: value } });
        });
    }
    const dispatchEvent = function (name, eventData) {
        const event = new CustomEvent(name, eventData);
        element.dispatchEvent(event);
    };
    return props;
}
//# sourceMappingURL=parseProps.js.map