import AmmoType from 'ammojs-typed';
import { renderHitCarBox, wheelEndOffset } from '../../refs';
import { carWidth } from '../../refs';
import { carLength } from '../../refs';
import { raycasterOffset } from '../../refs';
import { Mesh } from '../../types';
import { THREE } from '../utils/THREE';
import { createObjectMaterial } from '../car/initCar';
declare const Ammo: typeof AmmoType;

export function addBumpStop(
  shape: AmmoType.btCompoundShape,
  carMesh: Mesh,
  front: boolean,
  left: boolean
) {
  const pos = [
    carWidth * (left ? 0.5 : -0.5),
    raycasterOffset,
    (carLength / 2 - wheelEndOffset) * (front ? -1 : 1),
  ];
  const size = carWidth;

  const wheelTransform = new Ammo.btTransform();
  wheelTransform.setOrigin(new Ammo.btVector3(pos[0], pos[1], pos[2]));
  shape.addChildShape(wheelTransform, new Ammo.btSphereShape(size));

  const material = createObjectMaterial();
  material.opacity = 0.5;
  material.transparent = true;
  const hitbox = new THREE.Mesh(new THREE.SphereGeometry(size, 16, 16), material);
  hitbox.position.copy(new THREE.Vector3(pos[0], pos[1], pos[2]));
  hitbox.visible = renderHitCarBox.current;
  carMesh.add(hitbox);
  renderHitCarBox.listeners.push(value => {
    hitbox.visible = value;
  });
}
