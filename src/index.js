import {
  always,
  apply,
  compose,
  curryN,
  gt,
  ifElse,
  inc,
  length,
  map,
  modulo,
  multiply,
  repeat,
  sum,
  zip
} from 'ramda'
import onReady from './helpers/onready'

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

class SplitArticle {
  constructor (config) {
    onReady(() => {
      const textSize = 1753 // height of the text, that we want to split up
      const containerSizes = [300, 50, 300, 75] // heights of every target container

      console.log(distributeText(textSize, containerSizes)) // [3, 3, 2, 2]

      window.addEventListener('resize', () => {
        console.log('Window resized, need to recalculate stuff')
      })
    })
  }
}

export default SplitArticle
