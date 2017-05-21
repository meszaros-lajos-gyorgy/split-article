import {
  clone,
  replace,
  reverse,
  curry,
  map,
  add,
  sum,
  multiply,
  inc,
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
  assoc
} from 'ramda'

import {
  getContentHeight,
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
    addIndex(map)((node, index) => [index, node.scrollWidth], Array.from(child.children)),
    getSpace(child)
  )
})

const calculateWidth = (line, spaceWidth) => add(sum(pluck(1, line)), multiply(spaceWidth, inc(length(line))))

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
  const bottomHalf = topHalf.cloneNode(true)
  const container = child.parentNode
  const containerWidth = child.scrollWidth

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

const hide = element => {
  element.style = 'height:0;position:absolute;overflow:hidden'
}

const generateMeasurementText = compose(join(''), repeat('a'))

const getMeasurementWidth = (source, width) => {
  const measurement = document.createElement('div')
  measurement.textContent = generateMeasurementText(width)
  measurement.style = 'position:absolute;visibility:hidden'

  source.appendChild(measurement)
  const result = measurement.scrollWidth
  source.removeChild(measurement)

  return result
}

const createColumn = (width) => {
  const col = document.createElement('div')
  col.style = 'display:inline-block;height:100%;width:' + width + 'px'
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
    getContentHeight(element) +
    getPaddingBottom(element) +
    getBorderBottom(element)
}

function splitArticle (rawConfig) {
  const config = merge(DEFAULT_CONFIG, rawConfig)
  hide(config.source)

  const measuredWidth = getMeasurementWidth(config.source, config.width)
  config.source.style.width = measuredWidth + 'px'

  forEach(target => { target.innerHTML = '' }, config.targets)

  const children = Array.from(config.source.children)

  // --------------------

  // contents > targets > columns > children
  const contents = [[[]]]

  const slices = sliceContentVertically(config.source.children[0], 100)

  addColumn(config.targets[0], measuredWidth).appendChild(slices[0])
  addColumn(config.targets[1], measuredWidth).appendChild(slices[1])

  console.log(
    checkMinimalFit(
      children[0],
      getContentHeight(config.targets[0]),
      length(contents[0][0]) ? getMarginBottom(last(contents[0][0])) : 0
    ),
    checkFullFit(
      children[0],
      getContentHeight(config.targets[0]),
      length(contents[0][0]) ? getMarginBottom(last(contents[0][0])) : 0
    )
  )

  // --------------------

  let currentChildIndex = 0
  let currentContainerIndex = 0

  addColumn(config.targets[currentContainerIndex])

  const getSizes = map(child => [
    getMarginTop(child),
    getBorderTop(child) + getPaddingTop(child) + getContentHeight(child) + getPaddingBottom(child) + getBorderBottom(child),
    getMarginBottom(child)
  ])

  // todo: change this to reduce for children
  while (true) {
    // let currentChild = children[currentChildIndex]
    let currentContainer = config.targets[currentContainerIndex]
    let currentColumn = last(currentContainer)

    // const remainingSpaceInFirstContainer = () => firstContainer.scrollHeight - contentsForFirstContainer.map(content => content.scrollHeight).reduce((a, b) => a + b, 0)
    let remainingSpace = getContentHeight(currentColumn) -
      compose(
        // todo: adjust last(total[1])[1] to be 0
        reduce((total, [marginTop, height, marginBottom]) => {
          total[0] += height

          if (length(total[1])) {
            total[1].push([marginTop, marginBottom])
          } else {
            total[1].push([0, marginBottom])
          }

          return total
        }, [0, []]),
        getSizes
      )(currentColumn.children)

    console.log(remainingSpace)

    currentChildIndex++

    if (currentChildIndex > length(children) - 1) {
      break
    }
  }

  /*
  if(currentChild.scrollHeight < remainingSpace){
    console.log('fits into first container')
    contentsForFirstContainer.push(currentChild)
  }else{
    console.error('doesn\'t fit, need to slice')
    verticalSlice(currentChild, remainingSpace)

    break
  }
  */

  // --------------------
}

splitArticle.watch = rawConfig => {
  splitArticle(rawConfig)
  onResize(() => splitArticle(rawConfig))
}

export default splitArticle
