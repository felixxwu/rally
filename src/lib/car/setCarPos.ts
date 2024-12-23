import AmmoType from 'ammojs-typed';
import { car, platformMesh, roadMesh, startRoadLength } from '../../refs';
import { add } from '../utils/addVec';
import { getSpawn } from '../utils/getSpawn';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';
import { vec3 } from '../utils/createVec';
import { getAmmoVector } from '../utils/vectorConversion';
import { createQuat } from '../utils/createQuat';
declare const Ammo: typeof AmmoType;

export const platFormCarPos = vec3([0, 1.5, 0]);

export function setCarPos(pos: THREE.Vector3, dir: THREE.Vector3) {
  if (!car.current) return;

  const objPhys = getUserData(car.current).physicsBody;
  const { ammoQuat } = createQuat(vec3([0, 0, 1]), dir.clone().normalize());
  const ammoTransform = new Ammo.btTransform();

  ammoTransform.setOrigin(getAmmoVector(pos));
  ammoTransform.setRotation(ammoQuat);
  objPhys.setWorldTransform(ammoTransform);
  objPhys.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
}

export function resetCar() {
  const spawn = getSpawn();
  const raycaster = new THREE.Raycaster(
    new THREE.Vector3(spawn.x, 1000, spawn.z + startRoadLength),
    new THREE.Vector3(0, -1, 0)
  );
  const intersections = raycaster.intersectObjects([
    ...(roadMesh.current ? [roadMesh.current] : []),
    ...(platformMesh.current ? [platformMesh.current] : []),
  ]);
  const intersection = intersections[0];
  const ammoPos = add(intersection.point, [0, 5, 0]);

  setCarPos(ammoPos, vec3([0, 0, 1]));
}
