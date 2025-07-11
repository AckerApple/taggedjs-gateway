/** client code */

// 🟠 Warning: avoid direct imports due to bundle workflow (old bundle and new bundle do not mix well)
import { UseMemory, renderWithSupport, renderSupport, renderTagOnly, paint, TemplaterResult, Support, TaggedFunction, Wrapper, ValueTypes, TagAppElement, setUseMemory, Original } from "taggedjs"
import { replaceTemplater } from "./replaceTemplater.function"

/** @type {Support | undefined} */
let lastApp: Support

reconnect()

/**
 * @typedef {import("taggedjs").renderTagOnly} renderTagOnly
 * @typedef {import("taggedjs").TagComponent} TagComponent
 * @typedef {import("taggedjs").TagWrapper} TagWrapper
 * @typedef {import("taggedjs").Tag} Tag
 * @typedef {import("taggedjs").Support} Support
 * @typedef {import("taggedjs").tagElement} tagElement
 * @typedef {import("taggedjs").renderWithSupport} renderWithSupport
 * @typedef {import("taggedjs").renderSupport} renderSupport
 * @typedef {import("taggedjs").paint} paint
 */

/** @typedef {{paint: paint, renderTagOnly: renderTagOnly, renderSupport: renderSupport, renderWithSupport: renderWithSupport}} HmrImport */
export type HmrImport = {
  paint: typeof paint
  renderTagOnly: typeof renderTagOnly
  renderSupport: typeof renderSupport
  renderWithSupport: typeof renderWithSupport
}

function reconnect() {
  console.log('reconnect?')
  const socket = new WebSocket('ws://localhost:3000');

  // Listen for WebSocket errors
  socket.addEventListener('error', (event) => {
    console.error('WebSocket error:', event);
  })

  // Connection opened
  socket.addEventListener('open', (event) => {
    console.info('WebSocket connection opened:', event);
  })

  // Listen for messages from the server
  socket.addEventListener('message', async (event) => {
    console.info('💬 from server:', event.data, event.data);

    if(event.data==='Connected to the WebSocket endpoint') {
      // immediately overwrite existing running app
      rebuildApps()        
      return
    }

    runElementSelector()
  })

  // Connection closed
  socket.addEventListener('close', (event) => {
    console.info('WebSocket connection closed:', event);

    reconnect()
  })
}

function runElementSelector() {
  forEachApp(app => {
    updateByElement(app)
  })
}

function forEachApp(method: (x: Element) => any) {
  const array = [...document.querySelectorAll('app')]
  array.forEach(method)
}

type DiscoveredTag = {
  newApp: any;
  newTemplater: TemplaterResult;
  tagName: string;
}

/** Runs browser import command to load updated app code */
async function discoverTags(): Promise<DiscoveredTag[]> {
  const baseArray = document.querySelectorAll('[tag]')
  const array = [...baseArray]
  
  const promises = array.map(async element => {
    const url = element.getAttribute('url')
    const tagName = element.getAttribute('name') as string

    const newApp = await import(`${url}?${Date.now()}`)

    if(!newApp[tagName]) {
      throw new Error(`Cannot find export ${tagName} from ${url}`)
    }

    if(!newApp.hmr) {
      throw new Error(`Cannot find export hmr from ${url}`)
    }

    try {
      const newTemplater = newApp[tagName]() as TemplaterResult
      return {
        newApp,
        newTemplater,
        tagName
      }
    } catch(err) {
      console.error(`Could not load tag by name ${tagName}`, {newApp, url})
      throw err
    }
  })

  const results = await Promise.all(promises)

  return results
}

/** @type {TagComponent{}} */
let lastTags: TaggedFunction<any>[] = []

/**
 * 
 * @param {Element} app 
 */
async function updateByElement(
  app: Element
) {
  const tagAppElm: TagAppElement = app as any

  /** @type {TagComponent[]} */
  const oldTags = lastTags
  const oldSetUse = tagAppElm.setUse // as any // placed on element by tagElement command
    
  // load via import() new code for browser to use
  console.log('updateByElement?')
  const tags = await discoverTags()

  // loop new tags looking for matching old
  for (const tag of tags) {
    const wrapper = (tag.newTemplater.wrapper as any)
    const original = wrapper?.original
    const isApp = original?.isApp || wrapper.isApp

    if(isApp) {
      console.log('hmr handling app here ------------', {original, wrapper, tag})
    }
  
    updateTagByElement(tag, oldSetUse, tagAppElm, oldTags)
  }
}

