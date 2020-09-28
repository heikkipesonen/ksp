import * as PIXI from 'pixi.js'

import { randomFromArray } from '../support'
import { Intervaller } from '../components/interval'
import { Ball } from '../components/ball'

import { elementIntersectsWithLine, lanesFromProto, toBalls, ProtoLane } from './support'
import { LaneView } from '../components/laneview'
import { MarkLine } from '../components/markline'

export class Game {
  constructor (
    protoLanes: ProtoLane[],
    width: number,
    height: number,
    private readonly lanes = lanesFromProto(protoLanes)(width),
    private readonly targetMarkerLine = new MarkLine(width, height - height * 0.2),
    private readonly laneView = new LaneView(),

    private readonly state = {
      onHold: false, // prevent holding key down and flooding app...
      nextInterval: 1500, // next ball spawn, or maybe next after that... who knows?
      // multiplier for the time that the ball takes to drop to the bottom of the screen
      // speed is screen height in pixels * speed = animation duration in milliseconds
      // affects on next spawning ball speed
      // lower is faster
      speed: 3,
    },
    private readonly intervaller = new Intervaller(state.nextInterval),
  ) {
    this.intervaller.addListener(() => {
      const ballSize = (width / lanes.length) / 6
      const lane = randomFromArray(lanes)
      const ball = new Ball(ballSize, lane.color, lane.key)

      ball.y = -ballSize
      ball.x = lane.position

      ball.animateTo(height + ballSize * 2, state.speed)
      laneView.addChild(ball)
      this.intervaller.setInterval(this.state.nextInterval)
    }).start()

    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (this.state.onHold === false) {
      this.state.onHold = true
      const maybeLane = this.lanes.find(x => x.key === e.key.toUpperCase())

      if (maybeLane) {
        toBalls(this.laneView.children)
          .filter(x => x.laneId === maybeLane.key)
          .filter(elementIntersectsWithLine(this.targetMarkerLine))
          .forEach(x => x.destroy())
      }
    }
  }

  private handleKeyUp = () =>
    this.state.onHold = false

  public addTo = (container: PIXI.Container) => {
    container.addChild(this.laneView)
    container.addChild(this.targetMarkerLine)
    return this
  }
}
