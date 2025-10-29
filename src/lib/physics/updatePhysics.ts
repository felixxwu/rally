import { transformAux1 } from '../../refs';
import { getUserData } from '../utils/userData';
import { Mesh } from '../../types';
import { THREE } from '../utils/THREE';

const recentPos: THREE.Vector3[] = [];
const numRecentPos = 1;

// Reusable objects to avoid allocations
const pVecCache = new THREE.Vector3();
const quatCache = new THREE.Quaternion();

export function updatePhysics(objThree: Mesh) {
  const objPhys = getUserData(objThree).physicsBody;
  const ms = objPhys.getMotionState();
  if (ms && transformAux1.current) {
    ms.getWorldTransform(transformAux1.current);
    const p = transformAux1.current?.getOrigin();
    const q = transformAux1.current?.getRotation();

    // Reuse cached objects instead of creating new ones
    pVecCache.set(p.x(), p.y(), p.z());
    quatCache.set(q?.x() ?? 0, q?.y() ?? 0, q?.z() ?? 0, q?.w() ?? 0);

    // recentPos.push(pVec);
    // if (recentPos.length > numRecentPos) recentPos.shift();
    // const avgRecentPos = recentPos
    //   .reduce((acc, vec) => acc.add(vec), new THREE.Vector3())
    //   .divideScalar(recentPos.length);
    // objThree.position.copy(avgRecentPos);

    objThree.position.copy(pVecCache);
    objThree.quaternion.copy(quatCache);
  }
}
