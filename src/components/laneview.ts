import * as PIXI from 'pixi.js'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'

export class LaneView extends PIXI.Container {
  constructor() {
    super()
    this.filters = [
      new DropShadowFilter({
        distance: 10,
        blur: 20,
      })
    ]
  }
}