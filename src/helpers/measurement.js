import {
  compose,
  curry,
  equals,
  head,
  last,
  not,
  join,
  repeat,
  length
} from 'ramda'

import {
  appendTo,
  removeFrom,
  children,
  setTextContent,
  setAttribute,
  createElement
} from './ramda-dom'

const getComputedProperty = curry((property, element) => window.getComputedStyle(element).getPropertyValue(property))

const getPaddingTop = compose(parseFloat, getComputedProperty('padding-top'))
const getPaddingBottom = compose(parseFloat, getComputedProperty('padding-bottom'))
const getBorderTop = compose(parseFloat, getComputedProperty('border-top-width'))
const getBorderBottom = compose(parseFloat, getComputedProperty('border-bottom-width'))
const getMarginTop = compose(parseFloat, getComputedProperty('margin-top'))
const getMarginBottom = compose(parseFloat, getComputedProperty('margin-bottom'))

const isPositionedAbsolute = element => getComputedProperty('position', element) === 'absolute'
const isPositionedFixed = element => getComputedProperty('position', element) === 'fixed'
const isFloating = element => not(equals('none', getComputedProperty('float', element)))

const getFullContentHeight = element => {
  let removeThisToo = 0

  if (isPositionedAbsolute(element) || isPositionedFixed(element) || isFloating(element)) {
    if (length(children(element)) > 0) {
      removeThisToo += getMarginTop(head(children(element)))
      removeThisToo += getMarginBottom(last(children(element)))
    }
  } else {
    if (getBorderTop(element) && length(children(element)) > 0) {
      removeThisToo += getMarginTop(head(children(element)))
    }
    if (getBorderBottom(element) && length(children(element)) > 0) {
      removeThisToo += getMarginBottom(last(children(element)))
    }
  }

  return element.scrollHeight - getPaddingTop(element) - getPaddingBottom(element) - removeThisToo
}

const getVisibleContentHeight = element => {
  return element.clientHeight - getPaddingTop(element) - getPaddingBottom(element)
}

const getBoxHeight = node =>
  getBorderTop(node) +
  getPaddingTop(node) +
  getFullContentHeight(node) +
  getPaddingBottom(node) +
  getBorderBottom(node)

const getSpace = element => {
  const space = compose(
    setTextContent('W'),
    appendTo(element),
    setAttribute('style', 'display:inline-block'),
    createElement
  )('span')

  const sizeOfWrapper = space.getBoundingClientRect().width

  setTextContent('W W', space)

  const measure = {
    height: space.getBoundingClientRect().height,
    width: space.getBoundingClientRect().width - 2 * sizeOfWrapper
  }

  removeFrom(element, space)

  return measure
}

const checkMinimalFit = (element, remainingSpaceWithoutMargin, lastMarginBottom) => {
  const margin = Math.max(getMarginTop(element), lastMarginBottom)
  const lineHeight = getSpace(element).height
  return remainingSpaceWithoutMargin >= margin + getBorderTop(element) + getPaddingTop(element) + lineHeight
}

const checkFullFit = (element, remainingSpaceWithoutMargin, lastMarginBottom) => {
  const margin = Math.max(getMarginTop(element), lastMarginBottom)
  return remainingSpaceWithoutMargin >= margin + getBoxHeight(element)
}

const generateMeasurementText = compose(join(''), repeat('a'))

const getMeasurement = (source, width, prop) => {
  const measurement = compose(
    appendTo(source),
    setAttribute('style', 'position:absolute;visibility:hidden'),
    setTextContent(generateMeasurementText(width)),
    createElement
  )('div')

  const result = measurement.getBoundingClientRect()[prop]

  removeFrom(source, measurement)

  return result
}
const getMeasurementWidth = (source, width) => getMeasurement(source, width, 'width')
const getMeasurementHeight = (source, width) => getMeasurement(source, width, 'height')

export {
  getComputedProperty,
  isPositionedAbsolute,
  isPositionedFixed,
  isFloating,
  getFullContentHeight,
  getVisibleContentHeight,
  getBoxHeight,
  getPaddingTop,
  getPaddingBottom,
  getBorderTop,
  getBorderBottom,
  getMarginTop,
  getMarginBottom,
  getSpace,
  checkMinimalFit,
  checkFullFit,
  generateMeasurementText,
  getMeasurementWidth,
  getMeasurementHeight
}
