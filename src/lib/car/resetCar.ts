import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;
import { car, roadMesh, startRoadLength } from '../../refs';
import { add } from '../utils/addVec';
import { getSpawn } from '../utils/getSpawn';
import { THREE } from '../utils/THREE';
import { getUserData } from '../utils/userData';

export function resetCar() {
  const spawn = getSpawn();

  if (!car.current || !roadMesh.current) return;

  const objPhys = getUserData(car.current).physicsBody;

  const raycaster = new THREE.Raycaster(
    new THREE.Vector3(spawn.x, 1000, spawn.z + startRoadLength),
    new THREE.Vector3(0, -1, 0)
  );
  const intersections = raycaster.intersectObject(roadMesh.current!);
  const intersection = intersections[0];
  car.current.position.copy(add(intersection.point, [0, 3, 0]));

  const ammoTransform = new Ammo.btTransform();
  ammoTransform.setOrigin(
    new Ammo.btVector3(car.current.position.x, car.current.position.y, car.current.position.z)
  );
  ammoTransform.setRotation(new Ammo.btQuaternion(0, 0, 0, 1));
  objPhys.setWorldTransform(ammoTransform);
  objPhys.setLinearVelocity(new Ammo.btVector3(0, 0, 0));
}
