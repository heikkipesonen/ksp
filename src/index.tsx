import TWEEN from '@tweenjs/tween.js'

import './styles/reset.scss'
import { Game } from './game'
import * as PIXI from 'pixi.js'
import { ProtoLane } from './game/support'


const LANES: ProtoLane[] = [
  {
    color: 0xEE0000,
    key: 'K'
  },
  {
    color: 0x00EE00,
    key: 'S'
  },
  {
    color: 0x0000EE,
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
Game(LANES, app.view.width, app.view.height)(app.stage)
