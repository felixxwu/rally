import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  car,
  oldCarPosition,
  roadMesh,
  terrainDepthExtents,
  terrainWidthExtents,
} from '../../refs';
import { terrainMesh } from '../../refs';
import { THREE } from '../utils/THREE';
import { springDamping } from '../../refs';
import { sprintRate } from '../../refs';
import { springLength } from '../../refs';
import { Ref } from '../utils/ref';
import { getUserData } from '../utils/userData';
import { getCarDirection } from '../car/getCarDirection';

export function getSpringForce(
  pos: THREE.Vector3,
  prevDistance: Ref<number>
): [THREE.Vector3, number] {
  if (!terrainMesh.current || !car.current || !roadMesh.current) return [new THREE.Vector3(), 0];

  const raycaster = new THREE.Raycaster(pos, new THREE.Vector3(0, -1, 0));
  const terrainIntersections = raycaster.intersectObject(terrainMesh.current, false);
  const roadIntersections = raycaster.intersectObject(roadMesh.current, false);
  const terrainDistance = terrainIntersections[0]?.distance;
  const roadDistance = roadIntersections[0]?.distance;

  const distance = Math.min(terrainDistance ?? Infinity, roadDistance ?? Infinity);

  if (distance === Infinity) {
    const dir = getCarDirection();
    const transform = new Ammo.btTransform();
    const x = pos.x > terrainWidthExtents / 2 || pos.x < -terrainWidthExtents / 2 ? 0 : pos.x;
    const z = pos.z > terrainDepthExtents / 2 || pos.z < -terrainDepthExtents / 2 ? 0 : pos.z;
    oldCarPosition.current = null;
    transform.setOrigin(new Ammo.btVector3(x, pos.y + 5, z));
    const quat = new Ammo.btQuaternion(0, 0, 0, 1);
    const angle = Math.atan2(dir.x, dir.z);
    quat.setRotation(new Ammo.btVector3(0, 1, 0), angle);
    transform.setRotation(quat);
    getUserData(car.current)?.physicsBody?.setWorldTransform(transform);
    getUserData(car.current)?.physicsBody?.setLinearVelocity(new Ammo.btVector3(0, 0, 0));

    return [new THREE.Vector3(0, 0, 0), 0];
  }

  const normal = terrainIntersections[0]?.normal || new THREE.Vector3(0, 1, 0);

  const compression = springLength.current - Math.min(springLength.current, distance);

  if (distance < springLength.current) {
    const distanceDelta = distance - prevDistance.current;
    const velY = distanceDelta * springDamping.current;
    const damping = Math.max(0, -velY);
    const spring = compression * sprintRate.current;
    prevDistance.current = distance;
    const upForce = normal.setLength(damping + spring);

    return [upForce, compression];
  } else {
    return [new THREE.Vector3(0, 0, 0), 0];
  }
}
