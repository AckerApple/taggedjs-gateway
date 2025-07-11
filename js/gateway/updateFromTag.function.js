import { renderSupport, setUseMemory } from "taggedjs";
import { parseElmProps } from "./parseProps.js";
export function updateFromTag(id, targetNode, tag) {
    const latestTag = tag.context.global.newest;
    const prevProps = latestTag.propsConfig?.latest;
    // const gateway = (targetNode as any).gateway
    const propMemory = parseElmProps(id, targetNode);
    const newProps = propMemory.props;
    // 7-2025: always render updates (would need to clone props otherwise)
    /*
    const isSameProps = hasPropChanges(newProps, prevProps, PropWatches.SHALLOW)
    if(isSameProps) {
      return // no reason to update, same props
    }
    */
    latestTag.templater.props = newProps;
    // after the next tag currently being rendered, then redraw me
    setUseMemory.tagClosed$.toCallback(() => {
        const latestTag = tag.context.global.newest;
        const anySupport = latestTag;
        anySupport.templater.props = newProps;
        renderSupport(anySupport);
    });
}
//# sourceMappingURL=updateFromTag.function.js.map