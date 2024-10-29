import AmmoType from 'ammojs-typed';
import { Mesh } from '../../types';
import {
  ammoVehicle,
  car,
  carVisible,
  internalController,
  powerModifier,
  reverseAngle,
  selectedCar,
  steerModMap,
  suspensionForces,
} from '../../refs';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { helperArrow } from '../helperArrows/helperArrow';
import { mult } from '../utils/multVec';
import { Ref } from '../utils/ref';
import { getTotalTireForce } from './getTotalTireForce';
import { addSkidMark } from './addSkidMark';
import { getSpeedVec } from '../car/getSpeedVec';
import { getCarDirection } from '../car/getCarDirection';
import { createQuat } from '../utils/createQuat';
import { getThreeVector } from '../utils/vectorConversion';
import { wheelHasPower } from './wheelHasPower';
import { getCarCornerMeshPos, getCarCornerPos } from '../car/getCarCorner';
declare const Ammo: typeof AmmoType;

export function updateWheel(
  wheelMesh: Mesh,
  wheelInfo: AmmoType.btWheelInfo,
  prevDistance: Ref<number>,
  front: boolean,
  left: boolean
) {
  if (!car.current) return;

  wheelMesh.visible = carVisible.current;
  const { brakePower, power } = selectedCar.current;

  const {
    ammoPos,
    suspensionForce,
    totalClampedTireForce,
    surface,
    wheelmeshBottomPos,
    totalTireForceBeforeClamp,
    sideTireForce,
    straightTireForce,
    ammoForce,
  } = getTotalTireForce(prevDistance, front, left);

  const forwardUnitVec = getCarDirection(new THREE.Vector3(0, 0, 1)).normalize();
  const throttle = internalController.current.throttle;
  const brake = internalController.current.brake;
  let engineForce = new THREE.Vector3();
  let brakeForce = new THREE.Vector3();
  if (wheelHasPower(front)) {
    engineForce.add(mult(forwardUnitVec, power * powerModifier * throttle));
    brakeForce.add(mult(forwardUnitVec, -brakePower * brake));
  }

  // apply forces to the car
  const objPhys = getUserData(car.current).physicsBody;
  objPhys.applyForce(ammoForce, ammoPos);

  // update pos of wheel mesh
  const wheelIndex = front ? (left ? 0 : 1) : left ? 2 : 3;
  const wheelMeshPos = getThreeVector(
    ammoVehicle.current!.getWheelInfo(wheelIndex).get_m_worldTransform().getOrigin()
  );

  const wheelAttachPoint = getCarCornerPos(front, left);
  const susLength = wheelMeshPos.clone().sub(wheelAttachPoint);

  const carCornerMeshPos = getCarCornerMeshPos(front, left);
  wheelMesh.position.copy(carCornerMeshPos.add(susLength));

  // update rotation of wheel mesh
  const additionalQuat = new THREE.Quaternion().setFromAxisAngle(
    new THREE.Vector3(0, 0, 1),
    Math.PI / 2
  );
  const ammoQuat = getUserData(car.current).physicsBody.getWorldTransform().getRotation();
  const quat = new THREE.Quaternion(ammoQuat.x(), ammoQuat.y(), ammoQuat.z(), ammoQuat.w());
  quat.multiply(additionalQuat);

  const carDir = getCarDirection();
  const speed = getSpeedVec();
  const angle = getCarDirection().angleTo(speed);
  const reversing = angle > reverseAngle;
  const { threeQuat: quat2 } = createQuat(
    carDir.clone().normalize(),
    speed.clone().normalize(),
    (front && !reversing ? 1 : 0) * steerModMap(speed.length())
  );
  quat2.multiply(quat);

  wheelMesh.setRotationFromQuaternion(quat2 || new THREE.Quaternion());

  // save compression to refs
  suspensionForces.current[front ? (left ? 0 : 1) : left ? 2 : 3] = suspensionForce.length();

  addSkidMark(
    suspensionForce.length(),
    wheelmeshBottomPos,
    totalClampedTireForce,
    sideTireForce,
    straightTireForce,
    front,
    left,
    surface
  );

  // helper arrows
  helperArrow(
    mult(suspensionForce, 0.02),
    wheelMesh.position,
    0xffff00,
    `suspension${front}${left}`
  );
  helperArrow(
    mult(totalTireForceBeforeClamp, 0.02),
    wheelMesh.position,
    0x000000,
    `strght${front}${left}`
  );
  helperArrow(
    mult(totalClampedTireForce, 0.02),
    wheelMesh.position,
    0xff0000,
    `clamp${front}${left}`
  );
}
