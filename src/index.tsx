import * as PIXI from 'pixi.js'
import TWEEN from '@tweenjs/tween.js'

import './styles/reset.scss'
import { Game } from './game'
import { BallProto } from './domain/ksp'

const SpawnObjects: BallProto[] = [
  {
    color: 0x3492eb,
    key: 'K'
  },
  {
    color: 0x34ebba,
    key: 'S'
  },
  {
    color: 0xd634eb,
    key: 'P'
  },
]

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
