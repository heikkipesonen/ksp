import * as PIXI from 'pixi.js'
import { DropShadowFilter } from "@pixi/filter-drop-shadow"

export const baseTextStyle = {
  fontFamily: "Impact",
  fontSize: 64,
  fontWeight: 100,
}

export const titleTextStyle = {
  ...baseTextStyle,
  fill: 0xff8800,
  stroke: 0x000000,
  strokeThickness: 4,
}

export const textShadow = <T extends PIXI.DisplayObject>(x: T):T => {
  x.filters = [
    ...(x.filters ? x.filters : []),
    new DropShadowFilter({
      distance: 2,
      blur: 5,
      alpha: 0.6,
    })
  ]

  return x
}