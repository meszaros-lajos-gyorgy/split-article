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
  min,
  sum,
  apply,
  flatten,
  add,
  clone,
  filter,
  tail,
  lt,
  gt,
  reject,
  ifElse,
  assoc,
  assocPath,
  __
} from 'ramda'

import {
  getVisibleContentHeight,
  getMarginTop,
  getMarginBottom,
  checkMinimalFit,
  checkFullFit,
  getBoxHeight,
  getMeasurementWidth,
  getMeasurementHeight,
  getFullContentHeight
} from './helpers/measurement'

import {
  getColumns,
  getColumnsPerTarget,
  addColumnTo,
  getNextTarget
} from './helpers/columns'

import {
  cloneNode,
  appendTo,
  removeFrom,
  setInnerHTML,
  setStyle,
  updateMargin,
  children
} from './helpers/ramda-dom'

import {
  sliceContentVertically
} from './helpers/slicing'

import {
  makePairs,
  getArrayMinimum,
  getArrayMaximum
} from './helpers/ramda-utils'

import onResize from './helpers/onresize'

const DEFAULT_CONFIG = {
  width: 50,
  speed: 200,
  offset: 0,
  limit: Infinity,
  gap: '30px',
  maxColumnsGetter: () => Infinity,
  minColumnsGetter: () => 0
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

      if (length(childrenInColumn)) {
        updateMargin('bottom', 0, lastChildInColumn)
      }
      updateMargin('top', 0, clonedChild)

      currentColumnIndex++
      elementsToRender.unshift(clonedChild)
    }

    if (elementsToRender.length === 0 || currentColumnIndex > lastColumnIndex) {
      break
    }
  }

  removeFrom(elements[0].parentNode, duplicatedChildrenHolder)

  return gt(length(elementsToRender), 0)
}

function splitArticle (rawConfig) {
  const config = merge(DEFAULT_CONFIG, rawConfig)
  setStyle('height:0;position:absolute;overflow:hidden', config.source)

  const measuredWidth = getMeasurementWidth(config.source, config.width)
  const measuredHeight = getMeasurementHeight(config.source, config.width)
  config.source.style.width = measuredWidth + 'px'

  config.targets = compose(
    reject(target => target.tooLittle === true),
    map(ifElse(
      compose(gt(measuredHeight, __), getFullContentHeight),
      compose(
        assoc('tooLittle', true),
        assocPath(['style', 'display'], 'none')
      ),
      setInnerHTML('')
    ))
  )(config.targets)

  if (length(config.targets)) {
    const sourceChildren = slice(config.offset, config.limit, children(config.source))

    const gotMoreContent = () => render(getColumns(config.targets), sourceChildren, measuredWidth)

    const minColumnTargets = filter(compose(gt(__, 0), config.minColumnsGetter), config.targets)

    if (length(minColumnTargets)) {
      // [A] - work only with targets, that have mincolumn restriction

      let targets = clone(minColumnTargets)

      do {
        targets = reject(target => length(children(target)) >= config.minColumnsGetter(target), targets)
        if (length(targets)) {
          addColumnTo(measuredWidth, getNextTarget(targets))
        }
      } while (length(targets) && gotMoreContent())
      // bug: gotMoreContents() doesn't work, when there are no columns, so the loop cannot be switched to a normal while loop
    }

    if (length(minColumnTargets) && gotMoreContent()) {
      // [B.1] - work with targets, that have no mincolumn restriction until they reach min(mincolumn targets)

      let targets = filter(target => config.minColumnsGetter(target) === 0, config.targets)
      const smallestMinColumn = compose(
        getArrayMinimum,
        map(config.minColumnsGetter)
      )(minColumnTargets)

      do {
        targets = reject(target => length(children(target)) >= min(smallestMinColumn, config.maxColumnsGetter(target)), targets)
        if (length(targets)) {
          addColumnTo(measuredWidth, getNextTarget(targets))
        }
      } while (length(targets) && gotMoreContent())
    }

    if (length(minColumnTargets) > 1 && gotMoreContent()) {
      const columnsOfMinColumnTargets = map(config.minColumnsGetter)(minColumnTargets)
      const smallestMinColumn = getArrayMinimum(columnsOfMinColumnTargets)
      const largestMinColumn = getArrayMaximum(columnsOfMinColumnTargets)

      if (largestMinColumn - smallestMinColumn > 0) {
        // [B.2] - add more and more targets with mincolumn restriction, which are less, than max(mincolumn targets)

        for (let threshold = smallestMinColumn; threshold <= largestMinColumn; threshold++) {
          let targets = filter(target => length(children(target)) < min(threshold + 1, config.maxColumnsGetter(target)), config.targets)

          do {
            targets = reject(target => length(children(target)) >= threshold, targets)
            if (length(targets)) {
              addColumnTo(measuredWidth, getNextTarget(targets))
            }
          } while (length(targets) && gotMoreContent())
        }
      }
    }

    if (!length(minColumnTargets) || gotMoreContent()) {
      // [C] - continue as normal

      let targets = config.targets

      do {
        targets = reject(target => length(children(target)) >= config.maxColumnsGetter(target), targets)
        addColumnTo(measuredWidth, getNextTarget(targets))
      } while (gotMoreContent())
    }

    // add margin-left to every column in target, except the first
    compose(
      map(updateMargin('left', config.gap)),
      flatten,
      map(tail),
      filter(compose(lt(1), length)),
      getColumnsPerTarget
    )(config.targets)
  }
}

splitArticle.watch = rawConfig => {
  const config = merge(DEFAULT_CONFIG, rawConfig)
  splitArticle(config)
  onResize(() => splitArticle(config), config.speed)
}

export default splitArticle
