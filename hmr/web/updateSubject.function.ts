/**
 * @typedef {import("taggedjs").renderTagOnly} renderTagOnly
 * @typedef {import("taggedjs").TagComponent} TagComponent
 * @typedef {import("taggedjs").Tag} Tag
 * @typedef {import("taggedjs").TagSupport} TagSupport
 * @typedef {import("taggedjs").tagElement} tagElement
 * @typedef {import("taggedjs").renderWithSupport} renderWithSupport
 * @typedef {import("taggedjs").renderTagSupport} renderTagSupport
 */

import { LikeObjectChildren } from "taggedjs/js/interpolations/optimizers/LikeObjectElement.type.js"
import { HmrImport } from "./hmr.js"
import { switchAllProviderConstructors } from "./switchAllProviderConstructors.function"
import { processSubUpdate, DomTag, StringTag, buildBeforeElement, ContextItem, destroySupport, paint, Support, SupportTagGlobal, TaggedFunction, isSubjectInstance, Wrapper, AnySupport, SupportContextItem, ValueTypes, Original } from "taggedjs"

/** @typedef {{renderTagOnly: renderTagOnly, renderSupport: renderSupport, renderWithSupport: renderWithSupport}} HmrImport */

/**
 * Used to switch out the wrappers of a subject and then render
 * @param {*} contextSubject 
 * @param {TagComponent} newTag 
 * @param {TagComponent} oldTag 
 * @param {HmrImport} hmr 
 */
export async function updateSubject(
  contextSubject: ContextItem,
  newTag: TaggedFunction<any>,
  oldTag: TaggedFunction<any>,
  hmr: HmrImport,
) {
  const global = contextSubject.global as SupportTagGlobal  
  const oldest = global.oldest as Support
  const newest = global.newest as Support

  const oldTemplater = oldest.templater
  const oldWrapper = oldTemplater.wrapper as Wrapper | undefined
  
  if(oldWrapper) {
    if(oldWrapper.original.toString() === oldTag.original.toString()) {
      oldWrapper.original = newTag.original as Original

      const toString = newTag.original.toString()
      const original = (oldTag as any).original
      // contextSupport.templater.wrapper.original.compareTo = toString
      if(original) {
        // TODO: we may not ever get in here due to above bad data typed condition
        (oldTag as any).compareTo = toString
      }
      
      // everytime an old owner tag redraws, it will use the new function
      oldTag.original = newTag.original
      const contextWrapper = newest.templater.wrapper as Wrapper
      contextWrapper.original = newTag.original as Original
      
      const newWrapper = newest.templater.wrapper as Wrapper
      newWrapper.original = newTag.original as Original
      
      const strings = (global.oldest.templater.tag as StringTag).strings
      const dom = (global.oldest.templater.tag as DomTag).dom

      if(original.toString().includes('sections') || strings?.includes('sections')) {
        console.log('we are swapping sections......')
      }
    
      if(dom && findText('sections', dom)) {
        console.log('we found it!!!!')
      }
    
      console.log('swapping supports-----', {
        oldest,
        state: oldest?.state
      })    
    }
  }

  await swapSupport(
    contextSubject, hmr,
  )
}

async function swapSupport(
  contextSubject: ContextItem,
  hmr: HmrImport,
) {
  const global = contextSubject.global as SupportTagGlobal  
  const oldest = global.oldest as Support
  const newest = global.newest as Support

  const pros = global.providers
  const prevConstructors = pros ? pros.map(provider => provider.constructMethod) : []
  const placeholder = contextSubject.placeholder

  await destroySupport(oldest)
  const reGlobal = contextSubject.global as SupportTagGlobal
  delete reGlobal.deleted

  const reSupport = hmr.renderTagOnly(
    newest,
    newest,
    contextSubject as SupportContextItem,
    newest.ownerSupport,
  )

  const appSupport = oldest.appSupport
  const ownerSupport = oldest.ownerSupport as AnySupport
  const ownGlobal = ownerSupport.subject.global as SupportTagGlobal
  const providers = global.providers
  const owner = ownGlobal.oldest as Support

  // connect child to owner
  reSupport.ownerSupport = owner

  if(providers) {
    providers.forEach((provider, index) => {
      prevConstructors[index].compareTo = provider.constructMethod.compareTo
      provider.constructMethod.compareTo = provider.constructMethod.toString()
      switchAllProviderConstructors(appSupport, provider)
    })
  }

  buildBeforeElement(
    reSupport,
    {added:0, removed: 0},
    undefined,
    placeholder,
  )

  recurseContext(global.context, reSupport)

  paint()

  reGlobal.newest = reSupport
  reGlobal.oldest = reSupport
}

function recurseContext(
  context: SupportContextItem[],
  reSupport: AnySupport,
) {
  switch (reSupport.templater.tagJsType[0]) {
    case ValueTypes.dom[0]:
      reSupport.templater.tagJsType = ValueTypes.dom
      break

      case ValueTypes.templater[0]:
      reSupport.templater.tagJsType = ValueTypes.templater
      break

      case ValueTypes.tagComponent[0]:
      reSupport.templater.tagJsType = ValueTypes.tagComponent
      break
  }

  context.forEach(contextItem => {
    if(isSubjectInstance(contextItem.value)) {
      processSubUpdate(contextItem.value, contextItem, reSupport)
      /*
      processFirstSubjectValue(
        contextItem.value,
        contextItem,
        reSupport,
        {added:0, removed:0},
        `rvp_-1_${reSupport.templater.tag?.values.length}`,
        undefined // syncRun ? appendTo : undefined,
      )
      */
    }
    /*
    if(contextItem.subject) {
      processFirstSubjectValue(
        contextItem.value,
        contextItem,
        reSupport,
        {added:0, removed:0},
        `rvp_-1_${reSupport.templater.tag?.values.length}`,
        undefined // syncRun ? appendTo : undefined,
      )  
    }
    */

    const nextGlobal = contextItem.global

    if(contextItem.global) {
      const nextContext = nextGlobal?.context
      if(nextContext) {
        const nextSupport = nextGlobal.newest as AnySupport
        recurseContext(nextContext, nextSupport)
      }
    }

  })
}

function findText(
  text: string,
  dom: LikeObjectChildren,
) {
  const found = dom.find(x => {
    if(x.tc && x.tc.includes(text)) {
      return true
    }

    if(x.ch) {
      return findText(text, x.ch)
    }
  })

  if(found) {
    return true
  }
}
