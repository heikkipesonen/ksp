import * as PIXI from 'pixi.js'
import * as E from 'fp-ts/lib/Either'
import { isSome } from 'fp-ts/lib/Option'

import { maybeKSP, maybeWin, KSP } from '../domain/ksp'

import { Intervaller } from '../components/interval'
import { Ball, toBalls } from '../components/ball'
import { LaneView } from '../components/laneview'
import { Title } from '../components/title'
import { Background } from '../components/background'
import { Score } from '../components/score'

import { shake, wobble } from '../support/animations'
import { addChildrenTo, elementIntersectsWithLine, move } from '../support'

export class Game {
  constructor(
    ballTypes: KSP[],
    width: number,
    private height: number,

    private readonly view = new PIXI.Container(),
    private readonly title = wobble(new Title('KSP-hero', width)),
    private readonly subTitle = move(new Title('fukken borin\'', width, 24), 0, -10),
    private readonly background = new Background(width, height, 40),
    private readonly laneView = move(new LaneView(ballTypes, 600, height), width / 2 - 300, 0),
    private readonly scoreCounter = move(new Score(0), 100, 10),
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
    addChildrenTo([
      this.background,
      this.laneView,
      this.title,
      this.subTitle,
      this.scoreCounter,
    ])(this.view)

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
        this.maybeHitMaybeMiss(maybeKSPKey.right)
      }
    }
  }

  private maybeHitMaybeMiss = (key: KSP) => {
    const hitTargets = this.getIntersectingBalls().filter(x => maybeWin(key)(x.key))
    const hasHit = hitTargets.length > 0

    if (hasHit) {
      this.onHit(hitTargets)
    } else {
      this.onMiss()
    }
  }

  private onHit = (targets: Ball[]) => {
    this.scoreCounter.add(100)
    targets.forEach(x => x.destroy())
  }
  private onMiss = () => {
    this.scoreCounter.add(-25)
  }

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
