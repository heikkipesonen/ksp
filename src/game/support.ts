import * as PIXI from 'pixi.js'

export interface Lane {
  position: number
}

export interface ProtoObjects {
  key: string
  color: number
}

export const lanesFromProto = (count: number) => (width: number): Lane[] =>
  Array(count).fill(false)
    .map((_, i) => ({
      position: (width / count * i) + (width / count) / 2,
    }))

export const elementIntersectsWithLine = (line: PIXI.DisplayObject) => (element: PIXI.DisplayObject) => {
  const linePosition = line.getBounds()
  const elementBounds = element.getBounds()

  const topIsAboveLine = elementBounds.top <= linePosition.top
  const bottomIsBelowLine = elementBounds.bottom >= linePosition.bottom
  return topIsAboveLine && bottomIsBelowLine
}
