import { hasPropChanges, AnySupport, renderSupport, setUseMemory, PropWatches, deepClone, PropsConfig, paint } from "taggedjs"
import { parseElmProps } from "./parseProps.js"

export function updateFromTag(
  id: string,
  targetNode: Element,
  tag: AnySupport
) {
  const latestTag = tag.context.state.newest as AnySupport
  const prevProps = latestTag.propsConfig?.latest as any
  // const gateway = (targetNode as any).gateway
  const propMemory = parseElmProps(id, targetNode)
  const newProps = propMemory.props

  // Clone props before shallow checking to avoid mutation issues
  /*
  const clonedNewProps = deepClone(newProps, 2)

  const isSameProps = hasPropChanges(clonedNewProps, prevProps, PropWatches.SHALLOW)
  if(isSameProps) {
    return // no reason to update, same props
  }
  */

  latestTag.templater.props = newProps

  // after the next tag currently being rendered, then redraw me
  setUseMemory.tagClosed$.toCallback(() => {
    const context = tag.context
    
    const latestTag = context.state.newest as AnySupport
    latestTag.templater.props = newProps
    
    const propsConfig = tag.propsConfig as PropsConfig
    propsConfig.latest = newProps
    propsConfig.castProps = newProps
    tag.returnValue.props = newProps
    context.value.props = newProps
    ;(tag as any).castedProps = newProps
    // renderSupport(anySupport)

    tag.context.tagJsVar.processUpdate(context.value, context, tag, [])

    paint()
  })
}
