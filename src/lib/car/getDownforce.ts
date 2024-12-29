import { selectedCar } from '../../refs';
import { helperArrowFromTo } from '../helperArrows/helperArrow';
import { getSpeedVec } from './getSpeedVec';
import { getCarMeshPos } from './getCarTransform';
import { getCarDirection } from './getCarDirection';
import { vec3 } from '../utils/createVec';
import { getAmmoVector } from '../utils/vectorConversion';

export function getDownforce() {
  const { length, downforceFront, downforceRear } = selectedCar.current;
  const speed = getSpeedVec();
  const downVec = getCarDirection(vec3([0, -1, 0]));
  const forwardVec = getCarDirection(vec3([0, 0, 1]));

  const carMeshFront = getCarMeshPos()
    .clone()
    .add(forwardVec.clone().multiplyScalar(length / 2));
  const carMeshBack = getCarMeshPos()
    .clone()
    .add(forwardVec.clone().multiplyScalar(-length / 2));

  const carRelFront = forwardVec.setLength(length / 2);
  const carRelBack = forwardVec.setLength(-length / 2);

  const squared = speed.length() ** 2;

  const frontDownforce = downVec.clone().setLength(squared * -downforceFront);
  const rearDownforce = downVec.clone().setLength(squared * downforceRear);

  helperArrowFromTo(
    carMeshFront.clone().add(frontDownforce.clone().multiplyScalar(0.0001)),
    carMeshFront,
    0xffffff,
    'downforce front'
  );
  helperArrowFromTo(
    carMeshBack.clone().add(rearDownforce.clone().multiplyScalar(-0.0001)),
    carMeshBack,
    0xffffff,
    'downforce rear'
  );

  return {
    front: getAmmoVector(frontDownforce),
    frontOrigin: getAmmoVector(carRelFront),
    rear: getAmmoVector(rearDownforce),
    rearOrigin: getAmmoVector(carRelBack),
  };
}
