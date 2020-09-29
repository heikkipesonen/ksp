import * as PIXI from 'pixi.js'

export const elementIntersectsWithLine = (line: PIXI.DisplayObject) => (element: PIXI.DisplayObject) => {
  const linePosition = line.getBounds()
  const elementBounds = element.getBounds()

  const topIsAboveLine = elementBounds.top <= linePosition.top
  const bottomIsBelowLine = elementBounds.bottom >= linePosition.bottom
  return topIsAboveLine && bottomIsBelowLine
}
