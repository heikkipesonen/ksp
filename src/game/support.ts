import TWEEN, { Tween } from '@tweenjs/tween.js'
import * as PIXI from 'pixi.js'
interface Lane {
  color: number
  position: number
}

export const generateLanes = (colors: number[]) => (width: number): Lane[] =>
  colors
    .map((color, i) => ({
      color,
      position: (width / colors.length * i) + (width / colors.length) / 2,
    }))

export const renderBall = (obj: Ball, to: number, speed: number) => <T extends PIXI.Container>(container: T) =>
  obj.animateTo(to, speed)
    .onStart(() => container.addChild(obj))
    .onComplete(() => container.removeChild(obj))
    .start(TWEEN.now())


export const markLine = (width: number, height: number) =>
  new PIXI.Graphics()
    .lineStyle(10, 0x777777, 0.5)
    .moveTo(0, height)
    .lineTo(width, height)

export const createBall = (size: number, lane: Lane) =>
  new Ball(size, lane)

export class Ball extends PIXI.Graphics {
  constructor(
    size: number,
    public readonly lane: Lane,
  ) {
    super()
    this.beginFill(lane.color)
      .drawCircle(0, 0, size)
      .endFill()
  }
  public animation: any = null

  public destroy = () => {
    this.parent.removeChild(this)
    if (this.animation){
      this.animation.stop()
    }
  }

  public animateTo = (to: number, speed: number) => {
    const animation = new TWEEN.Tween({
      x: this.x,
      y: this.y,
    })
      .to({
        y: to,
        x: this.x,
      })
      .duration(to * speed)
      .easing(TWEEN.Easing.Linear.None)
      .onUpdate(position => {
        this.x = position.x
        this.y = position.y
      })
      .start(TWEEN.now())

    return animation
  }
}