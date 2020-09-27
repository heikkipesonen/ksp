import TWEEN from '@tweenjs/tween.js'
import * as PIXI from 'pixi.js'

interface Lane {
  color: number
  position: number
}

export const generateLanes = (colors: number[]) => (width: number): Lane[] =>
  colors
    .map((color, i) => ({
      color,
      position: (width / colors.length * i) + (width / colors.length) / 2
    }))

export const renderPallero = (obj: PIXI.Graphics, to: number, speed: number) => <T extends PIXI.Container>(container: T) =>
  new TWEEN.Tween({
    x: obj.x,
    y: obj.y,
  })
    .onStart(() => container.addChild(obj))
    .to({
      y: to,
      x: obj.x,
    })
    .duration(to * speed)
    .easing(TWEEN.Easing.Linear.None)
    .onUpdate(position => {
      obj.x = position.x
      obj.y = position.y
    })
    .onComplete(() => container.removeChild(obj))
    .start(TWEEN.now())


export const markLine = (width: number, height: number) =>
  new PIXI.Graphics()
    .lineStyle(10, 0x777777, 0.5)
    .moveTo(0, height)
    .lineTo(width, height)

export const createBall = (size: number, color: number) => {
  const p = new PIXI.Graphics()
    .beginFill(color)
    .drawCircle(0, 0, size)
    .endFill()

  return p
}
