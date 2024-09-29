import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;
import { transformAux1 } from '../../refs';
import { getUserData } from '../utils/userData';
import { Mesh } from '../../types';
import { THREE } from '../utils/THREE';

const lastXPos: THREE.Vector3[] = [];
const numLastXPos = 20;

export function updatePhysics(objThree: Mesh) {
  const objPhys = getUserData(objThree).physicsBody;
  const ms = objPhys.getMotionState();
  if (ms && transformAux1.current) {
    ms.getWorldTransform(transformAux1.current);
    const p = transformAux1.current?.getOrigin();
    const q = transformAux1.current?.getRotation();
    const pVec = new THREE.Vector3(p.x(), p.y(), p.z());
    const quat = new THREE.Quaternion(q?.x() ?? 0, q?.y() ?? 0, q?.z() ?? 0, q?.w() ?? 0);

    lastXPos.push(pVec);
    if (lastXPos.length > numLastXPos) lastXPos.shift();
    const avgXPos = lastXPos
      .reduce((acc, vec) => acc.add(vec), new THREE.Vector3())
      .divideScalar(lastXPos.length);

    objThree.position.copy(avgXPos);
    objThree.quaternion.slerp(quat, 0.2);
  }
}
