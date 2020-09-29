import * as PIXI from 'pixi.js'
import * as O from 'fp-ts/lib/Option'

import { COLOR_MAP } from '../domain/color-map'
import { KSP, winnerKeyFor } from '../domain/ksp'
import { addChildrenTo, move, randomFromArray } from '../support'
import { Ball } from './ball'
import { findIndicatorBalls, IndicatorBall } from './indicator-ball'
import { MarkLine } from './markline'

export class LaneView extends PIXI.Container {
  constructor(
    public ballTypes: KSP[],
    public width: number,
    public height: number,

    private readonly indicatorContainer = new PIXI.Container(),
    private readonly targetMarkerLine = new MarkLine(width, height - 200),
  ) {
    super()
    addChildrenTo([
      this.targetMarkerLine,
      this.indicatorContainer,
    ])(this)

    // create lane icons
    addChildrenTo(this.ballTypes
      // opposite key of lane balls (winning key icon)
      .map(winnerKeyFor)
      .map(x => new IndicatorBall(80, COLOR_MAP[x], x))
      // center objects
      .map((x, i) =>
        move(x, this.getLaneCenter(i), this.targetMarkerLine.y + x.height / 2)
      )
    )(this)
  }

  // find marker icon for a lane by key..
  public getMarkerFor = (key: KSP) => O.fromNullable(
    findIndicatorBalls(this.children)
      .find(x => x.key === key)
  )

  public getLaneCenter = (index: number) => this.getLaneWidth() * index + this.getLaneWidth() / 2
  public getLaneWidth = () => this.width / this.ballTypes.length
  public getMarkerLine = () => this.targetMarkerLine


  // create falling ball object on random drop lane
  public spawnBallToRandomLane = () => {
    const ballRadius = 80
    const proto = randomFromArray(this.ballTypes)
    const ball = new Ball(ballRadius, COLOR_MAP[proto], proto)

    ball.y = -ballRadius
    // spawn to lane...
    ball.x = this.getLaneCenter(this.ballTypes.indexOf(proto))
    this.addChild(ball)

    return ball
  }
}
