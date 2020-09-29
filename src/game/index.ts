import * as PIXI from 'pixi.js'
import * as E from 'fp-ts/lib/Either'

import { Intervaller } from '../components/interval'
import { Ball, toBalls } from '../components/ball'

import { elementIntersectsWithLine } from './support'
import { LaneView } from '../components/laneview'

import { maybeKSP, maybeWin, KSP } from '../domain/ksp'

import { Title } from '../components/title'
import { shake, wobble } from '../components/animations'
import { Background } from '../components/background'
import { isSome } from 'fp-ts/lib/Option'

export class Game {
  constructor (
    ballTypes: KSP[],
    private width: number,
    private height: number,

    private readonly view = new PIXI.Container(),
    private readonly title = wobble(new Title('KSP-hero', width)),
    private readonly background = new Background(width, height, 30),
    private readonly laneView = new LaneView(ballTypes, 600, height),
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
    this.laneView.x = this.width / 2 - this.laneView.width / 2
    this.view.addChild(this.background)
    this.view.addChild(this.laneView)

    this.view.addChild(this.title)

    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  // start dropping balls...
  public start = () => {
    this.spawner.addListener(() => {
      this.laneView.addChild(
        this.sendBallToBottom(
          wobble(this.laneView.spawnBallToRandomLane())
          )
        )
      // update spawner interval to adjust game speed
      // const sign = (Math.random() * 100) < 50 ? -1 : 1
      this.spawner.setInterval(this.state.nextInterval + Math.random() * this.intervalTolerance)
    }).start()
    return this
  }

  private sendBallToBottom = (x: Ball) =>
    x.animateTo(this.height + x.height, this.state.speed)

  private handleKeyDown = (e: KeyboardEvent) => {
    // key should not be pressed down..
    if (this.state.onHold === false) {
      this.state.onHold = true
      const maybeKSPKey = maybeKSP(e.key.toUpperCase())
      if (E.isRight(maybeKSPKey)) {
        const maybeMarkerObject = this.laneView.getMarkerFor(maybeKSPKey.right)
        if (isSome(maybeMarkerObject)) {
          shake(maybeMarkerObject.value)
        }
        this.applyKeyToBallObjects(maybeKSPKey.right)
      }
    }
  }

  private applyKeyToBallObjects = (key: KSP) =>
    this.getIntersectingBalls()
      .filter(x => maybeWin(key)(x.key))
      .forEach(x => {
        x.destroy()
      })

  private getIntersectingBalls = () =>
    toBalls(this.laneView.children)
      .filter(elementIntersectsWithLine(this.laneView.getMarkerLine()))

  private handleKeyUp = () =>
    this.state.onHold = false

  public addTo = (container: PIXI.Container) => {
    container.addChild(this.view)
    return this
  }
}
