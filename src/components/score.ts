import TWEEN from '@tweenjs/tween.js'
import * as PIXI from 'pixi.js'
import { titleTextStyle, applyTextShadow } from '../support/text-styles'

export class Score extends PIXI.Container {
  constructor(
    private _value: number = 0,
    public display = new PIXI.Text(`${_value}`, {
      ...titleTextStyle,
    }),
    private animation: any = null
  ) {
    super()
    applyTextShadow(this)
    this.addChild(this.display)
  }

  get value() {
    return this._value
  }

  set value(x: number) {
    this._value = x
    this.display.text = `${this._value}`
  }

  public add = (value: number) => {
    if (this.animation) {
      this.animation.stop()
    }

    const newValue = this.value + value

    this.animation = new TWEEN.Tween({ score: this.value })
      .to({ score: newValue })
      .duration(200)
      .onUpdate(x => {
        this.value = Math.round(x.score)
      })
      .onStop(() => this.value = newValue)
      .start(TWEEN.now())
  }
}