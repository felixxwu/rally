import { createArr, createVec } from '../utils/createVec';
import { THREE } from '../utils/THREE';
import { Triangle, Vector } from './createRoadShape';

const halfRoadWidth = 6;
const grassWidth = 6;

export function createRoadTriangles(vecs: Vector[]) {
  const road: Triangle[] = [];
  const grassLeft: Triangle[] = [];
  const grassRight: Triangle[] = [];

  for (let i = 0; i < vecs.length; i++) {
    const leftHandedTriangle = i % 2 === 0;

    if (i < 2 || i >= vecs.length - 2) continue;

    const vec = createVec(vecs[i]);
    const prevVec = createVec(vecs[i - 1]);
    const nextVec = createVec(vecs[i + 1]);

    const { left, right, leftGrass, rightGrass } = getSideVecs(vecs, i);
    const {
      left: prevLeft,
      right: prevRight,
      leftGrass: prevLeftGrass,
      rightGrass: prevRightGrass,
    } = getSideVecs(vecs, i - 1);
    const {
      left: nextLeft,
      right: nextRight,
      leftGrass: nextLeftGrass,
      rightGrass: nextRightGrass,
    } = getSideVecs(vecs, i + 1);

    if (leftHandedTriangle) {
      road.push([createArr(left), createArr(prevRight), createArr(nextRight)]);
      grassLeft.push([createArr(nextLeftGrass), createArr(prevLeftGrass), createArr(left)]);
      grassRight.push([createArr(prevRight), createArr(rightGrass), createArr(nextRight)]);
    } else {
      road.push([createArr(prevLeft), createArr(right), createArr(nextLeft)]);
      grassLeft.push([createArr(prevLeft), createArr(nextLeft), createArr(leftGrass)]);
      grassRight.push([createArr(right), createArr(prevRightGrass), createArr(nextRightGrass)]);
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

  return { road, grassLeft, grassRight };
}

// function getGrassTriangles

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
    .setLength(halfRoadWidth);
  const projectedRight = diff
    .clone()
    .projectOnPlane(createVec([0, 1, 0]))
    .applyQuaternion(rightQuat)
    .setLength(halfRoadWidth);

  return {
    left: vec.clone().add(projectedLeft),
    leftGrass: vec.clone().add(projectedLeft.clone().setLength(grassWidth + halfRoadWidth)),
    right: vec.clone().add(projectedRight),
    rightGrass: vec.clone().add(projectedRight.clone().setLength(grassWidth + halfRoadWidth)),
  };
}
