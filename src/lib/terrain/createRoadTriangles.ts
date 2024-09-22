import { helperArrow } from '../helperArrows/helperArrow';
import { createArr, createVec } from '../utils/createVec';
import { THREE } from '../utils/THREE';
import { Triangle, Vector } from './createShape';

const roadWidth = 15;

export function createRoadTriangles(vecs: Vector[]) {
  const triangles: Triangle[] = [];

  for (let i = 0; i < vecs.length; i++) {
    const leftHandedTriangle = i % 2 === 0;

    if (i < 2 || i >= vecs.length - 2) continue;

    const { left: prevLeft, right: prevRight } = getSideVecs(vecs, i - 1);
    const { left, right } = getSideVecs(vecs, i);
    const { left: nextLeft, right: nextRight } = getSideVecs(vecs, i + 1);

    const p0 = leftHandedTriangle ? prevRight : prevLeft;
    const p1 = leftHandedTriangle ? left : right;
    const p2 = leftHandedTriangle ? nextRight : nextLeft;
    if (leftHandedTriangle) {
      triangles.push([createArr(p1), createArr(p0), createArr(p2)]);
    } else {
      triangles.push([createArr(p0), createArr(p1), createArr(p2)]);
    }
  }

  return triangles;
}

function getSideVecs(vecs: Vector[], i: number) {
  const vec = createVec(vecs[i]);
  const prev = createVec(vecs[i - 1]);
  const next = createVec(vecs[i + 1]);
  const diff = next.clone().sub(prev);

  const leftQuat = new THREE.Quaternion();
  leftQuat.setFromAxisAngle(createVec([0, 1, 0]), Math.PI / 2);
  const rightQuat = new THREE.Quaternion();
  rightQuat.setFromAxisAngle(createVec([0, 1, 0]), Math.PI / -2);

  const projectedLeft = diff
    .clone()
    .projectOnPlane(createVec([0, 1, 0]))
    .applyQuaternion(leftQuat)
    .setLength(roadWidth);
  const projectedRight = diff
    .clone()
    .projectOnPlane(createVec([0, 1, 0]))
    .applyQuaternion(rightQuat)
    .setLength(roadWidth);

  return {
    left: vec.clone().add(projectedLeft),
    right: vec.clone().add(projectedRight),
  };
}
