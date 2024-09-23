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
  terrainMesh,
} from '../../refs';
import { setUserData } from '../utils/userData';
import { updateCar } from './updateCar';
import { THREE } from '../utils/THREE';
import { addBumpStop } from '../wheel/addBumpStop';
import { add } from '../utils/addVec';

export function initCar() {
  car.current = new THREE.Mesh(
    new THREE.BoxGeometry(carWidth, carHeight, carLength, 1, 1, 1),
    createObjectMaterial()
  );
  // const shape = new Ammo.btSphereShape(carWidth / 2);
  // shape.
  // const shape = new Ammo.btBoxShape(
  //   new Ammo.btVector3(carWidth / 2, carHeight / 2, carLength / 2 + wheelEndOffset)
  // );

  const shape = new Ammo.btCompoundShape();

  // const wheel1Transform = new Ammo.btTransform();
  // wheel1Transform.setOrigin(new Ammo.btVector3(0, carLength / 2, 0));
  // shape.addChildShape(wheel1Transform, new Ammo.btSphereShape(carLength / 2));

  addBumpStop(shape, true, true);
  addBumpStop(shape, true, false);
  addBumpStop(shape, false, true);
  addBumpStop(shape, false, false);
  // addBody(shape, true);
  // addBody(shape, false);

  const raycaster = new THREE.Raycaster(new THREE.Vector3(0, 100, 0), new THREE.Vector3(0, -1, 0));
  const intersects = raycaster.intersectObject(terrainMesh.current!);
  car.current.position.copy(add(intersects[0].point, [0, 5, 20]));

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

  onRender.push(updateCar);
}

function createObjectMaterial() {
  const c = Math.floor(Math.random() * (1 << 24));
  return new THREE.MeshStandardMaterial({ color: c, roughness: 0, metalness: 0.2 });
}
