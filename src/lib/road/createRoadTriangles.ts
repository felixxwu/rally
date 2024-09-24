import { createArr, createVec } from '../utils/createVec';
import { THREE } from '../utils/THREE';
import { Triangle, Vector } from './createRoadShape';

const roadWidth = 10;

export function createRoadTriangles(vecs: Vector[]) {
  const triangles: Triangle[] = [];

  for (let i = 0; i < vecs.length; i++) {
    const leftHandedTriangle = i % 2 === 0;

    if (i < 2 || i >= vecs.length - 2) continue;

    const prevVec = createVec(vecs[i - 1]);
    const { left: prevLeft, right: prevRight } = getSideVecs(vecs, i - 1);
    const vec = createVec(vecs[i]);
    const { left, right } = getSideVecs(vecs, i);
    const nextVec = createVec(vecs[i + 1]);
    const { left: nextLeft, right: nextRight } = getSideVecs(vecs, i + 1);

    if (leftHandedTriangle) {
      triangles.push([createArr(left), createArr(prevRight), createArr(nextRight)]);
    } else {
      triangles.push([createArr(prevLeft), createArr(right), createArr(nextLeft)]);
    }

    // if (leftHandedTriangle) {
    //   triangles.push([createArr(nextLeft), createArr(prevLeft), createArr(vec)]);
    //   triangles.push([createArr(prevRight), createArr(nextRight), createArr(vec)]);
    // } else {
    //   triangles.push([createArr(left), createArr(prevVec), createArr(nextVec)]);
    //   triangles.push([createArr(right), createArr(nextVec), createArr(prevVec)]);
    // }

    // triangles.push([createArr(prevLeft), createArr(prevVec), createArr(vec)]);
    // triangles.push([createArr(prevLeft), createArr(vec), createArr(left)]);
    // triangles.push([createArr(prevRight), createArr(vec), createArr(prevVec)]);
    // triangles.push([createArr(prevRight), createArr(right), createArr(vec)]);
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
