import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  angularDamping,
  car,
  carVisible,
  onRender,
  physicsWorld,
  scene,
  selectedCar,
  sound,
  soundOff,
} from '../../refs';
import { setUserData } from '../utils/userData';
import { updateCar } from './updateCar';
import { THREE } from '../utils/THREE';
import { platFormCarPos, setCarPos } from './setCarPos';
import { vec3 } from '../utils/createVec';
import { createCleanupFunction } from '../utils/createCleanupFunction';
import { asyncGLTFLoader } from '../utils/asyncGLTFLoader';
import { addOnRenderListener } from '../render/addOnRenderListener';
import { renderHitCarBox } from '../../refs';

export const carCleanUp = createCleanupFunction();

export async function initCar() {
  const gltf = await asyncGLTFLoader(`./cars/${selectedCar.current.glb}/model.glb`);
  const texture = new THREE.TextureLoader().load(`./cars/${selectedCar.current.glb}/texture.png`);
  texture.flipY = false;

  car.current = new THREE.Mesh(
    gltf.geometry,
    new THREE.MeshStandardMaterial({ roughness: 0, metalness: 0.2, map: texture })
  );

  // Create box collision shape matching car dimensions
  const { width, height, length } = selectedCar.current;
  const halfExtents = new Ammo.btVector3(width / 2, height / 2, length / 2);
  const shape = new Ammo.btBoxShape(halfExtents);

  // Create visual hitbox (optional, for debugging)
  const hitboxMaterial = createObjectMaterial();
  hitboxMaterial.opacity = 0.5;
  hitboxMaterial.transparent = true;
  const hitbox = new THREE.Mesh(new THREE.BoxGeometry(width, height, length), hitboxMaterial);
  hitbox.position.set(0, 0, 0);
  hitbox.visible = renderHitCarBox.current;
  car.current.add(hitbox);
  renderHitCarBox.listeners.push(value => {
    hitbox.visible = value;
  });

  const mass = selectedCar.current.mass / 100;
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

  addOnRenderListener('updateCar', updateCar);

  carCleanUp.addCleanupFunction(() => {
    physicsWorld.current?.removeRigidBody(body);
    scene.current?.remove(car.current!);
    car.current = null;
    onRender.current = onRender.current.filter(f => f[1] !== updateCar);
  });

  carVisible.listeners.push(() => {
    sound.current.setVolume(carVisible.current ? 1 : 0);
    soundOff.current.setVolume(carVisible.current ? 0 : 1);
  });
}

export function createObjectMaterial() {
  const c = Math.floor(Math.random() * (1 << 24));
  return new THREE.MeshStandardMaterial({ color: c, roughness: 0, metalness: 0.2 });
}
