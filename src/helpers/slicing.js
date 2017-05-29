import {
  compose,
  ifElse,
  equals,
  nth,
  adjust,
  findIndex,
  length,
  repeat,
  __,
  curry,
  reduce,
  append,
  clone,
  map,
  replace,
  reverse,
  join,
  assoc,
  addIndex,
  add,
  sum,
  pluck,
  multiply,
  converge,
  dec,
  identity,
  when,
  either,
  isEmpty,
  zip,
  concat,
  slice,
  gt,
  last,
  dropLast,
  drop,
  of,
  head,
  tail
} from 'ramda'

import {
  getSpace
} from './measurement'

import {
  setInnerHTML,
  getInnerHTML,
  getOuterHTML,
  children,
  cloneNode,
  shallowCloneNode
} from './ramda-dom'

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

const renderWord = ([openingTags, content, closingTags]) => {
  if (length(openingTags) === 0) {
    openingTags.push('<span>')
    closingTags.push('</span>')
  }
  return join('', openingTags) + content + join('', closingTags)
}

const getWordWidths = curry((child, paragraph) => {
  // todo: rendering should go to a separate function
  child = setInnerHTML(join(' ', map(renderWord, paragraph)), child)

  return assoc(
    'wordWidths',
    addIndex(map)((node, index) => [index, node.getBoundingClientRect().width], children(child)),
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

const commonItemsLeft = (left, right, cachedMatches) => {
  const tagsOfRight = nth(0, right)
  const common = zip(concat(cachedMatches, nth(0, left)), tagsOfRight)

  return slice(0, getMatchAmount(common), tagsOfRight)
}

const sliceContentVertically = (child, cuttingPoint) => {
  const topHalf = cloneNode(child)
  const bottomHalf = shallowCloneNode(topHalf)
  const container = child.parentNode
  const containerWidth = child.getBoundingClientRect().width

  container.appendChild(topHalf)

  const {width, height, wordWidths} = converge(getWordWidths, [identity, compose(splitToWords, getInnerHTML)])(topHalf)
  const indexesPerLine = reduce(sortIntoLines(containerWidth, width), [], wordWidths)
  const childrenPerLine = map(line => map(index => children(topHalf)[index], pluck(0, line)), indexesPerLine)
  const slicedChildrenPerLine = map(compose(splitToWords, join(' '), map(getOuterHTML)), childrenPerLine)

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

  setInnerHTML(join(' ', slice(0, cutAfterLineNo, lines)), topHalf)
  setInnerHTML(join(' ', drop(cutAfterLineNo, lines)), bottomHalf)

  container.removeChild(topHalf)

  topHalf.style.marginBottom = 0
  topHalf.style.paddingBottom = 0
  topHalf.style.borderBottomWidth = 0

  bottomHalf.style.marginTop = 0
  bottomHalf.style.paddingTop = 0
  bottomHalf.style.borderTopWidth = 0

  return [topHalf, bottomHalf]
}

export {
  splitToWords,
  renderWord,
  getWordWidths,
  calculateWidth,
  sortIntoLines,
  sliceContentVertically
}
