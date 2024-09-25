import {
  bankingAngleStart,
  bankingAngleStep,
  startRoadLength,
  startRoadWidth,
  halfRoadWidth,
  grassWidth,
  maxBankingLength,
} from '../../refs';
import { createNoiseFunc } from '../terrain/createNoiseFunc';
import { infoText } from '../UI/info';
import { createArr, createVec } from '../utils/createVec';
import { ray } from '../utils/ray';
import { THREE } from '../utils/THREE';
import { Triangle, Vector } from './createRoadShape';

export async function createRoadTriangles(vecs: Vector[], skipGrass?: boolean) {
  const road: Triangle[] = [];
  const grassLeft: Triangle[] = [];
  const grassRight: Triangle[] = [];

  for (let i = 0; i < vecs.length; i++) {
    const leftHandedTriangle = i % 2 === 0;

    if (i < 2 || i >= vecs.length - 2) continue;

    const { left, right, leftGrass, rightGrass } = getSideVecs(vecs, i, skipGrass);
    const {
      left: prevLeft,
      right: prevRight,
      leftGrass: prevLeftGrass,
      rightGrass: prevRightGrass,
    } = getSideVecs(vecs, i - 1, skipGrass);
    const {
      left: nextLeft,
      right: nextRight,
      leftGrass: nextLeftGrass,
      rightGrass: nextRightGrass,
    } = getSideVecs(vecs, i + 1, skipGrass);

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

      const leftBanking = getBankingPoint(
        vecs,
        i,
        leftGrass,
        -bankingAngleStart,
        -bankingAngleStep
      );
      const prevLeftBanking = getBankingPoint(
        vecs,
        i - 1,
        prevLeftGrass,
        -bankingAngleStart,
        -bankingAngleStep
      );
      const nextLeftBanking = getBankingPoint(
        vecs,
        i + 1,
        nextLeftGrass,
        -bankingAngleStart,
        -bankingAngleStep
      );
      const rightBanking = getBankingPoint(
        vecs,
        i,
        rightGrass,
        bankingAngleStart,
        bankingAngleStep
      );
      const prevRightBanking = getBankingPoint(
        vecs,
        i - 1,
        prevRightGrass,
        bankingAngleStart,
        bankingAngleStep
      );
      const nextRightBanking = getBankingPoint(
        vecs,
        i + 1,
        nextRightGrass,
        bankingAngleStart,
        bankingAngleStep
      );

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

function getSideVecs(vecs: Vector[], i: number, skipGrass?: boolean) {
  const vec = createVec(vecs[i]);
  const prev = createVec(vecs[i - 1]);
  const next = createVec(vecs[i + 1]);
  const diff = next.clone().sub(prev);

  const leftQuat = new THREE.Quaternion();
  leftQuat.setFromAxisAngle(createVec([0, 1, 0]), Math.PI / 2);
  const rightQuat = new THREE.Quaternion();
  rightQuat.setFromAxisAngle(createVec([0, 1, 0]), Math.PI / -2);

  const roadWidth =
    i < startRoadLength || i >= vecs.length - startRoadLength ? startRoadWidth : halfRoadWidth;

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

  const left = vec.clone().add(projectedLeft);
  const right = vec.clone().add(projectedRight);

  if (skipGrass) {
    return {
      left,
      right,
      leftGrass: left,
      rightGrass: right,
    };
  }

  const noise = createNoiseFunc();
  const noiseScale = 0.1;
  const leftGrass = vec.clone().add(projectedLeft.clone().setLength(grassWidth + roadWidth));
  const rightGrass = vec.clone().add(projectedRight.clone().setLength(grassWidth + roadWidth));
  const leftNoise = noise(leftGrass.x * noiseScale, leftGrass.z * noiseScale) * 2 - 1;
  const rightNoise = noise(rightGrass.x * noiseScale, rightGrass.z * noiseScale) * 2 - 1;
  leftGrass.add(new THREE.Vector3(0, leftNoise, 0));
  rightGrass.add(new THREE.Vector3(0, rightNoise, 0));

  return {
    left,
    leftGrass,
    right,
    rightGrass,
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
    maxBankingLength
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
  const intersection = ray(grassSide, rotated, 0, maxBankingLength);

  if (!intersection) {
    return getBankingPoint(vecs, i, grassSide, angle + increment, increment, depth + 1);
  }

  return intersection.point;
}
