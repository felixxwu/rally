import { selectedCar } from '../../refs';
import { helperArrowFromTo } from '../helperArrows/helperArrow';
import { getSpeedVec } from './getSpeedVec';
import { getCarMeshPos } from './getCarTransform';
import { getCarDirection } from './getCarDirection';
import { vec3 } from '../utils/createVec';
import { getAmmoVector } from '../utils/vectorConversion';
import { THREE } from '../utils/THREE';

// Reusable objects to avoid allocations
const downVecCache = new THREE.Vector3();
const forwardVecCache = new THREE.Vector3();
const carMeshPosCache = new THREE.Vector3();
const carMeshFrontCache = new THREE.Vector3();
const carMeshBackCache = new THREE.Vector3();
const carRelFrontCache = new THREE.Vector3();
const carRelBackCache = new THREE.Vector3();
const frontDownforceCache = new THREE.Vector3();
const rearDownforceCache = new THREE.Vector3();

export function getDownforce() {
  const { length, downforceFront, downforceRear } = selectedCar.current;
  const speed = getSpeedVec();

  // Reuse cached vectors
  downVecCache.copy(getCarDirection(vec3([0, -1, 0])));
  forwardVecCache.copy(getCarDirection(vec3([0, 0, 1])));

  // Get car mesh position once and reuse
  carMeshPosCache.copy(getCarMeshPos());
  carMeshFrontCache.copy(carMeshPosCache).add(forwardVecCache.clone().multiplyScalar(length / 2));
  carMeshBackCache.copy(carMeshPosCache).add(forwardVecCache.clone().multiplyScalar(-length / 2));

  carRelFrontCache.copy(forwardVecCache).setLength(length / 2);
  carRelBackCache.copy(forwardVecCache).setLength(-length / 2);

  const squared = speed.length() ** 2;

  frontDownforceCache.copy(downVecCache).setLength(squared * -downforceFront);
  rearDownforceCache.copy(downVecCache).setLength(squared * downforceRear);

  helperArrowFromTo(
    carMeshFrontCache.clone().add(frontDownforceCache.clone().multiplyScalar(0.0001)),
    carMeshFrontCache.clone(),
    0xffffff,
    'downforce front'
  );
  helperArrowFromTo(
    carMeshBackCache.clone().add(rearDownforceCache.clone().multiplyScalar(-0.0001)),
    carMeshBackCache.clone(),
    0xffffff,
    'downforce rear'
  );

  return {
    front: getAmmoVector(frontDownforceCache),
    frontOrigin: getAmmoVector(carRelFrontCache),
    rear: getAmmoVector(rearDownforceCache),
    rearOrigin: getAmmoVector(carRelBackCache),
  };
}
