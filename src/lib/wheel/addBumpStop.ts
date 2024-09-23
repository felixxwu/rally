import AmmoType from 'ammojs-typed';
import { carHeight, wheelEndOffset } from '../../refs';
import { carWidth } from '../../refs';
import { carLength } from '../../refs';
import { raycasterOffset } from './getSpringForce';
declare const Ammo: typeof AmmoType;

export function addBumpStop(shape: AmmoType.btCompoundShape, front: boolean, left: boolean) {
  const wheel1Transform = new Ammo.btTransform();
  wheel1Transform.setOrigin(
    new Ammo.btVector3(
      carWidth * (left ? 0.5 : -0.5),
      raycasterOffset,
      (carLength / 2 + wheelEndOffset) * (front ? -1 : 1)
    )
  );
  shape.addChildShape(wheel1Transform, new Ammo.btSphereShape(carHeight / 2));
}

export function addBody(shape: AmmoType.btCompoundShape, front: boolean) {
  const wheel1Transform = new Ammo.btTransform();
  wheel1Transform.setOrigin(
    new Ammo.btVector3(
      carWidth * 0.5,
      carWidth * 0.5,
      (carLength / 2 + wheelEndOffset) * (front ? -1 : 1)
    )
  );
  shape.addChildShape(wheel1Transform, new Ammo.btSphereShape(carWidth / 2 + 0.5));
}
