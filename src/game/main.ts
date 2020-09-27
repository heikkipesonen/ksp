import * as PIXI from 'pixi.js'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'

import { randomFromArray } from '../support'
import { Intervaller } from './interval'
import { createBall, generateLanes, markLine, renderPallero } from './support'
import { maybeKSP } from '../domain/ksp'

export const Game = (width: number, height: number) => <T extends PIXI.Container>(stage: T) => {
  const state = {
    onHold: false
  }
  const LANE_COLORS = [
    0xEE0000,
    0x00EE00,
    0x0000EE,
  ]

  const LANE_COUNT = LANE_COLORS.length
  const BALL_SIZE = (width / LANE_COUNT) / 6
  const lanes = generateLanes(LANE_COLORS)(width)

  const laneView = new PIXI.Container()
  laneView.filters = [
    new DropShadowFilter({
      distance: 10,
      blur: 30,
    })
  ]

  new Intervaller(1000)
    .addListener(() => {
      const lane = randomFromArray(lanes)
      const ball = createBall(BALL_SIZE, lane.color)

      ball.y = -BALL_SIZE
      ball.x = lane.position

      renderPallero(ball, height + BALL_SIZE * 2, 1.5)(laneView)
    })
    .start()


  stage.addChild(laneView)
  stage.addChild(markLine(width, height - height * 0.2))


  window.addEventListener('keydown', e => {
    if (state.onHold === false) {
      state.onHold = true
      const char = e.key.toUpperCase()
      console.log(maybeKSP(char))
    }

  })
  window.addEventListener('keyup', e => {
    state.onHold = false
  })

  return stage
}
