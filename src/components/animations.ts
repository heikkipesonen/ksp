import TWEEN from '@tweenjs/tween.js'

export const wobble = <T extends PIXI.DisplayObject>(target: T): T => {
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
  return target
}


// yes... looks like a crows nest.. yak
export const shake = <T extends PIXI.DisplayObject>(target: T): T => {
  const bounceIn =
    new TWEEN.Tween({
      rotation: target.rotation,
      scale: target.scale.x,
    })
      .duration(50)
      .to({
        scale: 0.8,
        rotation: 0.2,
      })
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(x => {
        target.rotation = x.rotation
        target.scale.x = x.scale
        target.scale.y = x.scale
      })

  const bounceOut = new TWEEN.Tween({
    scale: 0.8,
    rotation: 0.2,
  })
    .duration(50)
    .to({
      scale: 1,
      rotation: 0
    })
    .easing(TWEEN.Easing.Quadratic.InOut)
    .onUpdate(x => {
      target.rotation = x.rotation
      target.scale.x = x.scale
      target.scale.y = x.scale
    })

  bounceIn.chain(bounceOut).start(TWEEN.now())
  return target
}
