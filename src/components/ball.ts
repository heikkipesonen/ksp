import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import TWEEN from '@tweenjs/tween.js'
import * as PIXI from 'pixi.js'
import { KSP } from '../domain/ksp'
import { baseTextStyle } from './text-styles'

export class Ball extends PIXI.Graphics {
  constructor(
    size: number,
    color: number,
    public readonly key: KSP,

    // prevent multiple animations from running at the same time for same object
    private deleteAnimation: any = null,
    private animation: any = null,
  ) {
    super()
    this.beginFill(color)
    this.drawCircle(0, 0, size)
    this.endFill()

    const p = new PIXI.Text(key, {
      ...baseTextStyle,
      fill: 0xFFFFFF,
    })

    p.x = -p.width / 2
    p.y = -p.height / 2
    this.addChild(p)

    this.filters = [
      new DropShadowFilter({
        distance: 21,
        blur: 10,
        alpha: 0.2,
        color,
      })
    ]
  }

  public destroy = () => {
    if (!this.deleteAnimation) {

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

    return this
  }

  public animateTo = (to: number, speed: number) => {
    if (!this.animation) {
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

    return this
  }
}

export function isBall(x: unknown): x is Ball {
  return x instanceof Ball
}

export function toBalls(a: unknown[]): Ball[] {
  return a.filter(isBall)
}