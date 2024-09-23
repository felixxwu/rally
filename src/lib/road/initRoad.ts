import AmmoType from 'ammojs-typed';
declare const Ammo: typeof AmmoType;

import {
  physicsWorld,
  roadMesh,
  scene,
  terrainDepth,
  terrainMaxHeight,
  terrainMesh,
  terrainMinHeight,
  terrainWidth,
  terrainWidthExtents,
} from '../../refs';
import { createRoadShape, Triangle, Vector } from './createRoadShape';
import { createRoadTriangles } from './createRoadTriangles';
import { createNoiseFunc } from '../terrain/generateHeight';
import { THREE } from '../utils/THREE';
import { add } from '../utils/addVec';

export function initRoad() {
  // const vecs = [...Array(10000)].map(
  //   (_, i) =>
  //     [Math.sin(i * 0.05) * 40 - 20, Math.sin(i * 0.02) * 20 - 3 + i * 0.1, i * 2 + 50] as Vector
  // );

  const vecs: Vector[] = [];
  const point = { x: 0, z: 0 };
  const roadDir = new THREE.Vector3(0, 0, 1);
  const noise = createNoiseFunc(3, 8);
  const hRange = terrainMaxHeight - terrainMinHeight;

  // for (let i = 0; i < terrainWidth; i += 0.02) {
  //   const [x, z] = toWorldPos(i, Math.sin(i / 4) * (terrainWidth / 2) + terrainWidth / 2);
  //   const height =
  //     Math.pow(noise(i, Math.sin(i / 4) * (terrainWidth / 2) + terrainWidth / 2), 2) * hRange +
  //     terrainMinHeight;
  //   vecs.push([x, height + 5, z] as Vector);
  // }

  for (let i = 0; i < 1000; i++) {
    const raycaster = new THREE.Raycaster(
      new THREE.Vector3(point.x, 100, point.z),
      new THREE.Vector3(0, -1, 0)
    );
    const intersections = raycaster.intersectObject(terrainMesh.current!);
    if (intersections.length === 0) continue;
    const intersection = intersections[0].point;
    const newPoint = add(intersection, [0, 1, 0]);
    vecs.push([newPoint.x, newPoint.y, newPoint.z] as Vector);

    point.x += roadDir.x * 2;
    point.z += roadDir.z * 2;
  }

  const blurredVecs: Vector[] = [];

  // generalised version
  const numNeightbors = 20;
  const half = Math.floor(numNeightbors / 2);
  for (let i = half; i < vecs.length - half; i++) {
    const neighbors = vecs.slice(i - half, i + half + 1);
    const avgY = neighbors.reduce((acc, v) => acc + v[1], 0) / neighbors.length;
    blurredVecs.push([neighbors[half][0], avgY, neighbors[half][2]] as Vector);
  }

  const triangles = createRoadTriangles(blurredVecs);

  const { rigidBody, mesh } = createRoadShape(triangles);
  scene.current?.add(mesh);
  roadMesh.current = mesh;
  physicsWorld.current?.addRigidBody(rigidBody);
}

function toWorldPos(x: number, z: number) {
  const mult = terrainWidthExtents / terrainWidth;
  return [(terrainWidth / 2 - x - 1) * -mult, (terrainWidth / 2 - z) * -mult];
}
