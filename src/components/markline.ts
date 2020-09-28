import * as PIXI from 'pixi.js'

export class MarkLine extends PIXI.Graphics {
  constructor(width: number, height: number) {
    super()
    this
      .lineStyle(10, 0xFF7777, 0.5)
      .moveTo(0, height)
      .lineTo(width, height)
  }
}