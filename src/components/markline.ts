import * as PIXI from 'pixi.js'

export class MarkLine extends PIXI.Graphics {
  constructor(width: number, height: number) {
    super()
    this
      .lineStyle(10, 0xfc2663)
      .moveTo(0, 0)
      .lineTo(width, 0)

    this.y = height
  }
}