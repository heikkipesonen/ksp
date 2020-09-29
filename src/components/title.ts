import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import * as PIXI from 'pixi.js'

export class Title extends PIXI.Text {
  constructor (text: string, width: number) {
    super(text.toUpperCase(), {
      fontFamily: "Impact",
      fontSize: 64,
      fontWeight: 100,
      fill: 0xDD0000,
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
