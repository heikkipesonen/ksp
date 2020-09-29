import * as PIXI from 'pixi.js'

export class MarkLine extends PIXI.Graphics {
  constructor(width: number, height: number) {
    super()
    this
      .lineStyle(1, 0xfc2663, 0)
      .moveTo(0, 0)
      .lineTo(width, 0)

    this.y = height
  }
}