import { getCarCornerPos } from '../car/getCarCorner';
import { getCarRelCorner } from '../car/getCarRelCorner';
import { selectedCar, surfaceGrips, weather } from '../../refs';
import { getAmmoVector } from '../utils/vectorConversion';
import { getSpringForce } from './getSpringForce';
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
  const sideTireForce = getSideTireForce();
  const straightTireForce = getStraightTireForce(front);
  const { wheelMeshPos, wheelOffsetFromCorner, wheelmeshBottomPos } = getWheelMeshPos(
    compression,
    front,
    left
  );

  const { tireGrip, bodyRoll } = selectedCar.current;
  const tireGripAfterCompression = tireGrip * suspensionForce.length();
  const surfaceGrip = surfaceGrips[surface][weather.current];
  const tireGripAfterSurface = tireGripAfterCompression * surfaceGrip;
  const sideTireForceClamped = sideTireForce.clone().clampLength(0, tireGripAfterSurface);
  const totalTireForce = sideTireForceClamped.clone().add(straightTireForce);
  const totalTireForceBeforeClamp = sideTireForce.clone().add(straightTireForce);
  const totalClampedTireForce = totalTireForce.clone().clampLength(0, tireGripAfterSurface);

  const ammoForce = getAmmoVector(add(suspensionForce, createArr(totalClampedTireForce)));
  const cornerPosRelative = getCarRelCorner(front, left).clone();
  const ammoPos = getAmmoVector(cornerPosRelative.add(mult(wheelOffsetFromCorner, bodyRoll)));

  return {
    wheelMeshPos,
    ammoForce,
    ammoPos,
    compression,
    suspensionForce,
    totalClampedTireForce,
    totalTireForceBeforeClamp,
    surface,
    wheelmeshBottomPos,
    sideTireForce,
    straightTireForce,
  };
}
