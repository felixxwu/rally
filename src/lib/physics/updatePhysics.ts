import { transformAux1 } from '../../refs';
import { getUserData } from '../utils/userData';
import { Mesh } from '../../types';
import { THREE } from '../utils/THREE';

const recentPos: THREE.Vector3[] = [];
const numRecentPos = 15;

export function updatePhysics(objThree: Mesh) {
  const objPhys = getUserData(objThree).physicsBody;
  const ms = objPhys.getMotionState();
  if (ms && transformAux1.current) {
    ms.getWorldTransform(transformAux1.current);
    const p = transformAux1.current?.getOrigin();
    const q = transformAux1.current?.getRotation();
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
