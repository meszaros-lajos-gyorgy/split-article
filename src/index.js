/*
const getMeasuredWidth = (source, width) => {
  const measure = document.createElement('div')
  measure.textContent = generateMeasureText(width)
  measure.style = 'position:absolute;visibility:hidden'

  let result

  source.appendChild(measure)
  result = measure.scrollWidth
  source.removeChild(measure)

  return result
}

const splitToWords = curry(child => {
  const elements = child.innerHTML.match(/(?:<[^>]+>|[^\r\n\t <]+)/g)
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
  child.innerHTML = join(' ', map(renderWord, paragraph)) + '<span class="space">&nbsp;</span>'

  const space = child.querySelector('.space')
  const spaceWidth = space.scrollWidth

  space.parentNode.removeChild(space)

  return {
    spaceWidth: spaceWidth,
    wordWidths: map(node => node.scrollWidth, Array.from(child.children))
  }
})

const calculateWidth = (line, spaceWidth) => add(sum(line), multiply(spaceWidth, inc(length(line))))

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
      () => calculateWidth(last(lines), spaceWidth) + wordWidth >= containerWidth
    ),
    append([])
  )
)(lines)

const verticalSlice = (child, cuttingPoint) => {
  const result = []

  const clonedChild = child.cloneNode(true)

  child.parentNode.appendChild(clonedChild)
  const {spaceWidth, wordWidths} = converge(getWordWidths, [identity, splitToWords])(clonedChild)
  const containerWidth = child.scrollWidth

  const indexesPerLine = reduce(sortIntoLines(containerWidth, spaceWidth), [], wordWidths)

  // TODO: rejoin words into lines
  console.log(indexesPerLine, clonedChild, clonedChild.scrollHeight)

  // clonedChild.parentNode.removeChild(clonedChild)

  return result
}

// --------------

class SplitArticle {
  constructor (rawConfig) {
    const children = Array.from(config.source.children)

    const measuredWidth = getMeasuredWidth(config.source, config.width)
    config.source.style.width = measuredWidth + 'px'

    // ----------------------

    let i = 0

    const firstContainer = config.targets[0]
    const contentsForFirstContainer = []

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
        console.log(verticalSlice(currentChild, remainingSpace))

        break
      }

      i++
    }
  }
}
*/

import {
  // compose,
  // join,
  merge
  // repeat
} from 'ramda'

import {
  getContentHeight
} from './helpers/domsizes'

import throttle from './helpers/throttle'

const DEFAULT_CONFIG = {
  width: 50
}

const onResize = fn => {
  let previousPageHeight = document.body.scrollHeight

  window.addEventListener('resize', throttle(() => {
    if (document.body.scrollHeight !== previousPageHeight) {
      previousPageHeight = document.body.scrollHeight
      fn()
    }
  }, 200, {
    trailing: true,
    leading: false
  }))
}

const hide = element => {
  element.style = 'height:0;position:absolute;overflow:hidden'
}

// const generateMeasureText = compose(join(''), repeat('a'))

function splitArticle (rawConfig) {
  const config = merge(DEFAULT_CONFIG, rawConfig)
  hide(config.source)

  console.log(getContentHeight(config.source))
}

splitArticle.watch = rawConfig => {
  splitArticle(rawConfig)
  onResize(() => splitArticle(rawConfig))
}

export default splitArticle
