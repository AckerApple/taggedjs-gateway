import { setUseMemory, paint } from "taggedjs";
import { parseElmProps } from "./parseProps.js";
export function updateFromTag(id, targetNode, tag) {
    const latestTag = tag.context.state.newest;
    const prevProps = latestTag.propsConfig?.latest;
    // const gateway = (targetNode as any).gateway
    const propMemory = parseElmProps(id, targetNode);
    const newProps = propMemory.props;
    // Clone props before shallow checking to avoid mutation issues
    /*
    const clonedNewProps = deepClone(newProps, 2)
  
    const isSameProps = hasPropChanges(clonedNewProps, prevProps, PropWatches.SHALLOW)
    if(isSameProps) {
      return // no reason to update, same props
    }
    */
    latestTag.templater.props = newProps;
    // after the next tag currently being rendered, then redraw me
    setUseMemory.tagClosed$.toCallback(() => {
        const context = tag.context;
        const latestTag = context.state.newest;
        latestTag.templater.props = newProps;
        const propsConfig = tag.propsConfig;
        propsConfig.latest = newProps;
        propsConfig.castProps = newProps;
        tag.returnValue.props = newProps;
        context.value.props = newProps;
        tag.castedProps = newProps;
        // renderSupport(anySupport)
        tag.context.tagJsVar.processUpdate(context.value, context, tag, []);
        paint();
    });
}
//# sourceMappingURL=updateFromTag.function.js.map