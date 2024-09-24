import { infoText } from '../UI/info';
import { createArr, createVec } from '../utils/createVec';
import { ray } from '../utils/ray';
import { THREE } from '../utils/THREE';
import { Triangle, Vector } from './createRoadShape';

const halfRoadWidth = 6;
const grassWidth = 6;

export async function createRoadTriangles(vecs: Vector[], skipGrass?: boolean) {
  const road: Triangle[] = [];
  const grassLeft: Triangle[] = [];
  const grassRight: Triangle[] = [];

  for (let i = 0; i < vecs.length; i++) {
    const leftHandedTriangle = i % 2 === 0;

    if (i < 2 || i >= vecs.length - 2) continue;

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
    } else {
      road.push([createArr(prevLeft), createArr(right), createArr(nextLeft)]);
    }

    if (!skipGrass) {
      if (i % 100 === 0) {
        infoText.current = `Creating Road Mesh... ${Math.round((i / vecs.length) * 100)}%`;
        await new Promise(r => setTimeout(r));
      }

      const leftBanking = getBankingPoint(vecs, i, leftGrass, -0.3, -0.1);
      const prevLeftBanking = getBankingPoint(vecs, i - 1, prevLeftGrass, -0.3, -0.1);
      const nextLeftBanking = getBankingPoint(vecs, i + 1, nextLeftGrass, -0.3, -0.1);
      const rightBanking = getBankingPoint(vecs, i, rightGrass, 0.3, 0.1);
      const prevRightBanking = getBankingPoint(vecs, i - 1, prevRightGrass, 0.3, 0.1);
      const nextRightBanking = getBankingPoint(vecs, i + 1, nextRightGrass, 0.3, 0.1);

      if (leftHandedTriangle) {
        grassLeft.push([createArr(nextLeftGrass), createArr(prevLeftGrass), createArr(left)]);
        leftBanking &&
          grassLeft.push([
            createArr(leftBanking),
            createArr(prevLeftGrass),
            createArr(nextLeftGrass),
          ]);
        grassRight.push([createArr(prevRight), createArr(rightGrass), createArr(nextRight)]);
        prevRightBanking &&
          nextRightBanking &&
          grassRight.push([
            createArr(prevRightBanking),
            createArr(nextRightBanking),
            createArr(rightGrass),
          ]);
      } else {
        grassLeft.push([createArr(prevLeft), createArr(nextLeft), createArr(leftGrass)]);
        nextLeftBanking &&
          prevLeftBanking &&
          grassLeft.push([
            createArr(nextLeftBanking),
            createArr(prevLeftBanking),
            createArr(leftGrass),
          ]);
        grassRight.push([createArr(right), createArr(prevRightGrass), createArr(nextRightGrass)]);
        rightBanking &&
          grassRight.push([
            createArr(nextRightGrass),
            createArr(prevRightGrass),
            createArr(rightBanking),
          ]);
      }
    }
  }

  return { road, grassLeft, grassRight };
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

let j = 0;

function getBankingPoint(
  vecs: Vector[],
  i: number,
  grassSide: THREE.Vector3,
  angle: number,
  increment: number,
  depth = 0
) {
  const upIntersection = ray(
    grassSide.clone().add(new THREE.Vector3(0, 10, 0)),
    new THREE.Vector3(0, -1, 0),
    0,
    50
  );

  if (upIntersection && upIntersection.point.y > grassSide.y) {
    return null;
  }

  if (Math.abs(angle) > Math.PI / 2) return null;

  const vec = createVec(vecs[i]);
  const sideDir = grassSide.clone().sub(vec).normalize();
  const prev = createVec(vecs[i - 1]);
  const next = createVec(vecs[i + 1]);
  const diff = next.clone().sub(prev);
  const quat = new THREE.Quaternion();
  quat.setFromAxisAngle(diff.clone().normalize(), angle);

  const rotated = sideDir.clone().applyQuaternion(quat);
  const intersection = ray(grassSide, rotated, 0, 50);

  if (!intersection) {
    return getBankingPoint(vecs, i, grassSide, angle + increment, increment, depth + 1);
  }

  return intersection.point;
}
