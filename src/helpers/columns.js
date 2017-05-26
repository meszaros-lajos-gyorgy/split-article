// Terminology:
//   target  - individual div from config.targets, which holds multiple columns and only columns
//   column  - a div inside a target, where we need to copy parts from config.source
//   targets - a list of target elements in an array: [target1, target2, ...] - config.targets
//   columns - an array containing an array of columns groupped together: [[column1, column2], [column3], [column4]]

import {
  map,
  curry,
  flatten,
  compose,
  length,
  dec,
  findIndex,
  when,
  equals,
  always,
  gt
} from 'ramda'

import {
  appendTo,
  children,
  setAttribute,
  createElement
} from './ramda-dom'

import {
  getArrayMaximum
} from './ramda-utils'

const getColumnsPerTarget = map(children)

const getColumns = compose(flatten, getColumnsPerTarget)

const createColumn = width => compose(
  setAttribute('style', 'display:inline-block;height:100%;vertical-align:top;width:' + width + 'px'),
  createElement
)('div')

const addColumnTo = curry((width, target) => appendTo(target, createColumn(width)))

const maxColumnPerTarget = compose(getArrayMaximum, map(compose(length, children)))

const getCurrentTargetIndex = targets => {
  const numberOfTargets = length(targets)
  const columns = getColumnsPerTarget(targets)
  const numberOfColumns = map(length, columns)
  const mostColumnAmount = getArrayMaximum(numberOfColumns)

  return (
    mostColumnAmount === 0
    ? -1
    : compose(
      dec,
      when(
        equals(-1),
        always(numberOfTargets)
      ),
      findIndex(gt(mostColumnAmount))
    )(numberOfColumns)
  )
}

const getNextTargetIndex = targets => {
  const currentIndex = getCurrentTargetIndex(targets)
  const nextIndex = currentIndex + 1
  const lastIndex = length(targets) - 1
  return currentIndex === -1 || currentIndex === lastIndex ? 0 : nextIndex
}

const getCurrentTarget = targets => {
  return targets[getCurrentTargetIndex(targets)]
}

const getNextTarget = targets => {
  return targets[getNextTargetIndex(targets)]
}

export {
  getColumnsPerTarget,
  getColumns,
  createColumn,
  addColumnTo,
  maxColumnPerTarget,
  getCurrentTargetIndex,
  getNextTargetIndex,
  getCurrentTarget,
  getNextTarget
}
