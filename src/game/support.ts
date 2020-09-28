import * as PIXI from 'pixi.js'
import { Ball } from '../components/ball'

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
  const bounds = element.getBounds()
  return bounds.top <= linePosition.y && bounds.bottom >= linePosition.bottom
}

export function isBall(x: unknown): x is Ball {
  return x instanceof Ball
}

export function toBalls(a: unknown[]): Ball[] {
  return a.filter(isBall)
}