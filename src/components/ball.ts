import TWEEN from '@tweenjs/tween.js'
import * as PIXI from 'pixi.js'

export class Ball extends PIXI.Graphics {
  constructor(
    size: number,
    color: number,
    public readonly laneId: string,

    // prevent multiple animations from running at the same time for same object
    private deleteAnimation: any = null,
    private animation: any = null,
  ) {
    super()
    this.beginFill(color)
      .drawCircle(0, 0, size)
      .endFill()
  }

  public destroy = () => {
    if (this.deleteAnimation) {
      return
    }

    if (this.animation) {
      this.animation.stop()
    }

    this.deleteAnimation = new TWEEN.Tween({ scale: 1 })
      .to({ scale: 0 })
      .easing(TWEEN.Easing.Exponential.In)
      .duration(300)
      .onUpdate(position => {
        this.scale.x = position.scale
        this.scale.y = position.scale
      })
      .onComplete(() => this.parent && this.parent.removeChild(this))
      .start(TWEEN.now())
  }

  public animateTo = (to: number, speed: number) => {
    if (this.animation) {
      return
    }
    this.animation = new TWEEN.Tween({
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
      .onComplete(() => this.parent && this.parent.removeChild(this))
  }
}

export function isBall(x: unknown): x is Ball {
  return x instanceof Ball
}

export function toBalls(a: unknown[]): Ball[] {
  return a.filter(isBall)
}