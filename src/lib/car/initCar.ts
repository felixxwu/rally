import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  airResistanceArrow,
  car,
  carHeight,
  carLength,
  carWidth,
  dynamicObjects,
  onRender,
  physicsWorld,
  scene,
} from '../../constant';
import { setUserData } from '../utils/userData';
import { updateCar } from './updateCar';
import { THREE } from '../utils/THREE';
import { terrainMaxHeight } from '../../constant';
import { terrainDepth } from '../../constant';
import { terrainWidth } from '../../constant';
import { addBumpStop } from '../wheel/addBumpStop';

export function initCar() {
  car.current = new THREE.Mesh(
    new THREE.BoxGeometry(carWidth, carHeight, carLength, 1, 1, 1),
    createObjectMaterial()
  );
  const shape = new Ammo.btCompoundShape();
  addBumpStop(shape, true, true);
  addBumpStop(shape, true, false);
  addBumpStop(shape, false, true);
  addBumpStop(shape, false, false);

  car.current.position.set(
    (Math.random() - 0.5) * terrainWidth * 0.6,
    terrainMaxHeight + 10,
    (Math.random() - 0.5) * terrainDepth * 0.6
  );

  const mass = 15;
  const localInertia = new Ammo.btVector3(0, 0, 0);
  shape.calculateLocalInertia(mass, localInertia);
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  const pos = car.current.position;
  transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z));
  const motionState = new Ammo.btDefaultMotionState(transform);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(mass, motionState, shape, localInertia);
  rbInfo.set_m_friction(0);
  rbInfo.set_m_restitution(0);
  rbInfo.set_m_angularDamping(0.99999997);
  rbInfo.set_m_linearDamping(0.1);
  rbInfo.set_m_linearSleepingThreshold(0);
  const body = new Ammo.btRigidBody(rbInfo);

  setUserData(car.current, { physicsBody: body });

  car.current.receiveShadow = true;
  car.current.castShadow = true;

  scene.current?.add(car.current);
  dynamicObjects.push(car.current);

  physicsWorld.current?.addRigidBody(body);

  airResistanceArrow.current = new THREE.ArrowHelper();
  airResistanceArrow.current.setColor(0xffffff);
  scene.current?.add(airResistanceArrow.current);

  onRender.push(updateCar);
}

function createObjectMaterial() {
  const c = Math.floor(Math.random() * (1 << 24));
  return new THREE.MeshPhongMaterial({ color: c });
}
