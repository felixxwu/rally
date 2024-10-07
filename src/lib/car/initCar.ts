import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { angularDamping, car, onRender, physicsWorld, scene, selectedCar } from '../../refs';
import { setUserData } from '../utils/userData';
import { updateCar } from './updateCar';
import { THREE } from '../utils/THREE';
import { setBumpStop } from '../wheel/setBumpStop';
import { platFormCarPos, setCarPos } from './setCarPos';
import { vec3 } from '../utils/createVec';
import { createCleanupFunction } from '../utils/createCleanupFunction';
import { asyncGLTFLoader } from '../utils/asyncGLTFLoader';

export const carCleanUp = createCleanupFunction();

export async function initCar() {
  const gltf = await asyncGLTFLoader(`./cars/${selectedCar.current.glb}.glb`);

  car.current = new THREE.Mesh(gltf.geometry, createObjectMaterial());

  const shape = new Ammo.btCompoundShape();

  setBumpStop(shape, car.current, true, true);
  setBumpStop(shape, car.current, true, false);
  setBumpStop(shape, car.current, false, true);
  setBumpStop(shape, car.current, false, false);

  const mass = selectedCar.current.mass;
  const localInertia = new Ammo.btVector3(0, 1, 0);
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

  setCarPos(platFormCarPos, vec3([1, 0, 1]));

  onRender.current.push(updateCar);

  carCleanUp.addCleanupFunction(() => {
    physicsWorld.current?.removeRigidBody(body);
    scene.current?.remove(car.current!);
    car.current = null;
    onRender.current = onRender.current.filter(f => f !== updateCar);
  });
}

export function createObjectMaterial() {
  const c = Math.floor(Math.random() * (1 << 24));
  return new THREE.MeshStandardMaterial({ color: c, roughness: 0, metalness: 0.2 });
}
