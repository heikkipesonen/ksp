import * as PIXI from 'pixi.js'
import { DropShadowFilter } from '@pixi/filter-drop-shadow'
import { isRight } from 'fp-ts/lib/Either'

import { randomFromArray } from '../support'
import { Intervaller } from './interval'
import { createBall, generateLanes, markLine, renderBall, Ball } from './support'
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
  const COLOR_KEYS: Record<number, string> = {
    0xEE0000: 'K',
    0x00EE00: 'S',
    0x0000EE: 'P',
  }

  const LANE_COUNT = LANE_COLORS.length
  const BALL_SIZE = (width / LANE_COUNT) / 6
  const lanes = generateLanes(LANE_COLORS)(width)

  const marker = markLine(width, height - height * 0.2)
  const laneView = new PIXI.Container()
  laneView.filters = [
    new DropShadowFilter({
      distance: 10,
      blur: 20,
    })
  ]

  new Intervaller(1500)
    .addListener(() => {
      const lane = randomFromArray(lanes)
      const ball = createBall(BALL_SIZE, lane)

      ball.y = -BALL_SIZE
      ball.x = lane.position

      renderBall(ball, height + BALL_SIZE * 2, 3)(laneView)
    })
    .start()



  window.addEventListener('keydown', e => {
    if (state.onHold === false) {
      state.onHold = true
      const char = e.key.toUpperCase()
      const maybeKey = maybeKSP(char)
      if (isRight(maybeKey)) {
        const objects = elementIntersectsWithLine(marker, laneView.children)
        objects.forEach(x => {
          const color = x.lane.color
          const key = COLOR_KEYS[color]
          const isCorrect = key === maybeKey.right

          if (isCorrect) {
            x.destroy()
          }
        })
      }
    }

  })
  window.addEventListener('keyup', e => {
    state.onHold = false
  })

  stage.addChild(laneView)
  stage.addChild(marker)

  return stage
}

function isBall(x: unknown): x is Ball {
  return x instanceof Ball
}

const elementIntersectsWithLine = <T extends PIXI.DisplayObject>(line: PIXI.Graphics, objects: T[]): Ball[] => {
  const linePosition = line.getBounds()
  return objects
    .filter(x => {
      const bounds = x.getBounds()
      return bounds.top <= linePosition.y && bounds.bottom >= linePosition.bottom
    })
    .filter(isBall) as any as Ball[] // TODO: very unsafe
}