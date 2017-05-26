import {
  reduce,
  max,
  not,
  addIndex,
  filter,
  zip,
  converge
} from 'ramda'

const getArrayMaximum = reduce(max, -Infinity)

const isEven = a => a % 2 === 0

const makePairs = converge(
  zip,
  [
    addIndex(filter)((el, index) => isEven(index)),
    addIndex(filter)((el, index) => not(isEven(index)))
  ]
)

export {
  getArrayMaximum,
  isEven,
  makePairs
}
