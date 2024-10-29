import AmmoType from 'ammojs-typed';
import { getCarCornerPos } from '../car/getCarCorner';
import { getCarRelCorner } from '../car/getCarRelCorner';
import { selectedCar, surfaceGrips } from '../../refs';
import { getAmmoVector } from '../utils/vectorConversion';
import { getSpringForce } from './getSpringForce';
import { Ref } from '../utils/ref';
import { getWheelMeshPos } from './getWheelMeshPos';
import { getSideTireForce } from './getSideTireForce';
import { getStraightTireForce } from './getStraightTireForce';
declare const Ammo: typeof AmmoType;

export function getTotalTireForce(prevDistance: Ref<number>, front: boolean, left: boolean) {
  const cornerPos = getCarCornerPos(front, left);

  const { suspensionForce, suspensionLength, surface } = getSpringForce(
    cornerPos,
    prevDistance,
    front,
    left
  );
  const sideTireForce = getSideTireForce();
  const straightTireForce = getStraightTireForce(front);
  const { wheelMeshPos, wheelmeshBottomPos } = getWheelMeshPos(suspensionLength, front, left);

  const { tireGrip } = selectedCar.current;
  const tireGripAfterCompression = tireGrip * suspensionForce.length();
  const surfaceGrip = surfaceGrips[surface].dry.current;
  const tireGripAfterSurface = tireGripAfterCompression * surfaceGrip;
  const sideTireForceClamped = sideTireForce.clone().clampLength(0, tireGripAfterSurface);
  const totalTireForce = sideTireForceClamped.clone().add(straightTireForce);
  const totalTireForceBeforeClamp = sideTireForce.clone().add(straightTireForce);
  const totalClampedTireForce = totalTireForce.clone().clampLength(0, tireGripAfterSurface);

  const ammoForce = getAmmoVector(totalClampedTireForce);
  const cornerPosRelative = getCarRelCorner(front, left).clone();
  const ammoPos = getAmmoVector(cornerPosRelative);

  return {
    wheelMeshPos,
    ammoForce,
    ammoPos,
    suspensionForce,
    totalClampedTireForce,
    totalTireForceBeforeClamp,
    surface,
    wheelmeshBottomPos,
    sideTireForce,
    straightTireForce,
  };
}
