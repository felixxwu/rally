import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  ammoVehicle,
  ammoVehicleTuning,
  angularDamping,
  car,
  onRender,
  physicsWorld,
  scene,
  selectedCar,
} from '../../refs';
import { setUserData } from '../utils/userData';
import { updateCar } from './updateCar';
import { THREE } from '../utils/THREE';
import { setBumpStop } from '../wheel/setBumpStop';
import { getPlatFormCarPos, setCarPos } from './setCarPos';
import { vec3 } from '../utils/createVec';
import { createCleanupFunction } from '../utils/createCleanupFunction';
import { asyncGLTFLoader } from '../utils/asyncGLTFLoader';

export const carCleanUp = createCleanupFunction();

export async function initCar() {
  const { glb, mass } = selectedCar.current;
  const gltf = await asyncGLTFLoader(`./cars/${glb}.glb`);
  const texture = new THREE.TextureLoader().load(`./cars/${glb}.png`);
  texture.flipY = false;

  car.current = new THREE.Mesh(
    gltf.geometry,
    new THREE.MeshStandardMaterial({ roughness: 0, metalness: 0.2, map: texture })
  );

  const shape = new Ammo.btCompoundShape();

  setBumpStop(shape, car.current, true, true);
  setBumpStop(shape, car.current, true, false);
  setBumpStop(shape, car.current, false, true);
  setBumpStop(shape, car.current, false, false);

  // const shape = new Ammo.btBoxShape(new Ammo.btVector3(width / 2, height / 2, length / 2));

  const localInertia = new Ammo.btVector3(0, -1, 0);
  shape.calculateLocalInertia(mass, localInertia);
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  const pos = car.current.position;
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  const motionState = new Ammo.btDefaultMotionState(transform);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  rbInfo.set_m_friction(0);
  rbInfo.set_m_restitution(0);
  rbInfo.set_m_angularDamping(angularDamping);
  rbInfo.set_m_linearDamping(0);
  rbInfo.set_m_linearSleepingThreshold(0);
  const body = new Ammo.btRigidBody(rbInfo);
  body.setActivationState(4);

  setUserData(car.current, { physicsBody: body });

  car.current.receiveShadow = true;
  car.current.castShadow = true;

  scene.current?.add(car.current);

  physicsWorld.current?.addRigidBody(body);

  ammoVehicleTuning.current = new Ammo.btVehicleTuning();
  var rayCaster = new Ammo.btDefaultVehicleRaycaster(physicsWorld.current!);
  ammoVehicle.current = new Ammo.btRaycastVehicle(ammoVehicleTuning.current, body, rayCaster);
  ammoVehicle.current.setCoordinateSystem(0, 1, 2);
  physicsWorld.current!.addAction(ammoVehicle.current);

  setCarPos(getPlatFormCarPos(), vec3([1, 0, 1]));

  onRender.current.push(['updateCar', updateCar]);

  carCleanUp.addCleanupFunction(() => {
    physicsWorld.current?.removeRigidBody(body);
    physicsWorld.current?.removeAction(ammoVehicle.current!);
    scene.current?.remove(car.current!);
    car.current = null;
    onRender.current = onRender.current.filter(f => f[1] !== updateCar);
  });
}

export function createObjectMaterial() {
  const c = Math.floor(Math.random() * (1 << 24));
  return new THREE.MeshStandardMaterial({ color: c, roughness: 0, metalness: 0.2 });
}
