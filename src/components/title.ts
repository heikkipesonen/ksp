import * as PIXI from 'pixi.js'
import { baseTextStyle, textShadow } from './text-styles'

export class Title extends PIXI.Text {
  constructor(text: string, width: number, size = 64) {
    super(text.toUpperCase(), {
      ...baseTextStyle,
      fontSize: size,
      fill: 0xff8800,
      stroke: 0x000000,
      strokeThickness: 4,
    })

    textShadow(this)

    this.x = width / 2
    this.y = this.height
    this.transform.pivot.x = this.width / 2
    this.transform.pivot.y = this.height / 2
  }
}
