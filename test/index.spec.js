/* global describe, it */

import assert from 'assert'

describe('test', () => {
  it('is a test function', () => {
    assert.ok(true)
  })
})

/*
left = [
  [ '<span>', '<span style="color: #187a95">', '<span>' ],
  'Lorem',
  [ '</span>', '</span>', '</span>' ]
]

right = [
  [ '<span>', '<span style="color: #187a95">', '<span>', '<em>' ],
  'ipsum',
  [ '</em>', '</span>', '</span>', '</span>' ]
]

commonItemsLeft(left, right)

output = [[
  [ '<span>', '<span style="color: #187a95">', '<span>' ],
  'Lorem',
  [  ]
], [
  [ '<em>' ],
  'ipsum',
  [ '</em>', '</span>', '</span>', '</span>' ]
]]

------

case 1:
  left = [A, B, C, D]
  right = [A, B, C, D]
  commonItemsLeft = 4, diff = []; A B C left | right /C /B /A

case 2:
  left = [A, B, C]
  right = [A, B, C, D]
  commonItemsLeft = 3, diff = +[D]; A B C left | D right /D /C /B/ A

case 3:
  left = [A, B, C, D]
  right = [A, B, C]
  commonItemsLeft = 3, diff = -[D]; A B C D left /D | right /C /B /A

case 4:
  left = [A, B, C]
  right = [D, A, B, C]
  commonItemsLeft = 0, diff = +[D, A, B, C]; A B C left /C /B /A | D A B C right /C /B /A /D

case 5:
  left = [A, B, C]
  right = [A, B, D]
  commonItemsLeft = 2, diff = -[c] + [D]; A B C left /C | D right /D /B /A
*/
