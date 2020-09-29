import * as PIXI from 'pixi.js'

export interface Lane {
  key: string
  color: number
  position: number
}

export interface ProtoLane {
  key: string
  color: number
}

export const lanesFromProto = (proto: ProtoLane[]) => (width: number): Lane[] =>
  proto
    .map((lane, i) => ({
      ...lane,
      position: (width / proto.length * i) + (width / proto.length) / 2,
    }))

export const elementIntersectsWithLine = (line: PIXI.DisplayObject) => (element: PIXI.DisplayObject) => {
  const linePosition = line.getBounds()
  const elementBounds = element.getBounds()
  return elementBounds.top <= linePosition.y && elementBounds.bottom >= linePosition.bottom
}
