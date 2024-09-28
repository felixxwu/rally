import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  angularDamping,
  car,
  carHeight,
  carLength,
  carWidth,
  onRender,
  physicsWorld,
  scene,
} from '../../refs';
import { setUserData } from '../utils/userData';
import { updateCar } from './updateCar';
import { THREE } from '../utils/THREE';
import { addBumpStop } from '../wheel/addBumpStop';
import { getSpawn } from '../utils/getSpawn';
import { resetCar } from './setCarPos';

export function initCar() {
  const spawn = getSpawn();
  car.current = new THREE.Mesh(
    new THREE.BoxGeometry(carWidth, carHeight, carLength, 1, 1, 1),
    createObjectMaterial()
  );

  const shape = new Ammo.btCompoundShape();

  addBumpStop(shape, car.current, true, true);
  addBumpStop(shape, car.current, true, false);
  addBumpStop(shape, car.current, false, true);
  addBumpStop(shape, car.current, false, false);

  const mass = 15;
  const localInertia = new Ammo.btVector3(0, 10, 0);
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

  setUserData(car.current, { physicsBody: body });

  car.current.receiveShadow = true;
  car.current.castShadow = true;

  scene.current?.add(car.current);

  physicsWorld.current?.addRigidBody(body);

  resetCar();

  onRender.push(updateCar);
}

export function createObjectMaterial() {
  const c = Math.floor(Math.random() * (1 << 24));
  return new THREE.MeshStandardMaterial({ color: c, roughness: 0, metalness: 0.2 });
}
