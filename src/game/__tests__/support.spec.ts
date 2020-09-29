
import * as PIXI from 'pixi.js'
import { elementIntersectsWithLine } from "../support"

describe('Support', () => {
  describe('intersection', () => {

    const testIntersection = (expected: boolean) => (objectYPosition: number) => {
      const line = new PIXI.Graphics().moveTo(0, 0).lineTo(100, 0)
      const object = new PIXI.Graphics().beginFill(0x000).drawCircle(0, 0, 100).endFill()

      line.y = 100
      object.y = objectYPosition

      it(`y: ${objectYPosition} should equal ${expected}`, () => {
        expect(elementIntersectsWithLine(line)(object)).toEqual(expected)
      })
    }


    [0, 1, 2, 50, 100, 199, 200].forEach(testIntersection(true));
    [-100, -101, -1, 201, 400, 500].forEach(testIntersection(false));
  })

})
