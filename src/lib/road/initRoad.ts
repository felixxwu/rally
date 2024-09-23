import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import { physicsWorld, roadMesh, scene } from '../../refs';
import { createRoadShape, Triangle, Vector } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';

export function initRoad() {
  const vecs = [...Array(10000)].map(
    (_, i) => [Math.sin(i * 0.03) * 40, Math.sin(i * 0.02) * 10 - 3 + i * 0.1, i + 50] as Vector
  );

  const triangles = createRoadTriangles(vecs);

  const { rigidBody, mesh } = createRoadShape(triangles);
  scene.current?.add(mesh);
  roadMesh.current = mesh;
  physicsWorld.current?.addRigidBody(rigidBody);
}
