import { getCarCornerPos } from '../car/getCarCorner';
import { getCarRelCorner } from '../car/getCarRelCorner';
import { bodyRoll } from '../../refs';
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

export function getTotalTireForce(
  prevDistance: Ref<number>,
  front: boolean,
  left: boolean,
  deltaTime: number
) {
  const wheelPos = getCarCornerPos(front, left);

  const [suspensionForce, compression] = getSpringForce(wheelPos, prevDistance);
  const sideTireForce = getSideTireForce(deltaTime, compression);
  const straightTireForce = getStraightTireForce(deltaTime, compression, front);
  const { wheelMeshPos, wheelOffsetFromCorner } = getWheelMeshPos(compression, front, left);

  const sqrtCompression = Math.sqrt(compression);
  const tireGripAfterCompression = tireGrip.current * sqrtCompression;
  const totalTireForce = add(sideTireForce, createArr(straightTireForce));
  const totalClampedTireForce = totalTireForce.clampLength(0, tireGripAfterCompression);
  const ammoForce = getAmmoVector(add(suspensionForce, createArr(totalClampedTireForce)));
  const cornerPos = getCarRelCorner(front, left).clone();
  const ammoPos = getAmmoVector(cornerPos.add(mult(wheelOffsetFromCorner, bodyRoll.current)));

  return {
    wheelMeshPos,
    ammoForce,
    ammoPos,
    compression,
    suspensionForce,
    sideTireForce,
    totalTireForce,
  };
}
