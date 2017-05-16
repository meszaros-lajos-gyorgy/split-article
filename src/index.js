import onReady from './helpers/onready'
import {
  // always,
  // apply,
  clone,
  compose,
  // curryN,
  // gt,
  // ifElse,
  // inc,
  join,
  // length,
  // map,
  merge,
  // modulo,
  // multiply,
  // prop,
  repeat
  // sum,
  // zip
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

      this.resizeSource()

      const elements = this.children[0].innerHTML.match(/(?:<[^>]+>|\S+)/g)
      const tags = []
      const words = []

      elements.forEach(element => {
        if (element.match(/^<\//) !== null) {
          tags.pop()
        } else if (element.match(/^</) !== null) {
          tags.push(element)
        } else {
          words.push([
            clone(tags),
            element,
            clone(tags.reverse().map(tag => '</' + tag.replace(/^<(\w+).+$/, '$1') + '>'))
          ])
        }
      })

      // console.log(words);

      // console.log(map(prop('scrollHeight'))(this.children))

      /*
      window.addEventListener('resize', () => {

      })
      */
    })
  }

  resizeSource () {
    this.measuredWidth = getMeasuredWidth(this.config.source, this.config.width)
    this.config.source.style.width = this.measuredWidth + 'px'
  }
}

export default SplitArticle
