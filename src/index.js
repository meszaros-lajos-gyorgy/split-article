import onReady from './helpers/onready'
import {
  add,
  adjust,
  append,
  clone,
  compose,
  converge,
  dec,
  either,
  identity,
  inc,
  isEmpty,
  join,
  last,
  length,
  map,
  merge,
  multiply,
  reduce,
  repeat,
  replace,
  reverse,
  sum,
  when
} from 'ramda'

/*
const sumCounts = curryN(2, compose(sum, map(apply(multiply)), zip))
const generateCounts = compose(repeat(0), length)

const distributeText = (textSize, containerSizes, counts = generateCounts(containerSizes), index = 0) => {
  counts[index]++

  return ifElse(
    compose(gt(textSize), () => sumCounts(containerSizes, counts)),
    () => distributeText(textSize, containerSizes, counts, modulo(inc(index), length(containerSizes))),
    always(counts)
  )()
}
*/

const generateMeasureText = compose(join(''), repeat('a'))

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

const splitToWords = child => {
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
}

const renderWord = ([openingTags, content, closingTags]) => join('', openingTags) + content + join('', closingTags)

const getWordWidths = (child, paragraph) => {
  child.innerHTML = join(' ', map(renderWord, paragraph)) + '<span class="space">&nbsp;</span>'
  
  const space = child.querySelector('.space')
  const spaceWidth = space.scrollWidth
  
  space.parentNode.removeChild(space)
  
  return {
    spaceWidth: spaceWidth,
    wordWidths: map(node => node.scrollWidth, Array.from(child.children))
  }
}

const calculateWidth = (line, spaceWidth) => add(sum(line), multiply(spaceWidth, inc(length(line))))

class SplitArticle {
  constructor (rawConfig) {
    this.config = merge({ width: 50 }, rawConfig)

    onReady(() => {
      /*
      const textSize = 1753 // height of the text, that we want to split up
      const containerSizes = [300, 50, 300, 75] // heights of every target container

      console.log(distributeText(textSize, containerSizes)) // [3, 3, 2, 2]
      */
      
      this.children = Array.from(this.config.source.children)
      this.config.source.style = 'height:0;position:absolute;overflow:hidden'
      
      this.measuredWidth = getMeasuredWidth(this.config.source, this.config.width)
      this.config.source.style.width = this.measuredWidth + 'px'
      
      const paragraphs = map(splitToWords, this.children)
      
      // ------------
      
      const {spaceWidth, wordWidths} = getWordWidths(this.children[0], paragraphs[0])
      const containerWidth = this.measuredWidth
      
      const lines = reduce((lines, ww) => {
        lines = when(
          either(
            isEmpty,
            () => calculateWidth(last(lines), spaceWidth) + ww >= containerWidth
          ),
          append([])
        )(lines)
        
        return converge(
          adjust(append(ww)),
          [
            compose(dec, length),
            identity()
          ]
        )(lines)
      }, [], wordWidths)
      
      console.log(lines)
      
      // ------------
      
      // console.log(map(prop('scrollHeight'))(this.children))
      
      /*
      window.addEventListener('resize', () => {
        
      })
      */
    })
  }
}

export default SplitArticle
