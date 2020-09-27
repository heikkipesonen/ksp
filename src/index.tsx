import { app } from './components/main'
import TWEEN from '@tweenjs/tween.js'

import './styles/reset.scss'
import { Game } from './game/main'

app.ticker.add(() => {
  TWEEN.update(TWEEN.now())
})

document.body.appendChild(app.view)
Game(app.view.width, app.view.height)(app.stage)
