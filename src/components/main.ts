import * as PIXI from 'pixi.js'

export const app = new PIXI.Application({
  resizeTo: window,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xFFFFFF,
})

export const stage = app.stage