type ChangedTag = {
  oldTag: TaggedFunction<any>
  newTag?: TaggedFunction<any>
}

type MatchedTag = ChangedTag & {
  newTag: TaggedFunction<any>
}

async function updateTagByElement(
  tag: DiscoveredTag,
  oldSetUse: UseMemory,
  tagAppElm: TagAppElement,
  oldTags: TaggedFunction<any>[],
) {
  const { newApp, newTemplater } = tag    
  
  const hmr: HmrImport = newApp.hmr
  const wrapper = newTemplater.wrapper as Wrapper
  const newSetup = wrapper.original as any
  const newTags: TaggedFunction<any>[] = newSetup.tags
  const newSetUse = newSetup.setUse as typeof setUseMemory

  ;(window as any).hmr = true

  // Object.assign(newSetUse, oldSetUse) // update the new with the old
  newSetUse.stateConfig = oldSetUse.stateConfig // update the new with the old
  setUseMemory.stateConfig = oldSetUse.stateConfig
  Object.assign(newSetup.ValueTypes, tagAppElm.ValueTypes) // update the new with the old
  Object.assign(ValueTypes, tagAppElm.ValueTypes) // update this hmr
  const matched: MatchedTag[] = []

  console.log(`comparing ${oldTags.length} oldTags to ${newTags.length} newTags`)

  const isApp = (tag.newTemplater.wrapper?.original as any)?.isApp
  if(isApp) {
    console.log('about to loop oldTags')
  }

  const tagChangeStates = oldTags.reduce((all, oldTag, index) => {
    const isApp = (oldTag.original as any)?.isApp
    return oldTagMatch(oldTag, newTags, matched, index, all, isApp)
  }, [] as ChangedTag[])

  console.log(`Matched ${matched.length} old and new tags`, {newTags, oldTags, tagChangeStates, matched})

  if(!tagChangeStates.length) {
    console.warn('No old tags changed', {
      newTags, oldTags
    })
  }

  const matchedTagCounts = oldTags.length === newTags.length
  for (let index=0; index < newTags.length; ++index) {
    const newTag = newTags[index]
    compareNewTagToOlds(newTag, oldTags, tagChangeStates, index, matchedTagCounts)
  }

  await checkProcessChangedTags(tagChangeStates, newTags, matched, hmr)

  lastTags = newTags

  console.info('✅ ✅ ✅ rebuilt')
}

async function checkProcessChangedTags(
  tagChangeStates: ChangedTag[],
  newTags: TaggedFunction<any>[],
  matched: MatchedTag[],
  hmr: HmrImport,
) {
  let count = 0

  if(tagChangeStates.length) {
    console.log(`processing ${tagChangeStates.length} changed tags`)
    count = await processChangedTags(tagChangeStates, newTags, hmr, count)
  }

  if(count <= 0) {
    console.warn('✋ No components were updated', {
      firstChange: tagChangeStates[0],
      matched,
    })

    count = await processMatched(matched, count, hmr)
  } else {
    console.debug(`✅ Replaced and update components ${count}`, tagChangeStates[0])
  }
}

async function processChangedTags(
  tagChangeStates: ChangedTag[],
  newTags: TaggedFunction<any>[],
  hmr: HmrImport,
  count: number,
) {
  const {oldTag, newTag} = tagChangeStates[0]
      
  if(!oldTag.original) {
    console.log('missing here', {oldTag})
  }

  // Check to rebuild the MAIN APP
  const isAppChanged = hasAppRelatedTo(lastApp, oldTag.original)
  const isApp = (oldTag.original as any)?.isApp
  console.log('isAppChanged', {isAppChanged, lastApp, isApp})
  if(isAppChanged) {
    if(!newTag) {
      throw new Error('no new tag error?')
    }

    const lastWrapper = lastApp.templater.wrapper as Wrapper
    lastWrapper.original = newTag.original as Original
    lastApp.ownerSupport = {clones:[], childTags:[]} as any as Support
    // lastApp.rebuild().then(x => lastApp = x)
    lastTags = newTags
    throw new Error('app changed, need code for that')
  }

  if(newTag) {
    console.log('replaceTemplater 1')
    // rebuild tag that has an owner
    count = await replaceTemplater(
      lastApp,
      tagChangeStates[0],
      hmr,
      isApp,
    )

    oldTag.original = newTag.original
    ;(newTag as any).compareTo = newTag.original.toString()
  }

  return count
}

