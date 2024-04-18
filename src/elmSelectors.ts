
export function elementCount(selector: string) {
  return document.querySelectorAll(selector).length
}

export function queryOneInnerHTML(
  query: string,
  pos = 0
) {
  return document.querySelectorAll(query)[pos].innerHTML
}

export function byId(id: string): HTMLElement {
  return document.getElementById(id) as HTMLElement
}

export function lastById(id: string): Element {
  const elms = document.querySelectorAll('#' + id)
  return elms[elms.length - 1]
}
