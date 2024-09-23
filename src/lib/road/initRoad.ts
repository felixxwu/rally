import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  physicsWorld,
  roadMesh,
  scene,
  terrainDepth,
  terrainMaxHeight,
  terrainMinHeight,
  terrainWidth,
  terrainWidthExtents,
} from '../../refs';
import { createRoadShape, Triangle, Vector } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';
import { createNoiseFunc } from '../terrain/generateHeight';

export function initRoad() {
  const vecs = [...Array(10000)].map(
    (_, i) =>
      [Math.sin(i * 0.05) * 40 - 20, Math.sin(i * 0.02) * 20 - 3 + i * 0.1, i * 2 + 50] as Vector
  );

  // const vecs = [] as Vector[];
  // const point = { x: 0, z: 0 };
  // const noise = createNoiseFunc(3, 8);
  // const hRange = terrainMaxHeight - terrainMinHeight;

  // for (let i = 0; i < terrainWidth; i += 0.02) {
  //   const [x, z] = toWorldPos(i, Math.sin(i / 4) * (terrainWidth / 2) + terrainWidth / 2);
  //   const height =
  //     Math.pow(noise(i, Math.sin(i / 4) * (terrainWidth / 2) + terrainWidth / 2), 2) * hRange +
  //     terrainMinHeight;
  //   vecs.push([x, height + 5, z] as Vector);
  // }

  const triangles = createRoadTriangles(vecs);

  const { rigidBody, mesh } = createRoadShape(triangles);
  scene.current?.add(mesh);
  roadMesh.current = mesh;
  physicsWorld.current?.addRigidBody(rigidBody);
}

function toWorldPos(x: number, z: number) {
  const mult = terrainWidthExtents / terrainWidth;
  return [(terrainWidth / 2 - x - 1) * -mult, (terrainWidth / 2 - z) * -mult];
}
