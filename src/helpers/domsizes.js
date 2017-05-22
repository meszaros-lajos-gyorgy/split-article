import {
  compose,
  contains,
  curry,
  equals,
  head,
  last,
  not
} from 'ramda'

const getComputedProperty = curry((property, element) => window.getComputedStyle(element).getPropertyValue(property))

const getPaddingTop = compose(parseFloat, getComputedProperty('padding-top'))
const getPaddingBottom = compose(parseFloat, getComputedProperty('padding-bottom'))
const getBorderTop = compose(parseFloat, getComputedProperty('border-top-width'))
const getBorderBottom = compose(parseFloat, getComputedProperty('border-bottom-width'))
const getMarginTop = compose(parseFloat, getComputedProperty('margin-top'))
const getMarginBottom = compose(parseFloat, getComputedProperty('margin-bottom'))

// todo: can we move element out to the end?
const isOutpositioned = element => contains(getComputedProperty('position', element), ['absolute', 'fixed'])
const isFloating = element => not(equals('none', getComputedProperty('float', element)))

const getFullContentHeight = element => {
  let removeThisToo = 0

  if (isOutpositioned(element) || isFloating(element)) {
    removeThisToo += getMarginTop(head(element.children))
    removeThisToo += getMarginBottom(last(element.children))
  } else {
    if (getBorderTop(element)) {
      removeThisToo += getMarginTop(head(element.children))
    }
    if (getBorderBottom(element)) {
      removeThisToo += getMarginBottom(last(element.children))
    }
  }

  return element.scrollHeight - getPaddingTop(element) - getPaddingBottom(element) - removeThisToo
}

const getVisibleContentHeight = element => {
  return element.clientHeight - getPaddingTop(element) - getPaddingBottom(element)
}

const getSpace = element => {
  const space = document.createElement('span')
  space.style = 'display:inline-block'
  element.appendChild(space)
  
  space.textContent = 'W'
  
  const sizeOfWrapper = space.getBoundingClientRect().width
  
  space.textContent = 'W W'
  
  const measure = {
    height: space.getBoundingClientRect().height,
    width: space.getBoundingClientRect().width - 2 * sizeOfWrapper
  }
  
  element.removeChild(space)
  
  return measure
}

export {
  getComputedProperty,
  isOutpositioned,
  isFloating,
  getFullContentHeight,
  getVisibleContentHeight,
  getPaddingTop,
  getPaddingBottom,
  getBorderTop,
  getBorderBottom,
  getMarginTop,
  getMarginBottom,
  getSpace
}
