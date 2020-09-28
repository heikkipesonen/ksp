import * as PIXI from 'pixi.js'

import { randomFromArray } from '../support'
import { Intervaller } from '../components/interval'
import { Ball } from '../components/ball'

import { elementIntersectsWithLine, lanesFromProto, toBalls, ProtoLane } from './support'
import { LaneView } from '../components/laneview'
import { MarkLine } from '../components/markline'

export const Game = (protoLanes: ProtoLane[], width: number, height: number) => <T extends PIXI.Container>(stage: T) => {
  const state = {
    onHold: false, // prevent holding key down and flooding app...
    nextInterval: 1500, // next ball spawn
    speed: 3, // game speed, updated on next ball spawn
  }

  const lanes = lanesFromProto(protoLanes)(width)
  const targetMarkerLine = new MarkLine(width, height - height * 0.2)
  const laneView = new LaneView()

  const i = new Intervaller(state.nextInterval)
  i.addListener(() => {
      const ballSize = (width / lanes.length) / 6
      const lane = randomFromArray(lanes)
      const ball = new Ball(ballSize, lane.color, lane.key)

      ball.y = -ballSize
      ball.x = lane.position

      ball.animateTo(height + ballSize * 2, state.speed)
      laneView.addChild(ball)

      i.interval = state.nextInterval
    })
    .start()

  window.addEventListener('keydown', e => {
    if (state.onHold === false) {
      state.onHold = true
      const maybeLane = lanes.find(x => x.key === e.key.toUpperCase())

      if (maybeLane) {
        toBalls(laneView.children)
          .filter(x => x.laneId === maybeLane.key)
          .filter(elementIntersectsWithLine(targetMarkerLine))
          .forEach(x => x.destroy())
      }
    }
  })

  // prevent holding key down
  window.addEventListener('keyup', e => {
    state.onHold = false
  })

  stage.addChild(laneView)
  stage.addChild(targetMarkerLine)

  return stage
}
