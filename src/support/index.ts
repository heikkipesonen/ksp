import * as PIXI from 'pixi.js'

export const randomFromArray = <T extends unknown>(x: T[]): T => x[Math.floor(Math.random() * x.length)]

export const setPosition = <T extends PIXI.DisplayObject>(obj: T, x: number, y: number): T => {
  obj.position.x = x
  obj.position.y = y
  return obj
}

export const move = <T extends PIXI.DisplayObject>(obj: T, x: number, y: number): T => {
  obj.position.x += x
  obj.position.y += y
  return obj
}

export const elementIntersectsWithLine = (line: PIXI.DisplayObject) => (element: PIXI.DisplayObject) => {
  const linePosition = line.getBounds()
  const elementBounds = element.getBounds()

  const topIsAboveLine = elementBounds.top <= linePosition.top
  const bottomIsBelowLine = elementBounds.bottom >= linePosition.bottom
  return topIsAboveLine && bottomIsBelowLine
}

export const addChildrenTo = (elements: PIXI.DisplayObject[]) => <T extends PIXI.Container>(target: T): T => {
  elements.forEach(x => target.addChild(x))
  return target
}