import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import * as PIXI from 'pixi.js'
import { baseTextStyle } from './text-styles'

export class Title extends PIXI.Text {
  constructor(text: string, width: number) {
    super(text.toUpperCase(), {
      ...baseTextStyle,
      fill: 0xff8800,
      stroke: 0x000000,
      strokeThickness: 4,
    })

    this.filters = [
      new DropShadowFilter({
        distance: 2,
        blur: 5,
        alpha: 0.6,
      })
    ]

    this.x = width / 2
    this.y = this.height
    this.transform.pivot.x = this.width / 2
    this.transform.pivot.y = this.height / 2
  }
}
