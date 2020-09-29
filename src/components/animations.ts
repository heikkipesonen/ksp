import TWEEN from '@tweenjs/tween.js'

export const wobble = (target: PIXI.DisplayObject) =>
  new TWEEN.Tween({
    rotation: -0.2,
  }).to({
    rotation: 0.2,
  })
    .onUpdate(x => {
      target.rotation = x.rotation
    })
    .duration(150)
    .easing(TWEEN.Easing.Quadratic.InOut)
    .yoyo(true)
    .repeat(Infinity)
    .start(TWEEN.now())