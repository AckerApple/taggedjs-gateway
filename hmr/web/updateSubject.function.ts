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
import { DomTag, StringTag, buildBeforeElement, ContextItem, destroySupport, paint, Support, SupportTagGlobal, TaggedFunction, Wrapper, AnySupport, SupportContextItem, Original, ContextStateSupport } from "taggedjs"

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
  const oldest = (contextSubject as SupportContextItem).state.oldest as Support
  const newest = (contextSubject as SupportContextItem).state.newest as Support

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
    }
  }

  await swapSupport(
    contextSubject as SupportContextItem,
    hmr,
  )
}

async function swapSupport(
  contextSubject: SupportContextItem,
  hmr: HmrImport,
) {
  const global = contextSubject.global as SupportTagGlobal  
  const oldest = (contextSubject as SupportContextItem).state.oldest as Support
  const newest = (contextSubject as SupportContextItem).state.newest as Support

  const pros = contextSubject.providers
  const prevConstructors = pros ? pros.map(provider => provider.constructMethod) : []
  const placeholder = contextSubject.placeholder

  await destroySupport(oldest, global)
  const reGlobal = contextSubject.global as SupportTagGlobal
  delete reGlobal.deleted

  // TODO: ISSUE I believe is here using the other context. Need to ensure handler and processors are NOT arrow functions

  // const reSupport = hmr.reRenderTag(
  const reSupport = hmr.firstTagRender(
    newest,
    newest,
    contextSubject as SupportContextItem,
    newest.ownerSupport,
  )

  const appSupport = oldest.appSupport
  const ownerSupport = oldest.ownerSupport as AnySupport
  // const ownGlobal = ownerSupport.context.global as SupportTagGlobal
  const providers = contextSubject.providers
  const owner = ownerSupport.context.state.oldest as Support

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
    undefined,
    placeholder,
  )

  recurseContext(contextSubject.contexts as SupportContextItem[], reSupport)

  paint()

  ;(contextSubject as SupportContextItem).state.newest = reSupport
  ;(contextSubject as SupportContextItem).state.oldest = reSupport
}

function recurseContext(
  context: SupportContextItem[],
  reSupport: AnySupport,
) {
  /*
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
  */

  context.forEach(contextItem => {
    /*
    if(isSubjectInstance(contextItem.value)) {
      processSubUpdate(contextItem.value, contextItem, reSupport)
    }
    */
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
      const nextContext = contextItem.contexts
      if(nextContext) {
        const nextSupport = contextItem.state.newest as AnySupport
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
