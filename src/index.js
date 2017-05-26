/*
Issues/TODOS:
  - target min-height is not taken into account
*/

import {
  merge,
  slice,
  reduce,
  append,
  forEach,
  compose,
  map,
  adjust,
  last,
  length,
  max,
  sum,
  apply,
  flatten,
  add,
  clone
} from 'ramda'

import {
  getVisibleContentHeight,
  getMarginTop,
  getMarginBottom,
  checkMinimalFit,
  checkFullFit,
  getBoxHeight,
  getMeasurementWidth
} from './helpers/measurement'

import {
  getColumns,
  addColumnTo,
  getNextTarget
} from './helpers/columns'

import {
  cloneNode,
  appendTo,
  removeFrom,
  setInnerHTML,
  setAttribute,
  updateMargin,
  children
} from './helpers/ramda-dom'

import {
  sliceContentVertically
} from './helpers/slicing'

import {
  makePairs
} from './helpers/ramda-utils'

import onResize from './helpers/onresize'

const DEFAULT_CONFIG = {
  width: 50,
  speed: 200,
  offset: 0,
  limit: Infinity
}

const render = (columns, elements, measuredWidth) => {
  const elementsToRender = clone(elements)
  const duplicatedChildrenHolder = appendTo(elements[0].parentNode, document.createElement('div'))

  forEach(setInnerHTML(''), columns)

  let currentColumnIndex = 0
  let lastColumnIndex = length(columns) - 1

  while (true) {
    const currentChild = elementsToRender.shift()
    const clonedChild = appendTo(duplicatedChildrenHolder, cloneNode(currentChild))
    const currentColumn = columns[currentColumnIndex]

    const childrenInColumn = children(currentColumn)
    const lastChildInColumn = last(childrenInColumn)
    const lastChildMarginBottom = length(childrenInColumn) ? getMarginBottom(lastChildInColumn) : 0
    const margin = max(lastChildMarginBottom, getMarginTop(clonedChild))

    // todo: make this more readable by separating height count from margin count
    const remainingSpace = getVisibleContentHeight(currentColumn) - compose(
      sum,
      adjust(x => sum(map(
        apply(max),
        makePairs(slice(1, -1, flatten(x)))
      )), 1),
      reduce((total, {marginTop, height, marginBottom}) => compose(
        adjust(add(height), 0),
        adjust(append([marginTop, marginBottom]), 1)
      )(total), [0, []]),
      map(node => ({
        marginTop: getMarginTop(node),
        height: getBoxHeight(node),
        marginBottom: getMarginBottom(node)
      }))
    )(childrenInColumn)

    if (checkFullFit(clonedChild, remainingSpace, lastChildMarginBottom)) {
      // fits perfectly

      currentColumn.appendChild(clonedChild)
    } else if (checkMinimalFit(clonedChild, remainingSpace, lastChildMarginBottom)) {
      // needs slicing

      const [top, bottom] = sliceContentVertically(clonedChild, remainingSpace - margin)

      currentColumn.appendChild(top)
      currentColumnIndex++

      elementsToRender.unshift(bottom)
    } else {
      // doesn't fit at all

      updateMargin('bottom', 0, lastChildInColumn)
      updateMargin('top', 0, clonedChild)

      currentColumnIndex++
      elementsToRender.unshift(clonedChild)
    }

    if (elementsToRender.length === 0 || currentColumnIndex > lastColumnIndex) {
      break
    }
  }

  removeFrom(elements[0].parentNode, duplicatedChildrenHolder)

  return length(elementsToRender) > 0
}

function splitArticle (rawConfig) {
  const config = merge(DEFAULT_CONFIG, rawConfig)
  setAttribute('style', 'height:0;position:absolute;overflow:hidden', config.source)

  const measuredWidth = getMeasurementWidth(config.source, config.width)
  config.source.style.width = measuredWidth + 'px'

  const sourceChildren = slice(config.offset, config.limit, children(config.source))

  forEach(setInnerHTML(''), config.targets)

  do {
    addColumnTo(measuredWidth, getNextTarget(config.targets))
  } while (render(getColumns(config.targets), sourceChildren, measuredWidth))
}

splitArticle.watch = rawConfig => {
  const config = merge(DEFAULT_CONFIG, rawConfig)
  splitArticle(config)
  onResize(() => splitArticle(config), config.speed)
}

export default splitArticle
