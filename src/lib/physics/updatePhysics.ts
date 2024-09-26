import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;
import { camFollowSpeed, transformAux1 } from '../../refs';
import { getUserData } from '../utils/userData';
import { Mesh } from '../../types';
import { THREE } from '../utils/THREE';

// const lastXPos: AmmoType.btVector3[] = [];

export function updatePhysics(objThree: Mesh) {
  const objPhys = getUserData(objThree).physicsBody;
  const ms = objPhys.getMotionState();
  if (ms && transformAux1.current) {
    ms.getWorldTransform(transformAux1.current);
    const p = transformAux1.current?.getOrigin();
    const q = transformAux1.current?.getRotation();

    // lastXPos.push(new Ammo.btVector3(p.x(), p.y(), p.z()));
    // if (lastXPos.length > 10) lastXPos.shift();
    // const avgPos = lastXPos
    //   .reduce(
    //     (acc, pos) => acc.op_add(pos),

    //     new Ammo.btVector3(0, 0, 0)
    //   )
    //   .op_mul(1 / lastXPos.length);

    const pVec = new THREE.Vector3(p.x(), p.y(), p.z());
    objThree.position.lerp(pVec, camFollowSpeed.current);
    objThree.quaternion.set(q?.x() ?? 0, q?.y() ?? 0, q?.z() ?? 0, q?.w() ?? 0);
  }
}
