import * as PIXI from 'pixi.js'

export class Background extends PIXI.Graphics {
  constructor(width: number, height: number, spacing: number) {
    super()

    let cursor = 0
    this.lineStyle(2, 0xEEEEEE, 0.8)
    this.moveTo(0, 0)

    while (cursor <= width) {
      this.moveTo(cursor, 0)
      this.lineTo(cursor, height)

      cursor = cursor + spacing
    }

    cursor = 0
    while (cursor <= height) {
      this.moveTo(0, cursor)
      this.lineTo(width, cursor)

      cursor = cursor + spacing
    }


    this.filters = [
      new PIXI.filters.NoiseFilter(0.55)
    ]
  }
}