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
  __
} from 'ramda'

/*
import {
  getContentHeight
} from './helpers/domsizes'
*/

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
  child.innerHTML = join(' ', map(renderWord, paragraph)) + '<span class="space">&nbsp;</span>'

  const space = child.querySelector('.space')
  const spaceWidth = space.scrollWidth
  // const spaceHeight = space.scrollHeight

  space.parentNode.removeChild(space)

  return {
    // spaceHeight: spaceHeight,
    spaceWidth: spaceWidth,
    wordWidths: addIndex(map)((node, index) => [index, node.scrollWidth], Array.from(child.children))
  }
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
  const container = child.parentNode
  const containerWidth = child.scrollWidth

  container.appendChild(topHalf)

  const {spaceWidth/*, spaceHeight */, wordWidths} = converge(getWordWidths, [identity, compose(splitToWords, getInnerHtml)])(topHalf)
  const indexesPerLine = reduce(sortIntoLines(containerWidth, spaceWidth), [], wordWidths)
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

  topHalf.innerHTML = join(' ', lines)

  // const cutAfterLineNo = 2

  const bottomHalf = topHalf.cloneNode(true)

  container.removeChild(topHalf)

  topHalf.style.marginBottom = 0
  bottomHalf.style.marginTop = 0

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

function splitArticle (rawConfig) {
  const config = merge(DEFAULT_CONFIG, rawConfig)
  hide(config.source)

  const measuredWidth = getMeasurementWidth(config.source, config.width)
  config.source.style.width = measuredWidth + 'px'

  forEach(target => { target.innerHTML = '' }, config.targets)

  // --------------------

  const slices = sliceContentVertically(config.source.children[0], 100)

  addColumn(config.targets[0], measuredWidth).appendChild(slices[0])
  addColumn(config.targets[1], measuredWidth).appendChild(slices[1])

  // --------------------

  /*
  const children = Array.from(config.source.children)
  const containerContents = []

  let i = 0

  const latestContainer = 0

  const remainingSpaceInFirstContainer = () => firstContainer.scrollHeight - contentsForFirstContainer.map(content => content.scrollHeight).reduce((a, b) => a + b, 0)

  while(true){
    let remainingSpace = remainingSpaceInFirstContainer()
    let currentChild = children[i]

    console.log('paragraph [' + i + '] size:', currentChild.scrollHeight, '| remaining space in 1st container:', remainingSpace)

    if(currentChild.scrollHeight < remainingSpace){
      console.log('fits into first container')
      contentsForFirstContainer.push(currentChild)
    }else{
      console.error('doesn\'t fit, need to slice')
      verticalSlice(currentChild, remainingSpace)

      break
    }

    i++
  }
  */

  // --------------------
}

splitArticle.watch = rawConfig => {
  splitArticle(rawConfig)
  onResize(() => splitArticle(rawConfig))
}

export default splitArticle
