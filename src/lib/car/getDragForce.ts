import { minAirResistance, selectedCar } from '../../refs';
import { car } from '../../refs';
import { helperArrow } from '../helperArrows/helperArrow';
import { mult } from '../utils/multVec';
import { add } from '../utils/addVec';
import { THREE } from '../utils/THREE';
import { getSpeedVec } from './getSpeedVec';
import { getCarPos } from './getCarTransform';

// Reusable objects to avoid allocations
const dragForceCache = new THREE.Vector3();
const inverseTravelCache = new THREE.Vector3();

export function getDragForce() {
  if (!car.current) return new THREE.Vector3();

  const speed = getSpeedVec();
  // Reuse cached vectors for intermediate calculations
  inverseTravelCache.copy(speed).multiplyScalar(-selectedCar.current.drag);
  dragForceCache.copy(inverseTravelCache).multiplyScalar(inverseTravelCache.length());
  const carPos = getCarPos();
  dragForceCache.setLength(dragForceCache.length() + minAirResistance);

  if (speed.length() > 0.1) {
    helperArrow(mult(inverseTravelCache, -2), add(carPos, [0, 1, 0]), 0x0000ff, 'travel');
    helperArrow(mult(dragForceCache, 0.1), add(carPos, [0, 1, 0]), 0xffffff, 'airResistance');
  }

  return dragForceCache.clone();
}
