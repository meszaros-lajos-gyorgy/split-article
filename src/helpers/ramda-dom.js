import {
  contains,
  curry
} from 'ramda'

const cloneNode = node => node.cloneNode(true)
const shallowCloneNode = node => node.cloneNode()

const appendTo = curry((container, node) => {
  container.appendChild(node)
  return node
})

const removeFrom = curry((container, node) => {
  container.removeChild(node)
  return node
})

const setInnerHTML = curry((content, node) => {
  node.innerHTML = content
  return node
})

const getInnerHTML = node => node.innerHTML
const getOuterHTML = node => node.outerHTML

const setTextContent = curry((content, node) => {
  node.textContent = content
  return node
})

const setAttribute = curry((key, value, node) => {
  node[key] = value
  return node
})

const updateMargin = curry((type, value, node) => {
  if (contains(type, ['top', 'bottom', 'left', 'right'])) {
    node.style['margin' + type[0].toUpperCase() + type.slice(1)] = value
  }
  return node
})

const children = node => Array.from(node.children)

const createElement = document.createElement.bind(document)

export {
  cloneNode,
  shallowCloneNode,
  appendTo,
  removeFrom,
  setInnerHTML,
  getInnerHTML,
  getOuterHTML,
  setTextContent,
  setAttribute,
  updateMargin,
  children,
  createElement
}
