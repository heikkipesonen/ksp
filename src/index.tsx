import * as PIXI from 'pixi.js'
import TWEEN from '@tweenjs/tween.js'

import './styles/reset.scss'
import { Game } from './game'
import { KSP } from './domain/ksp'

export const COLOR_MAP: Record<KSP, number> = {
  K: 0x3492eb,
  S: 0x34ebba,
  P: 0xd634eb,
}

const SpawnObjects: KSP[] = ['K', 'S', 'P']

const app = new PIXI.Application({
  resizeTo: window,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xFFFFFF,
})

app.ticker.add(() => {
  TWEEN.update(TWEEN.now())
})

document.body.appendChild(app.view)
new Game(SpawnObjects, app.view.width, app.view.height)
  .addTo(app.stage)
  .start()
