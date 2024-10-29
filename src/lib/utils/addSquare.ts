import AmmoType from 'ammojs-typed';
import { Vector } from '../road/createRoadShape';
import { vecAmmo } from './createVec';
declare const Ammo: typeof AmmoType;

export function addSquare(
  triangleMesh: AmmoType.btTriangleMesh,
  topLeft: Vector,
  topRight: Vector,
  bottomRight: Vector,
  bottomLeft: Vector
) {
  triangleMesh.addTriangle(vecAmmo(topLeft), vecAmmo(topRight), vecAmmo(bottomLeft));
  triangleMesh.addTriangle(vecAmmo(bottomLeft), vecAmmo(topRight), vecAmmo(bottomRight));
}