async function processMatched(
  matched: MatchedTag[],
  count: number,
  hmr: HmrImport,
) {
  const matchPromises = matched.map(async matched => {
    const newOriginal = matched.newTag.original
 
    const isApp = (matched.oldTag.original as any)?.isApp
    if(isApp) {
      console.log('app swap made', {matched, newTag:matched.newTag})
    }
    matched.oldTag.original = newOriginal

    console.log('replaceTemplater 3')
    count = count + await replaceTemplater(
      lastApp,
      matched,
      hmr,
      isApp,
    )
  })

  await Promise.all(matchPromises)

  console.debug(`✅ Replaced all matched components ${count}`, matched)
  return count
}

function oldTagMatch(
  oldTag: TaggedFunction<any>,
  newTags: TaggedFunction<any>[],
  matched: {oldTag: TaggedFunction<any>, newTag: TaggedFunction<any>}[],
  index: number,
  all: { oldTag: TaggedFunction<any>; newTag?: TaggedFunction<any>; }[],
  isApp: boolean,
) {
  const oldOriginal = oldTag.original || oldTag

  if(!oldOriginal) {
    console.warn('nothing here?', {oldTag, index})
    return all
  }

  const oldString = oldOriginal.toString()
  let newTag = newTags
    .find(newTag => {
      const newOriginal = newTag.original
      return newOriginal.toString() === oldString
    })

  if(isApp) {
    console.log('newTag app', {
      newTag,
      newOriginal: newTag?.original,
      newString: newTag?.original?.toString(),
      oldString,
    })
  }

  if(newTag) {
    matched.push({newTag, oldTag})
  }

  if(index > newTags.length) {
    return all
  }

  if(!newTag) {
    const tagIndex = index // oldTag.tagIndex
    if(tagIndex !== undefined) {
      newTag = newTags[tagIndex]
    }

    all.push({oldTag, newTag})
  }

  return all
}

function compareNewTagToOlds(
  newTag: TaggedFunction<any>,
  oldTags: TaggedFunction<any>[],
  tagChangeStates: {
    oldTag: TaggedFunction<any>
    newTag?: TaggedFunction<any>
  }[],
  index: number,
  matchedTagCounts: boolean,
) {
  let oldTag = oldTags.map(oldTag => oldTag.original)
    .find(oldTag => newTag.original.toString() === oldTag.toString())

  let tagIndex = null
  if(!oldTag && tagChangeStates[0].newTag as any) {
    tagIndex = index // newTag.tagIndex
    if( matchedTagCounts ) {
      oldTag = oldTags[ tagIndex ]
    }
  }
  
  if(!oldTag) {
    /*
    if(tagChangeStates[0].newTag as any) {
      const message = 'HMR has two tags'

      console.warn(message, {
        first: tagChangeStates[0].newTag.original,
        second: newTag.original,
        equal: newTag.original === tagChangeStates[0].newTag.original,
        oldTags,
        newTags,
        tagIndex,
      })
      throw new Error(message)
    }
    */
    tagChangeStates[0].newTag = newTag
  }
}

function rebuildApps() {
  forEachApp(element => {
    discoverTags().then(apps => {
      apps.forEach(({newApp, tagName}) => {
        console.log('🏷️ hmr app rebuilding...', { app: newApp, tagName })

        /** @type {{tagElement: tagElement}} */
        const { tagElement } = newApp.hmr
        if((element as any).destroy) {
          return
          console.debug('🗑️ destroying tag already on element', { element })
          const destroyRun = (element as any).destroy()
        }
        
        console.debug('🥚 rebuilding tag on element', { element })
        const result = tagElement(newApp[tagName as string], element, {test:1})
        
        lastTags = result.tags
        lastApp = result.support
        
        // tagElement.ValueTypes = result.ValueTypes
        tagElement.ValueTypes = ValueTypes
        ;(element as any).ValueTypes = ValueTypes
  
        return result
      })
    })
  })
}

/**
 * 
 * @param {Support} lastApp 
 * @param {any} oldTag 
 * @returns {boolean}
 */
function hasAppRelatedTo(
  lastApp: Support,
  oldTag: any,
) {
  const oldTemplater = lastApp.templater
  const wrapper = oldTemplater.wrapper as Wrapper

  const match0 = wrapper.original === oldTag
  if(match0) return match0

  const match1 = wrapper.original.toString() === oldTag.toString()
  return match1
}
