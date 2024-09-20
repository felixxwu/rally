import AmmoType from 'ammojs-typed'
import { carHeight, carLength, carWidth } from '../car/initCar'
declare const Ammo: typeof AmmoType

export function addBumpStop(shape: AmmoType.btCompoundShape, front: boolean, left: boolean) {
  const wheel1Transform = new Ammo.btTransform()
  wheel1Transform.setOrigin(
    new Ammo.btVector3(carWidth * (front ? 0.5 : -0.5), 0, carLength * (left ? -0.5 : 0.5))
  )
  shape.addChildShape(wheel1Transform, new Ammo.btSphereShape(carHeight / 4))
}
