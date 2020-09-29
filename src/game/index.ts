import * as PIXI from 'pixi.js'

import { randomFromArray } from '../support'
import { Intervaller } from '../components/interval'
import { Ball, toBalls } from '../components/ball'

import { elementIntersectsWithLine, lanesFromProto, ProtoObjects } from './support'
import { LaneView } from '../components/laneview'
import { MarkLine } from '../components/markline'

export class Game {
  constructor (
    private protoObjects: ProtoObjects[],
    private width: number,
    private height: number,
    private readonly lanes = lanesFromProto(protoObjects.length)(width),
    private readonly targetMarkerLine = new MarkLine(width, height - height * 0.2),
    private readonly laneView = new LaneView(),

    private readonly intervalTolerance = 500,
    private readonly state = {
      onHold: false, // prevent holding key down and flooding app...
      nextInterval: 1500, // next ball spawn, or maybe next after that... who knows?
      // multiplier for the time that the ball takes to drop to the bottom of the screen
      // speed is screen height in pixels * speed = animation duration in milliseconds
      // affects on next spawning ball speed
      // lower is faster
      speed: 3,
    },
    private readonly spawner = new Intervaller(state.nextInterval),
  ) {
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  // start dropping balls...
  public start = () => {
    this.spawner.addListener(() => {
      this.laneView.addChild(
        this.sendBallToBottom(this.spawnBallToRandomLane())
        )

      // update spawner interval to adjust game speed
      // const sign = (Math.random() * 100) < 50 ? -1 : 1
      this.spawner.setInterval(this.state.nextInterval + Math.random() * this.intervalTolerance)
    }).start()
    return this
  }

  // create falling ball object on random drop lane
  private spawnBallToRandomLane = () => {
    const ballSize = (this.width / this.lanes.length) / 6
    const proto = randomFromArray(this.protoObjects)
    const ball = new Ball(ballSize, proto.color, proto.key)

    ball.y = -ballSize

    // spawn certain objects to certain lanes...
    ball.x = this.lanes[this.protoObjects.indexOf(proto)].position

    return ball
  }

  private sendBallToBottom = (x: Ball) =>
    x.animateTo(this.height + x.height, this.state.speed)

  private handleKeyDown = (e: KeyboardEvent) => {
    // key should not be pressed down..
    if (this.state.onHold === false) {
      this.state.onHold = true
      const keyName = e.key.toUpperCase()
      const maybeLane = this.protoObjects.find(x => x.key === keyName)

      if (maybeLane) {
        // find Ball elements from laneview
        toBalls(this.laneView.children)
          // where key is the same as pressed one
          // TODO: flip this
          .filter(x => x.key === maybeLane.key)
          // if element intersects with markerLine (is on the line)
          .filter(elementIntersectsWithLine(this.targetMarkerLine))
          // delete...
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
