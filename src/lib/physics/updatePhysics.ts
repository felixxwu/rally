import AmmoType from 'ammojs-typed';
import { ammoVehicle, transformAux1 } from '../../refs';
import { getUserData } from '../utils/userData';
import { Mesh } from '../../types';
import { THREE } from '../utils/THREE';
declare const Ammo: typeof AmmoType;

const recentPos: THREE.Vector3[] = [];
const numRecentPos = 10;

export function updatePhysics(objThree: Mesh) {
  const objPhys = getUserData(objThree).physicsBody;
  const ms = objPhys.getMotionState();
  if (ms) {
    ms.getWorldTransform(transformAux1.current!);
    const tm = ammoVehicle.current!.getChassisWorldTransform();
    const p = tm.getOrigin();
    const q = tm.getRotation();
    const pVec = new THREE.Vector3(p.x(), p.y(), p.z());
    const quat = new THREE.Quaternion(q?.x() ?? 0, q?.y() ?? 0, q?.z() ?? 0, q?.w() ?? 0);

    recentPos.push(pVec);
    if (recentPos.length > numRecentPos) recentPos.shift();
    const avgRecentPos = recentPos
      .reduce((acc, vec) => acc.add(vec), new THREE.Vector3())
      .divideScalar(recentPos.length);

    objThree.position.copy(avgRecentPos);
    objThree.quaternion.copy(quat);
  }
}
