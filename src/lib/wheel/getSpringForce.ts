import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { ammoVehicle } from '../../refs';
import { THREE } from '../utils/THREE';
import { Ref } from '../utils/ref';
import { Surface } from '../../types';
import { logRenderTime } from '../render/initRenderer';
import { getThreeVector } from '../utils/vectorConversion';
import { getCarCornerPos } from '../car/getCarCorner';

export function getSpringForce(
  pos: THREE.Vector3,
  prevDistance: Ref<number>,
  front: boolean,
  left: boolean
) {
  const now = window.performance.now();

  const wheelIndex = front ? (left ? 0 : 1) : left ? 2 : 3;

  const wheelInfo = ammoVehicle.current!.getWheelInfo(wheelIndex);
  const wheelMeshPos = wheelInfo.get_m_worldTransform().getOrigin();

  const wheelAttachPoint = getCarCornerPos(front, left);
  const suspensionDir = getThreeVector(wheelMeshPos).sub(wheelAttachPoint);
  const suspensionLength = suspensionDir.length();

  const wheelInfoFromVehicle = ammoVehicle.current!.getWheelInfo(wheelIndex);
  const force = wheelInfoFromVehicle.get_m_wheelsSuspensionForce();

  let normal = new THREE.Vector3(0, 1, 0);

  let surface: Surface = 'tarmac';
  logRenderTime('raycast', now);

  const upForce = normal.setLength(force);

  return { suspensionForce: upForce, suspensionLength, surface };
}
