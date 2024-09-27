import { getCarCornerPos } from '../car/getCarCorner';
import { getCarRelCorner } from '../car/getCarRelCorner';
import { bodyRoll, surfaceGrips } from '../../refs';
import { getAmmoVector } from '../utils/vectorConversion';
import { getSpringForce } from './getSpringForce';
import { tireGrip } from '../../refs';
import { mult } from '../utils/multVec';
import { Ref } from '../utils/ref';
import { getWheelMeshPos } from './getWheelMeshPos';
import { add } from '../utils/addVec';
import { createArr } from '../utils/createVec';
import { getSideTireForce } from './getSideTireForce';
import { getStraightTireForce } from './getStraightTireForce';

export function getTotalTireForce(prevDistance: Ref<number>, front: boolean, left: boolean) {
  const cornerPos = getCarCornerPos(front, left);

  const { suspensionForce, compression, surface } = getSpringForce(cornerPos, prevDistance);
  const sideTireForce = getSideTireForce(compression);
  const straightTireForce = getStraightTireForce(front);
  const { wheelMeshPos, wheelOffsetFromCorner, wheelmeshBottomPos } = getWheelMeshPos(
    compression,
    front,
    left
  );

  const sqrtCompression = Math.sqrt(compression);
  const tireGripAfterCompression = tireGrip.current * sqrtCompression;
  const surfaceGrip = surfaceGrips[surface].ref.current;
  const tireGripAfterSurface = tireGripAfterCompression * surfaceGrip;
  const totalTireForce = add(sideTireForce, createArr(straightTireForce));
  const totalClampedTireForce = totalTireForce.clampLength(0, tireGripAfterSurface);
  const ammoForce = getAmmoVector(add(suspensionForce, createArr(totalClampedTireForce)));
  const cornerPosRelative = getCarRelCorner(front, left).clone();
  const ammoPos = getAmmoVector(
    cornerPosRelative.add(mult(wheelOffsetFromCorner, bodyRoll.current))
  );

  return {
    wheelMeshPos,
    ammoForce,
    ammoPos,
    compression,
    suspensionForce,
    sideTireForce,
    totalTireForce,
    surface,
    wheelmeshBottomPos,
  };
}
