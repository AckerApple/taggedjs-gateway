import { ValueTypes, ContextItem, paint, Tag, Support, TaggedFunction, SupportTagGlobal } from "taggedjs"
import { updateSubject } from "./updateSubject.function"
import { HmrImport } from "./hmr"

/**
 * 
 * @param {Support} ownerSupport 
 * @param {{oldTag: TagComponent, newTag: TagComponent}} param1 
 * @param {HmrImport} hmr 
 * @returns {Promise<number>}
 */
export async function replaceTemplater(
  ownerSupport: Support,
  {oldTag, newTag}: {
    oldTag: TaggedFunction<any>
    newTag?: TaggedFunction<any>
  },
  hmr: HmrImport,
  isApp: boolean,
) {
  if(!newTag) {
    console.warn('no new tag issue?', {oldTag, newTag})
    return 0
  }

  let count = 0
  const templater = ownerSupport.templater
  const tag = templater.tag as Tag
  const values = tag.values

  // loop all values looking for original functions that match oldTag to replace newTag with
  const promises = values.map(async (value: unknown, index) => {
    const matchGlobal = ownerSupport.subject.global as SupportTagGlobal
    const matchContext = matchGlobal.context as ContextItem[]
    const contextItem = matchContext[ index ]
    count = await checkToUpdateSubject(
      value,
      contextItem,
      oldTag,
      newTag,
      hmr,
      count,
      isApp,
    )
  })
  
  await Promise.all(promises)
  
  paint()
  hmr.paint()

  
  // loop children to process the context they have
  const global = ownerSupport.subject.global as SupportTagGlobal
  const context = global.context
  const subPromises = context.map(async child => {
    const childGlobal = child.global as SupportTagGlobal

    if(!childGlobal) {
      return
    }

    const support = childGlobal.oldest as Support

    if(support) {
      const newCount = await replaceTemplater(
        support,
        {oldTag, newTag},
        hmr, isApp,
      )

      if(newCount > 0) {
        count = newCount + count
        if(isApp && (oldTag.original as any)?.isApp) {
          console.log('app templater just now replaced', {
            count, newCount, newTag, oldTag,
          })
        }
      }
    }
  })

  await Promise.all(subPromises)

  return count
}

async function checkToUpdateSubject(
  value: any,
  contextItem: ContextItem,
  oldTag: TaggedFunction<any>,
  newTag: TaggedFunction<any>,
  hmr: any,
  count: number,
  isApp: boolean,
): Promise<number> {
  const tagJsType = value && value.tagJsType
  if(!tagJsType) {
    // console.log('not a value for us?', {value})
    return count// not a tagJsType value
  }

  const isTemplater = [
    ValueTypes.templater[0],
    // ValueTypes.renderOnce[0], // TODO: HMR does not support render once
    ValueTypes.tagComponent[0],
    ValueTypes.stateRender[0],
    // ValueTypes.dom[0],
    ValueTypes.tag[0],
  ].includes(tagJsType[0])
  
  if(!isTemplater) {
    return count
  }

  const oldest = (contextItem.global as SupportTagGlobal)?.oldest
  const newOriginal = oldest?.templater.wrapper?.original
  if(oldTag.original.toString() === newOriginal?.toString()) {
    oldTag.original = newOriginal

    await updateSubject(
      contextItem, newTag, oldTag, hmr
    )
    
    ++count
  }

  
  return count
}
/*
function wrapperHasTagMethod(
  wrapper: TaggedFunction<any>,
  oldTag: TaggedFunction<any>,
) {
  const ogFun = wrapper.original

  const original = oldTag.original
  const match0 = ogFun === original
  if(match0) {
    return 1
  }

  const match1 = ogFun.toString() === original.toString()
  if(match1) {
    return 2
  }

  const match2 = (wrapper as any).compareTo === original.toString()
  return match2
}
*/
