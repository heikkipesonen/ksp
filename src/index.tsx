import * as PIXI from 'pixi.js'
import TWEEN from '@tweenjs/tween.js'

import './styles/reset.scss'
import './styles/index.scss'

import { Game } from './game'
import { KSP } from './domain/ksp'

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

// TODO: not robust
document.getElementById('root')?.appendChild(app.view)

new Game(SpawnObjects, app.view.width, app.view.height)
  .addTo(app.stage)
  .start()
