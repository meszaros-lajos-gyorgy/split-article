/*
Issues/TODOS:
  - incorrect column order: [1,4][2][3] instead of [1,2][3][4]
  - when a content is split vertically, the bottom part might need to be split again
*/

import {
  clone,
  replace,
  reverse,
  curry,
  map,
  add,
  sum,
  multiply,
  adjust,
  dec,
  length,
  when,
  either,
  isEmpty,
  last,
  append,
  converge,
  identity,
  reduce,
  addIndex,
  compose,
  join,
  repeat,
  merge,
  forEach,
  pluck,
  nth,
  zip,
  findIndex,
  equals,
  of,
  head,
  tail,
  drop,
  dropLast,
  gt,
  concat,
  slice,
  ifElse,
  __,
  assoc,
  flatten,
  filter,
  not,
  apply,
  max
} from 'ramda'

import {
  getFullContentHeight,
  getVisibleContentHeight,
  getPaddingTop,
  getPaddingBottom,
  getBorderTop,
  getBorderBottom,
  getMarginTop,
  getMarginBottom,
  getSpace
} from './helpers/domsizes'

import onResize from './helpers/onResize'

const DEFAULT_CONFIG = {
  width: 50
}

const splitToWords = curry(htmlString => {
  const elements = htmlString.match(/(?:<[^>]+>|[^\r\n\t <]+)/g)
  const tags = []

  return reduce((words, element) => {
    if (element.match(/^<\//) !== null) {
      tags.pop()
    } else if (element.match(/^</) !== null) {
      tags.push(element)
    } else {
      words = append([
        clone(tags),
        element,
        map(tag => '</' + replace(/^<(\w+).+$/, '$1', tag) + '>', reverse(tags))
      ], words)
    }

    return words
  }, [], elements)
})

const renderWord = ([openingTags, content, closingTags]) => join('', openingTags) + content + join('', closingTags)

const getWordWidths = curry((child, paragraph) => {
  // todo: rendering should go to a separate function
  child.innerHTML = join(' ', map(renderWord, paragraph))

  return assoc(
    'wordWidths',
    addIndex(map)((node, index) => [index, node.getBoundingClientRect().width], Array.from(child.children)),
    getSpace(child)
  )
})

const calculateWidth = (line, spaceWidth) => add(sum(pluck(1, line)), multiply(spaceWidth, length(line)))

const sortIntoLines = (containerWidth, spaceWidth) => (lines, wordWidth) => compose(
  converge(
    adjust(append(wordWidth)),
    [
      compose(dec, length),
      identity()
    ]
  ),
  when(
    either(
      isEmpty,
      () => calculateWidth(last(lines), spaceWidth) + nth(1, wordWidth) >= containerWidth
    ),
    append([])
  )
)(lines)

const getInnerHtml = element => element.innerHTML
const getOuterHtml = element => element.outerHTML

const getMatchAmount = compose(
  ifElse(
    compose(equals(-1), nth(0)),
    nth(1),
    nth(0)
  ),
  adjust(findIndex(([a, b]) => a !== b), 0),
  adjust(length, 1),
  repeat(__, 2)
)

const commonItemsLeft = (left, right, cachedMatches) => {
  const tagsOfRight = nth(0, right)
  const common = zip(concat(cachedMatches, nth(0, left)), tagsOfRight)

  return slice(0, getMatchAmount(common), tagsOfRight)
}

const sliceContentVertically = (child, cuttingPoint) => {
  const topHalf = child.cloneNode(true)
  const bottomHalf = topHalf.cloneNode()
  const container = child.parentNode
  const containerWidth = child.getBoundingClientRect().width

  container.appendChild(topHalf)

  const {width, height, wordWidths} = converge(getWordWidths, [identity, compose(splitToWords, getInnerHtml)])(topHalf)
  const indexesPerLine = reduce(sortIntoLines(containerWidth, width), [], wordWidths)
  const childrenPerLine = map(line => map(index => topHalf.children[index], pluck(0, line)), indexesPerLine)
  const slicedChildrenPerLine = map(compose(splitToWords, join(' '), map(getOuterHtml)), childrenPerLine)

  const mergedChildrenPerLine = map(
    when(
      line => gt(length(line), 1),
      line => {
        let cachedMatches = []

        return reduce((merged, current) => {
          cachedMatches = commonItemsLeft(last(merged), current, cachedMatches)

          const commonAmount = length(cachedMatches)

          merged = adjust(adjust(dropLast(commonAmount), 2), -1, merged)
          current = adjust(drop(commonAmount), 0, current)

          return append(current, merged)
        }, of(head(line)), tail(line))
      }
    ),
    slicedChildrenPerLine
  )

  const lines = reduce((lines, line) => {
    line = reduce((children, [openingTags, word, closingTags]) => append(
      join('', openingTags) + word + join('', closingTags),
      children
    ), [], line)

    return append(join(' ', line), lines)
  }, [], mergedChildrenPerLine)

  const cutAfterLineNo = Math.floor(cuttingPoint / height)

  topHalf.innerHTML = join(' ', slice(0, cutAfterLineNo, lines))
  bottomHalf.innerHTML = join(' ', drop(cutAfterLineNo, lines))

  container.removeChild(topHalf)

  topHalf.style.marginBottom = 0
  topHalf.style.paddingBottom = 0
  topHalf.style.borderBottomWidth = 0
  bottomHalf.style.marginTop = 0
  bottomHalf.style.paddingTop = 0
  bottomHalf.style.borderTopWidth = 0

  return [topHalf, bottomHalf]
}

const generateMeasurementText = compose(join(''), repeat('a'))

const getMeasurementWidth = (source, width) => {
  const measurement = document.createElement('div')
  measurement.textContent = generateMeasurementText(width)
  measurement.style = 'position:absolute;visibility:hidden'

  source.appendChild(measurement)
  const result = measurement.getBoundingClientRect().width
  source.removeChild(measurement)

  return result
}

const createColumn = (width) => {
  const col = document.createElement('div')
  col.style = 'display:inline-block;height:100%;vertical-align:top;width:' + width + 'px'
  return col
}

const addColumn = (container, width) => {
  const col = createColumn(width)
  container.appendChild(col)
  return col
}

const checkMinimalFit = (element, remainingSpaceWithoutMargin, lastMarginBottom) => {
  const margin = Math.max(getMarginTop(element), lastMarginBottom)
  const lineHeight = getSpace(element).height
  return remainingSpaceWithoutMargin >=
    margin +
    getBorderTop(element) +
    getPaddingTop(element) +
    lineHeight
}

const checkFullFit = (element, remainingSpaceWithoutMargin, lastMarginBottom) => {
  const margin = Math.max(getMarginTop(element), lastMarginBottom)
  return remainingSpaceWithoutMargin >=
    margin +
    getBorderTop(element) +
    getPaddingTop(element) +
    getFullContentHeight(element) +
    getPaddingBottom(element) +
    getBorderBottom(element)
}

const isEven = a => a % 2 === 0

const makePairs = converge(
  zip,
  [
    addIndex(filter)((el, index) => isEven(index)),
    addIndex(filter)((el, index) => not(isEven(index)))
  ]
)

const getArrayMaximum = reduce(max, -Infinity)

const clearTargets = forEach(target => { target.innerHTML = '' })

const currentTargetIndex = targets => {
  const columns = map(target => Array.from(target.children))(targets)
  const numberOfColumns = map(length, columns)
  const mostColumnAmount = getArrayMaximum(numberOfColumns)

  return (
    mostColumnAmount !== 0
    ? dec(findIndex(el => el < mostColumnAmount, numberOfColumns))
    : -1
  )
}

const currentTarget = targets => {
  const currentIndex = currentTargetIndex(targets)
  const columns = map(target => Array.from(target.children))(targets)

  return (
    currentIndex === -1
    ? undefined
    : last(columns[currentIndex])
  )
}

const nextTarget = (targets, measuredWidth) => {
  const currentIndex = currentTargetIndex(targets)
  const nextIndex = currentIndex + 1
  let target

  if (currentIndex === -1 || nextIndex === length(targets) - 1) {
    target = addColumn(targets[0], measuredWidth)
  } else {
    target = addColumn(targets[nextIndex], measuredWidth)
  }

  return target
}

const getSizes = map(child => ({
  marginTop: getMarginTop(child),
  height: getBorderTop(child) +
    getPaddingTop(child) +
    getFullContentHeight(child) +
    getPaddingBottom(child) +
    getBorderBottom(child),
  marginBottom: getMarginBottom(child)
}))

function splitArticle (rawConfig) {
  const config = merge(DEFAULT_CONFIG, rawConfig)
  config.source.style = 'height:0;position:absolute;overflow:hidden'

  const measuredWidth = getMeasurementWidth(config.source, config.width)
  config.source.style.width = measuredWidth + 'px'

  /**//**/
  // const children = Array.from(config.source.children)
  const children = slice(0, 15, Array.from(config.source.children))

  const clonedChildrenHolder = document.createElement('div')
  config.source.appendChild(clonedChildrenHolder)

  clearTargets(config.targets)
  nextTarget(config.targets, measuredWidth)

  addIndex(forEach)((currentChild, index) => {
    const currentContainer = currentTarget(config.targets)
    const childrenInColumn = Array.from(currentContainer.children)
    const lastChildInColumn = last(childrenInColumn)
    const lastChildMarginBottom = length(childrenInColumn) ? getMarginBottom(lastChildInColumn) : 0
    const clonedChild = currentChild.cloneNode(true)
    const margin = max(lastChildMarginBottom, getMarginTop(clonedChild))

    if (index === 0) {
      clonedChild.style.marginTop = 0
    }
    clonedChildrenHolder.appendChild(clonedChild)

    const remainingSpace = getVisibleContentHeight(currentContainer) - compose(
      sum,
      adjust(x => sum(map(
        apply(max),
        makePairs(slice(1, -1, flatten(x)))
      )), 1),
      reduce((total, {marginTop, height, marginBottom}) => compose(
        adjust(add(height), 0),
        adjust(append([marginTop, marginBottom]), 1)
      )(total), [0, []]),
      getSizes
    )(childrenInColumn)

    if (checkFullFit(currentChild, remainingSpace, lastChildMarginBottom)) {
      currentContainer.appendChild(clonedChild)
    } else if (checkMinimalFit(currentChild, remainingSpace, lastChildMarginBottom)) {
      const [top, bottom] = sliceContentVertically(clonedChild, remainingSpace - margin)

      currentContainer.appendChild(top)
      nextTarget(config.targets, measuredWidth).appendChild(bottom)
    } else {
      lastChildInColumn.style.marginBottom = 0

      nextTarget(config.targets, measuredWidth).appendChild(clonedChild)
      clonedChild.style.marginTop = 0
    }
  }, children)

  config.source.removeChild(clonedChildrenHolder)
}

splitArticle.watch = rawConfig => {
  splitArticle(rawConfig)
  onResize(() => splitArticle(rawConfig))
}

export default splitArticle
