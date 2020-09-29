import * as PIXI from 'pixi.js'
import * as E from 'fp-ts/lib/Either'

import { randomFromArray } from '../support'
import { Intervaller } from '../components/interval'
import { Ball, toBalls } from '../components/ball'

import { elementIntersectsWithLine, lanesFromProto } from './support'
import { LaneView } from '../components/laneview'
import { MarkLine } from '../components/markline'
import { Background } from '../components/background'

import { maybeKSP, maybeWin, KSP, BallProto } from '../domain/ksp'
import { Title } from '../components/title'
import { wobble } from '../components/animations'

export class Game {
  constructor (
    private ballTypes: BallProto[],
    width: number,
    private height: number,

    private readonly view = new PIXI.Container(),

    private readonly title = new Title('KSP-hero', width),
    private readonly lanes = lanesFromProto(ballTypes.length)(width),
    private readonly targetMarkerLine = new MarkLine(width, height * 0.8),
    private readonly laneView = new LaneView(),
    private readonly background = new Background(width, height, 30),

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

  // public applySadistiKKKmode = () => {
  //   const initialHeight = this.targetMarkerLine.y
  //   new TWEEN.Tween({ y: initialHeight })
  //     .duration(1000)
  //     .easing(TWEEN.Easing.Quadratic.InOut)
  //     .to({ y: initialHeight + this.height * 0.3 })
  //     .onUpdate(position => this.targetMarkerLine.y = position.y)
  //     .yoyo(true)
  //     .repeat(Infinity)
  //     .start(TWEEN.now())
  // }

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
    const ballSize = 50 + (Math.random() * 50)
    const proto = randomFromArray(this.ballTypes)
    const ball = new Ball(ballSize, proto.color, proto.key)

    ball.y = -ballSize

    // spawn to lane...
    ball.x = this.lanes[this.ballTypes.indexOf(proto)]

    return ball
  }

  private sendBallToBottom = (x: Ball) =>
    x.animateTo(this.height + x.height, this.state.speed)

  private handleKeyDown = (e: KeyboardEvent) => {
    // key should not be pressed down..
    if (this.state.onHold === false) {
      this.state.onHold = true
      const maybeKSPKey = maybeKSP(e.key.toUpperCase())
      if (E.isRight(maybeKSPKey)) {
        this.applyKeyToBallObjects(maybeKSPKey.right)
      }
    }
  }

  private applyKeyToBallObjects = (key: KSP) =>
    this.getIntersectingBalls()
      .filter(x => maybeWin(key)(x.key))
      .forEach(x => x.destroy())

  private getIntersectingBalls = () =>
    toBalls(this.laneView.children)
      .filter(elementIntersectsWithLine(this.targetMarkerLine))

  private handleKeyUp = () =>
    this.state.onHold = false

  public addTo = (container: PIXI.Container) => {
    this.view.addChild(this.background)
    this.view.addChild(this.laneView)
    this.background.addChild(this.targetMarkerLine)
    this.view.addChild(this.title)

    wobble(this.title)
    container.addChild(this.view)
    return this
  }
}
