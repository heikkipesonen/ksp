import * as PIXI from 'pixi.js'
import { KSP } from '../domain/ksp'
import { baseTextStyle } from './text-styles'

export class IndicatorBall extends PIXI.Graphics {
  constructor(
    size: number,
    color: number,
    public readonly key: KSP,
  ) {
    super()
    this.lineStyle(8, color)
    this.beginFill(0xFFFFFF)
    this.drawRect(-size, -size, size*2, size*2)
    this.endFill()

    const text = new PIXI.Text(key, {
      ...baseTextStyle,
      fill: color,
    })

    text.x = -text.width / 2
    text.y = -text.height / 2
    this.addChild(text)
  }
}

export function isIndicatorBall(x: unknown): x is IndicatorBall {
  return x instanceof IndicatorBall
}

export function findIndicatorBalls(xs: unknown[]): IndicatorBall[] {
  return xs.filter(isIndicatorBall)
}